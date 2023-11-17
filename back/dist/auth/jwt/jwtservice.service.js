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
exports.JwtService = void 0;
const common_1 = require("@nestjs/common");
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const jwt = require("jsonwebtoken");
let JwtService = class JwtService extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'asddfsdf5456dsf45ds',
        });
        this.secretKey = 'asddfsdf5456dsf45ds';
    }
    async validate(payload) {
        return {
            id: payload.sub,
            username: payload.username,
            email: payload.email,
            image: payload.profileImage,
            token: payload.token,
        };
    }
    sign(payload) {
        return jwt.sign(payload, this.secretKey, { expiresIn: '6h' });
    }
    verify(token) {
        try {
            return jwt.verify(token, this.secretKey);
        }
        catch (err) {
            return null;
        }
    }
};
exports.JwtService = JwtService;
exports.JwtService = JwtService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], JwtService);
//# sourceMappingURL=jwtservice.service.js.map