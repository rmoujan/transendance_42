import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Data, Room, RoomBall, RoomPlayer } from "./interfaces";
export declare class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private rooms;
    private framePerSec;
    private isPaused;
    private logger;
    afterInit(server: Server): void;
    handleConnection(client: Socket, ...args: any[]): void;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(client: Socket): void;
    handleUpdatePlayer(client: Socket, data: Data): void;
    handleLeave(client: Socket, roomID: string): void;
    findRoomBySocketId(socketId: string): Room;
    pauseGame(duration: number): void;
    resetBall(room: Room): void;
    updateScore(room: Room): void;
    collision(ball: RoomBall, player: RoomPlayer): boolean;
    startRoomGame(room: Room): void;
}
