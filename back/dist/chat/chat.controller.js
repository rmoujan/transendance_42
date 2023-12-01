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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const users_service_1 = require("../users/users.service");
const jwtservice_service_1 = require("../auth/jwt/jwtservice.service");
const config_1 = require("@nestjs/config");
let ChatController = class ChatController {
    constructor(jwt, chatService, UsersService, config) {
        this.jwt = jwt;
        this.chatService = chatService;
        this.UsersService = UsersService;
        this.config = config;
    }
    async getAllConversations(req) {
        try {
            const decode = this.jwt.verify(req.cookies[this.config.get('cookie')]);
            if (decode) {
                if (!decode.id)
                    return (false);
                const user = await this.UsersService.findById(decode.id);
                return this.chatService.getAllConversations(user.id_user);
            }
            else
                return (false);
        }
        catch (error) {
            return { message: 'An error occurred', error: error.message };
        }
    }
    async getAllMessages(req, data) {
        try {
            if (data) {
                if (!data.idDm)
                    return (false);
            }
            else
                return (false);
            return this.chatService.getAllMessages(data.idDm);
        }
        catch (error) {
            return { message: 'An error occurred', error: error.message };
        }
    }
    async getAllMessagesRoom(req, data) {
        try {
            if (data) {
                if (!data.idRoom)
                    return (false);
            }
            else
                return (false);
            return this.chatService.getAllMessagesRoom(data.idRoom);
        }
        catch (error) {
            return { message: 'An error occurred', error: error.message };
        }
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)('allConversationsDm'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getAllConversations", null);
__decorate([
    (0, common_1.Get)('allMessagesDm'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getAllMessages", null);
__decorate([
    (0, common_1.Get)('allMessagesRoom'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getAllMessagesRoom", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chatData'),
    __metadata("design:paramtypes", [jwtservice_service_1.JwtService,
        chat_service_1.ChatService,
        users_service_1.UsersService,
        config_1.ConfigService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map