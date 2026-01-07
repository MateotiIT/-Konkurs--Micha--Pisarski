// dino.js - Gra: POLSKI YOSHI RUNNER (Chrome Dino style)

let dinoActive = false;
let dinoCanvas;
let dinoCtx;
let dinoAnimationId;

// Gracz (PISARIO)
let dinoPlayer = {
  x: 80,
  y: 0,
  width: 40,
  height: 50,
  velocityY: 0,
  isJumping: false,
  groundY: 300,
};

// Przeszkody
let dinoObstacles = [];
let dinoObstacleTimer = 0;
let dinoObstacleInterval = 100; // Co ile klatek pojawia się przeszkoda

// Gra
let dinoScore = 0;
let dinoGameTime = 0;
let dinoGameFrames = 0;
let dinoSpeed = 5;
let dinoGameOver = false;

// Funkcja startowania gry DINO
function startDino() {
  // Reset zmiennych
  dinoActive = true;
  dinoScore = 0;
  dinoGameTime = 0;
  dinoGameFrames = 0;
  dinoSpeed = 5;
  dinoGameOver = false;
  dinoObstacleTimer = 0;
  dinoObstacles = [];

  dinoPlayer.y = dinoPlayer.groundY;
  dinoPlayer.velocityY = 0;
  dinoPlayer.isJumping = false;

  // Ukryj menu, pokaż grę
  document.getElementById("main-menu").style.display = "none";
  document.getElementById("game-container").style.display = "flex";

  // Ustaw tytuł gry
  document.getElementById("game-title").textContent = "POLSKI YOSHI RUNNER";
  document.getElementById("game-score").textContent = "PUNKTY: 0";

  // Przygotuj canvas
  const gameContent = document.getElementById("game-content");
  gameContent.innerHTML = `
    <canvas id="dino-canvas" width="600" height="400" style="
      background: linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 100%);
      border-radius: 10px;
      display: block;
      margin: 0 auto;
    "></canvas>
  `;

  dinoCanvas = document.getElementById("dino-canvas");
  dinoCtx = dinoCanvas.getContext("2d");

  // Event listenery
  document.addEventListener("keydown", handleDinoKeyDown);
  document.addEventListener("keyup", handleDinoKeyUp);

  // Start pętli gry
  dinoGameLoop();

  playBeep(440, 0.1);
}

// Obsługa klawiszy
let dinoSpacePressed = false;

function handleDinoKeyDown(e) {
  if (!dinoActive || dinoGameOver) return;

  if ((e.key === " " || e.key === "ArrowUp") && !dinoSpacePressed) {
    dinoSpacePressed = true;
    dinoJump();
  }
}

function handleDinoKeyUp(e) {
  if (e.key === " " || e.key === "ArrowUp") {
    dinoSpacePressed = false;
  }
}

// Funkcja skoku
function dinoJump() {
  if (!dinoPlayer.isJumping) {
    dinoPlayer.velocityY = -15;
    dinoPlayer.isJumping = true;
    playBeep(880, 0.05);
  }
}

// Główna pętla gry
function dinoGameLoop() {
  if (!dinoActive) return;

  updateDino();
  drawDino();

  dinoAnimationId = requestAnimationFrame(dinoGameLoop);
}

// Aktualizacja logiki
function updateDino() {
  if (dinoGameOver) return;

  // Liczenie czasu (60 FPS, więc co 60 klatek = 1 sekunda)
  dinoGameFrames++;
  if (dinoGameFrames >= 60) {
    dinoGameFrames = 0;
    dinoGameTime++;
  }

  // Grawitacja
  dinoPlayer.velocityY += 0.8;
  dinoPlayer.y += dinoPlayer.velocityY;

  // Utrzymuj na ziemi
  if (dinoPlayer.y >= dinoPlayer.groundY) {
    dinoPlayer.y = dinoPlayer.groundY;
    dinoPlayer.velocityY = 0;
    dinoPlayer.isJumping = false;
  }

  // Spawn przeszkód
  dinoObstacleTimer++;
  if (dinoObstacleTimer >= dinoObstacleInterval) {
    dinoObstacleTimer = 0;
    spawnObstacle();
  }

  // Poruszaj przeszkodami
  for (let i = dinoObstacles.length - 1; i >= 0; i--) {
    const obs = dinoObstacles[i];
    obs.x -= dinoSpeed;

    // Usuń przeszkody poza ekranem i dodaj punkty
    if (obs.x + obs.width < 0) {
      dinoObstacles.splice(i, 1);
      dinoScore += 10;
      document.getElementById("game-score").textContent =
        "PUNKTY: " + dinoScore;
    }

    // Kolizja
    if (checkCollision(dinoPlayer, obs)) {
      endDino();
      return;
    }
  }

  // Przyspieszanie co 10 sekund
  if (dinoGameTime > 0 && dinoGameTime % 10 === 0 && dinoGameFrames === 0) {
    dinoSpeed += 0.1;
    dinoObstacleInterval = Math.max(60, dinoObstacleInterval - 2);
  }
}

