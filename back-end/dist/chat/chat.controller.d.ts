import { ChatService } from './chat.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '../jwt/jwtservice.service';
export declare class ChatController {
    private jwt;
    private readonly channelsService;
    private readonly UsersService;
    constructor(jwt: JwtService, channelsService: ChatService, UsersService: UsersService);
    getAllConversations(req: any): Promise<{
        id_dm: number;
        senderId: number;
        receiverId: number;
        unread: number;
        pinned: boolean;
    }[]>;
    getAllMessages(req: any, data: any): Promise<{
        id: number;
        text: string;
        dateSent: Date;
        outgoing: boolean;
        incoming: boolean;
        type: string;
        idDm: number;
    }[]>;
    getAllMessagesRoom(req: any, data: any): Promise<{
        id_disc: number;
        message: string;
        dateSent: Date;
        userId: number;
        channelId: number;
    }[]>;
}
