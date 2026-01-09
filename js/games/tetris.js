

let tetrisActive = false;
let tetrisGrid = [];
let currentPiece = null;
let tetrisScore = 0;
let tetrisLines = 0;
let tetrisInterval;


const TETRIS_ROWS = 20;
const TETRIS_COLS = 10;
const CELL = 25;


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


function startTetris() {
  
  showTetrisRetroScreen();
}


function showTetrisRetroScreen() {
  const gameContent = document.getElementById("game-content");
  gameContent.innerHTML = `
    <div style="
      max-width: 600px;
      margin: 0 auto;
      padding: 30px;
      text-align: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border: 4px solid var(--purple);
      border-radius: 15px;
    ">
      <h2 style="
        font-size: 24px;
        color: var(--purple);
        margin-bottom: 30px;
        text-shadow: 2px 2px 0 #000;
      ">🧱 STREFA SUPER RETRO 🧱</h2>
      
      <div style="
        background: rgba(0,0,0,0.4);
        padding: 25px;
        border-radius: 10px;
        margin-bottom: 25px;
        border: 2px solid var(--purple);
      ">
        <p style="
          font-size: 13px;
          line-height: 1.8;
          color: var(--purple);
          margin-bottom: 20px;
          font-weight: bold;
        ">
          🎮 TRAFIŁEŚ DO KLASYKI! 🎮
        </p>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--white);
          margin-bottom: 15px;
        ">
          Rok 1984. Legendarne klocki.<br/>
          To kultowy TETRIS!
        </p>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--white);
          margin-bottom: 15px;
        ">
          😎 Usiądź wygodnie,<br/>
          <span style="color: var(--purple); font-weight: bold;">ZAGRAJ I SIĘ WYLUZUJ!</span>
        </p>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--white);
        ">
          🧱 Układaj klocki, usuwaj linie<br/>
          i relaksuj się przy retro rytmie!
        </p>
      </div>
      
      <div style="
        background: rgba(147, 51, 234, 0.2);
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 25px;
        border: 2px solid var(--purple);
      ">
        <p style="
          font-size: 9px;
          color: var(--purple);
          margin-bottom: 8px;
        ">
          🕹️ STEROWANIE 🕹️
        </p>
        <p style="
          font-size: 9px;
          color: var(--white);
          line-height: 1.6;
        ">
          ← → Ruch | ↑ Obróć | ↓ Szybszy spadek<br/>
          Wypełniaj rzędy, żeby je usunąć!<br/>
          Im więcej linii, tym lepiej!
        </p>
      </div>
      
      <button id="tetris-retro-start-btn" style="
        font-family: 'Press Start 2P', cursive;
        font-size: 14px;
        padding: 15px 40px;
        background: var(--purple);
        color: var(--white);
        border: 4px solid var(--dark-gray);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 6px 0 #5b21b6;
      "
      onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 0 #5b21b6'"
      onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 0 #5b21b6'"
      onmousedown="this.style.transform='translateY(4px)'; this.style.boxShadow='0 2px 0 #5b21b6'"
      onmouseup="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 0 #5b21b6'"
      >
        ZACZYNAMY!
      </button>
    </div>
  `;

  document
    .getElementById("tetris-retro-start-btn")
    .addEventListener("click", () => {
      
      startTetrisGame();
    });
}


function startTetrisGame() {
  tetrisActive = true;
  tetrisScore = 0;
  tetrisLines = 0;

  
  document.getElementById("game-title").textContent = "PISARIS";
  updateTetrisScore();

  
  tetrisGrid = Array(TETRIS_ROWS)
    .fill(null)
    .map(() => Array(TETRIS_COLS).fill(0));

  
  renderTetrisGrid();

  
  spawnPiece();

  
  document.addEventListener("keydown", handleTetrisKeydown);

  
  tetrisInterval = setInterval(dropPiece, 500);
}


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

  
  if (!canPlacePiece(currentPiece.x, currentPiece.y, currentPiece.shape)) {
    endTetris();
    return;
  }

  drawTetris();
}


function dropPiece() {
  if (!tetrisActive || !currentPiece) return;

  if (canPlacePiece(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
    currentPiece.y++;
  } else {
    
    lockPiece();

    
    clearLines();

    
    spawnPiece();
  }

  drawTetris();
}


function canPlacePiece(x, y, shape) {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const newX = x + col;
        const newY = y + row;

        
        if (newX < 0 || newX >= TETRIS_COLS || newY >= TETRIS_ROWS) {
          return false;
        }

        
        if (newY >= 0 && tetrisGrid[newY][newX]) {
          return false;
        }
      }
    }
  }
  return true;
}


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


function clearLines() {
  let linesCleared = 0;

  for (let row = TETRIS_ROWS - 1; row >= 0; row--) {
    if (tetrisGrid[row].every((cell) => cell !== 0)) {
      
      tetrisGrid.splice(row, 1);
      
      tetrisGrid.unshift(Array(TETRIS_COLS).fill(0));
      linesCleared++;
      row++; 
    }
  }

  if (linesCleared > 0) {
    tetrisLines += linesCleared;
    tetrisScore += linesCleared * 100;
    updateTetrisScore();
    playBeep(880, 0.15);
  }
}


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


function drawTetris() {
  
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


function updateTetrisScore() {
  document.getElementById(
    "game-score"
  ).textContent = `LINIE: ${tetrisLines} | PUNKTY: ${tetrisScore}`;
}


function endTetris() {
  tetrisActive = false;
  clearInterval(tetrisInterval);
  document.removeEventListener("keydown", handleTetrisKeydown);

  
  addCompletedGame("tetris");

  const gameContent = document.getElementById("game-content");

  gameContent.innerHTML = `
        <div style="text-align: center;">
            <h2 style="font-size: 24px; color: var(--red); margin-bottom: 20px;">
                KONIEC GRY
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


function stopTetris() {
  tetrisActive = false;
  if (tetrisInterval) clearInterval(tetrisInterval);
  document.removeEventListener("keydown", handleTetrisKeydown);
}
