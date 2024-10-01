// js/entities.js

import { canvas, ctx } from './domElements.js';
import { scaleX, scaleY } from './canvas.js';
import { shootSound, explosionSound } from './sound.js';
import { endGame } from './game.js';
import { updateScore } from './ui.js';

export let spaceship;
export let enemies = [];
export let bullets = [];
export let powerUps = [];

export let fireRate = 500; // ms tra gli spari
let lastShotTime = 0;

export function initEntities() {
    spaceship = {
        x: canvas.width / 2,
        y: canvas.height - 70 * scaleY,
        width: 20 * scaleX,
        height: 30 * scaleY,
        speed: 5 * ((scaleX + scaleY) / 2),
        dx: 0,
        shield: false,
        speedBoostActive: false,     // Indica se il power-up di velocità è attivo
        fireRateBoostActive: false,  // Indica se il power-up di frequenza di sparo è attivo
    };
    enemies = [];
    bullets = [];
    powerUps = [];
    fireRate = 500;
    lastShotTime = 0;
    window.score = 0; // Assicurati di resettare il punteggio

    console.log("Entità inizializzate:", {
        spaceship,
        enemies,
        bullets,
        powerUps,
    });
}

export function drawEntities() {
    drawSpaceship();
    drawEnemies();
    drawBullets();
    drawPowerUps();
}

export function updateEntities() {
    updateEnemies();
    updateBullets();
    updatePowerUps();
}

// Disegna l'astronave
function drawSpaceship() {
    ctx.save();  // Salva lo stato corrente del contesto

    // Effetto per il power-up di velocità
    if (spaceship.speedBoostActive) {
        ctx.shadowColor = 'yellow';
        ctx.shadowBlur = 20;
    }

    // Cambia colore per il power-up di frequenza di sparo
    if (spaceship.fireRateBoostActive) {
        ctx.fillStyle = "#ff69b4";  // Colore rosa brillante
    } else {
        ctx.fillStyle = "#38b6ff";  // Colore originale
    }

    // Disegna l'astronave
    ctx.beginPath();
    ctx.moveTo(spaceship.x, spaceship.y);
    ctx.lineTo(spaceship.x - spaceship.width / 2, spaceship.y + spaceship.height);
    ctx.lineTo(spaceship.x + spaceship.width / 2, spaceship.y + spaceship.height);
    ctx.closePath();
    ctx.fill();

    // Disegna lo scudo se attivo
    if (spaceship.shield) {
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 3 * ((scaleX + scaleY) / 2);
        ctx.beginPath();
        ctx.arc(
            spaceship.x,
            spaceship.y + spaceship.height / 2,
            spaceship.width,
            0,
            Math.PI * 2
        );
        ctx.stroke();
    }

    ctx.restore();  // Ripristina lo stato del contesto
}


// Crea un nemico
export function createEnemy() {
    let level = Math.floor(window.score / 100);

    // Definisci il raggio minimo e massimo per i nemici
    let minRadius = 15 * ((scaleX + scaleY) / 2);
    let maxRadius = 30 * ((scaleX + scaleY) / 2);

    // Genera un raggio casuale tra minRadius e maxRadius
    let radius = Math.random() * (maxRadius - minRadius) + minRadius;

    let enemy = {
        x: Math.random() * (canvas.width - 2 * radius) + radius,
        y: -radius * 2,
        radius: radius,
        speed: (2 + level) * ((scaleX + scaleY) / 2),
    };
    enemies.push(enemy);
}


// Aggiorna i nemici
function updateEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;

        // Rimuovi nemici fuori dallo schermo
        if (enemy.y - enemy.radius > canvas.height) {
            enemies.splice(index, 1);
            return;
        }

        // Controlla collisione con l'astronave
        let dx = enemy.x - spaceship.x;
        let dy = enemy.y - (spaceship.y + spaceship.height / 2);
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < enemy.radius + spaceship.width / 2) {
            console.log("Collisione rilevata con il nemico:", enemy);
            if (spaceship.shield) {
                spaceship.shield = false;
                enemies.splice(index, 1);
            } else {
                endGame();
            }
        }
    });
}

