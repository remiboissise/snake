export const COLS = 60
export const ROWS = 40

export const DIRECTIONS = Object.freeze({
  up: Object.freeze({ x: 0, y: -1 }),
  down: Object.freeze({ x: 0, y: 1 }),
  left: Object.freeze({ x: -1, y: 0 }),
  right: Object.freeze({ x: 1, y: 0 }),
})

const START_DELAY = 100
const MIN_DELAY = 50
const POINTS_PER_LEVEL = 10
const DELAY_STEP = 10

export const delayFor = (score) =>
  Math.max(
    MIN_DELAY,
    START_DELAY - Math.trunc(score / POINTS_PER_LEVEL) * DELAY_STEP,
  )

export const isOpposite = (a, b) => a.x === -b.x && a.y === -b.y

const sameCell = (a, b) => a.x === b.x && a.y === b.y

export function randomFood(snake, random = Math.random) {
  const taken = new Set(snake.map(({ x, y }) => y * COLS + x))
  let index = Math.floor(random() * (COLS * ROWS - taken.size))
  for (let cell = 0; cell < COLS * ROWS; cell++) {
    if (taken.has(cell)) continue
    if (index-- === 0) return { x: cell % COLS, y: Math.floor(cell / COLS) }
  }
  return null
}

export function createGame(random = Math.random) {
  const snake = [{ x: COLS / 2, y: ROWS / 2 }]
  return {
    snake,
    direction: DIRECTIONS.right,
    food: randomFood(snake, random),
    score: 0,
    over: false,
  }
}

export function step(game, requested = game.direction, random = Math.random) {
  if (game.over) return game

  const direction = isOpposite(requested, game.direction)
    ? game.direction
    : requested
  const [head] = game.snake
  const next = {
    x: (head.x + direction.x + COLS) % COLS,
    y: (head.y + direction.y + ROWS) % ROWS,
  }
  const eats = sameCell(next, game.food)
  const body = eats ? game.snake : game.snake.slice(0, -1)

  if (body.some((cell) => sameCell(cell, next))) {
    return { ...game, direction, over: true }
  }

  const snake = [next, ...body]
  if (!eats) return { ...game, snake, direction }

  const food = randomFood(snake, random)
  return { snake, direction, food, score: game.score + 1, over: food === null }
}