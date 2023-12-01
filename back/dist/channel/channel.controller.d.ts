import { ChannelsService } from './channel.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '../auth/jwt/jwtservice.service';
import { ConfigService } from '@nestjs/config';
export declare class ChannelsController {
    private jwt;
    private readonly channelsService;
    private readonly UsersService;
    private config;
    constructor(jwt: JwtService, channelsService: ChannelsService, UsersService: UsersService, config: ConfigService);
    create(req: any, data: any): Promise<boolean | {
        message: string;
        error: any;
    }>;
    join(req: any, data: any): Promise<boolean>;
    updatePass(req: any, data: any): Promise<boolean | {
        message: string;
        error: any;
    }>;
    removePass(req: any, data: any): Promise<boolean | {
        message: string;
        error: any;
    }>;
    setPass(req: any, data: any): Promise<boolean | {
        message: string;
        error: any;
    }>;
    setAdmin(req: any, data: any): Promise<boolean | {
        message: string;
        error: any;
    }>;
    removeChannel(req: any, data: any): Promise<boolean | {
        message: string;
        error: any;
    }>;
    getPublicChannels(): Promise<({
        users: ({
            user: {
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
            };
        } & {
            userId: number;
            channelId: number;
            status_UserInChannel: string;
            muted: boolean;
            period: Date;
        })[];
    } & {
        id_channel: number;
        name: string;
        img: string;
        visibility: string;
        password: string;
    })[] | {
        message: string;
        error: any;
    }>;
    getProtectedChannels(): Promise<({
        users: ({
            user: {
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
            };
        } & {
            userId: number;
            channelId: number;
            status_UserInChannel: string;
            muted: boolean;
            period: Date;
        })[];
    } & {
        id_channel: number;
        name: string;
        img: string;
        visibility: string;
        password: string;
    })[] | {
        message: string;
        error: any;
    }>;
    getPrivateChannels(): Promise<({
        users: ({
            user: {
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
            };
        } & {
            userId: number;
            channelId: number;
            status_UserInChannel: string;
            muted: boolean;
            period: Date;
        })[];
    } & {
        id_channel: number;
        name: string;
        img: string;
        visibility: string;
        password: string;
    })[] | {
        message: string;
        error: any;
    }>;
    getAllChannels(req: any, data: any): Promise<any[] | {
        message: string;
        error: any;
    }>;
}
