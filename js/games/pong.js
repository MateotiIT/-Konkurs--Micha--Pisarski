// pong.js - Gra: PISARIO PONG (Klasyczny Pong)

let pongActive = false;
let pongCanvas = null;
let pongCtx = null;
let pongInterval = null;

// Obiekty gry
let pongPlayer = {
  x: 20,
  y: 0,
  width: 10,
  height: 80,
  speed: 6,
  score: 0,
};

let pongAI = {
  x: 0,
  y: 0,
  width: 10,
  height: 80,
  speed: 2.5,
  score: 0,
};

let pongBall = {
  x: 0,
  y: 0,
  radius: 8,
  speedX: 5,
  speedY: 3,
  speed: 5,
};

// Sterowanie
let pongKeys = {
  w: false,
  s: false,
  arrowUp: false,
  arrowDown: false,
};

// Funkcja startowania Ponga
function startPong() {
  pongActive = true;

  // Ustaw tytuł gry
  document.getElementById("game-title").textContent = "PISARIO PONG";
  updatePongScore();

  // Stwórz canvas
  const gameContent = document.getElementById("game-content");
  gameContent.innerHTML = `
    <div style="width: 100%; max-width: 700px; text-align: center;">
      <canvas id="pong-canvas" width="700" height="500" style="
        background: var(--dark-gray);
        border: 4px solid var(--yellow);
        border-radius: 10px;
        display: block;
        margin: 0 auto;
      "></canvas>
      <p style="font-size: 10px; color: var(--gray); margin-top: 15px;">
        Sterowanie: W/S lub Strzałki ↑↓ | Pierwsze do 5 punktów wygrywa!
      </p>
    </div>
  `;

  // Pobierz canvas
  pongCanvas = document.getElementById("pong-canvas");
  pongCtx = pongCanvas.getContext("2d");

  // Inicjalizuj pozycje
  initPong();

  // Dodaj event listenery klawiatury
  document.addEventListener("keydown", handlePongKeyDown);
  document.addEventListener("keyup", handlePongKeyUp);

  // Uruchom pętlę gry
  pongInterval = setInterval(pongGameLoop, 1000 / 60); // 60 FPS
}

// Funkcja inicjalizacji pozycji
function initPong() {
  // Wyśrodkuj paletki
  pongPlayer.y = (pongCanvas.height - pongPlayer.height) / 2;
  pongAI.x = pongCanvas.width - pongAI.width - 20;
  pongAI.y = (pongCanvas.height - pongAI.height) / 2;

  // Wyśrodkuj piłkę
  resetBall();
}

// Funkcja resetowania piłki
function resetBall() {
  pongBall.x = pongCanvas.width / 2;
  pongBall.y = pongCanvas.height / 2;

  // Losowy kierunek
  pongBall.speedX = (Math.random() > 0.5 ? 1 : -1) * pongBall.speed;
  pongBall.speedY = (Math.random() - 0.5) * pongBall.speed;
}

// Funkcja obsługi klawiatury
function handlePongKeyDown(e) {
  if (!pongActive) return;

  if (e.key === "w" || e.key === "W") pongKeys.w = true;
  if (e.key === "s" || e.key === "S") pongKeys.s = true;
  if (e.key === "ArrowUp") {
    pongKeys.arrowUp = true;
    e.preventDefault();
  }
  if (e.key === "ArrowDown") {
    pongKeys.arrowDown = true;
    e.preventDefault();
  }
}

function handlePongKeyUp(e) {
  if (e.key === "w" || e.key === "W") pongKeys.w = false;
  if (e.key === "s" || e.key === "S") pongKeys.s = false;
  if (e.key === "ArrowUp") pongKeys.arrowUp = false;
  if (e.key === "ArrowDown") pongKeys.arrowDown = false;
}

// Główna pętla gry
function pongGameLoop() {
  if (!pongActive) return;

  // Aktualizuj
  updatePong();

  // Renderuj
  renderPong();
}

