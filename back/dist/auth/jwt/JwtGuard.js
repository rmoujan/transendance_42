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
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwtservice_service_1 = require("./jwtservice.service");
const prisma_service_1 = require("../../prisma/prisma.service");
let JwtAuthGuard = class JwtAuthGuard {
    constructor(prisma, JwtService) {
        this.prisma = prisma;
        this.JwtService = JwtService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const token = request.cookies.cookie;
        if (!token) {
            response.send("false").status(401);
            return false;
        }
        try {
            const decoded = this.JwtService.verify(token);
            if (!decoded) {
                response.send("false").status(401);
                return false;
            }
            return true;
        }
        catch (error) {
            console.log('falsyyyyyy');
            return false;
        }
    }
    isTokenNotExpired(expirationTimestamp) {
        console.log(expirationTimestamp);
        const currentTimestamp = Math.floor(Date.now() / 1000);
        return expirationTimestamp > currentTimestamp;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwtservice_service_1.JwtService])
], JwtAuthGuard);
//# sourceMappingURL=JwtGuard.js.map