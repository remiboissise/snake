import { COLS, ROWS } from "./engine.js"

export const CELL = 10
export const WIDTH = COLS * CELL
export const HEIGHT = ROWS * CELL

const COLORS = {
  board: "#ffffff",
  outline: "#000000",
  snake: "rgb(101, 220, 169)",
  food: "rgb(236, 73, 64)",
  text: "rgb(39, 39, 39)",
}

function drawCell(ctx, { x, y }, color) {
  ctx.fillStyle = color
  ctx.fillRect(x * CELL, y * CELL, CELL, CELL)
  ctx.strokeRect(x * CELL, y * CELL, CELL, CELL)
}

export function drawGame(ctx, game, message) {
  ctx.fillStyle = COLORS.board
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
  ctx.strokeStyle = COLORS.outline

  if (game) {
    for (const cell of game.snake) drawCell(ctx, cell, COLORS.snake)
    if (game.food) drawCell(ctx, game.food, COLORS.food)
  }

  if (message) {
    ctx.fillStyle = COLORS.text
    ctx.font = "16px nokiafc22, monospace"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(message, WIDTH / 2, HEIGHT / 2)
  }
}