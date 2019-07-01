import { CTX, CANVAS_WIDTH, CANVAS_START_X, CELL, CANVAS_HEIGHT, CANVAS_START_Y, centerCanvas } from '../components/Canvas';
import * as styles from '../styles/variables.scss';

export const SNAKE_LENGTH = 1;

export function generateSnake() {
    var snake = [];
    for(var i = 0, j = SNAKE_LENGTH; i < j; i++) {
        snake.push(centerCanvas());
    }
    return snake;
}

export function renderSnake(snake) {
    for(var i = 0, j = snake.length; i < j; i++) {
        CTX.fillStyle = styles.green;
        CTX.fillRect(snake[i].x, snake[i].y, 10, 10);
        CTX.strokeRect(snake[i].x, snake[i].y, 10, 10);
    }
}

export function isInside(head, keypressed) {
    if(head.x >= CANVAS_WIDTH + CANVAS_START_X && keypressed.key === 'RIGHT') {
        head.x = CANVAS_START_X;
    }
    if(head.x < CANVAS_START_X && keypressed.key === 'LEFT') {
        head.x = CANVAS_START_X + CANVAS_WIDTH - CELL;
    }
    if(head.y < CANVAS_START_Y && keypressed.key === 'UP') {
        head.y = CANVAS_START_Y + CANVAS_HEIGHT - CELL;
    }
    if(head.y >= CANVAS_START_Y + CANVAS_HEIGHT && keypressed.key === 'DOWN') {
        head.y = CANVAS_START_Y;
    }
    return head;
}
export function collision(snake, head) {
    for(var i = 0, j = snake.length; i < j; i++) {
        if(head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}