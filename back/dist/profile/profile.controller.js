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
exports.ProfileController = void 0;
const common_1 = require("@nestjs/common");
const profile_service_1 = require("./profile.service");
const platform_express_1 = require("@nestjs/platform-express");
const nameDto_1 = require("./nameDto");
const prisma_service_1 = require("../prisma.service");
const jwtservice_service_1 = require("../auth/jwt/jwtservice.service");
const AboutDto_1 = require("./AboutDto");
const BotDto_1 = require("./BotDto");
const ingameDto_1 = require("./ingameDto");
const infosDto_1 = require("./infosDto");
const config_1 = require("@nestjs/config");
let ProfileController = class ProfileController {
    constructor(Profile, prisma, jwt, config) {
        this.Profile = Profile;
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async Name_Modification(data, req, res) {
        try {
            const value = await this.Profile.ModifyName(data, req, res);
            if (value == "P2002")
                res.status(400).json({ error: "name already exists" });
            else
                res.status(200).json({ msg: "name well setted" });
            return { msg: "i am in the pofile controller now" };
        }
        catch (error) { }
    }
    Photo__Modification(photo, req, res) {
        this.Profile.ModifyPhoto(photo, req, res);
    }
    async About_me(data, req, res) {
        try {
            const payload = this.jwt.verify(req.cookies[this.config.get('cookie')]);
            const ab = data.About;
            await this.prisma.user.update({
                where: { id_user: payload.id },
                data: {
                    About: ab,
                },
            });
        }
        catch (error) { }
    }
    async Get_About(req) {
        try {
            const user = await this.Profile.About_me(req);
            return user.About;
        }
        catch (error) { }
    }
    async VsBoot(req, body) {
        try {
            const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
            const user = await this.prisma.user.findUnique({
                where: { id_user: decoded.id },
            });
            let winspercent;
            let lossespercent;
            let progress;
            let gameP = user.games_played + 1;
            let gameW = user.WonBot;
            let gameL = user.LoseBot;
            let avatar = user.avatar;
            let name = user.name;
            if (body.won) {
                gameW++;
                progress = ((gameW - gameL) / gameP) * 100;
                progress = progress < 0 ? 0 : progress;
                winspercent = (gameW / gameP) * 100;
                lossespercent = (gameL / gameP) * 100;
                await this.prisma.user.update({
                    where: { id_user: decoded.id },
                    data: {
                        WonBot: gameW,
                        wins: gameW,
                        games_played: gameP,
                        Progress: progress,
                        Wins_percent: winspercent,
                        Losses_percent: lossespercent,
                        history: {
                            create: {
                                winner: true,
                                username: name,
                                userscore: body.userScore,
                                useravatar: avatar,
                                enemyId: 9,
                                enemyscore: body.botScore,
                            },
                        },
                    },
                });
            }
            else {
                gameL++;
                progress = ((gameW - gameL) / gameP) * 100;
                progress = progress < 0 ? 0 : progress;
                winspercent = (gameW / gameP) * 100;
                lossespercent = (gameL / gameP) * 100;
                await this.prisma.user.update({
                    where: { id_user: decoded.id },
                    data: {
                        LoseBot: gameL,
                        losses: gameL,
                        games_played: gameP,
                        Progress: progress,
                        Wins_percent: winspercent,
                        Losses_percent: lossespercent,
                        history: {
                            create: {
                                winner: false,
                                username: name,
                                userscore: body.userScore,
                                useravatar: avatar,
                                enemyId: 9,
                                enemyscore: body.botScore,
                            },
                        },
                    },
                });
            }
            if (gameW == 1) {
                await this.prisma.user.update({
                    where: { id_user: decoded.id },
                    data: {
                        achievments: {
                            create: {
                                achieve: "won Bot",
                                msg: "Wliti Bot",
                            },
                        },
                    },
                });
            }
        }
        catch (error) { }
    }
    async NotFriendsUsers(req) {
        try {
            const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
            if (decoded == null)
                return;
            const users = this.prisma.user.findMany({
                where: {
                    NOT: {
                        freind: {
                            some: {
                                id_freind: decoded.id,
                            },
                        },
                    },
                },
            });
            const FinalUsers = (await users).filter((scope) => {
                if (scope.id_user != decoded.id) {
                    return scope;
                }
            });
            return FinalUsers;
        }
        catch (error) { }
    }
    async GetNotifications(req) {
        try {
            const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
            if (decoded == null)
                return;
            const user = await this.prisma.user.findUnique({
                where: { id_user: decoded.id },
                include: {
                    notification: true,
                },
            });
            if (user.notification == null)
                return [];
            return user.notification;
        }
        catch (error) { }
    }
    async TopThree(req) {
        try {
            const topUsers = await this.prisma.user.findMany({
                orderBy: [
                    {
                        Wins_percent: "desc",
                    },
                ],
                take: 3,
            });
            return topUsers;
        }
        catch (error) { }
    }
    async Achievments(req) {
        try {
            const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
            if (decoded == null)
                return;
            const userAchievements = await this.prisma.achievments.findMany({
                where: {
                    userId: decoded.id,
                },
            });
            return userAchievements;
        }
        catch (error) { }
    }
    async History(req) {
        try {
            const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
            if (decoded == null)
                return;
            const user = await this.prisma.history.findMany({
                where: { userId: decoded.id },
            });
            return user;
        }
        catch (error) { }
    }
    async GetAvatar(req) {
        try {
            const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
            if (decoded == null)
                return;
            const user = await this.prisma.user.findUnique({
                where: { id_user: decoded.id },
            });
            return user.avatar;
        }
        catch (error) { }
    }
    async Gamestatus(req, body) {
        try {
            const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
            if (decoded == null)
                return;
            await this.prisma.user.update({
                where: { id_user: decoded.id },
                data: {
                    InGame: body.status,
                },
            });
        }
        catch (error) { }
    }
    async gameinfos(req, body) {
        try {
            const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
            if (decoded == null)
                return;
            await this.prisma.user.update({
                where: { id_user: decoded.id },
                data: {
                    homies: body.homies,
                    invited: body.invited,
                    homie_id: body.homie_id,
                },
            });
            if (body.homies == true && body.invited == true) {
                await this.prisma.notification.deleteMany({
                    where: {
                        AND: [{ userId: decoded.id }, { GameInvitation: true }],
                    },
                });
            }
        }
        catch (error) { }
    }
    async Returngameinfos(req) {
        try {
            const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
            if (decoded == null)
                return;
            const user = await this.prisma.user.findUnique({
                where: { id_user: decoded.id },
            });
            const obj = {
                homies: user.homies,
                invited: user.invited,
                homie_id: user.homie_id,
            };
            return obj;
        }
        catch (error) { }
    }
    async Logout(req, res) {
        try {
            const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
            if (decoded == null)
                return;
            await this.prisma.user.update({
                where: { id_user: decoded.id },
                data: {
                    status_user: "offline",
                },
            });
        }
        catch (error) { }
    }
    deletecookie(res) {
        res.clearCookie("cookie");
        res.status(200).json({ msg: "cookie deleted" });
    }
    async verify_Otp(body, req) {
        try {
            const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
            await this.prisma.user.update({
                where: { id_user: decoded.id },
                data: {
                    ISVERIDIED: body.verify,
                }
            });
        }
        catch (error) { }
    }
    async Get_Otp(req) {
        try {
            const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
            const user = await this.prisma.user.findUnique({
                where: { id_user: decoded.id },
            });
            return ({ verified: user.ISVERIDIED, TFA: user.TwoFactor });
        }
        catch (error) { }
    }
    async GameFlag(req, body) {
        try {
            const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
            await this.prisma.user.update({
                where: { id_user: decoded.id },
                data: {
                    GameFlag: body.flag,
                },
            });
        }
        catch (error) { }
    }
    async GetFalg(req) {
        try {
            const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
            const user = await this.prisma.user.findUnique({ where: { id_user: decoded.id } });
            return ({ flag: user.GameFlag });
        }
        catch (error) { }
    }
    async ingame(req) {
        try {
            const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
            const user = await this.prisma.user.findUnique({ where: { id_user: decoded.id } });
            return ({ ingame: user.InGame });
        }
        catch (error) { }
    }
};
exports.ProfileController = ProfileController;
__decorate([
    (0, common_1.Post)("modify-name"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [nameDto_1.CreateUserDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "Name_Modification", null);
__decorate([
    (0, common_1.Post)("modify-photo"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("photo")),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], ProfileController.prototype, "Photo__Modification", null);
__decorate([
    (0, common_1.Post)("About"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AboutDto_1.ProfileDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "About_me", null);
__decorate([
    (0, common_1.Get)("About"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "Get_About", null);
__decorate([
    (0, common_1.Post)("Bot-Pong"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, BotDto_1.MixedDto]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "VsBoot", null);
__decorate([
    (0, common_1.Get)("NotFriends"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "NotFriendsUsers", null);
__decorate([
    (0, common_1.Get)("Notifications"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "GetNotifications", null);
__decorate([
    (0, common_1.Get)("TopThree"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "TopThree", null);
__decorate([
    (0, common_1.Get)("Achievments"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "Achievments", null);
__decorate([
    (0, common_1.Get)("History"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "History", null);
__decorate([
    (0, common_1.Get)("avatar"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "GetAvatar", null);
__decorate([
    (0, common_1.Post)("Gamestatus"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ingameDto_1.BooleanDto]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "Gamestatus", null);
__decorate([
    (0, common_1.Post)("gameinfos"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, infosDto_1.Infos]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "gameinfos", null);
__decorate([
    (0, common_1.Get)("returngameinfos"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "Returngameinfos", null);
__decorate([
    (0, common_1.Get)("Logout"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "Logout", null);
__decorate([
    (0, common_1.Get)("deletecookie"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProfileController.prototype, "deletecookie", null);
__decorate([
    (0, common_1.Post)("verifyOtp"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "verify_Otp", null);
__decorate([
    (0, common_1.Get)("verifyOtp"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "Get_Otp", null);
__decorate([
    (0, common_1.Post)('GameFlag'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "GameFlag", null);
__decorate([
    (0, common_1.Get)('GameFlag'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "GetFalg", null);
__decorate([
    (0, common_1.Get)('ingame'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "ingame", null);
exports.ProfileController = ProfileController = __decorate([
    (0, common_1.Controller)("profile"),
    __metadata("design:paramtypes", [profile_service_1.ProfileService,
        prisma_service_1.PrismaService,
        jwtservice_service_1.JwtService,
        config_1.ConfigService])
], ProfileController);
//# sourceMappingURL=profile.controller.js.map