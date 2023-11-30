export interface Player {
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    score: number;
}

export interface Line {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    color: string;
}

export interface Ball {
    x: number;
    y: number;
    r: number;
    speed: number;
    velocityX: number;
    velocityY: number;
    color: string;
}

export interface RoomPlayer {
    socketId: string;
    playerNumber: number;
    x: number;
    y: number;
	h: number;
	w: number;
    score: number;
}

export interface RoomBall {
    x: number;
    y: number;
	r: number;
	speed: number;
	velocityX: number;
	velocityY: number;
}

export interface Room {
	gameAbondoned: boolean;
	stopRendering: boolean;
	winner: number;
    id: string;
    roomPlayers: RoomPlayer[];
    roomBall: RoomBall;
}

export interface Data {
	playerNumber: number;
	roomID: string;
	direction: string;
	event: number;
	position: DOMRect;
}
