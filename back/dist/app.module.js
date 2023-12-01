"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const auth_service_1 = require("./auth/auth.service");
const auth_controller_1 = require("./auth/auth.controller");
const jwtservice_service_1 = require("./auth/jwt/jwtservice.service");
const profile_controller_1 = require("./profile/profile.controller");
const profile_service_1 = require("./profile/profile.service");
const profile_module_1 = require("./profile/profile.module");
const jwt_1 = require("@nestjs/jwt");
const socket_gateway_1 = require("./socket/socket.gateway");
const socket_module_1 = require("./socket/socket.module");
const app_gateway_1 = require("./app.gateway");
const channel_module_1 = require("./channel/channel.module");
const users_module_1 = require("./users/users.module");
const chat_module_1 = require("./chat/chat.module");
const channel_controller_1 = require("./channel/channel.controller");
const users_controller_1 = require("./users/users.controller");
const channel_service_1 = require("./channel/channel.service");
const users_service_1 = require("./users/users.service");
const prisma_service_1 = require("./prisma.service");
const cloudinary_module_1 = require("./cloudinary/cloudinary.module");
const config_1 = require("@nestjs/config");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forRoot({ isGlobal: true, }), auth_module_1.AuthModule,
            profile_module_1.ProfileModule, jwt_1.JwtModule, socket_module_1.SocketModule, channel_module_1.ChannelModule, users_module_1.UsersModule, chat_module_1.ChatModule, channel_module_1.ChannelModule, cloudinary_module_1.CloudinaryModule],
        controllers: [app_controller_1.AppController, auth_controller_1.AuthController,
            profile_controller_1.ProfileController, channel_controller_1.ChannelsController, users_controller_1.UsersController],
        providers: [app_service_1.AppService, auth_service_1.AuthService,
            jwtservice_service_1.JwtService, profile_service_1.ProfileService, socket_gateway_1.SocketGateway, app_gateway_1.AppGateway, prisma_service_1.PrismaService, channel_service_1.ChannelsService, users_service_1.UsersService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map