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
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const jwtservice_service_1 = require("../auth/jwt/jwtservice.service");
const fs = require("fs");
const config_1 = require("@nestjs/config");
let ProfileService = class ProfileService {
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async ModifyName(dat, req, res) {
        const Token = req.cookies[this.config.get('cookie')];
        const verifyToekn = this.jwt.verify(Token);
        try {
            const user = await this.prisma.user.update({
                where: { id_user: verifyToekn.id },
                data: {
                    name: dat.name,
                },
            });
        }
        catch (error) {
            if (error.code == 'P2002')
                return ('P2002');
        }
    }
    async ModifyPhoto(photo, req, res) {
        const verifyToken = this.jwt.verify(req.cookies[this.config.get('cookie')]);
        console.log('orginal name : ', photo.originalname);
        const filePath = '/home/mmanouze/Desktop/last/front/public/uploads/' + photo.originalname;
        const rightPath = '/public/uploads/' + photo.originalname;
        console.log(photo.originalname);
        fs.writeFileSync(filePath, photo.buffer);
        console.log('tswiraaaaaaa');
        try {
            await this.prisma.user.update({
                where: { id_user: verifyToken.id },
                data: {
                    avatar: rightPath,
                },
            });
        }
        catch (error) {
            console.log(error);
        }
    }
    async About_me(req, res) {
        const payload = this.jwt.verify(req.cookies[this.config.get('cookie')]);
        const user = await this.prisma.user.findUnique({
            where: { id_user: payload.id },
        });
        return (user);
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwtservice_service_1.JwtService,
        config_1.ConfigService])
], ProfileService);
//# sourceMappingURL=profile.service.js.map