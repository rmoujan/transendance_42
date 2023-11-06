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
const prisma_service_1 = require("../prisma/prisma.service");
const jwtservice_service_1 = require("../jwt/jwtservice.service");
let ProfileController = class ProfileController {
    constructor(Profile, prisma, jwt) {
        this.Profile = Profile;
        this.prisma = prisma;
        this.jwt = jwt;
    }
    Name_Modification(data, req, res) {
        this.Profile.ModifyName(data, req, res);
        res.status(200).json({ msg: "name well setted" });
        return ({ msg: 'i am in the pofile controller now' });
    }
    Photo__Modification(data, photo, req, res) {
        this.Profile.ModifyPhoto(photo, req, res);
        console.log(photo);
    }
    async VsBoot(req, body) {
        console.log(body);
        const decoded = this.jwt.verify(req.cookies['cookie']);
        const user = await this.prisma.user.findUnique({ where: { id_user: decoded.id } });
        if (body.won) {
            await this.prisma.user.update({
                where: { id_user: decoded.id },
                data: {
                    wins: user.wins++,
                    games_played: user.games_played++,
                    history: {
                        create: {
                            winner: true,
                            userscore: body.userScore,
                            enemyId: 9,
                            enemyscore: body.botScore,
                        },
                    },
                },
            });
        }
        else {
            await this.prisma.user.update({
                where: { id_user: decoded.id },
                data: {
                    losses: user.losses++,
                    games_played: user.games_played++,
                    history: {
                        create: {
                            winner: false,
                            userscore: body.userScore,
                            enemyId: 9,
                            enemyscore: body.botScore,
                        },
                    },
                },
            });
        }
    }
};
exports.ProfileController = ProfileController;
__decorate([
    (0, common_1.Post)('modify-name'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [nameDto_1.CreateUserDto, Object, Object]),
    __metadata("design:returntype", void 0)
], ProfileController.prototype, "Name_Modification", null);
__decorate([
    (0, common_1.Post)('modify-photo'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], ProfileController.prototype, "Photo__Modification", null);
__decorate([
    (0, common_1.Post)('Bot-Pong'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "VsBoot", null);
exports.ProfileController = ProfileController = __decorate([
    (0, common_1.Controller)('profile'),
    __metadata("design:paramtypes", [profile_service_1.ProfileService, prisma_service_1.PrismaService, jwtservice_service_1.JwtService])
], ProfileController);
//# sourceMappingURL=profile.controller.js.map