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
let ProfileController = class ProfileController {
    constructor(Profile, prisma, jwt) {
        this.Profile = Profile;
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async Name_Modification(data, req, res) {
        const value = await this.Profile.ModifyName(data, req, res);
        if (value == "P2002")
            res.status(400).json({ error: "name already exists" });
        else
            res.status(200).json({ msg: "name well setted" });
        return { msg: "i am in the pofile controller now" };
    }
    Photo__Modification(photo, req, res) {
        this.Profile.ModifyPhoto(photo, req, res);
    }
    async About_me(data, req, res) {
        const payload = this.jwt.verify(req.cookies["cookie"]);
        const ab = data.About;
        await this.prisma.user.update({
            where: { id_user: payload.id },
            data: {
                About: ab,
            },
        });
    }
    async Get_About(req, res) {
        const user = await this.Profile.About_me(req, res);
        console.log(user.About);
        return user.About;
    }
    async VsBoot(req, body) {
        console.log(body);
        const decoded = this.jwt.verify(req.cookies["cookie"]);
        const user = await this.prisma.user.findUnique({
            where: { id_user: decoded.id },
        });
        let gameP = user.games_played + 1;
        let gameW = user.WonBot;
        let gameL = user.LoseBot;
        let avatar = user.avatar;
        let name = user.name;
        console.log("game_played: " + user.games_played);
        if (body.won) {
            gameW++;
            await this.prisma.user.update({
                where: { id_user: decoded.id },
                data: {
                    WonBot: gameW,
                    games_played: gameP,
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
            await this.prisma.user.update({
                where: { id_user: decoded.id },
                data: {
                    LoseBot: gameL,
                    games_played: gameP,
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
    async NotFriendsUsers(req) {
        const decoded = this.jwt.verify(req.cookies["cookie"]);
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
    async GetNotifications(req) {
        const decoded = this.jwt.verify(req.cookies["cookie"]);
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
    async TopThree(req) {
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
    async Achievments(req) {
        const decoded = this.jwt.verify(req.cookies["cookie"]);
        if (decoded == null)
            return;
        const userAchievements = await this.prisma.achievments.findMany({
            where: {
                userId: decoded.id,
            },
        });
        return userAchievements;
    }
    async History(req) {
        const decoded = this.jwt.verify(req.cookies["cookie"]);
        if (decoded == null)
            return;
        const user = await this.prisma.history.findMany({
            where: { userId: decoded.id },
        });
        return user;
    }
    async GetAvatar(req) {
        const decoded = this.jwt.verify(req.cookies["cookie"]);
        if (decoded == null)
            return;
        const user = await this.prisma.user.findUnique({
            where: { id_user: decoded.id },
        });
        return user.avatar;
    }
    async Gamestatus(req, body) {
        const decoded = this.jwt.verify(req.cookies["cookie"]);
        if (decoded == null)
            return;
        await this.prisma.user.update({
            where: { id_user: decoded.id },
            data: {
                InGame: body.status,
            },
        });
    }
    async gameinfos(req, body) {
        const decoded = this.jwt.verify(req.cookies["cookie"]);
        if (decoded == null)
            return;
        console.log("gameinfoos ", body);
        await this.prisma.user.update({
            where: { id_user: decoded.id },
            data: {
                homies: body.homies,
                invited: body.invited,
                homie_id: body.homie_id,
            },
        });
        if (body.homies == true && body.invited == true) {
            console.log("hna 33333");
            await this.prisma.notification.deleteMany({
                where: {
                    AND: [{ userId: decoded.id }, { GameInvitation: true }],
                },
            });
        }
    }
    async Returngameinfos(req) {
        const decoded = this.jwt.verify(req.cookies["cookie"]);
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
    async Logout(req, res) {
        const decoded = this.jwt.verify(req.cookies["cookie"]);
        if (decoded == null)
            return;
        await this.prisma.user.update({
            where: { id_user: decoded.id },
            data: {
                status_user: "offline",
            },
        });
    }
    deletecookie(res) {
        res.clearCookie("cookie");
        res.status(200).json({ msg: "cookie deleted" });
        console.log("cookie deleted");
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
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
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
exports.ProfileController = ProfileController = __decorate([
    (0, common_1.Controller)("profile"),
    __metadata("design:paramtypes", [profile_service_1.ProfileService,
        prisma_service_1.PrismaService,
        jwtservice_service_1.JwtService])
], ProfileController);
//# sourceMappingURL=profile.controller.js.map