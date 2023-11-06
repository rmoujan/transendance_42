"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawScore = exports.drawLine = exports.drawBall = exports.drawRect = exports.canvasHeight = exports.canvasWidth = exports.canvas = void 0;
const canvas = document.getElementById("canvas");
exports.canvas = canvas;
canvas.width = 1088;
canvas.height = 644;
const ctx = canvas.getContext("2d");
const canvasWidth = canvas.width;
exports.canvasWidth = canvasWidth;
const canvasHeight = canvas.height;
exports.canvasHeight = canvasHeight;
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}
exports.drawRect = drawRect;
function drawBall(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}
exports.drawBall = drawBall;
function drawLine(startX, startY, endX, endY, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.closePath();
    ctx.stroke();
}
exports.drawLine = drawLine;
function drawScore(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "40px Helvetica";
    const textWidth = ctx.measureText(text).width;
    const textX = canvasWidth / 2 - textWidth / 2 + x;
    ctx.fillText(text, textX, y);
}
exports.drawScore = drawScore;
