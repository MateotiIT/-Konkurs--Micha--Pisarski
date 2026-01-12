let pongActive = false;
let pongCanvas = null;
let pongCtx = null;
let pongInterval = null;

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

let pongKeys = {
  w: false,
  s: false,
  arrowUp: false,
  arrowDown: false,
};

function startPong() {
  showPongRetroScreen();
}

function showPongRetroScreen() {
  const gameContent = document.getElementById("game-content");
  gameContent.innerHTML = `
    <div style="
      max-width: 600px;
      margin: 0 auto;
      padding: 30px;
      text-align: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border: 4px solid var(--green);
      border-radius: 15px;
    ">
      <h2 style="
        font-size: 24px;
        color: var(--green);
        margin-bottom: 30px;
        text-shadow: 2px 2px 0 #000;
      ">🏓 STREFA SUPER RETRO 🏓</h2>
      
      <div style="
        background: rgba(0,0,0,0.4);
        padding: 25px;
        border-radius: 10px;
        margin-bottom: 25px;
        border: 2px solid var(--green);
      ">
        <p style="
          font-size: 13px;
          line-height: 1.8;
          color: var(--green);
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
          Rok 1972. Początek gier wideo.<br/>
          To pierwszy PONG!
        </p>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--white);
          margin-bottom: 15px;
        ">
          😎 Usiądź wygodnie,<br/>
          <span style="color: var(--green); font-weight: bold;">ZAGRAJ I SIĘ WYLUZUJ!</span>
        </p>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--white);
        ">
          🏓 Odbijaj piłkę, pokonaj przeciwnika<br/>
          i poczuj czystą esencję retro gamingu!
        </p>
      </div>
      
      <div style="
        background: rgba(0, 166, 81, 0.2);
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 25px;
        border: 2px solid var(--green);
      ">
        <p style="
          font-size: 9px;
          color: var(--green);
          margin-bottom: 8px;
        ">
          🕹️ STEROWANIE 🕹️
        </p>
        <p style="
          font-size: 9px;
          color: var(--white);
          line-height: 1.6;
        ">
          W/S lub Strzałki ↑↓<br/>
          Pierwsza rakietka do 5 punktów wygrywa!<br/>
          Odbijaj piłkę i zdobywaj punkty!
        </p>
      </div>
      
      <button id="pong-retro-start-btn" style="
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
        PING PONG!
      </button>
    </div>
  `;

  document
    .getElementById("pong-retro-start-btn")
    .addEventListener("click", () => {
      startPongGame();
    });
}

function startPongGame() {
  pongActive = true;
  incrementGamePlayed("Pong");

  // Wyczyść poprzedni interval jeśli istnieje
  if (pongInterval) {
    clearInterval(pongInterval);
    pongInterval = null;
  }

  document.getElementById("game-title").textContent = "PISARIO PONG";
  updatePongScore();

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

  pongCanvas = document.getElementById("pong-canvas");
  pongCtx = pongCanvas.getContext("2d");

  initPong();

  document.addEventListener("keydown", handlePongKeyDown);
  document.addEventListener("keyup", handlePongKeyUp);

  pongInterval = setInterval(pongGameLoop, 1000 / 60);
}

function initPong() {
  // Resetuj wyniki na start gry
  pongPlayer.score = 0;
  pongAI.score = 0;

  pongPlayer.y = (pongCanvas.height - pongPlayer.height) / 2;
  pongAI.x = pongCanvas.width - pongAI.width - 20;
  pongAI.y = (pongCanvas.height - pongAI.height) / 2;

  resetBall();
}

function resetBall() {
  pongBall.x = pongCanvas.width / 2;
  pongBall.y = pongCanvas.height / 2;

  pongBall.speedX = (Math.random() > 0.5 ? 1 : -1) * pongBall.speed;
  pongBall.speedY = (Math.random() - 0.5) * pongBall.speed;
}

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

function pongGameLoop() {
  if (!pongActive) return;

  updatePong();

  renderPong();
}

