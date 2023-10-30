"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
let ChannelsService = class ChannelsService {
    constructor(prisma, userService) {
        this.prisma = prisma;
        this.userService = userService;
    }
    async hashPassword(password) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    }
    async verifyPassword(plainTextPassword, hashedPassword) {
        return bcrypt.compare(plainTextPassword, hashedPassword);
    }
    async getPublicChannels() {
        try {
            const channels = await this.prisma.channel.findMany({
                where: {
                    visibility: 'public'
                }
            });
            return channels;
        }
        catch (error) {
            console.error('we have no public channels', error);
        }
    }
    async getProtectedChannels() {
        try {
            const channels = await this.prisma.channel.findMany({
                where: {
                    visibility: 'protected'
                }
            });
            return channels;
        }
        catch (error) {
            console.error('we have no protected channels', error);
        }
    }
    async createChannel(data, userId) {
        try {
            if (data.password) {
                const hashedPassword = await this.hashPassword(data.password);
                data.password = hashedPassword;
            }
            const channel = await this.prisma.channel.create({
                data: {
                    name: data.title,
                    visibility: data.type,
                    password: data.password
                },
            });
            const memberchannel = await this.prisma.memberChannel.create({
                data: {
                    userId: userId,
                    channelId: channel.id_channel,
                    status_UserInChannel: 'owner',
                },
            });
            for (let i = 0; i < data.members.length; i++) {
                try {
                    let idMbr = await this.userService.findByName(data.members[i]);
                    const memberchannel = await this.prisma.memberChannel.create({
                        data: {
                            userId: idMbr.id_user,
                            channelId: channel.id_channel,
                            status_UserInChannel: 'member',
                        },
                    });
                }
                catch (error) {
                    console.error('Error inserting records of Members in this Channel:', error);
                }
            }
            return true;
        }
        catch (error) {
            console.error('Channel does not created successfully:', error);
        }
    }
    async getChannelByName(nameVar) {
        const channel = await this.prisma.channel.findUnique({
            where: { name: nameVar },
        });
        if (!channel) {
            throw new common_1.NotFoundException(`User with  ${nameVar} not found`);
        }
        return channel;
    }
    async joinChannel(data, usid) {
        console.log("join channel from service");
        let join = 0;
        let pass = "lola123";
        const ch = await this.getChannelByName(data.name);
        console.log("channel is " + ch.name);
        console.log("channel is " + ch.visibility);
        if (ch) {
            if (ch.visibility === "protected") {
                if (this.verifyPassword(data.password, ch.password)) {
                    join = 1;
                }
            }
            if (join == 1 || ch.visibility === "public") {
                try {
                    const memberchannel = await this.prisma.memberChannel.create({
                        data: {
                            userId: usid,
                            channelId: ch.id_channel,
                            status_UserInChannel: 'member',
                        },
                    });
                    return true;
                }
                catch (error) {
                    console.error('duplicate records in memeberchannels:', error);
                }
            }
        }
    }
    async updatePass(data, usid) {
        const ch = await this.getChannelByName(data.name);
        if (ch) {
            const record = await this.prisma.memberChannel.findUnique({
                where: {
                    userId_channelId: {
                        userId: usid,
                        channelId: ch.id_channel,
                    },
                },
            });
            if (record) {
                if (record.status_UserInChannel == "owner") {
                    console.log("Yes I am the owner");
                    if (ch.visibility == "protected") {
                        const updateChannel = await this.prisma.channel.update({
                            where: {
                                id_channel: ch.id_channel,
                            },
                            data: {
                                password: data.newpass,
                            },
                        });
                    }
                }
                else {
                    throw new common_1.NotFoundException(`your not allowed to change the password of ${ch.name}, or the channel is not protected`);
                }
            }
            else {
                throw new common_1.NotFoundException(`the user with id ${usid} is not belong to this channel ${ch.name}`);
            }
        }
        else {
            throw new common_1.NotFoundException(`this Channel with Name ${ch.name} not found`);
        }
    }
    async removePass(data, usid) {
        const ch = await this.getChannelByName(data.name);
        if (ch) {
            const record = await this.prisma.memberChannel.findUnique({
                where: {
                    userId_channelId: {
                        userId: usid,
                        channelId: ch.id_channel,
                    },
                },
            });
            if (record) {
                if (record.status_UserInChannel == "owner") {
                    if (ch.visibility == "protected") {
                        const updateChannel = await this.prisma.channel.update({
                            where: {
                                id_channel: ch.id_channel,
                            },
                            data: {
                                visibility: "public",
                                password: null,
                            },
                        });
                    }
                }
                else {
                    throw new common_1.NotFoundException(`your not allowed to remove the password of ${ch.name}, or the channel is not protected`);
                }
            }
            else {
                throw new common_1.NotFoundException(`the user with id ${usid} is not belong to this channel ${ch.name}`);
            }
        }
        else {
            throw new common_1.NotFoundException(`this Channel with Name ${ch.name} not found`);
        }
    }
    async setPass(data, usid) {
        const ch = await this.getChannelByName(data.name);
        if (ch) {
            const record = await this.prisma.memberChannel.findUnique({
                where: {
                    userId_channelId: {
                        userId: usid,
                        channelId: ch.id_channel,
                    },
                },
            });
            if (record) {
                if (record.status_UserInChannel == "owner") {
                    console.log("Yes I am the owner");
                    if (ch.visibility == "public" || ch.visibility == "privat") {
                        console.log("inside visibility");
                        const updateChannel = await this.prisma.channel.update({
                            where: {
                                id_channel: ch.id_channel,
                            },
                            data: {
                                visibility: "protected",
                                password: data.newpass,
                            },
                        });
                    }
                }
                else {
                    throw new common_1.NotFoundException(`your not allowed to set the password of ${ch.name}, or the channel is already protected`);
                }
            }
            else {
                throw new common_1.NotFoundException(`the user with id ${usid} is not belong to this channel ${ch.name}`);
            }
        }
        else {
            throw new common_1.NotFoundException(`this Channel with Name ${ch.name} not found`);
        }
    }
    async setAdmin(data, usid, upus) {
        const ch = await this.getChannelByName(data.name);
        if (ch) {
            const record = await this.prisma.memberChannel.findUnique({
                where: {
                    userId_channelId: {
                        userId: usid,
                        channelId: ch.id_channel,
                    },
                },
            });
            const record2 = await this.prisma.memberChannel.findUnique({
                where: {
                    userId_channelId: {
                        userId: upus,
                        channelId: ch.id_channel,
                    },
                },
            });
            if (record && record2) {
                if (record.status_UserInChannel === "owner") {
                    const updateChannel = await this.prisma.memberChannel.update({
                        where: {
                            userId_channelId: {
                                userId: upus,
                                channelId: ch.id_channel,
                            },
                        },
                        data: {
                            status_UserInChannel: "admin",
                        },
                    });
                }
                else {
                    throw new common_1.NotFoundException(`your not  the  owner of ${ch.name}`);
                }
            }
            else {
                throw new common_1.NotFoundException(`the user with ${usid} or ${upus} is not belong to this channel ${ch.name}`);
            }
        }
        else {
            throw new common_1.NotFoundException(`this Channel with Name ${ch.name} not found`);
        }
    }
    async kickUser(data, idus, kickcus) {
        const ch = await this.getChannelByName(data.name);
        if (ch) {
            const record = await this.prisma.memberChannel.findUnique({
                where: {
                    userId_channelId: {
                        userId: idus,
                        channelId: ch.id_channel,
                    },
                },
            });
            const record2 = await this.prisma.memberChannel.findUnique({
                where: {
                    userId_channelId: {
                        userId: kickcus,
                        channelId: ch.id_channel,
                    },
                },
            });
            if (record && record2) {
                if (record.status_UserInChannel === "owner" || record.status_UserInChannel === "admin") {
                    if (record2.status_UserInChannel !== "owner" && record2.status_UserInChannel !== "admin") {
                        const updateChannel = await this.prisma.memberChannel.delete({
                            where: {
                                userId_channelId: {
                                    userId: kickcus,
                                    channelId: ch.id_channel,
                                },
                            },
                        });
                        const memberchannel = await this.prisma.channelBan.create({
                            data: {
                                bannedUserId: kickcus,
                                channelId: ch.id_channel,
                                status_User: 'kicked',
                            },
                        });
                    }
                    else {
                        throw new common_1.NotFoundException(`you can't kicked an owner or an admin`);
                    }
                }
                else {
                    throw new common_1.NotFoundException(`your not  the  owner or admin of ${ch.name}`);
                }
            }
            else {
                throw new common_1.NotFoundException(`the user with ${idus} or ${kickcus} is not belong to this channel ${ch.name}`);
            }
        }
        else {
            throw new common_1.NotFoundException(`this Channel with Name ${ch.name} not found`);
        }
    }
    async banUser(data, idus, user_banned) {
        const ch = await this.getChannelByName(data.name);
        if (ch) {
            const record = await this.prisma.memberChannel.findUnique({
                where: {
                    userId_channelId: {
                        userId: idus,
                        channelId: ch.id_channel,
                    },
                },
            });
            const record2 = await this.prisma.memberChannel.findUnique({
                where: {
                    userId_channelId: {
                        userId: user_banned,
                        channelId: ch.id_channel,
                    },
                },
            });
            if (record && record2) {
                if (record.status_UserInChannel === "owner" || record.status_UserInChannel === "admin") {
                    if (record2.status_UserInChannel !== "owner" && record2.status_UserInChannel !== "admin") {
                        const updateChannel = await this.prisma.memberChannel.delete({
                            where: {
                                userId_channelId: {
                                    userId: record2.userId,
                                    channelId: ch.id_channel,
                                },
                            },
                        });
                        const memberchannel = await this.prisma.channelBan.create({
                            data: {
                                bannedUserId: record2.userId,
                                channelId: ch.id_channel,
                                status_User: 'banned',
                            },
                        });
                    }
                    else {
                        throw new common_1.NotFoundException(`you can't banned an owner or an admin`);
                    }
                }
                else {
                    throw new common_1.NotFoundException(`your not  the  owner or admin of ${ch.name}`);
                }
            }
            else {
                throw new common_1.NotFoundException(`the user with ${idus} or ${user_banned} is not belong to this channel ${ch.name}`);
            }
        }
        else {
            throw new common_1.NotFoundException(`this Channel with Name ${ch.name} not found`);
        }
    }
    async muteUser(data, idus, user_muted) {
        const ch = await this.getChannelByName(data.name);
        if (ch) {
            const record = await this.prisma.memberChannel.findUnique({
                where: {
                    userId_channelId: {
                        userId: idus,
                        channelId: ch.id_channel,
                    },
                },
            });
            const record2 = await this.prisma.memberChannel.findUnique({
                where: {
                    userId_channelId: {
                        userId: user_muted,
                        channelId: ch.id_channel,
                    },
                },
            });
            if (record && record2) {
                if (record.status_UserInChannel === "owner" || record.status_UserInChannel === "admin") {
                    if (record2.status_UserInChannel !== "owner" && record2.status_UserInChannel !== "admin") {
                        const updateChannel = await this.prisma.memberChannel.update({
                            where: {
                                userId_channelId: {
                                    userId: record2.userId,
                                    channelId: record2.channelId,
                                },
                            },
                            data: {
                                muted: true,
                                period: data.duration,
                            },
                        });
                    }
                    else {
                        throw new common_1.NotFoundException(`you can't muted an owner or an admin`);
                    }
                }
                else {
                    throw new common_1.NotFoundException(`your not  the  owner or admin of ${ch.name}`);
                }
            }
            else {
                throw new common_1.NotFoundException(`the user with ${idus} or ${user_muted} is not belong to this channel ${ch.name}`);
            }
        }
        else {
            throw new common_1.NotFoundException(`this Channel with Name ${ch.name} not found`);
        }
    }
};
exports.ChannelsService = ChannelsService;
exports.ChannelsService = ChannelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, users_service_1.UsersService])
], ChannelsService);
//# sourceMappingURL=channel.service.js.map