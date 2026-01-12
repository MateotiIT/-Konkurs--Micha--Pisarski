var marioActive = false;
var marioCanvas;
var marioCtx;
var marioInterval;

var MARIO_VIEWPORT_WIDTH = 800;
var MARIO_VIEWPORT_HEIGHT = 480;
var MARIO_LEVEL_WIDTH = 2400;

var marioPlayer = {
  x: 50,
  y: 350,
  width: 32,
  height: 32,
  vx: 0,
  vy: 0,
  onGround: false,
  facingRight: true,
  lives: 3,
  coins: 0,
  score: 0,
  big: false,
  invincible: false,
  invincibleTimer: 0,
};

var marioCamera = {
  x: 0,
};

var marioKeys = {
  left: false,
  right: false,
  jump: false,
};

var MARIO_GRAVITY = 0.5;
var MARIO_JUMP_POWER = -12;
var MARIO_MOVE_SPEED = 3;

var marioPlatforms = [];

var marioCoins = [];

var marioEnemies = [];

var marioPowerUps = [];

var marioPipes = [];

var marioLakitu = {
  x: 400,
  y: 80,
  width: 40,
  height: 40,
  throwTimer: 0,
  throwInterval: 150,
};

var marioFireballs = [];

var marioFlag = {
  x: 2300,
  y: 280,
  width: 10,
  height: 150,
  touched: false,
};

var marioGameOver = false;
var marioWon = false;
var marioInSecretLevel = false;
var marioEnteringPipe = false;
var marioPipeAnimationTimer = 0;

var marioPrincess = {
  x: 0,
  y: 0,
  width: 40,
  height: 50,
  active: false,
};

function startMario() {
  showMarioStory();
}

function showMarioStory() {
  var gameContent = document.getElementById("game-content");
  gameContent.innerHTML = `
    <div style="
      max-width: 600px;
      margin: 0 auto;
      padding: 30px;
      text-align: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border: 4px solid var(--red);
      border-radius: 15px;
    ">
      <h2 style="
        font-size: 24px;
        color: var(--red);
        margin-bottom: 30px;
        text-shadow: 2px 2px 0 #000;
      ">🍄 MISJA PLATFORMÓWKI! 🍄</h2>
      
      <div style="
        background: rgba(0,0,0,0.4);
        padding: 25px;
        border-radius: 10px;
        margin-bottom: 25px;
        border: 2px solid var(--yellow);
      ">
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--white);
          margin-bottom: 15px;
        ">
          🎮 Źli ludzie zabrali Nintendo<br/>i ukryli się na końcu poziomu!
        </p>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--white);
          margin-bottom: 15px;
        ">
          🏃 Biegnij przez platformy,<br/>unikaj wrogów i zbieraj monety!
        </p>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--yellow);
          margin-bottom: 15px;
          font-weight: bold;
        ">
          🚩 Dotrzyj do flagi na końcu,<br/>by znaleźć sprawców!
        </p>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--white);
        ">
          ⚡ Skacz na wrogów by ich pokonać<br/>i bądź czujny na niebezpieczeństwa!
        </p>
      </div>
      
      <div style="
        background: rgba(230, 0, 18, 0.2);
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 25px;
        border: 2px solid var(--red);
      ">
        <p style="
          font-size: 9px;
          color: var(--red);
          margin-bottom: 8px;
        ">
          💡 SEKRETNA WSKAZÓWKA 💡
        </p>
        <p style="
          font-size: 9px;
          color: var(--white);
          line-height: 1.6;
        ">
          Podobno gdzieś na mapie jest ukryta<br/>
          tajemnicza zielona rura...<br/>
          Może prowadzi do <span style="color: var(--yellow);">księżniczki</span>? 👑
        </p>
      </div>
      
      <button id="mario-story-start-btn" style="
        font-family: 'Press Start 2P', cursive;
        font-size: 14px;
        padding: 15px 40px;
        background: var(--red);
        color: var(--white);
        border: 4px solid var(--dark-gray);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 6px 0 #8b0000;
      "
      onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 0 #8b0000'"
      onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 0 #8b0000'"
      onmousedown="this.style.transform='translateY(4px)'; this.style.boxShadow='0 2px 0 #8b0000'"
      onmouseup="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 0 #8b0000'"
      >
        LET'S-A GO!
      </button>
    </div>
  `;

  document
    .getElementById("mario-story-start-btn")
    .addEventListener("click", () => {
      startMarioGame();
    });
}

function startMarioGame() {
  marioActive = true;
  incrementGamePlayed("Mario");

  document.getElementById("game-title").textContent = "SUPER PISARIO BROS";
  document.getElementById("game-score").textContent =
    "❤️❤️❤️ | MONETY: 0 | PUNKTY: 0";

  var gameContent = document.getElementById("game-content");
  gameContent.innerHTML = `
    <div style="text-align: center;">
      <canvas id="mario-canvas" width="${MARIO_VIEWPORT_WIDTH}" height="${MARIO_VIEWPORT_HEIGHT}" style="
        background: #5C94FC;
        border: 4px solid var(--red);
        border-radius: 10px;
        display: block;
        margin: 0 auto;
      "></canvas>
      <p style="font-size: 10px; color: var(--gray); margin-top: 15px;">
        ← →  ↓ Ruch  | Spacja: Skok | Zbierz monety i dotrzyj do flagi!
      </p>
    </div>
  `;

  marioCanvas = document.getElementById("mario-canvas");
  marioCtx = marioCanvas.getContext("2d");

  resetMarioGame();

  document.addEventListener("keydown", handleMarioKeyDown);
  document.addEventListener("keyup", handleMarioKeyUp);

  marioInterval = setInterval(() => {
    marioGameLoop();
  }, 1000 / 60);
}

