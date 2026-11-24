import { useState } from "react"
import Game from "./components/Game.jsx"
import Instructions from "./components/Instructions.jsx"
import Leaderboard from "./components/Leaderboard.jsx"

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <main className="game">
      <h1 className="title">Snake</h1>
      <div className="layout">
        <Instructions />
        <Game onScoreSaved={() => setRefreshKey((key) => key + 1)} />
        <Leaderboard refreshKey={refreshKey} />
      </div>
    </main>
  )
}