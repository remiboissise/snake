import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  COLS,
  DIRECTIONS,
  ROWS,
  createGame,
  delayFor,
  randomFood,
  step,
} from "./engine.js"

const game = (snake, direction, food = { x: 0, y: 0 }, score = 0) => ({
  snake,
  direction,
  food,
  score,
  over: false,
})

describe("delayFor", () => {
  it("speeds up every 10 points and caps at 50 ms", () => {
    assert.equal(delayFor(0), 100)
    assert.equal(delayFor(9), 100)
    assert.equal(delayFor(10), 90)
    assert.equal(delayFor(49), 60)
    assert.equal(delayFor(50), 50)
    assert.equal(delayFor(500), 50)
  })
})

describe("createGame", () => {
  it("starts with one cell in the middle, heading right, food elsewhere", () => {
    const g = createGame()
    assert.deepEqual(g.snake, [{ x: COLS / 2, y: ROWS / 2 }])
    assert.equal(g.direction, DIRECTIONS.right)
    assert.notDeepEqual(g.food, g.snake[0])
  })
})

describe("step", () => {
  it("moves the head and drops the tail", () => {
    const next = step(game([{ x: 5, y: 5 }, { x: 4, y: 5 }], DIRECTIONS.right))
    assert.deepEqual(next.snake, [{ x: 6, y: 5 }, { x: 5, y: 5 }])
  })

  it("wraps around every edge", () => {
    const cases = [
      [{ x: COLS - 1, y: 3 }, DIRECTIONS.right, { x: 0, y: 3 }],
      [{ x: 0, y: 3 }, DIRECTIONS.left, { x: COLS - 1, y: 3 }],
      [{ x: 3, y: 0 }, DIRECTIONS.up, { x: 3, y: ROWS - 1 }],
      [{ x: 3, y: ROWS - 1 }, DIRECTIONS.down, { x: 3, y: 0 }],
    ]
    for (const [head, direction, expected] of cases) {
      assert.deepEqual(step(game([head], direction)).snake[0], expected)
    }
  })

  it("ignores a turn straight back", () => {
    const next = step(
      game([{ x: 5, y: 5 }, { x: 4, y: 5 }], DIRECTIONS.right),
      DIRECTIONS.left,
    )
    assert.equal(next.direction, DIRECTIONS.right)
    assert.equal(next.over, false)
  })

  it("grows, scores and places new food off the snake when eating", () => {
    const next = step(
      game([{ x: 5, y: 5 }], DIRECTIONS.right, { x: 6, y: 5 }, 3),
    )
    assert.deepEqual(next.snake, [{ x: 6, y: 5 }, { x: 5, y: 5 }])
    assert.equal(next.score, 4)
    assert.ok(!next.snake.some((c) => c.x === next.food.x && c.y === next.food.y))
  })

  it("ends the game when the snake bites itself", () => {
    const snake = [
      { x: 5, y: 5 },
      { x: 6, y: 5 },
      { x: 6, y: 6 },
      { x: 5, y: 6 },
      { x: 4, y: 6 },
    ]
    const next = step(game(snake, DIRECTIONS.up), DIRECTIONS.down)
    assert.equal(next.over, false, "turning back is ignored")
    const bitten = step(game(snake, DIRECTIONS.left), DIRECTIONS.down)
    assert.equal(bitten.over, true)
  })

  it("lets the head move into the cell the tail is leaving", () => {
    const snake = [
      { x: 5, y: 5 },
      { x: 6, y: 5 },
      { x: 6, y: 6 },
      { x: 5, y: 6 },
    ]
    const next = step(game(snake, DIRECTIONS.left), DIRECTIONS.down)
    assert.equal(next.over, false)
    assert.deepEqual(next.snake[0], { x: 5, y: 6 })
  })

  it("does nothing once the game is over", () => {
    const over = { ...game([{ x: 1, y: 1 }], DIRECTIONS.right), over: true }
    assert.equal(step(over), over)
  })
})

describe("randomFood", () => {
  it("never lands on the snake and can reach every free cell", () => {
    const snake = [{ x: 0, y: 0 }, { x: 1, y: 0 }]
    assert.deepEqual(randomFood(snake, () => 0), { x: 2, y: 0 })
    assert.deepEqual(randomFood(snake, () => 0.9999999), {
      x: COLS - 1,
      y: ROWS - 1,
    })
  })

  it("returns null when the board is full", () => {
    const snake = Array.from({ length: COLS * ROWS }, (_, i) => ({
      x: i % COLS,
      y: Math.floor(i / COLS),
    }))
    assert.equal(randomFood(snake), null)
  })
})