function updatePong() {
  if ((pongKeys.w || pongKeys.arrowUp) && pongPlayer.y > 0) {
    pongPlayer.y -= pongPlayer.speed;
  }
  if (
    (pongKeys.s || pongKeys.arrowDown) &&
    pongPlayer.y < pongCanvas.height - pongPlayer.height
  ) {
    pongPlayer.y += pongPlayer.speed;
  }

  const aiCenter = pongAI.y + pongAI.height / 2;
  if (pongBall.y < aiCenter - 35 && pongAI.y > 0) {
    pongAI.y -= pongAI.speed;
  } else if (
    pongBall.y > aiCenter + 35 &&
    pongAI.y < pongCanvas.height - pongAI.height
  ) {
    pongAI.y += pongAI.speed;
  }

  pongBall.x += pongBall.speedX;
  pongBall.y += pongBall.speedY;

  if (
    pongBall.y - pongBall.radius <= 0 ||
    pongBall.y + pongBall.radius >= pongCanvas.height
  ) {
    pongBall.speedY = -pongBall.speedY;
    playBeep(440, 0.05);
  }

  if (
    pongBall.x - pongBall.radius <= pongPlayer.x + pongPlayer.width &&
    pongBall.y >= pongPlayer.y &&
    pongBall.y <= pongPlayer.y + pongPlayer.height &&
    pongBall.speedX < 0
  ) {
    pongBall.speedX = -pongBall.speedX * 1.05;
    pongBall.speedY += (Math.random() - 0.5) * 2;
    playBeep(660, 0.1);
  }

  if (
    pongBall.x + pongBall.radius >= pongAI.x &&
    pongBall.y >= pongAI.y &&
    pongBall.y <= pongAI.y + pongAI.height &&
    pongBall.speedX > 0
  ) {
    pongBall.speedX = -pongBall.speedX * 1.05;
    pongBall.speedY += (Math.random() - 0.5) * 2;
    playBeep(660, 0.1);
  }

  if (pongBall.x - pongBall.radius <= 0) {
    pongAI.score++;
    updatePongScore();
    playBeep(220, 0.3);
    resetBall();
    checkPongWin();
  }

  if (pongBall.x + pongBall.radius >= pongCanvas.width) {
    pongPlayer.score++;
    updatePongScore();
    playBeep(880, 0.3);
    resetBall();
    checkPongWin();
  }
}

function renderPong() {
  pongCtx.fillStyle = "#2c2c2c";
  pongCtx.fillRect(0, 0, pongCanvas.width, pongCanvas.height);

  pongCtx.strokeStyle = "#8c8c8c";
  pongCtx.lineWidth = 4;
  pongCtx.setLineDash([10, 10]);
  pongCtx.beginPath();
  pongCtx.moveTo(pongCanvas.width / 2, 0);
  pongCtx.lineTo(pongCanvas.width / 2, pongCanvas.height);
  pongCtx.stroke();
  pongCtx.setLineDash([]);

  pongCtx.fillStyle = "#0095da";
  pongCtx.fillRect(
    pongPlayer.x,
    pongPlayer.y,
    pongPlayer.width,
    pongPlayer.height
  );

  pongCtx.fillStyle = "#e60012";
  pongCtx.fillRect(pongAI.x, pongAI.y, pongAI.width, pongAI.height);

  pongCtx.fillStyle = "#ffed00";
  pongCtx.beginPath();
  pongCtx.arc(pongBall.x, pongBall.y, pongBall.radius, 0, Math.PI * 2);
  pongCtx.fill();

  pongCtx.fillStyle = "#f0f0f0";
  pongCtx.font = "48px 'Press Start 2P', cursive";
  pongCtx.textAlign = "center";
  pongCtx.fillText(pongPlayer.score, pongCanvas.width / 4, 60);
  pongCtx.fillText(pongAI.score, (pongCanvas.width / 4) * 3, 60);
}

function updatePongScore() {
  document.getElementById("game-score").textContent =
    "PUNKTY: " + pongPlayer.score + " | AI: " + pongAI.score;
}

function checkPongWin() {
  if (pongPlayer.score >= 5) {
    endPong(true);
  } else if (pongAI.score >= 5) {
    endPong(false);
  }
}

function endPong(playerWon) {
  pongActive = false;

  // Wyczyść interval
  if (pongInterval) {
    clearInterval(pongInterval);
    pongInterval = null;
  }

  // Zapisz wynik niezależnie od wyniku gry
  saveBestScore("pong_score", pongPlayer.score, false);

  if (playerWon) {
    incrementGameWon();
  } else {
    incrementGameLost();
  }

  document.removeEventListener("keydown", handlePongKeyDown);
  document.removeEventListener("keyup", handlePongKeyUp);

  const gameContent = document.getElementById("game-content");

  if (playerWon) {
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

    if (pongAI.score === 0) {
      unlockAchievement("pong_perfekcja");
    }

    saveScore("pong_wins", (loadData().scores?.pong_wins || 0) + 1);

    addCompletedGame("pong");

    addCoins(10);
    showToast("+10 🪙 za wygraną w Pong!");

    playWinSound();
  } else {
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

  pongPlayer.score = 0;
  pongAI.score = 0;
}

function stopPong() {
  pongActive = false;
  if (pongInterval) {
    clearInterval(pongInterval);
  }

  document.removeEventListener("keydown", handlePongKeyDown);
  document.removeEventListener("keyup", handlePongKeyUp);
}
