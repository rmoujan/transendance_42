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
            const publicChannelsWithUsers = await this.prisma.channel.findMany({
                where: {
                    visibility: 'public',
                },
                include: {
                    users: {
                        include: {
                            user: true,
                        },
                    },
                },
            });
            return publicChannelsWithUsers;
        }
        catch (error) {
            throw new common_1.NotFoundException(`we have no public channels`);
        }
    }
    async getProtectedChannels() {
        try {
            const protectedChannelsWithUsers = await this.prisma.channel.findMany({
                where: {
                    visibility: 'protected',
                },
                include: {
                    users: {
                        include: {
                            user: true,
                        },
                    },
                },
            });
            return protectedChannelsWithUsers;
        }
        catch (error) {
            throw new common_1.NotFoundException(`we have no protected channels`);
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
                    password: data.password,
                    img: data.avatar
                },
            });
            const memberchannel = await this.prisma.memberChannel.create({
                data: {
                    userId: userId,
                    channelId: channel.id_channel,
                    status_UserInChannel: 'owner',
                    muted: false,
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
                            muted: false,
                        },
                    });
                }
                catch (error) {
                    throw new common_1.NotFoundException(`Error inserting records of Members in this Channel`);
                }
            }
            return (true);
        }
        catch (error) {
            throw new common_1.NotFoundException(`Channel does not created successfully`);
        }
    }
    async getChannelByName(nameVar) {
        try {
            const channel = await this.prisma.channel.findUnique({
                where: { name: nameVar },
            });
            if (!channel) {
                throw new common_1.NotFoundException(`channel with  ${nameVar} not found`);
            }
            return channel;
        }
        catch (error) {
            throw new common_1.NotFoundException(`Channel does not created successfully`);
        }
    }
    async joinChannel(data, usid) {
        try {
            let join = 0;
            const ch = await this.getChannelByName(data.sendData.name);
            const cheak = await this.prisma.saveBanned.findFirst({
                where: {
                    bannedUserId: usid,
                    channelId: ch.id_channel,
                    status_User: 'banned',
                },
            });
            if (cheak) {
                throw new common_1.NotFoundException(`your not allowed to join this channel ${ch.name} cuz  you are banned`);
            }
            if (ch) {
                console.log(ch);
                console.log("¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤ 1");
                if (ch.visibility === "protected") {
                    console.log("¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤ 2");
                    let test = await this.verifyPassword(data.sendData.password, ch.password);
                    if (test) {
                        join = 1;
                    }
                }
                if (join == 1 || ch.visibility === "public") {
                    console.log("¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤ 3");
                    const memberchannel = await this.prisma.memberChannel.create({
                        data: {
                            userId: usid,
                            channelId: ch.id_channel,
                            status_UserInChannel: 'member',
                            muted: false,
                        },
                    });
                    console.log("############### AFTER JOINGING ");
                    return true;
                }
            }
        }
        catch (error) {
            console.log("ERRRRRRRRRRRRROR JOIN CHANNEL");
            throw new common_1.NotFoundException(`Error occured when joining this channel`);
        }
    }
    async updatePass(data, usid) {
        try {
            const ch = await this.getChannelById(data.channel_id);
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
                            const hashedPassword = await this.hashPassword(data.password);
                            const updateChannel = await this.prisma.channel.update({
                                where: {
                                    id_channel: ch.id_channel,
                                },
                                data: {
                                    password: hashedPassword,
                                },
                            });
                            return updateChannel;
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
        catch (error) {
            throw new common_1.NotFoundException('Error occured when updating password of this channel');
        }
    }
    async removePass(data, usid) {
        try {
            const ch = await this.getChannelById(data.id_channel);
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
                            return updateChannel;
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
        catch (error) {
            throw new common_1.NotFoundException('Error occured when Removing password of this channel');
        }
    }
    async setPass(data, usid) {
        try {
            const ch = await this.getChannelById(data.channel_id);
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
                        if (ch.visibility == "public" || ch.visibility == "privat") {
                            const hashedPassword = await this.hashPassword(data.password);
                            const updateChannel = await this.prisma.channel.update({
                                where: {
                                    id_channel: ch.id_channel,
                                },
                                data: {
                                    visibility: "protected",
                                    password: hashedPassword,
                                },
                            });
                            return (updateChannel);
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
        catch (error) {
            throw new common_1.NotFoundException('Error occured when setting password of this channel');
        }
    }
    async setAdmin(data) {
        try {
            const ch = await this.getChannelById(data.channel_id);
            if (ch) {
                const record = await this.prisma.memberChannel.findUnique({
                    where: {
                        userId_channelId: {
                            userId: data.from,
                            channelId: ch.id_channel,
                        },
                    },
                });
                const record2 = await this.prisma.memberChannel.findUnique({
                    where: {
                        userId_channelId: {
                            userId: data.to,
                            channelId: ch.id_channel,
                        },
                    },
                });
                if (record && record2) {
                    if (record.status_UserInChannel === "owner") {
                        const updateChannel = await this.prisma.memberChannel.update({
                            where: {
                                userId_channelId: {
                                    userId: data.to,
                                    channelId: ch.id_channel,
                                },
                            },
                            data: {
                                status_UserInChannel: "admin",
                            },
                        });
                        return updateChannel;
                    }
                    else {
                        throw new common_1.NotFoundException(`your not  the  owner of ${ch.name}`);
                    }
                }
                else {
                    throw new common_1.NotFoundException(`the user with ${data.from} or ${data.to} is not belong to this channel ${ch.name}`);
                }
            }
            else {
                throw new common_1.NotFoundException(`this Channel with Name ${ch.name} not found`);
            }
        }
        catch (error) {
            throw new common_1.NotFoundException('Error occured when setting admin in this channel');
        }
    }
    async kickUser(data, idus, kickcus) {
        try {
            const ch = await this.getChannelById(data.channel_id);
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
                            const deleteMsg = await this.prisma.discussion.deleteMany({
                                where: {
                                    userId: record2.userId,
                                    channelId: ch.id_channel,
                                },
                            });
                            const updateChannel = await this.prisma.memberChannel.delete({
                                where: {
                                    userId_channelId: {
                                        userId: record2.userId,
                                        channelId: ch.id_channel,
                                    },
                                },
                            });
                            const memberchannel = await this.prisma.saveBanned.create({
                                data: {
                                    bannedUserId: record2.userId,
                                    channelId: ch.id_channel,
                                    status_User: 'kicked',
                                },
                            });
                            console.log(`AFTER KICKING THIS USER ${updateChannel}`);
                            return updateChannel;
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
        catch (error) {
            throw new common_1.NotFoundException(`Error occured when kickUser in this channel`);
        }
    }
    async getChannelById(nameVar) {
        const channel = await this.prisma.channel.findUnique({
            where: { id_channel: nameVar },
        });
        if (!channel) {
            throw new common_1.NotFoundException(`Channel with  ${nameVar} not found`);
        }
        return channel;
    }
    async banUser(idch, idus, user_banned) {
        try {
            const ch = await this.getChannelById(idch);
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
                            const deleteMsg = await this.prisma.discussion.deleteMany({
                                where: {
                                    userId: record2.userId,
                                    channelId: ch.id_channel,
                                },
                            });
                            const updateChannel = await this.prisma.memberChannel.delete({
                                where: {
                                    userId_channelId: {
                                        userId: record2.userId,
                                        channelId: ch.id_channel,
                                    },
                                },
                            });
                            const memberchannel = await this.prisma.saveBanned.create({
                                data: {
                                    bannedUserId: record2.userId,
                                    channelId: ch.id_channel,
                                    status_User: 'banned',
                                },
                            });
                            return updateChannel;
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
        catch (error) {
            throw new common_1.NotFoundException(`Error occured when banUser in this channel`);
        }
    }
    async muteUser(data, idus, user_muted) {
        try {
            const ch = await this.getChannelById(data.channel_id);
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
                        if (record2.status_UserInChannel !== "owner") {
                            const updateChannel = await this.prisma.memberChannel.update({
                                where: {
                                    userId_channelId: {
                                        userId: record2.userId,
                                        channelId: record2.channelId,
                                    },
                                },
                                data: {
                                    muted: true,
                                },
                            });
                            return updateChannel;
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
        catch (error) {
            throw new common_1.NotFoundException(`Error occured when muteUser in this channel`);
        }
    }
    async getAllChannels(idUser) {
        try {
            const channels = await this.prisma.memberChannel.findMany({
                where: {
                    userId: idUser,
                },
                include: {
                    channel: true,
                },
            });
            return channels;
        }
        catch (error) {
            throw new common_1.NotFoundException(`Error occured when getting all channels`);
        }
    }
    async getAllAdmins(idch) {
        try {
            const usersInAdminChannel = await this.prisma.memberChannel.findMany({
                where: {
                    channelId: idch,
                    status_UserInChannel: 'admin',
                },
                include: {
                    user: true,
                    channel: true,
                },
            });
            let Names = [];
            if (usersInAdminChannel) {
                Names = usersInAdminChannel.map(member => member.user.name);
            }
            return Names;
        }
        catch (error) {
            throw new common_1.NotFoundException(`Error occured  when getting all admins in this channel`);
        }
    }
    async getAllMembers(idch) {
        try {
            const usersInAdminChannel = await this.prisma.memberChannel.findMany({
                where: {
                    channelId: idch,
                    status_UserInChannel: 'member',
                },
                include: {
                    user: true,
                    channel: true,
                },
            });
            let Names = [];
            if (usersInAdminChannel) {
                Names = usersInAdminChannel.map(member => member.user.name);
            }
            return Names;
        }
        catch (error) {
            throw new common_1.NotFoundException(`Error occured when getting all members in this channel`);
        }
    }
    async getAllOwners(idch) {
        try {
            const usersInAdminChannel = await this.prisma.memberChannel.findMany({
                where: {
                    channelId: idch,
                    status_UserInChannel: 'owner',
                },
                include: {
                    user: true,
                    channel: true,
                },
            });
            let Names = [];
            if (usersInAdminChannel) {
                Names = usersInAdminChannel.map(member => member.user.name);
            }
            return Names;
        }
        catch (error) {
            throw new common_1.NotFoundException(`Error occured when getting all owners in this channel`);
        }
    }
    async getTheLastMessageOfChannel(idch) {
        try {
            const lastMessage = await this.prisma.discussion.findFirst({
                where: {
                    channelId: idch
                },
                orderBy: {
                    dateSent: 'desc'
                }
            });
            return lastMessage;
        }
        catch (error) {
            throw new common_1.NotFoundException(`we have no messages on this channel`);
        }
    }
    async unmuteUser(data, idus, user_muted) {
        try {
            const ch = await this.getChannelById(data.channel_id);
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
                        if (record2.status_UserInChannel !== "owner") {
                            const updateChannel = await this.prisma.memberChannel.update({
                                where: {
                                    userId_channelId: {
                                        userId: record2.userId,
                                        channelId: record2.channelId,
                                    },
                                },
                                data: {
                                    muted: false,
                                },
                            });
                            return updateChannel;
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
        catch (error) {
            throw new common_1.NotFoundException(`Error occured when unmute this user in this channel`);
        }
    }
    async removeChannel(data, idus) {
        try {
            const ch = await this.getChannelById(data.channel_id);
            if (ch) {
                const record = await this.prisma.memberChannel.findUnique({
                    where: {
                        userId_channelId: {
                            userId: idus,
                            channelId: ch.id_channel,
                        },
                    },
                });
                if (record) {
                    if (record.status_UserInChannel === "owner") {
                        const deleteMsg = await this.prisma.discussion.deleteMany({
                            where: {
                                channelId: ch.id_channel,
                            },
                        });
                        const users = await this.prisma.memberChannel.deleteMany({
                            where: {
                                channelId: ch.id_channel,
                            },
                        });
                        const chan = await this.prisma.channel.delete({
                            where: {
                                id_channel: ch.id_channel,
                            },
                        });
                        return true;
                    }
                    else {
                        throw new common_1.NotFoundException(`your not  the  owner  of ${ch.name}`);
                    }
                }
                else {
                    throw new common_1.NotFoundException(`the user with ${idus} is not belong to this channel ${ch.name}`);
                }
            }
            else {
                throw new common_1.NotFoundException(`this Channel with Name ${ch.name} not found`);
            }
        }
        catch (error) {
            throw new common_1.NotFoundException(`Error occured when remove this channel`);
        }
    }
};
exports.ChannelsService = ChannelsService;
exports.ChannelsService = ChannelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, users_service_1.UsersService])
], ChannelsService);
//# sourceMappingURL=channel.service.js.map