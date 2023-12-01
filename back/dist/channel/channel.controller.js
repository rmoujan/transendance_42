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
exports.ChannelsController = void 0;
const common_1 = require("@nestjs/common");
const channel_service_1 = require("./channel.service");
const users_service_1 = require("../users/users.service");
const jwtservice_service_1 = require("../auth/jwt/jwtservice.service");
const config_1 = require("@nestjs/config");
let ChannelsController = class ChannelsController {
    constructor(jwt, channelsService, UsersService, config) {
        this.jwt = jwt;
        this.channelsService = channelsService;
        this.UsersService = UsersService;
        this.config = config;
    }
    async create(req, data) {
        if (data) {
            if (!data.title || !data.members || !data.type) {
                return (false);
            }
            if (data.type === "protected") {
                if (!data.password) {
                    return (false);
                }
            }
        }
        else
            return (false);
        try {
            const decode = this.jwt.verify(req.cookies[this.config.get('cookie')]);
            const user = await this.UsersService.findById(decode.id);
            if (user) {
                const channel = await this.channelsService.createChannel(data, user.id_user);
                if (channel)
                    return (true);
                else
                    return false;
            }
        }
        catch (error) {
            return { message: 'An error occurred', error: error.message };
        }
    }
    async join(req, data) {
        if (data) {
            if (!data.sendData.id_channel || !data.sendData.name || !data.sendData.visibility) {
                return (false);
            }
            if (data.sendData.visibility === "protected") {
                if (!data.sendData.password) {
                    return (false);
                }
            }
        }
        else
            return (false);
        try {
            const decode = this.jwt.verify(req.cookies[this.config.get('cookie')]);
            const user = await this.UsersService.findById(decode.id);
            if (user) {
                const memberChannel = await this.channelsService.joinChannel(data, user.id_user);
                if (memberChannel) {
                    return (true);
                }
                else {
                    return (false);
                }
            }
            else
                return (false);
        }
        catch (error) {
            return (false);
        }
    }
    async updatePass(req, data) {
        if (data) {
            if (!data.password || !data.channel_id || !data.user_id) {
                return (false);
            }
        }
        else
            return (false);
        try {
            const decode = this.jwt.verify(req.cookies[this.config.get('cookie')]);
            const user = await this.UsersService.findById(decode.id);
            if (user) {
                const updated = await this.channelsService.updatePass(data, user.id_user);
                if (updated)
                    return (true);
                else
                    return (false);
            }
            else
                return (false);
        }
        catch (error) {
            return { message: 'An error occurred', error: error.message };
        }
    }
    async removePass(req, data) {
        if (data) {
            if (!data.id_channel || !data.user_id)
                return (false);
        }
        else
            return (false);
        try {
            const decode = this.jwt.verify(req.cookies[this.config.get('cookie')]);
            const user = await this.UsersService.findById(decode.id);
            if (user) {
                const remove = await this.channelsService.removePass(data, user.id_user);
                if (remove)
                    return (true);
                else
                    return (false);
            }
            else
                return (false);
        }
        catch (error) {
            return { message: 'An error occurred', error: error.message };
        }
    }
    async setPass(req, data) {
        if (data) {
            if (!data.password || !data.user_id || !data.channel_id) {
                return (false);
            }
        }
        else
            return (false);
        try {
            const decode = this.jwt.verify(req.cookies[this.config.get('cookie')]);
            const user = await this.UsersService.findById(decode.id);
            if (user) {
                const setch = await this.channelsService.setPass(data, user.id_user);
                if (setch) {
                    return (true);
                }
                else
                    return (false);
            }
            else
                return (false);
        }
        catch (error) {
            return { message: 'An error occurred', error: error.message };
        }
    }
    async setAdmin(req, data) {
        if (data) {
            if (!data.to || !data.channel_id || !data.from) {
                return (false);
            }
        }
        else
            return (false);
        try {
            const result = await this.channelsService.setAdmin(data);
            if (result)
                return (true);
            else
                return (false);
        }
        catch (error) {
            return { message: 'An error occurred', error: error.message };
        }
    }
    async removeChannel(req, data) {
        if (data) {
            if (!data.user_id || !data.channel_id) {
                return (false);
            }
        }
        else
            return (false);
        try {
            const user = await this.UsersService.findById(data.user_id);
            if (user) {
                const result = await this.channelsService.removeChannel(data, user.id_user);
                if (result)
                    return (true);
                else
                    return (false);
            }
        }
        catch (error) {
            return { message: 'An error occurred', error: error.message };
        }
    }
    async getPublicChannels() {
        try {
            return this.channelsService.getPublicChannels();
        }
        catch (error) {
            return { message: 'An error occurred', error: error.message };
        }
    }
    async getProtectedChannels() {
        try {
            return this.channelsService.getProtectedChannels();
        }
        catch (error) {
            return { message: 'An error occurred', error: error.message };
        }
    }
    async getPrivateChannels() {
        try {
            return this.channelsService.getPrivateChannels();
        }
        catch (error) {
            return { message: 'An error occurred', error: error.message };
        }
    }
    async getAllChannels(req, data) {
        try {
            const decode = this.jwt.verify(req.cookies[this.config.get('cookie')]);
            const user = await this.UsersService.findById(decode.id);
            const myAllChannels = await this.channelsService.getAllChannels(user.id_user);
            let message = "";
            let sent = null;
            if (myAllChannels) {
                const arrayOfChannels = [];
                for (const channels of myAllChannels) {
                    message = "";
                    sent = null;
                    const lastMsg = await this.channelsService.getTheLastMessageOfChannel(channels.channelId);
                    if (lastMsg) {
                        message = lastMsg.message;
                        sent = lastMsg.dateSent;
                    }
                    const admins = await this.channelsService.getAllAdmins(channels.channelId);
                    const memebers = await this.channelsService.getAllMembers(channels.channelId);
                    const owners = await this.channelsService.getAllOwners(channels.channelId);
                    const newCh = {
                        channel_id: channels.channelId,
                        image: channels.channel.img,
                        name: channels.channel.name,
                        owner: owners,
                        admin: admins,
                        members: memebers,
                        last_messages: message,
                        time: sent,
                        unread: true,
                        channel_type: channels.channel.visibility,
                    };
                    arrayOfChannels.push(newCh);
                }
                return arrayOfChannels;
            }
        }
        catch (error) {
            return { message: 'An error occurred', error: error.message };
        }
    }
};
exports.ChannelsController = ChannelsController;
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('join'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "join", null);
__decorate([
    (0, common_1.Post)('updatePass'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "updatePass", null);
__decorate([
    (0, common_1.Post)('removePass'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "removePass", null);
__decorate([
    (0, common_1.Post)('setPass'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "setPass", null);
__decorate([
    (0, common_1.Post)('setAdmin'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "setAdmin", null);
__decorate([
    (0, common_1.Post)('removeChannel'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "removeChannel", null);
__decorate([
    (0, common_1.Get)('allPublic'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getPublicChannels", null);
__decorate([
    (0, common_1.Get)('allProtected'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getProtectedChannels", null);
__decorate([
    (0, common_1.Get)('allprivate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getPrivateChannels", null);
__decorate([
    (0, common_1.Get)('allChannels'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getAllChannels", null);
exports.ChannelsController = ChannelsController = __decorate([
    (0, common_1.Controller)('channels'),
    __metadata("design:paramtypes", [jwtservice_service_1.JwtService,
        channel_service_1.ChannelsService,
        users_service_1.UsersService,
        config_1.ConfigService])
], ChannelsController);
//# sourceMappingURL=channel.controller.js.map