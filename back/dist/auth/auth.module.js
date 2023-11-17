"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const FortyTwoStrategy_1 = require("./utils/FortyTwoStrategy");
const prisma_service_1 = require("../prisma.service");
const jwtservice_service_1 = require("../auth/jwt/jwtservice.service");
const Serializer_1 = require("./utils/Serializer");
const jwt_1 = require("@nestjs/jwt");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [jwt_1.JwtModule],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, FortyTwoStrategy_1.FortyTwoStrategy,
            prisma_service_1.PrismaService, jwtservice_service_1.JwtService,
            Serializer_1.SessionSerializer],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map