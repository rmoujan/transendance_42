import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
	WebSocketServer,
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { Data, Room, RoomBall, RoomPlayer } from "./interfaces";

@WebSocketGateway()
export class AppGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{

	@WebSocketServer() server: Server;
	private rooms: Room[] = [];
	private framePerSec: number = 50;
	private isPaused: boolean = false;

    private logger: Logger = new Logger("AppGateway");

    afterInit(server: Server) {
        this.logger.log("Websocket Gateway initialized");
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
		const room: Room | null = this.findRoomBySocketId(client.id);
		if (room) {
			room.gameAbondoned = true;
			this.logger.log(`User disconnected : ${client.id}`);
			room.stopRendering = true;
			if (room.roomPlayers[0].socketId == client.id) {
				room.winner = 2;
			} else {
				room.winner = 1;
			}
			this.server.to(room.id).emit("endGame", room);
			this.rooms = this.rooms.filter((r) => r.id !== room.id);
		} else {
			this.logger.log(`User disconnected but was not in a room: ${client.id}`);
		}
    }

    @SubscribeMessage("join-room")
    handleJoinRoom(client: Socket) {
        let room: Room = null;

        if (
            this.rooms.length > 0 &&
            this.rooms[this.rooms.length - 1].roomPlayers.length === 1
        ) {
            room = this.rooms[this.rooms.length - 1];
        }

        if (room) {
			client.join(room.id);
			client.emit("player-number", 2);

            room.roomPlayers.push({
                socketId: client.id,
                playerNumber: 1,
                x: 1088 - 20,
                y: 644 / 2 - 100 / 2,
                h: 100,
                w: 6,
                score: 0,
            });

            this.server.to(room.id).emit("start-game");

            setTimeout(() => {
                this.server.to(room.id).emit("game-started", room);
                this.pauseGame(500);
                this.startRoomGame(room);
            }, 3100);
        } else {
            room = {
                gameAbondoned: false,
                stopRendering: false,
                winner: 0,
                id: (this.rooms.length + 1).toString(),
                roomPlayers: [
                    {
                        socketId: client.id,
                        playerNumber: 2,
                        x: 10,
                        y: 644 / 2 - 100 / 2,
                        h: 100,
                        w: 6,
                        score: 0,
                    },
                ],
                roomBall: {
                    x: 1088 / 2,
                    y: 644 / 2,
                    r: 10,
                    speed: 7,
                    velocityX: 7,
                    velocityY: 7,
                },
            };
            this.rooms.push(room);
            client.join(room.id);
            client.emit("player-number", 1);
        }
    }

	@SubscribeMessage("update-player")
	handleUpdatePlayer(client: Socket, data: Data) {
		const room = this.rooms.find((room) => room.id === data.roomID);

		if (room) {
			if (data.direction === "mouse") {
				room.roomPlayers[data.playerNumber - 1].y = data.event - data.position.top - 100 / 2;
			} else if (data.direction === "up") {
				room.roomPlayers[data.playerNumber - 1].y -= 30;
				if (room.roomPlayers[data.playerNumber - 1].y <= -50) {
					room.roomPlayers[data.playerNumber - 1].y = -50;
				}
			} else if (data.direction === "down") {
				room.roomPlayers[data.playerNumber - 1].y += 30;
				if (room.roomPlayers[data.playerNumber - 1].y + 100 >= 644) {
					room.roomPlayers[data.playerNumber - 1].y = 644 - 100 / 2;
				}
			}
		}

		this.rooms = this.rooms.map((oldRoom) => {
			if (room && oldRoom.id === room.id) {
				return room;
			} else {
				return oldRoom;
			}
		});

		if (room) {
			this.server.to(room.id).emit("update-game", room);
		}
	}

	@SubscribeMessage("leave")
	handleLeave(client: Socket, roomID: string) {
		client.leave(roomID);
	}

	findRoomBySocketId(socketId: string) {
		for (const room of this.rooms) {
			const playerInRoom = room.roomPlayers.find(player => player.socketId === socketId);
			if (playerInRoom) {
				return room;
			}
		}
		return null;
	}

	pauseGame(duration: number) {
		this.isPaused = true;
		setTimeout(() => {
			this.isPaused = false;
		}, duration);
	}

	resetBall(room: Room) {
		room.roomBall.x = 1088 / 2;
		room.roomBall.y = 644 / 2;
		room.roomBall.velocityX *= -1;
	}

	updateScore(room: Room) {
		if (room.roomBall.x - room.roomBall.r < 0) {
			this.logger.log(`player 2 scored in room : ${room.id}`);
			room.roomPlayers[1].score++;
			this.resetBall(room);
			this.pauseGame(500);
		} else if (room.roomBall.x + room.roomBall.r > 1088) {
			this.logger.log(`player 1 scored in room : ${room.id}`);
			room.roomPlayers[0].score++;
			this.resetBall(room);
			this.pauseGame(500);
		}
	}

	collision(ball: RoomBall, player: RoomPlayer) {
		const playerTop = player.y;
		const playerBottom = player.y + player.h;
		const playerLeft = player.x;
		const playerRight = player.x + player.w;
	
		const ballTop = ball.y - ball.r;
		const ballBottom = ball.y + ball.r;
		const ballLeft = ball.x - ball.r;
		const ballRight = ball.x + ball.r;
	
		return (
			ballRight > playerLeft &&
			ballTop < playerBottom &&
			ballLeft < playerRight &&
			ballBottom > playerTop
		);
	}

	startRoomGame(room: Room) {
		let interval = setInterval(() => {
			if (!this.isPaused) {
				room.roomBall.x += room.roomBall.velocityX;
				room.roomBall.y += room.roomBall.velocityY;
	
				if (
					room.roomBall.y + room.roomBall.r > 644 ||
					room.roomBall.y + room.roomBall.r < 10
				) {
					room.roomBall.velocityY *= -1;
				}
	
				let player =
					room.roomBall.x < 1088 / 2
						? room.roomPlayers[0]
						: room.roomPlayers[1];
	
				if (this.collision(room.roomBall, player)) {
					let collidePoint = room.roomBall.y - (player.y + player.h / 2);
	
					collidePoint = collidePoint / (player.h / 2);
	
					let angleRad = (Math.PI / 4) * collidePoint;
					if (player === room.roomPlayers[0]) {
						angleRad *= 1;
					} else if (player === room.roomPlayers[1]) {
						angleRad *= -1;
					}
	
					let direction = room.roomBall.x < 1088 / 2 ? 1 : -1;
	
					room.roomBall.velocityX =
						direction * room.roomBall.speed * Math.cos(angleRad);
					room.roomBall.velocityY =
						direction * room.roomBall.speed * Math.sin(angleRad);
	
					room.roomBall.speed += 0.2;
				}
	
				this.updateScore(room);
	
				if (room.roomPlayers[0].score === 5) {
					room.winner = 1;
					this.rooms = this.rooms.filter((r) => r.id !== room.id);
					this.server.to(room.id).emit("endGame", room);
					clearInterval(interval);
				} else if (room.roomPlayers[1].score === 5) {
					room.winner = 2;
					this.rooms = this.rooms.filter((r) => r.id !== room.id);
					this.server.to(room.id).emit("endGame", room);
					clearInterval(interval);
				}
	
				if (room.stopRendering) {
					clearInterval(interval);
				}
	
				this.server.to(room.id).emit("update-game", room);
			}
		}, 1000 / this.framePerSec);
	}

}
