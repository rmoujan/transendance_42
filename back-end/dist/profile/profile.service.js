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
const jwtservice_service_1 = require("../jwt/jwtservice.service");
const fs = require("fs");
let ProfileService = class ProfileService {
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async ModifyName(dat, req, res) {
        const Token = req.cookies['cookie'];
        const verifyToekn = this.jwt.verify(Token);
        try {
            await this.prisma.user.update({
                where: { name: verifyToekn.name },
                data: {
                    name: dat.name,
                },
            });
            verifyToekn.name = dat.name;
            res.cookie('cookie', this.jwt.sign(verifyToekn));
        }
        catch (error) {
            if (error.code == 'P2002')
                res.status(400).json({ error: 'name already exists' });
        }
    }
    async ModifyPhoto(photo, req, res) {
        const verifyToken = this.jwt.verify(req.cookies['cookie']);
        const filePath = '/Users/mmanouze/Desktop/oauth-42-project/uploads/' + photo.originalname;
        fs.writeFileSync(filePath, photo.buffer);
        try {
            await this.prisma.user.update({
                where: { name: verifyToken.name },
                data: {
                    avatar: filePath,
                },
            });
            verifyToken.avatar = filePath;
            res.cookie('cookie', this.jwt.sign(verifyToken));
        }
        catch (error) {
            console.log(error);
        }
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwtservice_service_1.JwtService])
], ProfileService);
//# sourceMappingURL=profile.service.js.map