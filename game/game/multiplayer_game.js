"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const drawFunctions_1 = require("./drawFunctions");
const gameObjects_1 = require("./gameObjects");
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const message = document.getElementById("message");
const buttons = document.querySelectorAll(".btn");
const exitButton = document.getElementById("exit-btn");
const socket = (0, socket_io_client_1.default)("http://localhost:3000", {
    transports: ["websocket"],
});
socket.on("connect", () => {
    console.log(`You connected to the server with id : ${socket.id}`);
});
let gameStarted = false;
let playerNumber = 0;
let roomID = "";
let countdown = 3;
function startGame() {
    for (const button of buttons) {
        button.style.display = "none";
    }
    let interval = setInterval(() => {
        if (socket.connected) {
            clearInterval(interval);
            message.innerHTML = "Waiting for opponent to join...";
            socket.emit("join-room");
        }
        else {
            message.innerHTML =
                "Failed to connect to server, please try again later";
        }
    }, 50);
}
function render(room) {
    if (room.winner) {
        (0, drawFunctions_1.drawRect)(0, 0, drawFunctions_1.canvasWidth, drawFunctions_1.canvasHeight, "#B2C6E4");
        (0, drawFunctions_1.drawLine)(drawFunctions_1.canvasWidth / 2, 0, drawFunctions_1.canvasWidth / 2, drawFunctions_1.canvasHeight / 2 - 70, gameObjects_1.midLine.color);
        (0, drawFunctions_1.drawLine)(drawFunctions_1.canvasWidth / 2, drawFunctions_1.canvasHeight / 2 + 70, drawFunctions_1.canvasWidth / 2, drawFunctions_1.canvasHeight, gameObjects_1.midLine.color);
        if (room.winner === playerNumber) {
            if (room.gameAbondoned) {
                message.innerHTML = "Game abondoned, You Won!";
            }
            else {
                message.innerHTML = "Game Over, You Won!";
            }
        }
        else {
            message.innerHTML = "Game Over, You Lost!";
        }
        exitButton.style.display = "block";
    }
    else {
        (0, drawFunctions_1.drawRect)(0, 0, drawFunctions_1.canvasWidth, drawFunctions_1.canvasHeight, "#B2C6E4");
        (0, drawFunctions_1.drawRect)(gameObjects_1.player_1.x, gameObjects_1.player_1.y, gameObjects_1.player_1.w, gameObjects_1.player_1.h, gameObjects_1.player_1.color);
        (0, drawFunctions_1.drawRect)(gameObjects_1.player_2.x, gameObjects_1.player_2.y, gameObjects_1.player_2.w, gameObjects_1.player_2.h, gameObjects_1.player_2.color);
        (0, drawFunctions_1.drawLine)(gameObjects_1.midLine.startX, gameObjects_1.midLine.startY, gameObjects_1.midLine.endX, gameObjects_1.midLine.endY, gameObjects_1.midLine.color);
        (0, drawFunctions_1.drawBall)(gameObjects_1.ball.x, gameObjects_1.ball.y, gameObjects_1.ball.r, gameObjects_1.ball.color);
        (0, drawFunctions_1.drawScore)(gameObjects_1.player_1.score.toString(), -50, 70, "#201E3A");
        (0, drawFunctions_1.drawScore)(gameObjects_1.player_2.score.toString(), 50, 70, "#201E3A");
    }
}
socket.on("player-number", (num) => {
    console.log(`You are player : ${num}`);
    playerNumber = num;
});
socket.on("start-game", () => {
    console.log("Starting game.");
    gameStarted = true;
    setTimeout(() => {
        message.innerHTML = `The game will start in ${countdown} seconds...`;
    }, 500);
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown) {
            message.innerHTML = `The game will start in ${countdown} seconds...`;
        }
        else {
            clearInterval(countdownInterval);
            message.innerHTML = "";
        }
    }, 1000);
});
socket.on("game-started", (room) => {
    console.log(`Game started with room id : ${room.id}`);
    roomID = room.id;
    gameObjects_1.player_1.x = room.roomPlayers[0].x;
    gameObjects_1.player_1.y = room.roomPlayers[0].y;
    gameObjects_1.player_1.score = room.roomPlayers[0].score;
    gameObjects_1.player_2.x = room.roomPlayers[1].x;
    gameObjects_1.player_2.y = room.roomPlayers[1].y;
    gameObjects_1.player_2.score = room.roomPlayers[1].score;
    gameObjects_1.ball.x = room.roomBall.x;
    gameObjects_1.ball.y = room.roomBall.y;
    let pos = drawFunctions_1.canvas.getBoundingClientRect();
    drawFunctions_1.canvas.addEventListener("mousemove", (event) => {
        if (gameStarted) {
            socket.emit("update-player", {
                playerNumber: playerNumber,
                roomID: roomID,
                direction: "mouse",
                event: event.clientY,
                position: pos,
            });
        }
    });
    window.addEventListener("keydown", (event) => {
        if (event.key === "ArrowUp") {
            socket.emit("update-player", {
                playerNumber: playerNumber,
                roomID: roomID,
                direction: "up",
                position: pos,
            });
        }
        else if (event.key === "ArrowDown") {
            socket.emit("update-player", {
                playerNumber: playerNumber,
                roomID: roomID,
                direction: "down",
                position: pos,
            });
        }
    });
    render(room);
});
socket.on("update-game", (room) => {
    gameObjects_1.ball.x = room.roomBall.x;
    gameObjects_1.ball.y = room.roomBall.y;
    gameObjects_1.ball.r = room.roomBall.r;
    gameObjects_1.ball.velocityX = room.roomBall.velocityX;
    gameObjects_1.ball.velocityY = room.roomBall.velocityY;
    gameObjects_1.ball.speed = room.roomBall.speed;
    gameObjects_1.player_1.y = room.roomPlayers[0].y;
    gameObjects_1.player_2.y = room.roomPlayers[1].y;
    gameObjects_1.player_1.score = room.roomPlayers[0].score;
    gameObjects_1.player_2.score = room.roomPlayers[1].score;
    render(room);
});
socket.on("endGame", (room) => {
    console.log("Game Over.");
    gameStarted = false;
    render(room);
    socket.emit("leave", roomID);
});
exports.default = startGame;
