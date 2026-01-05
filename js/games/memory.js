// memory.js - Gra: PISARIO MEMORY (Znajdź pary)

let memoryActive = false;
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let memoryMoves = 0;
let memoryTimer = 0;
let memoryInterval = null;

// Obrazki kart (8 par = 16 kart)
const cardImages = [
  "./assets/memory/card1.svg", // 🍄
  "./assets/memory/card2.svg", // ⭐
  "./assets/memory/card3.svg", // 🪙
  "./assets/memory/card4.svg", // 👾
  "./assets/memory/card5.svg", // 🎮
  "./assets/memory/card6.svg", // 🗡️
  "./assets/memory/card7.svg", // 🏆
  "./assets/memory/card8.svg", // 💣
];

// Funkcja startowania Memory
function startMemory() {
  memoryActive = true;
  memoryMoves = 0;
  matchedPairs = 0;
  flippedCards = [];
  memoryTimer = 0;

  // Ustaw tytuł gry
  document.getElementById("game-title").textContent = "PISARIO MEMORY";
  updateMemoryScore();

  // Stwórz planszę (8 par = 16 kart)
  createMemoryBoard();

  // Renderuj planszę
  renderMemoryBoard();

  // Uruchom timer
  startMemoryTimer();
}

// Funkcja tworzenia planszy
function createMemoryBoard() {
  // Stwórz pary (każdy obrazek 2 razy)
  memoryCards = [];
  cardImages.forEach((image, index) => {
    memoryCards.push({ id: index, image: image, matched: false });
    memoryCards.push({ id: index, image: image, matched: false });
  });

  // Przetasuj karty
  memoryCards = shuffleArray(memoryCards);
}

// Funkcja renderowania planszy
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

  // Dodaj event listenery do kart
  const cards = gameContent.querySelectorAll(".memory-card");
  cards.forEach((card, index) => {
    card.addEventListener("click", function () {
      handleCardClick(index);
    });

    // Hover effect
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

// Funkcja obsługi kliknięcia karty
function handleCardClick(index) {
  if (!memoryActive) return;

  const card = memoryCards[index];
  const cardElement = document.querySelectorAll(".memory-card")[index];

  // Ignoruj jeśli karta już odkryta lub dopasowana
  if (
    card.matched ||
    cardElement.classList.contains("flipped") ||
    flippedCards.length >= 2
  ) {
    return;
  }

  // Odkryj kartę
  flipCard(index);
  flippedCards.push(index);

  // Jeśli odkryto 2 karty, sprawdź czy pasują
  if (flippedCards.length === 2) {
    memoryMoves++;
    updateMemoryScore();

    setTimeout(() => {
      checkMatch();
    }, 800);
  }
}

// Funkcja odkrywania karty
function flipCard(index) {
  const cardElement = document.querySelectorAll(".memory-card")[index];
  cardElement.classList.add("flipped");

  const cardBack = cardElement.querySelector(".card-back");
  const cardFront = cardElement.querySelector(".card-front");

  cardBack.style.opacity = "0";
  cardFront.style.opacity = "1";

  playBeep(440, 0.1);
}

// Funkcja chowania karty
function unflipCard(index) {
  const cardElement = document.querySelectorAll(".memory-card")[index];
  cardElement.classList.remove("flipped");

  const cardBack = cardElement.querySelector(".card-back");
  const cardFront = cardElement.querySelector(".card-front");

  cardBack.style.opacity = "1";
  cardFront.style.opacity = "0";
}

// Funkcja sprawdzania dopasowania
function checkMatch() {
  const [index1, index2] = flippedCards;
  const card1 = memoryCards[index1];
  const card2 = memoryCards[index2];

  if (card1.id === card2.id) {
    // Para pasuje!
    card1.matched = true;
    card2.matched = true;
    matchedPairs++;

    // Animacja dopasowania
    const cardElements = document.querySelectorAll(".memory-card");
    cardElements[index1].style.opacity = "0.6";
    cardElements[index2].style.opacity = "0.6";

    playBeep(660, 0.2);

    // Sprawdź czy gra skończona
    if (matchedPairs === 8) {
      setTimeout(() => {
        endMemory();
      }, 500);
    }
  } else {
    // Para nie pasuje - schowaj karty
    setTimeout(() => {
      unflipCard(index1);
      unflipCard(index2);
      playBeep(220, 0.1);
    }, 200);
  }

  flippedCards = [];
}

// Funkcja aktualizacji wyniku
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

// Funkcja timera
function startMemoryTimer() {
  memoryInterval = setInterval(() => {
    if (memoryActive) {
      memoryTimer++;
      updateMemoryScore();
    }
  }, 1000);
}

// Funkcja końca gry
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

  // Zapisz wynik
  saveScore("memory_best_moves", memoryMoves);
  saveScore("memory_best_time", memoryTimer);

  // Dodaj do ukończonych gier
  addCompletedGame("memory");

  // Dźwięk wygranej
  playWinSound();
}

// Funkcja zatrzymania gry
function stopMemory() {
  memoryActive = false;
  if (memoryInterval) {
    clearInterval(memoryInterval);
  }
}
