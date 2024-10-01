// js/canvas.js

import { canvas } from './domElements.js';

export const originalCanvasWidth = 600;
export const originalCanvasHeight = 400;

export let scaleX, scaleY;

export function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Calcola i fattori di scala
    scaleX = canvas.width / originalCanvasWidth;
    scaleY = canvas.height / originalCanvasHeight;
}
