import { PrismaService } from '../prisma.service';
import { UsersService } from '../users/users.service';
export declare class ChannelsService {
    private prisma;
    private userService;
    constructor(prisma: PrismaService, userService: UsersService);
    hashPassword(password: string): Promise<string>;
    verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
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
    })[]>;
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
    })[]>;
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
    })[]>;
    createChannel(data: any, userId: number): Promise<boolean>;
    getChannelByName(nameVar: string): Promise<{
        id_channel: number;
        name: string;
        img: string;
        visibility: string;
        password: string;
    }>;
    joinChannel(data: any, usid: number): Promise<boolean>;
    updatePass(data: any, usid: number): Promise<{
        id_channel: number;
        name: string;
        img: string;
        visibility: string;
        password: string;
    }>;
    removePass(data: any, usid: number): Promise<{
        id_channel: number;
        name: string;
        img: string;
        visibility: string;
        password: string;
    }>;
    setPass(data: any, usid: number): Promise<{
        id_channel: number;
        name: string;
        img: string;
        visibility: string;
        password: string;
    }>;
    setAdmin(data: any): Promise<{
        userId: number;
        channelId: number;
        status_UserInChannel: string;
        muted: boolean;
        period: Date;
    }>;
    kickUser(data: any, idus: number, kickcus: number): Promise<{
        userId: number;
        channelId: number;
        status_UserInChannel: string;
        muted: boolean;
        period: Date;
    }>;
    getChannelById(nameVar: number): Promise<{
        id_channel: number;
        name: string;
        img: string;
        visibility: string;
        password: string;
    }>;
    banUser(idch: number, idus: number, user_banned: number): Promise<{
        userId: number;
        channelId: number;
        status_UserInChannel: string;
        muted: boolean;
        period: Date;
    }>;
    muteUser(data: any, idus: number, user_muted: number): Promise<{
        userId: number;
        channelId: number;
        status_UserInChannel: string;
        muted: boolean;
        period: Date;
    }>;
    getAllChannels(idUser: number): Promise<({
        channel: {
            id_channel: number;
            name: string;
            img: string;
            visibility: string;
            password: string;
        };
    } & {
        userId: number;
        channelId: number;
        status_UserInChannel: string;
        muted: boolean;
        period: Date;
    })[]>;
    getAllAdmins(idch: number): Promise<string[]>;
    getAllMembers(idch: number): Promise<string[]>;
    getAllOwners(idch: number): Promise<string[]>;
    getTheLastMessageOfChannel(idch: number): Promise<{
        id_disc: number;
        message: string;
        dateSent: Date;
        userId: number;
        channelId: number;
    }>;
    unmuteUser(data: any, idus: number, user_muted: number): Promise<{
        userId: number;
        channelId: number;
        status_UserInChannel: string;
        muted: boolean;
        period: Date;
    }>;
    removeChannel(data: any, idus: number): Promise<boolean>;
}
