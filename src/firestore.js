import { initializeApp } from "firebase/app"
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check"
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore/lite"
import { appCheckEnabled } from "./leaderboard.js"

const env = import.meta.env

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  appId: env.VITE_FIREBASE_APP_ID,
})

// App Check attaches a reCAPTCHA-backed token to every Firestore request, so that
// once enforcement is on, Firebase only answers requests coming from this site.
if (appCheckEnabled) {
  if (env.DEV) {
    // On localhost, reCAPTCHA cannot vouch for the page: use a debug token instead.
    // The SDK prints it in the console; register it in the Firebase console.
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN || true
  }
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(env.VITE_RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: true,
  })
}

const ranking = collection(getFirestore(app), "ranking")

export async function fetchTopScores(size) {
  const snapshot = await getDocs(
    query(ranking, where("score", ">", 0), orderBy("score", "desc"), limit(size)),
  )
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    name: String(doc.get("name")),
    score: doc.get("score"),
  }))
}

export const addScore = (name, score) =>
  addDoc(ranking, { name, score, date: serverTimestamp() })