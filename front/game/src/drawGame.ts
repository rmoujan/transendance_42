class DrawGame {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    canvasWidth!: number;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.canvasWidth = this.canvas.width;
    }

    drawRect(x: number, y: number, w: number, h: number, color: string): void {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, w, h);
    }

    drawBall(x: number, y: number, r: number, color: string): void {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI * 2, false);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawLine(startX: number, startY: number, endX: number, endY: number, color: string): void {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    drawScore(text: string, x: number, y: number, color: string): void {
        this.ctx.fillStyle = color;
        this.ctx.font = "40px Helvetica";

        const textWidth: number = this.ctx.measureText(text).width;

        const textX: number = this.canvasWidth / 2 - textWidth / 2 + x;

        this.ctx.fillText(text, textX, y);
    }
}

export default DrawGame;