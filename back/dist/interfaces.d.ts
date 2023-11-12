import { Socket } from "socket.io";
interface Player {
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    score: number;
}
interface Line {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    color: string;
}
interface Ball {
    x: number;
    y: number;
    r: number;
    speed: number;
    velocityX: number;
    velocityY: number;
    color: string;
}
interface RoomPlayer {
    won: boolean;
    socket: Socket;
    socketId: string;
    playerNumber: number;
    x: number;
    y: number;
    h: number;
    w: number;
    score: number;
}
interface RoomBall {
    x: number;
    y: number;
    r: number;
    speed: number;
    velocityX: number;
    velocityY: number;
}
interface Room {
    gameAbondoned: boolean;
    stopRendering: boolean;
    winner: number;
    id: string;
    roomPlayers: RoomPlayer[];
    roomBall: RoomBall;
}
interface Data {
    playerNumber: number;
    roomID: string;
    direction: string;
    event: number;
    position: DOMRect;
}
export { Player, Line, Ball, Room, RoomPlayer, RoomBall, Data };
