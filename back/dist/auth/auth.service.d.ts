import { JwtService } from "../auth/jwt/jwtservice.service";
import { PrismaService } from "src/prisma.service";
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    LoginToFortyTwo(): {
        msg: string;
    };
    ValidateUsers(infos: any, req: any, res: any): Promise<{
        id: any;
        login: any;
        fullname: any;
        image: any;
        email: any;
    }>;
    GenerateQrCode(req: any): Promise<any>;
    Verify_QrCode(body: any, req: any): Promise<{
        msg: string;
    }>;
}
