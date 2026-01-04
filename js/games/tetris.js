// tetris.js - Gra: PISARIS (Tetris)

let tetrisActive = false;
let tetrisGrid = [];
let currentPiece = null;
let tetrisScore = 0;
let tetrisLines = 0;
let tetrisInterval;

// Wymiary
const TETRIS_ROWS = 20;
const TETRIS_COLS = 10;
const CELL = 25;

// Klocki (kształty)
const PIECES = {
  I: { shape: [[1, 1, 1, 1]], color: "#00CED1" },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "#FFED00",
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: "#8B4C98",
  },
  L: {
    shape: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    color: "#FF8C00",
  },
  J: {
    shape: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    color: "#0095DA",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: "#00A651",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: "#E60012",
  },
};

const PIECE_TYPES = ["I", "O", "T", "L", "J", "S", "Z"];

// Funkcja startowania Tetris
function startTetris() {
  tetrisActive = true;
  tetrisScore = 0;
  tetrisLines = 0;

  // Ustaw tytuł gry
  document.getElementById("game-title").textContent = "PISARIS";
  updateTetrisScore();

  // Inicjalizuj grid
  tetrisGrid = Array(TETRIS_ROWS)
    .fill(null)
    .map(() => Array(TETRIS_COLS).fill(0));

  // Renderuj grid
  renderTetrisGrid();

  // Spawn pierwszego klocka
  spawnPiece();

  // Sterowanie
  document.addEventListener("keydown", handleTetrisKeydown);

  // Start pętli spadania
  tetrisInterval = setInterval(dropPiece, 500);
}

