import { OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { JwtService } from 'src/jwt/jwtservice.service';
import { ChatService } from './chat.service';
import { UsersService } from 'src/users/users.service';
export declare class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private jwt;
    private readonly ChatService;
    private readonly UsersService;
    constructor(jwt: JwtService, ChatService: ChatService, UsersService: UsersService);
    private connectedClients;
    private roomsDm;
    server: Server;
    private logger;
    afterInit(server: any): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    createRoom(senderId: string, recieverId: string): string;
    leaveRoom(client: Socket, roomName: string): void;
    joinRoom(client: Socket, roomName: any): void;
    handling_joinRoom_dm(room: string, senderId: number, receiverId: number, message: string): Promise<void>;
    process_dm(client: Socket, data: any): string;
    handling_joinRoom_group(data: any, users: any): void;
    sendInChannel(client: Socket, data: any): Promise<any>;
    allConversationsDm(client: Socket, data: any): Promise<void>;
    getAllMessages(client: Socket, data: any): Promise<void>;
    getAllMessagesRoom(client: Socket, data: any): Promise<void>;
}
