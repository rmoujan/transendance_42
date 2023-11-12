import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '../auth/jwt/jwtservice.service';
export declare class ProfileService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    ModifyName(dat: any, req: any, res: any): Promise<any>;
    ModifyPhoto(photo: any, req: any, res: any): Promise<void>;
    About_me(req: any, res: any): Promise<{
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
    }>;
}