// Disegna i nemici
function drawEnemies() {
    enemies.forEach((enemy) => {
        ctx.fillStyle = "#ff4d4d";
        ctx.beginPath();

        let sides = 12; // Numero di lati del dodecagono
        let angle = (Math.PI * 2) / sides;

        for (let i = 0; i < sides; i++) {
            let x = enemy.x + enemy.radius * Math.cos(i * angle - Math.PI / 2);
            let y = enemy.y + enemy.radius * Math.sin(i * angle - Math.PI / 2);

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.closePath();
        ctx.fill();
    });
}

// Spara un proiettile
export function shoot() {
    if (Date.now() - lastShotTime > fireRate) {
        let bulletWidth = 5 * scaleX;
        let bulletHeight = 10 * scaleY;
        let bullet = {
            x: spaceship.x - bulletWidth / 2,
            y: spaceship.y - bulletHeight,
            width: bulletWidth,
            height: bulletHeight,
            speed: 7 * ((scaleX + scaleY) / 2),
        };
        bullets.push(bullet);

        // Riproduci il suono dello sparo
        shootSound.currentTime = 0;
        shootSound.play();

        lastShotTime = Date.now();
    }
}

// Aggiorna i proiettili
function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;

        // Rimuovi proiettili fuori dallo schermo
        if (bullet.y + bullet.height < 0) {
            bullets.splice(index, 1);
            return;
        }

        // Controlla collisione con i nemici
        enemies.forEach((enemy, eIndex) => {
            let dx = enemy.x - (bullet.x + bullet.width / 2);
            let dy = enemy.y - (bullet.y + bullet.height / 2);
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < enemy.radius) {
                // Rimuovi nemico e proiettile
                enemies.splice(eIndex, 1);
                bullets.splice(index, 1);
                // Riproduci il suono dell'esplosione
                explosionSound.currentTime = 0;
                explosionSound.play();
                // Incrementa punteggio
                window.score += 10;
                updateScore(window.score);
                return;
            }
        });
    });
}

// Disegna i proiettili
function drawBullets() {
    bullets.forEach((bullet) => {
        ctx.fillStyle = spaceship.fireRateBoostActive ? "#ff69b4" : "#ffff66";
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}


// Crea un power-up
export function createPowerUp() {
    const types = ["speed", "fireRate", "shield"];
    let powerUp = {
        x: Math.random() * (canvas.width - 20 * scaleX) + 10 * scaleX,
        y: -20 * scaleY,
        width: 20 * scaleX,
        height: 20 * scaleY,
        speed: 2 * ((scaleX + scaleY) / 2),
        type: types[Math.floor(Math.random() * types.length)],
        color: "",
    };

    // Assegna un colore in base al tipo
    if (powerUp.type === "speed") {
        powerUp.color = "yellow";
    } else if (powerUp.type === "fireRate") {
        powerUp.color = "green";
    } else if (powerUp.type === "shield") {
        powerUp.color = "blue";
    }

    powerUps.push(powerUp);
}

// Aggiorna i power-up
function updatePowerUps() {
    powerUps.forEach((powerUp, index) => {
        powerUp.y += powerUp.speed;

        // Rimuovi power-up fuori dallo schermo
        if (powerUp.y > canvas.height) {
            powerUps.splice(index, 1);
            return;
        }

        // Controlla collisione con l'astronave
        let dx = powerUp.x - spaceship.x;
        let dy = powerUp.y - (spaceship.y + spaceship.height / 2);
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < powerUp.width / 2 + spaceship.width / 2) {
            // Applica l'effetto del power-up
            applyPowerUp(powerUp.type);
            powerUps.splice(index, 1);
        }
    });
}

// Disegna i power-up
function drawPowerUps() {
    powerUps.forEach((powerUp) => {
        ctx.fillStyle = powerUp.color;
        ctx.beginPath();
        ctx.arc(powerUp.x, powerUp.y, powerUp.width / 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Applica gli effetti dei power-up
function applyPowerUp(type) {
    if (type === "speed") {
        spaceship.speedBoostActive = true;
        spaceship.speed += 3 * ((scaleX + scaleY) / 2);
        setTimeout(() => {
            spaceship.speed -= 3 * ((scaleX + scaleY) / 2);
            spaceship.speedBoostActive = false;
        }, 5000);
    } else if (type === "fireRate") {
        spaceship.fireRateBoostActive = true;
        fireRate = 200;
        setTimeout(() => {
            fireRate = 500;
            spaceship.fireRateBoostActive = false;
        }, 5000);
    } else if (type === "shield") {
        spaceship.shield = true;
    }
}

