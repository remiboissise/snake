import { initializeApp } from "firebase/app"
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

const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
})

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