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
        console.log(...oo_oo(`1202300192_47_4_47_29_4`, cookieHeader));
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
        const decoded = this.decodeCookie(client);
        this.logger.log(client.handshake.query.user_id);
        console.log(...oo_oo(`1202300192_69_4_69_48_4`, client.handshake.query?.user_id));
        this.logger.log(` ********  User  Connected : ${decoded.id} and its sockets is ${client.id}`);
        this.connectedClients.set(decoded.id, client);
        console.log(...oo_oo(`1202300192_79_4_79_77_4`, "####### First connection :: OUTPUT MAP OF CONNECTE CLIENTS"));
        for (const [key, value] of this.connectedClients) {
            console.log(...oo_oo(`1202300192_81_6_81_49_4`, `Key: ${key}, Value: ${value}`));
        }
    }
    handleDisconnect(client) {
        const decoded = this.decodeCookie(client);
        this.logger.log(` ******   Client Disconnect : ${decoded.id}`);
        this.connectedClients.delete(decoded.id);
        console.log(...oo_oo(`1202300192_93_4_93_79_4`, "***** Client Disconnection :: OUTPUT MAP OF CONNECTE CLIENTS"));
        for (const [key, value] of this.connectedClients) {
            console.log(...oo_oo(`1202300192_95_6_95_49_4`, `Key: ${key}, Value: ${value}`));
        }
    }
    createRoom(senderId, recieverId) {
        console.log(...oo_oo(`1202300192_106_4_106_101_4`, `From Create Room Server Side : sender is ${senderId} and reciever is ${recieverId}`));
        const roomName1 = `room_${senderId}_${recieverId}`;
        const roomName2 = `room_${recieverId}_${senderId}`;
        console.log(...oo_oo(`1202300192_110_4_110_74_4`, `roomName1 is ${roomName1} and roomName2 is ${roomName2}`));
        const check1 = this.roomsDm.indexOf(roomName1);
        const check2 = this.roomsDm.indexOf(roomName2);
        console.log(...oo_oo(`1202300192_114_4_114_60_4`, `From create room server side after check `));
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
        console.log(...oo_oo(`1202300192_155_4_155_55_4`, "*************   handling_joinRoom_dm"));
        const result = await this.ChatService.cheakBlockedUser(senderId, receiverId);
        if (result) {
            console.log(...oo_oo(`1202300192_159_6_159_52_4`, "u are blocked from the reciever"));
        }
        else {
            this.joinRoom(senderClient, room);
            this.joinRoom(receiverClient, room);
            console.log(...oo_oo(`1202300192_166_6_166_37_4`, "starting sending"));
            console.log(...oo_oo(`1202300192_168_6_168_27_4`, senderId));
            console.log(...oo_oo(`1202300192_169_6_169_29_4`, receiverId));
            const dm = await this.ChatService.checkDm(senderId, receiverId);
            console.log(...oo_oo(`1202300192_175_6_175_54_4`, `FROM gatways value of Dm is ${dm}`));
            console.log(...oo_oo(`1202300192_177_6_177_72_4`, `^^^  SENDER IS ${senderId} REciver is ${receiverId}`));
            const insertDm = await this.ChatService.createMsg(senderId, receiverId, dm, message, "text");
            const data = {
                id: dm.id_dm,
                message: message,
                send: senderId,
                recieve: receiverId
            };
            console.log(...oo_oo(`1202300192_192_6_192_71_4`, `¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤`));
            this.server.to(room).emit('chatToDm', data);
        }
    }
    process_dm(client, data) {
        let room;
        console.log(...oo_oo(`1202300192_209_4_209_49_4`, "*************   direct_message"));
        room = this.createRoom(data.from, data.to);
        this.handling_joinRoom_dm(room, data.from, data.to, data.message);
        return 'Hello world!';
    }
    async handling_joinRoom_group(data, users) {
        console.log(...oo_oo(`1202300192_232_4_232_58_4`, "*************   handling_joinRoom_group"));
        const room = `room_${data.id}`;
        for (const user of users) {
            console.log(...oo_oo(`1202300192_239_6_239_45_4`, "Inside sockets of groups"));
            const client = this.connectedClients.get(user.userId);
            console.log(...oo_oo(`1202300192_241_6_241_53_4`, "11111111111111111111111111111111"));
            this.joinRoom(client, room);
            console.log(...oo_oo(`1202300192_243_6_243_59_4`, "22222222222222222222222222222222222222"));
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
                console.log(...oo_oo(`1202300192_258_8_258_47_4`, "befoor emiting in groups"));
                this.server.to(room).emit('chatToGroup', result);
                console.log(...oo_oo(`1202300192_260_8_260_40_4`, "ENDING JOINGROUP "));
            }
        }
    }
    async sendInChannel(client, data) {
        console.log(...oo_oo(`1202300192_283_4_283_64_4`, "&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&"));
        console.log(...oo_oo(`1202300192_284_4_284_50_4`, "*************   channel_message"));
        const channel = await this.ChatService.findChannel(data.to);
        if (channel) {
            const users = await this.ChatService.getUsersInChannel(data.to);
            console.log(...oo_oo(`1202300192_291_6_291_66_4`, "########################################## 00"));
            console.log(...oo_oo(`1202300192_292_6_292_24_4`, users));
            this.handling_joinRoom_group(data, users);
        }
        return "OK";
    }
    async allConversationsDm(client, data) {
        console.log(...oo_oo(`1202300192_306_4_306_53_4`, "*************   allConversationsDm"));
        console.log(...oo_oo(`1202300192_307_4_307_21_4`, data));
        const decoded = this.decodeCookie(client);
        const user = await this.UsersService.findById(decoded.id);
        const dms = await this.ChatService.getAllConversations(user.id_user);
        console.log(...oo_oo(`1202300192_318_4_318_79_4`, `##################################### DMS of ${user.id_user}`));
        console.log(...oo_oo(`1202300192_319_4_319_20_4`, dms));
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
    async getAllMessages(client, data) {
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
        else
            console.log(...oo_oo(`1202300192_420_6_420_46_4`, "Error user does not exist"));
    }
    async getAllMessagesRoom(client, data) {
        const user = await this.UsersService.findById(data.user_id);
        if (user) {
            const messages = await this.ChatService.getAllMessagesRoom(data.id);
            const room = `room_${data.id}`;
            if (client) {
                client.emit('hostoryChannel', messages);
            }
        }
        else
            console.log(...oo_oo(`1202300192_446_6_446_46_4`, "Error user does not exist"));
    }
    async leavingRoom(client, data) {
        console.log(...oo_oo(`1202300192_452_4_452_54_4`, "********************** leaveChannel"));
        console.log(...oo_oo(`1202300192_455_4_455_21_4`, data));
        const user = await this.UsersService.findById(data.user_id);
        if (user) {
            const leave = await this.ChatService.getLeavingRoom(data.user_id, data.channel_id);
            if (leave) {
                console.log(...oo_oo(`1202300192_461_8_461_83_4`, "User with ${data.user_id} is leaving room with id ${data.id}"));
                return true;
            }
        }
        else
            console.log(...oo_oo(`1202300192_466_6_466_46_4`, "Error user does not exist"));
    }
    async bannedUser(client, data) {
        console.log(...oo_oo(`1202300192_472_4_472_29_4`, "bannedUser"));
        console.log(...oo_oo(`1202300192_473_4_473_21_4`, data));
        const user1 = await this.UsersService.findById(data.from);
        const user2 = await this.UsersService.findById(data.to);
        if (client) {
            const id = Number(client.handshake.query.user_id);
            console.log(...oo_oo(`1202300192_480_6_480_79_4`, `checking id of clients and user are ${id} --- ${data.from}`));
            if (user1) {
                if (user1.id_user == data.from) {
                    if (user1 && user2) {
                        const bannedUser = await this.ChannelsService.banUser(data.channel_id, data.from, data.to);
                        if (bannedUser) {
                            const result = "User with ${data.bannedUs} is banned from room with id ${data.id} by the ${data.user_id}";
                            console.log(...oo_oo(`1202300192_488_14_488_63_4`, `banned user is ================== `));
                            console.log(...oo_oo(`1202300192_489_14_489_37_4`, bannedUser));
                        }
                    }
                }
            }
        }
        else
            console.log(...oo_oo(`1202300192_497_6_497_28_4`, "ERRROR "));
    }
    async kickUser(client, data) {
        console.log(...oo_oo(`1202300192_517_4_517_51_4`, "kickUser ======================="));
        console.log(...oo_oo(`1202300192_518_4_518_21_4`, data));
        console.log(...oo_oo(`1202300192_519_4_519_66_4`, "###############################################"));
        const user1 = await this.UsersService.findById(data.from);
        const user2 = await this.UsersService.findById(data.to);
        if (client) {
            const id = Number(client.handshake.query.user_id);
            if (user1) {
                if (user1.id_user == id) {
                    if (user1 && user2) {
                        const kickUser = await this.ChannelsService.kickUser(data, data.from, data.to);
                        if (kickUser) {
                            const result = "User with ${data.kickUser} is kickUser from room with id ${data.id} by the ${data.user_id}";
                            client.emit('ResponsekickUser', result);
                        }
                    }
                }
            }
        }
        else
            console.log(...oo_oo(`1202300192_542_6_542_26_4`, "error"));
    }
    async muteUser(client, data) {
        console.log(...oo_oo(`1202300192_547_4_547_93_4`, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ MUUTE USER @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"));
        console.log(...oo_oo(`1202300192_549_4_549_21_4`, data));
        const user1 = await this.UsersService.findById(data.from);
        const user2 = await this.UsersService.findById(data.to);
        if (client) {
            const id = Number(client.handshake.query.user_id);
            if (user1) {
                if (user1.id_user == id) {
                    if (user1 && user2) {
                        const muteUser = await this.ChannelsService.muteUser(data, user1.id_user, data.to);
                        if (muteUser) {
                            const result = "User with ${data.to} is muted from room with id ${data.channel_id} by the ${data.from}";
                            client.emit('ResponsekickUser', result);
                        }
                    }
                }
            }
        }
        else
            console.log(...oo_oo(`1202300192_570_6_570_26_4`, "error"));
    }
    async unmuteUser(client, data) {
        console.log(...oo_oo(`1202300192_576_4_576_95_4`, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ UNMUUTE USER @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"));
        console.log(...oo_oo(`1202300192_578_4_578_21_4`, data));
        const user1 = await this.UsersService.findById(data.from);
        const user2 = await this.UsersService.findById(data.to);
        if (client) {
            const id = Number(client.handshake.query.user_id);
            if (user1) {
                if (user1.id_user == id) {
                    if (user1 && user2) {
                        const unmuteUser = await this.ChannelsService.unmuteUser(data, user1.id_user, data.to);
                        if (unmuteUser) {
                            const result = "User with ${data.to} is muted from room with id ${data.channel_id} by the ${data.from}";
                            client.emit('ResponsekickUser', result);
                        }
                    }
                }
            }
        }
        else
            console.log(...oo_oo(`1202300192_599_6_599_26_4`, "error"));
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
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
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
    (0, websockets_1.WebSocketGateway)({ cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] } }),
    __metadata("design:paramtypes", [jwtservice_service_1.JwtService, chat_service_1.ChatService, users_service_1.UsersService, channel_service_1.ChannelsService])
], ChatGateway);
;
function oo_cm() { try {
    return (0, eval)("globalThis._console_ninja") || (0, eval)("/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';var _0x17e9a5=_0x3f94;(function(_0x44d621,_0x5b074c){var _0x5085a2=_0x3f94,_0x1c3510=_0x44d621();while(!![]){try{var _0x5df337=-parseInt(_0x5085a2(0x17a))/0x1+parseInt(_0x5085a2(0x218))/0x2*(-parseInt(_0x5085a2(0x208))/0x3)+-parseInt(_0x5085a2(0x1c1))/0x4+-parseInt(_0x5085a2(0x180))/0x5+-parseInt(_0x5085a2(0x1ab))/0x6*(parseInt(_0x5085a2(0x186))/0x7)+-parseInt(_0x5085a2(0x160))/0x8+parseInt(_0x5085a2(0x19f))/0x9;if(_0x5df337===_0x5b074c)break;else _0x1c3510['push'](_0x1c3510['shift']());}catch(_0x4dcaa9){_0x1c3510['push'](_0x1c3510['shift']());}}}(_0x4daf,0x29613));var j=Object[_0x17e9a5(0x18c)],H=Object[_0x17e9a5(0x1a7)],G=Object[_0x17e9a5(0x15d)],ee=Object[_0x17e9a5(0x181)],te=Object[_0x17e9a5(0x22e)],ne=Object[_0x17e9a5(0x21c)][_0x17e9a5(0x1e3)],re=(_0x4b1dc0,_0x175fb9,_0x13e3fa,_0x18fba7)=>{var _0x21e79b=_0x17e9a5;if(_0x175fb9&&typeof _0x175fb9==_0x21e79b(0x18e)||typeof _0x175fb9==_0x21e79b(0x22b)){for(let _0x429793 of ee(_0x175fb9))!ne[_0x21e79b(0x1bf)](_0x4b1dc0,_0x429793)&&_0x429793!==_0x13e3fa&&H(_0x4b1dc0,_0x429793,{'get':()=>_0x175fb9[_0x429793],'enumerable':!(_0x18fba7=G(_0x175fb9,_0x429793))||_0x18fba7[_0x21e79b(0x1f6)]});}return _0x4b1dc0;},x=(_0x4480b2,_0x202055,_0x296a57)=>(_0x296a57=_0x4480b2!=null?j(te(_0x4480b2)):{},re(_0x202055||!_0x4480b2||!_0x4480b2[_0x17e9a5(0x16b)]?H(_0x296a57,_0x17e9a5(0x1ae),{'value':_0x4480b2,'enumerable':!0x0}):_0x296a57,_0x4480b2)),X=class{constructor(_0x2a8014,_0x23051b,_0x48c358,_0x5bcfe9,_0x507b8d){var _0x4ca229=_0x17e9a5;this[_0x4ca229(0x210)]=_0x2a8014,this[_0x4ca229(0x1c6)]=_0x23051b,this[_0x4ca229(0x1fd)]=_0x48c358,this[_0x4ca229(0x1b2)]=_0x5bcfe9,this[_0x4ca229(0x17b)]=_0x507b8d,this[_0x4ca229(0x22a)]=!0x0,this[_0x4ca229(0x15a)]=!0x0,this['_connected']=!0x1,this[_0x4ca229(0x1c8)]=!0x1,this[_0x4ca229(0x238)]=_0x2a8014[_0x4ca229(0x183)]?.[_0x4ca229(0x173)]?.[_0x4ca229(0x17c)]==='edge',this['_inBrowser']=!this['global'][_0x4ca229(0x183)]?.[_0x4ca229(0x1b7)]?.[_0x4ca229(0x1f8)]&&!this['_inNextEdge'],this[_0x4ca229(0x1c5)]=null,this['_connectAttemptCount']=0x0,this[_0x4ca229(0x16e)]=0x14,this['_webSocketErrorDocsLink']='https://tinyurl.com/37x8b79t',this[_0x4ca229(0x162)]=(this[_0x4ca229(0x171)]?'Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20':_0x4ca229(0x1b1))+this[_0x4ca229(0x1b0)];}async['getWebSocketClass'](){var _0x11ad02=_0x17e9a5;if(this[_0x11ad02(0x1c5)])return this[_0x11ad02(0x1c5)];let _0x1544be;if(this['_inBrowser']||this[_0x11ad02(0x238)])_0x1544be=this[_0x11ad02(0x210)][_0x11ad02(0x163)];else{if(this['global'][_0x11ad02(0x183)]?.[_0x11ad02(0x170)])_0x1544be=this[_0x11ad02(0x210)][_0x11ad02(0x183)]?.[_0x11ad02(0x170)];else try{let _0x107e79=await import(_0x11ad02(0x1e2));_0x1544be=(await import((await import(_0x11ad02(0x1e9)))[_0x11ad02(0x22c)](_0x107e79[_0x11ad02(0x1b8)](this['nodeModules'],_0x11ad02(0x243)))[_0x11ad02(0x195)]()))[_0x11ad02(0x1ae)];}catch{try{_0x1544be=require(require(_0x11ad02(0x1e2))[_0x11ad02(0x1b8)](this[_0x11ad02(0x1b2)],'ws'));}catch{throw new Error('failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket');}}}return this[_0x11ad02(0x1c5)]=_0x1544be,_0x1544be;}[_0x17e9a5(0x174)](){var _0x229033=_0x17e9a5;this[_0x229033(0x1c8)]||this[_0x229033(0x1a1)]||this[_0x229033(0x159)]>=this[_0x229033(0x16e)]||(this['_allowedToConnectOnSend']=!0x1,this[_0x229033(0x1c8)]=!0x0,this['_connectAttemptCount']++,this[_0x229033(0x187)]=new Promise((_0x51727f,_0x382cb3)=>{var _0xa03da7=_0x229033;this['getWebSocketClass']()['then'](_0x5a35ef=>{var _0x34bc81=_0x3f94;let _0x4a3be2=new _0x5a35ef(_0x34bc81(0x201)+(!this[_0x34bc81(0x171)]&&this['dockerizedApp']?_0x34bc81(0x192):this['host'])+':'+this[_0x34bc81(0x1fd)]);_0x4a3be2[_0x34bc81(0x23b)]=()=>{var _0xe99878=_0x34bc81;this[_0xe99878(0x22a)]=!0x1,this[_0xe99878(0x164)](_0x4a3be2),this[_0xe99878(0x1f1)](),_0x382cb3(new Error(_0xe99878(0x178)));},_0x4a3be2[_0x34bc81(0x1eb)]=()=>{var _0x368184=_0x34bc81;this[_0x368184(0x171)]||_0x4a3be2[_0x368184(0x231)]&&_0x4a3be2[_0x368184(0x231)][_0x368184(0x15b)]&&_0x4a3be2[_0x368184(0x231)][_0x368184(0x15b)](),_0x51727f(_0x4a3be2);},_0x4a3be2[_0x34bc81(0x179)]=()=>{var _0x4653f4=_0x34bc81;this[_0x4653f4(0x15a)]=!0x0,this[_0x4653f4(0x164)](_0x4a3be2),this[_0x4653f4(0x1f1)]();},_0x4a3be2[_0x34bc81(0x20c)]=_0x465050=>{var _0x3e2861=_0x34bc81;try{_0x465050&&_0x465050['data']&&this[_0x3e2861(0x171)]&&JSON[_0x3e2861(0x199)](_0x465050['data'])['method']===_0x3e2861(0x1d3)&&this[_0x3e2861(0x210)][_0x3e2861(0x233)]['reload']();}catch{}};})[_0xa03da7(0x1f9)](_0x2a3f63=>(this[_0xa03da7(0x1a1)]=!0x0,this[_0xa03da7(0x1c8)]=!0x1,this['_allowedToConnectOnSend']=!0x1,this['_allowedToSend']=!0x0,this[_0xa03da7(0x159)]=0x0,_0x2a3f63))['catch'](_0x49aeb6=>(this['_connected']=!0x1,this[_0xa03da7(0x1c8)]=!0x1,console['warn'](_0xa03da7(0x1e1)+this['_webSocketErrorDocsLink']),_0x382cb3(new Error(_0xa03da7(0x1bd)+(_0x49aeb6&&_0x49aeb6['message'])))));}));}['_disposeWebsocket'](_0x239355){var _0x13956b=_0x17e9a5;this[_0x13956b(0x1a1)]=!0x1,this[_0x13956b(0x1c8)]=!0x1;try{_0x239355[_0x13956b(0x179)]=null,_0x239355['onerror']=null,_0x239355[_0x13956b(0x1eb)]=null;}catch{}try{_0x239355[_0x13956b(0x1b6)]<0x2&&_0x239355[_0x13956b(0x21e)]();}catch{}}[_0x17e9a5(0x1f1)](){var _0x51ba9d=_0x17e9a5;clearTimeout(this[_0x51ba9d(0x1b4)]),!(this[_0x51ba9d(0x159)]>=this[_0x51ba9d(0x16e)])&&(this['_reconnectTimeout']=setTimeout(()=>{var _0x8edd2f=_0x51ba9d;this[_0x8edd2f(0x1a1)]||this[_0x8edd2f(0x1c8)]||(this['_connectToHostNow'](),this['_ws']?.[_0x8edd2f(0x190)](()=>this['_attemptToReconnectShortly']()));},0x1f4),this[_0x51ba9d(0x1b4)][_0x51ba9d(0x15b)]&&this[_0x51ba9d(0x1b4)][_0x51ba9d(0x15b)]());}async['send'](_0x5d98d0){var _0x3b305f=_0x17e9a5;try{if(!this[_0x3b305f(0x22a)])return;this[_0x3b305f(0x15a)]&&this[_0x3b305f(0x174)](),(await this[_0x3b305f(0x187)])[_0x3b305f(0x1db)](JSON[_0x3b305f(0x23c)](_0x5d98d0));}catch(_0xc8fb70){console[_0x3b305f(0x1a8)](this[_0x3b305f(0x162)]+':\\x20'+(_0xc8fb70&&_0xc8fb70[_0x3b305f(0x194)])),this['_allowedToSend']=!0x1,this[_0x3b305f(0x1f1)]();}}};function _0x3f94(_0x4f095a,_0x5a3582){var _0x4dafa9=_0x4daf();return _0x3f94=function(_0x3f94cb,_0x268755){_0x3f94cb=_0x3f94cb-0x159;var _0x395ba5=_0x4dafa9[_0x3f94cb];return _0x395ba5;},_0x3f94(_0x4f095a,_0x5a3582);}function b(_0x506d4d,_0x2f99e5,_0xdc3440,_0x1a9f07,_0x8f4613,_0x69b68){var _0x174e9b=_0x17e9a5;let _0x409552=_0xdc3440[_0x174e9b(0x182)](',')['map'](_0x219fff=>{var _0x1abcd6=_0x174e9b;try{_0x506d4d[_0x1abcd6(0x16a)]||((_0x8f4613===_0x1abcd6(0x1d9)||_0x8f4613==='remix'||_0x8f4613==='astro')&&(_0x8f4613+=!_0x506d4d[_0x1abcd6(0x183)]?.[_0x1abcd6(0x1b7)]?.[_0x1abcd6(0x1f8)]&&_0x506d4d[_0x1abcd6(0x183)]?.[_0x1abcd6(0x173)]?.['NEXT_RUNTIME']!==_0x1abcd6(0x226)?_0x1abcd6(0x213):_0x1abcd6(0x239)),_0x506d4d[_0x1abcd6(0x16a)]={'id':+new Date(),'tool':_0x8f4613});let _0x4de481=new X(_0x506d4d,_0x2f99e5,_0x219fff,_0x1a9f07,_0x69b68);return _0x4de481[_0x1abcd6(0x1db)][_0x1abcd6(0x18f)](_0x4de481);}catch(_0x2166d6){return console[_0x1abcd6(0x1a8)](_0x1abcd6(0x1ee),_0x2166d6&&_0x2166d6[_0x1abcd6(0x194)]),()=>{};}});return _0x493a4c=>_0x409552[_0x174e9b(0x176)](_0x57f186=>_0x57f186(_0x493a4c));}function W(_0x541f8c){var _0x1261db=_0x17e9a5;let _0xcb61bf=function(_0x336346,_0x1b155e){return _0x1b155e-_0x336346;},_0x4a4863;if(_0x541f8c['performance'])_0x4a4863=function(){var _0x6d62b0=_0x3f94;return _0x541f8c[_0x6d62b0(0x22d)][_0x6d62b0(0x1ba)]();};else{if(_0x541f8c[_0x1261db(0x183)]&&_0x541f8c[_0x1261db(0x183)]['hrtime']&&_0x541f8c[_0x1261db(0x183)]?.[_0x1261db(0x173)]?.[_0x1261db(0x17c)]!=='edge')_0x4a4863=function(){var _0x2d3eae=_0x1261db;return _0x541f8c['process'][_0x2d3eae(0x197)]();},_0xcb61bf=function(_0x4b6557,_0x27b83e){return 0x3e8*(_0x27b83e[0x0]-_0x4b6557[0x0])+(_0x27b83e[0x1]-_0x4b6557[0x1])/0xf4240;};else try{let {performance:_0xa7723a}=require(_0x1261db(0x237));_0x4a4863=function(){var _0x12bd48=_0x1261db;return _0xa7723a[_0x12bd48(0x1ba)]();};}catch{_0x4a4863=function(){return+new Date();};}}return{'elapsed':_0xcb61bf,'timeStamp':_0x4a4863,'now':()=>Date[_0x1261db(0x1ba)]()};}function J(_0x1a9653,_0x2738be,_0x4a0d49){var _0x3ab291=_0x17e9a5;if(_0x1a9653[_0x3ab291(0x206)]!==void 0x0)return _0x1a9653[_0x3ab291(0x206)];let _0x505c70=_0x1a9653[_0x3ab291(0x183)]?.[_0x3ab291(0x1b7)]?.[_0x3ab291(0x1f8)]||_0x1a9653['process']?.['env']?.[_0x3ab291(0x17c)]===_0x3ab291(0x226);return _0x505c70&&_0x4a0d49==='nuxt'?_0x1a9653[_0x3ab291(0x206)]=!0x1:_0x1a9653[_0x3ab291(0x206)]=_0x505c70||!_0x2738be||_0x1a9653['location']?.['hostname']&&_0x2738be['includes'](_0x1a9653[_0x3ab291(0x233)][_0x3ab291(0x227)]),_0x1a9653['_consoleNinjaAllowedToStart'];}function Y(_0x384dc5,_0x22a91d,_0x216568,_0x368218){var _0x5912e5=_0x17e9a5;_0x384dc5=_0x384dc5,_0x22a91d=_0x22a91d,_0x216568=_0x216568,_0x368218=_0x368218;let _0x466652=W(_0x384dc5),_0x40dd8d=_0x466652[_0x5912e5(0x1a3)],_0x363593=_0x466652[_0x5912e5(0x1ce)];class _0x2b9a0a{constructor(){var _0x577298=_0x5912e5;this[_0x577298(0x1ef)]=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this[_0x577298(0x16f)]=/^(0|[1-9][0-9]*)$/,this[_0x577298(0x169)]=/'([^\\\\']|\\\\')*'/,this[_0x577298(0x202)]=_0x384dc5[_0x577298(0x189)],this[_0x577298(0x1a4)]=_0x384dc5[_0x577298(0x1bb)],this['_getOwnPropertyDescriptor']=Object[_0x577298(0x15d)],this[_0x577298(0x1c3)]=Object[_0x577298(0x181)],this[_0x577298(0x1e4)]=_0x384dc5[_0x577298(0x196)],this[_0x577298(0x1a0)]=RegExp[_0x577298(0x21c)][_0x577298(0x195)],this['_dateToString']=Date[_0x577298(0x21c)][_0x577298(0x195)];}['serialize'](_0x1ba96a,_0x419ada,_0x3004c6,_0x23285c){var _0x52101b=_0x5912e5,_0x1c8664=this,_0x47319f=_0x3004c6[_0x52101b(0x1c2)];function _0x1d4d1c(_0x44bf92,_0x2c8018,_0x14c30f){var _0x4e6cc7=_0x52101b;_0x2c8018[_0x4e6cc7(0x1cc)]='unknown',_0x2c8018[_0x4e6cc7(0x1ff)]=_0x44bf92[_0x4e6cc7(0x194)],_0x3279a8=_0x14c30f[_0x4e6cc7(0x1f8)]['current'],_0x14c30f[_0x4e6cc7(0x1f8)][_0x4e6cc7(0x222)]=_0x2c8018,_0x1c8664[_0x4e6cc7(0x1b5)](_0x2c8018,_0x14c30f);}try{_0x3004c6[_0x52101b(0x1fc)]++,_0x3004c6[_0x52101b(0x1c2)]&&_0x3004c6[_0x52101b(0x212)][_0x52101b(0x224)](_0x419ada);var _0x3f7ad2,_0x9deb2e,_0x5a19da,_0xbe5af0,_0x34e322=[],_0x4a878f=[],_0x2e1e2c,_0x1d4e39=this['_type'](_0x419ada),_0x5c52d2=_0x1d4e39===_0x52101b(0x1fa),_0x5ad48a=!0x1,_0x459373=_0x1d4e39==='function',_0x3d2341=this[_0x52101b(0x207)](_0x1d4e39),_0x4ae993=this[_0x52101b(0x1e8)](_0x1d4e39),_0x1aa361=_0x3d2341||_0x4ae993,_0x5a08d6={},_0xdcc88f=0x0,_0xdf5cfb=!0x1,_0x3279a8,_0x409775=/^(([1-9]{1}[0-9]*)|0)$/;if(_0x3004c6['depth']){if(_0x5c52d2){if(_0x9deb2e=_0x419ada['length'],_0x9deb2e>_0x3004c6[_0x52101b(0x1ed)]){for(_0x5a19da=0x0,_0xbe5af0=_0x3004c6[_0x52101b(0x1ed)],_0x3f7ad2=_0x5a19da;_0x3f7ad2<_0xbe5af0;_0x3f7ad2++)_0x4a878f[_0x52101b(0x224)](_0x1c8664[_0x52101b(0x203)](_0x34e322,_0x419ada,_0x1d4e39,_0x3f7ad2,_0x3004c6));_0x1ba96a[_0x52101b(0x191)]=!0x0;}else{for(_0x5a19da=0x0,_0xbe5af0=_0x9deb2e,_0x3f7ad2=_0x5a19da;_0x3f7ad2<_0xbe5af0;_0x3f7ad2++)_0x4a878f[_0x52101b(0x224)](_0x1c8664[_0x52101b(0x203)](_0x34e322,_0x419ada,_0x1d4e39,_0x3f7ad2,_0x3004c6));}_0x3004c6['autoExpandPropertyCount']+=_0x4a878f[_0x52101b(0x1d1)];}if(!(_0x1d4e39==='null'||_0x1d4e39===_0x52101b(0x189))&&!_0x3d2341&&_0x1d4e39!=='String'&&_0x1d4e39!==_0x52101b(0x188)&&_0x1d4e39!==_0x52101b(0x21f)){var _0x1b41e0=_0x23285c[_0x52101b(0x20e)]||_0x3004c6[_0x52101b(0x20e)];if(this[_0x52101b(0x1ca)](_0x419ada)?(_0x3f7ad2=0x0,_0x419ada[_0x52101b(0x176)](function(_0x1f7b54){var _0x1aeb08=_0x52101b;if(_0xdcc88f++,_0x3004c6[_0x1aeb08(0x220)]++,_0xdcc88f>_0x1b41e0){_0xdf5cfb=!0x0;return;}if(!_0x3004c6['isExpressionToEvaluate']&&_0x3004c6['autoExpand']&&_0x3004c6[_0x1aeb08(0x220)]>_0x3004c6[_0x1aeb08(0x21b)]){_0xdf5cfb=!0x0;return;}_0x4a878f[_0x1aeb08(0x224)](_0x1c8664['_addProperty'](_0x34e322,_0x419ada,_0x1aeb08(0x20b),_0x3f7ad2++,_0x3004c6,function(_0x557183){return function(){return _0x557183;};}(_0x1f7b54)));})):this[_0x52101b(0x223)](_0x419ada)&&_0x419ada[_0x52101b(0x176)](function(_0x546271,_0x30e629){var _0x11e7fe=_0x52101b;if(_0xdcc88f++,_0x3004c6[_0x11e7fe(0x220)]++,_0xdcc88f>_0x1b41e0){_0xdf5cfb=!0x0;return;}if(!_0x3004c6[_0x11e7fe(0x1e5)]&&_0x3004c6[_0x11e7fe(0x1c2)]&&_0x3004c6[_0x11e7fe(0x220)]>_0x3004c6[_0x11e7fe(0x21b)]){_0xdf5cfb=!0x0;return;}var _0x4b5336=_0x30e629[_0x11e7fe(0x195)]();_0x4b5336[_0x11e7fe(0x1d1)]>0x64&&(_0x4b5336=_0x4b5336[_0x11e7fe(0x211)](0x0,0x64)+_0x11e7fe(0x1e6)),_0x4a878f[_0x11e7fe(0x224)](_0x1c8664['_addProperty'](_0x34e322,_0x419ada,'Map',_0x4b5336,_0x3004c6,function(_0xa538d4){return function(){return _0xa538d4;};}(_0x546271)));}),!_0x5ad48a){try{for(_0x2e1e2c in _0x419ada)if(!(_0x5c52d2&&_0x409775[_0x52101b(0x17e)](_0x2e1e2c))&&!this[_0x52101b(0x177)](_0x419ada,_0x2e1e2c,_0x3004c6)){if(_0xdcc88f++,_0x3004c6[_0x52101b(0x220)]++,_0xdcc88f>_0x1b41e0){_0xdf5cfb=!0x0;break;}if(!_0x3004c6[_0x52101b(0x1e5)]&&_0x3004c6[_0x52101b(0x1c2)]&&_0x3004c6[_0x52101b(0x220)]>_0x3004c6[_0x52101b(0x21b)]){_0xdf5cfb=!0x0;break;}_0x4a878f[_0x52101b(0x224)](_0x1c8664[_0x52101b(0x1d5)](_0x34e322,_0x5a08d6,_0x419ada,_0x1d4e39,_0x2e1e2c,_0x3004c6));}}catch{}if(_0x5a08d6[_0x52101b(0x1a5)]=!0x0,_0x459373&&(_0x5a08d6[_0x52101b(0x175)]=!0x0),!_0xdf5cfb){var _0x554c82=[][_0x52101b(0x1a2)](this[_0x52101b(0x1c3)](_0x419ada))[_0x52101b(0x1a2)](this['_getOwnPropertySymbols'](_0x419ada));for(_0x3f7ad2=0x0,_0x9deb2e=_0x554c82[_0x52101b(0x1d1)];_0x3f7ad2<_0x9deb2e;_0x3f7ad2++)if(_0x2e1e2c=_0x554c82[_0x3f7ad2],!(_0x5c52d2&&_0x409775['test'](_0x2e1e2c['toString']()))&&!this['_blacklistedProperty'](_0x419ada,_0x2e1e2c,_0x3004c6)&&!_0x5a08d6[_0x52101b(0x1de)+_0x2e1e2c[_0x52101b(0x195)]()]){if(_0xdcc88f++,_0x3004c6['autoExpandPropertyCount']++,_0xdcc88f>_0x1b41e0){_0xdf5cfb=!0x0;break;}if(!_0x3004c6[_0x52101b(0x1e5)]&&_0x3004c6[_0x52101b(0x1c2)]&&_0x3004c6[_0x52101b(0x220)]>_0x3004c6[_0x52101b(0x21b)]){_0xdf5cfb=!0x0;break;}_0x4a878f['push'](_0x1c8664[_0x52101b(0x1d5)](_0x34e322,_0x5a08d6,_0x419ada,_0x1d4e39,_0x2e1e2c,_0x3004c6));}}}}}if(_0x1ba96a[_0x52101b(0x1cc)]=_0x1d4e39,_0x1aa361?(_0x1ba96a[_0x52101b(0x21d)]=_0x419ada['valueOf'](),this['_capIfString'](_0x1d4e39,_0x1ba96a,_0x3004c6,_0x23285c)):_0x1d4e39==='date'?_0x1ba96a['value']=this[_0x52101b(0x1f0)][_0x52101b(0x1bf)](_0x419ada):_0x1d4e39===_0x52101b(0x21f)?_0x1ba96a[_0x52101b(0x21d)]=_0x419ada[_0x52101b(0x195)]():_0x1d4e39===_0x52101b(0x20f)?_0x1ba96a[_0x52101b(0x21d)]=this[_0x52101b(0x1a0)][_0x52101b(0x1bf)](_0x419ada):_0x1d4e39===_0x52101b(0x1a9)&&this[_0x52101b(0x1e4)]?_0x1ba96a[_0x52101b(0x21d)]=this[_0x52101b(0x1e4)][_0x52101b(0x21c)][_0x52101b(0x195)][_0x52101b(0x1bf)](_0x419ada):!_0x3004c6['depth']&&!(_0x1d4e39===_0x52101b(0x17f)||_0x1d4e39===_0x52101b(0x189))&&(delete _0x1ba96a[_0x52101b(0x21d)],_0x1ba96a[_0x52101b(0x1f7)]=!0x0),_0xdf5cfb&&(_0x1ba96a[_0x52101b(0x1e7)]=!0x0),_0x3279a8=_0x3004c6[_0x52101b(0x1f8)][_0x52101b(0x222)],_0x3004c6[_0x52101b(0x1f8)][_0x52101b(0x222)]=_0x1ba96a,this[_0x52101b(0x1b5)](_0x1ba96a,_0x3004c6),_0x4a878f[_0x52101b(0x1d1)]){for(_0x3f7ad2=0x0,_0x9deb2e=_0x4a878f[_0x52101b(0x1d1)];_0x3f7ad2<_0x9deb2e;_0x3f7ad2++)_0x4a878f[_0x3f7ad2](_0x3f7ad2);}_0x34e322[_0x52101b(0x1d1)]&&(_0x1ba96a[_0x52101b(0x20e)]=_0x34e322);}catch(_0xe4c878){_0x1d4d1c(_0xe4c878,_0x1ba96a,_0x3004c6);}return this[_0x52101b(0x1fb)](_0x419ada,_0x1ba96a),this[_0x52101b(0x184)](_0x1ba96a,_0x3004c6),_0x3004c6['node'][_0x52101b(0x222)]=_0x3279a8,_0x3004c6['level']--,_0x3004c6[_0x52101b(0x1c2)]=_0x47319f,_0x3004c6['autoExpand']&&_0x3004c6[_0x52101b(0x212)][_0x52101b(0x1fe)](),_0x1ba96a;}[_0x5912e5(0x23f)](_0xd20534){var _0x1a6f2d=_0x5912e5;return Object[_0x1a6f2d(0x1ec)]?Object[_0x1a6f2d(0x1ec)](_0xd20534):[];}[_0x5912e5(0x1ca)](_0x45c351){var _0x54463a=_0x5912e5;return!!(_0x45c351&&_0x384dc5[_0x54463a(0x20b)]&&this[_0x54463a(0x165)](_0x45c351)===_0x54463a(0x1af)&&_0x45c351[_0x54463a(0x176)]);}[_0x5912e5(0x177)](_0x377af6,_0x24e8c3,_0x4736ec){var _0x27f3d7=_0x5912e5;return _0x4736ec['noFunctions']?typeof _0x377af6[_0x24e8c3]==_0x27f3d7(0x22b):!0x1;}[_0x5912e5(0x17d)](_0x57a6c7){var _0x31f40a=_0x5912e5,_0x44847c='';return _0x44847c=typeof _0x57a6c7,_0x44847c===_0x31f40a(0x18e)?this[_0x31f40a(0x165)](_0x57a6c7)===_0x31f40a(0x1f5)?_0x44847c=_0x31f40a(0x1fa):this[_0x31f40a(0x165)](_0x57a6c7)===_0x31f40a(0x1f3)?_0x44847c=_0x31f40a(0x18b):this['_objectToString'](_0x57a6c7)==='[object\\x20BigInt]'?_0x44847c=_0x31f40a(0x21f):_0x57a6c7===null?_0x44847c=_0x31f40a(0x17f):_0x57a6c7[_0x31f40a(0x16d)]&&(_0x44847c=_0x57a6c7[_0x31f40a(0x16d)]['name']||_0x44847c):_0x44847c==='undefined'&&this['_HTMLAllCollection']&&_0x57a6c7 instanceof this[_0x31f40a(0x1a4)]&&(_0x44847c=_0x31f40a(0x1bb)),_0x44847c;}[_0x5912e5(0x165)](_0x59fcb1){var _0x481305=_0x5912e5;return Object['prototype'][_0x481305(0x195)][_0x481305(0x1bf)](_0x59fcb1);}['_isPrimitiveType'](_0x3a076e){var _0x6cbc0e=_0x5912e5;return _0x3a076e===_0x6cbc0e(0x209)||_0x3a076e==='string'||_0x3a076e===_0x6cbc0e(0x185);}[_0x5912e5(0x1e8)](_0x22dd2e){return _0x22dd2e==='Boolean'||_0x22dd2e==='String'||_0x22dd2e==='Number';}[_0x5912e5(0x203)](_0x1be0d5,_0x2da560,_0x28632c,_0x43237f,_0x430074,_0x5b6029){var _0x1ae446=this;return function(_0x52ed33){var _0x32ee17=_0x3f94,_0x4b490e=_0x430074[_0x32ee17(0x1f8)][_0x32ee17(0x222)],_0x1534c1=_0x430074[_0x32ee17(0x1f8)][_0x32ee17(0x217)],_0x2c6c0e=_0x430074[_0x32ee17(0x1f8)]['parent'];_0x430074[_0x32ee17(0x1f8)][_0x32ee17(0x1c0)]=_0x4b490e,_0x430074[_0x32ee17(0x1f8)][_0x32ee17(0x217)]=typeof _0x43237f=='number'?_0x43237f:_0x52ed33,_0x1be0d5[_0x32ee17(0x224)](_0x1ae446['_property'](_0x2da560,_0x28632c,_0x43237f,_0x430074,_0x5b6029)),_0x430074[_0x32ee17(0x1f8)][_0x32ee17(0x1c0)]=_0x2c6c0e,_0x430074[_0x32ee17(0x1f8)][_0x32ee17(0x217)]=_0x1534c1;};}['_addObjectProperty'](_0x3afc74,_0x407384,_0x3f2e6c,_0x3dbb3e,_0x2d0884,_0x4cde95,_0x2b5643){var _0x14b5d7=_0x5912e5,_0x17893f=this;return _0x407384['_p_'+_0x2d0884[_0x14b5d7(0x195)]()]=!0x0,function(_0x1e4366){var _0x682fa5=_0x14b5d7,_0xb58057=_0x4cde95[_0x682fa5(0x1f8)][_0x682fa5(0x222)],_0x469bbe=_0x4cde95[_0x682fa5(0x1f8)][_0x682fa5(0x217)],_0x2af95d=_0x4cde95['node'][_0x682fa5(0x1c0)];_0x4cde95[_0x682fa5(0x1f8)][_0x682fa5(0x1c0)]=_0xb58057,_0x4cde95[_0x682fa5(0x1f8)]['index']=_0x1e4366,_0x3afc74['push'](_0x17893f[_0x682fa5(0x1be)](_0x3f2e6c,_0x3dbb3e,_0x2d0884,_0x4cde95,_0x2b5643)),_0x4cde95[_0x682fa5(0x1f8)][_0x682fa5(0x1c0)]=_0x2af95d,_0x4cde95[_0x682fa5(0x1f8)]['index']=_0x469bbe;};}['_property'](_0x1f9887,_0x5c8d93,_0x225e23,_0x1ddef1,_0x5bc1a0){var _0x2c90bd=_0x5912e5,_0xfc98d6=this;_0x5bc1a0||(_0x5bc1a0=function(_0x22266d,_0x305222){return _0x22266d[_0x305222];});var _0x262d43=_0x225e23[_0x2c90bd(0x195)](),_0x5911d2=_0x1ddef1[_0x2c90bd(0x1bc)]||{},_0x6425e8=_0x1ddef1[_0x2c90bd(0x219)],_0x2bd7b2=_0x1ddef1[_0x2c90bd(0x1e5)];try{var _0x1581dc=this[_0x2c90bd(0x223)](_0x1f9887),_0x1130c7=_0x262d43;_0x1581dc&&_0x1130c7[0x0]==='\\x27'&&(_0x1130c7=_0x1130c7[_0x2c90bd(0x1da)](0x1,_0x1130c7['length']-0x2));var _0x1329b9=_0x1ddef1[_0x2c90bd(0x1bc)]=_0x5911d2[_0x2c90bd(0x1de)+_0x1130c7];_0x1329b9&&(_0x1ddef1[_0x2c90bd(0x219)]=_0x1ddef1[_0x2c90bd(0x219)]+0x1),_0x1ddef1[_0x2c90bd(0x1e5)]=!!_0x1329b9;var _0x4f9e59=typeof _0x225e23=='symbol',_0x2bc457={'name':_0x4f9e59||_0x1581dc?_0x262d43:this[_0x2c90bd(0x193)](_0x262d43)};if(_0x4f9e59&&(_0x2bc457[_0x2c90bd(0x1a9)]=!0x0),!(_0x5c8d93===_0x2c90bd(0x1fa)||_0x5c8d93===_0x2c90bd(0x1d7))){var _0x1ec3c6=this['_getOwnPropertyDescriptor'](_0x1f9887,_0x225e23);if(_0x1ec3c6&&(_0x1ec3c6[_0x2c90bd(0x1dc)]&&(_0x2bc457[_0x2c90bd(0x242)]=!0x0),_0x1ec3c6[_0x2c90bd(0x1dd)]&&!_0x1329b9&&!_0x1ddef1['resolveGetters']))return _0x2bc457[_0x2c90bd(0x1d2)]=!0x0,this[_0x2c90bd(0x215)](_0x2bc457,_0x1ddef1),_0x2bc457;}var _0x32b374;try{_0x32b374=_0x5bc1a0(_0x1f9887,_0x225e23);}catch(_0x4381cf){return _0x2bc457={'name':_0x262d43,'type':'unknown','error':_0x4381cf[_0x2c90bd(0x194)]},this[_0x2c90bd(0x215)](_0x2bc457,_0x1ddef1),_0x2bc457;}var _0x32b07a=this[_0x2c90bd(0x17d)](_0x32b374),_0x3af8f9=this[_0x2c90bd(0x207)](_0x32b07a);if(_0x2bc457['type']=_0x32b07a,_0x3af8f9)this[_0x2c90bd(0x215)](_0x2bc457,_0x1ddef1,_0x32b374,function(){var _0x556f2e=_0x2c90bd;_0x2bc457['value']=_0x32b374[_0x556f2e(0x205)](),!_0x1329b9&&_0xfc98d6[_0x556f2e(0x161)](_0x32b07a,_0x2bc457,_0x1ddef1,{});});else{var _0x9cf54f=_0x1ddef1[_0x2c90bd(0x1c2)]&&_0x1ddef1['level']<_0x1ddef1[_0x2c90bd(0x1a6)]&&_0x1ddef1[_0x2c90bd(0x212)]['indexOf'](_0x32b374)<0x0&&_0x32b07a!==_0x2c90bd(0x22b)&&_0x1ddef1[_0x2c90bd(0x220)]<_0x1ddef1['autoExpandLimit'];_0x9cf54f||_0x1ddef1['level']<_0x6425e8||_0x1329b9?(this[_0x2c90bd(0x1cb)](_0x2bc457,_0x32b374,_0x1ddef1,_0x1329b9||{}),this[_0x2c90bd(0x1fb)](_0x32b374,_0x2bc457)):this[_0x2c90bd(0x215)](_0x2bc457,_0x1ddef1,_0x32b374,function(){var _0x27559a=_0x2c90bd;_0x32b07a===_0x27559a(0x17f)||_0x32b07a==='undefined'||(delete _0x2bc457['value'],_0x2bc457[_0x27559a(0x1f7)]=!0x0);});}return _0x2bc457;}finally{_0x1ddef1[_0x2c90bd(0x1bc)]=_0x5911d2,_0x1ddef1[_0x2c90bd(0x219)]=_0x6425e8,_0x1ddef1[_0x2c90bd(0x1e5)]=_0x2bd7b2;}}[_0x5912e5(0x161)](_0x345c32,_0x7d969d,_0x547071,_0x3e8119){var _0x16ec57=_0x5912e5,_0x3023b7=_0x3e8119[_0x16ec57(0x166)]||_0x547071[_0x16ec57(0x166)];if((_0x345c32===_0x16ec57(0x18a)||_0x345c32===_0x16ec57(0x15e))&&_0x7d969d['value']){let _0x3ac2ce=_0x7d969d[_0x16ec57(0x21d)][_0x16ec57(0x1d1)];_0x547071[_0x16ec57(0x15f)]+=_0x3ac2ce,_0x547071[_0x16ec57(0x15f)]>_0x547071[_0x16ec57(0x1f2)]?(_0x7d969d['capped']='',delete _0x7d969d[_0x16ec57(0x21d)]):_0x3ac2ce>_0x3023b7&&(_0x7d969d[_0x16ec57(0x1f7)]=_0x7d969d['value'][_0x16ec57(0x1da)](0x0,_0x3023b7),delete _0x7d969d['value']);}}[_0x5912e5(0x223)](_0x424199){var _0x5572ec=_0x5912e5;return!!(_0x424199&&_0x384dc5[_0x5572ec(0x236)]&&this[_0x5572ec(0x165)](_0x424199)===_0x5572ec(0x235)&&_0x424199[_0x5572ec(0x176)]);}[_0x5912e5(0x193)](_0x5f5383){var _0x2e11de=_0x5912e5;if(_0x5f5383[_0x2e11de(0x20a)](/^\\d+$/))return _0x5f5383;var _0x1aa966;try{_0x1aa966=JSON[_0x2e11de(0x23c)](''+_0x5f5383);}catch{_0x1aa966='\\x22'+this[_0x2e11de(0x165)](_0x5f5383)+'\\x22';}return _0x1aa966[_0x2e11de(0x20a)](/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)?_0x1aa966=_0x1aa966[_0x2e11de(0x1da)](0x1,_0x1aa966[_0x2e11de(0x1d1)]-0x2):_0x1aa966=_0x1aa966['replace'](/'/g,'\\x5c\\x27')['replace'](/\\\\\"/g,'\\x22')[_0x2e11de(0x1d0)](/(^\"|\"$)/g,'\\x27'),_0x1aa966;}[_0x5912e5(0x215)](_0x171c93,_0x4fee24,_0x2ca4b4,_0xedf8ed){var _0x535373=_0x5912e5;this[_0x535373(0x1b5)](_0x171c93,_0x4fee24),_0xedf8ed&&_0xedf8ed(),this['_additionalMetadata'](_0x2ca4b4,_0x171c93),this[_0x535373(0x184)](_0x171c93,_0x4fee24);}[_0x5912e5(0x1b5)](_0x2ebd83,_0x3f9e0f){var _0x534d40=_0x5912e5;this['_setNodeId'](_0x2ebd83,_0x3f9e0f),this['_setNodeQueryPath'](_0x2ebd83,_0x3f9e0f),this['_setNodeExpressionPath'](_0x2ebd83,_0x3f9e0f),this[_0x534d40(0x204)](_0x2ebd83,_0x3f9e0f);}[_0x5912e5(0x1d8)](_0x2e933c,_0x385494){}[_0x5912e5(0x19e)](_0xc261d6,_0x25eac6){}['_setNodeLabel'](_0x286b09,_0x35b50a){}[_0x5912e5(0x198)](_0x2e91fa){var _0x2d27dc=_0x5912e5;return _0x2e91fa===this[_0x2d27dc(0x202)];}[_0x5912e5(0x184)](_0x5c8393,_0xe5b471){var _0x176451=_0x5912e5;this[_0x176451(0x1b9)](_0x5c8393,_0xe5b471),this[_0x176451(0x1cd)](_0x5c8393),_0xe5b471['sortProps']&&this[_0x176451(0x168)](_0x5c8393),this[_0x176451(0x1c7)](_0x5c8393,_0xe5b471),this[_0x176451(0x1d4)](_0x5c8393,_0xe5b471),this[_0x176451(0x1c4)](_0x5c8393);}['_additionalMetadata'](_0x1c0865,_0x13e170){var _0x17768a=_0x5912e5;let _0x178c52;try{_0x384dc5[_0x17768a(0x230)]&&(_0x178c52=_0x384dc5['console'][_0x17768a(0x1ff)],_0x384dc5[_0x17768a(0x230)][_0x17768a(0x1ff)]=function(){}),_0x1c0865&&typeof _0x1c0865['length']==_0x17768a(0x185)&&(_0x13e170[_0x17768a(0x1d1)]=_0x1c0865[_0x17768a(0x1d1)]);}catch{}finally{_0x178c52&&(_0x384dc5[_0x17768a(0x230)][_0x17768a(0x1ff)]=_0x178c52);}if(_0x13e170[_0x17768a(0x1cc)]===_0x17768a(0x185)||_0x13e170['type']==='Number'){if(isNaN(_0x13e170[_0x17768a(0x21d)]))_0x13e170['nan']=!0x0,delete _0x13e170[_0x17768a(0x21d)];else switch(_0x13e170[_0x17768a(0x21d)]){case Number['POSITIVE_INFINITY']:_0x13e170[_0x17768a(0x228)]=!0x0,delete _0x13e170[_0x17768a(0x21d)];break;case Number[_0x17768a(0x172)]:_0x13e170['negativeInfinity']=!0x0,delete _0x13e170[_0x17768a(0x21d)];break;case 0x0:this[_0x17768a(0x15c)](_0x13e170[_0x17768a(0x21d)])&&(_0x13e170['negativeZero']=!0x0);break;}}else _0x13e170[_0x17768a(0x1cc)]==='function'&&typeof _0x1c0865['name']=='string'&&_0x1c0865['name']&&_0x13e170[_0x17768a(0x19a)]&&_0x1c0865[_0x17768a(0x19a)]!==_0x13e170[_0x17768a(0x19a)]&&(_0x13e170[_0x17768a(0x214)]=_0x1c0865['name']);}[_0x5912e5(0x15c)](_0xb31628){var _0x2e6c77=_0x5912e5;return 0x1/_0xb31628===Number[_0x2e6c77(0x172)];}[_0x5912e5(0x168)](_0x8d3d1e){var _0x2368dd=_0x5912e5;!_0x8d3d1e[_0x2368dd(0x20e)]||!_0x8d3d1e[_0x2368dd(0x20e)][_0x2368dd(0x1d1)]||_0x8d3d1e[_0x2368dd(0x1cc)]==='array'||_0x8d3d1e[_0x2368dd(0x1cc)]===_0x2368dd(0x236)||_0x8d3d1e[_0x2368dd(0x1cc)]===_0x2368dd(0x20b)||_0x8d3d1e[_0x2368dd(0x20e)]['sort'](function(_0xb287d0,_0x5228d6){var _0x327b1b=_0x2368dd,_0x2f7415=_0xb287d0[_0x327b1b(0x19a)][_0x327b1b(0x240)](),_0x469347=_0x5228d6[_0x327b1b(0x19a)]['toLowerCase']();return _0x2f7415<_0x469347?-0x1:_0x2f7415>_0x469347?0x1:0x0;});}[_0x5912e5(0x1c7)](_0x1a5a3f,_0x35f3d1){var _0xd17398=_0x5912e5;if(!(_0x35f3d1[_0xd17398(0x221)]||!_0x1a5a3f[_0xd17398(0x20e)]||!_0x1a5a3f[_0xd17398(0x20e)]['length'])){for(var _0x5f2780=[],_0x215bf8=[],_0x244d78=0x0,_0x3406fa=_0x1a5a3f[_0xd17398(0x20e)][_0xd17398(0x1d1)];_0x244d78<_0x3406fa;_0x244d78++){var _0x4aaf1c=_0x1a5a3f[_0xd17398(0x20e)][_0x244d78];_0x4aaf1c[_0xd17398(0x1cc)]==='function'?_0x5f2780['push'](_0x4aaf1c):_0x215bf8[_0xd17398(0x224)](_0x4aaf1c);}if(!(!_0x215bf8[_0xd17398(0x1d1)]||_0x5f2780[_0xd17398(0x1d1)]<=0x1)){_0x1a5a3f[_0xd17398(0x20e)]=_0x215bf8;var _0x3112cd={'functionsNode':!0x0,'props':_0x5f2780};this[_0xd17398(0x1d8)](_0x3112cd,_0x35f3d1),this[_0xd17398(0x1b9)](_0x3112cd,_0x35f3d1),this[_0xd17398(0x1cd)](_0x3112cd),this['_setNodePermissions'](_0x3112cd,_0x35f3d1),_0x3112cd['id']+='\\x20f',_0x1a5a3f[_0xd17398(0x20e)][_0xd17398(0x234)](_0x3112cd);}}}[_0x5912e5(0x1d4)](_0x11d010,_0x3657a0){}[_0x5912e5(0x1cd)](_0x5c207f){}[_0x5912e5(0x21a)](_0x5a2d96){var _0xb586dc=_0x5912e5;return Array[_0xb586dc(0x1ac)](_0x5a2d96)||typeof _0x5a2d96==_0xb586dc(0x18e)&&this[_0xb586dc(0x165)](_0x5a2d96)===_0xb586dc(0x1f5);}['_setNodePermissions'](_0x3056a9,_0x476bf7){}[_0x5912e5(0x1c4)](_0x517190){var _0x50a916=_0x5912e5;delete _0x517190[_0x50a916(0x20d)],delete _0x517190[_0x50a916(0x241)],delete _0x517190['_hasMapOnItsPath'];}[_0x5912e5(0x216)](_0x2130d4,_0x1ad273){}}let _0x4dce6d=new _0x2b9a0a(),_0x142575={'props':0x64,'elements':0x64,'strLength':0x400*0x32,'totalStrLength':0x400*0x32,'autoExpandLimit':0x1388,'autoExpandMaxDepth':0xa},_0x58e9b8={'props':0x5,'elements':0x5,'strLength':0x100,'totalStrLength':0x100*0x3,'autoExpandLimit':0x1e,'autoExpandMaxDepth':0x2};function _0x3e24b2(_0x2f9603,_0x2fddd0,_0xb7ec16,_0xc6d90f,_0x1f87dd,_0x5cb1c7){var _0x5b5563=_0x5912e5;let _0xa7da97,_0x5bbd93;try{_0x5bbd93=_0x363593(),_0xa7da97=_0x216568[_0x2fddd0],!_0xa7da97||_0x5bbd93-_0xa7da97['ts']>0x1f4&&_0xa7da97[_0x5b5563(0x1b3)]&&_0xa7da97['time']/_0xa7da97[_0x5b5563(0x1b3)]<0x64?(_0x216568[_0x2fddd0]=_0xa7da97={'count':0x0,'time':0x0,'ts':_0x5bbd93},_0x216568[_0x5b5563(0x167)]={}):_0x5bbd93-_0x216568[_0x5b5563(0x167)]['ts']>0x32&&_0x216568[_0x5b5563(0x167)][_0x5b5563(0x1b3)]&&_0x216568[_0x5b5563(0x167)]['time']/_0x216568[_0x5b5563(0x167)][_0x5b5563(0x1b3)]<0x64&&(_0x216568[_0x5b5563(0x167)]={});let _0x35f192=[],_0x237445=_0xa7da97['reduceLimits']||_0x216568[_0x5b5563(0x167)]['reduceLimits']?_0x58e9b8:_0x142575,_0x4c9b45=_0x3f9b44=>{var _0x4632f9=_0x5b5563;let _0x19522a={};return _0x19522a[_0x4632f9(0x20e)]=_0x3f9b44[_0x4632f9(0x20e)],_0x19522a[_0x4632f9(0x1ed)]=_0x3f9b44['elements'],_0x19522a[_0x4632f9(0x166)]=_0x3f9b44[_0x4632f9(0x166)],_0x19522a[_0x4632f9(0x1f2)]=_0x3f9b44['totalStrLength'],_0x19522a[_0x4632f9(0x21b)]=_0x3f9b44['autoExpandLimit'],_0x19522a[_0x4632f9(0x1a6)]=_0x3f9b44[_0x4632f9(0x1a6)],_0x19522a[_0x4632f9(0x1d6)]=!0x1,_0x19522a[_0x4632f9(0x221)]=!_0x22a91d,_0x19522a['depth']=0x1,_0x19522a[_0x4632f9(0x1fc)]=0x0,_0x19522a[_0x4632f9(0x1df)]=_0x4632f9(0x1aa),_0x19522a['rootExpression']=_0x4632f9(0x23d),_0x19522a[_0x4632f9(0x1c2)]=!0x0,_0x19522a[_0x4632f9(0x212)]=[],_0x19522a['autoExpandPropertyCount']=0x0,_0x19522a[_0x4632f9(0x1cf)]=!0x0,_0x19522a[_0x4632f9(0x15f)]=0x0,_0x19522a[_0x4632f9(0x1f8)]={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x19522a;};for(var _0x18ac01=0x0;_0x18ac01<_0x1f87dd[_0x5b5563(0x1d1)];_0x18ac01++)_0x35f192['push'](_0x4dce6d[_0x5b5563(0x1cb)]({'timeNode':_0x2f9603==='time'||void 0x0},_0x1f87dd[_0x18ac01],_0x4c9b45(_0x237445),{}));if(_0x2f9603===_0x5b5563(0x19c)){let _0x876c60=Error[_0x5b5563(0x18d)];try{Error[_0x5b5563(0x18d)]=0x1/0x0,_0x35f192[_0x5b5563(0x224)](_0x4dce6d[_0x5b5563(0x1cb)]({'stackNode':!0x0},new Error()['stack'],_0x4c9b45(_0x237445),{'strLength':0x1/0x0}));}finally{Error[_0x5b5563(0x18d)]=_0x876c60;}}return{'method':'log','version':_0x368218,'args':[{'ts':_0xb7ec16,'session':_0xc6d90f,'args':_0x35f192,'id':_0x2fddd0,'context':_0x5cb1c7}]};}catch(_0x43cd40){return{'method':'log','version':_0x368218,'args':[{'ts':_0xb7ec16,'session':_0xc6d90f,'args':[{'type':'unknown','error':_0x43cd40&&_0x43cd40[_0x5b5563(0x194)]}],'id':_0x2fddd0,'context':_0x5cb1c7}]};}finally{try{if(_0xa7da97&&_0x5bbd93){let _0x3f23c0=_0x363593();_0xa7da97['count']++,_0xa7da97['time']+=_0x40dd8d(_0x5bbd93,_0x3f23c0),_0xa7da97['ts']=_0x3f23c0,_0x216568['hits'][_0x5b5563(0x1b3)]++,_0x216568['hits'][_0x5b5563(0x23a)]+=_0x40dd8d(_0x5bbd93,_0x3f23c0),_0x216568[_0x5b5563(0x167)]['ts']=_0x3f23c0,(_0xa7da97['count']>0x32||_0xa7da97['time']>0x64)&&(_0xa7da97[_0x5b5563(0x16c)]=!0x0),(_0x216568[_0x5b5563(0x167)][_0x5b5563(0x1b3)]>0x3e8||_0x216568['hits'][_0x5b5563(0x23a)]>0x12c)&&(_0x216568[_0x5b5563(0x167)][_0x5b5563(0x16c)]=!0x0);}}catch{}}}return _0x3e24b2;}((_0x337908,_0x179879,_0x4217ad,_0x25f594,_0x23a7cf,_0x5eba63,_0x59ceed,_0x41dd80,_0x51a490,_0x18fb5e)=>{var _0x4f03d4=_0x17e9a5;if(_0x337908[_0x4f03d4(0x23e)])return _0x337908['_console_ninja'];if(!J(_0x337908,_0x41dd80,_0x23a7cf))return _0x337908[_0x4f03d4(0x23e)]={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}},_0x337908[_0x4f03d4(0x23e)];let _0x16127c=W(_0x337908),_0xf09a27=_0x16127c[_0x4f03d4(0x1a3)],_0x14b12d=_0x16127c[_0x4f03d4(0x1ce)],_0x4fcc27=_0x16127c[_0x4f03d4(0x1ba)],_0x19af8f={'hits':{},'ts':{}},_0x194441=Y(_0x337908,_0x51a490,_0x19af8f,_0x5eba63),_0x56035a=_0x364d52=>{_0x19af8f['ts'][_0x364d52]=_0x14b12d();},_0x14aac6=(_0x4e4eca,_0x979543)=>{var _0x4b0bc8=_0x4f03d4;let _0x5efd02=_0x19af8f['ts'][_0x979543];if(delete _0x19af8f['ts'][_0x979543],_0x5efd02){let _0x525aa3=_0xf09a27(_0x5efd02,_0x14b12d());_0x23cf08(_0x194441(_0x4b0bc8(0x23a),_0x4e4eca,_0x4fcc27(),_0x31de31,[_0x525aa3],_0x979543));}},_0x3c7950=_0x1068a4=>_0x20fe32=>{var _0x21bdb8=_0x4f03d4;try{_0x56035a(_0x20fe32),_0x1068a4(_0x20fe32);}finally{_0x337908['console'][_0x21bdb8(0x23a)]=_0x1068a4;}},_0x30fb21=_0x364688=>_0x2500e7=>{var _0x2ddfb0=_0x4f03d4;try{let [_0x38c190,_0x4a401e]=_0x2500e7[_0x2ddfb0(0x182)](_0x2ddfb0(0x1e0));_0x14aac6(_0x4a401e,_0x38c190),_0x364688(_0x38c190);}finally{_0x337908[_0x2ddfb0(0x230)]['timeEnd']=_0x364688;}};_0x337908[_0x4f03d4(0x23e)]={'consoleLog':(_0xa74805,_0x8c3aaa)=>{var _0x59b540=_0x4f03d4;_0x337908[_0x59b540(0x230)]['log'][_0x59b540(0x19a)]!=='disabledLog'&&_0x23cf08(_0x194441(_0x59b540(0x1ea),_0xa74805,_0x4fcc27(),_0x31de31,_0x8c3aaa));},'consoleTrace':(_0x561720,_0x7df83c)=>{var _0x4fe14e=_0x4f03d4;_0x337908[_0x4fe14e(0x230)][_0x4fe14e(0x1ea)][_0x4fe14e(0x19a)]!==_0x4fe14e(0x225)&&_0x23cf08(_0x194441(_0x4fe14e(0x19c),_0x561720,_0x4fcc27(),_0x31de31,_0x7df83c));},'consoleTime':()=>{var _0x483085=_0x4f03d4;_0x337908[_0x483085(0x230)][_0x483085(0x23a)]=_0x3c7950(_0x337908[_0x483085(0x230)][_0x483085(0x23a)]);},'consoleTimeEnd':()=>{var _0x34673d=_0x4f03d4;_0x337908[_0x34673d(0x230)][_0x34673d(0x200)]=_0x30fb21(_0x337908[_0x34673d(0x230)][_0x34673d(0x200)]);},'autoLog':(_0x46e03b,_0x39c785)=>{_0x23cf08(_0x194441('log',_0x39c785,_0x4fcc27(),_0x31de31,[_0x46e03b]));},'autoLogMany':(_0x5e5c6a,_0x284614)=>{var _0x42a3db=_0x4f03d4;_0x23cf08(_0x194441(_0x42a3db(0x1ea),_0x5e5c6a,_0x4fcc27(),_0x31de31,_0x284614));},'autoTrace':(_0x5b7543,_0x3c52f2)=>{var _0x552adb=_0x4f03d4;_0x23cf08(_0x194441(_0x552adb(0x19c),_0x3c52f2,_0x4fcc27(),_0x31de31,[_0x5b7543]));},'autoTraceMany':(_0x3d2cc6,_0x3688bd)=>{var _0x4d8045=_0x4f03d4;_0x23cf08(_0x194441(_0x4d8045(0x19c),_0x3d2cc6,_0x4fcc27(),_0x31de31,_0x3688bd));},'autoTime':(_0x44306b,_0xd0381a,_0x4f3df8)=>{_0x56035a(_0x4f3df8);},'autoTimeEnd':(_0x17bb31,_0x48c56c,_0x1f00e8)=>{_0x14aac6(_0x48c56c,_0x1f00e8);},'coverage':_0x22eabe=>{_0x23cf08({'method':'coverage','version':_0x5eba63,'args':[{'id':_0x22eabe}]});}};let _0x23cf08=b(_0x337908,_0x179879,_0x4217ad,_0x25f594,_0x23a7cf,_0x18fb5e),_0x31de31=_0x337908['_console_ninja_session'];return _0x337908[_0x4f03d4(0x23e)];})(globalThis,_0x17e9a5(0x1ad),_0x17e9a5(0x19b),_0x17e9a5(0x229),_0x17e9a5(0x232),_0x17e9a5(0x22f),_0x17e9a5(0x1c9),_0x17e9a5(0x19d),'',_0x17e9a5(0x1f4));function _0x4daf(){var _0x2c83ee=[[\"localhost\",\"127.0.0.1\",\"example.cypress.io\",\"e1r12p3.1337.ma\",\"10.11.12.3\"],'_setNodeQueryPath','10549098ZHkDfj','_regExpToString','_connected','concat','elapsed','_HTMLAllCollection','_p_length','autoExpandMaxDepth','defineProperty','warn','symbol','root_exp_id','18UqVPhN','isArray','127.0.0.1','default','[object\\x20Set]','_webSocketErrorDocsLink','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20','nodeModules','count','_reconnectTimeout','_treeNodePropertiesBeforeFullValue','readyState','versions','join','_setNodeLabel','now','HTMLAllCollection','expressionsToEvaluate','failed\\x20to\\x20connect\\x20to\\x20host:\\x20','_property','call','parent','187768pnXuZj','autoExpand','_getOwnPropertyNames','_cleanNode','_WebSocketClass','host','_addFunctionsNode','_connecting','1700569204651','_isSet','serialize','type','_setNodeExpandableState','timeStamp','resolveGetters','replace','length','getter','reload','_addLoadNode','_addObjectProperty','sortProps','Error','_setNodeId','next.js','substr','send','set','get','_p_','expId',':logPointId:','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','path','hasOwnProperty','_Symbol','isExpressionToEvaluate','...','cappedProps','_isPrimitiveWrapperType','url','log','onopen','getOwnPropertySymbols','elements','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host','_keyStrRegExp','_dateToString','_attemptToReconnectShortly','totalStrLength','[object\\x20Date]','','[object\\x20Array]','enumerable','capped','node','then','array','_additionalMetadata','level','port','pop','error','timeEnd','ws://','_undefined','_addProperty','_setNodePermissions','valueOf','_consoleNinjaAllowedToStart','_isPrimitiveType','363ZYVAyU','boolean','match','Set','onmessage','_hasSymbolPropertyOnItsPath','props','RegExp','global','slice','autoExpandPreviousObjects','\\x20browser','funcName','_processTreeNodeResult','_setNodeExpressionPath','index','2382wEdONV','depth','_isArray','autoExpandLimit','prototype','value','close','bigint','autoExpandPropertyCount','noFunctions','current','_isMap','push','disabledTrace','edge','hostname','positiveInfinity',\"/Users/hselbi/.vscode/extensions/wallabyjs.console-ninja-1.0.260/node_modules\",'_allowedToSend','function','pathToFileURL','performance','getPrototypeOf','1.0.0','console','_socket','nest.js','location','unshift','[object\\x20Map]','Map','perf_hooks','_inNextEdge','\\x20server','time','onerror','stringify','root_exp','_console_ninja','_getOwnPropertySymbols','toLowerCase','_hasSetOnItsPath','setter','ws/index.js','_connectAttemptCount','_allowedToConnectOnSend','unref','_isNegativeZero','getOwnPropertyDescriptor','String','allStrLength','1119480wMIyrp','_capIfString','_sendErrorMessage','WebSocket','_disposeWebsocket','_objectToString','strLength','hits','_sortProps','_quotedRegExp','_console_ninja_session','__es'+'Module','reduceLimits','constructor','_maxConnectAttemptCount','_numberRegExp','_WebSocket','_inBrowser','NEGATIVE_INFINITY','env','_connectToHostNow','_p_name','forEach','_blacklistedProperty','logger\\x20websocket\\x20error','onclose','184954oxnhpr','dockerizedApp','NEXT_RUNTIME','_type','test','null','1514950RlskIU','getOwnPropertyNames','split','process','_treeNodePropertiesAfterFullValue','number','428631HRtQpr','_ws','Buffer','undefined','string','date','create','stackTraceLimit','object','bind','catch','cappedElements','gateway.docker.internal','_propertyName','message','toString','Symbol','hrtime','_isUndefined','parse','name','50833','trace'];_0x4daf=function(){return _0x2c83ee;};return _0x4daf();}");
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
//# sourceMappingURL=chat.gateway.js.map