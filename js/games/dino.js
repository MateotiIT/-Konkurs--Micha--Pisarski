let dinoActive = false;
let dinoCanvas;
let dinoCtx;
let dinoAnimationId;

let dinoPlayer = {
  x: 80,
  y: 0,
  width: 40,
  height: 50,
  velocityY: 0,
  isJumping: false,
  groundY: 300,
};

let dinoObstacles = [];
let dinoObstacleTimer = 0;
let dinoObstacleInterval = 100;

let dinoScore = 0;
let dinoGameTime = 0;
let dinoGameFrames = 0;
let dinoSpeed = 5;
let dinoGameOver = false;

function startDino() {
  dinoActive = true;
  dinoScore = 0;
  dinoGameTime = 0;
  dinoGameFrames = 0;
  dinoSpeed = 5;
  dinoGameOver = false;
  dinoObstacleTimer = 0;
  dinoObstacles = [];
  incrementGamePlayed("Dino");

  dinoPlayer.y = dinoPlayer.groundY;
  dinoPlayer.velocityY = 0;
  dinoPlayer.isJumping = false;

  document.getElementById("main-menu").style.display = "none";
  document.getElementById("game-container").style.display = "flex";

  document.getElementById("game-title").textContent = "POLSKI YOSHI RUNNER";
  document.getElementById("game-score").textContent = "PUNKTY: 0";

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

  document.addEventListener("keydown", handleDinoKeyDown);
  document.addEventListener("keyup", handleDinoKeyUp);

  dinoGameLoop();

  playBeep(440, 0.1);
}

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

function dinoJump() {
  if (!dinoPlayer.isJumping) {
    dinoPlayer.velocityY = -15;
    dinoPlayer.isJumping = true;
    playBeep(880, 0.05);
  }
}

function dinoGameLoop() {
  if (!dinoActive) return;

  updateDino();
  drawDino();

  dinoAnimationId = requestAnimationFrame(dinoGameLoop);
}

function updateDino() {
  if (dinoGameOver) return;

  dinoGameFrames++;
  if (dinoGameFrames >= 60) {
    dinoGameFrames = 0;
    dinoGameTime++;
  }

  dinoPlayer.velocityY += 0.8;
  dinoPlayer.y += dinoPlayer.velocityY;

  if (dinoPlayer.y >= dinoPlayer.groundY) {
    dinoPlayer.y = dinoPlayer.groundY;
    dinoPlayer.velocityY = 0;
    dinoPlayer.isJumping = false;
  }

  dinoObstacleTimer++;
  if (dinoObstacleTimer >= dinoObstacleInterval) {
    dinoObstacleTimer = 0;
    spawnObstacle();
  }

  for (let i = dinoObstacles.length - 1; i >= 0; i--) {
    const obs = dinoObstacles[i];
    obs.x -= dinoSpeed;

    if (obs.x + obs.width < 0) {
      dinoObstacles.splice(i, 1);
      dinoScore += 10;
      document.getElementById("game-score").textContent =
        "PUNKTY: " + dinoScore;
    }

    if (checkCollision(dinoPlayer, obs)) {
      endDino();
      return;
    }
  }

  if (dinoGameTime > 0 && dinoGameTime % 10 === 0 && dinoGameFrames === 0) {
    dinoSpeed += 0.1;
    dinoObstacleInterval = Math.max(60, dinoObstacleInterval - 2);
  }
}

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

function checkCollision(player, obstacle) {
  return (
    player.x < obstacle.x + obstacle.width &&
    player.x + player.width > obstacle.x &&
    player.y < obstacle.y + obstacle.height &&
    player.y + player.height > obstacle.y
  );
}

