// pacman.js - Gra: PISACMAN (Pacman)

let pacmanActive = false;
let pacmanCanvas;
let pacmanCtx;
let pacmanAnimationId;

// Rozmiary
const CELL_SIZE = 25;
const GRID_WIDTH = 15;
const GRID_HEIGHT = 15;

// Gracz
let player = {
  x: 1,
  y: 1,
  direction: "right",
  nextDirection: "right",
};

// Duchy
let ghosts = [
  { x: 13, y: 1, color: "#FF1493", name: "Hejter" },
  { x: 13, y: 13, color: "#00CED1", name: "Troll" },
  { x: 1, y: 13, color: "#FF4500", name: "Bug" },
];

// Mapa (0=puste, 1=ściana, 2=kropka)
let pacmanGrid = [];
let totalDots = 0;
let dotsCollected = 0;
let pacmanScore = 0;
let pacmanDeaths = 0;

// Timer
let gameLoopInterval;
let ghostMoveInterval;

// Funkcja startowania Pacman
function startPacman() {
  pacmanActive = true;
  pacmanDeaths = 0;
  pacmanScore = 0;
  dotsCollected = 0;

  // Ustaw tytuł gry
  document.getElementById("game-title").textContent = "PISACMAN";
  document.getElementById("game-score").textContent = "WYNIK: 0";

  // Stwórz canvas
  const gameContent = document.getElementById("game-content");
  gameContent.innerHTML = `
        <canvas id="pacman-canvas" width="${GRID_WIDTH * CELL_SIZE}" height="${
    GRID_HEIGHT * CELL_SIZE
  }" 
                style="border: 4px solid var(--dark-gray); border-radius: 10px; background: black;">
        </canvas>
    `;

  pacmanCanvas = document.getElementById("pacman-canvas");
  pacmanCtx = pacmanCanvas.getContext("2d");

  // Inicjalizuj mapę
  initPacmanGrid();

  // Reset gracza i duchów
  player = { x: 1, y: 1, direction: "right", nextDirection: "right" };
  ghosts = [
    { x: 13, y: 1, color: "#FF1493", name: "Hejter" },
    { x: 13, y: 13, color: "#00CED1", name: "Troll" },
    { x: 1, y: 13, color: "#FF4500", name: "Bug" },
  ];

  // Sterowanie
  document.addEventListener("keydown", handlePacmanKeydown);

  // Start pętli gry
  gameLoopInterval = setInterval(gamePacmanLoop, 150);
  ghostMoveInterval = setInterval(moveGhosts, 300);
}

// Funkcja inicjalizacji siatki
function initPacmanGrid() {
  pacmanGrid = [];
  totalDots = 0;

  // Prosty labirynt
  const template = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  for (let y = 0; y < GRID_HEIGHT; y++) {
    pacmanGrid[y] = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      pacmanGrid[y][x] = template[y][x];
      if (template[y][x] === 2) totalDots++;
    }
  }
}

// Funkcja pętli gry
function gamePacmanLoop() {
  if (!pacmanActive) return;

  // Ruch gracza
  movePlayer();

  // Sprawdź kolizje
  checkCollisions();

  // Rysuj
  drawPacman();
}

// Funkcja ruchu gracza
function movePlayer() {
  // Spróbuj zmienić kierunek
  const nextX = player.x + getDirX(player.nextDirection);
  const nextY = player.y + getDirY(player.nextDirection);

  if (pacmanGrid[nextY] && pacmanGrid[nextY][nextX] !== 1) {
    player.direction = player.nextDirection;
  }

  // Ruch w aktualnym kierunku
  const newX = player.x + getDirX(player.direction);
  const newY = player.y + getDirY(player.direction);

  // Sprawdź ścianę
  if (pacmanGrid[newY] && pacmanGrid[newY][newX] !== 1) {
    player.x = newX;
    player.y = newY;
  }
}

// Funkcja kierunku X
function getDirX(dir) {
  if (dir === "left") return -1;
  if (dir === "right") return 1;
  return 0;
}

// Funkcja kierunku Y
function getDirY(dir) {
  if (dir === "up") return -1;
  if (dir === "down") return 1;
  return 0;
}

// Funkcja sterowania
function handlePacmanKeydown(e) {
  if (!pacmanActive) return;

  if (e.key === "ArrowUp") {
    player.nextDirection = "up";
    e.preventDefault();
  } else if (e.key === "ArrowDown") {
    player.nextDirection = "down";
    e.preventDefault();
  } else if (e.key === "ArrowLeft") {
    player.nextDirection = "left";
    e.preventDefault();
  } else if (e.key === "ArrowRight") {
    player.nextDirection = "right";
    e.preventDefault();
  }
}

// Funkcja ruchu duchów (prosta AI)
function moveGhosts() {
  if (!pacmanActive) return;

  ghosts.forEach((ghost) => {
    // Prosty ruch losowy
    const directions = ["up", "down", "left", "right"];
    const randomDir = directions[Math.floor(Math.random() * directions.length)];

    const newX = ghost.x + getDirX(randomDir);
    const newY = ghost.y + getDirY(randomDir);

    // Sprawdź ścianę
    if (pacmanGrid[newY] && pacmanGrid[newY][newX] !== 1) {
      ghost.x = newX;
      ghost.y = newY;
    }
  });
}

