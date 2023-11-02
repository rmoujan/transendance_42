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
const jwtservice_service_1 = require("../jwt/jwtservice.service");
const prisma_service_1 = require("../prisma.service");
let AuthController = class AuthController {
    constructor(service, jwt, prisma) {
        this.service = service;
        this.jwt = jwt;
        this.prisma = prisma;
    }
    Login() { }
    async redirect(req, res) {
        const accessToken = this.jwt.sign(req.user);
        res.cookie('cookie', accessToken).status(200);
        const user = await this.prisma.user.findUnique({
            where: { id_user: req.user.id },
        });
        if (user.TwoFactor) {
            res.redirect('http://localhost:5173/Authentication');
            return (req);
        }
        if (user.IsFirstTime) {
            {
                console.log('first time');
                await this.prisma.user.update({ where: { id_user: req.user.id }, data: { IsFirstTime: false } });
                res.redirect('http://localhost:5173/setting');
            }
        }
        else {
            console.log('not first time');
            res.redirect('http://localhost:5173/home');
        }
        return (req);
    }
    getSessionToken(req) {
        const sessionToken = this.jwt.verify(req.cookies['cookie']);
        return `Session Token: ${sessionToken}`;
    }
    async GenerateQrCode(req) {
        const qrCodeDataURL = await this.service.GenerateQrCode(req);
        return qrCodeDataURL;
    }
    async Verify_QrCode(body, req) {
        const msg = await this.service.Verify_QrCode(body, req);
        return (msg.msg);
    }
    async Insert_Friends(body, req) {
        const decoded = this.jwt.verify(req.cookies['cookie']);
        const user = await this.prisma.user.update({
            where: { id_user: 90240 },
            data: {
                freind: {
                    create: {
                        id_freind: 98853,
                    },
                },
            },
        });
    }
    async Remove_friends(Body, req) {
        const friendData = await this.prisma.user.findUnique({ where: { id_user: Body.id_user } });
        const decoded = this.jwt.verify(req.cookies['cookie']);
        console.log(friendData);
        const user = await this.prisma.freind.deleteMany({
            where: {
                AND: [
                    { userId: decoded.id },
                    { id_freind: Body.id_user },
                ]
            },
        });
    }
    async Block_friends(Body, req) {
        const friendData = await this.prisma.user.findUnique({ where: { id_user: Body.id_user } });
        const decoded = this.jwt.verify(req.cookies['cookie']);
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
    async Get_FriendsList(req) {
        const decoded = this.jwt.verify(req.cookies['cookie']);
        const user = await this.prisma.user.findUnique({ where: { id_user: decoded.id }, });
        const friends = await this.prisma.user.findUnique({
            where: { id_user: decoded.id },
            include: {
                freind: {
                    select: { id_freind: true },
                }
            }
        });
        const obj = friends.freind;
        let FriendList = {};
        const idFriends = obj.map((scope => scope.id_freind));
        for (const num of idFriends) {
            const OneFriend = await this.prisma.user.findUnique({
                where: { id_user: num },
            });
            const name = OneFriend.name;
            FriendList = { name: OneFriend };
        }
        const WantedObj = { AccountOwner: user, FriendList };
        const scoop = { FriendList };
        return (scoop);
    }
    async only_friends(req) {
        const decoded = this.jwt.verify(req.cookies['cookie']);
        const friends = await this.prisma.user.findUnique({
            where: { id_user: decoded.id },
            include: {
                freind: {
                    select: { id_freind: true },
                }
            }
        });
        const obj = friends.freind;
        const idFriends = obj.map((scope => scope.id_freind));
        let array = [];
        for (const num of idFriends) {
            const OneFriend = await this.prisma.user.findUnique({
                where: { id_user: num },
            });
            array.push(OneFriend);
        }
        return array;
    }
    async Get_User(req) {
        const decoded = this.jwt.verify(req.cookies['cookie']);
        let obj = [];
        const user = await this.prisma.user.findUnique({ where: { id_user: decoded.id }, });
        obj.push(user);
        return obj;
    }
    async TwofactorAuth(body, req) {
        const decoded = this.jwt.verify(req.cookies['cookie']);
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
    (0, common_1.Get)('login/42'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('42')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "Login", null);
__decorate([
    (0, common_1.Get)('login/42/redirect'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('42')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "redirect", null);
__decorate([
    (0, common_1.Get)('get-session-token'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getSessionToken", null);
__decorate([
    (0, common_1.Get)('get-qrcode'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "GenerateQrCode", null);
__decorate([
    (0, common_1.Post)('verify-qrcode'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "Verify_QrCode", null);
__decorate([
    (0, common_1.Post)('add-friends'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "Insert_Friends", null);
__decorate([
    (0, common_1.Post)('remove-friends'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "Remove_friends", null);
__decorate([
    (0, common_1.Post)('Block-friends'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "Block_friends", null);
__decorate([
    (0, common_1.Get)('get-friendsList'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "Get_FriendsList", null);
__decorate([
    (0, common_1.Get)('friends'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "only_friends", null);
__decorate([
    (0, common_1.Get)('get-user'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "Get_User", null);
__decorate([
    (0, common_1.Post)('TwoFactorAuth'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "TwofactorAuth", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        jwtservice_service_1.JwtService,
        prisma_service_1.PrismaService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map