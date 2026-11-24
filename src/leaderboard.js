export const LEADERBOARD_SIZE = 10
export const MAX_NAME_LENGTH = 20

const env = import.meta.env

export const leaderboardEnabled = Boolean(
  env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_PROJECT_ID,
)

// App Check needs the Firebase app ID and a reCAPTCHA Enterprise site key.
export const appCheckEnabled = Boolean(
  leaderboardEnabled && env.VITE_FIREBASE_APP_ID && env.VITE_RECAPTCHA_SITE_KEY,
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