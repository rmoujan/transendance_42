import { player_1, player_2, midLine, ball } from "./gameObjects";
import { Room } from "./interfaces";
import DrawGame from "./drawGame";
import io, { Socket } from "socket.io-client";
import { pathn } from "../../front/src/pages/Home";
import axios from "axios";

class MyMultiplayerGame {
    canvas: HTMLCanvasElement;
    ctx!: CanvasRenderingContext2D;
    canvasWidth!: number;
    canvasHeight!: number;
	gameStarted!: boolean;
	playerNumber!: number;
	roomID!: string;
	countdown!: number;
	message!: HTMLElement;
	buttons!: NodeListOf<HTMLButtonElement>;
	drawGame!: DrawGame;
	onlineBtn!: HTMLButtonElement;
	socket!: Socket;
	right!: boolean;
	userId!: number;
	avatars!: HTMLElement;
	exitBtn!: HTMLButtonElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.width = 1088;
        this.canvas.height = 644;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
		this.gameStarted = false;
		this.playerNumber = 0;
		this.roomID = "";
		this.countdown = 3;
		this.right = false;
		this.message = document.getElementById("message") as HTMLElement;
		this.buttons = document.querySelectorAll<HTMLButtonElement>(".btn");
		this.drawGame = new DrawGame(this.canvas, this.ctx);
		this.onlineBtn = document.getElementById("online-game") as HTMLButtonElement;
		this.avatars = document.getElementById("avatars") as HTMLElement;
		this.exitBtn = document.getElementById("exit-btn") as HTMLButtonElement;

