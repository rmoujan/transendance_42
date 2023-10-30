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
const jwtservice_service_1 = require("../jwt/jwtservice.service");
const chat_service_1 = require("./chat.service");
let ChatGateway = class ChatGateway {
    constructor(jwt, ChatService) {
        this.jwt = jwt;
        this.ChatService = ChatService;
        this.connectedClients = new Map();
        this.clientsChannel = [];
        this.logger = new common_1.Logger('AppGateway');
    }
    afterInit(server) {
        this.logger.log("Initialized by Reshe");
    }
    handleConnection(client) {
        this.logger.log(client.handshake.query.user_id);
        const id = Number(client.handshake.query.user_id);
        this.logger.log(` ********  Client Connected : ${id}`);
        this.connectedClients.set(id, client);
    }
    handleDisconnect(client) {
        const id = Number(client.handshake.query.user_id);
        this.logger.log(` ******   Client Disconnect : ${client.id}`);
        this.connectedClients.delete(id);
    }
    createRoom(senderId, recieverId) {
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
        client.join(roomName);
    }
    handling_joinRoom_dm(room, senderId, receiverId, message) {
        const senderClient = this.connectedClients[senderId];
        const receiverClient = this.connectedClients[receiverId];
        if (senderClient && receiverClient) {
            this.joinRoom(senderClient, room);
            this.joinRoom(receiverClient, room);
            this.server.to(room).emit('chatToDm', message);
        }
        else {
            console.error(`Sender or receiver is not connected.`);
        }
    }
    process_dm(client, payload) {
        console.log(`FRom websockets DM ==== ${payload}`);
        console.log(`client connected is ${client.id}`);
        return 'Hello world!';
    }
    handling_joinRoom_group(idch, message, users) {
        const room = `room_${idch}`;
        for (const user of users) {
            const clien = this.connectedClients[user.userId];
            if (clien) {
                this.joinRoom(clien, room);
            }
        }
        this.server.to(room).emit('chatToGroup', message);
    }
    async sendInChannel(client, payload) {
        const id = 1;
        const users = await this.ChatService.getUsersInChannel(id);
        console.log("Executing FRom gatways !!!");
        console.log(users[0]);
        for (const user of users) {
            console.log(user.userId);
        }
        this.handling_joinRoom_group(id, payload, users);
        return users;
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", String)
], ChatGateway.prototype, "process_dm", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('channel_message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "sendInChannel", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] } }),
    __metadata("design:paramtypes", [jwtservice_service_1.JwtService, chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map