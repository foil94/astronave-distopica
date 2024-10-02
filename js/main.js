// js/main.js

import { startGame, pauseGame, handleVisibilityChange } from './game.js';
import { handleKeyDown, handleKeyUp, handleMouseMove, handleMouseDown, handleMouseUp } from './controls.js';
import { submitHighScore, returnToMenu } from './ui.js';
import { resizeCanvas } from './canvas.js';
import {
    menu,
    startBtn,
    exitBtn,
    submitNameBtn,
    returnMenuBtn,
    gameContainer
} from './domElements.js';

// Event listeners per i pulsanti
startBtn.addEventListener("click", startGame);
exitBtn.addEventListener("click", () => {
    alert("Per uscire dal gioco, chiudi la finestra del browser.");
});

// Event listeners per i controlli da tastiera
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

// Event listeners per i controlli del mouse
gameContainer.addEventListener("mousemove", handleMouseMove);
gameContainer.addEventListener("mousedown", handleMouseDown);
gameContainer.addEventListener("mouseup", handleMouseUp);

// Event listener per l'invio del punteggio
submitNameBtn.addEventListener("click", submitHighScore);
returnMenuBtn.addEventListener("click", returnToMenu);

// Inizializzazione
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Event listener per il cambio di visibilità della pagina
document.addEventListener('visibilitychange', handleVisibilityChange);

// Mostra il menu all'avvio
menu.classList.add("active");
