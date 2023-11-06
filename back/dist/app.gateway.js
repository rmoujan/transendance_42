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
exports.AppGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
let AppGateway = class AppGateway {
    constructor() {
        this.rooms = [];
        this.framePerSec = 50;
        this.isPaused = false;
        this.logger = new common_1.Logger("AppGateway");
    }
    afterInit(server) {
        this.logger.log("Websocket Gateway initialized");
    }
    handleConnection(client, ...args) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        const room = this.findRoomBySocketId(client.id);
        if (room) {
            room.gameAbondoned = true;
            this.logger.log(`User disconnected : ${client.id}`);
            room.stopRendering = true;
            if (room.roomPlayers[0].socketId == client.id) {
                room.winner = 2;
            }
            else {
                room.winner = 1;
            }
            this.server.to(room.id).emit("endGame", room);
            this.rooms = this.rooms.filter((r) => r.id !== room.id);
        }
        else {
            this.logger.log(`User disconnected but was not in a room: ${client.id}`);
        }
    }
    handleJoinRoom(client) {
        let room = null;
        if (this.rooms.length > 0 &&
            this.rooms[this.rooms.length - 1].roomPlayers.length === 1) {
            room = this.rooms[this.rooms.length - 1];
        }
        if (room) {
            client.join(room.id);
            client.emit("player-number", 2);
            room.roomPlayers.push({
                socketId: client.id,
                playerNumber: 1,
                x: 1088 - 20,
                y: 644 / 2 - 100 / 2,
                h: 100,
                w: 6,
                score: 0,
            });
            this.server.to(room.id).emit("start-game");
            setTimeout(() => {
                this.server.to(room.id).emit("game-started", room);
                this.pauseGame(500);
                this.startRoomGame(room);
            }, 3100);
        }
        else {
            room = {
                gameAbondoned: false,
                stopRendering: false,
                winner: 0,
                id: (this.rooms.length + 1).toString(),
                roomPlayers: [
                    {
                        socketId: client.id,
                        playerNumber: 2,
                        x: 10,
                        y: 644 / 2 - 100 / 2,
                        h: 100,
                        w: 6,
                        score: 0,
                    },
                ],
                roomBall: {
                    x: 1088 / 2,
                    y: 644 / 2,
                    r: 10,
                    speed: 7,
                    velocityX: 7,
                    velocityY: 7,
                },
            };
            this.rooms.push(room);
            client.join(room.id);
            client.emit("player-number", 1);
        }
    }
    handleUpdatePlayer(client, data) {
        const room = this.rooms.find((room) => room.id === data.roomID);
        if (room) {
            if (data.direction === "mouse") {
                room.roomPlayers[data.playerNumber - 1].y = data.event - data.position.top - 100 / 2;
            }
            else if (data.direction === "up") {
                room.roomPlayers[data.playerNumber - 1].y -= 30;
                if (room.roomPlayers[data.playerNumber - 1].y <= -50) {
                    room.roomPlayers[data.playerNumber - 1].y = -50;
                }
            }
            else if (data.direction === "down") {
                room.roomPlayers[data.playerNumber - 1].y += 30;
                if (room.roomPlayers[data.playerNumber - 1].y + 100 >= 644) {
                    room.roomPlayers[data.playerNumber - 1].y = 644 - 100 / 2;
                }
            }
        }
        this.rooms = this.rooms.map((oldRoom) => {
            if (room && oldRoom.id === room.id) {
                return room;
            }
            else {
                return oldRoom;
            }
        });
        if (room) {
            this.server.to(room.id).emit("update-game", room);
        }
    }
    handleLeave(client, roomID) {
        client.leave(roomID);
    }
    findRoomBySocketId(socketId) {
        for (const room of this.rooms) {
            const playerInRoom = room.roomPlayers.find(player => player.socketId === socketId);
            if (playerInRoom) {
                return room;
            }
        }
        return null;
    }
    pauseGame(duration) {
        this.isPaused = true;
        setTimeout(() => {
            this.isPaused = false;
        }, duration);
    }
    resetBall(room) {
        room.roomBall.x = 1088 / 2;
        room.roomBall.y = 644 / 2;
        room.roomBall.velocityX *= -1;
    }
    updateScore(room) {
        if (room.roomBall.x - room.roomBall.r < 0) {
            this.logger.log(`player 2 scored in room : ${room.id}`);
            room.roomPlayers[1].score++;
            this.resetBall(room);
            this.pauseGame(500);
        }
        else if (room.roomBall.x + room.roomBall.r > 1088) {
            this.logger.log(`player 1 scored in room : ${room.id}`);
            room.roomPlayers[0].score++;
            this.resetBall(room);
            this.pauseGame(500);
        }
    }
    collision(ball, player) {
        const playerTop = player.y;
        const playerBottom = player.y + player.h;
        const playerLeft = player.x;
        const playerRight = player.x + player.w;
        const ballTop = ball.y - ball.r;
        const ballBottom = ball.y + ball.r;
        const ballLeft = ball.x - ball.r;
        const ballRight = ball.x + ball.r;
        return (ballRight > playerLeft &&
            ballTop < playerBottom &&
            ballLeft < playerRight &&
            ballBottom > playerTop);
    }
    startRoomGame(room) {
        let interval = setInterval(() => {
            if (!this.isPaused) {
                room.roomBall.x += room.roomBall.velocityX;
                room.roomBall.y += room.roomBall.velocityY;
                if (room.roomBall.y + room.roomBall.r > 644 ||
                    room.roomBall.y + room.roomBall.r < 10) {
                    room.roomBall.velocityY *= -1;
                }
                let player = room.roomBall.x < 1088 / 2
                    ? room.roomPlayers[0]
                    : room.roomPlayers[1];
                if (this.collision(room.roomBall, player)) {
                    let collidePoint = room.roomBall.y - (player.y + player.h / 2);
                    collidePoint = collidePoint / (player.h / 2);
                    let angleRad = (Math.PI / 4) * collidePoint;
                    if (player === room.roomPlayers[0]) {
                        angleRad *= 1;
                    }
                    else if (player === room.roomPlayers[1]) {
                        angleRad *= -1;
                    }
                    let direction = room.roomBall.x < 1088 / 2 ? 1 : -1;
                    room.roomBall.velocityX =
                        direction * room.roomBall.speed * Math.cos(angleRad);
                    room.roomBall.velocityY =
                        direction * room.roomBall.speed * Math.sin(angleRad);
                    room.roomBall.speed += 0.2;
                }
                this.updateScore(room);
                if (room.roomPlayers[0].score === 5) {
                    room.winner = 1;
                    this.rooms = this.rooms.filter((r) => r.id !== room.id);
                    this.server.to(room.id).emit("endGame", room);
                    clearInterval(interval);
                }
                else if (room.roomPlayers[1].score === 5) {
                    room.winner = 2;
                    this.rooms = this.rooms.filter((r) => r.id !== room.id);
                    this.server.to(room.id).emit("endGame", room);
                    clearInterval(interval);
                }
                if (room.stopRendering) {
                    clearInterval(interval);
                }
                this.server.to(room.id).emit("update-game", room);
            }
        }, 1000 / this.framePerSec);
    }
};
exports.AppGateway = AppGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], AppGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("join-room"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("update-player"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleUpdatePlayer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("leave"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleLeave", null);
exports.AppGateway = AppGateway = __decorate([
    (0, websockets_1.WebSocketGateway)()
], AppGateway);
//# sourceMappingURL=app.gateway.js.map