		this.onlineBtn.addEventListener("click", () => {
			this.socket = io("http://localhost:3000", {
				transports: ["websocket"],
				withCredentials: true,
			});

			this.socket.on("connect", () => {
				console.log(`You connected to the server with id : ${this.socket.id}`);
			});
			this.initSocketListeners();
		});
    }

	checkLocation = () => {
		if (pathn != '/game') {
			this.socket.disconnect();
		}
	};

	async startMultiplayerGame(): Promise<void> {
		let flag = false;
		const data = await axios.get('http://localhost:3000/profile/returngameinfos',  { withCredentials: true });
		console.log("dataaaaaaa");
		console.log(data);
		for (const button of this.buttons) {
			button.style.display = "none";
		}
		this.exitBtn.style.display = "block";

		const interval = setInterval(() => {
			if (this.socket.connected) {
				if (this.gameStarted) {
					clearInterval(interval);
				}
				this.checkLocation();
				this.message.innerHTML = "Waiting for opponent to join...";
				if (flag === false) {
					if (data.data.homies) {
						this.buttons[0].innerHTML = "Play With Your Homie";
						this.socket.emit("join-friends-room", data.data.invited, data.data.homie_id);
					} else {
						this.socket.emit("join-room");
					}
					flag = true;
				}
			} else {
				this.message.innerHTML = "Failed to connect to server, please try again later";
			}
		}, 50);
	}
	
	render(room: Room): void {
		this.checkLocation();
		if (room.winner) {
			this.avatars.style.display = "none";
			this.drawGame.drawRect(0, 0, this.canvasWidth, this.canvasHeight, "#B2C6E4");
	
			if (room.winner === this.playerNumber) {
				if (room.gameAbondoned) {
					this.message.innerHTML = "Game abondoned, You Won!";
				} else {
					this.message.innerHTML = "Game Over, You Won!";
				}
			} else {
				this.message.innerHTML = "Game Over, You Lost!";
			}
			this.buttons[0].style.display = "block";
			this.buttons[0].innerHTML = "Play Again";
			this.buttons[1].style.display = "block";
			this.buttons[2].style.display = "block";
			this.onlineBtn.addEventListener("click", () => {
				this.gameStarted = false;
				this.playerNumber = 0;
				this.roomID = "";
				this.countdown = 3;
				ball.x = 1088 / 2;
				ball.y = 644 /  2;
			});
		} else {
			this.drawGame.drawRect(0, 0, this.canvasWidth, this.canvasHeight, "#B2C6E4");
			this.drawGame.drawRect(player_1.x, player_1.y, player_1.w, player_1.h, player_1.color);
			this.drawGame.drawRect(player_2.x, player_2.y, player_2.w, player_2.h, player_2.color);
			this.drawGame.drawLine(midLine.startX, midLine.startY, midLine.endX, midLine.endY, midLine.color);
			this.drawGame.drawBall(ball.x, ball.y, ball.r, ball.color);
			this.drawGame.drawScore(player_1.score.toString(), -50, 70, "#201E3A");
			this.drawGame.drawScore(player_2.score.toString(), 50, 70, "#201E3A");
		}
	}

	initSocketListeners(): void {
		this.socket.on("user-id", (num: number) => {
			this.userId = num;
		});

		this.socket.on("player-number", (num: number) => {
			console.log(`You are player : ${num}`);
			this.playerNumber = num;
			if (this.playerNumber == 2) {
				this.right = true;
			}
		});

		this.socket.on("start-game", () => {
			this.exitBtn.style.display = "none";
			this.avatars.style.display = "flex";
			console.log("Starting game.");
			this.gameStarted = true;
			setTimeout(() => {
				this.checkLocation();
				if (this.socket.connected) {
					this.message.innerHTML = `The game will start in ${this.countdown} seconds...`;
				}
			}, 500);
		
			const countdownInterval = setInterval(() => {
				this.checkLocation();
				if (this.socket.disconnected) {
					clearInterval(countdownInterval);
				}
				this.countdown--;
				if (this.countdown > 0 && this.socket.connected) {
					this.message.innerHTML = `The game will start in ${this.countdown} seconds...`;
				} else {
					if (this.socket.connected) {
						this.message.innerHTML = "";
					}
					clearInterval(countdownInterval);
				}
			}, 1000);
		});
		
		this.socket.on("game-started", (room: Room) => {
			console.log(`Game started with room id : ${room.id}`);
			this.roomID = room.id;
		
			player_1.x = room.roomPlayers[0].x;
			player_1.y = room.roomPlayers[0].y;
			player_1.score = room.roomPlayers[0].score;
		
			player_2.x = room.roomPlayers[1].x;
			player_2.y = room.roomPlayers[1].y;
			player_2.score = room.roomPlayers[1].score;
		
			ball.x = room.roomBall.x;
			ball.y = room.roomBall.y;
		
			const pos: DOMRect = this.canvas.getBoundingClientRect();
			this.canvas.addEventListener("mousemove", (event: MouseEvent) => {
				if (this.gameStarted) {
					this.socket.emit("update-player", {
						playerNumber: this.playerNumber,
						roomID: this.roomID,
						direction: "mouse",
						event: event.clientY,
						position: pos,
					});
				}
			});
		
			window.addEventListener("keydown", (event: KeyboardEvent) => {
				if (event.key === "ArrowUp") {
					this.socket.emit("update-player", {
						playerNumber: this.playerNumber,
						roomID: this.roomID,
						direction: "up",
						position: pos,
					});
				} else if (event.key === "ArrowDown") {
					this.socket.emit("update-player", {
						playerNumber: this.playerNumber,
						roomID: this.roomID,
						direction: "down",
						position: pos,
					});
				}
			});

			this.render(room);
		});
		
		this.socket.on("update-game", (room: Room) => {
			ball.x = room.roomBall.x;
			ball.y = room.roomBall.y;
			ball.r = room.roomBall.r;
			ball.velocityX = room.roomBall.velocityX;
			ball.velocityY = room.roomBall.velocityY;
			ball.speed = room.roomBall.speed;
		
			player_1.y = room.roomPlayers[0].y;
			player_2.y = room.roomPlayers[1].y;
		
			player_1.score = room.roomPlayers[0].score;
			player_2.score = room.roomPlayers[1].score;
		
			this.render(room);
			this.checkLocation();
		});
		
		this.socket.on("endGame", (room: Room) => {
			console.log("Game Over.");
			this.gameStarted = false;
			this.render(room);
			this.socket.emit("leave", this.roomID);
		});
	}
}

export default MyMultiplayerGame;
