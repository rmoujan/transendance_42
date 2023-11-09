import { AuthService } from './auth.service';
import { JwtService } from 'src/jwt/jwtservice.service';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class AuthController {
    private service;
    private jwt;
    private readonly prisma;
    constructor(service: AuthService, jwt: JwtService, prisma: PrismaService);
    Login(): void;
    redirect(req: any, res: any): Promise<any>;
    getSessionToken(req: any): string;
    GenerateQrCode(req: any): Promise<any>;
    Verify_QrCode(body: any, req: any): Promise<string>;
    Insert_Friends(body: any, req: any): Promise<void>;
    Remove_friends(Body: any, req: any): Promise<void>;
    Block_friends(Body: any, req: any): Promise<void>;
    Get_FriendsList(req: any): Promise<{
        FriendList: {};
    }>;
    only_friends(req: any): Promise<any[]>;
    Get_User(req: any): Promise<any>;
    Get_All_Users(req: any): Promise<void>;
    TwofactorAuth(body: any, req: any): Promise<void>;
}
