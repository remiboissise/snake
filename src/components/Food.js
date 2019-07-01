import { randomPosition, CTX } from "./Canvas";
import * as styles from '../styles/variables.scss';

var FOOD_LENGTH = 1;

export function generateFood() {
    var food = [];
    for(var i = 0, j = FOOD_LENGTH; i < j; i++){
        food.push(randomPosition());
    }
    return food;
}

export function renderFood(food) {
    for(var i = 0, j = food.length; i < j; i++) {
        CTX.fillStyle = styles.red;
        CTX.fillRect(food[i].x, food[i].y, 10, 10);
        CTX.strokeRect(food[i].x, food[i].y, 10, 10);
    }
}

export function eat(food, snake) {
    var head = snake[0];
    var fruit = food[0];
    if(head.x === fruit.x && head.y === fruit.y) {
        return true;
    } 
    return false;
}