// Funkcja renderowania gridu (div-grid)
function renderTetrisGrid() {
  const gameContent = document.getElementById("game-content");

  gameContent.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center;">
            <div id="tetris-grid" style="
                display: grid;
                grid-template-columns: repeat(${TETRIS_COLS}, ${CELL}px);
                grid-template-rows: repeat(${TETRIS_ROWS}, ${CELL}px);
                gap: 1px;
                background: var(--dark-gray);
                padding: 2px;
                border-radius: 10px;
            ">
                ${Array(TETRIS_ROWS * TETRIS_COLS)
                  .fill(0)
                  .map(
                    (_, i) => `
                    <div class="tetris-cell" data-row="${Math.floor(
                      i / TETRIS_COLS
                    )}" data-col="${i % TETRIS_COLS}" 
                         style="width: ${CELL}px; height: ${CELL}px; background: var(--white);"></div>
                `
                  )
                  .join("")}
            </div>
            <p style="margin-top: 10px; font-size: 8px; color: var(--gray);">
                ← →: ruch | ↑: obrót | ↓: przyśpieszenie
            </p>
        </div>
    `;
}

// Funkcja spawnowania nowego klocka
function spawnPiece() {
  const randomType =
    PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
  const pieceData = PIECES[randomType];

  currentPiece = {
    shape: pieceData.shape,
    color: pieceData.color,
    x: Math.floor(TETRIS_COLS / 2) - 1,
    y: 0,
  };

  // Sprawdź czy można umieścić klocek (game over jeśli nie)
  if (!canPlacePiece(currentPiece.x, currentPiece.y, currentPiece.shape)) {
    endTetris();
    return;
  }

  drawTetris();
}

// Funkcja spadania klocka
function dropPiece() {
  if (!tetrisActive || !currentPiece) return;

  if (canPlacePiece(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
    currentPiece.y++;
  } else {
    // Zablokuj klocek
    lockPiece();

    // Usuń pełne linie
    clearLines();

    // Spawn nowego klocka
    spawnPiece();
  }

  drawTetris();
}

// Funkcja sprawdzania czy można umieścić klocek
function canPlacePiece(x, y, shape) {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const newX = x + col;
        const newY = y + row;

        // Sprawdź granice
        if (newX < 0 || newX >= TETRIS_COLS || newY >= TETRIS_ROWS) {
          return false;
        }

        // Sprawdź kolizję z innymi klockami (jeśli Y >= 0)
        if (newY >= 0 && tetrisGrid[newY][newX]) {
          return false;
        }
      }
    }
  }
  return true;
}

// Funkcja zablokowania klocka w gridzie
function lockPiece() {
  for (let row = 0; row < currentPiece.shape.length; row++) {
    for (let col = 0; col < currentPiece.shape[row].length; col++) {
      if (currentPiece.shape[row][col]) {
        const x = currentPiece.x + col;
        const y = currentPiece.y + row;
        if (y >= 0) {
          tetrisGrid[y][x] = currentPiece.color;
        }
      }
    }
  }

  playBeep(440, 0.05);
}

// Funkcja usuwania pełnych linii
function clearLines() {
  let linesCleared = 0;

  for (let row = TETRIS_ROWS - 1; row >= 0; row--) {
    if (tetrisGrid[row].every((cell) => cell !== 0)) {
      // Usuń linię
      tetrisGrid.splice(row, 1);
      // Dodaj pustą linię na górze
      tetrisGrid.unshift(Array(TETRIS_COLS).fill(0));
      linesCleared++;
      row++; // Sprawdź tę samą linię ponownie
    }
  }

  if (linesCleared > 0) {
    tetrisLines += linesCleared;
    tetrisScore += linesCleared * 100;
    updateTetrisScore();
    playBeep(880, 0.15);

    // Sprawdź osiągnięcia
    checkTetrisAchievements();
  }
}

// Funkcja sprawdzania osiągnięć
function checkTetrisAchievements() {
  const data = loadData();

  // Zapisz najlepszy wynik linii
  saveScore("tetris_lines", tetrisLines);

  // PISARIS MASTER (10 linii)
  if (tetrisLines >= 10 && !data.achievements.pisaris_master) {
    unlockAchievement("pisaris_master");
  }

  // LEGENDA PISARIS (50 linii)
  if (tetrisLines >= 50 && !data.achievements.legenda_pisaris) {
    unlockAchievement("legenda_pisaris");
  }
}

// Funkcja obrotu klocka
function rotatePiece() {
  const newShape = currentPiece.shape[0].map((_, i) =>
    currentPiece.shape.map((row) => row[i]).reverse()
  );

  if (canPlacePiece(currentPiece.x, currentPiece.y, newShape)) {
    currentPiece.shape = newShape;
    drawTetris();
    playBeep(550, 0.05);
  }
}

// Funkcja sterowania
function handleTetrisKeydown(e) {
  if (!tetrisActive || !currentPiece) return;

  if (e.key === "ArrowLeft") {
    if (canPlacePiece(currentPiece.x - 1, currentPiece.y, currentPiece.shape)) {
      currentPiece.x--;
      drawTetris();
    }
    e.preventDefault();
  } else if (e.key === "ArrowRight") {
    if (canPlacePiece(currentPiece.x + 1, currentPiece.y, currentPiece.shape)) {
      currentPiece.x++;
      drawTetris();
    }
    e.preventDefault();
  } else if (e.key === "ArrowDown") {
    if (canPlacePiece(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
      currentPiece.y++;
      drawTetris();
    }
    e.preventDefault();
  } else if (e.key === "ArrowUp") {
    rotatePiece();
    e.preventDefault();
  }
}

// Funkcja rysowania
function drawTetris() {
  // Wyczyść grid
  const cells = document.querySelectorAll(".tetris-cell");
  cells.forEach((cell) => {
    const row = parseInt(cell.getAttribute("data-row"));
    const col = parseInt(cell.getAttribute("data-col"));

    if (tetrisGrid[row][col]) {
      cell.style.background = tetrisGrid[row][col];
    } else {
      cell.style.background = "var(--white)";
    }
  });

  // Rysuj aktualny klocek
  if (currentPiece) {
    for (let row = 0; row < currentPiece.shape.length; row++) {
      for (let col = 0; col < currentPiece.shape[row].length; col++) {
        if (currentPiece.shape[row][col]) {
          const x = currentPiece.x + col;
          const y = currentPiece.y + row;

          if (y >= 0 && y < TETRIS_ROWS && x >= 0 && x < TETRIS_COLS) {
            const cellIndex = y * TETRIS_COLS + x;
            cells[cellIndex].style.background = currentPiece.color;
          }
        }
      }
    }
  }
}

// Funkcja aktualizacji wyniku
function updateTetrisScore() {
  document.getElementById(
    "game-score"
  ).textContent = `LINIE: ${tetrisLines} | WYNIK: ${tetrisScore}`;
}

// Funkcja końca Tetris
function endTetris() {
  tetrisActive = false;
  clearInterval(tetrisInterval);
  document.removeEventListener("keydown", handleTetrisKeydown);

  const gameContent = document.getElementById("game-content");

  gameContent.innerHTML = `
        <div style="text-align: center;">
            <h2 style="font-size: 24px; color: var(--red); margin-bottom: 20px;">
                GAME OVER
            </h2>
            <p style="font-size: 14px; color: var(--dark-gray); margin-bottom: 10px;">
                LINIE: ${tetrisLines}
            </p>
            <p style="font-size: 12px; color: var(--blue); margin-bottom: 20px;">
                WYNIK: ${tetrisScore}
            </p>
            <button class="btn-play" onclick="startTetris()">ZAGRAJ PONOWNIE</button>
        </div>
    `;

  playDeathSound();
}

// Funkcja zatrzymania Tetris
function stopTetris() {
  tetrisActive = false;
  if (tetrisInterval) clearInterval(tetrisInterval);
  document.removeEventListener("keydown", handleTetrisKeydown);
}