function resetMarioGame() {
  marioPlayer.x = 50;
  marioPlayer.y = 350;
  marioPlayer.vx = 0;
  marioPlayer.vy = 0;
  marioPlayer.onGround = false;
  marioPlayer.facingRight = true;
  marioPlayer.lives = 3;
  marioPlayer.coins = 0;
  marioPlayer.score = 0;
  marioPlayer.big = true;
  marioPlayer.height = 48;
  marioPlayer.invincible = false;
  marioPlayer.invincibleTimer = 0;

  marioCamera.x = 0;
  marioGameOver = false;
  marioWon = false;

  marioInSecretLevel = false;
  marioEnteringPipe = false;
  marioPipeAnimationTimer = 0;
  marioPrincess.active = false;

  marioLakitu.x = 400;
  marioLakitu.y = 80;
  marioLakitu.throwTimer = 0;
  marioFireballs = [];

  createMarioLevel1();
}

function createMarioLevel1() {
  marioPlatforms = [];
  marioCoins = [];
  marioEnemies = [];
  marioPowerUps = [];
  marioPipes = [];

  var BLOCK_SIZE = 30;

  marioPlatforms.push({
    x: 0,
    y: 430,
    width: MARIO_LEVEL_WIDTH,
    height: 50,
    type: "ground",
  });

  for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 5 - i; j++) {
      marioPlatforms.push({
        x: 350 + i * BLOCK_SIZE + j * BLOCK_SIZE,
        y: 400 - i * BLOCK_SIZE,
        width: BLOCK_SIZE,
        height: BLOCK_SIZE,
        type: "brick",
      });
    }
  }

  for (var i = 0; i < 6; i++) {
    marioPlatforms.push({
      x: 600 + i * BLOCK_SIZE,
      y: 280,
      width: BLOCK_SIZE,
      height: BLOCK_SIZE,
      type: "brick",
    });
  }

  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4 - i; j++) {
      marioPlatforms.push({
        x: 950 + i * BLOCK_SIZE + j * BLOCK_SIZE,
        y: 400 - i * BLOCK_SIZE,
        width: BLOCK_SIZE,
        height: BLOCK_SIZE,
        type: "brick",
      });
    }
  }

  for (var i = 0; i < 8; i++) {
    marioPlatforms.push({
      x: 1150 + i * BLOCK_SIZE,
      y: 300,
      width: BLOCK_SIZE,
      height: BLOCK_SIZE,
      type: "brick",
    });
  }

  for (var i = 0; i < 6; i++) {
    for (var j = i; j < 6; j++) {
      marioPlatforms.push({
        x: 1500 + j * BLOCK_SIZE,
        y: 250 + i * BLOCK_SIZE,
        width: BLOCK_SIZE,
        height: BLOCK_SIZE,
        type: "brick",
      });
    }
  }

  for (var i = 0; i < 5; i++) {
    marioPlatforms.push({
      x: 1850 + i * BLOCK_SIZE,
      y: 350,
      width: BLOCK_SIZE,
      height: BLOCK_SIZE,
      type: "brick",
    });
  }

  for (var i = 0; i < 4; i++) {
    marioPlatforms.push({
      x: 2100 + i * BLOCK_SIZE,
      y: 320,
      width: BLOCK_SIZE,
      height: BLOCK_SIZE,
      type: "brick",
    });
  }

  marioPipes.push({ x: 250, y: 370, width: 60, height: 60 });
  marioPipes.push({ x: 850, y: 370, width: 60, height: 60 });
  marioPipes.push({ x: 1400, y: 370, width: 60, height: 60 });
  marioPipes.push({ x: 2000, y: 370, width: 60, height: 60 });

  marioCoins.push({ x: 500, y: 180, width: 20, height: 20, collected: false });
  marioCoins.push({ x: 600, y: 150, width: 20, height: 20, collected: false });
  marioCoins.push({ x: 700, y: 180, width: 20, height: 20, collected: false });
  marioCoins.push({ x: 800, y: 150, width: 20, height: 20, collected: false });
  marioCoins.push({ x: 920, y: 180, width: 20, height: 20, collected: false });
  marioCoins.push({ x: 1070, y: 200, width: 20, height: 20, collected: false });
  marioCoins.push({ x: 1100, y: 180, width: 20, height: 20, collected: false });
  marioCoins.push({ x: 1200, y: 200, width: 20, height: 20, collected: false });
  marioCoins.push({ x: 1480, y: 180, width: 20, height: 20, collected: false });
  marioCoins.push({ x: 1700, y: 150, width: 20, height: 20, collected: false });
  marioCoins.push({ x: 1800, y: 180, width: 20, height: 20, collected: false });
  marioCoins.push({ x: 2150, y: 150, width: 20, height: 20, collected: false });

  marioCoins.push({ x: 150, y: 400, width: 20, height: 20, collected: false });
  marioCoins.push({ x: 320, y: 400, width: 20, height: 20, collected: false });
  marioCoins.push({ x: 550, y: 400, width: 20, height: 20, collected: false });
  marioCoins.push({ x: 750, y: 400, width: 20, height: 20, collected: false });
  marioCoins.push({ x: 1100, y: 400, width: 20, height: 20, collected: false });
  marioCoins.push({ x: 1150, y: 400, width: 20, height: 20, collected: false });
  marioCoins.push({ x: 1300, y: 400, width: 20, height: 20, collected: false });
  marioCoins.push({ x: 1420, y: 400, width: 20, height: 20, collected: false });
  marioCoins.push({ x: 1750, y: 400, width: 20, height: 20, collected: false });
  marioCoins.push({ x: 1950, y: 400, width: 20, height: 20, collected: false });

  marioEnemies.push({
    x: 550,
    y: 398,
    width: 30,
    height: 30,
    vx: 1,
    type: "goomba",
  });
  marioEnemies.push({
    x: 750,
    y: 398,
    width: 30,
    height: 30,
    vx: -1,
    type: "goomba",
  });
  marioEnemies.push({
    x: 1100,
    y: 398,
    width: 30,
    height: 30,
    vx: -1,
    type: "goomba",
  });
  marioEnemies.push({
    x: 1700,
    y: 398,
    width: 30,
    height: 30,
    vx: -1,
    type: "goomba",
  });
  marioEnemies.push({
    x: 2100,
    y: 398,
    width: 30,
    height: 30,
    vx: -1,
    type: "goomba",
  });

  marioFlag.touched = false;
}

