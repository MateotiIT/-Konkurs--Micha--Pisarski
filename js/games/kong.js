// kong.js - Gra: PISARIO KONG (Donkey Kong 1981)

let kongActive = false;
let kongCanvas = null;
let kongCtx = null;
let kongInterval = null;
let storyShown = false;

// Wymiary canvasa
const KONG_WIDTH = 600;
const KONG_HEIGHT = 800;

// Gracz Pisario
let kongPlayer = {
  x: 50,
  y: 720,
  width: 16,
  height: 24,
  velocityX: 0,
  velocityY: 0,
  speed: 2,
  jumpPower: -8,
  onGround: false,
  onLadder: false,
  climbing: false,
  animFrame: 0,
  animTimer: 0,
  lives: 3,
  deaths: 0,
};

// Beczki
let kongBarrels = [];
let barrelSpawnTimer = 0;
let barrelSpawnInterval = 2000; // ms
let gameTime = 0;

// Poziomy
let currentLevel = 1;
const maxLevel = 3;

// Switch 2 (cel)
let kongSwitch = {
  x: 280,
  y: 50,
  width: 40,
  height: 24,
};

// Boss (rzucający beczki)
let kongBoss = {
  x: 250,
  y: 20,
  width: 50,
  height: 60,
};

// Layouts poziomów
const levelLayouts = {
  1: {
    platforms: [
      { y: 750, x1: 0, x2: 600, type: "ground" },
      { y: 650, x1: 0, x2: 500, type: "diagonal" },
      { y: 550, x1: 100, x2: 600, type: "diagonal" },
      { y: 450, x1: 0, x2: 500, type: "diagonal" },
      { y: 350, x1: 100, x2: 600, type: "diagonal" },
      { y: 250, x1: 0, x2: 500, type: "diagonal" },
      { y: 100, x1: 200, x2: 400, type: "straight" },
    ],
    ladders: [
      { x: 480, y1: 650, y2: 750 },
      { x: 20, y1: 650, y2: 750 },
      { x: 120, y1: 550, y2: 650 },
      { x: 480, y1: 550, y2: 650 },
      { x: 20, y1: 450, y2: 550 },
      { x: 480, y1: 450, y2: 550 },
      { x: 120, y1: 350, y2: 450 },
      { x: 580, y1: 350, y2: 450 },
      { x: 20, y1: 250, y2: 350 },
      { x: 480, y1: 250, y2: 350 },
      { x: 220, y1: 100, y2: 250 },
      { x: 380, y1: 100, y2: 250 },
    ],
  },
  2: {
    platforms: [
      { y: 750, x1: 0, x2: 600, type: "ground" },
      { y: 650, x1: 50, x2: 550, type: "diagonal" },
      { y: 550, x1: 50, x2: 550, type: "diagonal" },
      { y: 450, x1: 50, x2: 550, type: "diagonal" },
      { y: 350, x1: 50, x2: 550, type: "diagonal" },
      { y: 250, x1: 100, x2: 500, type: "diagonal" },
      { y: 150, x1: 100, x2: 500, type: "diagonal" },
      { y: 100, x1: 250, x2: 450, type: "straight" },
    ],
    ladders: [
      { x: 500, y1: 650, y2: 750 },
      { x: 100, y1: 650, y2: 750 },
      { x: 100, y1: 550, y2: 650 },
      { x: 500, y1: 550, y2: 650 },
      { x: 500, y1: 450, y2: 550 },
      { x: 100, y1: 450, y2: 550 },
      { x: 100, y1: 350, y2: 450 },
      { x: 500, y1: 350, y2: 450 },
      { x: 450, y1: 250, y2: 350 },
      { x: 150, y1: 250, y2: 350 },
      { x: 150, y1: 150, y2: 250 },
      { x: 450, y1: 150, y2: 250 },
      { x: 300, y1: 100, y2: 150 },
      { x: 400, y1: 100, y2: 150 },
    ],
  },
  3: {
    platforms: [
      { y: 750, x1: 0, x2: 600, type: "ground" },
      { y: 640, x1: 0, x2: 500, type: "diagonal" },
      { y: 530, x1: 100, x2: 600, type: "diagonal" },
      { y: 420, x1: 0, x2: 500, type: "diagonal" },
      { y: 310, x1: 100, x2: 600, type: "diagonal" },
      { y: 200, x1: 0, x2: 500, type: "diagonal" },
      { y: 150, x1: 150, x2: 450, type: "diagonal" },
      { y: 100, x1: 250, x2: 450, type: "straight" },
    ],
    ladders: [
      { x: 450, y1: 640, y2: 750 },
      { x: 50, y1: 640, y2: 750 },
      { x: 150, y1: 530, y2: 640 },
      { x: 550, y1: 530, y2: 640 },
      { x: 450, y1: 420, y2: 530 },
      { x: 50, y1: 420, y2: 530 },
      { x: 150, y1: 310, y2: 420 },
      { x: 550, y1: 310, y2: 420 },
      { x: 450, y1: 200, y2: 310 },
      { x: 50, y1: 200, y2: 310 },
      { x: 200, y1: 150, y2: 200 },
      { x: 400, y1: 150, y2: 200 },
      { x: 300, y1: 100, y2: 150 },
      { x: 400, y1: 100, y2: 150 },
    ],
  },
};

