// mario.js - Gra: SUPER PISARIO (Platformówka)

let marioActive = false;
let marioCanvas;
let marioCtx;
let marioAnimationId;

// Rozmiary
const MARIO_WIDTH = 800;
const MARIO_HEIGHT = 400;

// Gracz
let mario = {
  x: 50,
  y: 300,
  width: 32,
  height: 32,
  vx: 0,
  vy: 0,
  grounded: false,
  color: "#E60012",
};

// Fizyka
const GRAVITY = 0.5;
const JUMP_POWER = -12;
const MOVE_SPEED = 4;

// Platformy
let platforms = [];

// Przeciwnicy
let enemies = [];

// Flaga (cel)
let flag = { x: 750, y: 250, width: 20, height: 100 };

// Klawisze
let keys = {};

// Funkcja startowania Mario
function startMario() {
  marioActive = true;

  // Ustaw tytuł gry
  document.getElementById("game-title").textContent = "SUPER PISARIO";
  document.getElementById("game-score").textContent = "POZIOM 1";

  // Stwórz canvas
  const gameContent = document.getElementById("game-content");
  gameContent.innerHTML = `
        <canvas id="mario-canvas" width="${MARIO_WIDTH}" height="${MARIO_HEIGHT}" 
                style="border: 4px solid var(--dark-gray); border-radius: 10px; background: #87CEEB;">
        </canvas>
        <p style="text-align: center; margin-top: 10px; font-size: 8px; color: var(--gray);">
            Strzałki: ruch | Spacja: skok
        </p>
    `;

  marioCanvas = document.getElementById("mario-canvas");
  marioCtx = marioCanvas.getContext("2d");

  // Reset gracza
  mario = {
    x: 50,
    y: 300,
    width: 32,
    height: 32,
    vx: 0,
    vy: 0,
    grounded: false,
    color: "#E60012",
  };

  // Stwórz poziom
  createMarioLevel();

  // Sterowanie
  document.addEventListener("keydown", handleMarioKeydown);
  document.addEventListener("keyup", handleMarioKeyup);

  // Start pętli gry
  marioGameLoop();
}

// Funkcja tworzenia poziomu
function createMarioLevel() {
  platforms = [
    // Ziemia
    { x: 0, y: 370, width: 300, height: 30, color: "#00A651" },
    { x: 350, y: 370, width: 200, height: 30, color: "#00A651" },
    { x: 600, y: 370, width: 200, height: 30, color: "#00A651" },

    // Platformy w powietrzu
    { x: 250, y: 280, width: 100, height: 20, color: "#8C8C8C" },
    { x: 450, y: 250, width: 100, height: 20, color: "#8C8C8C" },
    { x: 650, y: 200, width: 100, height: 20, color: "#8C8C8C" },
  ];

  enemies = [
    { x: 400, y: 338, width: 32, height: 32, vx: 1, color: "#8B4C98" },
    { x: 650, y: 338, width: 32, height: 32, vx: -1, color: "#8B4C98" },
  ];
}

// Funkcja obsługi klawiszy (down)
function handleMarioKeydown(e) {
  if (!marioActive) return;

  keys[e.key] = true;

  if (e.key === " " || e.key === "ArrowUp") {
    if (mario.grounded) {
      mario.vy = JUMP_POWER;
      mario.grounded = false;
      playBeep(660, 0.1);
    }
    e.preventDefault();
  }
}

// Funkcja obsługi klawiszy (up)
function handleMarioKeyup(e) {
  keys[e.key] = false;
}

// Funkcja pętli gry
function marioGameLoop() {
  if (!marioActive) return;

  // Sterowanie poziome
  if (keys["ArrowLeft"]) {
    mario.vx = -MOVE_SPEED;
  } else if (keys["ArrowRight"]) {
    mario.vx = MOVE_SPEED;
  } else {
    mario.vx = 0;
  }

  // Grawitacja
  mario.vy += GRAVITY;

  // Ruch
  mario.x += mario.vx;
  mario.y += mario.vy;

  // Reset grounded
  mario.grounded = false;

  // Kolizje z platformami
  platforms.forEach((platform) => {
    if (checkCollision(mario, platform)) {
      // Od góry (lądowanie)
      if (mario.vy > 0 && mario.y + mario.height - mario.vy < platform.y + 5) {
        mario.y = platform.y - mario.height;
        mario.vy = 0;
        mario.grounded = true;
      }
      // Od dołu (uderzenie głową)
      else if (
        mario.vy < 0 &&
        mario.y - mario.vy > platform.y + platform.height
      ) {
        mario.y = platform.y + platform.height;
        mario.vy = 0;
      }
      // Od boku
      else {
        if (mario.vx > 0) {
          mario.x = platform.x - mario.width;
        } else if (mario.vx < 0) {
          mario.x = platform.x + platform.width;
        }
      }
    }
  });

  // Ruch przeciwników
  enemies.forEach((enemy) => {
    enemy.x += enemy.vx;

    // Odbicie od krawędzi platform
    platforms.forEach((platform) => {
      if (
        enemy.y + enemy.height >= platform.y &&
        enemy.y + enemy.height <= platform.y + platform.height
      ) {
        if (
          enemy.x <= platform.x ||
          enemy.x + enemy.width >= platform.x + platform.width
        ) {
          enemy.vx *= -1;
        }
      }
    });
  });

  // Kolizje z przeciwnikami
  enemies = enemies.filter((enemy) => {
    if (checkCollision(mario, enemy)) {
      // Skok na przeciwnika (zabicie)
      if (mario.vy > 0 && mario.y + mario.height - mario.vy < enemy.y + 10) {
        mario.vy = -8;
        playBeep(880, 0.1);
        return false; // Usuń przeciwnika
      } else {
        // Śmierć gracza
        endMario(false);
        return true;
      }
    }
    return true;
  });

  // Sprawdź upadek w dziurę
  if (mario.y > MARIO_HEIGHT) {
    endMario(false);
    return;
  }

  // Sprawdź dotknięcie flagi
  if (checkCollision(mario, flag)) {
    endMario(true);
    return;
  }

  // Rysuj
  drawMario();

  // Następna klatka
  marioAnimationId = requestAnimationFrame(marioGameLoop);
}

