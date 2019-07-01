import React from 'react';
import * as styles from '../styles/variables.scss';

export let CANVAS = null;
export let CTX = null;
export const COLS = 60;
export const ROWS = 40;
export const CELL = 10;
export const CANVAS_START_X = 0;
export const CANVAS_START_Y = 0;
export const CANVAS_WIDTH = COLS * CELL;
export const CANVAS_HEIGHT = ROWS * CELL;

export default class Canvas extends React.Component {

    componentDidMount() {
        CANVAS = document.getElementById('snake-canvas');
        CTX = CANVAS.getContext("2d");
        clearCanvas();
    }

    render() {
        return(
            <>
                <canvas id="snake-canvas" width={CANVAS_WIDTH} height={CANVAS_HEIGHT}></canvas>
            </>
        )
    }
}

export function clearCanvas() {
    CTX.fillStyle = styles.white;
    CTX.strokeRect(CANVAS_START_X, CANVAS_START_Y, CANVAS_WIDTH, CANVAS_HEIGHT);
    CTX.fillRect(CANVAS_START_X, CANVAS_START_Y, CANVAS_WIDTH, CANVAS_HEIGHT);    
}

// Récupère le centre du canvas
export function centerCanvas() {
    return {
        x : Math.floor(CANVAS_WIDTH / 2) + CANVAS_START_Y,
        y : Math.floor(CANVAS_HEIGHT / 2) + CANVAS_START_X
    }
}

// Récupère une position aléatoire sur le canvas
export function randomPosition() {
    return {
        x : Math.floor(Math.random() * (COLS - 1) + 1) * CELL + CANVAS_START_X,
        y : Math.floor(Math.random() * (ROWS - 1) + 1) * CELL + CANVAS_START_Y
    }
}

export function showText(font, text) {
    CTX.fillStyle = styles.black;
    CTX.font = "1rem " + font.family;
    CTX.textBaseline = 'middle';
    CTX.textAlign = "center";
    CTX.fillText(text, (CANVAS_WIDTH / 2), CANVAS_HEIGHT / 2);
}