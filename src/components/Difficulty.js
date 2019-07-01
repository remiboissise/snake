const MAX_DIFFICULTY = 50;
const INCREASE_DIFFICULTY = 10;
export let DIFFICULTY = 100;

export function difficulty(score) {
    let nd = DIFFICULTY - Math.trunc(score / INCREASE_DIFFICULTY) * 10;
    if(nd >= MAX_DIFFICULTY) {
        return nd;
    } else {
        return MAX_DIFFICULTY;
    }
}