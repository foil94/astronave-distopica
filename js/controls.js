// js/controls.js

import { spaceship, shoot } from './entities.js';
import { pauseGame } from './game.js';

let keys = {};

export function handleKeyDown(e) {
    keys[e.key.toLowerCase()] = true;
    if (e.key === "p" || e.key === "P") {
        pauseGame();
    }
}

export function handleKeyUp(e) {
    keys[e.key.toLowerCase()] = false;
}

export function handleInput() {
    // Movimento
    if (keys["arrowright"] || keys["right"] || keys["d"]) {
        spaceship.dx = spaceship.speed;
    } else if (keys["arrowleft"] || keys["left"] || keys["a"]) {
        spaceship.dx = -spaceship.speed;
    } else {
        spaceship.dx = 0;
    }

    // Sparo
    if (keys[" "] || keys["spacebar"] || keys["w"] || keys["arrowup"] || keys["up"]) {
        shoot();
    }
}