function createMarioSecretLevel() {
  marioPlatforms = [];
  marioCoins = [];
  marioEnemies = [];
  marioPipes = [];
  marioFireballs = [];

  marioPlatforms.push({
    x: 0,
    y: 430,
    width: 1200,
    height: 50,
    type: "ground",
  });

  var pisarioCoins = [
    { x: 150, y: 250 },
    { x: 150, y: 280 },
    { x: 150, y: 310 },
    { x: 150, y: 340 },
    { x: 150, y: 370 },
    { x: 180, y: 250 },
    { x: 210, y: 250 },
    { x: 240, y: 250 },
    { x: 240, y: 280 },
    { x: 240, y: 310 },
    { x: 210, y: 310 },
    { x: 180, y: 310 },

    { x: 280, y: 250 },
    { x: 280, y: 280 },
    { x: 280, y: 310 },
    { x: 280, y: 340 },
    { x: 280, y: 370 },

    { x: 320, y: 250 },
    { x: 350, y: 250 },
    { x: 380, y: 250 },
    { x: 320, y: 280 },
    { x: 320, y: 310 },
    { x: 350, y: 310 },
    { x: 380, y: 310 },
    { x: 380, y: 340 },
    { x: 320, y: 370 },
    { x: 350, y: 370 },
    { x: 380, y: 370 },

    { x: 450, y: 280 },
    { x: 450, y: 310 },
    { x: 450, y: 340 },
    { x: 450, y: 370 },
    { x: 480, y: 250 },
    { x: 510, y: 280 },
    { x: 510, y: 310 },
    { x: 510, y: 340 },
    { x: 510, y: 370 },
    { x: 480, y: 310 },

    { x: 550, y: 250 },
    { x: 550, y: 280 },
    { x: 550, y: 310 },
    { x: 550, y: 340 },
    { x: 550, y: 370 },
    { x: 580, y: 250 },
    { x: 610, y: 250 },
    { x: 640, y: 280 },
    { x: 580, y: 310 },
    { x: 610, y: 310 },
    { x: 640, y: 340 },
    { x: 640, y: 370 },

    { x: 680, y: 250 },
    { x: 680, y: 280 },
    { x: 680, y: 310 },
    { x: 680, y: 340 },
    { x: 680, y: 370 },

    { x: 720, y: 250 },
    { x: 750, y: 250 },
    { x: 780, y: 250 },
    { x: 720, y: 280 },
    { x: 780, y: 280 },
    { x: 720, y: 310 },
    { x: 780, y: 310 },
    { x: 720, y: 340 },
    { x: 780, y: 340 },
    { x: 720, y: 370 },
    { x: 750, y: 370 },
    { x: 780, y: 370 },
  ];

  for (var i = 0; i < pisarioCoins.length; i++) {
    marioCoins.push({
      x: pisarioCoins[i].x,
      y: pisarioCoins[i].y,
      width: 20,
      height: 20,
      collected: false,
    });
  }

  marioPrincess.x = 800;
  marioPrincess.y = 380;
  marioPrincess.active = true;

  marioPlayer.x = 100;
  marioPlayer.y = 350;
  marioPlayer.vx = 0;
  marioPlayer.vy = 0;
  marioCamera.x = 0;

  marioLakitu.x = -500;
}

function handleMarioKeyDown(e) {
  if (!marioActive || marioGameOver || marioWon) return;

  if (e.key === "ArrowLeft") marioKeys.left = true;
  if (e.key === "ArrowRight") marioKeys.right = true;
  if (e.key === "ArrowDown") {
    if (!marioInSecretLevel && marioPipes.length > 2) {
      var pipe = marioPipes[2];
      if (
        marioPlayer.onGround &&
        marioPlayer.x + marioPlayer.width > pipe.x &&
        marioPlayer.x < pipe.x + pipe.width &&
        Math.abs(marioPlayer.y + marioPlayer.height - pipe.y) < 10
      ) {
        marioEnteringPipe = true;
        marioPipeAnimationTimer = 0;
        playBeep(440, 0.3);
      }
    }
  }
  if (e.key === " ") {
    if (marioPlayer.onGround) {
      marioPlayer.vy = MARIO_JUMP_POWER;
      marioPlayer.onGround = false;
      playBeep(440, 0.1);
    }
    e.preventDefault();
  }
}

function handleMarioKeyUp(e) {
  if (e.key === "ArrowLeft") marioKeys.left = false;
  if (e.key === "ArrowRight") marioKeys.right = false;
  if (e.key === " ") marioKeys.jump = false;
}

function marioGameLoop() {
  if (!marioActive) return;

  updateMario();
  renderMario();
}

