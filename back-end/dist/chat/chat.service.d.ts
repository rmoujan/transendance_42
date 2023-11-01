import { PrismaService } from '../prisma.service';
export declare class ChatService {
    private prisma;
    constructor(prisma: PrismaService);
    findChannel(idch: number): Promise<{
        id_channel: number;
        name: string;
        visibility: string;
        password: string;
    }>;
    getUsersInChannel(idch: number): Promise<{
        userId: number;
        channelId: number;
        status_UserInChannel: string;
        muted: boolean;
        period: Date;
    }[]>;
}
