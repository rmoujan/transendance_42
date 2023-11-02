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
        this.roomsDm = [];
        this.clientsChannel = [];
        this.logger = new common_1.Logger('AppGateway');
    }
    afterInit(server) {
        this.logger.log("Initialized by Reshe");
    }
    handleConnection(client) {
        this.logger.log(client.handshake.query.user_id);
        const id = Number(client.handshake.query.user_id);
        this.logger.log(` ********  User  Connected : ${id} and its sockets is ${client.id}`);
        this.connectedClients.set(id, client);
        console.log("####### First connection :: OUTPUT MAP OF CONNECTE CLIENTS");
        for (const [key, value] of this.connectedClients) {
            console.log(`Key: ${key}, Value: ${value}`);
        }
    }
    handleDisconnect(client) {
        const id = Number(client.handshake.query.user_id);
        this.logger.log(` ******   Client Disconnect : ${id}`);
        this.connectedClients.delete(id);
        console.log("***** Client Disconnection :: OUTPUT MAP OF CONNECTE CLIENTS");
        for (const [key, value] of this.connectedClients) {
            console.log(`Key: ${key}, Value: ${value}`);
        }
    }
    createRoom(senderId, recieverId) {
        console.log(`From Create Room SErver Side : sender is ${senderId} and reciever is ${recieverId}`);
        const roomName1 = `room_${senderId}_${recieverId}`;
        const roomName2 = `room_${recieverId}_${senderId}`;
        console.log(`roomName1 is ${roomName1} and roomName2 is ${roomName2}`);
        const check1 = this.roomsDm.indexOf(roomName1);
        const check2 = this.roomsDm.indexOf(roomName2);
        console.log(`From create room server side after check `);
        if (check1 === -1 && check2 === -1) {
            console.log(`check1 is ${check1} and check2 is ${check2}`);
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
        const senderClient = this.connectedClients.get(senderId);
        const receiverClient = this.connectedClients.get(receiverId);
        console.log("####### :: OUTPUT MAP OF CONNECTE CLIENTS");
        for (const [key, value] of this.connectedClients) {
            console.log(`Key: ${key}, Value: ${value}`);
        }
        console.log(typeof (senderId), typeof (receiverId));
        console.log(`***** From Dm handlingRoom Dm : sender is ${senderId} and reciver is ${receiverId}`);
        console.log(`***** From Dm handlingRoom Dm : Socketsender is ${senderClient} and Socketreciver is ${receiverClient}`);
        const size = this.connectedClients.size;
        console.log(`****** size of map of clients connected is ${size}`);
        if (senderClient && receiverClient) {
            this.joinRoom(senderClient, room);
            this.joinRoom(receiverClient, room);
            console.log("starting sending");
            const data = {
                id: 90,
                message: message,
                subtype: 'text',
                send: senderId,
                recieve: receiverId
            };
            this.server.to(room).emit('chatToDm', data);
            console.log(data);
            console.log("after sending");
        }
        else {
            console.error(`Sender or receiver is not connected.`);
        }
    }
    process_dm(client, data) {
        console.log(typeof (data.from), typeof (data.to), data);
        let room;
        room = this.createRoom(data.from, data.to);
        this.handling_joinRoom_dm(room, data.from, data.to, data.message);
        console.log(`FRom websockets DM ==== ${data.message}`);
        console.log();
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
    __param(1, (0, websockets_1.MessageBody)()),
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