function updateMario() {
  if (marioGameOver || marioWon) return;

  if (marioEnteringPipe) {
    marioPipeAnimationTimer++;
    marioPlayer.y += 2;

    if (marioPipeAnimationTimer > 30) {
      marioEnteringPipe = false;
      marioInSecretLevel = true;
      createMarioSecretLevel();
      playBeep(880, 0.2);
    }
    return;
  }

  if (marioKeys.left) {
    marioPlayer.vx = -MARIO_MOVE_SPEED;
    marioPlayer.facingRight = false;
  } else if (marioKeys.right) {
    marioPlayer.vx = MARIO_MOVE_SPEED;
    marioPlayer.facingRight = true;
  } else {
    marioPlayer.vx = 0;
  }

  marioPlayer.vy += MARIO_GRAVITY;

  marioPlayer.x += marioPlayer.vx;
  marioPlayer.y += marioPlayer.vy;

  if (marioPlayer.x < 0) marioPlayer.x = 0;
  if (marioPlayer.x + marioPlayer.width > MARIO_LEVEL_WIDTH) {
    marioPlayer.x = MARIO_LEVEL_WIDTH - marioPlayer.width;
  }

  marioPlayer.onGround = false;
  for (var i = 0; i < marioPlatforms.length; i++) {
    var platform = marioPlatforms[i];

    if (checkMarioCollision(marioPlayer, platform)) {
      if (
        marioPlayer.vy > 0 &&
        marioPlayer.y + marioPlayer.height - marioPlayer.vy <= platform.y
      ) {
        marioPlayer.y = platform.y - marioPlayer.height;
        marioPlayer.vy = 0;
        marioPlayer.onGround = true;
      } else if (
        marioPlayer.vy < 0 &&
        marioPlayer.y - marioPlayer.vy >= platform.y + platform.height
      ) {
        marioPlayer.y = platform.y + platform.height;
        marioPlayer.vy = 0;

        if (platform.type === "breakable" && !platform.broken) {
          platform.broken = true;
          marioPlayer.score += 50;
          updateMarioScore();
          playBeep(660, 0.15);

          marioPlayer.coins++;
          updateMarioScore();
        }
      } else if (
        marioPlayer.x < platform.x + platform.width &&
        marioPlayer.x + marioPlayer.width > platform.x
      ) {
        if (marioPlayer.vx > 0) {
          marioPlayer.x = platform.x - marioPlayer.width;
        } else if (marioPlayer.vx < 0) {
          marioPlayer.x = platform.x + platform.width;
        }
      }
    }
  }

  if (marioPlayer.y > MARIO_VIEWPORT_HEIGHT + 50) {
    marioPlayerDie();
    return;
  }

  if (marioPlayer.invincible) {
    marioPlayer.invincibleTimer--;
    if (marioPlayer.invincibleTimer <= 0) {
      marioPlayer.invincible = false;
    }
  }

  for (var i = 0; i < marioCoins.length; i++) {
    var coin = marioCoins[i];
    if (!coin.collected && checkMarioCollision(marioPlayer, coin)) {
      coin.collected = true;
      marioPlayer.coins++;
      marioPlayer.score += 100;
      updateMarioScore();
      playBeep(880, 0.1);
    }
  }

  for (var i = 0; i < marioPipes.length; i++) {
    var pipe = marioPipes[i];
    if (checkMarioCollision(marioPlayer, pipe)) {
      if (
        marioPlayer.vy > 0 &&
        marioPlayer.y + marioPlayer.height - marioPlayer.vy <= pipe.y
      ) {
        marioPlayer.y = pipe.y - marioPlayer.height;
        marioPlayer.vy = 0;
        marioPlayer.onGround = true;
      } else if (
        marioPlayer.x < pipe.x + pipe.width &&
        marioPlayer.x + marioPlayer.width > pipe.x
      ) {
        if (marioPlayer.vx > 0) {
          marioPlayer.x = pipe.x - marioPlayer.width;
        } else if (marioPlayer.vx < 0) {
          marioPlayer.x = pipe.x + pipe.width;
        }
      }
    }
  }

  for (var i = 0; i < marioEnemies.length; i++) {
    var enemy = marioEnemies[i];
    enemy.x += enemy.vx;

    if (enemy.x < 0 || enemy.x + enemy.width > MARIO_LEVEL_WIDTH) {
      enemy.vx *= -1;
    }

    for (var j = 0; j < marioPlatforms.length; j++) {
      var platform = marioPlatforms[j];
      if (checkMarioCollision(enemy, platform)) {
        if (enemy.vx > 0) {
          enemy.x = platform.x - enemy.width;
          enemy.vx *= -1;
        } else if (enemy.vx < 0) {
          enemy.x = platform.x + platform.width;
          enemy.vx *= -1;
        }
      }
    }

    for (var j = 0; j < marioPipes.length; j++) {
      var pipe = marioPipes[j];
      if (checkMarioCollision(enemy, pipe)) {
        if (enemy.vx > 0) {
          enemy.x = pipe.x - enemy.width;
          enemy.vx *= -1;
        } else if (enemy.vx < 0) {
          enemy.x = pipe.x + pipe.width;
          enemy.vx *= -1;
        }
      }
    }

    if (checkMarioCollision(marioPlayer, enemy)) {
      if (
        marioPlayer.vy > 0 &&
        marioPlayer.y + marioPlayer.height - 10 < enemy.y
      ) {
        marioEnemies.splice(i, 1);
        marioPlayer.vy = -8;
        marioPlayer.score += 200;
        updateMarioScore();
        playBeep(660, 0.1);
        i--;
      } else {
        marioPlayerDie();
        return;
      }
    }
  }

  if (
    !marioInSecretLevel &&
    checkMarioCollision(marioPlayer, marioFlag) &&
    !marioFlag.touched
  ) {
    marioFlag.touched = true;
    marioWon = true;
    endMario(true);
    return;
  }

  if (
    marioInSecretLevel &&
    marioPrincess.active &&
    checkMarioCollision(marioPlayer, marioPrincess)
  ) {
    marioWon = true;
    showPrincessEnding();
    return;
  }

  updateMarioCamera();

  var targetX = marioPlayer.x + 100;
  if (targetX < marioCamera.x + 200) targetX = marioCamera.x + 200;
  if (targetX > marioCamera.x + MARIO_VIEWPORT_WIDTH - 200) {
    targetX = marioCamera.x + MARIO_VIEWPORT_WIDTH - 200;
  }

  var distToTarget = Math.abs(marioLakitu.x - targetX);
  if (distToTarget > 5) {
    if (marioLakitu.x < targetX) {
      marioLakitu.x += 3;
    } else if (marioLakitu.x > targetX) {
      marioLakitu.x -= 3;
    }
  }

  marioLakitu.throwTimer++;
  if (marioLakitu.throwTimer >= marioLakitu.throwInterval) {
    marioLakitu.throwTimer = 0;

    var dx = marioPlayer.x - marioLakitu.x;
    var dy = marioPlayer.y - marioLakitu.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    var speed = 5;

    marioFireballs.push({
      x: marioLakitu.x + 15,
      y: marioLakitu.y + 30,
      width: 16,
      height: 16,
      vx: (dx / distance) * speed,
      vy: (dy / distance) * speed,
    });
    playBeep(220, 0.1);
  }

  for (var i = marioFireballs.length - 1; i >= 0; i--) {
    var fireball = marioFireballs[i];
    fireball.x += fireball.vx;
    fireball.y += fireball.vy;

    if (
      fireball.y > MARIO_VIEWPORT_HEIGHT + 50 ||
      fireball.x < 0 ||
      fireball.x > MARIO_LEVEL_WIDTH
    ) {
      marioFireballs.splice(i, 1);
      continue;
    }

    if (checkMarioCollision(marioPlayer, fireball)) {
      marioFireballs.splice(i, 1);
      marioPlayerDie();
      return;
    }
  }
}

