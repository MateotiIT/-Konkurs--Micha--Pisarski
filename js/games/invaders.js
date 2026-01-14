let invadersActive = false;
let invadersCanvas = null;
let invadersCtx = null;
let invadersInterval = null;

const INVADERS_WIDTH = 700;
const INVADERS_HEIGHT = 600;

let invadersPlayer = {
  x: 350,
  y: 550,
  width: 40,
  height: 30,
  speed: 5,
  lives: 3,
};

let invadersBullets = [];

let invadersEnemies = [];
let invadersDirection = 1;
let invadersSpeed = 1;
let invadersDownTimer = 0;

let invadersEnemyBullets = [];
let invadersEnemyShootTimer = 0;

let invadersBoss = null;
let invadersBossActive = false;
let invadersBossHealth = 0;

let invadersScore = 0;
let invadersLevel = 1;
let invadersGameOver = false;
let invadersWon = false;

let invadersKeys = {
  left: false,
  right: false,
  space: false,
  spacePressed: false,
};

function startInvaders() {
  showInvadersStory();
}

function showInvadersStory() {
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
      ">🚀 OSTATECZNA MISJA! 🚀</h2>
      
      <div style="
        background: rgba(0,0,0,0.4);
        padding: 25px;
        border-radius: 10px;
        margin-bottom: 25px;
        border: 2px solid var(--red);
      ">
        <p style="
          font-size: 13px;
          line-height: 1.8;
          color: var(--red);
          margin-bottom: 20px;
          font-weight: bold;
        ">
          ⚡ W KOŃCU TO JUŻ OSTATNI KROK! ⚡
        </p>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--white);
          margin-bottom: 15px;
        ">
          🛸 Źli ludzie próbują nam uciec<br/>w kosmos z Nintendo Switch 2!
        </p>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--white);
          margin-bottom: 15px;
        ">
          💥 Ale my się im nie damy<br/>i ich dorwiemy!
        </p>
        
        <p style="
          font-size: 13px;
          line-height: 1.8;
          color: var(--yellow);
          margin-bottom: 15px;
          font-weight: bold;
        ">
          📢 ODDAWAJCIE NINTENDO! 📢
        </p>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--white);
        ">
          🎯 Pokonaj armię kosmitów<br/>i ich potężnego bossa!
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
          ⚔️ WALCZ DO KOŃCA! ⚔️
        </p>
        <p style="
          font-size: 9px;
          color: var(--white);
          line-height: 1.6;
        ">
          Strzałki ←→ Ruch | Spacja: Strzał<br/>
          Pokonaj wszystkich wrogów!<br/>
          Uważaj na bossa - ma 10 HP!
        </p>
      </div>
      
      <button id="invaders-story-start-btn" style="
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
        LECIMY!
      </button>
    </div>
  `;

  document
    .getElementById("invaders-story-start-btn")
    .addEventListener("click", () => {
      startInvadersGame();
    });
}

function startInvadersGame() {
  if (invadersInterval) {
    clearInterval(invadersInterval);
  }

  invadersActive = true;
  invadersGameOver = false;
  invadersWon = false;
  invadersScore = 0;
  invadersLevel = 1;
  incrementGamePlayed("Invaders");

  invadersBossActive = false;
  invadersBoss = null;

  invadersBullets = [];
  invadersEnemyBullets = [];

  invadersKeys.left = false;
  invadersKeys.right = false;
  invadersKeys.space = false;
  invadersKeys.spacePressed = false;

  document.getElementById("game-title").textContent = "PISARIO INVADERS";
  updateInvadersScore();

  const gameContent = document.getElementById("game-content");
  gameContent.innerHTML = `
    <div style="text-align: center;">
      <canvas id="invaders-canvas" width="${INVADERS_WIDTH}" height="${INVADERS_HEIGHT}" style="
        background: #000;
        border: 4px solid var(--green);
        border-radius: 10px;
        display: block;
        margin: 0 auto;
      "></canvas>
      <p style="font-size: 10px; color: var(--gray); margin-top: 15px;">
        Strzałki ←→ Ruch | Spacja: Strzał | Pokonaj wszystkich wrogów i bossa!
      </p>
    </div>
  `;

  invadersCanvas = document.getElementById("invaders-canvas");
  invadersCtx = invadersCanvas.getContext("2d");

  resetInvadersPlayer();
  createInvadersEnemies();

  document.addEventListener("keydown", handleInvadersKeyDown);
  document.addEventListener("keyup", handleInvadersKeyUp);

  invadersInterval = setInterval(invadersGameLoop, 1000 / 60);

  incrementGamesPlayed();
}

function resetInvadersPlayer() {
  invadersPlayer.x = INVADERS_WIDTH / 2 - invadersPlayer.width / 2;
  invadersPlayer.y = INVADERS_HEIGHT - 50;
  invadersPlayer.lives = 3;
  invadersBullets = [];
}

function createInvadersEnemies() {
  invadersEnemies = [];
  invadersDirection = 1;
  invadersSpeed = 1 + invadersLevel * 0.5;

  const rows = 3 + Math.min(invadersLevel, 2);
  const cols = 8;
  const enemyWidth = 30;
  const enemyHeight = 25;
  const spacing = 15;
  const startX = 100;
  const startY = 50;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      invadersEnemies.push({
        x: startX + col * (enemyWidth + spacing),
        y: startY + row * (enemyHeight + spacing),
        width: enemyWidth,
        height: enemyHeight,
        alive: true,
        type: row === 0 ? "fast" : row === 1 ? "medium" : "normal",
      });
    }
  }
}

function createInvadersBoss() {
  const isFinalBoss = invadersLevel === 2;

  invadersBoss = {
    x: INVADERS_WIDTH / 2 - (isFinalBoss ? 75 : 60),
    y: 50,
    width: isFinalBoss ? 150 : 120,
    height: isFinalBoss ? 100 : 80,
    vx: isFinalBoss ? 3 : 2,
    health: isFinalBoss ? 40 : 20,
    maxHealth: isFinalBoss ? 40 : 20,
    shootTimer: 0,
    shootInterval: isFinalBoss ? 45 : 35,
    isFinal: isFinalBoss,
  };
  invadersBossActive = true;
  invadersBossHealth = invadersBoss.health;
}

function updateInvadersScore() {
  const hearts = "❤️".repeat(invadersPlayer.lives);
  document.getElementById(
    "game-score"
  ).textContent = `${hearts} | PUNKTY: ${invadersScore} | POZIOM: ${invadersLevel}`;
}

function handleInvadersKeyDown(e) {
  if (e.key === "ArrowLeft") invadersKeys.left = true;
  if (e.key === "ArrowRight") invadersKeys.right = true;
  if (e.key === " ") {
    e.preventDefault();
    invadersKeys.space = true;
  }
}

function handleInvadersKeyUp(e) {
  if (e.key === "ArrowLeft") invadersKeys.left = false;
  if (e.key === "ArrowRight") invadersKeys.right = false;
  if (e.key === " ") {
    invadersKeys.space = false;
    invadersKeys.spacePressed = false;
  }
}

function invadersGameLoop() {
  if (invadersGameOver || invadersWon) return;

  updateInvaders();
  renderInvaders();
}

function updateInvaders() {
  if (invadersKeys.left && invadersPlayer.x > 0) {
    invadersPlayer.x -= invadersPlayer.speed;
  }
  if (
    invadersKeys.right &&
    invadersPlayer.x < INVADERS_WIDTH - invadersPlayer.width
  ) {
    invadersPlayer.x += invadersPlayer.speed;
  }

  if (invadersKeys.space && !invadersKeys.spacePressed) {
    invadersBullets.push({
      x: invadersPlayer.x + invadersPlayer.width / 2 - 2,
      y: invadersPlayer.y,
      width: 4,
      height: 15,
      vy: -8,
    });
    invadersKeys.spacePressed = true;
    playBeep(880, 0.05);
  }

  for (let i = invadersBullets.length - 1; i >= 0; i--) {
    invadersBullets[i].y += invadersBullets[i].vy;
    if (invadersBullets[i].y < 0) {
      invadersBullets.splice(i, 1);
    }
  }

  if (!invadersBossActive) {
    updateInvadersEnemies();
  } else {
    updateInvadersBoss();
  }

  updateInvadersEnemyBullets();

  checkInvadersBulletCollisions();

  checkInvadersPlayerHit();

  if (
    !invadersBossActive &&
    invadersEnemies.filter((e) => e.alive).length === 0
  ) {
    createInvadersBoss();
  }

  if (invadersBossActive && invadersBoss && invadersBoss.health <= 0) {
    invadersBossActive = false;
    const wasFinalBoss = invadersBoss.isFinal;
    invadersBoss = null;
    invadersLevel++;
    invadersScore += wasFinalBoss ? 2000 : 1000;
    updateInvadersScore();
    playBeep(660, 0.3);

    if (wasFinalBoss) {
      invadersWon = true;

      invadersEnemies = [];
      invadersBullets = [];
      invadersEnemyBullets = [];

      setTimeout(() => endInvaders(true), 1000);
    } else {
      setTimeout(() => {
        if (invadersActive && !invadersGameOver && !invadersWon) {
          createInvadersEnemies();
        }
      }, 2000);
    }
  }
}

function updateInvadersEnemies() {
  let moveDown = false;
  let aliveEnemies = invadersEnemies.filter((e) => e.alive);

  if (aliveEnemies.length === 0) return;

  for (let enemy of aliveEnemies) {
    enemy.x += invadersDirection * invadersSpeed;
  }

  for (let enemy of aliveEnemies) {
    if (enemy.x <= 0 || enemy.x >= INVADERS_WIDTH - enemy.width) {
      moveDown = true;
      break;
    }
  }

  if (moveDown) {
    invadersDirection *= -1;
    for (let enemy of aliveEnemies) {
      enemy.y += 20;
    }
  }

  invadersEnemyShootTimer++;
  if (invadersEnemyShootTimer > 30 && aliveEnemies.length > 0) {
    invadersEnemyShootTimer = 0;
    const shooter =
      aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
    invadersEnemyBullets.push({
      x: shooter.x + shooter.width / 2 - 2,
      y: shooter.y + shooter.height,
      width: 4,
      height: 10,
      vy: 4,
    });
  }

  for (let enemy of aliveEnemies) {
    if (enemy.y + enemy.height >= invadersPlayer.y) {
      invadersPlayerDie();
      break;
    }
  }
}

function updateInvadersBoss() {
  if (!invadersBoss) return;

  invadersBoss.x += invadersBoss.vx;

  if (
    invadersBoss.x <= 0 ||
    invadersBoss.x >= INVADERS_WIDTH - invadersBoss.width
  ) {
    invadersBoss.vx *= -1;
  }

  invadersBoss.shootTimer++;
  if (invadersBoss.shootTimer >= invadersBoss.shootInterval) {
    invadersBoss.shootTimer = 0;

    if (invadersBoss.isFinal) {
      invadersEnemyBullets.push(
        {
          x: invadersBoss.x + 30,
          y: invadersBoss.y + invadersBoss.height,
          width: 6,
          height: 12,
          vy: 5,
        },
        {
          x: invadersBoss.x + 60,
          y: invadersBoss.y + invadersBoss.height,
          width: 6,
          height: 12,
          vy: 5,
        },
        {
          x: invadersBoss.x + 90,
          y: invadersBoss.y + invadersBoss.height,
          width: 6,
          height: 12,
          vy: 5,
        },
        {
          x: invadersBoss.x + invadersBoss.width - 36,
          y: invadersBoss.y + invadersBoss.height,
          width: 6,
          height: 12,
          vy: 5,
        }
      );
    } else {
      invadersEnemyBullets.push(
        {
          x: invadersBoss.x + 30,
          y: invadersBoss.y + invadersBoss.height,
          width: 6,
          height: 12,
          vy: 5,
        },
        {
          x: invadersBoss.x + invadersBoss.width - 36,
          y: invadersBoss.y + invadersBoss.height,
          width: 6,
          height: 12,
          vy: 5,
        }
      );
    }
  }
}

function updateInvadersEnemyBullets() {
  for (let i = invadersEnemyBullets.length - 1; i >= 0; i--) {
    invadersEnemyBullets[i].y += invadersEnemyBullets[i].vy;
    if (invadersEnemyBullets[i].y > INVADERS_HEIGHT) {
      invadersEnemyBullets.splice(i, 1);
    }
  }
}

function checkInvadersBulletCollisions() {
  for (let i = invadersBullets.length - 1; i >= 0; i--) {
    const bullet = invadersBullets[i];

    if (!invadersBossActive) {
      for (let enemy of invadersEnemies) {
        if (
          enemy.alive &&
          bullet.x + bullet.width > enemy.x &&
          bullet.x < enemy.x + enemy.width &&
          bullet.y < enemy.y + enemy.height &&
          bullet.y + bullet.height > enemy.y
        ) {
          enemy.alive = false;
          invadersBullets.splice(i, 1);
          invadersScore +=
            enemy.type === "fast" ? 30 : enemy.type === "medium" ? 20 : 10;
          updateInvadersScore();
          playBeep(440, 0.05);
          break;
        }
      }
    }

    if (invadersBossActive && invadersBoss && i < invadersBullets.length) {
      if (
        bullet.x + bullet.width > invadersBoss.x &&
        bullet.x < invadersBoss.x + invadersBoss.width &&
        bullet.y < invadersBoss.y + invadersBoss.height &&
        bullet.y + bullet.height > invadersBoss.y
      ) {
        invadersBoss.health--;
        invadersBullets.splice(i, 1);
        invadersScore += 50;
        updateInvadersScore();
        playBeep(330, 0.05);
      }
    }
  }
}

function checkInvadersPlayerHit() {
  for (let i = invadersEnemyBullets.length - 1; i >= 0; i--) {
    const bullet = invadersEnemyBullets[i];

    if (
      bullet.x + bullet.width > invadersPlayer.x &&
      bullet.x < invadersPlayer.x + invadersPlayer.width &&
      bullet.y + bullet.height > invadersPlayer.y &&
      bullet.y < invadersPlayer.y + invadersPlayer.height
    ) {
      invadersEnemyBullets.splice(i, 1);
      invadersPlayerDie();
    }
  }
}

function invadersPlayerDie() {
  invadersPlayer.lives--;
  updateInvadersScore();
  playBeep(220, 0.3);

  if (invadersPlayer.lives <= 0) {
    endInvaders(false);
  } else {
    invadersPlayer.x = INVADERS_WIDTH / 2 - invadersPlayer.width / 2;
    invadersBullets = [];
    invadersEnemyBullets = [];
  }
}

function renderInvaders() {
  invadersCtx.fillStyle = "#000";
  invadersCtx.fillRect(0, 0, INVADERS_WIDTH, INVADERS_HEIGHT);

  // Niebieski statek Pisario
  invadersCtx.fillStyle = "#0095DA";

  // Korpus statku
  invadersCtx.fillRect(invadersPlayer.x + 10, invadersPlayer.y + 10, 20, 20);

  // Działo na górze
  invadersCtx.fillRect(invadersPlayer.x + 18, invadersPlayer.y, 4, 12);

  // Podstawy boczne
  invadersCtx.fillRect(invadersPlayer.x, invadersPlayer.y + 20, 10, 10);
  invadersCtx.fillRect(invadersPlayer.x + 30, invadersPlayer.y + 20, 10, 10);

  // Litera "P" na statku
  invadersCtx.fillStyle = "#FFFFFF";
  invadersCtx.font = "bold 14px 'Press Start 2P'";
  invadersCtx.textAlign = "center";
  invadersCtx.fillText("P", invadersPlayer.x + 20, invadersPlayer.y + 24);

  invadersCtx.fillStyle = "#FFFF00";
  for (let bullet of invadersBullets) {
    invadersCtx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  }

  if (!invadersBossActive) {
    for (let enemy of invadersEnemies) {
      if (enemy.alive) {
        if (enemy.type === "fast") {
          invadersCtx.fillStyle = "#FF00FF";
        } else if (enemy.type === "medium") {
          invadersCtx.fillStyle = "#FF8800";
        } else {
          invadersCtx.fillStyle = "#FF0000";
        }

        invadersCtx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        invadersCtx.fillStyle = "#FFF";
        invadersCtx.fillRect(enemy.x + 8, enemy.y + 8, 4, 4);
        invadersCtx.fillRect(enemy.x + 18, enemy.y + 8, 4, 4);
      }
    }
  }

  if (invadersBossActive && invadersBoss) {
    const isFinal = invadersBoss.isFinal;

    invadersCtx.fillStyle = isFinal ? "#FF0000" : "#8B00FF";
    invadersCtx.fillRect(
      invadersBoss.x + (isFinal ? 25 : 20),
      invadersBoss.y + (isFinal ? 25 : 20),
      isFinal ? 100 : 80,
      isFinal ? 60 : 50
    );

    invadersCtx.fillRect(
      invadersBoss.x + (isFinal ? 45 : 40),
      invadersBoss.y,
      isFinal ? 60 : 40,
      isFinal ? 30 : 25
    );

    invadersCtx.fillStyle = isFinal ? "#FFFF00" : "#FF0000";
    const eyeSize = isFinal ? 12 : 10;
    invadersCtx.fillRect(
      invadersBoss.x + (isFinal ? 50 : 45),
      invadersBoss.y + (isFinal ? 10 : 8),
      eyeSize,
      eyeSize
    );
    invadersCtx.fillRect(
      invadersBoss.x + (isFinal ? 88 : 65),
      invadersBoss.y + (isFinal ? 10 : 8),
      eyeSize,
      eyeSize
    );

    invadersCtx.fillStyle = "#666";
    invadersCtx.fillRect(
      invadersBoss.x + (isFinal ? 30 : 25),
      invadersBoss.y + (isFinal ? 85 : 70),
      isFinal ? 10 : 8,
      isFinal ? 15 : 10
    );
    invadersCtx.fillRect(
      invadersBoss.x + (isFinal ? 110 : 87),
      invadersBoss.y + (isFinal ? 85 : 70),
      isFinal ? 10 : 8,
      isFinal ? 15 : 10
    );

    if (isFinal) {
      invadersCtx.fillRect(invadersBoss.x + 60, invadersBoss.y + 85, 10, 15);
      invadersCtx.fillRect(invadersBoss.x + 80, invadersBoss.y + 85, 10, 15);
    }

    const healthBarWidth = 100;
    const healthBarHeight = 10;
    const healthBarX = INVADERS_WIDTH / 2 - healthBarWidth / 2;
    const healthBarY = 20;

    invadersCtx.fillStyle = "#333";
    invadersCtx.fillRect(
      healthBarX,
      healthBarY,
      healthBarWidth,
      healthBarHeight
    );

    invadersCtx.fillStyle = isFinal ? "#FF0000" : "#00FF00";
    const currentHealthWidth =
      (invadersBoss.health / invadersBoss.maxHealth) * healthBarWidth;
    invadersCtx.fillRect(
      healthBarX,
      healthBarY,
      currentHealthWidth,
      healthBarHeight
    );

    invadersCtx.strokeStyle = "#FFF";
    invadersCtx.lineWidth = 2;
    invadersCtx.strokeRect(
      healthBarX,
      healthBarY,
      healthBarWidth,
      healthBarHeight
    );

    invadersCtx.fillStyle = isFinal ? "#FF0000" : "#FFF";
    invadersCtx.font = isFinal
      ? "bold 12px 'Press Start 2P'"
      : "12px 'Press Start 2P'";
    invadersCtx.textAlign = "center";
    invadersCtx.fillText(
      isFinal ? "FINAL BOSS" : "BOSS",
      INVADERS_WIDTH / 2,
      15
    );
    invadersCtx.textAlign = "left";
  }

  invadersCtx.fillStyle = "#FF0000";
  for (let bullet of invadersEnemyBullets) {
    invadersCtx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  }
}

function endInvaders(won) {
  invadersGameOver = !won;
  invadersWon = won;
  invadersActive = false;
  clearInterval(invadersInterval);

  // Zapisz wynik niezależnie od wyniku gry
  saveBestScore("invaders_score", invadersScore, false);

  if (won) {
    incrementGameWon();
  } else {
    incrementGameLost();
  }

  document.removeEventListener("keydown", handleInvadersKeyDown);
  document.removeEventListener("keyup", handleInvadersKeyUp);

  const gameContent = document.getElementById("game-content");

  if (won) {
    unlockAchievement("invaders_master");
    addCompletedGame("invaders");

    addCoins(10);
    showToast("+10 🪙 za ukończenie Invaders!");

    showInvadersVictoryEnding();
    playBeep(880, 0.5);
  } else {
    gameContent.innerHTML = `
      <div style="text-align: center;">
        <h2 style="font-size: 24px; color: var(--red); margin-bottom: 20px;">
          💀 KONIEC GRY 💀
        </h2>
        <p style="font-size: 14px; color: var(--dark-gray); margin-bottom: 15px;">
          Najeźdźcy wygrali!
        </p>
        <div style="font-size: 48px; margin: 20px 0;">
          😢
        </div>
        <p style="font-size: 12px; color: var(--purple); margin-bottom: 10px;">
          WYNIK: ${invadersScore}
        </p>
        <button class="btn-play" onclick="startInvaders()">ZAGRAJ PONOWNIE</button>
      </div>
    `;
    playBeep(220, 0.5);
  }
}

function stopInvaders() {
  invadersActive = false;
  if (invadersInterval) clearInterval(invadersInterval);
  document.removeEventListener("keydown", handleInvadersKeyDown);
  document.removeEventListener("keyup", handleInvadersKeyUp);

  invadersKeys.left = false;
  invadersKeys.right = false;
  invadersKeys.space = false;
}

function showInvadersVictoryEnding() {
  const gameContent = document.getElementById("game-content");

  const data = loadData();
  const playerNick = data.profile?.nick || "BOHATERZE";

  gameContent.innerHTML = `
    <div style="
      background: #1a1a2e;
      padding: 30px 20px;
      border-radius: 15px;
      max-width: 500px;
      margin: 0 auto;
      border: 3px solid #FFD700;
    ">
      <!-- Nagłówek -->
      <h2 style="
        font-size: 18px;
        color: #FFD700;
        margin-bottom: 25px;
        text-align: center;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
      ">
        🎉 MISJA ZAKOŃCZONA! 🎉
      </h2>

      <!-- Komunikat główny -->
      <div style="
        background: #16213e;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 20px;
        border: 2px solid #00ff88;
      ">
        <p style="
          font-size: 11px;
          color: #00ff88;
          line-height: 2;
          text-align: center;
          margin-bottom: 15px;
        ">
          💚 DZIĘKUJEMY CI, DZIELNY ${playerNick}! 💚
        </p>
        <p style="
          font-size: 9px;
          color: #ffffff;
          line-height: 1.8;
          text-align: center;
        ">
          Uratowałeś nas przed inwazją!<br/>
          Wywalczyłeś <span style="color: #ff3366; font-weight: bold;">POLSKIE NAPISY</span><br/>
          w grach Nintendo! 🇵🇱
        </p>
      </div>

      <!-- Śmieszny dialog -->
      <div style="
        background: #2d1b3d;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        border-left: 4px solid #ff3366;
      ">
        <p style="
          font-size: 8px;
          color: #FFD700;
          margin-bottom: 8px;
          font-weight: bold;
        ">
          📣 OFICJALNY KOMUNIKAT NINTENDO:
        </p>
        <p style="
          font-size: 8px;
          color: #e0e0e0;
          line-height: 1.6;
          font-style: italic;
        ">
          "Po bohaterskiej walce ${playerNick},<br/>
          oficjalnie ogłaszamy: SWITCH 2<br/>
          będzie miał polski interfejs! 🎮<br/>
          <span style="color: #00ff88;">*tłum szaleje*</span> 🎊"
        </p>
      </div>

      <!-- Podziękowania -->
      <div style="
        text-align: center;
        margin-bottom: 20px;
      ">
        <p style="
          font-size: 24px;
          margin-bottom: 10px;
        ">
          🚀 ✨ 🎮 ✨ 🏆
        </p>
        <p style="
          font-size: 14px;
          color: #bb86fc;
          font-weight: bold;
          margin-bottom: 8px;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        ">
          NIECH ŻYJE ${playerNick}!
        </p>
        <p style="
          font-size: 7px;
          color: #b0b0b0;
          line-height: 1.6;
        ">
          Jesteśmy Ci bardzo wdzięczni.<br/>
          Polscy gracze nigdy Cię nie zapomną! 🇵🇱
        </p>
      </div>

      <!-- Statystyki -->
      <div style="
        background: #16213e;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 20px;
        border: 2px solid #bb86fc;
      ">
        <p style="
          font-size: 8px;
          color: #bb86fc;
          text-align: center;
          margin-bottom: 5px;
          font-weight: bold;
        ">
          📊 TWÓJ WYNIK
        </p>
        <p style="
          font-size: 12px;
          color: #FFD700;
          text-align: center;
          font-weight: bold;
        ">
          ${invadersScore} PUNKTÓW
        </p>
      </div>

      <!-- Przycisk -->
      <button 
        class="btn-play" 
        onclick="startInvaders()" 
        style="
          width: 100%;
          margin-top: 10px;
          font-size: 10px;
        "
      >
        ZAGRAJ PONOWNIE
      </button>
    </div>
  `;

  playWinSound();
}
