import { Player, Line, Ball } from "./interfaces";

const player_1: Player = {
    x: 10,
    y: 644 / 2 - 100 / 2,
    w: 6,
    h: 100,
    color: "#211F3C",
    score: 0,
};

const player_2: Player = {
    x: 1088 - 20,
    y: 644 / 2 - 100 / 2,
    w: 6,
    h: 100,
    color: "#211F3C",
    score: 0,
};

const midLine: Line = {
    startX: 1088 / 2,
    startY: 0,
    endX: 1088 / 2,
    endY: 644,
    color: "#6c757d",
};

const ball: Ball = {
    x: 1088 / 2,
    y: 644 / 2,
    r: 10,
    speed: 7,
    velocityX: 7,
    velocityY: 7,
    color: "#1E1B37",
};

export { player_1, player_2, midLine, ball };