function updateMarioCamera() {
  marioCamera.x = marioPlayer.x - MARIO_VIEWPORT_WIDTH / 3;

  if (marioCamera.x < 0) marioCamera.x = 0;
  if (marioCamera.x > MARIO_LEVEL_WIDTH - MARIO_VIEWPORT_WIDTH) {
    marioCamera.x = MARIO_LEVEL_WIDTH - MARIO_VIEWPORT_WIDTH;
  }
}

function checkMarioCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

function marioPlayerDie() {
  marioPlayer.lives--;
  updateMarioScore();
  playBeep(220, 0.5);

  marioKeys.left = false;
  marioKeys.right = false;
  marioKeys.jump = false;

  if (marioPlayer.lives <= 0) {
    marioGameOver = true;
    endMario(false);
  } else {
    marioPlayer.x = 50;
    marioPlayer.y = 350;
    marioPlayer.vx = 0;
    marioPlayer.vy = 0;
    marioCamera.x = 0;
  }
}

function updateMarioScore() {
  var hearts = "❤️".repeat(marioPlayer.lives);
  document.getElementById("game-score").textContent =
    hearts +
    " | MONETY: " +
    marioPlayer.coins +
    " | PUNKTY: " +
    marioPlayer.score;
}

function renderMario() {
  marioCtx.fillStyle = "#5C94FC";
  marioCtx.fillRect(0, 0, MARIO_VIEWPORT_WIDTH, MARIO_VIEWPORT_HEIGHT);

  marioCtx.fillStyle = "#FFFFFF";
  for (var i = 0; i < 5; i++) {
    var cloudX = (i * 500 - marioCamera.x * 0.5) % (MARIO_VIEWPORT_WIDTH + 200);
    marioCtx.fillRect(cloudX, 50 + i * 30, 60, 30);
    marioCtx.fillRect(cloudX + 20, 40 + i * 30, 60, 30);
  }

  for (var i = 0; i < marioPlatforms.length; i++) {
    var platform = marioPlatforms[i];
    var screenX = platform.x - marioCamera.x;

    if (screenX + platform.width > 0 && screenX < MARIO_VIEWPORT_WIDTH) {
      if (platform.type === "ground") {
        marioCtx.fillStyle = "#8B4513";
        marioCtx.fillRect(screenX, platform.y, platform.width, platform.height);
        marioCtx.strokeStyle = "#654321";
        marioCtx.lineWidth = 2;
        marioCtx.strokeRect(
          screenX,
          platform.y,
          platform.width,
          platform.height
        );
      } else if (platform.type === "breakable") {
        if (platform.broken) {
          continue;
        } else {
          marioCtx.fillStyle = "#F5B800";
          marioCtx.fillRect(
            screenX,
            platform.y,
            platform.width,
            platform.height
          );

          marioCtx.strokeStyle = "#D89000";
          marioCtx.lineWidth = 3;
          marioCtx.strokeRect(
            screenX,
            platform.y,
            platform.width,
            platform.height
          );

          marioCtx.fillStyle = "#FFF";
          marioCtx.font = "bold 20px Arial";
          marioCtx.textAlign = "center";
          marioCtx.textBaseline = "middle";
          marioCtx.fillText(
            "?",
            screenX + platform.width / 2,
            platform.y + platform.height / 2
          );
          marioCtx.textAlign = "left";
          marioCtx.textBaseline = "alphabetic";
        }
      } else {
        marioCtx.fillStyle = "#D84B20";
        marioCtx.fillRect(screenX, platform.y, platform.width, platform.height);

        marioCtx.strokeStyle = "#A03410";
        marioCtx.lineWidth = 2;
        marioCtx.strokeRect(
          screenX,
          platform.y,
          platform.width,
          platform.height
        );

        marioCtx.strokeStyle = "#E85A30";
        marioCtx.lineWidth = 1;
        marioCtx.beginPath();
        marioCtx.moveTo(screenX + 5, platform.y + 5);
        marioCtx.lineTo(screenX + platform.width - 5, platform.y + 5);
        marioCtx.moveTo(screenX + 5, platform.y + platform.height - 5);
        marioCtx.lineTo(
          screenX + platform.width - 5,
          platform.y + platform.height - 5
        );
        marioCtx.stroke();
      }
    }
  }

  for (var i = 0; i < marioPipes.length; i++) {
    var pipe = marioPipes[i];
    var screenX = pipe.x - marioCamera.x;

    if (screenX + pipe.width > 0 && screenX < MARIO_VIEWPORT_WIDTH) {
      marioCtx.fillStyle = "#00A651";
      marioCtx.fillRect(screenX, pipe.y, pipe.width, pipe.height);

      marioCtx.fillStyle = "#00C965";
      marioCtx.fillRect(screenX - 5, pipe.y - 8, pipe.width + 10, 8);

      marioCtx.strokeStyle = "#008040";
      marioCtx.lineWidth = 2;
      marioCtx.strokeRect(screenX, pipe.y, pipe.width, pipe.height);
      marioCtx.strokeRect(screenX - 5, pipe.y - 8, pipe.width + 10, 8);

      marioCtx.fillStyle = "#008040";
      marioCtx.fillRect(screenX + pipe.width - 8, pipe.y, 8, pipe.height);
    }
  }

  for (var i = 0; i < marioCoins.length; i++) {
    var coin = marioCoins[i];
    if (!coin.collected) {
      var screenX = coin.x - marioCamera.x;
      if (screenX + coin.width > 0 && screenX < MARIO_VIEWPORT_WIDTH) {
        marioCtx.fillStyle = "#FFED00";
        marioCtx.beginPath();
        marioCtx.arc(
          screenX + coin.width / 2,
          coin.y + coin.height / 2,
          coin.width / 2,
          0,
          Math.PI * 2
        );
        marioCtx.fill();
        marioCtx.strokeStyle = "#FFA500";
        marioCtx.lineWidth = 2;
        marioCtx.stroke();
      }
    }
  }

  var flagScreenX = marioFlag.x - marioCamera.x;
  if (flagScreenX + marioFlag.width > 0 && flagScreenX < MARIO_VIEWPORT_WIDTH) {
    marioCtx.fillStyle = "#8B4513";
    marioCtx.fillRect(
      flagScreenX,
      marioFlag.y,
      marioFlag.width,
      marioFlag.height
    );

    marioCtx.fillStyle = "#0095DA";
    if (marioFlag.touched) {
      marioCtx.fillRect(flagScreenX + 10, marioFlag.y + 120, 40, 30);
    } else {
      marioCtx.fillRect(flagScreenX + 10, marioFlag.y, 40, 30);
    }

    marioCtx.strokeStyle = "#000";
    marioCtx.lineWidth = 2;
    if (marioFlag.touched) {
      marioCtx.strokeRect(flagScreenX + 10, marioFlag.y + 120, 40, 30);
    } else {
      marioCtx.strokeRect(flagScreenX + 10, marioFlag.y, 40, 30);
    }

    marioCtx.fillStyle = "#FFF";
    marioCtx.font = "bold 20px Arial";
    marioCtx.textAlign = "center";
    marioCtx.textBaseline = "middle";
    if (marioFlag.touched) {
      marioCtx.fillText("P", flagScreenX + 30, marioFlag.y + 135);
    } else {
      marioCtx.fillText("P", flagScreenX + 30, marioFlag.y + 15);
    }
    marioCtx.textAlign = "left";
    marioCtx.textBaseline = "alphabetic";
  }

  var lakituScreenX = marioLakitu.x - marioCamera.x;
  if (
    !marioInSecretLevel &&
    lakituScreenX + marioLakitu.width > 0 &&
    lakituScreenX < MARIO_VIEWPORT_WIDTH
  ) {
    marioCtx.fillStyle = "#FFF";
    marioCtx.beginPath();
    marioCtx.ellipse(
      lakituScreenX + 20,
      marioLakitu.y + 25,
      22,
      12,
      0,
      0,
      Math.PI * 2
    );
    marioCtx.fill();
    marioCtx.strokeStyle = "#000";
    marioCtx.lineWidth = 2;
    marioCtx.stroke();

    marioCtx.fillStyle = "#00A651";
    marioCtx.fillRect(lakituScreenX + 12, marioLakitu.y, 16, 20);

    marioCtx.fillStyle = "#000";
    marioCtx.fillRect(lakituScreenX + 13, marioLakitu.y + 5, 6, 4);
    marioCtx.fillRect(lakituScreenX + 21, marioLakitu.y + 5, 6, 4);

    marioCtx.strokeStyle = "#8B4513";
    marioCtx.lineWidth = 2;
    marioCtx.beginPath();
    marioCtx.moveTo(lakituScreenX + 20, marioLakitu.y + 10);
    marioCtx.lineTo(lakituScreenX + 20, marioLakitu.y + 20);
    marioCtx.stroke();
  }

  for (var i = 0; i < marioFireballs.length; i++) {
    var fireball = marioFireballs[i];
    var fireballScreenX = fireball.x - marioCamera.x;
    if (
      fireballScreenX + fireball.width > 0 &&
      fireballScreenX < MARIO_VIEWPORT_WIDTH
    ) {
      marioCtx.fillStyle = "#FF4500";
      marioCtx.beginPath();
      marioCtx.arc(
        fireballScreenX + fireball.width / 2,
        fireball.y + fireball.height / 2,
        fireball.width / 2,
        0,
        Math.PI * 2
      );
      marioCtx.fill();

      marioCtx.fillStyle = "#FFA500";
      marioCtx.beginPath();
      marioCtx.arc(
        fireballScreenX + fireball.width / 2,
        fireball.y + fireball.height / 2,
        fireball.width / 3,
        0,
        Math.PI * 2
      );
      marioCtx.fill();
    }
  }

  for (var i = 0; i < marioEnemies.length; i++) {
    var enemy = marioEnemies[i];
    var screenX = enemy.x - marioCamera.x;

    if (screenX + enemy.width > 0 && screenX < MARIO_VIEWPORT_WIDTH) {
      marioCtx.fillStyle = "#8B4513";
      marioCtx.fillRect(screenX, enemy.y, enemy.width, enemy.height);

      marioCtx.fillStyle = "#FFF";
      marioCtx.fillRect(screenX + 5, enemy.y + 8, 8, 8);
      marioCtx.fillRect(screenX + 17, enemy.y + 8, 8, 8);

      marioCtx.fillStyle = "#000";
      marioCtx.fillRect(screenX + 7, enemy.y + 10, 4, 4);
      marioCtx.fillRect(screenX + 19, enemy.y + 10, 4, 4);
    }
  }

  if (marioInSecretLevel && marioPrincess.active) {
    var princessScreenX = marioPrincess.x - marioCamera.x;
    if (
      princessScreenX + marioPrincess.width > 0 &&
      princessScreenX < MARIO_VIEWPORT_WIDTH
    ) {
      marioCtx.fillStyle = "#FFC0CB";
      marioCtx.fillRect(princessScreenX + 5, marioPrincess.y + 20, 30, 30);

      marioCtx.fillStyle = "#FFD9B3";
      marioCtx.fillRect(princessScreenX + 10, marioPrincess.y + 5, 20, 18);

      marioCtx.fillStyle = "#FFD700";
      marioCtx.fillRect(princessScreenX + 8, marioPrincess.y, 24, 6);
      marioCtx.fillRect(princessScreenX + 10, marioPrincess.y - 3, 4, 4);
      marioCtx.fillRect(princessScreenX + 18, marioPrincess.y - 3, 4, 4);
      marioCtx.fillRect(princessScreenX + 26, marioPrincess.y - 3, 4, 4);

      marioCtx.fillStyle = "#FFD700";
      marioCtx.fillRect(princessScreenX + 8, marioPrincess.y + 6, 24, 10);

      marioCtx.fillStyle = "#000";
      marioCtx.fillRect(princessScreenX + 14, marioPrincess.y + 12, 2, 2);
      marioCtx.fillRect(princessScreenX + 24, marioPrincess.y + 12, 2, 2);

      marioCtx.fillStyle = "#FFF";
      marioCtx.font = "bold 16px Arial";
      marioCtx.textAlign = "center";
      marioCtx.fillText("!", princessScreenX + 20, marioPrincess.y - 10);
      marioCtx.textAlign = "left";
    }
  }

  var marioScreenX = marioPlayer.x - marioCamera.x;
  var flash =
    marioPlayer.invincible &&
    Math.floor(marioPlayer.invincibleTimer / 10) % 2 === 0;

  if (!marioEnteringPipe && !flash) {
    var bodyHeight = marioPlayer.big ? 20 : 14;
    var headY = marioPlayer.big ? marioPlayer.y + 6 : marioPlayer.y + 8;
    var capY = marioPlayer.big ? marioPlayer.y + 2 : marioPlayer.y + 6;

    marioCtx.fillStyle = "#0095DA";
    if (marioPlayer.big) {
      marioCtx.fillRect(marioScreenX + 6, marioPlayer.y + 18, 20, bodyHeight);
    } else {
      marioCtx.fillRect(marioScreenX + 8, marioPlayer.y + 16, 16, bodyHeight);
    }

    marioCtx.fillStyle = "#FFD9B3";
    marioCtx.fillRect(marioScreenX + 10, headY, 12, 12);

    marioCtx.fillStyle = "#0095DA";
    marioCtx.fillRect(marioScreenX + 8, capY, 16, 6);

    marioCtx.fillStyle = "#FFF";
    marioCtx.font = "bold 10px Arial";
    marioCtx.fillText("P", marioScreenX + 13, capY + 5);

    marioCtx.fillStyle = "#000";
    marioCtx.fillRect(marioScreenX + 12, headY + 6, 8, 2);

    marioCtx.fillStyle = "#000";
    marioCtx.fillRect(marioScreenX + 12, headY + 3, 2, 2);
    marioCtx.fillRect(marioScreenX + 18, headY + 3, 2, 2);

    marioCtx.fillStyle = "#FFD9B3";
    marioCtx.fillRect(marioScreenX + 4, marioPlayer.y + 20, 4, 8);
    marioCtx.fillRect(marioScreenX + 24, marioPlayer.y + 20, 4, 8);

    marioCtx.fillStyle = "#0095DA";
    if (marioPlayer.big) {
      marioCtx.fillRect(marioScreenX + 8, marioPlayer.y + 38, 7, 10);

      marioCtx.fillRect(marioScreenX + 17, marioPlayer.y + 38, 7, 10);
    } else {
      marioCtx.fillRect(marioScreenX + 10, marioPlayer.y + 30, 5, 8);

      marioCtx.fillRect(marioScreenX + 17, marioPlayer.y + 30, 5, 8);
    }

    marioCtx.fillStyle = "#8B4513";
    if (marioPlayer.big) {
      marioCtx.fillRect(marioScreenX + 6, marioPlayer.y + 46, 9, 2);

      marioCtx.fillRect(marioScreenX + 17, marioPlayer.y + 46, 9, 2);
    } else {
      marioCtx.fillRect(marioScreenX + 8, marioPlayer.y + 36, 7, 2);

      marioCtx.fillRect(marioScreenX + 17, marioPlayer.y + 36, 7, 2);
    }
  }

  if (marioGameOver || marioWon) {
    marioCtx.fillStyle = "rgba(0, 0, 0, 0.7)";
    marioCtx.fillRect(0, 0, MARIO_VIEWPORT_WIDTH, MARIO_VIEWPORT_HEIGHT);

    marioCtx.fillStyle = "#FFED00";
    marioCtx.font = "bold 48px Arial";
    marioCtx.textAlign = "center";
    var text = marioWon ? "WYGRANA!" : "KONIEC GRY";
    marioCtx.fillText(
      text,
      MARIO_VIEWPORT_WIDTH / 2,
      MARIO_VIEWPORT_HEIGHT / 2 - 20
    );

    marioCtx.fillStyle = "#FFF";
    marioCtx.font = "bold 24px Arial";
    marioCtx.fillText(
      "WYNIK: " + marioPlayer.score,
      MARIO_VIEWPORT_WIDTH / 2,
      MARIO_VIEWPORT_HEIGHT / 2 + 30
    );
    marioCtx.textAlign = "left";
  }
}

