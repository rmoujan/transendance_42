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
        const channel = await this.prisma.channel.findUnique({
            where: {
                id_channel: idch,
            },
        });
        return (channel);
    }
    async getUsersInChannel(idch) {
        const users = await this.prisma.memberChannel.findMany({
            where: {
                channelId: idch,
            },
        });
        return (users);
    }
    async checkDm(idSend, idRecv) {
        const dm1 = await this.prisma.dm.findUnique({
            where: {
                senderId_receiverId: {
                    senderId: idSend,
                    receiverId: idRecv,
                },
            },
        });
        if (dm1) {
            console.log(`FRom dm1 |${dm1}|`);
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
            console.log(`FRom dm2 |${dm2}|`);
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
        console.log(`Result is ${result}`);
        return (result);
    }
    async createMsg(idSend, idRecv, dmVar, msg, typeMsg) {
        let var1 = false;
        let var2 = false;
        console.log(`FRom create msg , ${dmVar}, ${dmVar.senderId}`);
        if (dmVar.senderId === idSend) {
            var1 = true;
        }
        else {
            var2 = true;
        }
        const result = await this.prisma.conversation.create({
            data: {
                text: msg,
                outgoing: var1,
                incoming: var2,
                type: typeMsg,
                idDm: dmVar.id_dm,
            },
        });
        return (result);
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
            return dms;
        }
        catch (error) {
            console.error('there is no dms , error');
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
            console.error('we have no public channels', error);
        }
    }
    async createDiscussion(idSend, msg, idCh) {
        const result = await this.prisma.discussion.create({
            data: {
                message: msg,
                userId: idSend,
                channelId: idCh,
            },
        });
        return (result);
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
            console.error('we have no public channels', error);
        }
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map