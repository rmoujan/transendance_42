"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drawFunctions_1 = require("./drawFunctions");
const gameObjects_1 = require("./gameObjects");
const message = document.getElementById("message");
const buttons = document.querySelectorAll(".btn");
const exitButton = document.getElementById("exit-btn");
let comp = gameObjects_1.player_2;
let gameOver = false;
let userWon = false;
let compWon = false;
let framePerSec = 50;
let isPaused = false;
let renderingStopped = false;
let countdown = 3;
function pauseGame(duration) {
    isPaused = true;
    setTimeout(() => {
        isPaused = false;
    }, duration);
}
function collision(ball, player) {
    const playerTop = player.y;
    const playerBottom = player.y + player.h;
    const playerLeft = player.x;
    const playerRight = player.x + player.w;
    const ballTop = ball.y - ball.r;
    const ballBottom = ball.y + ball.r;
    const ballLeft = ball.x - ball.r;
    const ballRight = ball.x + ball.r;
    return (ballRight > playerLeft &&
        ballTop < playerBottom &&
        ballLeft < playerRight &&
        ballBottom > playerTop);
}
function resetBall() {
    gameObjects_1.ball.x = drawFunctions_1.canvasWidth / 2;
    gameObjects_1.ball.y = drawFunctions_1.canvasHeight / 2;
    gameObjects_1.ball.velocityX *= -1;
}
function movePaddle(event) {
    let pos = drawFunctions_1.canvas.getBoundingClientRect();
    gameObjects_1.player_1.y = event.clientY - pos.top - gameObjects_1.player_1.h / 2;
}
function movePaddleWithKeys(event) {
    if (event.key == "ArrowDown") {
        gameObjects_1.player_1.y += 30;
        if (gameObjects_1.player_1.y >= drawFunctions_1.canvasHeight - gameObjects_1.player_1.h) {
            gameObjects_1.player_1.y = drawFunctions_1.canvasHeight - gameObjects_1.player_1.h / 2;
        }
    }
    else if (event.key == "ArrowUp") {
        gameObjects_1.player_1.y -= 30;
        if (gameObjects_1.player_1.y <= -gameObjects_1.player_1.h / 2) {
            gameObjects_1.player_1.y = -gameObjects_1.player_1.h / 2;
        }
    }
}
function updateScore() {
    if (gameObjects_1.ball.x - gameObjects_1.ball.r < 0) {
        comp.score++;
        resetBall();
        pauseGame(150);
    }
    else if (gameObjects_1.ball.x + gameObjects_1.ball.r > drawFunctions_1.canvasWidth) {
        gameObjects_1.player_1.score++;
        resetBall();
        pauseGame(150);
    }
}
function checkGameStatus() {
    if (gameObjects_1.player_1.score === 5) {
        userWon = true;
        gameOver = true;
    }
    else if (comp.score === 5) {
        compWon = true;
        gameOver = true;
    }
}
function update() {
    gameObjects_1.ball.x += gameObjects_1.ball.velocityX;
    gameObjects_1.ball.y += gameObjects_1.ball.velocityY;
    let computerLevel = 0.1;
    comp.y += (gameObjects_1.ball.y - (comp.y + comp.h / 2)) * computerLevel;
    if (gameObjects_1.ball.y + gameObjects_1.ball.r > drawFunctions_1.canvasHeight || gameObjects_1.ball.y + gameObjects_1.ball.r < 10) {
        gameObjects_1.ball.velocityY *= -1;
    }
    let player = gameObjects_1.ball.x < drawFunctions_1.canvasWidth / 2 ? gameObjects_1.player_1 : comp;
    if (collision(gameObjects_1.ball, player)) {
        // where the ball hits the player
        let collidePoint = gameObjects_1.ball.y - (player.y + player.h / 2);
        // normalization
        collidePoint = collidePoint / (player.h / 2);
        // calculate the angle in Radian
        let angleRad = (Math.PI / 4) * collidePoint;
        if (player === gameObjects_1.player_1) {
            angleRad *= 1;
        }
        else if (player === comp) {
            angleRad *= -1;
        }
        let direction = gameObjects_1.ball.x < drawFunctions_1.canvasWidth / 2 ? 1 : -1;
        gameObjects_1.ball.velocityX = direction * gameObjects_1.ball.speed * Math.cos(angleRad);
        gameObjects_1.ball.velocityY = direction * gameObjects_1.ball.speed * Math.sin(angleRad);
        gameObjects_1.ball.speed += 0.2;
    }
    updateScore();
    checkGameStatus();
}
function render() {
    if (gameOver) {
        (0, drawFunctions_1.drawRect)(0, 0, drawFunctions_1.canvasWidth, drawFunctions_1.canvasHeight, "#B2C6E4");
        (0, drawFunctions_1.drawLine)(drawFunctions_1.canvasWidth / 2, 0, drawFunctions_1.canvasWidth / 2, drawFunctions_1.canvasHeight / 2 - 70, gameObjects_1.midLine.color);
        (0, drawFunctions_1.drawLine)(drawFunctions_1.canvasWidth / 2, drawFunctions_1.canvasHeight / 2 + 70, drawFunctions_1.canvasWidth / 2, drawFunctions_1.canvasHeight, gameObjects_1.midLine.color);
        renderingStopped = true;
        if (userWon) {
            message.innerHTML = "Game Over, You Won!";
        }
        else if (compWon) {
            message.innerHTML = "Game Over, You Lost!";
        }
        exitButton.style.display = "block";
    }
    else {
        (0, drawFunctions_1.drawRect)(0, 0, drawFunctions_1.canvasWidth, drawFunctions_1.canvasHeight, "#B2C6E4");
        (0, drawFunctions_1.drawRect)(gameObjects_1.player_1.x, gameObjects_1.player_1.y, gameObjects_1.player_1.w, gameObjects_1.player_1.h, gameObjects_1.player_1.color);
        (0, drawFunctions_1.drawRect)(comp.x, comp.y, comp.w, comp.h, comp.color);
        (0, drawFunctions_1.drawLine)(gameObjects_1.midLine.startX, gameObjects_1.midLine.startY, gameObjects_1.midLine.endX, gameObjects_1.midLine.endY, gameObjects_1.midLine.color);
        (0, drawFunctions_1.drawBall)(gameObjects_1.ball.x, gameObjects_1.ball.y, gameObjects_1.ball.r, gameObjects_1.ball.color);
        (0, drawFunctions_1.drawScore)(gameObjects_1.player_1.score.toString(), -50, 70, "#201E3A");
        (0, drawFunctions_1.drawScore)(comp.score.toString(), 50, 70, "#201E3A");
    }
}
function game() {
    if (!isPaused) {
        update();
    }
    render();
}
function startBotGame() {
    for (const button of buttons) {
        button.style.display = "none";
    }
    console.log("Starting Game");
    message.innerHTML = `The game will start in ${countdown} seconds...`;
    let countdownInterval = setInterval(() => {
        countdown--;
        if (countdown) {
            message.innerHTML = `The game will start in ${countdown} seconds...`;
        }
        else {
            clearInterval(countdownInterval);
            message.innerHTML = "";
        }
    }, 1000);
    setTimeout(() => {
        drawFunctions_1.canvas.addEventListener("mousemove", movePaddle);
        window.addEventListener("keydown", movePaddleWithKeys);
        pauseGame(500);
        let interval = setInterval(() => {
            if (renderingStopped) {
                console.log("hello");
                clearInterval(interval);
            }
            game();
        }, 1000 / framePerSec);
    }, 3100);
}
exports.default = startBotGame;
