import { OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { JwtService } from 'src/jwt/jwtservice.service';
import { ChatService } from './chat.service';
export declare class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private jwt;
    private readonly ChatService;
    constructor(jwt: JwtService, ChatService: ChatService);
    private connectedClients;
    private roomsDm;
    private clientsChannel;
    server: Server;
    private logger;
    afterInit(server: any): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    createRoom(senderId: string, recieverId: string): string;
    leaveRoom(client: Socket, roomName: string): void;
    joinRoom(client: Socket, roomName: any): void;
    handling_joinRoom_dm(room: string, senderId: string, receiverId: string, message: string): void;
    process_dm(client: Socket, payload: any): string;
    handling_joinRoom_group(idch: number, message: string, users: any): void;
    sendInChannel(client: any, payload: any): Promise<any>;
}
