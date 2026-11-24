export const LEADERBOARD_SIZE = 10
export const MAX_NAME_LENGTH = 20

export const leaderboardEnabled = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID,
)

const loadFirestore = () => import("./firestore.js")

export async function fetchTopScores() {
  const firestore = await loadFirestore()
  return firestore.fetchTopScores(LEADERBOARD_SIZE)
}

export async function saveScore(name, score) {
  const firestore = await loadFirestore()
  await firestore.addScore(name, score)
}