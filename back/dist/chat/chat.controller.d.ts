import { ChatService } from './chat.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '../auth/jwt/jwtservice.service';
import { ConfigService } from '@nestjs/config';
export declare class ChatController {
    private jwt;
    private readonly chatService;
    private readonly UsersService;
    private config;
    constructor(jwt: JwtService, chatService: ChatService, UsersService: UsersService, config: ConfigService);
    getAllConversations(req: any): Promise<false | {
        id_dm: number;
        senderId: number;
        receiverId: number;
        unread: number;
        pinned: boolean;
    }[] | {
        message: string;
        error: any;
    }>;
    getAllMessages(req: any, data: any): Promise<false | {
        id: number;
        text: string;
        dateSent: Date;
        outgoing: number;
        incoming: number;
        type: string;
        idDm: number;
    }[] | {
        message: string;
        error: any;
    }>;
    getAllMessagesRoom(req: any, data: any): Promise<false | {
        id_disc: number;
        message: string;
        dateSent: Date;
        userId: number;
        channelId: number;
    }[] | {
        message: string;
        error: any;
    }>;
}
