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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ChatService = class ChatService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findChannel(idch) {
        try {
            const channel = await this.prisma.channel.findUnique({
                where: {
                    id_channel: idch,
                },
            });
            return (channel);
        }
        catch (error) {
            throw new common_1.NotFoundException(`no channel`);
        }
    }
    async getUsersInChannel(idch) {
        try {
            const users = await this.prisma.memberChannel.findMany({
                where: {
                    channelId: idch,
                    muted: false
                },
            });
            return (users);
        }
        catch (error) {
            throw new common_1.NotFoundException(`no users`);
        }
    }
    async checkDm(idSend, idRecv) {
        try {
            const dm1 = await this.prisma.dm.findUnique({
                where: {
                    senderId_receiverId: {
                        senderId: idSend,
                        receiverId: idRecv,
                    },
                },
            });
            if (dm1) {
                return dm1;
            }
            const dm2 = await this.prisma.dm.findUnique({
                where: {
                    senderId_receiverId: {
                        senderId: idRecv,
                        receiverId: idSend,
                    },
                },
            });
            if (dm2) {
                return dm2;
            }
            const result = await this.prisma.dm.create({
                data: {
                    senderId: idSend,
                    receiverId: idRecv,
                    unread: 0,
                    pinned: false,
                },
            });
            return (result);
        }
        catch (error) {
            throw new common_1.NotFoundException(`Error occured when checking dm`);
        }
    }
    async createMsg(idSend, idRecv, dmVar, msg, typeMsg) {
        try {
            const result = await this.prisma.conversation.create({
                data: {
                    text: msg,
                    outgoing: idSend,
                    incoming: idRecv,
                    type: typeMsg,
                    idDm: dmVar.id_dm,
                },
            });
            return (result);
        }
        catch (error) {
            throw new common_1.NotFoundException(`Error occured when creating a message`);
        }
    }
    async getAllConversations(id) {
        try {
            const dms = await this.prisma.dm.findMany({
                where: {
                    OR: [
                        { senderId: id },
                        { receiverId: id }
                    ]
                }
            });
            console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  :: ${dms}`);
            return dms;
        }
        catch (error) {
            throw new common_1.NotFoundException(`there is no dms , error`);
        }
    }
    async getDm(idSend, idRecv) {
        try {
            const dm1 = await this.prisma.dm.findUnique({
                where: {
                    senderId_receiverId: {
                        senderId: idSend,
                        receiverId: idRecv,
                    },
                },
            });
            if (dm1) {
                console.log(`get Dm1 |${dm1}|`);
                return dm1;
            }
            const dm2 = await this.prisma.dm.findUnique({
                where: {
                    senderId_receiverId: {
                        senderId: idRecv,
                        receiverId: idSend,
                    },
                },
            });
            if (dm2) {
                console.log(`get dm2 |${dm2}|`);
                return dm2;
            }
        }
        catch (error) {
            throw new common_1.NotFoundException(`we have no dm for those users`);
        }
    }
    async getAllMessages(id) {
        try {
            const messages = await this.prisma.conversation.findMany({
                where: {
                    idDm: id
                },
                orderBy: {
                    dateSent: 'asc'
                }
            });
            return messages;
        }
        catch (error) {
            throw new common_1.NotFoundException(`we have no messages`);
        }
    }
    async createDiscussion(idSend, msg, idCh) {
        try {
            const result = await this.prisma.discussion.create({
                data: {
                    message: msg,
                    userId: idSend,
                    channelId: idCh,
                },
            });
            return (result);
        }
        catch (error) {
            throw new common_1.NotFoundException(`Error occured when creating a discussion`);
        }
    }
    async getAllMessagesRoom(id) {
        try {
            const messages = await this.prisma.discussion.findMany({
                where: {
                    channelId: id
                },
                orderBy: {
                    dateSent: 'asc'
                }
            });
            return messages;
        }
        catch (error) {
            throw new common_1.NotFoundException(`Error getting messages in this Channel`);
        }
    }
    async getTheLastMessage(id) {
        try {
            const lastMessage = await this.prisma.conversation.findFirst({
                where: {
                    idDm: id
                },
                orderBy: {
                    dateSent: 'desc'
                }
            });
            return lastMessage;
        }
        catch (error) {
            throw new common_1.NotFoundException(`There is no last message`);
        }
    }
    async getLeavingRoom(idUs, idch) {
        try {
            const record = await this.prisma.memberChannel.findUnique({
                where: {
                    userId_channelId: {
                        userId: idUs,
                        channelId: idch,
                    },
                },
            });
            if (record) {
                console.log("DELETING USER \n");
                const deleteMsg = await this.prisma.discussion.deleteMany({
                    where: {
                        userId: idUs,
                        channelId: idch,
                    },
                });
                const result = await this.prisma.memberChannel.delete({
                    where: {
                        userId_channelId: {
                            userId: idUs,
                            channelId: idch,
                        },
                    },
                });
                return result;
            }
        }
        catch (error) {
            throw new common_1.NotFoundException(`Error occured when leave user in this channel`);
        }
    }
    async cheakBlockedUser(idSend, idRecv) {
        try {
            const block = await this.prisma.blockedUser.findMany({
                where: {
                    userId: idRecv,
                    id_blocked_user: idSend,
                },
            });
            const block2 = await this.prisma.blockedUser.findMany({
                where: {
                    userId: idSend,
                    id_blocked_user: idRecv,
                },
            });
            if (block.length > 0 || block2.length > 0) {
                return true;
            }
            return false;
        }
        catch (error) {
            throw new common_1.NotFoundException(`Error occured when check blocked user`);
        }
    }
    async checkmuted(idSend, idch) {
        try {
            const record = await this.prisma.memberChannel.findUnique({
                where: {
                    userId_channelId: {
                        userId: idSend,
                        channelId: idch,
                    },
                }
            });
            return (record);
        }
        catch (error) {
            throw new common_1.NotFoundException(`Error occured when checking muted user`);
        }
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map