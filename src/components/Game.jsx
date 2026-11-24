import { useCallback, useEffect, useRef, useState } from "react"
import {
  DIRECTIONS,
  createGame,
  delayFor,
  isOpposite,
  step,
} from "../game/engine.js"
import { HEIGHT, WIDTH, drawGame } from "../game/render.js"
import { playEat, playFail } from "../game/sounds.js"
import { leaderboardEnabled } from "../leaderboard.js"
import SaveScore from "./SaveScore.jsx"

const KEYS = {
  ArrowUp: DIRECTIONS.up,
  ArrowDown: DIRECTIONS.down,
  ArrowLeft: DIRECTIONS.left,
  ArrowRight: DIRECTIONS.right,
  KeyW: DIRECTIONS.up,
  KeyS: DIRECTIONS.down,
  KeyA: DIRECTIONS.left,
  KeyD: DIRECTIONS.right,
}
const SWIPE_THRESHOLD = 24
const MAX_QUEUED_TURNS = 3

const toggle = (status) =>
  status === "playing" ? "paused" : status === "over" ? status : "playing"

const message = (status) => {
  if (status === "ready") {
    const touch = window.matchMedia("(pointer: coarse)").matches
    return touch ? "Tap to play" : "Press the space bar to play"
  }
  return { paused: "Pause", over: "GAME OVER" }[status]
}

export default function Game({ onScoreSaved }) {
  const canvasRef = useRef(null)
  const gameRef = useRef(null)
  const turnsRef = useRef([])
  const pointerRef = useRef(null)
  const [status, setStatus] = useState("ready")
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [fontReady, setFontReady] = useState(false)

  if (gameRef.current === null) gameRef.current = createGame()

  const paint = useCallback((currentStatus) => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    const game = gameRef.current
    const text = message(currentStatus)
    const showBoard = currentStatus === "playing" || currentStatus === "paused"
    drawGame(
      ctx,
      showBoard ? game : null,
      text ? `🐍 | ${text} | 🐍` : String(game.score),
    )
  }, [])

  const queueTurn = useCallback((direction) => {
    const turns = turnsRef.current
    const last = turns.at(-1) ?? gameRef.current.direction
    if (
      gameRef.current.over ||
      turns.length >= MAX_QUEUED_TURNS ||
      direction === last ||
      isOpposite(direction, last)
    ) {
      return
    }
    turns.push(direction)
  }, [])

  const tick = useCallback(() => {
    const previous = gameRef.current
    const game = step(previous, turnsRef.current.shift())
    gameRef.current = game
    if (game.over) {
      playFail()
      setStatus("over")
      return
    }
    if (game.score !== previous.score) {
      playEat()
      setScore(game.score)
    }
    paint("playing")
  }, [paint])

  const restart = () => {
    gameRef.current = createGame()
    turnsRef.current = []
    setScore(0)
    setRound((value) => value + 1)
    setStatus("playing")
  }

  useEffect(() => {
    let active = true
    document.fonts.load("16px nokiafc22").then(
      () => active && setFontReady(true),
      () => {},
    )
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    paint(status)
  }, [status, fontReady, paint])

  const delay = delayFor(score)
  useEffect(() => {
    if (status !== "playing") return
    const id = setInterval(tick, delay)
    return () => clearInterval(id)
  }, [status, delay, tick])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return
      if (event.target.closest?.("input, textarea, select, button, a")) return
      if (event.code === "Space") {
        event.preventDefault()
        if (!event.repeat) setStatus(toggle)
        return
      }
      const direction = KEYS[event.code]
      if (!direction) return
      event.preventDefault()
      queueTurn(direction)
    }
    const onVisibilityChange = () => {
      if (document.hidden) {
        setStatus((current) => (current === "playing" ? "paused" : current))
      }
    }
    window.addEventListener("keydown", onKeyDown)
    document.addEventListener("visibilitychange", onVisibilityChange)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [queueTurn])

  const onPointerDown = (event) => {
    pointerRef.current = { x: event.clientX, y: event.clientY }
  }

  const onPointerUp = (event) => {
    const start = pointerRef.current
    pointerRef.current = null
    if (!start) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_THRESHOLD) {
      setStatus(toggle)
      return
    }
    if (Math.abs(dx) > Math.abs(dy)) {
      queueTurn(dx > 0 ? DIRECTIONS.right : DIRECTIONS.left)
    } else {
      queueTurn(dy > 0 ? DIRECTIONS.down : DIRECTIONS.up)
    }
  }

  const announcement =
    status === "paused"
      ? "Paused."
      : status === "over"
        ? `Game over. Your score is ${score}.`
        : ""

  return (
    <section className="board" aria-label="Game">
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        role="img"
        aria-label={`Snake board, score ${score}`}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          pointerRef.current = null
        }}
      />
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
      {status === "over" && (
        <SaveScore
          key={round}
          score={score}
          canSave={leaderboardEnabled && score > 0}
          onRetry={restart}
          onSaved={onScoreSaved}
        />
      )}
    </section>
  )
}