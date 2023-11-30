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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const passport_1 = require("@nestjs/passport");
const jwtservice_service_1 = require("../auth/jwt/jwtservice.service");
const JwtGuard_1 = require("../auth/jwt/JwtGuard");
const prisma_service_1 = require("../prisma.service");
const numberDto_1 = require("./utils/numberDto");
const NumberDtoO_1 = require("./utils/NumberDtoO");
const config_1 = require("@nestjs/config");
let AuthController = class AuthController {
    constructor(service, jwt, prisma, config) {
        this.service = service;
        this.jwt = jwt;
        this.prisma = prisma;
        this.config = config;
    }
    Login() { }
    async redirect(req, res) {
        console.log('alright');
        const accessToken = this.jwt.sign(req.user);
        res
            .cookie(this.config.get('cookie'), accessToken, {
            httponly: true,
        })
            .status(200);
        const user = await this.prisma.user.findUnique({
            where: { id_user: req.user.id },
        });
        if (user.TwoFactor) {
            res.redirect(this.config.get('AuthenticationPath'));
            return req;
        }
        if (user.IsFirstTime) {
            await this.prisma.user.update({
                where: { id_user: req.user.id },
                data: { IsFirstTime: false },
            });
            res.redirect(this.config.get('settingsPath'));
        }
        else {
            res.redirect(this.config.get('homepath'));
        }
        return req;
    }
    getSessionToken(req) {
        const sessionToken = this.jwt.verify(req.cookies[this.config.get('cookie')]);
        return `Session Token: ${sessionToken}`;
    }
    async GenerateQrCode(req) {
        const qrCodeDataURL = await this.service.GenerateQrCode(req);
        return qrCodeDataURL;
    }
    async Verify_QrCode(body, req) {
        const msg = await this.service.Verify_QrCode(body, req);
        if (msg == null)
            return (null);
        return msg.msg;
    }
    async Insert_Friends(body, req) {
        const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
        try {
            await this.prisma.user.update({
                where: { id_user: decoded.id },
                data: {
                    freind: {
                        create: {
                            id_freind: body.id_user,
                        },
                    },
                },
            });
            await this.prisma.user.update({
                where: { id_user: body.id_user },
                data: {
                    freind: {
                        create: {
                            id_freind: decoded.id,
                        },
                    },
                },
            });
            await this.prisma.notification.deleteMany({
                where: {
                    AND: [{ userId: decoded.id }, { id_user: body.id_user }],
                },
            });
            const user = await this.prisma.user.findUnique({
                where: { id_user: decoded.id },
                include: { freind: true },
            });
            const otherUser = await this.prisma.user.findUnique({
                where: { id_user: body.id_user },
                include: { freind: true },
            });
        }
        catch (err) {
        }
    }
    async Remove_friends(Body, req) {
        const friendData = await this.prisma.user.findUnique({
            where: { id_user: Body.id_user },
        });
        const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
        const user = await this.prisma.freind.deleteMany({
            where: {
                AND: [{ userId: decoded.id }, { id_freind: Body.id_user }],
            },
        });
        await this.prisma.freind.deleteMany({
            where: {
                AND: [{ userId: Body.id_user }, { id_freind: decoded.id }],
            },
        });
    }
    async Block_friends(Body, req) {
        const friendData = await this.prisma.user.findUnique({
            where: { id_user: Body.id_user },
        });
        const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
        const user = await this.prisma.user.update({
            where: { id_user: decoded.id },
            data: {
                blockedUser: {
                    create: {
                        id_blocked_user: Body.id_user,
                    },
                },
            },
        });
        this.Remove_friends(Body, req);
    }
    async DeBlock_friends(Body, req) {
        const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
        await this.prisma.blockedUser.deleteMany({
            where: {
                AND: [{ id_blocked_user: Body.id_user }, { userId: decoded.id }],
            },
        });
    }
    async Get_FriendsList(req) {
        const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
        const user = await this.prisma.user.findUnique({
            where: { id_user: decoded.id },
        });
        const friends = await this.prisma.user.findUnique({
            where: { id_user: decoded.id },
            include: {
                freind: {
                    select: { id_freind: true },
                },
            },
        });
        const obj = friends.freind;
        let FriendList = {};
        const idFriends = obj.map((scope) => scope.id_freind);
        for (const num of idFriends) {
            const OneFriend = await this.prisma.user.findUnique({
                where: { id_user: num },
            });
            const name = OneFriend.name;
            FriendList = { name: OneFriend };
        }
        const WantedObj = { AccountOwner: user, FriendList };
        const scoop = { FriendList };
        return scoop;
    }
    async only_friends(req) {
        const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
        const friends = await this.prisma.user.findUnique({
            where: { id_user: decoded.id },
            include: {
                freind: {
                    select: { id_freind: true },
                },
            },
        });
        if (friends == null)
            return null;
        const obj = friends.freind;
        if (obj == null)
            return [];
        const idFriends = obj.map((scope) => scope.id_freind);
        if (idFriends.length == 0)
            return [];
        let array = [];
        for (const num of idFriends) {
            const OneFriend = await this.prisma.user.findUnique({
                where: { id_user: num },
                include: {
                    history: true,
                    achievments: true,
                },
            });
            array.push(OneFriend);
        }
        return array;
    }
    async Get_User(req) {
        const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
        let obj = [];
        const user = await this.prisma.user.findUnique({
            where: { id_user: decoded.id },
        });
        obj.push(user);
        return obj;
    }
    async Get_All_Users(req) {
        const users = await this.prisma.user.findMany({});
        return users;
    }
    async TwofactorAuth(body, req) {
        const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
        const user = await this.prisma.user.update({
            where: { id_user: decoded.id },
            data: {
                TwoFactor: body.enable,
            },
        });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)("login/42"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("42")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "Login", null);
__decorate([
    (0, common_1.Get)("login/42/redirect"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("42")),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "redirect", null);
__decorate([
    (0, common_1.Get)("get-session-token"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getSessionToken", null);
__decorate([
    (0, common_1.Get)("get-qrcode"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "GenerateQrCode", null);
__decorate([
    (0, common_1.Post)("verify-qrcode"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [numberDto_1.NumberDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "Verify_QrCode", null);
__decorate([
    (0, common_1.Post)("add-friends"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NumberDtoO_1.NumberDtoO, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "Insert_Friends", null);
__decorate([
    (0, common_1.Post)("remove-friends"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NumberDtoO_1.NumberDtoO, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "Remove_friends", null);
__decorate([
    (0, common_1.Post)("Block-friends"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NumberDtoO_1.NumberDtoO, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "Block_friends", null);
__decorate([
    (0, common_1.Post)("DeBlock-friends"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NumberDtoO_1.NumberDtoO, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "DeBlock_friends", null);
__decorate([
    (0, common_1.Get)("get-friendsList"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "Get_FriendsList", null);
__decorate([
    (0, common_1.Get)("friends"),
    (0, common_1.UseGuards)(JwtGuard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "only_friends", null);
__decorate([
    (0, common_1.Get)("get-user"),
    (0, common_1.UseGuards)(JwtGuard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "Get_User", null);
__decorate([
    (0, common_1.Get)("get-all-users"),
    (0, common_1.UseGuards)(JwtGuard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "Get_All_Users", null);
__decorate([
    (0, common_1.Post)("TwoFactorAuth"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "TwofactorAuth", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        jwtservice_service_1.JwtService,
        prisma_service_1.PrismaService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map