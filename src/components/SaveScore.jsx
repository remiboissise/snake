import { useState } from "react"
import { MAX_NAME_LENGTH, saveScore } from "../leaderboard.js"

export default function SaveScore({ score, canSave, onRetry, onSaved }) {
  const [name, setName] = useState("")
  const [state, setState] = useState("idle")

  const retry = (
    <button type="button" onClick={onRetry}>
      Try again
    </button>
  )

  if (!canSave || state === "saved") {
    return (
      <div className="end">
        {state === "saved" && <p>Score saved.</p>}
        {retry}
      </div>
    )
  }

  const submit = async (event) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || state === "saving") return
    setState("saving")
    try {
      await saveScore(trimmed, score)
      setState("saved")
      onSaved()
    } catch {
      setState("error")
    }
  }

  return (
    <form className="end" onSubmit={submit}>
      <p>Congratulations, your score is {score}.</p>
      <p>
        <label htmlFor="player-name">Your name</label>{" "}
        <input
          id="player-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={MAX_NAME_LENGTH}
          autoComplete="nickname"
          autoFocus
          required
        />{" "}
        <button type="submit" disabled={state === "saving"}>
          {state === "saving" ? "Saving…" : "Save"}
        </button>{" "}
        {retry}
      </p>
      {state === "error" && (
        <p role="alert">
          Your score could not be saved. Check your connection and try again.
        </p>
      )}
    </form>
  )
}