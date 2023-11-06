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
    async Name_Modification(data, req, res) {
        const result = await this.Profile.ModifyName(data, req, res);
        if (result == 400)
            res.status(400).json({ msg: "name already exists" });
        res.status(200).json({ msg: "name well setted" });
        return ({ msg: 'i am in the pofile controller now' });
    }
    Photo__Modification(data, photo, req, res) {
        this.Profile.ModifyPhoto(photo, req, res);
        console.log(photo);
    }
    async About_me(data, req, res) {
        console.log('about well setted');
        console.log(data);
        const payload = this.jwt.verify(req.cookies['cookie']);
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
        return (user.About);
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
    __metadata("design:returntype", Promise)
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
    (0, common_1.Post)('About'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "About_me", null);
__decorate([
    (0, common_1.Get)('About'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "Get_About", null);
exports.ProfileController = ProfileController = __decorate([
    (0, common_1.Controller)('profile'),
    __metadata("design:paramtypes", [profile_service_1.ProfileService, prisma_service_1.PrismaService, jwtservice_service_1.JwtService])
], ProfileController);
//# sourceMappingURL=profile.controller.js.map