

let pacmanActive = false;
let pacmanCanvas;
let pacmanCtx;
let pacmanAnimationId;


const CELL_SIZE = 25;
const GRID_WIDTH = 15;
const GRID_HEIGHT = 15;


let player = {
  x: 1,
  y: 1,
  direction: "right",
  nextDirection: "right",
};


let ghosts = [
  { x: 13, y: 1, color: "#FF1493", name: "Hejter" },
  { x: 13, y: 13, color: "#00CED1", name: "Troll" },
  { x: 1, y: 13, color: "#FF4500", name: "Bug" },
];


let pacmanGrid = [];
let totalDots = 0;
let dotsCollected = 0;
let pacmanScore = 0;
let pacmanDeaths = 0;


let gameLoopInterval;
let ghostMoveInterval;


function startPacman() {
  
  showPacmanRetroScreen();
}


function showPacmanRetroScreen() {
  const gameContent = document.getElementById("game-content");
  gameContent.innerHTML = `
    <div style="
      max-width: 600px;
      margin: 0 auto;
      padding: 30px;
      text-align: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border: 4px solid var(--blue);
      border-radius: 15px;
    ">
      <h2 style="
        font-size: 24px;
        color: var(--blue);
        margin-bottom: 30px;
        text-shadow: 2px 2px 0 #000;
      ">🟡 STREFA SUPER RETRO 🟡</h2>
      
      <div style="
        background: rgba(0,0,0,0.4);
        padding: 25px;
        border-radius: 10px;
        margin-bottom: 25px;
        border: 2px solid var(--yellow);
      ">
        <p style="
          font-size: 13px;
          line-height: 1.8;
          color: var(--yellow);
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
          Rok 1980. Złota era arkadówek.<br/>
          To legendarny PACMAN!
        </p>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--white);
          margin-bottom: 15px;
        ">
          😎 Usiądź wygodnie,<br/>
          <span style="color: var(--yellow); font-weight: bold;">ZAGRAJ I SIĘ WYLUZUJ!</span>
        </p>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--white);
        ">
          🟡 Zbieraj kropki, unikaj duchów<br/>
          i ciesz się czystym retro klimatem!
        </p>
      </div>
      
      <div style="
        background: rgba(0, 149, 218, 0.2);
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 25px;
        border: 2px solid var(--blue);
      ">
        <p style="
          font-size: 9px;
          color: var(--blue);
          margin-bottom: 8px;
        ">
          🕹️ STEROWANIE 🕹️
        </p>
        <p style="
          font-size: 9px;
          color: var(--white);
          line-height: 1.6;
        ">
          Strzałki: ← → ↑ ↓<br/>
          Zbierz wszystkie kropki!<br/>
          Unikaj kolorowych duchów!
        </p>
      </div>
      
      <button id="pacman-retro-start-btn" style="
        font-family: 'Press Start 2P', cursive;
        font-size: 14px;
        padding: 15px 40px;
        background: var(--blue);
        color: var(--white);
        border: 4px solid var(--dark-gray);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 6px 0 #004a7f;
      "
      onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 0 #004a7f'"
      onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 0 #004a7f'"
      onmousedown="this.style.transform='translateY(4px)'; this.style.boxShadow='0 2px 0 #004a7f'"
      onmouseup="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 0 #004a7f'"
      >
        WAKKA WAKKA!
      </button>
    </div>
  `;

  document
    .getElementById("pacman-retro-start-btn")
    .addEventListener("click", () => {
      
      startPacmanGame();
    });
}


function startPacmanGame() {
  pacmanActive = true;
  pacmanDeaths = 0;
  pacmanScore = 0;
  dotsCollected = 0;

  
  document.getElementById("game-title").textContent = "PISACMAN";
  document.getElementById("game-score").textContent = "PUNKTY: 0";

  
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

  
  initPacmanGrid();

  
  player = { x: 1, y: 1, direction: "right", nextDirection: "right" };
  ghosts = [
    { x: 13, y: 1, color: "#FF1493", name: "Hejter" },
    { x: 13, y: 13, color: "#00CED1", name: "Troll" },
    { x: 1, y: 13, color: "#FF4500", name: "Bug" },
  ];

  
  document.addEventListener("keydown", handlePacmanKeydown);

  
  gameLoopInterval = setInterval(gamePacmanLoop, 150);
  ghostMoveInterval = setInterval(moveGhosts, 300);
}


function initPacmanGrid() {
  pacmanGrid = [];
  totalDots = 0;

  
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


function gamePacmanLoop() {
  if (!pacmanActive) return;

  
  movePlayer();

  
  checkCollisions();

  
  drawPacman();
}


function movePlayer() {
  
  const nextX = player.x + getDirX(player.nextDirection);
  const nextY = player.y + getDirY(player.nextDirection);

  if (pacmanGrid[nextY] && pacmanGrid[nextY][nextX] !== 1) {
    player.direction = player.nextDirection;
  }

  
  const newX = player.x + getDirX(player.direction);
  const newY = player.y + getDirY(player.direction);

  
  if (pacmanGrid[newY] && pacmanGrid[newY][newX] !== 1) {
    player.x = newX;
    player.y = newY;
  }
}


function getDirX(dir) {
  if (dir === "left") return -1;
  if (dir === "right") return 1;
  return 0;
}


function getDirY(dir) {
  if (dir === "up") return -1;
  if (dir === "down") return 1;
  return 0;
}


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


function moveGhosts() {
  if (!pacmanActive) return;

  ghosts.forEach((ghost) => {
    
    const directions = ["up", "down", "left", "right"];
    const randomDir = directions[Math.floor(Math.random() * directions.length)];

    const newX = ghost.x + getDirX(randomDir);
    const newY = ghost.y + getDirY(randomDir);

    
    if (pacmanGrid[newY] && pacmanGrid[newY][newX] !== 1) {
      ghost.x = newX;
      ghost.y = newY;

      
      if (ghost.x === player.x && ghost.y === player.y) {
        pacmanDeaths++;
        playDeathSound();
        endPacman(false);
        return;
      }
    }
  });
}


function checkCollisions() {
  
  if (pacmanGrid[player.y][player.x] === 2) {
    pacmanGrid[player.y][player.x] = 0;
    dotsCollected++;
    pacmanScore += 10;
    document.getElementById("game-score").textContent =
      "PUNKTY: " + pacmanScore;
    playBeep(440, 0.05);

    
    if (dotsCollected >= totalDots) {
      endPacman(true);
    }
  }

  
  ghosts.forEach((ghost) => {
    if (ghost.x === player.x && ghost.y === player.y) {
      pacmanDeaths++;
      playDeathSound();
      endPacman(false);
    }
  });
}


function drawPacman() {
  
  pacmanCtx.fillStyle = "black";
  pacmanCtx.fillRect(0, 0, pacmanCanvas.width, pacmanCanvas.height);

  
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      if (pacmanGrid[y][x] === 1) {
        
        pacmanCtx.fillStyle = "#0095DA";
        pacmanCtx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      } else if (pacmanGrid[y][x] === 2) {
        
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

    
    saveScore("pacman_best", pacmanScore);

    
    addCompletedGame("pacman");

    
    addCoins(10);
    showToast("+10 🪙 za ukończenie Pacman!");

    
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


function stopPacman() {
  pacmanActive = false;
  if (gameLoopInterval) clearInterval(gameLoopInterval);
  if (ghostMoveInterval) clearInterval(ghostMoveInterval);
  document.removeEventListener("keydown", handlePacmanKeydown);
}
