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
const jwtservice_service_1 = require("./auth/jwt/jwtservice.service");
const prisma_service_1 = require("./prisma.service");
let AppGateway = class AppGateway {
    constructor(jwt, prisma) {
        this.jwt = jwt;
        this.prisma = prisma;
        this.roomsId = 1;
        this.users = new Map();
        this.rooms = [];
        this.playingUsers = [];
        this.frRooms = [];
        this.framePerSec = 50;
        this.isPaused = false;
        this.logger = new common_1.Logger("AppGateway");
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
    afterInit(server) {
        this.logger.log("Websocket Gateway initialized");
    }
    async handleConnection(client, ...args) {
        const userId = this.decodeCookie(client).id;
        if (this.playingUsers.includes(userId)) {
            client.disconnect();
            return;
        }
        this.playingUsers.push(userId);
        this.logger.log(`Client connected: ${client.id}`);
    }
    async handleDisconnect(client) {
        const room = this.findRoomBySocketId(client.id);
        const decoded = this.decodeCookie(client);
        this.playingUsers = this.playingUsers.filter(item => item !== decoded.id);
        if (decoded == null)
            return;
        await this.prisma.user.update({
            where: { id_user: decoded.id },
            data: {
                InGame: false,
                status_user: "online",
                homies: false,
                invited: false,
                homie_id: 0,
            },
        });
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
        }
        else {
            this.logger.log(`User disconnected : ${client.id}`);
        }
        this.users.delete(this.decodeCookie(client).id);
        console.log(this.users);
    }
    async handleJoinFriendsRoom(client, data) {
        const userId = this.decodeCookie(client).id;
        if (!this.users.has(userId)) {
            this.users.set(userId, client.id);
            const decoded = this.decodeCookie(client);
            await this.prisma.user.update({
                where: { id_user: decoded.id },
                data: {
                    InGame: true,
                    status_user: "in game",
                },
            });
        }
        let room = null;
        for (let singleRoom of this.frRooms) {
            if (singleRoom.roomPlayers.length === 1) {
                for (let player of singleRoom.roomPlayers) {
                    if (player.userId === data.homie_id) {
                        room = singleRoom;
                    }
                }
            }
        }
        if (room) {
            this.player01 = userId;
            client.join(room.id);
            client.emit("player-number", 2);
            room.roomPlayers.push({
                won: false,
                userId: userId,
                socketId: client.id,
                playerNumber: 2,
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
            this.player02 = userId;
            room = {
                friends: true,
                gameAbondoned: false,
                stopRendering: false,
                winner: 0,
                id: this.roomsId.toString(),
                roomPlayers: [
                    {
                        won: false,
                        userId: userId,
                        socketId: client.id,
                        playerNumber: 1,
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
            this.frRooms.push(room);
            client.join(room.id);
            client.emit("player-number", 1);
            client.emit("user-id", userId);
            this.roomsId++;
        }
    }
    async handleJoinRoom(client) {
        const userId = this.decodeCookie(client).id;
        if (!this.users.has(userId)) {
            this.users.set(userId, client.id);
            const decoded = this.decodeCookie(client);
            await this.prisma.user.update({
                where: { id_user: decoded.id },
                data: {
                    InGame: true,
                    status_user: "in game",
                },
            });
        }
        let room = null;
        if (this.rooms.length > 0 &&
            this.rooms[this.rooms.length - 1].roomPlayers.length === 1 &&
            this.rooms[this.rooms.length - 1].roomPlayers[0].userId !== userId &&
            this.rooms[this.rooms.length - 1].friends === false &&
            this.rooms[this.rooms.length - 1].gameAbondoned === false &&
            this.rooms[this.rooms.length - 1].stopRendering === false) {
            room = this.rooms[this.rooms.length - 1];
        }
        if (room) {
            this.player01 = userId;
            client.join(room.id);
            client.emit("player-number", 2);
            room.roomPlayers.push({
                won: false,
                userId: userId,
                socketId: client.id,
                playerNumber: 2,
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
            this.player02 = userId;
            room = {
                friends: false,
                gameAbondoned: false,
                stopRendering: false,
                winner: 0,
                id: this.roomsId.toString(),
                roomPlayers: [
                    {
                        won: false,
                        userId: userId,
                        socketId: client.id,
                        playerNumber: 1,
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
            client.emit("user-id", userId);
            this.roomsId++;
        }
    }
    handleUpdatePlayer(client, data) {
        let room = this.rooms.find((room) => room.id === data.roomID);
        if (!room) {
            room = this.frRooms.find((room) => room.id === data.roomID);
        }
        if (room) {
            if (data.direction === "mouse") {
                room.roomPlayers[data.playerNumber - 1].y =
                    data.event - data.position.top - 100 / 2;
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
        if (room) {
            if (room.friends === false) {
                this.rooms = this.rooms.map((oldRoom) => {
                    if (room && oldRoom.id === room.id) {
                        return room;
                    }
                    else {
                        return oldRoom;
                    }
                });
            }
            else {
                this.frRooms = this.frRooms.map((oldRoom) => {
                    if (room && oldRoom.id === room.id) {
                        return room;
                    }
                    else {
                        return oldRoom;
                    }
                });
            }
        }
        if (room) {
            this.server.to(room.id).emit("update-game", room);
        }
    }
    async handleLeave(client, roomID) {
        client.leave(roomID);
        const decoded = this.decodeCookie(client);
        let room = this.rooms.find((room) => room.id === roomID);
        if (!room) {
            room = this.frRooms.find((room) => room.id === roomID);
        }
        const player = room?.roomPlayers.find((player) => client.id === player.socketId);
        const enemy = room?.roomPlayers.find((player) => client.id !== player.socketId);
        let OppositeId;
        if (decoded.id == this.player01)
            OppositeId = this.player02;
        else
            OppositeId = this.player01;
        let UserScore;
        let EnemyScore;
        if (!player || !enemy) {
            UserScore = 0;
            EnemyScore = 0;
        }
        else {
            UserScore = player.score;
            EnemyScore = enemy.score;
        }
        const user = await this.prisma.user.findUnique({
            where: { id_user: decoded.id },
        });
        const enemyUser = await this.prisma.user.findUnique({
            where: { id_user: OppositeId },
        });
        let gameP = user.games_played + 1;
        let gameW = user.wins;
        let gameL = user.losses;
        let progress;
        let winspercent;
        let lossespercent;
        let useravatar = user.avatar;
        let enemyavatar = enemyUser.avatar;
        let username = user.name;
        let enemyname = enemyUser.name;
        if (player && !player.won) {
            if (enemy.score === 5) {
                gameL++;
                progress = ((gameW - gameL) / gameP) * 100;
                progress = progress < 0 ? 0 : progress;
                winspercent = (gameW / gameP) * 100;
                lossespercent = (gameL / gameP) * 100;
                await this.prisma.user.update({
                    where: { id_user: decoded.id },
                    data: {
                        losses: gameL,
                        games_played: gameP,
                        Progress: progress,
                        Wins_percent: winspercent,
                        Losses_percent: lossespercent,
                        history: {
                            create: {
                                useravatar: useravatar,
                                username: username,
                                winner: false,
                                userscore: UserScore,
                                enemyId: OppositeId,
                                enemyname: enemyname,
                                enemyavatar: enemyavatar,
                                enemyscore: EnemyScore,
                            },
                        },
                    },
                });
            }
            console.log("leave");
            await this.prisma.user.update({
                where: { id_user: decoded.id },
                data: {
                    InGame: false,
                    status_user: "online",
                    homies: false,
                    invited: false,
                    homie_id: 0,
                },
            });
        }
        else if (player) {
            if (player.score === 5) {
                gameW++;
                progress = ((gameW - gameL) / gameP) * 100;
                progress = progress < 0 ? 0 : progress;
                winspercent = (gameW / gameP) * 100;
                lossespercent = (gameL / gameP) * 100;
                await this.prisma.user.update({
                    where: { id_user: decoded.id },
                    data: {
                        wins: gameW,
                        games_played: gameP,
                        Progress: progress,
                        Wins_percent: winspercent,
                        Losses_percent: lossespercent,
                        history: {
                            create: {
                                useravatar: useravatar,
                                winner: true,
                                username: username,
                                userscore: UserScore,
                                enemyId: OppositeId,
                                enemyname: enemyname,
                                enemyavatar: enemyavatar,
                                enemyscore: EnemyScore,
                            },
                        },
                    },
                });
            }
            await this.prisma.user.update({
                where: { id_user: decoded.id },
                data: {
                    InGame: false,
                    status_user: "online",
                    homies: false,
                    invited: false,
                    homie_id: 0,
                },
            });
        }
        if (player && player.won) {
            if (gameW == 1) {
                await this.prisma.user.update({
                    where: { id_user: decoded.id },
                    data: {
                        achievments: {
                            create: {
                                achieve: "won 1 game",
                                msg: "Tbarkellah 3lik",
                            },
                        },
                    },
                });
            }
            if (gameW == 5) {
                await this.prisma.user.update({
                    where: { id_user: decoded.id },
                    data: {
                        achievments: {
                            create: {
                                achieve: "won 5 games",
                                msg: "Wa Rak Nad...Khomasiya",
                            },
                        },
                    },
                });
            }
            if (gameW == 10) {
                await this.prisma.user.update({
                    where: { id_user: decoded.id },
                    data: {
                        achievments: {
                            create: {
                                achieve: "won 10 games",
                                msg: "papapapapa...3Ashra",
                            },
                        },
                    },
                });
            }
        }
        if (room) {
            this.rooms = this.rooms.filter((r) => r.id !== room.id);
            this.frRooms = this.frRooms.filter((r) => r.id !== room.id);
        }
        this.users.delete(this.decodeCookie(client).id);
        if (client.connected) {
            client.disconnect();
        }
    }
    findRoomBySocketId(socketId) {
        for (const room of this.rooms) {
            const playerInRoom = room.roomPlayers.find((player) => player.socketId === socketId);
            if (playerInRoom) {
                return room;
            }
        }
        for (const room of this.frRooms) {
            const playerInRoom = room.roomPlayers.find((player) => player.socketId === socketId);
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
                if (room.roomBall.y + room.roomBall.r >= 644 ||
                    room.roomBall.y - room.roomBall.r <= 0) {
                    room.roomBall.y = room.roomBall.y + room.roomBall.r >= 644 ? room.roomBall.y - room.roomBall.r : room.roomBall.y + room.roomBall.r;
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
                    (room.roomPlayers[0].won = true),
                        this.server.to(room.id).emit("endGame", room);
                    clearInterval(interval);
                }
                else if (room.roomPlayers[1].score === 5) {
                    room.winner = 2;
                    (room.roomPlayers[1].won = true),
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
    (0, websockets_1.SubscribeMessage)("join-friends-room"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], AppGateway.prototype, "handleJoinFriendsRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("join-room"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
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
    __metadata("design:returntype", Promise)
], AppGateway.prototype, "handleLeave", null);
exports.AppGateway = AppGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [jwtservice_service_1.JwtService,
        prisma_service_1.PrismaService])
], AppGateway);
//# sourceMappingURL=app.gateway.js.map