function showPrincessEnding() {
  marioActive = false;
  clearInterval(marioInterval);

  document.removeEventListener("keydown", handleMarioKeyDown);
  document.removeEventListener("keyup", handleMarioKeyUp);

  marioKeys.left = false;
  marioKeys.right = false;
  marioKeys.jump = false;

  // Zapisz wynik i oznacz jako wygraną
  saveBestScore("mario_score", marioPlayer.score, false);
  incrementGameWon();

  var gameContent = document.getElementById("game-content");

  gameContent.innerHTML = `
    <div style="
      max-width: 600px;
      margin: 0 auto;
      padding: 30px;
      text-align: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border: 4px solid var(--yellow);
      border-radius: 15px;
    ">
      <h2 style="
        font-size: 24px;
        color: var(--yellow);
        margin-bottom: 30px;
        text-shadow: 2px 2px 0 #000;
      ">👑 SEKRETNE ZAKOŃCZENIE! 👑</h2>
      
      <div style="
        background: rgba(0,0,0,0.4);
        padding: 25px;
        border-radius: 10px;
        margin-bottom: 25px;
        border: 2px solid var(--yellow);
      ">
        <div style="font-size: 60px; margin-bottom: 20px;">
          👸💕
        </div>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--white);
          margin-bottom: 15px;
        ">
          <strong style="color: var(--yellow);">KSIĘŻNICZKA:</strong><br/>
          "Udało Ci się! Uratowałeś mnie! 🥰"
        </p>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--white);
          margin-bottom: 15px;
        ">
          "Proszę, oto nagroda:<br/>
          <span style="color: var(--red); font-weight: bold;">całus</span> 💋<br/>
          i <span style="color: var(--green); font-weight: bold;">oryginalny Game Boy!</span> 🟢"
        </p>
        
        <div style="font-size: 50px; margin: 20px 0;">
          🎮✨
        </div>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--yellow);
          margin-bottom: 10px;
          font-weight: bold;
        ">
          PISARIO:
        </p>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--white);
        ">
          "Game Boy?! TO MOJE! 🏃💨"<br/>
          <em style="font-size: 9px; color: var(--gray);">*Zabiera Game Boya i ucieka*</em>
        </p>
      </div>
      
      <div style="
        background: rgba(255, 193, 7, 0.2);
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 25px;
        border: 2px solid var(--yellow);
      ">
        <p style="
          font-size: 10px;
          color: var(--yellow);
          margin-bottom: 8px;
          font-weight: bold;
        ">
          🎉 GRATULACJE! 🎉
        </p>
        <p style="
          font-size: 9px;
          color: var(--white);
          line-height: 1.6;
        ">
          Odkryłeś sekretne zakończenie!<br/>
          Punkty: ${marioPlayer.score} | Monety: ${marioPlayer.coins}
        </p>
      </div>
      
      <button class="btn-play" onclick="startMario()">ZAGRAJ PONOWNIE</button>
    </div>
  `;

  unlockAchievement("secret_ending");
  if (marioPlayer.coins >= 20) {
    unlockAchievement("coin_collector");
  }
  addCompletedGame("mario");

  addCoins(10);
  showToast("+10 🪙 za sekretne zakończenie!");

  playWinSound();
}

