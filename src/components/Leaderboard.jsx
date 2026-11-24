import { useEffect, useState } from "react"
import { fetchTopScores, leaderboardEnabled } from "../leaderboard.js"

export default function Leaderboard({ refreshKey }) {
  const [board, setBoard] = useState({
    status: leaderboardEnabled ? "loading" : "disabled",
    entries: [],
  })

  useEffect(() => {
    if (!leaderboardEnabled) return
    let active = true
    fetchTopScores().then(
      (entries) => active && setBoard({ status: "ready", entries }),
      () => active && setBoard((previous) => ({ ...previous, status: "error" })),
    )
    return () => {
      active = false
    }
  }, [refreshKey])

  const { status, entries } = board

  return (
    <section className="panel leaderboard" aria-labelledby="leaderboard-title">
      <h2 id="leaderboard-title">Leaderboard</h2>
      {status === "loading" && <p>Loading scores…</p>}
      {status === "disabled" && <p>The leaderboard is not set up.</p>}
      {status === "error" && (
        <p>The leaderboard could not load. Refresh the page to try again.</p>
      )}
      {status === "ready" &&
        (entries.length ? (
          <ol>
            {entries.map((entry) => (
              <li key={entry.id}>
                <span className="name">{entry.name}</span>
                <span className="points">{entry.score}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p>No scores yet. Finish a game to take first place.</p>
        ))}
    </section>
  )
}