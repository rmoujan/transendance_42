import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from 'src/jwt/jwtservice.service';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwt;
    private readonly prisma;
    constructor(jwt: JwtService, prisma: PrismaService);
    server: Server;
    private SocketContainer;
    decodeCookie(client: Socket): any;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleUserOnline(client: Socket): void;
    handleUserOffline(client: Socket): void;
    handleMessage(body: any): string;
}
