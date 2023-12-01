import { PrismaService } from '../prisma.service';
import { Dm } from '@prisma/client';
export declare class ChatService {
    private prisma;
    constructor(prisma: PrismaService);
    findChannel(idch: number): Promise<{
        id_channel: number;
        name: string;
        img: string;
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
    checkDm(idSend: number, idRecv: number): Promise<{
        id_dm: number;
        senderId: number;
        receiverId: number;
        unread: number;
        pinned: boolean;
    }>;
    createMsg(idSend: number, idRecv: number, dmVar: Dm, msg: string, typeMsg: string): Promise<{
        id: number;
        text: string;
        dateSent: Date;
        outgoing: number;
        incoming: number;
        type: string;
        idDm: number;
    }>;
    getAllConversations(id: number): Promise<{
        id_dm: number;
        senderId: number;
        receiverId: number;
        unread: number;
        pinned: boolean;
    }[]>;
    getDm(idSend: number, idRecv: number): Promise<{
        id_dm: number;
        senderId: number;
        receiverId: number;
        unread: number;
        pinned: boolean;
    }>;
    getAllMessages(id: number): Promise<{
        id: number;
        text: string;
        dateSent: Date;
        outgoing: number;
        incoming: number;
        type: string;
        idDm: number;
    }[]>;
    createDiscussion(idSend: number, msg: string, idCh: number): Promise<{
        id_disc: number;
        message: string;
        dateSent: Date;
        userId: number;
        channelId: number;
    }>;
    getAllMessagesRoom(id: number): Promise<{
        id_disc: number;
        message: string;
        dateSent: Date;
        userId: number;
        channelId: number;
    }[]>;
    getTheLastMessage(id: number): Promise<{
        id: number;
        text: string;
        dateSent: Date;
        outgoing: number;
        incoming: number;
        type: string;
        idDm: number;
    }>;
    getLeavingRoom(idUs: number, idch: number): Promise<{
        userId: number;
        channelId: number;
        status_UserInChannel: string;
        muted: boolean;
        period: Date;
    }>;
    cheakBlockedUser(idSend: number, idRecv: number): Promise<boolean>;
    checkmuted(idSend: number, idch: number): Promise<{
        userId: number;
        channelId: number;
        status_UserInChannel: string;
        muted: boolean;
        period: Date;
    }>;
}
