import { AuthService } from './auth.service';
import { JwtService } from '../auth/jwt/jwtservice.service';
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
    Get_All_Users(req: any): Promise<{
        id_user: number;
        name: string;
        avatar: string;
        TwoFactor: boolean;
        IsFirstTime: boolean;
        InGame: boolean;
        secretKey: string;
        About: string;
        status_user: string;
        WonBot: number;
        LoseBot: number;
        wins: number;
        losses: number;
        games_played: number;
        Progress: number;
        Wins_percent: number;
        Losses_percent: number;
        homies: boolean;
        invited: boolean;
        homie_id: number;
    }[]>;
    TwofactorAuth(body: any, req: any): Promise<void>;
}