// Funkcja aktualizacji logiki
function updatePong() {
  // Ruch gracza
  if ((pongKeys.w || pongKeys.arrowUp) && pongPlayer.y > 0) {
    pongPlayer.y -= pongPlayer.speed;
  }
  if (
    (pongKeys.s || pongKeys.arrowDown) &&
    pongPlayer.y < pongCanvas.height - pongPlayer.height
  ) {
    pongPlayer.y += pongPlayer.speed;
  }

  // Ruch AI (śledzi piłkę)
  const aiCenter = pongAI.y + pongAI.height / 2;
  if (pongBall.y < aiCenter - 35 && pongAI.y > 0) {
    pongAI.y -= pongAI.speed;
  } else if (
    pongBall.y > aiCenter + 35 &&
    pongAI.y < pongCanvas.height - pongAI.height
  ) {
    pongAI.y += pongAI.speed;
  }

  // Ruch piłki
  pongBall.x += pongBall.speedX;
  pongBall.y += pongBall.speedY;

  // Odbicie od góry/dołu
  if (
    pongBall.y - pongBall.radius <= 0 ||
    pongBall.y + pongBall.radius >= pongCanvas.height
  ) {
    pongBall.speedY = -pongBall.speedY;
    playBeep(440, 0.05);
  }

  // Kolizja z paletką gracza
  if (
    pongBall.x - pongBall.radius <= pongPlayer.x + pongPlayer.width &&
    pongBall.y >= pongPlayer.y &&
    pongBall.y <= pongPlayer.y + pongPlayer.height &&
    pongBall.speedX < 0
  ) {
    pongBall.speedX = -pongBall.speedX * 1.05; // Przyśpieszenie
    pongBall.speedY += (Math.random() - 0.5) * 2;
    playBeep(660, 0.1);
  }

  // Kolizja z paletką AI
  if (
    pongBall.x + pongBall.radius >= pongAI.x &&
    pongBall.y >= pongAI.y &&
    pongBall.y <= pongAI.y + pongAI.height &&
    pongBall.speedX > 0
  ) {
    pongBall.speedX = -pongBall.speedX * 1.05; // Przyśpieszenie
    pongBall.speedY += (Math.random() - 0.5) * 2;
    playBeep(660, 0.1);
  }

  // Punkt dla AI (piłka poza lewą krawędzią)
  if (pongBall.x - pongBall.radius <= 0) {
    pongAI.score++;
    updatePongScore();
    playBeep(220, 0.3);
    resetBall();
    checkPongWin();
  }

  // Punkt dla gracza (piłka poza prawą krawędzią)
  if (pongBall.x + pongBall.radius >= pongCanvas.width) {
    pongPlayer.score++;
    updatePongScore();
    playBeep(880, 0.3);
    resetBall();
    checkPongWin();
  }
}

// Funkcja renderowania
function renderPong() {
  // Wyczyść canvas
  pongCtx.fillStyle = "#2c2c2c";
  pongCtx.fillRect(0, 0, pongCanvas.width, pongCanvas.height);

  // Linia środkowa (przerywana)
  pongCtx.strokeStyle = "#8c8c8c";
  pongCtx.lineWidth = 4;
  pongCtx.setLineDash([10, 10]);
  pongCtx.beginPath();
  pongCtx.moveTo(pongCanvas.width / 2, 0);
  pongCtx.lineTo(pongCanvas.width / 2, pongCanvas.height);
  pongCtx.stroke();
  pongCtx.setLineDash([]);

  // Paletka gracza
  pongCtx.fillStyle = "#0095da"; // Niebieski
  pongCtx.fillRect(
    pongPlayer.x,
    pongPlayer.y,
    pongPlayer.width,
    pongPlayer.height
  );

  // Paletka AI
  pongCtx.fillStyle = "#e60012"; // Czerwony
  pongCtx.fillRect(pongAI.x, pongAI.y, pongAI.width, pongAI.height);

  // Piłka
  pongCtx.fillStyle = "#ffed00"; // Żółty
  pongCtx.beginPath();
  pongCtx.arc(pongBall.x, pongBall.y, pongBall.radius, 0, Math.PI * 2);
  pongCtx.fill();

  // Wyniki (duże cyfry)
  pongCtx.fillStyle = "#f0f0f0";
  pongCtx.font = "48px 'Press Start 2P', cursive";
  pongCtx.textAlign = "center";
  pongCtx.fillText(pongPlayer.score, pongCanvas.width / 4, 60);
  pongCtx.fillText(pongAI.score, (pongCanvas.width / 4) * 3, 60);
}

