import { PrismaService } from 'src/prisma.service';
import { JwtService } from '../auth/jwt/jwtservice.service';
import { ConfigService } from '@nestjs/config';
export declare class ProfileService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    ModifyName(dat: any, req: any, res: any): Promise<any>;
    ModifyPhoto(photo: any, req: any, res: any): Promise<void>;
    About_me(req: any, res: any): Promise<{
        id_user: number;
        name: string;
        avatar: string;
        GameFlag: number;
        TwoFactor: boolean;
        ISVERIDIED: boolean;
        IsFirstTime: boolean;
        InGame: boolean;
        secretKey: string;
        About: string;
        status_user: string;
        email: string;
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