function endMario(won) {
  marioActive = false;
  clearInterval(marioInterval);

  document.removeEventListener("keydown", handleMarioKeyDown);
  document.removeEventListener("keyup", handleMarioKeyUp);

  marioKeys.left = false;
  marioKeys.right = false;
  marioKeys.jump = false;

  // Zapisz wynik niezależnie od wyniku gry
  saveBestScore("mario_score", marioPlayer.score, false);

  if (won) {
    incrementGameWon();
  } else {
    incrementGameLost();
  }

  var gameContent = document.getElementById("game-content");

  if (won) {
    gameContent.innerHTML = `
      <div style="text-align: center;">
        <h2 style="font-size: 32px; color: var(--green); margin-bottom: 20px;">
          🏆 WYGRANA! 🏆
        </h2>
        <p style="font-size: 14px; color: var(--dark-gray); margin-bottom: 15px;">
          Ukończyłeś poziom!
        </p>
        <div style="font-size: 48px; margin: 20px 0;">
          🍄
        </div>
        <p style="font-size: 12px; color: var(--purple); margin-bottom: 10px;">
          PUNKTY: ${marioPlayer.score} | MONETY: ${marioPlayer.coins}
        </p>
        <button class="btn-play" onclick="startMario()">ZAGRAJ PONOWNIE</button>
      </div>
    `;

    if (marioPlayer.coins >= 20) {
      unlockAchievement("coin_collector");
    }
    addCompletedGame("mario");

    addCoins(10);
    showToast("+10 🪙 za ukończenie Mario!");

    playWinSound();
  } else {
    gameContent.innerHTML = `
      <div style="text-align: center;">
        <h2 style="font-size: 24px; color: var(--red); margin-bottom: 20px;">
          💀 KONIEC GRY 💀
        </h2>
        <p style="font-size: 14px; color: var(--dark-gray); margin-bottom: 15px;">
          Spróbuj jeszcze raz!
        </p>
        <div style="font-size: 48px; margin: 20px 0;">
          😢
        </div>
        <p style="font-size: 12px; color: var(--purple); margin-bottom: 10px;">
          PUNKTY: ${marioPlayer.score} | MONETY: ${marioPlayer.coins}
        </p>
        <button class="btn-play" onclick="startMario()">ZAGRAJ PONOWNIE</button>
      </div>
    `;

    playBeep(220, 0.5);
  }
}

function stopMario() {
  marioActive = false;
  if (marioInterval) clearInterval(marioInterval);
  document.removeEventListener("keydown", handleMarioKeyDown);
  document.removeEventListener("keyup", handleMarioKeyUp);

  marioKeys.left = false;
  marioKeys.right = false;
  marioKeys.jump = false;

  marioInSecretLevel = false;
  marioEnteringPipe = false;
  marioPrincess.active = false;
}
