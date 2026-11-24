import eatUrl from "../sounds/eat.mp3"
import failUrl from "../sounds/fail.mp3"

function sound(url) {
  let audio
  return () => {
    audio ??= new Audio(url)
    audio.volume = 0.15
    audio.currentTime = 0
    audio.play().catch(() => {})
  }
}

export const playEat = sound(eatUrl)
export const playFail = sound(failUrl)