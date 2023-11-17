import { AuthService } from "../auth.service";
import { JwtService } from "../jwt/jwtservice.service";
import { PrismaService } from "src/prisma/prisma.service";
declare const FortyTwoStrategy_base: new (...args: any[]) => any;
export declare class FortyTwoStrategy extends FortyTwoStrategy_base {
    private authservice;
    private jwt;
    private prisma;
    constructor(authservice: AuthService, jwt: JwtService, prisma: PrismaService);
    validate(accessToken: string, refreshToken: string, profile: any, req: any, res: any): Promise<{
        id: any;
        login: any;
        fullname: any;
        image: any;
        email: any;
    }>;
}
export {};