// Funkcja aktualizacji wyniku
function updatePongScore() {
  document.getElementById("game-score").textContent =
    "GRACZ: " + pongPlayer.score + " | AI: " + pongAI.score;
}

// Funkcja sprawdzania wygranej
function checkPongWin() {
  if (pongPlayer.score >= 5) {
    endPong(true);
  } else if (pongAI.score >= 5) {
    endPong(false);
  }
}

// Funkcja końca gry
function endPong(playerWon) {
  pongActive = false;
  clearInterval(pongInterval);

  // Usuń event listenery
  document.removeEventListener("keydown", handlePongKeyDown);
  document.removeEventListener("keyup", handlePongKeyUp);

  const gameContent = document.getElementById("game-content");

  if (playerWon) {
    // Wygrana gracza
    gameContent.innerHTML = `
      <div style="text-align: center;">
        <h2 style="font-size: 32px; color: var(--green); margin-bottom: 20px;">
          🏆 WYGRANA! 🏆
        </h2>
        <p style="font-size: 14px; color: var(--dark-gray); margin-bottom: 15px;">
          Pokonałeś AI!
        </p>
        <div style="font-size: 48px; margin: 20px 0; color: var(--blue);">
          ${pongPlayer.score} - ${pongAI.score}
        </div>
        <p style="font-size: 10px; color: var(--purple); margin-bottom: 30px; font-style: italic;">
          Jesteś mistrzem Ponga! 🎮
        </p>
        <button class="btn-play" onclick="startPong()">ZAGRAJ PONOWNIE</button>
      </div>
    `;

    // Osiągnięcie
    unlockAchievement("pong_master");

    // Osiągnięcie za perfekcyjną grę (5-0)
    if (pongAI.score === 0) {
      unlockAchievement("pong_perfekcja");
    }

    // Zapisz wynik
    saveScore("pong_wins", (loadData().scores?.pong_wins || 0) + 1);

    // Dodaj do ukończonych gier
    addCompletedGame("pong");

    playWinSound();
  } else {
    // Przegrana gracza
    gameContent.innerHTML = `
      <div style="text-align: center;">
        <h2 style="font-size: 24px; color: var(--red); margin-bottom: 20px;">
          💀 PRZEGRANA 💀
        </h2>
        <p style="font-size: 14px; color: var(--dark-gray); margin-bottom: 15px;">
          AI wygrało!
        </p>
        <div style="font-size: 48px; margin: 20px 0; color: var(--gray);">
          ${pongPlayer.score} - ${pongAI.score}
        </div>
        <p style="font-size: 10px; color: var(--purple); margin-bottom: 30px; font-style: italic;">
          Spróbuj jeszcze raz! 💪
        </p>
        <button class="btn-play" onclick="startPong()">ZAGRAJ PONOWNIE</button>
      </div>
    `;

    playBeep(220, 0.5);
  }

  // Reset wyniku
  pongPlayer.score = 0;
  pongAI.score = 0;
}

// Funkcja zatrzymania gry
function stopPong() {
  pongActive = false;
  if (pongInterval) {
    clearInterval(pongInterval);
  }

  // Usuń event listenery
  document.removeEventListener("keydown", handlePongKeyDown);
  document.removeEventListener("keyup", handlePongKeyUp);
}
