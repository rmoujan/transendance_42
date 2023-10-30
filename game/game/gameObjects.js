"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ball = exports.midLine = exports.player_2 = exports.player_1 = void 0;
const drawFunctions_1 = require("./drawFunctions");
const player_1 = {
    x: 10,
    y: drawFunctions_1.canvasHeight / 2 - 100 / 2,
    w: 6,
    h: 100,
    color: "#211F3C",
    score: 0,
};
exports.player_1 = player_1;
const player_2 = {
    x: drawFunctions_1.canvasWidth - 20,
    y: drawFunctions_1.canvasHeight / 2 - 100 / 2,
    w: 6,
    h: 100,
    color: "#211F3C",
    score: 0,
};
exports.player_2 = player_2;
const midLine = {
    startX: drawFunctions_1.canvasWidth / 2,
    startY: 0,
    endX: drawFunctions_1.canvasWidth / 2,
    endY: drawFunctions_1.canvasHeight,
    color: "#6c757d",
};
exports.midLine = midLine;
const ball = {
    x: drawFunctions_1.canvasWidth / 2,
    y: drawFunctions_1.canvasHeight / 2,
    r: 10,
    speed: 7,
    velocityX: 7,
    velocityY: 7,
    color: "#1E1B37",
};
exports.ball = ball;
