

let memoryActive = false;
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let memoryMoves = 0;
let memoryTimer = 0;
let memoryInterval = null;


const cardImages = [
  "./assets/memory/card1.svg", 
  "./assets/memory/card2.svg", 
  "./assets/memory/card3.svg", 
  "./assets/memory/card4.svg", 
  "./assets/memory/card5.svg", 
  "./assets/memory/card6.svg", 
  "./assets/memory/card7.svg", 
  "./assets/memory/card8.svg", 
];


function startMemory() {
  
  showMemoryStory();
}


function showMemoryStory() {
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
      ">🧠 ODNAJDŹ PARY! 🧠</h2>
      
      <div style="
        background: rgba(0,0,0,0.4);
        padding: 25px;
        border-radius: 10px;
        margin-bottom: 25px;
        border: 2px solid var(--purple);
      ">
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--white);
          margin-bottom: 15px;
        ">
          🃏 Źli ludzie pomieszali wszystkie<br/>ikony !
        </p>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--white);
          margin-bottom: 15px;
        ">
          🎮 Musisz odzyskać porządek<br/>i połączyć każdą ikonę z jej parą!
        </p>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--purple);
          margin-bottom: 15px;
          font-weight: bold;
        ">
          🔍 Sprawdź swoją pamięć<br/>i znajdź wszystkie pary!
        </p>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--white);
        ">
          ⚡ Śpiesz się, czasu jest mało, a oni dalej nie chcą nam spolszczyć gier!
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
          🎯 ZASADY 🎯
        </p>
        <p style="
          font-size: 9px;
          color: var(--white);
          line-height: 1.6;
        ">
          Klikaj karty, aby je odkryć.<br/>
          Znajdź 8 par retro ikon!<br/>
          Czas jest mierzony!
        </p>
      </div>
      
      <button id="memory-story-start-btn" style="
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
        ZACZNIJ SZUKAĆ!
      </button>
    </div>
  `;

  document
    .getElementById("memory-story-start-btn")
    .addEventListener("click", () => {
      
      memoryActive = true;
      memoryMoves = 0;
      matchedPairs = 0;
      flippedCards = [];
      memoryTimer = 0;

      document.getElementById("game-title").textContent = "PISARIO MEMORY";
      updateMemoryScore();

      createMemoryBoard();
      renderMemoryBoard();
      startMemoryTimer();
    });
}


function createMemoryBoard() {
  
  memoryCards = [];
  cardImages.forEach((image, index) => {
    memoryCards.push({ id: index, image: image, matched: false });
    memoryCards.push({ id: index, image: image, matched: false });
  });

  
  memoryCards = shuffleArray(memoryCards);
}


function renderMemoryBoard() {
  const gameContent = document.getElementById("game-content");

  gameContent.innerHTML = `
    <div style="width: 100%; max-width: 500px;">
      <div id="memory-grid" style="
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        margin-bottom: 20px;
      ">
        ${memoryCards
          .map(
            (card, index) => `
          <div class="memory-card" data-index="${index}" style="
            aspect-ratio: 1;
            background: var(--light-gray);
            border: 4px solid var(--dark-gray);
            border-radius: 10px;
            cursor: pointer;
            transition: transform 0.3s, opacity 0.3s;
            position: relative;
            overflow: hidden;
          ">
            <img 
              src="./assets/memory/back.svg" 
              class="card-back"
              style="
                width: 100%;
                height: 100%;
                object-fit: cover;
                position: absolute;
                top: 0;
                left: 0;
                transition: opacity 0.3s;
              "
            />
            <img 
              src="${card.image}" 
              class="card-front"
              style="
                width: 100%;
                height: 100%;
                object-fit: cover;
                position: absolute;
                top: 0;
                left: 0;
                opacity: 0;
                transition: opacity 0.3s;
              "
            />
          </div>
        `
          )
          .join("")}
      </div>
      <p style="text-align: center; font-size: 10px; color: var(--gray);">
        Znajdź wszystkie pary kart
      </p>
    </div>
  `;

  
  const cards = gameContent.querySelectorAll(".memory-card");
  cards.forEach((card, index) => {
    card.addEventListener("click", function () {
      handleCardClick(index);
    });

    
    card.addEventListener("mouseenter", function () {
      if (!memoryCards[index].matched && !this.classList.contains("flipped")) {
        this.style.transform = "scale(1.05)";
      }
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  });
}


function handleCardClick(index) {
  if (!memoryActive) return;

  const card = memoryCards[index];
  const cardElement = document.querySelectorAll(".memory-card")[index];

  
  if (
    card.matched ||
    cardElement.classList.contains("flipped") ||
    flippedCards.length >= 2
  ) {
    return;
  }

  
  flipCard(index);
  flippedCards.push(index);

  
  if (flippedCards.length === 2) {
    memoryMoves++;
    updateMemoryScore();

    setTimeout(() => {
      checkMatch();
    }, 800);
  }
}


function flipCard(index) {
  const cardElement = document.querySelectorAll(".memory-card")[index];
  cardElement.classList.add("flipped");

  const cardBack = cardElement.querySelector(".card-back");
  const cardFront = cardElement.querySelector(".card-front");

  cardBack.style.opacity = "0";
  cardFront.style.opacity = "1";

  playBeep(440, 0.1);
}


function unflipCard(index) {
  const cardElement = document.querySelectorAll(".memory-card")[index];
  cardElement.classList.remove("flipped");

  const cardBack = cardElement.querySelector(".card-back");
  const cardFront = cardElement.querySelector(".card-front");

  cardBack.style.opacity = "1";
  cardFront.style.opacity = "0";
}


function checkMatch() {
  const [index1, index2] = flippedCards;
  const card1 = memoryCards[index1];
  const card2 = memoryCards[index2];

  if (card1.id === card2.id) {
    
    card1.matched = true;
    card2.matched = true;
    matchedPairs++;

    
    const cardElements = document.querySelectorAll(".memory-card");
    cardElements[index1].style.opacity = "0.6";
    cardElements[index2].style.opacity = "0.6";

    playBeep(660, 0.2);

    
    if (matchedPairs === 8) {
      setTimeout(() => {
        endMemory();
      }, 500);
    }
  } else {
    
    setTimeout(() => {
      unflipCard(index1);
      unflipCard(index2);
      playBeep(220, 0.1);
    }, 200);
  }

  flippedCards = [];
}


function updateMemoryScore() {
  const minutes = Math.floor(memoryTimer / 60);
  const seconds = memoryTimer % 60;
  const timeString =
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0");

  document.getElementById("game-score").textContent =
    "RUCHY: " + memoryMoves + " | CZAS: " + timeString;
}


function startMemoryTimer() {
  memoryInterval = setInterval(() => {
    if (memoryActive) {
      memoryTimer++;
      updateMemoryScore();
    }
  }, 1000);
}


function endMemory() {
  memoryActive = false;
  clearInterval(memoryInterval);

  const gameContent = document.getElementById("game-content");

  let resultMessage = "";
  let resultColor = "";

  if (memoryMoves <= 20) {
    resultMessage = "MISTRZ PAMIĘCI! 🧠✨";
    resultColor = "var(--green)";
    unlockAchievement("mistrz_pamieci");
  } else if (memoryMoves <= 30) {
    resultMessage = "ŚWIETNIE! 🎉";
    resultColor = "var(--blue)";
  } else {
    resultMessage = "UKOŃCZONO! 👍";
    resultColor = "var(--yellow)";
  }

  const minutes = Math.floor(memoryTimer / 60);
  const seconds = memoryTimer % 60;
  const timeString =
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0");

  gameContent.innerHTML = `
    <div style="text-align: center;">
      <h2 style="font-size: 24px; color: ${resultColor}; margin-bottom: 20px;">
        ${resultMessage}
      </h2>
      <p style="font-size: 14px; color: var(--dark-gray); margin-bottom: 15px;">
        Znalazłeś wszystkie pary!
      </p>
      <div style="font-size: 32px; margin: 20px 0;">
        ${memoryMoves} ruchów
      </div>
      <p style="font-size: 12px; color: var(--gray); margin-bottom: 30px;">
        Czas: ${timeString}
      </p>
      <button class="btn-play" onclick="startMemory()">ZAGRAJ PONOWNIE</button>
    </div>
  `;

  
  saveScore("memory_best_moves", memoryMoves);
  saveScore("memory_best_time", memoryTimer);

  
  addCompletedGame("memory");

  
  addCoins(10);
  showToast("+10 🪙 za ukończenie Memory!");

  
  playWinSound();
}


function stopMemory() {
  memoryActive = false;
  if (memoryInterval) {
    clearInterval(memoryInterval);
  }
}