function drawDino() {
  dinoCtx.fillStyle = "#87CEEB";
  dinoCtx.fillRect(0, 0, 600, 400);

  const gradient = dinoCtx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "#87CEEB");
  gradient.addColorStop(1, "#E0F6FF");
  dinoCtx.fillStyle = gradient;
  dinoCtx.fillRect(0, 0, 600, 400);

  dinoCtx.fillStyle = "#8B7355";
  dinoCtx.fillRect(0, dinoPlayer.groundY + dinoPlayer.height, 600, 50);

  dinoCtx.strokeStyle = "#654321";
  dinoCtx.lineWidth = 3;
  dinoCtx.beginPath();
  dinoCtx.moveTo(0, dinoPlayer.groundY + dinoPlayer.height);
  dinoCtx.lineTo(600, dinoPlayer.groundY + dinoPlayer.height);
  dinoCtx.stroke();

  drawPlayer();

  dinoObstacles.forEach((obs) => {
    if (obs.type === "cactus") {
      dinoCtx.fillStyle = "#8B4513";
      dinoCtx.fillRect(obs.x, obs.y, obs.width, obs.height);

      dinoCtx.fillStyle = "#FFF";
      dinoCtx.fillRect(obs.x + 5, obs.y + 8, 8, 8);
      dinoCtx.fillRect(obs.x + 17, obs.y + 8, 8, 8);

      dinoCtx.fillStyle = "#000";
      dinoCtx.fillRect(obs.x + 7, obs.y + 10, 4, 4);
      dinoCtx.fillRect(obs.x + 19, obs.y + 10, 4, 4);
    } else {
      dinoCtx.fillStyle = "#F5B800";
      dinoCtx.fillRect(obs.x, obs.y, obs.width, obs.height);

      dinoCtx.strokeStyle = "#D89000";
      dinoCtx.lineWidth = 3;
      dinoCtx.strokeRect(obs.x, obs.y, obs.width, obs.height);

      dinoCtx.fillStyle = "#FFF";
      dinoCtx.font = "bold 20px Arial";
      dinoCtx.textAlign = "center";
      dinoCtx.textBaseline = "middle";
      dinoCtx.fillText("?", obs.x + obs.width / 2, obs.y + obs.height / 2);
      dinoCtx.textAlign = "left";
      dinoCtx.textBaseline = "alphabetic";
    }
  });

  if (dinoScore === 0 && !dinoGameOver) {
    dinoCtx.fillStyle = "rgba(0, 0, 0, 0.7)";
    dinoCtx.font = "12px 'Press Start 2P'";
    dinoCtx.textAlign = "center";
    dinoCtx.fillText("SPACJA / ↑ = SKOK", 300, 50);
    dinoCtx.textAlign = "left";
  }
}

function drawPlayer() {
  const legOffset = Math.floor(Date.now() / 100) % 2 === 0 ? 2 : -2;

  dinoCtx.fillStyle = "#6ABF40";
  dinoCtx.fillRect(dinoPlayer.x + 8, dinoPlayer.y + 10, 24, 28);

  dinoCtx.fillStyle = "#FFFFFF";
  dinoCtx.fillRect(dinoPlayer.x + 12, dinoPlayer.y + 18, 16, 16);

  dinoCtx.fillStyle = "#6ABF40";
  dinoCtx.fillRect(dinoPlayer.x + 14, dinoPlayer.y, 20, 16);

  dinoCtx.fillStyle = "#FF8C00";
  dinoCtx.beginPath();
  dinoCtx.arc(dinoPlayer.x + 36, dinoPlayer.y + 8, 6, 0, Math.PI * 2);
  dinoCtx.fill();

  dinoCtx.fillStyle = "#4A9930";
  for (let i = 0; i < 4; i++) {
    dinoCtx.fillRect(dinoPlayer.x + 10 + i * 5, dinoPlayer.y + 8, 4, 4);
  }

  dinoCtx.fillStyle = "#FFFFFF";
  dinoCtx.beginPath();
  dinoCtx.arc(dinoPlayer.x + 20, dinoPlayer.y + 6, 4, 0, Math.PI * 2);
  dinoCtx.fill();
  dinoCtx.beginPath();
  dinoCtx.arc(dinoPlayer.x + 26, dinoPlayer.y + 6, 4, 0, Math.PI * 2);
  dinoCtx.fill();

  dinoCtx.fillStyle = "#000000";
  dinoCtx.beginPath();
  dinoCtx.arc(dinoPlayer.x + 21, dinoPlayer.y + 6, 2, 0, Math.PI * 2);
  dinoCtx.fill();
  dinoCtx.beginPath();
  dinoCtx.arc(dinoPlayer.x + 27, dinoPlayer.y + 6, 2, 0, Math.PI * 2);
  dinoCtx.fill();

  dinoCtx.fillStyle = "#E60012";
  dinoCtx.fillRect(dinoPlayer.x + 10, dinoPlayer.y + 14, 18, 6);

  dinoCtx.fillStyle = "#6ABF40";

  dinoCtx.fillRect(dinoPlayer.x + 10, dinoPlayer.y + 34 + legOffset, 8, 12);

  dinoCtx.fillRect(dinoPlayer.x + 22, dinoPlayer.y + 34 - legOffset, 8, 12);

  dinoCtx.fillStyle = "#E60012";

  dinoCtx.fillRect(dinoPlayer.x + 8, dinoPlayer.y + 44 + legOffset, 12, 4);

  dinoCtx.fillRect(dinoPlayer.x + 20, dinoPlayer.y + 44 - legOffset, 12, 4);
}

function endDino() {
  dinoGameOver = true;
  dinoActive = false;
  incrementGameLost();
  saveBestScore("dino_score", dinoScore, false);

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

function stopDino() {
  dinoActive = false;

  if (dinoAnimationId) {
    cancelAnimationFrame(dinoAnimationId);
  }

  document.removeEventListener("keydown", handleDinoKeyDown);
  document.removeEventListener("keyup", handleDinoKeyUp);

  dinoSpacePressed = false;
}