// Funkcja sprawdzania kolizji
function checkCollisions() {
  // Kropka
  if (pacmanGrid[player.y][player.x] === 2) {
    pacmanGrid[player.y][player.x] = 0;
    dotsCollected++;
    pacmanScore += 10;
    document.getElementById("game-score").textContent = "WYNIK: " + pacmanScore;
    playBeep(440, 0.05);

    // Sprawdź czy zebrane wszystkie kropki
    if (dotsCollected >= totalDots) {
      endPacman(true);
    }
  }

  // Duch
  ghosts.forEach((ghost) => {
    if (ghost.x === player.x && ghost.y === player.y) {
      pacmanDeaths++;
      playDeathSound();
      endPacman(false);
    }
  });
}

// Funkcja rysowania
function drawPacman() {
  // Wyczyść canvas
  pacmanCtx.fillStyle = "black";
  pacmanCtx.fillRect(0, 0, pacmanCanvas.width, pacmanCanvas.height);

  // Rysuj siatkę
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      if (pacmanGrid[y][x] === 1) {
        // Ściana
        pacmanCtx.fillStyle = "#0095DA";
        pacmanCtx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      } else if (pacmanGrid[y][x] === 2) {
        // Kropka
        pacmanCtx.fillStyle = "white";
        pacmanCtx.beginPath();
        pacmanCtx.arc(
          x * CELL_SIZE + CELL_SIZE / 2,
          y * CELL_SIZE + CELL_SIZE / 2,
          3,
          0,
          Math.PI * 2
        );
        pacmanCtx.fill();
      }
    }
  }

  // Rysuj Pacmana
  pacmanCtx.fillStyle = "#FFED00";
  pacmanCtx.beginPath();
  pacmanCtx.arc(
    player.x * CELL_SIZE + CELL_SIZE / 2,
    player.y * CELL_SIZE + CELL_SIZE / 2,
    CELL_SIZE / 2 - 2,
    0.2 * Math.PI,
    1.8 * Math.PI
  );
  pacmanCtx.lineTo(
    player.x * CELL_SIZE + CELL_SIZE / 2,
    player.y * CELL_SIZE + CELL_SIZE / 2
  );
  pacmanCtx.fill();

  // Rysuj duchy
  ghosts.forEach((ghost) => {
    pacmanCtx.fillStyle = ghost.color;
    pacmanCtx.beginPath();
    pacmanCtx.arc(
      ghost.x * CELL_SIZE + CELL_SIZE / 2,
      ghost.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      Math.PI,
      0
    );
    pacmanCtx.lineTo(
      ghost.x * CELL_SIZE + CELL_SIZE - 2,
      ghost.y * CELL_SIZE + CELL_SIZE - 2
    );
    pacmanCtx.lineTo(
      ghost.x * CELL_SIZE + CELL_SIZE / 2,
      ghost.y * CELL_SIZE + CELL_SIZE / 2 + 5
    );
    pacmanCtx.lineTo(
      ghost.x * CELL_SIZE + 2,
      ghost.y * CELL_SIZE + CELL_SIZE - 2
    );
    pacmanCtx.fill();
  });
}

// Funkcja końca Pacman
function endPacman(won) {
  pacmanActive = false;
  clearInterval(gameLoopInterval);
  clearInterval(ghostMoveInterval);
  document.removeEventListener("keydown", handlePacmanKeydown);

  const gameContent = document.getElementById("game-content");

  if (won) {
    gameContent.innerHTML = `
            <div style="text-align: center;">
                <h2 style="font-size: 24px; color: var(--green); margin-bottom: 20px;">
                    🎉 WYGRANA! 🎉
                </h2>
                <p style="font-size: 14px; color: var(--dark-gray); margin-bottom: 15px;">
                    Zebrałeś wszystkie kropki!
                </p>
                <p style="font-size: 12px; color: var(--blue); margin-bottom: 20px;">
                    WYNIK: ${pacmanScore}
                </p>
                <button class="btn-play" onclick="startPacman()">ZAGRAJ PONOWNIE</button>
            </div>
        `;

    // Zapisz wynik
    saveScore("pacman_best", pacmanScore);

    // Dodaj do ukończonych gier
    addCompletedGame("pacman");

    // Odblokuj osiągnięcie
    unlockAchievement("pisacman_master");

    // Sprawdź osiągnięcie PERFEKCJONISTA (bez śmierci)
    if (pacmanDeaths === 0) {
      unlockAchievement("perfekcjonista");
    }

    playWinSound();
  } else {
    gameContent.innerHTML = `
            <div style="text-align: center;">
                <h2 style="font-size: 24px; color: var(--red); margin-bottom: 20px;">
                    💀 PRZEGRANA 💀
                </h2>
                <p style="font-size: 14px; color: var(--dark-gray); margin-bottom: 15px;">
                    Złapał Cię duch!
                </p>
                <p style="font-size: 12px; color: var(--blue); margin-bottom: 20px;">
                    WYNIK: ${pacmanScore}
                </p>
                <button class="btn-play" onclick="startPacman()">SPRÓBUJ PONOWNIE</button>
            </div>
        `;
  }
}

// Funkcja zatrzymania Pacman
function stopPacman() {
  pacmanActive = false;
  if (gameLoopInterval) clearInterval(gameLoopInterval);
  if (ghostMoveInterval) clearInterval(ghostMoveInterval);
  document.removeEventListener("keydown", handlePacmanKeydown);
}
