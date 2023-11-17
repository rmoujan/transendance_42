import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtService } from "../auth/jwt/jwtservice.service";
import { PrismaService } from "src/prisma.service";
export declare class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private jwt;
    private readonly prisma;
    constructor(jwt: JwtService, prisma: PrismaService);
    server: Server;
    private SocketContainer;
    decodeCookie(client: any): any;
    afterInit(server: Server): void;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleUserOnline(client: Socket): Promise<void>;
    handleUserOffline(client: Socket): Promise<void>;
    handleMessage(body: any): string;
    invite_game(client: Socket, body: any): Promise<void>;
    add_friend(client: Socket, body: any): Promise<void>;
    NewFriend(client: Socket, body: any): Promise<void>;
    friends_list(client: Socket, body: any): Promise<void>;
}
