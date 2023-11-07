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
exports.SocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwtservice_service_1 = require("../jwt/jwtservice.service");
const prisma_service_1 = require("../prisma/prisma.service");
let SocketGateway = class SocketGateway {
    constructor(jwt, prisma) {
        this.jwt = jwt;
        this.prisma = prisma;
        this.SocketContainer = new Map();
    }
    decodeCookie(client) {
        let cookieHeader;
        cookieHeader = client.handshake.headers.cookie;
        const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
            const [name, value] = cookie.trim().split("=");
            acc[name] = value;
            return acc;
        }, {});
        const specificCookie = cookies["cookie"];
        console.log(specificCookie);
        const decoded = this.jwt.verify(specificCookie);
        return decoded;
    }
    async handleConnection(client) {
        console.log('client ' + client.id + ' has conected');
        const decoded = this.decodeCookie(client);
        console.log(decoded);
        let user_id = decoded.id;
        this.SocketContainer.set(user_id, client.id);
        const user = await this.prisma.user.update({
            where: { id_user: decoded.id },
            data: {
                status_user: "online",
            },
        });
    }
    async handleDisconnect(client) {
        console.log('client ' + client.id + ' has disconnected');
        const decoded = this.decodeCookie(client);
        this.SocketContainer.delete(decoded.id);
        const user = await this.prisma.user.update({
            where: { id_user: decoded.id },
            data: {
                status_user: "offline",
            },
        });
    }
    handleUserOnline(client) {
        this.handleConnection(client);
    }
    handleUserOffline(client) {
    }
    handleMessage(body) {
        console.log(body);
        return 'Hello world!';
    }
};
exports.SocketGateway = SocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], SocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('userOnline'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "handleUserOnline", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('userOffline'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "handleUserOffline", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], SocketGateway.prototype, "handleMessage", null);
exports.SocketGateway = SocketGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: 'users' }),
    __metadata("design:paramtypes", [jwtservice_service_1.JwtService, prisma_service_1.PrismaService])
], SocketGateway);
//# sourceMappingURL=socket.gateway.js.map