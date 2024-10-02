// js/controls.js

import { spaceship, shoot } from './entities.js';
import { pauseGame } from './game.js';
import { canvas } from './domElements.js';

let keys = {};
let mouseDown = false;

export function handleKeyDown(e) {
    keys[e.key.toLowerCase()] = true;
    if (e.key === "p" || e.key === "P") {
        pauseGame();
    }
}

export function handleKeyUp(e) {
    keys[e.key.toLowerCase()] = false;
}

export function handleMouseMove(e) {
    // Calcola la posizione del mouse rispetto al canvas
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    // Imposta la posizione dell'astronave sulla posizione orizzontale del mouse
    spaceship.x = mouseX;

    // Impedisci all'astronave di uscire dai bordi
    if (spaceship.x - spaceship.width / 2 < 0) {
        spaceship.x = spaceship.width / 2;
    }
    if (spaceship.x + spaceship.width / 2 > canvas.width) {
        spaceship.x = canvas.width - spaceship.width / 2;
    }
}

export function handleMouseDown(e) {
    if (e.button === 0) { // Tasto sinistro del mouse
        mouseDown = true;
    }
}

export function handleMouseUp(e) {
    if (e.button === 0) {
        mouseDown = false;
    }
}

export function handleInput() {
    // Se il mouse è utilizzato, ignora l'input della tastiera per il movimento
    if (!mouseDown) {
        if (keys["arrowright"] || keys["right"] || keys["d"]) {
            spaceship.dx = spaceship.speed;
        } else if (keys["arrowleft"] || keys["left"] || keys["a"]) {
            spaceship.dx = -spaceship.speed;
        } else {
            spaceship.dx = 0;
        }
    } else {
        // Se il mouse è premuto, ferma il movimento con la tastiera
        spaceship.dx = 0;
    }

    // Sparo con tastiera
    if (keys[" "] || keys["spacebar"] || keys["w"] || keys["arrowup"] || keys["up"]) {
        shoot();
    }

    // Sparo con mouse
    if (mouseDown) {
        shoot();
    }
}
