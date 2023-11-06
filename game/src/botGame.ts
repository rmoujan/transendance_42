import { player_1, player_2, midLine, ball } from "./gameObjects";
import { Player, Ball } from "./interfaces";
import DrawGame from "./drawGame";

class MyBotGame {
    canvas: HTMLCanvasElement;
    ctx!: CanvasRenderingContext2D;
    canvasWidth!: number;
    canvasHeight!: number;
    gameOver!: boolean;
    userWon!: boolean;
    compWon!: boolean;
    framePerSec!: number;
    isPaused!: boolean;
    renderingStopped!: boolean;
    countdown!: number;
    message!: HTMLElement;
    buttons!: NodeListOf<HTMLButtonElement>;
    // exitButton!: HTMLButtonElement;
	drawGame!: DrawGame;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.width = 1088;
        this.canvas.height = 644;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        this.gameOver = false;
        this.userWon = false;
        this.compWon = false;
        this.framePerSec = 50;
        this.isPaused = false;
        this.renderingStopped = false;
        this.countdown = 3;
        this.message = document.getElementById("message") as HTMLElement;
        this.buttons = document.querySelectorAll<HTMLButtonElement>(".btn");
        // this.exitButton = document.getElementById("exit-btn") as HTMLButtonElement;
		this.drawGame = new DrawGame(this.canvas, this.ctx);
    }

    pauseGame(duration: number): void {
        this.isPaused = true;
        setTimeout(() => {
            this.isPaused = false;
        }, duration);
    }

    collision(ball: Ball, player: Player): boolean {
        const playerTop: number = player.y;
        const playerBottom: number = player.y + player.h;
        const playerLeft: number = player.x;
        const playerRight: number = player.x + player.w;

        const ballTop: number = ball.y - ball.r;
        const ballBottom: number = ball.y + ball.r;
        const ballLeft: number = ball.x - ball.r;
        const ballRight: number = ball.x + ball.r;

        return (
            ballRight > playerLeft &&
            ballTop < playerBottom &&
            ballLeft < playerRight &&
            ballBottom > playerTop
        );
    }

    resetBall(): void {
        ball.x = this.canvasWidth / 2;
        ball.y = this.canvasHeight / 2;
        ball.velocityX *= -1;
    }

    updateScore(): void {
        if (ball.x - ball.r < 0) {
            player_2.score++;
            this.resetBall();
            this.pauseGame(150);
        } else if (ball.x + ball.r > this.canvasWidth) {
            player_1.score++;
            this.resetBall();
            this.pauseGame(150);
        }
    }

    checkGameStatus(): void {
        if (player_1.score === 5) {
            this.userWon = true;
            this.gameOver = true;
        } else if (player_2.score === 5) {
            this.compWon = true;
            this.gameOver = true;
        }
    }

    update(): void {
        ball.x += ball.velocityX;
        ball.y += ball.velocityY;

        const computerLevel: number = 0.1;

        player_2.y += (ball.y - (player_2.y + player_2.h / 2)) * computerLevel;

        if (ball.y + ball.r > this.canvasHeight || ball.y + ball.r < 10) {
            ball.velocityY *= -1;
        }

        const player: Player =
            ball.x < this.canvasWidth / 2 ? player_1 : player_2;

        if (this.collision(ball, player)) {
            // where the ball hits the player
            let collidePoint: number = ball.y - (player.y + player.h / 2);

            // normalization
            collidePoint = collidePoint / (player.h / 2);

            // calculate the angle in Radian
            let angleRad = (Math.PI / 4) * collidePoint;
            if (player === player_1) {
                angleRad *= 1;
            } else if (player === player_2) {
                angleRad *= -1;
            }

            const direction: number = ball.x < this.canvasWidth / 2 ? 1 : -1;

            ball.velocityX = direction * ball.speed * Math.cos(angleRad);
            ball.velocityY = direction * ball.speed * Math.sin(angleRad);

            ball.speed += 0.2;
        }

        this.updateScore();
        this.checkGameStatus();
    }

    render(): void {
        if (this.gameOver) {
            this.drawGame.drawRect(0, 0, this.canvasWidth, this.canvasHeight, "#B2C6E4");
            this.drawGame.drawLine(this.canvasWidth / 2, 0, this.canvasWidth / 2, this.canvasHeight / 2 - 70, midLine.color);
            this.drawGame.drawLine(this.canvasWidth / 2, this.canvasHeight / 2 + 70, this.canvasWidth / 2, this.canvasHeight, midLine.color);

            this.renderingStopped = true;
            if (this.userWon) {
                this.message.innerHTML = "Game Over, You Won!";
            } else if (this.compWon) {
                this.message.innerHTML = "Game Over, You Lost!";
            }
            // this.exitButton.style.display = "block";
        } else {
            this.drawGame.drawRect(0, 0, this.canvasWidth, this.canvasHeight, "#B2C6E4");
            this.drawGame.drawRect(player_1.x, player_1.y, player_1.w, player_1.h, player_1.color);
            this.drawGame.drawRect(player_2.x, player_2.y, player_2.w, player_2.h, player_2.color);
            this.drawGame.drawLine(midLine.startX, midLine.startY, midLine.endX, midLine.endY, midLine.color );
            this.drawGame.drawBall(ball.x, ball.y, ball.r, ball.color);
            this.drawGame.drawScore(player_1.score.toString(), -50, 70, "#201E3A");
            this.drawGame.drawScore(player_2.score.toString(), 50, 70, "#201E3A");
        }
    }

    game(): void {
        if (!this.isPaused) {
            this.update();
        }
        this.render();
    }

    startBotGame(): void {
        for (const button of this.buttons) {
            button.style.display = "none";
        }
        console.log("Starting Game");
        this.message.innerHTML = `The game will start in ${this.countdown} seconds...`;
        const countdownInterval = setInterval(() => {
            this.countdown--;
            if (this.countdown) {
                this.message.innerHTML = `The game will start in ${this.countdown} seconds...`;
            } else {
                clearInterval(countdownInterval);
                this.message.innerHTML = "";
            }
        }, 1000);

        setTimeout(() => {
            this.canvas.addEventListener(
                "mousemove",
                (event: MouseEvent) => {
                    const pos: DOMRect = this.canvas.getBoundingClientRect();
                    player_1.y = event.clientY - pos.top - player_1.h / 2;
                }
            );
            window.addEventListener("keydown", (event: KeyboardEvent) => {
                if (event.key == "ArrowDown") {
                    player_1.y += 30;
                    if (player_1.y >= this.canvasHeight - player_1.h) {
                        player_1.y = this.canvasHeight - player_1.h / 2;
                    }
                } else if (event.key == "ArrowUp") {
                    player_1.y -= 30;
                    if (player_1.y <= -player_1.h / 2) {
                        player_1.y = -player_1.h / 2;
                    }
                }
            });

            this.pauseGame(500);
            const interval = setInterval(() => {
                if (this.renderingStopped) {
                    clearInterval(interval);
                }
                this.game();
            }, 1000 / this.framePerSec);
        }, 3100);
    }
}

export default MyBotGame;