// Funkcja rysowania
function drawMario() {
  // Wyczyść canvas
  marioCtx.fillStyle = "#87CEEB";
  marioCtx.fillRect(0, 0, MARIO_WIDTH, MARIO_HEIGHT);

  // Rysuj platformy
  platforms.forEach((platform) => {
    marioCtx.fillStyle = platform.color;
    marioCtx.fillRect(platform.x, platform.y, platform.width, platform.height);

    // Border
    marioCtx.strokeStyle = "#2C2C2C";
    marioCtx.lineWidth = 2;
    marioCtx.strokeRect(
      platform.x,
      platform.y,
      platform.width,
      platform.height
    );
  });

  // Rysuj flagę
  marioCtx.fillStyle = "#FFED00";
  marioCtx.fillRect(flag.x, flag.y, flag.width, flag.height);
  marioCtx.fillStyle = "#E60012";
  marioCtx.fillRect(flag.x, flag.y, flag.width / 2, 30);

  // Rysuj przeciwników
  enemies.forEach((enemy) => {
    marioCtx.fillStyle = enemy.color;
    marioCtx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

    // Oczy
    marioCtx.fillStyle = "white";
    marioCtx.fillRect(enemy.x + 8, enemy.y + 10, 6, 6);
    marioCtx.fillRect(enemy.x + 18, enemy.y + 10, 6, 6);
  });

  // Rysuj Mario
  marioCtx.fillStyle = mario.color;
  marioCtx.fillRect(mario.x, mario.y, mario.width, mario.height);

  // Czapka
  marioCtx.fillStyle = "#8B4C98";
  marioCtx.fillRect(mario.x + 4, mario.y, mario.width - 8, 12);
}

// Funkcja końca Mario
function endMario(won) {
  marioActive = false;
  cancelAnimationFrame(marioAnimationId);
  document.removeEventListener("keydown", handleMarioKeydown);
  document.removeEventListener("keyup", handleMarioKeyup);

  const gameContent = document.getElementById("game-content");

  if (won) {
    gameContent.innerHTML = `
            <div style="text-align: center;">
                <h2 style="font-size: 24px; color: var(--green); margin-bottom: 20px;">
                    🎉 UKOŃCZONO! 🎉
                </h2>
                <p style="font-size: 14px; color: var(--dark-gray); margin-bottom: 15px;">
                    Dotarłeś do flagi!
                </p>
                <p style="font-size: 12px; color: var(--blue); margin-bottom: 20px;">
                    SUPER PISARIO!
                </p>
                <button class="btn-play" onclick="startMario()">ZAGRAJ PONOWNIE</button>
            </div>
        `;

    // Dodaj do ukończonych gier
    addCompletedGame("mario");

    // Odblokuj osiągnięcie
    unlockAchievement("super_pisario");

    playWinSound();
  } else {
    gameContent.innerHTML = `
            <div style="text-align: center;">
                <h2 style="font-size: 24px; color: var(--red); margin-bottom: 20px;">
                    💀 PRZEGRANA 💀
                </h2>
                <p style="font-size: 14px; color: var(--dark-gray); margin-bottom: 20px;">
                    Spróbuj ponownie!
                </p>
                <button class="btn-play" onclick="startMario()">RESTART</button>
            </div>
        `;

    playDeathSound();
  }
}

// Funkcja zatrzymania Mario
function stopMario() {
  marioActive = false;
  if (marioAnimationId) cancelAnimationFrame(marioAnimationId);
  document.removeEventListener("keydown", handleMarioKeydown);
  document.removeEventListener("keyup", handleMarioKeyup);
}