// Platformy i drabiny (dynamiczne - zmieniane per poziom)
let kongPlatforms = [];
let kongLadders = [];

// Grawitacja
const GRAVITY = 0.5;

// Typy beczek
const BARREL_TYPES = {
  NORMAL: { color: "#8B4513", speed: 3, chance: 50 },
  FAST: { color: "#e60012", speed: 5.5, chance: 30 },
  BOUNCE: { color: "#0095da", speed: 2.5, chance: 20 },
};

// Sterowanie
let kongKeys = {
  left: false,
  right: false,
  up: false,
  down: false,
  space: false,
};

// Funkcja wyświetlania historyjki
function showKongStory() {
  const gameContent = document.getElementById("game-content");
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
      ">⚡ MISJA PISARIO ⚡</h2>
      
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
          🎮 Rok 2026. Siedziba Nintendo w Japonii.
        </p>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--white);
          margin-bottom: 15px;
        ">
          😈 Źli właściciele Nintendo znowu<br/>odmówili dodania języka polskiego<br/>do gier na Switch 2!
        </p>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--yellow);
          margin-bottom: 15px;
          font-weight: bold;
        ">
          🦸 Czas wziąć sprawy w swoje ręce!
        </p>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--white);
        ">
          🏢 Wdrap się na szczyt wieży Nintendo,<br/>unikaj beczek rzucanych przez złego bossa,<br/>i <span style="color: var(--green); font-weight: bold;">ODBIERZ IM NINTENDO SWITCH 2!</span>
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
          ⚠️ UWAGA ⚠️
        </p>
        <p style="
          font-size: 9px;
          color: var(--white);
          line-height: 1.6;
        ">
          Masz tylko 3 życia!<br/>
          Pokonaj 3 poziomy i zdobądź konsolę!
        </p>
      </div>
      
      <button id="story-start-btn" style="
        font-family: 'Press Start 2P', cursive;
        font-size: 14px;
        padding: 15px 40px;
        background: var(--green);
        color: var(--white);
        border: 4px solid var(--dark-gray);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 6px 0 #00752e;
      "
      onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 0 #00752e'"
      onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 0 #00752e'"
      onmousedown="this.style.transform='translateY(4px)'; this.style.boxShadow='0 2px 0 #00752e'"
      onmouseup="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 0 #00752e'"
      >
        ZACZNIJ MISJĘ!
      </button>
    </div>
  `;

  document.getElementById("story-start-btn").addEventListener("click", () => {
    storyShown = true;
    startKong();
  });
}

// Funkcja startowania gry
function startKong() {
  kongActive = true;

  // Reset poziomu
  currentLevel = 1;

  // Reset gracza
  kongPlayer.x = 50;
  kongPlayer.y = 720;
  kongPlayer.velocityX = 0;
  kongPlayer.velocityY = 0;
  kongPlayer.onGround = false;
  kongPlayer.onLadder = false;
  kongPlayer.climbing = false;
  kongPlayer.lives = 3;
  kongPlayer.deaths = 0;

  // Reset beczek i timera
  kongBarrels = [];
  barrelSpawnTimer = 0;
  barrelSpawnInterval = 2500;
  gameTime = 0;

  // Reset klawiszy
  kongKeys.left = false;
  kongKeys.right = false;
  kongKeys.up = false;
  kongKeys.down = false;
  kongKeys.space = false;

  // Ustaw tytuł
  document.getElementById("game-title").textContent = "PISARIO KONG - POZIOM 1";
  document.getElementById("game-score").textContent = "ŻYCIA: ❤️❤️❤️";

  // Stwórz canvas
  const gameContent = document.getElementById("game-content");
  gameContent.innerHTML = `
    <div style="text-align: center;">
      <canvas id="kong-canvas" width="${KONG_WIDTH}" height="${KONG_HEIGHT}" style="
        background: #000;
        border: 4px solid var(--red);
        border-radius: 10px;
        display: block;
        margin: 0 auto;
      "></canvas>
      <p style="font-size: 10px; color: var(--gray); margin-top: 15px;">
        Strzałki ←→ + Spacja (skok) + ↑↓ (drabina) | Zdobądź Switch 2!
      </p>
    </div>
  `;

  // Pobierz canvas
  kongCanvas = document.getElementById("kong-canvas");
  kongCtx = kongCanvas.getContext("2d");

  // Załaduj poziom 1 (pierwszy start - nie resetuj gracza)
  loadLevel(currentLevel, true);

  // Spawn pierwszej beczki
  spawnBarrel();

  // Event listenery
  document.addEventListener("keydown", handleKongKeyDown);
  document.addEventListener("keyup", handleKongKeyUp);

  // Start pętli
  kongInterval = setInterval(kongGameLoop, 1000 / 60); // 60 FPS
}

// Funkcja ładowania poziomu
function loadLevel(level, isFirstLoad = false) {
  // Załaduj layout poziomu
  const layout = levelLayouts[level];
  kongPlatforms = [...layout.platforms];
  kongLadders = [...layout.ladders];

  // Ustawienia trudności per poziom
  if (level === 1) {
    barrelSpawnInterval = 2000;
  } else if (level === 2) {
    barrelSpawnInterval = 1500; // Szybciej
  } else if (level === 3) {
    barrelSpawnInterval = 1200; // Jeszcze szybciej
  }

  // Reset gracza (tylko dla kolejnych poziomów, nie przy pierwszym starcie)
  if (!isFirstLoad) {
    kongPlayer.x = 50;
    kongPlayer.y = 720;
    kongPlayer.velocityX = 0;
    kongPlayer.velocityY = 0;
    kongPlayer.onGround = false;
    kongPlayer.climbing = false;

    // Reset beczek
    kongBarrels = [];
    barrelSpawnTimer = 0;
    gameTime = 0;

    // Spawn pierwszej beczki
    spawnBarrel();

    // Aktualizuj tytuł
    document.getElementById("game-title").textContent =
      "PISARIO KONG - POZIOM " + level;
  }
}

// Funkcja przejścia do następnego poziomu
function nextLevel() {
  currentLevel++;

  if (currentLevel > maxLevel) {
    // Wygrana - ukończono wszystkie poziomy!
    endKong(true);
  } else {
    // Załaduj następny poziom
    loadLevel(currentLevel);
    playBeep(880, 0.5);
    showMessage("POZIOM " + currentLevel + "!", 2000);
  }
}

// Funkcja wyświetlania wiadomości
function showMessage(text, duration) {
  const gameContent = document.getElementById("game-content");
  const message = document.createElement("div");
  message.style.position = "absolute";
  message.style.top = "50%";
  message.style.left = "50%";
  message.style.transform = "translate(-50%, -50%)";
  message.style.fontSize = "32px";
  message.style.color = "var(--yellow)";
  message.style.fontFamily = "'Press Start 2P', cursive";
  message.style.textAlign = "center";
  message.style.textShadow = "4px 4px 0 #000";
  message.style.zIndex = "1000";
  message.textContent = text;
  gameContent.appendChild(message);

  setTimeout(() => {
    message.remove();
  }, duration);
}

// Obsługa klawiszy
function handleKongKeyDown(e) {
  if (!kongActive) return;

  if (e.key === "ArrowLeft") kongKeys.left = true;
  if (e.key === "ArrowRight") kongKeys.right = true;
  if (e.key === "ArrowUp") kongKeys.up = true;
  if (e.key === "ArrowDown") kongKeys.down = true;
  if (e.key === " ") {
    kongKeys.space = true;
    e.preventDefault();
  }
}

function handleKongKeyUp(e) {
  if (e.key === "ArrowLeft") kongKeys.left = false;
  if (e.key === "ArrowRight") kongKeys.right = false;
  if (e.key === "ArrowUp") kongKeys.up = false;
  if (e.key === "ArrowDown") kongKeys.down = false;
  if (e.key === " ") kongKeys.space = false;
}

// Główna pętla gry
function kongGameLoop() {
  if (!kongActive) return;

  updateKong();
  renderKong();
}

// Aktualizacja logiki
function updateKong() {
  gameTime += 16; // ~60fps = 16ms per frame

  // Przyspiesz beczki po 30 sekundach
  if (gameTime > 30000 && barrelSpawnInterval > 1500) {
    barrelSpawnInterval = 1500;
  }

  // Spawn beczek
  barrelSpawnTimer += 16;
  if (barrelSpawnTimer >= barrelSpawnInterval) {
    spawnBarrel();
    barrelSpawnTimer = 0;
  }

  // Sprawdź czy gracz jest na drabinie
  kongPlayer.onLadder = false;
  for (let ladder of kongLadders) {
    if (
      kongPlayer.x + kongPlayer.width > ladder.x - 10 &&
      kongPlayer.x < ladder.x + 10 &&
      kongPlayer.y + kongPlayer.height >= ladder.y1 &&
      kongPlayer.y <= ladder.y2
    ) {
      kongPlayer.onLadder = true;
      break;
    }
  }

  // Ruch gracza
  if (kongKeys.left && !kongPlayer.climbing) {
    kongPlayer.velocityX = -kongPlayer.speed;
  } else if (kongKeys.right && !kongPlayer.climbing) {
    kongPlayer.velocityX = kongPlayer.speed;
  } else if (!kongPlayer.climbing) {
    kongPlayer.velocityX = 0;
  }

  // Wspinanie
  if (kongPlayer.onLadder) {
    if (kongKeys.up) {
      kongPlayer.climbing = true;
      kongPlayer.velocityY = -2;
      kongPlayer.velocityX = 0;
    } else if (kongKeys.down) {
      kongPlayer.climbing = true;
      kongPlayer.velocityY = 2;
      kongPlayer.velocityX = 0;
    } else if (kongPlayer.climbing) {
      kongPlayer.velocityY = 0;
    }
  } else {
    kongPlayer.climbing = false;
  }

  // Skok
  if (kongKeys.space && kongPlayer.onGround && !kongPlayer.climbing) {
    kongPlayer.velocityY = kongPlayer.jumpPower;
    kongPlayer.onGround = false;
    playBeep(440, 0.1);
  }

  // Grawitacja (nie podczas wspinania)
  if (!kongPlayer.climbing) {
    kongPlayer.velocityY += GRAVITY;
  }

  // Ruch
  kongPlayer.x += kongPlayer.velocityX;
  kongPlayer.y += kongPlayer.velocityY;

  // Animacja chodzenia
  if (Math.abs(kongPlayer.velocityX) > 0) {
    kongPlayer.animTimer += 16;
    if (kongPlayer.animTimer > 150) {
      kongPlayer.animFrame = 1 - kongPlayer.animFrame; // Toggle 0/1
      kongPlayer.animTimer = 0;
    }
  }

  // Granice ekranu
  if (kongPlayer.x < 0) kongPlayer.x = 0;
  if (kongPlayer.x + kongPlayer.width > KONG_WIDTH)
    kongPlayer.x = KONG_WIDTH - kongPlayer.width;

  // Kolizje z platformami
  kongPlayer.onGround = false;
  for (let platform of kongPlatforms) {
    if (
      kongPlayer.x + kongPlayer.width > platform.x1 &&
      kongPlayer.x < platform.x2 &&
      kongPlayer.y + kongPlayer.height >= platform.y - 5 &&
      kongPlayer.y + kongPlayer.height <= platform.y + 10 &&
      kongPlayer.velocityY >= 0
    ) {
      kongPlayer.y = platform.y - kongPlayer.height;
      kongPlayer.velocityY = 0;
      kongPlayer.onGround = true;
      kongPlayer.climbing = false;
    }
  }

  // Śmierć przez spadnięcie
  if (kongPlayer.y > KONG_HEIGHT) {
    playerDeath();
  }

  // Aktualizuj beczki
  for (let i = kongBarrels.length - 1; i >= 0; i--) {
    let barrel = kongBarrels[i];

    // Grawitacja
    barrel.velocityY += GRAVITY;

    // Ruch
    barrel.x += barrel.velocityX;
    barrel.y += barrel.velocityY;

    // Odbicie od ścian
    if (barrel.x <= 0) {
      barrel.x = 0;
      barrel.velocityX = -barrel.velocityX;
      playBeep(440, 0.05);
    }
    if (barrel.x + barrel.width >= KONG_WIDTH) {
      barrel.x = KONG_WIDTH - barrel.width;
      barrel.velocityX = -barrel.velocityX;
      playBeep(440, 0.05);
    }

    // Kolizje z platformami
    barrel.onGround = false;
    for (let platform of kongPlatforms) {
      if (
        barrel.x + barrel.width > platform.x1 &&
        barrel.x < platform.x2 &&
        barrel.y + barrel.height >= platform.y - 5 &&
        barrel.y + barrel.height <= platform.y + 10 &&
        barrel.velocityY >= 0
      ) {
        barrel.y = platform.y - barrel.height;
        barrel.velocityY = 0;
        barrel.onGround = true;

        // Bounce dla niebieskich beczek
        if (barrel.type === "BOUNCE") {
          barrel.velocityY = -8;
          playBeep(880, 0.05);
        }
      }
    }

    // Usuń beczki poza ekranem
    if (
      barrel.y > KONG_HEIGHT ||
      barrel.x < -50 ||
      barrel.x > KONG_WIDTH + 50
    ) {
      kongBarrels.splice(i, 1);
      continue;
    }

    // Kolizja z graczem
    if (
      kongPlayer.x + kongPlayer.width > barrel.x &&
      kongPlayer.x < barrel.x + barrel.width &&
      kongPlayer.y + kongPlayer.height > barrel.y &&
      kongPlayer.y < barrel.y + barrel.height
    ) {
      // Śmierć gracza
      playerDeath();
    }
  }

  // Kolizja z Switch 2 (przejście do następnego poziomu)
  if (
    kongPlayer.x + kongPlayer.width > kongSwitch.x &&
    kongPlayer.x < kongSwitch.x + kongSwitch.width &&
    kongPlayer.y + kongPlayer.height > kongSwitch.y &&
    kongPlayer.y < kongSwitch.y + kongSwitch.height
  ) {
    nextLevel();
  }
}

// Renderowanie
function renderKong() {
  // Wyczyść canvas
  kongCtx.fillStyle = "#000";
  kongCtx.fillRect(0, 0, KONG_WIDTH, KONG_HEIGHT);

  // Rysuj platformy
  kongCtx.fillStyle = "#e60012";
  kongCtx.strokeStyle = "#ff6b6b";
  kongCtx.lineWidth = 2;

  for (let platform of kongPlatforms) {
    kongCtx.fillRect(platform.x1, platform.y, platform.x2 - platform.x1, 8);
    kongCtx.strokeRect(platform.x1, platform.y, platform.x2 - platform.x1, 8);
  }

  // Rysuj drabiny
  kongCtx.fillStyle = "#ffed00";
  kongCtx.strokeStyle = "#ffd700";

  for (let ladder of kongLadders) {
    const width = 12;
    const height = ladder.y2 - ladder.y1;
    kongCtx.fillRect(ladder.x - width / 2, ladder.y1, width, height);

    // Szczebelki
    kongCtx.strokeStyle = "#000";
    kongCtx.lineWidth = 2;
    for (let y = ladder.y1; y < ladder.y2; y += 20) {
      kongCtx.beginPath();
      kongCtx.moveTo(ladder.x - width / 2, y);
      kongCtx.lineTo(ladder.x + width / 2, y);
      kongCtx.stroke();
    }
  }

  // Rysuj bossa (pracownik Nintendo)
  kongCtx.fillStyle = "#8B4C98";
  kongCtx.fillRect(kongBoss.x, kongBoss.y, kongBoss.width, kongBoss.height);
  kongCtx.fillStyle = "#fff";
  kongCtx.font = "10px 'Press Start 2P'";
  kongCtx.textAlign = "center";
  kongCtx.fillText("EVIL", kongBoss.x + kongBoss.width / 2, kongBoss.y - 5);

  // Rysuj Switch 2 (cel)
  kongCtx.fillStyle = "#00a651";
  kongCtx.fillRect(
    kongSwitch.x,
    kongSwitch.y,
    kongSwitch.width,
    kongSwitch.height
  );
  kongCtx.strokeStyle = "#00ff00";
  kongCtx.lineWidth = 2;
  kongCtx.strokeRect(
    kongSwitch.x,
    kongSwitch.y,
    kongSwitch.width,
    kongSwitch.height
  );
  kongCtx.fillStyle = "#fff";
  kongCtx.font = "8px 'Press Start 2P'";
  kongCtx.textAlign = "center";
  kongCtx.fillText(
    "NSW2",
    kongSwitch.x + kongSwitch.width / 2,
    kongSwitch.y + 15
  );

  // Rysuj beczki
  for (let barrel of kongBarrels) {
    kongCtx.fillStyle = barrel.color;
    kongCtx.fillRect(barrel.x, barrel.y, barrel.width, barrel.height);
    kongCtx.strokeStyle = "#000";
    kongCtx.lineWidth = 1;
    kongCtx.strokeRect(barrel.x, barrel.y, barrel.width, barrel.height);
  }

  // Rysuj gracza (Pisario) - niebieski z animacją
  kongCtx.fillStyle = "#0095da";
  kongCtx.fillRect(
    kongPlayer.x,
    kongPlayer.y,
    kongPlayer.width,
    kongPlayer.height
  );

  // Oczy
  kongCtx.fillStyle = "#fff";
  kongCtx.fillRect(kongPlayer.x + 3, kongPlayer.y + 4, 4, 4);
  kongCtx.fillRect(kongPlayer.x + 9, kongPlayer.y + 4, 4, 4);

  // Nogi (animacja 2-frame)
  kongCtx.fillStyle = "#0095da";
  if (kongPlayer.animFrame === 0) {
    kongCtx.fillRect(kongPlayer.x + 2, kongPlayer.y + kongPlayer.height, 5, 4);
    kongCtx.fillRect(kongPlayer.x + 9, kongPlayer.y + kongPlayer.height, 5, 4);
  } else {
    kongCtx.fillRect(kongPlayer.x + 4, kongPlayer.y + kongPlayer.height, 5, 4);
    kongCtx.fillRect(kongPlayer.x + 7, kongPlayer.y + kongPlayer.height, 5, 4);
  }
}

// Spawn beczki
function spawnBarrel() {
  // Losuj typ beczki
  const rand = Math.random() * 100;
  let type, color, speed;

  if (rand < BARREL_TYPES.BOUNCE.chance) {
    type = "BOUNCE";
    color = BARREL_TYPES.BOUNCE.color;
    speed = BARREL_TYPES.BOUNCE.speed;
  } else if (rand < BARREL_TYPES.BOUNCE.chance + BARREL_TYPES.FAST.chance) {
    type = "FAST";
    color = BARREL_TYPES.FAST.color;
    speed = BARREL_TYPES.FAST.speed;
  } else {
    type = "NORMAL";
    color = BARREL_TYPES.NORMAL.color;
    speed = BARREL_TYPES.NORMAL.speed;
  }

  kongBarrels.push({
    x: kongBoss.x + kongBoss.width / 2,
    y: kongBoss.y + kongBoss.height,
    width: 20,
    height: 20,
    velocityX: Math.random() > 0.5 ? speed : -speed,
    velocityY: 0,
    type: type,
    color: color,
    onGround: false,
  });

  playBeep(220, 0.05);
}

// Śmierć gracza
function playerDeath() {
  kongPlayer.lives--;
  kongPlayer.deaths++;

  playBeep(220, 0.5);

  // Aktualizuj wynik
  updateKongScore();

  if (kongPlayer.lives <= 0) {
    // Game Over
    endKong(false);
  } else {
    // Respawn
    kongPlayer.x = 50;
    kongPlayer.y = 720;
    kongPlayer.velocityX = 0;
    kongPlayer.velocityY = 0;

    // Wyczyść beczki
    kongBarrels = [];
  }
}

// Aktualizuj wynik
function updateKongScore() {
  let hearts = "";
  for (let i = 0; i < kongPlayer.lives; i++) {
    hearts += "❤️";
  }
  document.getElementById("game-score").textContent = "ŻYCIA: " + hearts;
}

// Koniec gry
function endKong(won) {
  kongActive = false;
  clearInterval(kongInterval);

  // Usuń event listenery
  document.removeEventListener("keydown", handleKongKeyDown);
  document.removeEventListener("keyup", handleKongKeyUp);

  const gameContent = document.getElementById("game-content");

  if (won) {
    gameContent.innerHTML = `
      <div style="text-align: center;">
        <h2 style="font-size: 32px; color: var(--green); margin-bottom: 20px;">
          🏆 WYGRANA! 🏆
        </h2>
        <p style="font-size: 14px; color: var(--dark-gray); margin-bottom: 15px;">
          Ukończyłeś wszystkie 3 poziomy!<br>Zdobyłeś Nintendo Switch 2!
        </p>
        <div style="font-size: 48px; margin: 20px 0;">
          🎮
        </div>
        <p style="font-size: 12px; color: var(--purple); margin-bottom: 10px;">
          Śmierci: ${kongPlayer.deaths}
        </p>
        <p style="font-size: 10px; color: var(--gray); margin-bottom: 30px; font-style: italic;">
          Pisario pokonał złych pracowników Nintendo! 🦍
        </p>
        <button class="btn-play" onclick="startKong()">ZAGRAJ PONOWNIE</button>
      </div>
    `;

    // Osiągnięcie
    unlockAchievement("kong_master");

    // Perfekcja (bez śmierci)
    if (kongPlayer.deaths === 0) {
      unlockAchievement("kong_perfection");
    }

    // Zapisz wynik
    saveScore("kong_wins", (loadData().scores?.kong_wins || 0) + 1);
    addCompletedGame("kong");

    playWinSound();
  } else {
    gameContent.innerHTML = `
      <div style="text-align: center;">
        <h2 style="font-size: 24px; color: var(--red); margin-bottom: 20px;">
          💀 GAME OVER 💀
        </h2>
        <p style="font-size: 14px; color: var(--dark-gray); margin-bottom: 15px;">
          Skończyły się życia!
        </p>
        <div style="font-size: 48px; margin: 20px 0; color: var(--gray);">
          🛢️
        </div>
        <p style="font-size: 10px; color: var(--purple); margin-bottom: 30px; font-style: italic;">
          Spróbuj ponownie! 💪
        </p>
        <button class="btn-play" onclick="startKong()">ZAGRAJ PONOWNIE</button>
      </div>
    `;

    playBeep(220, 0.5);
  }
}

// Stop gry
function stopKong() {
  kongActive = false;
  if (kongInterval) {
    clearInterval(kongInterval);
  }

  document.removeEventListener("keydown", handleKongKeyDown);
  document.removeEventListener("keyup", handleKongKeyUp);
}
