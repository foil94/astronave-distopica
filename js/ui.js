// js/ui.js

import {
    scoreDisplay,
    gameOverScreen,
    nameInputContainer,
    highScoresList,
    finalScoreDisplay,
    playerNameInput,
    menu
} from './domElements.js';

let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

export function updateScore(currentScore) {
    scoreDisplay.textContent = `Punteggio: ${currentScore}`;
}

export function submitHighScore() {
    let name = playerNameInput.value.toUpperCase();

    // Validazione: il nome deve essere di 3 lettere maiuscole (A-Z)
    if (/^[A-Z]{3}$/.test(name)) {
        const newScore = { name: name, score: window.score, timestamp: Date.now() };

        // Verifica se il punteggio esiste già
        const duplicate = highScores.some(
            (entry) => entry.name === newScore.name && entry.score === newScore.score
        );

        if (!duplicate) {
            highScores.push(newScore);

            highScores.sort((a, b) => b.score - a.score || a.timestamp - b.timestamp);

            highScores = highScores.slice(0, 10);

            localStorage.setItem("highScores", JSON.stringify(highScores));
        } else {
            alert("Questo punteggio esiste già nella classifica.");
        }

        nameInputContainer.style.display = "none";

        displayHighScores(newScore, duplicate);
    } else {
        alert("Per favore, inserisci un nome valido di 3 lettere (A-Z).");
    }
}

function displayHighScores(newScore, duplicate) {
    highScoresList.innerHTML = "<h3>Classifica Top 10</h3>";
    const ul = document.createElement("ul");
    ul.style.listStyleType = "none";
    ul.style.padding = "0";

    highScores.forEach((scoreEntry) => {
        const li = document.createElement("li");
        li.style.margin = "5px 0";
        li.style.color = "#fff";
        li.style.fontFamily = "monospace";

        const dots = '.'.repeat(40 - scoreEntry.name.length - scoreEntry.score.toString().length);
        li.textContent = `${scoreEntry.name}${dots}${scoreEntry.score}`;

        // Evidenzia il nuovo punteggio
        if (
            !duplicate &&
            scoreEntry.name === newScore.name &&
            scoreEntry.score === newScore.score &&
            scoreEntry.timestamp === newScore.timestamp
        ) {
            li.style.color = "yellow";
        }

        ul.appendChild(li);
    });

    highScoresList.appendChild(ul);
}

export function returnToMenu() {
    gameOverScreen.classList.remove("active");
    menu.classList.add("active");
    highScoresList.innerHTML = "";
    nameInputContainer.style.display = "none";
    playerNameInput.value = ""; // Resetta il campo di inserimento del nome
}
