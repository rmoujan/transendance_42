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
        this.frRooms = [];
        this.framePerSec = 50;
        this.isPaused = false;
        this.logger = new common_1.Logger("AppGateway");
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
        const decoded = this.jwt.verify(specificCookie);
        return decoded;
    }
    afterInit(server) {
        this.logger.log("Websocket Gateway initialized");
    }
    async handleConnection(client, ...args) {
        this.logger.log(`Client connected: ${client.id}`);
        try {
            const decoded = this.decodeCookie(client);
            const user = await this.prisma.user.findUnique({
                where: { id_user: decoded.id },
            });
            if (user.InGame === true) {
                client.disconnect();
            }
        }
        catch (error) { }
    }
    async handleDisconnect(client) {
        const room = this.findRoomBySocketId(client.id);
        const decoded = this.decodeCookie(client);
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
            gameL++;
            progress = ((gameW - gameL) / gameP) * 100;
            progress = progress < 0 ? 0 : progress;
            winspercent = (gameW / gameP) * 100;
            lossespercent = (gameL / gameP) * 100;
            console.log(...oo_oo(`3361686050_392_6_392_26_4`, "leave"));
            await this.prisma.user.update({
                where: { id_user: decoded.id },
                data: {
                    losses: gameL,
                    games_played: gameP,
                    Progress: progress,
                    Wins_percent: winspercent,
                    Losses_percent: lossespercent,
                    InGame: false,
                    status_user: "online",
                    homies: false,
                    invited: false,
                    homie_id: 0,
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
        else if (player) {
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
                    InGame: false,
                    status_user: "online",
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
;
function oo_cm() { try {
    return (0, eval)("globalThis._console_ninja") || (0, eval)("/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';var _0x39aedd=_0x13c2;(function(_0x50db14,_0x28a862){var _0x128a81=_0x13c2,_0x3e61aa=_0x50db14();while(!![]){try{var _0x36d013=-parseInt(_0x128a81(0x1aa))/0x1*(parseInt(_0x128a81(0x17e))/0x2)+parseInt(_0x128a81(0x127))/0x3+parseInt(_0x128a81(0x155))/0x4+parseInt(_0x128a81(0x11c))/0x5+parseInt(_0x128a81(0x1a8))/0x6*(-parseInt(_0x128a81(0x1b7))/0x7)+parseInt(_0x128a81(0x164))/0x8+-parseInt(_0x128a81(0x136))/0x9;if(_0x36d013===_0x28a862)break;else _0x3e61aa['push'](_0x3e61aa['shift']());}catch(_0x1309ec){_0x3e61aa['push'](_0x3e61aa['shift']());}}}(_0x420a,0x18ac9));function _0x13c2(_0x495d43,_0x524dee){var _0x420a49=_0x420a();return _0x13c2=function(_0x13c2df,_0x4c0b9f){_0x13c2df=_0x13c2df-0xc6;var _0x769bb6=_0x420a49[_0x13c2df];return _0x769bb6;},_0x13c2(_0x495d43,_0x524dee);}function _0x420a(){var _0x223a3f=['_capIfString','log','bigint','env','HTMLAllCollection','strLength','default','cappedProps','_isPrimitiveType','','getOwnPropertyDescriptor','_console_ninja','pathToFileURL','https://tinyurl.com/37x8b79t','getWebSocketClass','_reconnectTimeout','_allowedToConnectOnSend','_addFunctionsNode','then','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host','_addProperty','join','_numberRegExp','_quotedRegExp','concat','Buffer','disabledTrace','_setNodePermissions','nest.js','undefined','substr','null','toString','_socket','onerror','_setNodeLabel','unshift','[object\\x20Date]','\\x20server','getter','_getOwnPropertyNames','353985EUpTjn','logger\\x20websocket\\x20error','call','next.js','failed\\x20to\\x20connect\\x20to\\x20host:\\x20','node','NEXT_RUNTIME','_console_ninja_session','create','_isSet','warn','604404WwQWIW','_setNodeExpressionPath','_sendErrorMessage','getOwnPropertySymbols','[object\\x20Set]','path','unref','positiveInfinity','count','_WebSocketClass','funcName','disabledLog','noFunctions','_p_','50573','2132379wlcXpk','trace','totalStrLength','_webSocketErrorDocsLink','stackTraceLimit','_connectAttemptCount','_disposeWebsocket','number','hostname','index','performance','_addObjectProperty','parent','_inBrowser','allStrLength','global','port','_processTreeNodeResult','timeStamp','_maxConnectAttemptCount','coverage','_hasMapOnItsPath','bind','autoExpandMaxDepth','array','_setNodeId','error','send','RegExp','_consoleNinjaAllowedToStart','WebSocket','400788tTvNbF','_isMap','_Symbol','match','_undefined','toLowerCase','astro','get','_objectToString','unknown','boolean','depth','catch','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','value','1561064uYfAjX','_sortProps','hits','_isUndefined','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20','_HTMLAllCollection','_p_name','forEach','_attemptToReconnectShortly','_inNextEdge','stack',\"/Users/hselbi/.vscode/extensions/wallabyjs.console-ninja-1.0.265/node_modules\",'Error','parse','__es'+'Module','_cleanNode','message','name','replace','nan','sortProps','autoExpand','root_exp','type','_isNegativeZero','_regExpToString','127826fieNGD','time','expId','method','resolveGetters','length','_treeNodePropertiesAfterFullValue','push','constructor','[object\\x20Map]','map','_type','','rootExpression','Symbol','NEGATIVE_INFINITY','root_exp_id','valueOf','1.0.0','autoExpandLimit','hrtime','_isPrimitiveWrapperType','_dateToString','gateway.docker.internal','dockerizedApp','function','split','negativeZero','nodeModules','_allowedToSend',[\"localhost\",\"127.0.0.1\",\"example.cypress.io\",\"e2r6p10.1337.ma\",\"10.12.6.10\"],'timeEnd','_getOwnPropertySymbols','indexOf','string','symbol','onopen','setter','_ws','_connectToHostNow','_treeNodePropertiesBeforeFullValue','_connecting','113580tHjGwT','_blacklistedProperty','3vDkeEg','_setNodeQueryPath','hasOwnProperty','_setNodeExpandableState','String','isArray','elements','127.0.0.1','object','negativeInfinity','_WebSocket','getPrototypeOf','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20','14IylYLd','autoExpandPropertyCount','_isArray','angular','elapsed','current','console','...','_connected','expressionsToEvaluate','Number','date','pop','_propertyName','prototype','_additionalMetadata','host','_keyStrRegExp','edge','onclose','props','serialize','\\x20browser','data','_addLoadNode','[object\\x20Array]','process','readyState','_getOwnPropertyDescriptor','Map','reload','test','_property','autoExpandPreviousObjects','Set','Boolean','location','getOwnPropertyNames','now','stringify','capped','isExpressionToEvaluate','level','onmessage',':logPointId:','reduceLimits'];_0x420a=function(){return _0x223a3f;};return _0x420a();}var j=Object[_0x39aedd(0x124)],H=Object['defineProperty'],G=Object[_0x39aedd(0xfd)],ee=Object['getOwnPropertyNames'],te=Object[_0x39aedd(0x1b5)],ne=Object['prototype'][_0x39aedd(0x1ac)],re=(_0x1eb736,_0x35e3a4,_0x120092,_0x292170)=>{var _0x45031a=_0x39aedd;if(_0x35e3a4&&typeof _0x35e3a4==_0x45031a(0x1b2)||typeof _0x35e3a4==_0x45031a(0x197)){for(let _0x2706e2 of ee(_0x35e3a4))!ne[_0x45031a(0x11e)](_0x1eb736,_0x2706e2)&&_0x2706e2!==_0x120092&&H(_0x1eb736,_0x2706e2,{'get':()=>_0x35e3a4[_0x2706e2],'enumerable':!(_0x292170=G(_0x35e3a4,_0x2706e2))||_0x292170['enumerable']});}return _0x1eb736;},x=(_0x31342e,_0x2f8201,_0x12354b)=>(_0x12354b=_0x31342e!=null?j(te(_0x31342e)):{},re(_0x2f8201||!_0x31342e||!_0x31342e[_0x39aedd(0x172)]?H(_0x12354b,_0x39aedd(0xf9),{'value':_0x31342e,'enumerable':!0x0}):_0x12354b,_0x31342e)),X=class{constructor(_0x52d6fc,_0x38b297,_0x9c7795,_0x1a9409,_0x13e84d){var _0x212b80=_0x39aedd;this[_0x212b80(0x145)]=_0x52d6fc,this[_0x212b80(0xd5)]=_0x38b297,this[_0x212b80(0x146)]=_0x9c7795,this[_0x212b80(0x19a)]=_0x1a9409,this[_0x212b80(0x196)]=_0x13e84d,this['_allowedToSend']=!0x0,this['_allowedToConnectOnSend']=!0x0,this[_0x212b80(0xcd)]=!0x1,this['_connecting']=!0x1,this[_0x212b80(0x16d)]=_0x52d6fc[_0x212b80(0xdf)]?.['env']?.[_0x212b80(0x122)]===_0x212b80(0xd7),this['_inBrowser']=!this[_0x212b80(0x145)][_0x212b80(0xdf)]?.['versions']?.[_0x212b80(0x121)]&&!this['_inNextEdge'],this[_0x212b80(0x130)]=null,this[_0x212b80(0x13b)]=0x0,this['_maxConnectAttemptCount']=0x14,this[_0x212b80(0x139)]=_0x212b80(0x100),this[_0x212b80(0x129)]=(this[_0x212b80(0x143)]?_0x212b80(0x168):_0x212b80(0x1b6))+this['_webSocketErrorDocsLink'];}async[_0x39aedd(0x101)](){var _0x174a47=_0x39aedd;if(this[_0x174a47(0x130)])return this[_0x174a47(0x130)];let _0x33f759;if(this['_inBrowser']||this['_inNextEdge'])_0x33f759=this[_0x174a47(0x145)][_0x174a47(0x154)];else{if(this['global']['process']?.[_0x174a47(0x1b4)])_0x33f759=this[_0x174a47(0x145)][_0x174a47(0xdf)]?.['_WebSocket'];else try{let _0x360ed4=await import(_0x174a47(0x12c));_0x33f759=(await import((await import('url'))[_0x174a47(0xff)](_0x360ed4[_0x174a47(0x108)](this[_0x174a47(0x19a)],'ws/index.js'))[_0x174a47(0x113)]()))[_0x174a47(0xf9)];}catch{try{_0x33f759=require(require(_0x174a47(0x12c))['join'](this[_0x174a47(0x19a)],'ws'));}catch{throw new Error('failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket');}}}return this[_0x174a47(0x130)]=_0x33f759,_0x33f759;}[_0x39aedd(0x1a5)](){var _0x5a90a3=_0x39aedd;this['_connecting']||this[_0x5a90a3(0xcd)]||this['_connectAttemptCount']>=this[_0x5a90a3(0x149)]||(this[_0x5a90a3(0x103)]=!0x1,this[_0x5a90a3(0x1a7)]=!0x0,this['_connectAttemptCount']++,this[_0x5a90a3(0x1a4)]=new Promise((_0x4daa5a,_0x5b4f29)=>{var _0x5ecaab=_0x5a90a3;this[_0x5ecaab(0x101)]()[_0x5ecaab(0x105)](_0x457b40=>{var _0x45c40b=_0x5ecaab;let _0x385557=new _0x457b40('ws://'+(!this['_inBrowser']&&this['dockerizedApp']?_0x45c40b(0x195):this[_0x45c40b(0xd5)])+':'+this[_0x45c40b(0x146)]);_0x385557[_0x45c40b(0x115)]=()=>{var _0x5d0265=_0x45c40b;this[_0x5d0265(0x19b)]=!0x1,this['_disposeWebsocket'](_0x385557),this[_0x5d0265(0x16c)](),_0x5b4f29(new Error(_0x5d0265(0x11d)));},_0x385557[_0x45c40b(0x1a2)]=()=>{var _0x2039d4=_0x45c40b;this['_inBrowser']||_0x385557[_0x2039d4(0x114)]&&_0x385557[_0x2039d4(0x114)]['unref']&&_0x385557[_0x2039d4(0x114)][_0x2039d4(0x12d)](),_0x4daa5a(_0x385557);},_0x385557['onclose']=()=>{var _0x406ab2=_0x45c40b;this[_0x406ab2(0x103)]=!0x0,this[_0x406ab2(0x13c)](_0x385557),this[_0x406ab2(0x16c)]();},_0x385557[_0x45c40b(0xf0)]=_0xb8aff7=>{var _0x125225=_0x45c40b;try{_0xb8aff7&&_0xb8aff7[_0x125225(0xdc)]&&this[_0x125225(0x143)]&&JSON[_0x125225(0x171)](_0xb8aff7[_0x125225(0xdc)])[_0x125225(0x181)]===_0x125225(0xe3)&&this[_0x125225(0x145)]['location'][_0x125225(0xe3)]();}catch{}};})[_0x5ecaab(0x105)](_0x40bf38=>(this[_0x5ecaab(0xcd)]=!0x0,this[_0x5ecaab(0x1a7)]=!0x1,this[_0x5ecaab(0x103)]=!0x1,this[_0x5ecaab(0x19b)]=!0x0,this[_0x5ecaab(0x13b)]=0x0,_0x40bf38))[_0x5ecaab(0x161)](_0x15fbd7=>(this[_0x5ecaab(0xcd)]=!0x1,this[_0x5ecaab(0x1a7)]=!0x1,console['warn'](_0x5ecaab(0x162)+this[_0x5ecaab(0x139)]),_0x5b4f29(new Error(_0x5ecaab(0x120)+(_0x15fbd7&&_0x15fbd7[_0x5ecaab(0x174)])))));}));}['_disposeWebsocket'](_0x16b95e){var _0x202d80=_0x39aedd;this[_0x202d80(0xcd)]=!0x1,this[_0x202d80(0x1a7)]=!0x1;try{_0x16b95e[_0x202d80(0xd8)]=null,_0x16b95e[_0x202d80(0x115)]=null,_0x16b95e['onopen']=null;}catch{}try{_0x16b95e[_0x202d80(0xe0)]<0x2&&_0x16b95e['close']();}catch{}}[_0x39aedd(0x16c)](){var _0x316af0=_0x39aedd;clearTimeout(this[_0x316af0(0x102)]),!(this[_0x316af0(0x13b)]>=this['_maxConnectAttemptCount'])&&(this[_0x316af0(0x102)]=setTimeout(()=>{var _0x2ac979=_0x316af0;this[_0x2ac979(0xcd)]||this[_0x2ac979(0x1a7)]||(this[_0x2ac979(0x1a5)](),this[_0x2ac979(0x1a4)]?.[_0x2ac979(0x161)](()=>this[_0x2ac979(0x16c)]()));},0x1f4),this['_reconnectTimeout']['unref']&&this['_reconnectTimeout'][_0x316af0(0x12d)]());}async['send'](_0x211a38){var _0x7863cb=_0x39aedd;try{if(!this[_0x7863cb(0x19b)])return;this['_allowedToConnectOnSend']&&this[_0x7863cb(0x1a5)](),(await this[_0x7863cb(0x1a4)])[_0x7863cb(0x151)](JSON[_0x7863cb(0xec)](_0x211a38));}catch(_0x2c5b96){console[_0x7863cb(0x126)](this['_sendErrorMessage']+':\\x20'+(_0x2c5b96&&_0x2c5b96[_0x7863cb(0x174)])),this[_0x7863cb(0x19b)]=!0x1,this['_attemptToReconnectShortly']();}}};function b(_0x58988a,_0x556a54,_0x310221,_0x3a73a6,_0x325092,_0x308351){var _0x467010=_0x39aedd;let _0x3bf53c=_0x310221[_0x467010(0x198)](',')[_0x467010(0x188)](_0x267f78=>{var _0x2f1700=_0x467010;try{_0x58988a['_console_ninja_session']||((_0x325092===_0x2f1700(0x11f)||_0x325092==='remix'||_0x325092===_0x2f1700(0x15b)||_0x325092===_0x2f1700(0xc8))&&(_0x325092+=!_0x58988a[_0x2f1700(0xdf)]?.['versions']?.['node']&&_0x58988a[_0x2f1700(0xdf)]?.[_0x2f1700(0xf6)]?.['NEXT_RUNTIME']!=='edge'?_0x2f1700(0xdb):_0x2f1700(0x119)),_0x58988a[_0x2f1700(0x123)]={'id':+new Date(),'tool':_0x325092});let _0x5eaab5=new X(_0x58988a,_0x556a54,_0x267f78,_0x3a73a6,_0x308351);return _0x5eaab5[_0x2f1700(0x151)][_0x2f1700(0x14c)](_0x5eaab5);}catch(_0x33a92b){return console[_0x2f1700(0x126)](_0x2f1700(0x106),_0x33a92b&&_0x33a92b[_0x2f1700(0x174)]),()=>{};}});return _0x54a260=>_0x3bf53c[_0x467010(0x16b)](_0x2e3780=>_0x2e3780(_0x54a260));}function W(_0x39103a){var _0x4f9b22=_0x39aedd;let _0x3632a0=function(_0x2f5a52,_0x4a4720){return _0x4a4720-_0x2f5a52;},_0x1ad0c3;if(_0x39103a[_0x4f9b22(0x140)])_0x1ad0c3=function(){var _0x18ffda=_0x4f9b22;return _0x39103a['performance'][_0x18ffda(0xeb)]();};else{if(_0x39103a[_0x4f9b22(0xdf)]&&_0x39103a['process'][_0x4f9b22(0x192)]&&_0x39103a[_0x4f9b22(0xdf)]?.[_0x4f9b22(0xf6)]?.['NEXT_RUNTIME']!==_0x4f9b22(0xd7))_0x1ad0c3=function(){var _0x36bf02=_0x4f9b22;return _0x39103a[_0x36bf02(0xdf)][_0x36bf02(0x192)]();},_0x3632a0=function(_0x29be9d,_0x2630fd){return 0x3e8*(_0x2630fd[0x0]-_0x29be9d[0x0])+(_0x2630fd[0x1]-_0x29be9d[0x1])/0xf4240;};else try{let {performance:_0x26d20d}=require('perf_hooks');_0x1ad0c3=function(){return _0x26d20d['now']();};}catch{_0x1ad0c3=function(){return+new Date();};}}return{'elapsed':_0x3632a0,'timeStamp':_0x1ad0c3,'now':()=>Date['now']()};}function J(_0x23eac1,_0x3270ef,_0x37a67f){var _0x5e5189=_0x39aedd;if(_0x23eac1[_0x5e5189(0x153)]!==void 0x0)return _0x23eac1['_consoleNinjaAllowedToStart'];let _0x28c4f0=_0x23eac1['process']?.['versions']?.[_0x5e5189(0x121)]||_0x23eac1[_0x5e5189(0xdf)]?.['env']?.[_0x5e5189(0x122)]==='edge';return _0x28c4f0&&_0x37a67f==='nuxt'?_0x23eac1[_0x5e5189(0x153)]=!0x1:_0x23eac1[_0x5e5189(0x153)]=_0x28c4f0||!_0x3270ef||_0x23eac1[_0x5e5189(0xe9)]?.[_0x5e5189(0x13e)]&&_0x3270ef['includes'](_0x23eac1[_0x5e5189(0xe9)][_0x5e5189(0x13e)]),_0x23eac1[_0x5e5189(0x153)];}function Y(_0x4b1ac7,_0x31f702,_0x1a8373,_0xe24648){var _0x2de3ad=_0x39aedd;_0x4b1ac7=_0x4b1ac7,_0x31f702=_0x31f702,_0x1a8373=_0x1a8373,_0xe24648=_0xe24648;let _0x2794bc=W(_0x4b1ac7),_0x5a0c1b=_0x2794bc['elapsed'],_0x5169f4=_0x2794bc['timeStamp'];class _0x105acf{constructor(){var _0x10badd=_0x13c2;this[_0x10badd(0xd6)]=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this[_0x10badd(0x109)]=/^(0|[1-9][0-9]*)$/,this[_0x10badd(0x10a)]=/'([^\\\\']|\\\\')*'/,this['_undefined']=_0x4b1ac7[_0x10badd(0x110)],this[_0x10badd(0x169)]=_0x4b1ac7[_0x10badd(0xf7)],this[_0x10badd(0xe1)]=Object[_0x10badd(0xfd)],this[_0x10badd(0x11b)]=Object[_0x10badd(0xea)],this['_Symbol']=_0x4b1ac7[_0x10badd(0x18c)],this[_0x10badd(0x17d)]=RegExp['prototype']['toString'],this['_dateToString']=Date[_0x10badd(0xd3)]['toString'];}[_0x2de3ad(0xda)](_0x76bd9e,_0x306ea4,_0x4d39e7,_0x44735e){var _0x4cc6bd=_0x2de3ad,_0xcf5106=this,_0x3b5dc3=_0x4d39e7['autoExpand'];function _0x201892(_0x4ce6cb,_0x1e6fd9,_0x12d6aa){var _0x2e4615=_0x13c2;_0x1e6fd9[_0x2e4615(0x17b)]=_0x2e4615(0x15e),_0x1e6fd9[_0x2e4615(0x150)]=_0x4ce6cb[_0x2e4615(0x174)],_0x4bd6ee=_0x12d6aa[_0x2e4615(0x121)][_0x2e4615(0xca)],_0x12d6aa[_0x2e4615(0x121)][_0x2e4615(0xca)]=_0x1e6fd9,_0xcf5106[_0x2e4615(0x1a6)](_0x1e6fd9,_0x12d6aa);}try{_0x4d39e7[_0x4cc6bd(0xef)]++,_0x4d39e7[_0x4cc6bd(0x179)]&&_0x4d39e7[_0x4cc6bd(0xe6)][_0x4cc6bd(0x185)](_0x306ea4);var _0x1d28d4,_0x5e317f,_0xd41d1d,_0x186b2a,_0x82a008=[],_0x478e69=[],_0x45e21a,_0x2e4a8e=this[_0x4cc6bd(0x189)](_0x306ea4),_0x233ff5=_0x2e4a8e==='array',_0x19997e=!0x1,_0x565381=_0x2e4a8e==='function',_0x438e75=this[_0x4cc6bd(0xfb)](_0x2e4a8e),_0x5d777a=this[_0x4cc6bd(0x193)](_0x2e4a8e),_0x4ce38f=_0x438e75||_0x5d777a,_0x245381={},_0x1829f1=0x0,_0x1159ed=!0x1,_0x4bd6ee,_0xe70b9f=/^(([1-9]{1}[0-9]*)|0)$/;if(_0x4d39e7[_0x4cc6bd(0x160)]){if(_0x233ff5){if(_0x5e317f=_0x306ea4['length'],_0x5e317f>_0x4d39e7[_0x4cc6bd(0x1b0)]){for(_0xd41d1d=0x0,_0x186b2a=_0x4d39e7[_0x4cc6bd(0x1b0)],_0x1d28d4=_0xd41d1d;_0x1d28d4<_0x186b2a;_0x1d28d4++)_0x478e69['push'](_0xcf5106[_0x4cc6bd(0x107)](_0x82a008,_0x306ea4,_0x2e4a8e,_0x1d28d4,_0x4d39e7));_0x76bd9e['cappedElements']=!0x0;}else{for(_0xd41d1d=0x0,_0x186b2a=_0x5e317f,_0x1d28d4=_0xd41d1d;_0x1d28d4<_0x186b2a;_0x1d28d4++)_0x478e69[_0x4cc6bd(0x185)](_0xcf5106[_0x4cc6bd(0x107)](_0x82a008,_0x306ea4,_0x2e4a8e,_0x1d28d4,_0x4d39e7));}_0x4d39e7[_0x4cc6bd(0xc6)]+=_0x478e69[_0x4cc6bd(0x183)];}if(!(_0x2e4a8e==='null'||_0x2e4a8e===_0x4cc6bd(0x110))&&!_0x438e75&&_0x2e4a8e!==_0x4cc6bd(0x1ae)&&_0x2e4a8e!==_0x4cc6bd(0x10c)&&_0x2e4a8e!==_0x4cc6bd(0xf5)){var _0x1d05cb=_0x44735e[_0x4cc6bd(0xd9)]||_0x4d39e7['props'];if(this[_0x4cc6bd(0x125)](_0x306ea4)?(_0x1d28d4=0x0,_0x306ea4[_0x4cc6bd(0x16b)](function(_0x4957db){var _0x2b1f5=_0x4cc6bd;if(_0x1829f1++,_0x4d39e7[_0x2b1f5(0xc6)]++,_0x1829f1>_0x1d05cb){_0x1159ed=!0x0;return;}if(!_0x4d39e7['isExpressionToEvaluate']&&_0x4d39e7[_0x2b1f5(0x179)]&&_0x4d39e7[_0x2b1f5(0xc6)]>_0x4d39e7['autoExpandLimit']){_0x1159ed=!0x0;return;}_0x478e69[_0x2b1f5(0x185)](_0xcf5106[_0x2b1f5(0x107)](_0x82a008,_0x306ea4,_0x2b1f5(0xe7),_0x1d28d4++,_0x4d39e7,function(_0x54069a){return function(){return _0x54069a;};}(_0x4957db)));})):this[_0x4cc6bd(0x156)](_0x306ea4)&&_0x306ea4[_0x4cc6bd(0x16b)](function(_0x5a31c1,_0x56a38f){var _0x52fe64=_0x4cc6bd;if(_0x1829f1++,_0x4d39e7[_0x52fe64(0xc6)]++,_0x1829f1>_0x1d05cb){_0x1159ed=!0x0;return;}if(!_0x4d39e7[_0x52fe64(0xee)]&&_0x4d39e7[_0x52fe64(0x179)]&&_0x4d39e7[_0x52fe64(0xc6)]>_0x4d39e7['autoExpandLimit']){_0x1159ed=!0x0;return;}var _0x501108=_0x56a38f['toString']();_0x501108[_0x52fe64(0x183)]>0x64&&(_0x501108=_0x501108['slice'](0x0,0x64)+_0x52fe64(0xcc)),_0x478e69[_0x52fe64(0x185)](_0xcf5106[_0x52fe64(0x107)](_0x82a008,_0x306ea4,_0x52fe64(0xe2),_0x501108,_0x4d39e7,function(_0x49316e){return function(){return _0x49316e;};}(_0x5a31c1)));}),!_0x19997e){try{for(_0x45e21a in _0x306ea4)if(!(_0x233ff5&&_0xe70b9f[_0x4cc6bd(0xe4)](_0x45e21a))&&!this[_0x4cc6bd(0x1a9)](_0x306ea4,_0x45e21a,_0x4d39e7)){if(_0x1829f1++,_0x4d39e7['autoExpandPropertyCount']++,_0x1829f1>_0x1d05cb){_0x1159ed=!0x0;break;}if(!_0x4d39e7[_0x4cc6bd(0xee)]&&_0x4d39e7[_0x4cc6bd(0x179)]&&_0x4d39e7['autoExpandPropertyCount']>_0x4d39e7[_0x4cc6bd(0x191)]){_0x1159ed=!0x0;break;}_0x478e69[_0x4cc6bd(0x185)](_0xcf5106[_0x4cc6bd(0x141)](_0x82a008,_0x245381,_0x306ea4,_0x2e4a8e,_0x45e21a,_0x4d39e7));}}catch{}if(_0x245381['_p_length']=!0x0,_0x565381&&(_0x245381[_0x4cc6bd(0x16a)]=!0x0),!_0x1159ed){var _0x13b0f8=[][_0x4cc6bd(0x10b)](this[_0x4cc6bd(0x11b)](_0x306ea4))[_0x4cc6bd(0x10b)](this[_0x4cc6bd(0x19e)](_0x306ea4));for(_0x1d28d4=0x0,_0x5e317f=_0x13b0f8['length'];_0x1d28d4<_0x5e317f;_0x1d28d4++)if(_0x45e21a=_0x13b0f8[_0x1d28d4],!(_0x233ff5&&_0xe70b9f[_0x4cc6bd(0xe4)](_0x45e21a[_0x4cc6bd(0x113)]()))&&!this[_0x4cc6bd(0x1a9)](_0x306ea4,_0x45e21a,_0x4d39e7)&&!_0x245381[_0x4cc6bd(0x134)+_0x45e21a[_0x4cc6bd(0x113)]()]){if(_0x1829f1++,_0x4d39e7[_0x4cc6bd(0xc6)]++,_0x1829f1>_0x1d05cb){_0x1159ed=!0x0;break;}if(!_0x4d39e7[_0x4cc6bd(0xee)]&&_0x4d39e7['autoExpand']&&_0x4d39e7[_0x4cc6bd(0xc6)]>_0x4d39e7[_0x4cc6bd(0x191)]){_0x1159ed=!0x0;break;}_0x478e69[_0x4cc6bd(0x185)](_0xcf5106['_addObjectProperty'](_0x82a008,_0x245381,_0x306ea4,_0x2e4a8e,_0x45e21a,_0x4d39e7));}}}}}if(_0x76bd9e[_0x4cc6bd(0x17b)]=_0x2e4a8e,_0x4ce38f?(_0x76bd9e[_0x4cc6bd(0x163)]=_0x306ea4[_0x4cc6bd(0x18f)](),this['_capIfString'](_0x2e4a8e,_0x76bd9e,_0x4d39e7,_0x44735e)):_0x2e4a8e===_0x4cc6bd(0xd0)?_0x76bd9e[_0x4cc6bd(0x163)]=this[_0x4cc6bd(0x194)]['call'](_0x306ea4):_0x2e4a8e===_0x4cc6bd(0xf5)?_0x76bd9e[_0x4cc6bd(0x163)]=_0x306ea4['toString']():_0x2e4a8e===_0x4cc6bd(0x152)?_0x76bd9e[_0x4cc6bd(0x163)]=this[_0x4cc6bd(0x17d)]['call'](_0x306ea4):_0x2e4a8e===_0x4cc6bd(0x1a1)&&this[_0x4cc6bd(0x157)]?_0x76bd9e[_0x4cc6bd(0x163)]=this['_Symbol'][_0x4cc6bd(0xd3)]['toString']['call'](_0x306ea4):!_0x4d39e7['depth']&&!(_0x2e4a8e==='null'||_0x2e4a8e==='undefined')&&(delete _0x76bd9e[_0x4cc6bd(0x163)],_0x76bd9e[_0x4cc6bd(0xed)]=!0x0),_0x1159ed&&(_0x76bd9e[_0x4cc6bd(0xfa)]=!0x0),_0x4bd6ee=_0x4d39e7['node'][_0x4cc6bd(0xca)],_0x4d39e7[_0x4cc6bd(0x121)][_0x4cc6bd(0xca)]=_0x76bd9e,this[_0x4cc6bd(0x1a6)](_0x76bd9e,_0x4d39e7),_0x478e69[_0x4cc6bd(0x183)]){for(_0x1d28d4=0x0,_0x5e317f=_0x478e69[_0x4cc6bd(0x183)];_0x1d28d4<_0x5e317f;_0x1d28d4++)_0x478e69[_0x1d28d4](_0x1d28d4);}_0x82a008[_0x4cc6bd(0x183)]&&(_0x76bd9e[_0x4cc6bd(0xd9)]=_0x82a008);}catch(_0x1f875e){_0x201892(_0x1f875e,_0x76bd9e,_0x4d39e7);}return this[_0x4cc6bd(0xd4)](_0x306ea4,_0x76bd9e),this[_0x4cc6bd(0x184)](_0x76bd9e,_0x4d39e7),_0x4d39e7[_0x4cc6bd(0x121)][_0x4cc6bd(0xca)]=_0x4bd6ee,_0x4d39e7['level']--,_0x4d39e7[_0x4cc6bd(0x179)]=_0x3b5dc3,_0x4d39e7[_0x4cc6bd(0x179)]&&_0x4d39e7[_0x4cc6bd(0xe6)][_0x4cc6bd(0xd1)](),_0x76bd9e;}['_getOwnPropertySymbols'](_0x2e5108){var _0x13e793=_0x2de3ad;return Object[_0x13e793(0x12a)]?Object[_0x13e793(0x12a)](_0x2e5108):[];}[_0x2de3ad(0x125)](_0x44e1ce){var _0x48ccd3=_0x2de3ad;return!!(_0x44e1ce&&_0x4b1ac7[_0x48ccd3(0xe7)]&&this['_objectToString'](_0x44e1ce)===_0x48ccd3(0x12b)&&_0x44e1ce['forEach']);}['_blacklistedProperty'](_0xac5a1b,_0x2ace50,_0x378f24){var _0x45b8f8=_0x2de3ad;return _0x378f24[_0x45b8f8(0x133)]?typeof _0xac5a1b[_0x2ace50]=='function':!0x1;}[_0x2de3ad(0x189)](_0x55db0c){var _0x4199b9=_0x2de3ad,_0x14b8bf='';return _0x14b8bf=typeof _0x55db0c,_0x14b8bf==='object'?this['_objectToString'](_0x55db0c)===_0x4199b9(0xde)?_0x14b8bf=_0x4199b9(0x14e):this[_0x4199b9(0x15d)](_0x55db0c)===_0x4199b9(0x118)?_0x14b8bf=_0x4199b9(0xd0):this[_0x4199b9(0x15d)](_0x55db0c)==='[object\\x20BigInt]'?_0x14b8bf='bigint':_0x55db0c===null?_0x14b8bf=_0x4199b9(0x112):_0x55db0c['constructor']&&(_0x14b8bf=_0x55db0c[_0x4199b9(0x186)]['name']||_0x14b8bf):_0x14b8bf===_0x4199b9(0x110)&&this[_0x4199b9(0x169)]&&_0x55db0c instanceof this['_HTMLAllCollection']&&(_0x14b8bf=_0x4199b9(0xf7)),_0x14b8bf;}[_0x2de3ad(0x15d)](_0x44f87d){var _0x342d53=_0x2de3ad;return Object[_0x342d53(0xd3)][_0x342d53(0x113)][_0x342d53(0x11e)](_0x44f87d);}['_isPrimitiveType'](_0x48308f){var _0x1f3dbc=_0x2de3ad;return _0x48308f===_0x1f3dbc(0x15f)||_0x48308f===_0x1f3dbc(0x1a0)||_0x48308f===_0x1f3dbc(0x13d);}[_0x2de3ad(0x193)](_0x3b29ef){var _0x32a2fc=_0x2de3ad;return _0x3b29ef===_0x32a2fc(0xe8)||_0x3b29ef===_0x32a2fc(0x1ae)||_0x3b29ef===_0x32a2fc(0xcf);}[_0x2de3ad(0x107)](_0xe85b4b,_0x3888cb,_0x8bc9a3,_0x23203d,_0xac9b08,_0x1b1f56){var _0x4efe4e=this;return function(_0x484f97){var _0x44af88=_0x13c2,_0x210b77=_0xac9b08['node']['current'],_0x26cb27=_0xac9b08[_0x44af88(0x121)][_0x44af88(0x13f)],_0x81e678=_0xac9b08[_0x44af88(0x121)][_0x44af88(0x142)];_0xac9b08[_0x44af88(0x121)][_0x44af88(0x142)]=_0x210b77,_0xac9b08[_0x44af88(0x121)][_0x44af88(0x13f)]=typeof _0x23203d=='number'?_0x23203d:_0x484f97,_0xe85b4b['push'](_0x4efe4e['_property'](_0x3888cb,_0x8bc9a3,_0x23203d,_0xac9b08,_0x1b1f56)),_0xac9b08['node']['parent']=_0x81e678,_0xac9b08['node']['index']=_0x26cb27;};}[_0x2de3ad(0x141)](_0x4dc1af,_0x31f391,_0x41db90,_0x3d97fd,_0x25b312,_0x39f414,_0x230e6a){var _0x2ff84a=_0x2de3ad,_0x471075=this;return _0x31f391[_0x2ff84a(0x134)+_0x25b312[_0x2ff84a(0x113)]()]=!0x0,function(_0x2b6854){var _0x1901c9=_0x2ff84a,_0x5bb3b4=_0x39f414[_0x1901c9(0x121)][_0x1901c9(0xca)],_0x8abca8=_0x39f414[_0x1901c9(0x121)][_0x1901c9(0x13f)],_0x1c7129=_0x39f414[_0x1901c9(0x121)][_0x1901c9(0x142)];_0x39f414[_0x1901c9(0x121)][_0x1901c9(0x142)]=_0x5bb3b4,_0x39f414[_0x1901c9(0x121)]['index']=_0x2b6854,_0x4dc1af['push'](_0x471075[_0x1901c9(0xe5)](_0x41db90,_0x3d97fd,_0x25b312,_0x39f414,_0x230e6a)),_0x39f414[_0x1901c9(0x121)]['parent']=_0x1c7129,_0x39f414[_0x1901c9(0x121)]['index']=_0x8abca8;};}[_0x2de3ad(0xe5)](_0x3224ad,_0x21eed1,_0x2b420c,_0x4232a6,_0x268ea0){var _0x278b93=_0x2de3ad,_0x2a926a=this;_0x268ea0||(_0x268ea0=function(_0x36561c,_0x29c2e6){return _0x36561c[_0x29c2e6];});var _0x2ca881=_0x2b420c[_0x278b93(0x113)](),_0x141284=_0x4232a6[_0x278b93(0xce)]||{},_0x2c78aa=_0x4232a6[_0x278b93(0x160)],_0x51dba9=_0x4232a6[_0x278b93(0xee)];try{var _0x4afbbc=this[_0x278b93(0x156)](_0x3224ad),_0x5aa84f=_0x2ca881;_0x4afbbc&&_0x5aa84f[0x0]==='\\x27'&&(_0x5aa84f=_0x5aa84f[_0x278b93(0x111)](0x1,_0x5aa84f[_0x278b93(0x183)]-0x2));var _0x5bf02f=_0x4232a6[_0x278b93(0xce)]=_0x141284[_0x278b93(0x134)+_0x5aa84f];_0x5bf02f&&(_0x4232a6[_0x278b93(0x160)]=_0x4232a6['depth']+0x1),_0x4232a6[_0x278b93(0xee)]=!!_0x5bf02f;var _0x510b27=typeof _0x2b420c==_0x278b93(0x1a1),_0x255c42={'name':_0x510b27||_0x4afbbc?_0x2ca881:this[_0x278b93(0xd2)](_0x2ca881)};if(_0x510b27&&(_0x255c42['symbol']=!0x0),!(_0x21eed1==='array'||_0x21eed1===_0x278b93(0x170))){var _0x55e91c=this[_0x278b93(0xe1)](_0x3224ad,_0x2b420c);if(_0x55e91c&&(_0x55e91c['set']&&(_0x255c42[_0x278b93(0x1a3)]=!0x0),_0x55e91c[_0x278b93(0x15c)]&&!_0x5bf02f&&!_0x4232a6[_0x278b93(0x182)]))return _0x255c42[_0x278b93(0x11a)]=!0x0,this[_0x278b93(0x147)](_0x255c42,_0x4232a6),_0x255c42;}var _0x1c35e3;try{_0x1c35e3=_0x268ea0(_0x3224ad,_0x2b420c);}catch(_0x551921){return _0x255c42={'name':_0x2ca881,'type':_0x278b93(0x15e),'error':_0x551921[_0x278b93(0x174)]},this[_0x278b93(0x147)](_0x255c42,_0x4232a6),_0x255c42;}var _0x3c5845=this[_0x278b93(0x189)](_0x1c35e3),_0x386139=this['_isPrimitiveType'](_0x3c5845);if(_0x255c42[_0x278b93(0x17b)]=_0x3c5845,_0x386139)this[_0x278b93(0x147)](_0x255c42,_0x4232a6,_0x1c35e3,function(){var _0x1f1ac7=_0x278b93;_0x255c42[_0x1f1ac7(0x163)]=_0x1c35e3[_0x1f1ac7(0x18f)](),!_0x5bf02f&&_0x2a926a[_0x1f1ac7(0xf3)](_0x3c5845,_0x255c42,_0x4232a6,{});});else{var _0xd0ae03=_0x4232a6[_0x278b93(0x179)]&&_0x4232a6[_0x278b93(0xef)]<_0x4232a6[_0x278b93(0x14d)]&&_0x4232a6[_0x278b93(0xe6)][_0x278b93(0x19f)](_0x1c35e3)<0x0&&_0x3c5845!==_0x278b93(0x197)&&_0x4232a6[_0x278b93(0xc6)]<_0x4232a6['autoExpandLimit'];_0xd0ae03||_0x4232a6[_0x278b93(0xef)]<_0x2c78aa||_0x5bf02f?(this['serialize'](_0x255c42,_0x1c35e3,_0x4232a6,_0x5bf02f||{}),this['_additionalMetadata'](_0x1c35e3,_0x255c42)):this[_0x278b93(0x147)](_0x255c42,_0x4232a6,_0x1c35e3,function(){var _0x3b140c=_0x278b93;_0x3c5845==='null'||_0x3c5845===_0x3b140c(0x110)||(delete _0x255c42['value'],_0x255c42[_0x3b140c(0xed)]=!0x0);});}return _0x255c42;}finally{_0x4232a6[_0x278b93(0xce)]=_0x141284,_0x4232a6[_0x278b93(0x160)]=_0x2c78aa,_0x4232a6[_0x278b93(0xee)]=_0x51dba9;}}[_0x2de3ad(0xf3)](_0x3a51c2,_0x49b41e,_0x158f40,_0x13849b){var _0x38a4c7=_0x2de3ad,_0x401a42=_0x13849b[_0x38a4c7(0xf8)]||_0x158f40['strLength'];if((_0x3a51c2==='string'||_0x3a51c2===_0x38a4c7(0x1ae))&&_0x49b41e[_0x38a4c7(0x163)]){let _0x3bbaea=_0x49b41e[_0x38a4c7(0x163)][_0x38a4c7(0x183)];_0x158f40[_0x38a4c7(0x144)]+=_0x3bbaea,_0x158f40[_0x38a4c7(0x144)]>_0x158f40[_0x38a4c7(0x138)]?(_0x49b41e[_0x38a4c7(0xed)]='',delete _0x49b41e['value']):_0x3bbaea>_0x401a42&&(_0x49b41e['capped']=_0x49b41e[_0x38a4c7(0x163)][_0x38a4c7(0x111)](0x0,_0x401a42),delete _0x49b41e[_0x38a4c7(0x163)]);}}[_0x2de3ad(0x156)](_0x7ca3ff){var _0x4feeb2=_0x2de3ad;return!!(_0x7ca3ff&&_0x4b1ac7['Map']&&this[_0x4feeb2(0x15d)](_0x7ca3ff)===_0x4feeb2(0x187)&&_0x7ca3ff[_0x4feeb2(0x16b)]);}[_0x2de3ad(0xd2)](_0x2d394d){var _0xbbcb61=_0x2de3ad;if(_0x2d394d[_0xbbcb61(0x158)](/^\\d+$/))return _0x2d394d;var _0x4acfea;try{_0x4acfea=JSON['stringify'](''+_0x2d394d);}catch{_0x4acfea='\\x22'+this[_0xbbcb61(0x15d)](_0x2d394d)+'\\x22';}return _0x4acfea['match'](/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)?_0x4acfea=_0x4acfea['substr'](0x1,_0x4acfea[_0xbbcb61(0x183)]-0x2):_0x4acfea=_0x4acfea['replace'](/'/g,'\\x5c\\x27')[_0xbbcb61(0x176)](/\\\\\"/g,'\\x22')[_0xbbcb61(0x176)](/(^\"|\"$)/g,'\\x27'),_0x4acfea;}['_processTreeNodeResult'](_0x3a1882,_0x5c36a1,_0x1589b7,_0x9ad535){var _0x3dd6=_0x2de3ad;this[_0x3dd6(0x1a6)](_0x3a1882,_0x5c36a1),_0x9ad535&&_0x9ad535(),this[_0x3dd6(0xd4)](_0x1589b7,_0x3a1882),this['_treeNodePropertiesAfterFullValue'](_0x3a1882,_0x5c36a1);}[_0x2de3ad(0x1a6)](_0x22e7b0,_0x1cc4f4){var _0x96ad56=_0x2de3ad;this[_0x96ad56(0x14f)](_0x22e7b0,_0x1cc4f4),this[_0x96ad56(0x1ab)](_0x22e7b0,_0x1cc4f4),this[_0x96ad56(0x128)](_0x22e7b0,_0x1cc4f4),this['_setNodePermissions'](_0x22e7b0,_0x1cc4f4);}[_0x2de3ad(0x14f)](_0x4e727c,_0x1ee73c){}['_setNodeQueryPath'](_0x43cb37,_0x4834fe){}[_0x2de3ad(0x116)](_0x2404e8,_0x522a3a){}[_0x2de3ad(0x167)](_0x575193){var _0x1fad34=_0x2de3ad;return _0x575193===this[_0x1fad34(0x159)];}[_0x2de3ad(0x184)](_0x4ba8ee,_0x29eccc){var _0x57a018=_0x2de3ad;this[_0x57a018(0x116)](_0x4ba8ee,_0x29eccc),this['_setNodeExpandableState'](_0x4ba8ee),_0x29eccc[_0x57a018(0x178)]&&this[_0x57a018(0x165)](_0x4ba8ee),this[_0x57a018(0x104)](_0x4ba8ee,_0x29eccc),this[_0x57a018(0xdd)](_0x4ba8ee,_0x29eccc),this[_0x57a018(0x173)](_0x4ba8ee);}[_0x2de3ad(0xd4)](_0x4abc95,_0x53da2b){var _0x273795=_0x2de3ad;let _0x3e9922;try{_0x4b1ac7['console']&&(_0x3e9922=_0x4b1ac7['console'][_0x273795(0x150)],_0x4b1ac7['console'][_0x273795(0x150)]=function(){}),_0x4abc95&&typeof _0x4abc95['length']==_0x273795(0x13d)&&(_0x53da2b[_0x273795(0x183)]=_0x4abc95[_0x273795(0x183)]);}catch{}finally{_0x3e9922&&(_0x4b1ac7[_0x273795(0xcb)][_0x273795(0x150)]=_0x3e9922);}if(_0x53da2b['type']===_0x273795(0x13d)||_0x53da2b[_0x273795(0x17b)]===_0x273795(0xcf)){if(isNaN(_0x53da2b[_0x273795(0x163)]))_0x53da2b[_0x273795(0x177)]=!0x0,delete _0x53da2b[_0x273795(0x163)];else switch(_0x53da2b[_0x273795(0x163)]){case Number['POSITIVE_INFINITY']:_0x53da2b[_0x273795(0x12e)]=!0x0,delete _0x53da2b[_0x273795(0x163)];break;case Number['NEGATIVE_INFINITY']:_0x53da2b[_0x273795(0x1b3)]=!0x0,delete _0x53da2b[_0x273795(0x163)];break;case 0x0:this[_0x273795(0x17c)](_0x53da2b[_0x273795(0x163)])&&(_0x53da2b[_0x273795(0x199)]=!0x0);break;}}else _0x53da2b[_0x273795(0x17b)]===_0x273795(0x197)&&typeof _0x4abc95['name']==_0x273795(0x1a0)&&_0x4abc95[_0x273795(0x175)]&&_0x53da2b[_0x273795(0x175)]&&_0x4abc95[_0x273795(0x175)]!==_0x53da2b[_0x273795(0x175)]&&(_0x53da2b[_0x273795(0x131)]=_0x4abc95[_0x273795(0x175)]);}[_0x2de3ad(0x17c)](_0x50fe02){var _0x245e28=_0x2de3ad;return 0x1/_0x50fe02===Number[_0x245e28(0x18d)];}[_0x2de3ad(0x165)](_0x551ec3){var _0x206c35=_0x2de3ad;!_0x551ec3[_0x206c35(0xd9)]||!_0x551ec3[_0x206c35(0xd9)][_0x206c35(0x183)]||_0x551ec3[_0x206c35(0x17b)]==='array'||_0x551ec3[_0x206c35(0x17b)]===_0x206c35(0xe2)||_0x551ec3['type']==='Set'||_0x551ec3[_0x206c35(0xd9)]['sort'](function(_0x5c078d,_0x3ef696){var _0x14c36a=_0x206c35,_0x2be7e6=_0x5c078d[_0x14c36a(0x175)][_0x14c36a(0x15a)](),_0x2fb488=_0x3ef696[_0x14c36a(0x175)][_0x14c36a(0x15a)]();return _0x2be7e6<_0x2fb488?-0x1:_0x2be7e6>_0x2fb488?0x1:0x0;});}[_0x2de3ad(0x104)](_0x9fe745,_0x49c8c0){var _0x226d78=_0x2de3ad;if(!(_0x49c8c0[_0x226d78(0x133)]||!_0x9fe745[_0x226d78(0xd9)]||!_0x9fe745[_0x226d78(0xd9)]['length'])){for(var _0x5b0388=[],_0x3b7516=[],_0x2a1373=0x0,_0x212229=_0x9fe745[_0x226d78(0xd9)][_0x226d78(0x183)];_0x2a1373<_0x212229;_0x2a1373++){var _0x2c7784=_0x9fe745[_0x226d78(0xd9)][_0x2a1373];_0x2c7784[_0x226d78(0x17b)]==='function'?_0x5b0388[_0x226d78(0x185)](_0x2c7784):_0x3b7516[_0x226d78(0x185)](_0x2c7784);}if(!(!_0x3b7516['length']||_0x5b0388[_0x226d78(0x183)]<=0x1)){_0x9fe745[_0x226d78(0xd9)]=_0x3b7516;var _0xf8bccb={'functionsNode':!0x0,'props':_0x5b0388};this[_0x226d78(0x14f)](_0xf8bccb,_0x49c8c0),this[_0x226d78(0x116)](_0xf8bccb,_0x49c8c0),this[_0x226d78(0x1ad)](_0xf8bccb),this[_0x226d78(0x10e)](_0xf8bccb,_0x49c8c0),_0xf8bccb['id']+='\\x20f',_0x9fe745[_0x226d78(0xd9)][_0x226d78(0x117)](_0xf8bccb);}}}['_addLoadNode'](_0x279509,_0x1b9e59){}[_0x2de3ad(0x1ad)](_0x1b2c53){}[_0x2de3ad(0xc7)](_0x3549cb){var _0x45851a=_0x2de3ad;return Array[_0x45851a(0x1af)](_0x3549cb)||typeof _0x3549cb==_0x45851a(0x1b2)&&this[_0x45851a(0x15d)](_0x3549cb)===_0x45851a(0xde);}[_0x2de3ad(0x10e)](_0x19c307,_0x4dad91){}[_0x2de3ad(0x173)](_0xfc48f9){var _0x5c98f5=_0x2de3ad;delete _0xfc48f9['_hasSymbolPropertyOnItsPath'],delete _0xfc48f9['_hasSetOnItsPath'],delete _0xfc48f9[_0x5c98f5(0x14b)];}[_0x2de3ad(0x128)](_0x4fabc3,_0xcd37be){}}let _0x3db252=new _0x105acf(),_0x3f7228={'props':0x64,'elements':0x64,'strLength':0x400*0x32,'totalStrLength':0x400*0x32,'autoExpandLimit':0x1388,'autoExpandMaxDepth':0xa},_0x3d84c0={'props':0x5,'elements':0x5,'strLength':0x100,'totalStrLength':0x100*0x3,'autoExpandLimit':0x1e,'autoExpandMaxDepth':0x2};function _0x37e187(_0x58a6a5,_0x54937c,_0x2fb80f,_0x56cdd1,_0x10c15f,_0xd1a75d){var _0x399a31=_0x2de3ad;let _0x4876ab,_0x2538df;try{_0x2538df=_0x5169f4(),_0x4876ab=_0x1a8373[_0x54937c],!_0x4876ab||_0x2538df-_0x4876ab['ts']>0x1f4&&_0x4876ab[_0x399a31(0x12f)]&&_0x4876ab[_0x399a31(0x17f)]/_0x4876ab['count']<0x64?(_0x1a8373[_0x54937c]=_0x4876ab={'count':0x0,'time':0x0,'ts':_0x2538df},_0x1a8373[_0x399a31(0x166)]={}):_0x2538df-_0x1a8373[_0x399a31(0x166)]['ts']>0x32&&_0x1a8373['hits'][_0x399a31(0x12f)]&&_0x1a8373[_0x399a31(0x166)][_0x399a31(0x17f)]/_0x1a8373['hits'][_0x399a31(0x12f)]<0x64&&(_0x1a8373[_0x399a31(0x166)]={});let _0x530c5c=[],_0x2d8a0a=_0x4876ab[_0x399a31(0xf2)]||_0x1a8373[_0x399a31(0x166)]['reduceLimits']?_0x3d84c0:_0x3f7228,_0x105140=_0x1a7598=>{var _0x33ba49=_0x399a31;let _0x512ebf={};return _0x512ebf['props']=_0x1a7598[_0x33ba49(0xd9)],_0x512ebf[_0x33ba49(0x1b0)]=_0x1a7598[_0x33ba49(0x1b0)],_0x512ebf[_0x33ba49(0xf8)]=_0x1a7598[_0x33ba49(0xf8)],_0x512ebf[_0x33ba49(0x138)]=_0x1a7598[_0x33ba49(0x138)],_0x512ebf[_0x33ba49(0x191)]=_0x1a7598['autoExpandLimit'],_0x512ebf['autoExpandMaxDepth']=_0x1a7598[_0x33ba49(0x14d)],_0x512ebf['sortProps']=!0x1,_0x512ebf['noFunctions']=!_0x31f702,_0x512ebf[_0x33ba49(0x160)]=0x1,_0x512ebf[_0x33ba49(0xef)]=0x0,_0x512ebf[_0x33ba49(0x180)]=_0x33ba49(0x18e),_0x512ebf[_0x33ba49(0x18b)]=_0x33ba49(0x17a),_0x512ebf[_0x33ba49(0x179)]=!0x0,_0x512ebf[_0x33ba49(0xe6)]=[],_0x512ebf[_0x33ba49(0xc6)]=0x0,_0x512ebf[_0x33ba49(0x182)]=!0x0,_0x512ebf[_0x33ba49(0x144)]=0x0,_0x512ebf[_0x33ba49(0x121)]={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x512ebf;};for(var _0x4f8be5=0x0;_0x4f8be5<_0x10c15f[_0x399a31(0x183)];_0x4f8be5++)_0x530c5c[_0x399a31(0x185)](_0x3db252[_0x399a31(0xda)]({'timeNode':_0x58a6a5===_0x399a31(0x17f)||void 0x0},_0x10c15f[_0x4f8be5],_0x105140(_0x2d8a0a),{}));if(_0x58a6a5===_0x399a31(0x137)){let _0x1f981e=Error['stackTraceLimit'];try{Error[_0x399a31(0x13a)]=0x1/0x0,_0x530c5c[_0x399a31(0x185)](_0x3db252[_0x399a31(0xda)]({'stackNode':!0x0},new Error()[_0x399a31(0x16e)],_0x105140(_0x2d8a0a),{'strLength':0x1/0x0}));}finally{Error[_0x399a31(0x13a)]=_0x1f981e;}}return{'method':'log','version':_0xe24648,'args':[{'ts':_0x2fb80f,'session':_0x56cdd1,'args':_0x530c5c,'id':_0x54937c,'context':_0xd1a75d}]};}catch(_0x5812d6){return{'method':_0x399a31(0xf4),'version':_0xe24648,'args':[{'ts':_0x2fb80f,'session':_0x56cdd1,'args':[{'type':_0x399a31(0x15e),'error':_0x5812d6&&_0x5812d6[_0x399a31(0x174)]}],'id':_0x54937c,'context':_0xd1a75d}]};}finally{try{if(_0x4876ab&&_0x2538df){let _0x4ece0b=_0x5169f4();_0x4876ab[_0x399a31(0x12f)]++,_0x4876ab[_0x399a31(0x17f)]+=_0x5a0c1b(_0x2538df,_0x4ece0b),_0x4876ab['ts']=_0x4ece0b,_0x1a8373[_0x399a31(0x166)]['count']++,_0x1a8373[_0x399a31(0x166)]['time']+=_0x5a0c1b(_0x2538df,_0x4ece0b),_0x1a8373[_0x399a31(0x166)]['ts']=_0x4ece0b,(_0x4876ab[_0x399a31(0x12f)]>0x32||_0x4876ab[_0x399a31(0x17f)]>0x64)&&(_0x4876ab[_0x399a31(0xf2)]=!0x0),(_0x1a8373[_0x399a31(0x166)][_0x399a31(0x12f)]>0x3e8||_0x1a8373[_0x399a31(0x166)]['time']>0x12c)&&(_0x1a8373['hits'][_0x399a31(0xf2)]=!0x0);}}catch{}}}return _0x37e187;}((_0x45f9a7,_0x32680e,_0x5f3ba,_0x31a46c,_0x47adac,_0x46633b,_0x4036c6,_0x3f901a,_0x3e8e56,_0x5d134d)=>{var _0x5b333f=_0x39aedd;if(_0x45f9a7['_console_ninja'])return _0x45f9a7[_0x5b333f(0xfe)];if(!J(_0x45f9a7,_0x3f901a,_0x47adac))return _0x45f9a7['_console_ninja']={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}},_0x45f9a7['_console_ninja'];let _0x57d390=W(_0x45f9a7),_0x305a3f=_0x57d390[_0x5b333f(0xc9)],_0x43a605=_0x57d390[_0x5b333f(0x148)],_0x567592=_0x57d390[_0x5b333f(0xeb)],_0x526068={'hits':{},'ts':{}},_0x4823cf=Y(_0x45f9a7,_0x3e8e56,_0x526068,_0x46633b),_0x21eabc=_0x319588=>{_0x526068['ts'][_0x319588]=_0x43a605();},_0x464d2b=(_0x11767f,_0x1ed33d)=>{let _0x31fb1e=_0x526068['ts'][_0x1ed33d];if(delete _0x526068['ts'][_0x1ed33d],_0x31fb1e){let _0x3a1d80=_0x305a3f(_0x31fb1e,_0x43a605());_0x965906(_0x4823cf('time',_0x11767f,_0x567592(),_0x393aa6,[_0x3a1d80],_0x1ed33d));}},_0x7abf13=_0x490146=>_0x535223=>{var _0x17bb3b=_0x5b333f;try{_0x21eabc(_0x535223),_0x490146(_0x535223);}finally{_0x45f9a7[_0x17bb3b(0xcb)]['time']=_0x490146;}},_0x582391=_0x3cfe24=>_0x425c90=>{var _0x2c37fc=_0x5b333f;try{let [_0x15be8a,_0x33d5f0]=_0x425c90['split'](_0x2c37fc(0xf1));_0x464d2b(_0x33d5f0,_0x15be8a),_0x3cfe24(_0x15be8a);}finally{_0x45f9a7[_0x2c37fc(0xcb)]['timeEnd']=_0x3cfe24;}};_0x45f9a7[_0x5b333f(0xfe)]={'consoleLog':(_0x1a357a,_0x5e6ff1)=>{var _0x278949=_0x5b333f;_0x45f9a7[_0x278949(0xcb)][_0x278949(0xf4)][_0x278949(0x175)]!==_0x278949(0x132)&&_0x965906(_0x4823cf(_0x278949(0xf4),_0x1a357a,_0x567592(),_0x393aa6,_0x5e6ff1));},'consoleTrace':(_0x3097b6,_0x5cef3e)=>{var _0x3cc0ec=_0x5b333f;_0x45f9a7[_0x3cc0ec(0xcb)][_0x3cc0ec(0xf4)][_0x3cc0ec(0x175)]!==_0x3cc0ec(0x10d)&&_0x965906(_0x4823cf('trace',_0x3097b6,_0x567592(),_0x393aa6,_0x5cef3e));},'consoleTime':()=>{var _0x514c97=_0x5b333f;_0x45f9a7['console'][_0x514c97(0x17f)]=_0x7abf13(_0x45f9a7[_0x514c97(0xcb)][_0x514c97(0x17f)]);},'consoleTimeEnd':()=>{var _0x3a0f5a=_0x5b333f;_0x45f9a7[_0x3a0f5a(0xcb)]['timeEnd']=_0x582391(_0x45f9a7[_0x3a0f5a(0xcb)][_0x3a0f5a(0x19d)]);},'autoLog':(_0x508d9d,_0x370a00)=>{var _0x50252e=_0x5b333f;_0x965906(_0x4823cf(_0x50252e(0xf4),_0x370a00,_0x567592(),_0x393aa6,[_0x508d9d]));},'autoLogMany':(_0x2baba3,_0x53784d)=>{_0x965906(_0x4823cf('log',_0x2baba3,_0x567592(),_0x393aa6,_0x53784d));},'autoTrace':(_0x3e0a31,_0x1e3af8)=>{_0x965906(_0x4823cf('trace',_0x1e3af8,_0x567592(),_0x393aa6,[_0x3e0a31]));},'autoTraceMany':(_0x4c750c,_0x58a519)=>{var _0x2ccde0=_0x5b333f;_0x965906(_0x4823cf(_0x2ccde0(0x137),_0x4c750c,_0x567592(),_0x393aa6,_0x58a519));},'autoTime':(_0x761e2f,_0x1f3cb5,_0xeb112e)=>{_0x21eabc(_0xeb112e);},'autoTimeEnd':(_0x434d13,_0x10eef1,_0x490a16)=>{_0x464d2b(_0x10eef1,_0x490a16);},'coverage':_0x1fbb9a=>{var _0x702ff1=_0x5b333f;_0x965906({'method':_0x702ff1(0x14a),'version':_0x46633b,'args':[{'id':_0x1fbb9a}]});}};let _0x965906=b(_0x45f9a7,_0x32680e,_0x5f3ba,_0x31a46c,_0x47adac,_0x5d134d),_0x393aa6=_0x45f9a7[_0x5b333f(0x123)];return _0x45f9a7[_0x5b333f(0xfe)];})(globalThis,_0x39aedd(0x1b1),_0x39aedd(0x135),_0x39aedd(0x16f),_0x39aedd(0x10f),_0x39aedd(0x190),'1701094291030',_0x39aedd(0x19c),_0x39aedd(0x18a),_0x39aedd(0xfc));");
}
catch (e) { } }
;
function oo_oo(i, ...v) { try {
    oo_cm().consoleLog(i, v);
}
catch (e) { } return v; }
;
oo_oo;
function oo_tr(i, ...v) { try {
    oo_cm().consoleTrace(i, v);
}
catch (e) { } return v; }
;
oo_tr;
function oo_ts() { try {
    oo_cm().consoleTime();
}
catch (e) { } }
;
oo_ts;
function oo_te() { try {
    oo_cm().consoleTimeEnd();
}
catch (e) { } }
;
oo_te;
//# sourceMappingURL=app.gateway.js.map