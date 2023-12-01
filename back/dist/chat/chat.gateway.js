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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const websockets_2 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const jwtservice_service_1 = require("../auth/jwt/jwtservice.service");
const chat_service_1 = require("./chat.service");
const users_service_1 = require("../users/users.service");
const channel_service_1 = require("../channel/channel.service");
const chat_dto_1 = require("./dtoChat/chat.dto");
let ChatGateway = class ChatGateway {
    constructor(jwt, ChatService, UsersService, ChannelsService) {
        this.jwt = jwt;
        this.ChatService = ChatService;
        this.UsersService = UsersService;
        this.ChannelsService = ChannelsService;
        this.connectedClients = new Map();
        this.roomsDm = [];
        this.logger = new common_1.Logger('AppGateway');
    }
    afterInit(server) {
        this.logger.log("Initialized by Reshe");
    }
    decodeCookie(client) {
        let cookieHeader;
        cookieHeader = client.handshake.headers.cookie;
        if (cookieHeader == undefined)
            return null;
        const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
            const [name, value] = cookie.trim().split("=");
            acc[name] = value;
            return acc;
        }, {});
        const specificCookie = cookies["cookie"];
        const decoded = this.jwt.verify(specificCookie);
        return decoded;
    }
    handleConnection(client) {
        if (client) {
            const decoded = this.decodeCookie(client);
            console.log(`decoded is ===========  ${decoded}`);
            if (decoded) {
                if (decoded.id) {
                    this.logger.log(` ********  User  Connected : ${decoded.id} and its sockets is ${client.id}`);
                    this.connectedClients.set(decoded.id, client);
                    console.log("------------------------------- OUTPUT MAP OF CONNECTE CLIENTS ----------------------------------");
                    for (const [key, value] of this.connectedClients) {
                        console.log(`Key: ${key}, Value: ${value}`);
                    }
                }
            }
        }
    }
    handleDisconnect(client) {
        if (client) {
            const decoded = this.decodeCookie(client);
            console.log(`decoded is ===========  ${decoded}`);
            if (decoded) {
                if (decoded.id) {
                    this.logger.log(` ******   Client Disconnect : ${decoded.id}`);
                    this.connectedClients.delete(decoded.id);
                    console.log("------------------ Client Disconnection :: OUTPUT MAP OF CONNECTE CLIENTS");
                    for (const [key, value] of this.connectedClients) {
                        console.log(`Key: ${key}, Value: ${value}`);
                    }
                }
            }
        }
    }
    createRoom(senderId, recieverId) {
        console.log(`From Create Room Server Side : sender is ${senderId} and reciever is ${recieverId}`);
        const roomName1 = `room_${senderId}_${recieverId}`;
        const roomName2 = `room_${recieverId}_${senderId}`;
        const check1 = this.roomsDm.indexOf(roomName1);
        const check2 = this.roomsDm.indexOf(roomName2);
        if (check1 === -1 && check2 === -1) {
            this.roomsDm.push(roomName1);
            return roomName1;
        }
        if (check1 !== -1)
            return this.roomsDm[check1];
        else
            return this.roomsDm[check2];
    }
    leaveRoom(client, roomName) {
        client.leave(roomName);
    }
    joinRoom(client, roomName) {
        if (client)
            client.join(roomName);
    }
    async handling_joinRoom_dm(room, senderId, receiverId, message) {
        const senderClient = this.connectedClients.get(senderId);
        const receiverClient = this.connectedClients.get(receiverId);
        console.log("*************   handling_joinRoom_dm");
        const result = await this.ChatService.cheakBlockedUser(senderId, receiverId);
        if (result) {
            console.log("u are blocked from the reciever");
        }
        else {
            this.joinRoom(senderClient, room);
            this.joinRoom(receiverClient, room);
            const dm = await this.ChatService.checkDm(senderId, receiverId);
            if (dm) {
                const insertDm = await this.ChatService.createMsg(senderId, receiverId, dm, message, "text");
                const data = {
                    id: dm.id_dm,
                    message: message,
                    send: senderId,
                    recieve: receiverId
                };
                console.log(`¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤`);
                this.server.to(room).emit('chatToDm', data);
            }
        }
    }
    process_dm(client, data) {
        let room;
        try {
            if (data) {
                if (!data.message || !data.from || !data.to) {
                    console.log("channel false 11");
                    return (false);
                }
            }
            else {
                console.log("channel fals1e   22");
                return (false);
            }
            console.log("*************   direct_message");
            console.log(data);
            room = this.createRoom(data.from, data.to);
            this.handling_joinRoom_dm(room, data.from, data.to, data.message);
        }
        catch (error) {
            console.log("error");
        }
    }
    async handling_joinRoom_group(data, users) {
        console.log("*************   handling_joinRoom_group");
        const room = `room_${data.id}`;
        for (const user of users) {
            const client = this.connectedClients.get(user.userId);
            this.joinRoom(client, room);
        }
        const checkmutedUser = await this.ChatService.checkmuted(data.from, data.to);
        if (checkmutedUser) {
            if (checkmutedUser.muted == false) {
                const save = await this.ChatService.createDiscussion(data.from, data.message, data.to);
                const result = {
                    id: data.to,
                    sender_id: data.from,
                    type: "msg",
                    subtype: "",
                    message: data.message,
                };
                this.server.to(room).emit('chatToGroup', result);
            }
        }
    }
    async sendInChannel(client, data) {
        console.log("-------------------------------------- channel_message -----------------------------");
        console.log(data);
        try {
            if (data) {
                if (!data.message || !data.from || !data.to) {
                    console.log("channel false 11");
                    return (false);
                }
            }
            else {
                console.log("channel fals1e   22");
                return (false);
            }
            const channel = await this.ChatService.findChannel(data.to);
            if (channel) {
                const users = await this.ChatService.getUsersInChannel(data.to);
                this.handling_joinRoom_group(data, users);
            }
        }
        catch (error) {
            console.error("Error");
        }
    }
    async allConversationsDm(client, data) {
        console.log("*************   allConversationsDm");
        console.log(data);
        try {
            const decoded = this.decodeCookie(client);
            const user = await this.UsersService.findById(decoded.id);
            const dms = await this.ChatService.getAllConversations(user.id_user);
            console.log(`##################################### DMS of ${user.id_user}`);
            console.log(dms);
            let recv;
            let send;
            let namerecv;
            let avatarrecv;
            let statusrecv;
            let msg = "";
            let sent = null;
            if (dms) {
                const arrayOfDms = [];
                for (const dmm of dms) {
                    const getRecvUser = await this.UsersService.findById(dmm.receiverId);
                    const getSendUser = await this.UsersService.findById(dmm.senderId);
                    const lastMsg = await this.ChatService.getTheLastMessage(dmm.id_dm);
                    recv = dmm.receiverId;
                    send = dmm.senderId;
                    namerecv = getRecvUser.name;
                    statusrecv = getRecvUser.status_user;
                    avatarrecv = getRecvUser.avatar;
                    if (user.id_user === dmm.receiverId) {
                        recv = dmm.senderId;
                        send = dmm.receiverId;
                        namerecv = getSendUser.name;
                        avatarrecv = getSendUser.avatar;
                        statusrecv = getSendUser.status_user;
                    }
                    if (lastMsg) {
                        msg = lastMsg.text;
                        sent = lastMsg.dateSent;
                    }
                    const newDm = {
                        id_room: dmm.id_dm,
                        id: recv,
                        user_id: send,
                        name: namerecv,
                        online: statusrecv,
                        img: avatarrecv,
                        msg: msg,
                        time: sent,
                        unread: dmm.unread,
                        pinned: dmm.pinned,
                    };
                    arrayOfDms.push(newDm);
                }
                client.emit('response', arrayOfDms);
            }
        }
        catch (error) {
            console.log("error");
            client.emit('response', false);
        }
    }
    async getAllMessages(client, data) {
        console.log("---------------------- allMessagesDm -----------------------------");
        console.log(data);
        try {
            if (data) {
                if (!data.room_id || !data.user_id) {
                    return (false);
                }
            }
            else
                return (false);
            if (client) {
                const decoded = this.decodeCookie(client);
                const user = await this.UsersService.findById(decoded.id);
                if (user) {
                    const existDm = await this.ChatService.getDm(data.user_id, data.room_id);
                    if (existDm) {
                        const messages = await this.ChatService.getAllMessages(existDm.id_dm);
                        client.emit('historyDms', messages);
                    }
                    else {
                        client.emit('historyDms', []);
                    }
                }
            }
        }
        catch (error) {
            console.log("error");
            client.emit('historyDms', false);
        }
    }
    async getAllMessagesRoom(client, data) {
        console.log("********************** allMessagesRoom");
        console.log(data);
        try {
            if (data) {
                if (!data.user_id || !data.id) {
                    return (false);
                }
            }
            else
                return (false);
            const user = await this.UsersService.findById(data.user_id);
            if (user) {
                const messages = await this.ChatService.getAllMessagesRoom(data.id);
                if (client) {
                    client.emit('hostoryChannel', messages);
                }
            }
        }
        catch (error) {
            console.log("error");
            client.emit('hostoryChannel', false);
        }
    }
    async leavingRoom(client, data) {
        console.log("-------------------------- leave from this Channel -------------------------- ");
        console.log(data);
        try {
            if (data) {
                if (!data.user_id || !data.channel_id) {
                    return (false);
                }
            }
            else
                return (false);
            const user = await this.UsersService.findById(data.user_id);
            if (user) {
                const leave = await this.ChatService.getLeavingRoom(data.user_id, data.channel_id);
                if (leave) {
                    console.log(`User with ${data.user_id} is leaving room with id ${data.channel_id}`);
                    client.emit('ResponseLeaveUser', true);
                }
                else {
                    client.emit('ResponseLeaveUser', false);
                }
            }
        }
        catch (error) {
            console.log("error");
            client.emit('ResponseLeaveUser', false);
        }
    }
    async bannedUser(client, data) {
        console.log("-------------------------- banUser from this Channel -------------------------- ");
        console.log(data);
        try {
            if (data) {
                if (!data.to || !data.from || !data.channel_id) {
                    return (false);
                }
            }
            else
                return (false);
            const user1 = await this.UsersService.findById(data.from);
            const user2 = await this.UsersService.findById(data.to);
            if (client) {
                const decoded = this.decodeCookie(client);
                console.log(`checking id of clients and user are ${decoded.id} --- ${data.from}`);
                if (user1) {
                    if (user1.id_user == data.from) {
                        if (user1 && user2) {
                            const bannedUser = await this.ChannelsService.banUser(data.channel_id, data.from, data.to);
                            if (bannedUser) {
                                const result = "operation accomplished successfully";
                                console.log(result);
                                console.log(bannedUser);
                                client.emit('ResponseBannedUser', true);
                            }
                            else {
                                const result = "operation does not accomplished successfully";
                                console.log(result);
                                client.emit('ResponseBannedUser', false);
                            }
                        }
                    }
                }
            }
        }
        catch (error) {
            console.log("error");
            client.emit('ResponseBannedUser', false);
        }
    }
    async kickUser(client, data) {
        console.log("-------------------------- kickUser from this Channel -------------------------- ");
        console.log(data);
        try {
            if (data) {
                if (!data.to || !data.from || !data.channel_id) {
                    return (false);
                }
            }
            else
                return (false);
            const user1 = await this.UsersService.findById(data.from);
            const user2 = await this.UsersService.findById(data.to);
            if (client) {
                const decoded = this.decodeCookie(client);
                if (user1) {
                    if (user1.id_user == decoded.id) {
                        if (user1 && user2) {
                            const kickUser = await this.ChannelsService.kickUser(data, data.from, data.to);
                            if (kickUser) {
                                console.log("kick user 1");
                                client.emit('ResponsekickUser', true);
                            }
                            else {
                                console.log("kick user 2");
                                client.emit('ResponsekickUser', false);
                            }
                        }
                    }
                }
            }
        }
        catch (error) {
            console.log("error");
            client.emit('ResponsekickUser', false);
        }
    }
    async muteUser(client, data) {
        console.log("-------------------------- MUTEUSER from this Channel -------------------------- ");
        try {
            if (data) {
                if (!data.to || !data.from || !data.channel_id) {
                    return (false);
                }
            }
            else
                return (false);
            console.log(data);
            const user1 = await this.UsersService.findById(data.from);
            const user2 = await this.UsersService.findById(data.to);
            if (client) {
                const decoded = this.decodeCookie(client);
                if (user1) {
                    if (user1.id_user == decoded.id) {
                        if (user1 && user2) {
                            const muteUser = await this.ChannelsService.muteUser(data, user1.id_user, data.to);
                            if (muteUser) {
                                console.log("mute user 1");
                                client.emit('ResponsemuteUser', true);
                            }
                            else {
                                console.log("mute user 2");
                                client.emit('ResponsemuteUser', false);
                            }
                        }
                    }
                }
            }
        }
        catch (error) {
            console.log("error");
            client.emit('ResponsemuteUser', false);
        }
    }
    async unmuteUser(client, data) {
        console.log("-------------------------- UNMUTEUSER from this Channel -------------------------- ");
        try {
            if (data) {
                if (!data.to || !data.from || !data.channel_id) {
                    return (false);
                }
            }
            else
                return (false);
            console.log(data);
            const user1 = await this.UsersService.findById(data.from);
            const user2 = await this.UsersService.findById(data.to);
            if (client) {
                const decoded = this.decodeCookie(client);
                if (user1) {
                    if (user1.id_user == decoded.id) {
                        if (user1 && user2) {
                            const unmuteUser = await this.ChannelsService.unmuteUser(data, user1.id_user, data.to);
                            if (unmuteUser) {
                                console.log("mute user 1");
                                client.emit('ResponsunmutekUser', true);
                            }
                            else {
                                console.log("mute user 2");
                                client.emit('ResponsunmutekUser', false);
                            }
                        }
                    }
                }
            }
        }
        catch (error) {
            console.log("error");
            client.emit('ResponsunmutekUser', false);
        }
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('direct_message'),
    __param(0, (0, websockets_2.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "process_dm", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('channel_message'),
    __param(0, (0, websockets_2.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "sendInChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('allConversationsDm'),
    __param(0, (0, websockets_2.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "allConversationsDm", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('allMessagesDm'),
    __param(0, (0, websockets_2.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getAllMessages", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('allMessagesRoom'),
    __param(0, (0, websockets_2.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getAllMessagesRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveChannel'),
    __param(0, (0, websockets_2.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "leavingRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('banUserFRomChannel'),
    __param(0, (0, websockets_2.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "bannedUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('kickUserFromChannel'),
    __param(0, (0, websockets_2.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "kickUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('muteUserFromChannel'),
    __param(0, (0, websockets_2.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, chat_dto_1.ChatDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "muteUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unmuteUserFromChannel'),
    __param(0, (0, websockets_2.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "unmuteUser", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: "chat",
        cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] },
    }),
    __metadata("design:paramtypes", [jwtservice_service_1.JwtService, chat_service_1.ChatService, users_service_1.UsersService, channel_service_1.ChannelsService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map