// Spawn przeszkody
function spawnObstacle() {
  const types = ["cactus", "bird"];
  const type = types[Math.floor(Math.random() * types.length)];

  const obstacle = {
    x: 600,
    width: 30,
    height: type === "cactus" ? 40 : 30,
    y: type === "cactus" ? dinoPlayer.groundY + 10 : dinoPlayer.groundY - 50,
    type: type,
  };

  dinoObstacles.push(obstacle);
}

// Sprawdzanie kolizji
function checkCollision(player, obstacle) {
  return (
    player.x < obstacle.x + obstacle.width &&
    player.x + player.width > obstacle.x &&
    player.y < obstacle.y + obstacle.height &&
    player.y + player.height > obstacle.y
  );
}

// Rysowanie
function drawDino() {
  // Wyczyść canvas
  dinoCtx.fillStyle = "#87CEEB";
  dinoCtx.fillRect(0, 0, 600, 400);

  // Niebo
  const gradient = dinoCtx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "#87CEEB");
  gradient.addColorStop(1, "#E0F6FF");
  dinoCtx.fillStyle = gradient;
  dinoCtx.fillRect(0, 0, 600, 400);

  // Ziemia
  dinoCtx.fillStyle = "#8B7355";
  dinoCtx.fillRect(0, dinoPlayer.groundY + dinoPlayer.height, 600, 50);

  // Linia ziemi
  dinoCtx.strokeStyle = "#654321";
  dinoCtx.lineWidth = 3;
  dinoCtx.beginPath();
  dinoCtx.moveTo(0, dinoPlayer.groundY + dinoPlayer.height);
  dinoCtx.lineTo(600, dinoPlayer.groundY + dinoPlayer.height);
  dinoCtx.stroke();

  // Rysuj gracza (PISARIO)
  drawPlayer();

  // Rysuj przeszkody
  dinoObstacles.forEach((obs) => {
    if (obs.type === "cactus") {
      // Goomba (grzyb) - brązowy wróg z Mario
      dinoCtx.fillStyle = "#8B4513";
      dinoCtx.fillRect(obs.x, obs.y, obs.width, obs.height);

      // Oczy - białe tło
      dinoCtx.fillStyle = "#FFF";
      dinoCtx.fillRect(obs.x + 5, obs.y + 8, 8, 8);
      dinoCtx.fillRect(obs.x + 17, obs.y + 8, 8, 8);

      // Źrenice - czarne
      dinoCtx.fillStyle = "#000";
      dinoCtx.fillRect(obs.x + 7, obs.y + 10, 4, 4);
      dinoCtx.fillRect(obs.x + 19, obs.y + 10, 4, 4);
    } else {
      // Blok z pytajnikiem - żółty (mystery box z Mario)
      dinoCtx.fillStyle = "#F5B800";
      dinoCtx.fillRect(obs.x, obs.y, obs.width, obs.height);

      // Obramowanie
      dinoCtx.strokeStyle = "#D89000";
      dinoCtx.lineWidth = 3;
      dinoCtx.strokeRect(obs.x, obs.y, obs.width, obs.height);

      // Znak pytajnika
      dinoCtx.fillStyle = "#FFF";
      dinoCtx.font = "bold 20px Arial";
      dinoCtx.textAlign = "center";
      dinoCtx.textBaseline = "middle";
      dinoCtx.fillText("?", obs.x + obs.width / 2, obs.y + obs.height / 2);
      dinoCtx.textAlign = "left";
      dinoCtx.textBaseline = "alphabetic";
    }
  });

  // Instrukcja (jeśli początek gry)
  if (dinoScore === 0 && !dinoGameOver) {
    dinoCtx.fillStyle = "rgba(0, 0, 0, 0.7)";
    dinoCtx.font = "12px 'Press Start 2P'";
    dinoCtx.textAlign = "center";
    dinoCtx.fillText("SPACJA / ↑ = SKOK", 300, 50);
    dinoCtx.textAlign = "left";
  }
}

