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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwtservice_service_1 = require("../jwt/jwtservice.service");
const prisma_service_1 = require("../prisma.service");
const otplib_1 = require("otplib");
const qrcode = require("qrcode");
let AuthService = class AuthService {
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    LoginToFortyTwo() {
        return ({ msg: 'we will finish this at the right time' });
    }
    async ValidateUsers(infos, req, res) {
        try {
            const { id, email, login, first_name, last_name, displayname, image } = infos;
            const obj = { id: id, login: login, fullname: displayname, image: image.link, email: email };
            const id_user = id;
            const find = await this.prisma.user.findUnique({
                where: { id_user },
            });
            if (find) {
                const obj = { id: id, login: login, fullname: displayname, image: image.link, email: email };
                return obj;
            }
            await this.prisma.user.create({
                data: {
                    id_user: id,
                    name: login,
                    avatar: image.link,
                    TwoFactor: false,
                    status_user: "online",
                    IsFirstTime: true,
                },
            });
            return obj;
        }
        catch (error) {
            console.log(error);
        }
    }
    async GenerateQrCode(req) {
        const sKey = otplib_1.authenticator.generateSecret();
        const decoded = this.jwt.verify(req.cookies['cookie']);
        const user = await this.prisma.user.update({
            where: { id_user: decoded.id },
            data: { secretKey: sKey },
        });
        console.log(user);
        const otpAuthURL = otplib_1.authenticator.keyuri(decoded.email, 'YourAppName', sKey);
        const qrCodeOptions = {
            errorCorrectionLevel: 'L',
            width: 250,
            height: 250,
            margin: 1,
            color: {
                dark: "#3D3C65",
                light: "#B7B7C9"
            }
        };
        const qrCodeDataURL = qrcode.toDataURL(otpAuthURL, qrCodeOptions);
        return qrCodeDataURL;
    }
    async Verify_QrCode(body, req) {
        const decoded = this.jwt.verify(req.cookies['cookie']);
        const user = await this.prisma.user.findUnique({ where: { id_user: decoded.id } });
        if (otplib_1.authenticator.verify({ token: body.inputValue, secret: user.secretKey }))
            return ({ msg: 'true' });
        else
            return ({ msg: 'false' });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwtservice_service_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map