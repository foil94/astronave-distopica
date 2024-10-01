// js/game.js

import {
    canvas,
    ctx,
    menu,
    gameContainer,
    gameOverScreen,
    finalScoreDisplay,
    nameInputContainer,
    playerNameInput,
    pauseMessage
} from './domElements.js';
import { resizeCanvas } from './canvas.js';
import { initEntities, drawEntities, updateEntities, spaceship } from './entities.js';
import { handleInput } from './controls.js';
import { updateScore } from './ui.js';
import { createEnemy, createPowerUp } from './entities.js';

export let isPaused = false;
let enemyInterval;
let powerUpInterval;
let animationFrameId;

export function startGame() {
    menu.classList.remove("active");
    gameOverScreen.classList.remove("active");
    gameContainer.classList.add("active");

    // Resetta il campo di inserimento del nome
    playerNameInput.value = "";
    nameInputContainer.style.display = "none";
    
    isPaused = false; // Assicurati che il gioco non sia in pausa
    pauseMessage.style.display = "none"; // Nascondi il messaggio di pausa

    init();
    enemyInterval = setInterval(createEnemy, 1000);
    powerUpInterval = setInterval(createPowerUp, 5000);
    update();
}

function init() {
    resizeCanvas();
    initEntities();
    window.score = 0;
    updateScore(window.score);
}

export function endGame() {
    cancelAnimationFrame(animationFrameId);
    clearInterval(enemyInterval);
    clearInterval(powerUpInterval);

    gameContainer.classList.remove("active");
    gameOverScreen.classList.add("active");

    finalScoreDisplay.textContent = `Punteggio: ${window.score}`;
    nameInputContainer.style.display = "block";
    playerNameInput.value = "";
    playerNameInput.focus();
}

function update() {
    handleInput();

    // Pulisci il canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Muovi l'astronave
    spaceship.x += spaceship.dx;

    // Impedisci all'astronave di uscire dai bordi
    if (spaceship.x - spaceship.width / 2 < 0) {
        spaceship.x = spaceship.width / 2;
    }

    if (spaceship.x + spaceship.width / 2 > canvas.width) {
        spaceship.x = canvas.width - spaceship.width / 2;
    }

    // Aggiorna e disegna le entità
    updateEntities();
    drawEntities();

    if (!isPaused) {
        animationFrameId = requestAnimationFrame(update);
    }
}

export function pauseGame() {
    if (!isPaused) {
        isPaused = true;
        cancelAnimationFrame(animationFrameId);
        clearInterval(enemyInterval);
        pauseMessage.style.display = "block";
    } else {
        isPaused = false;
        enemyInterval = setInterval(createEnemy, 1000);
        pauseMessage.style.display = "none";
        update();
    }
}

export function handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
        if (!isPaused) {
            pauseGame();
        }
    }
}
