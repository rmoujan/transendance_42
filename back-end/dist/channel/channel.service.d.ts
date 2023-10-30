import { PrismaService } from '../prisma.service';
import { UsersService } from '../users/users.service';
export declare class ChannelsService {
    private prisma;
    private userService;
    constructor(prisma: PrismaService, userService: UsersService);
    hashPassword(password: string): Promise<string>;
    verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
    getPublicChannels(): Promise<{
        id_channel: number;
        name: string;
        visibility: string;
        password: string;
    }[]>;
    getProtectedChannels(): Promise<{
        id_channel: number;
        name: string;
        visibility: string;
        password: string;
    }[]>;
    createChannel(data: any, userId: number): Promise<boolean>;
    getChannelByName(nameVar: string): Promise<{
        id_channel: number;
        name: string;
        visibility: string;
        password: string;
    }>;
    joinChannel(data: any, usid: number): Promise<boolean>;
    updatePass(data: any, usid: number): Promise<void>;
    removePass(data: any, usid: number): Promise<void>;
    setPass(data: any, usid: number): Promise<void>;
    setAdmin(data: any, usid: number, upus: number): Promise<void>;
    kickUser(data: any, idus: number, kickcus: number): Promise<void>;
    banUser(data: any, idus: number, user_banned: number): Promise<void>;
    muteUser(data: any, idus: number, user_muted: number): Promise<void>;
}