// Rysowanie gracza (Yoshi)
function drawPlayer() {
  const legOffset = Math.floor(Date.now() / 100) % 2 === 0 ? 2 : -2;

  // Ciało - zielone (główna część)
  dinoCtx.fillStyle = "#6ABF40";
  dinoCtx.fillRect(dinoPlayer.x + 8, dinoPlayer.y + 10, 24, 28);

  // Brzuch - biały
  dinoCtx.fillStyle = "#FFFFFF";
  dinoCtx.fillRect(dinoPlayer.x + 12, dinoPlayer.y + 18, 16, 16);

  // Głowa - zielona
  dinoCtx.fillStyle = "#6ABF40";
  dinoCtx.fillRect(dinoPlayer.x + 14, dinoPlayer.y, 20, 16);

  // Nos - duży okrągły (pomarańczowy) - po prawej stronie
  dinoCtx.fillStyle = "#FF8C00";
  dinoCtx.beginPath();
  dinoCtx.arc(dinoPlayer.x + 36, dinoPlayer.y + 8, 6, 0, Math.PI * 2);
  dinoCtx.fill();

  // Grzbiet - kolce/łuski (ciemnozielone)
  dinoCtx.fillStyle = "#4A9930";
  for (let i = 0; i < 4; i++) {
    dinoCtx.fillRect(dinoPlayer.x + 10 + i * 5, dinoPlayer.y + 8, 4, 4);
  }

  // Oczy - duże białe (przesunięte w prawo)
  dinoCtx.fillStyle = "#FFFFFF";
  dinoCtx.beginPath();
  dinoCtx.arc(dinoPlayer.x + 20, dinoPlayer.y + 6, 4, 0, Math.PI * 2);
  dinoCtx.fill();
  dinoCtx.beginPath();
  dinoCtx.arc(dinoPlayer.x + 26, dinoPlayer.y + 6, 4, 0, Math.PI * 2);
  dinoCtx.fill();

  // Źrenice - czarne (przesunięte w prawo, patrzą do przodu)
  dinoCtx.fillStyle = "#000000";
  dinoCtx.beginPath();
  dinoCtx.arc(dinoPlayer.x + 21, dinoPlayer.y + 6, 2, 0, Math.PI * 2);
  dinoCtx.fill();
  dinoCtx.beginPath();
  dinoCtx.arc(dinoPlayer.x + 27, dinoPlayer.y + 6, 2, 0, Math.PI * 2);
  dinoCtx.fill();

  // Siodełko - czerwone
  dinoCtx.fillStyle = "#E60012";
  dinoCtx.fillRect(dinoPlayer.x + 10, dinoPlayer.y + 14, 18, 6);

  // Nogi - zielone (z animacją biegu)
  dinoCtx.fillStyle = "#6ABF40";
  // Lewa noga
  dinoCtx.fillRect(dinoPlayer.x + 10, dinoPlayer.y + 34 + legOffset, 8, 12);
  // Prawa noga
  dinoCtx.fillRect(dinoPlayer.x + 22, dinoPlayer.y + 34 - legOffset, 8, 12);

  // Buty - czerwone
  dinoCtx.fillStyle = "#E60012";
  // Lewy but
  dinoCtx.fillRect(dinoPlayer.x + 8, dinoPlayer.y + 44 + legOffset, 12, 4);
  // Prawy but
  dinoCtx.fillRect(dinoPlayer.x + 20, dinoPlayer.y + 44 - legOffset, 12, 4);
}

// Koniec gry
function endDino() {
  dinoGameOver = true;
  dinoActive = false;

  playDeathSound();

  const gameContent = document.getElementById("game-content");
  gameContent.innerHTML = `
    <div style="text-align: center;">
      <h2 style="font-size: 24px; color: var(--red); margin-bottom: 20px;">
        💀 KONIEC GRY 💀
      </h2>
      <p style="font-size: 14px; color: var(--dark-gray); margin-bottom: 15px;">
        Yoshi wpadł na przeszkodę!
      </p>
      <div style="font-size: 48px; margin: 20px 0;">
        😵
      </div>
      <p style="font-size: 16px; color: var(--blue); margin-bottom: 10px; font-weight: bold;">
        PUNKTY: ${dinoScore}
      </p>
      <p style="font-size: 12px; color: var(--gray); margin-bottom: 20px;">
        Przetrwałeś ${dinoGameTime} sekund!
      </p>
      <button class="btn-play" onclick="startDino()">ZAGRAJ PONOWNIE</button>
    </div>
  `;
}

// Funkcja zatrzymania gry
function stopDino() {
  dinoActive = false;

  if (dinoAnimationId) {
    cancelAnimationFrame(dinoAnimationId);
  }

  document.removeEventListener("keydown", handleDinoKeyDown);
  document.removeEventListener("keyup", handleDinoKeyUp);

  dinoSpacePressed = false;
}
