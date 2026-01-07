// puzzle.js - Gra: PISAREK PUZZLE (Sliding Puzzle 3x3)

let puzzleActive = false;
let puzzleGrid = [];
let emptyPos = 8; // Pozycja pustego pola (0-8)
let puzzleMoves = 0;
let selectedImage = "./assets/fanart/placeholder1.jpg"; // Wybrany obrazek

// Dostępne obrazki do wyboru
const puzzleImages = [
  { path: "./assets/fanart/fanart12.png", name: "Obrazek 1" },
  { path: "./assets/fanart/fanart13.png", name: "Obrazek 2" },
  { path: "./assets/fanart/fanart14.png", name: "Obrazek 3" },
];

// Funkcja startowania puzzle
function startPuzzle() {
  // Zawsze pokazuj historię na początku
  showPuzzleStory();
}

// Funkcja wyświetlania historii przed puzzle
function showPuzzleStory() {
  const gameContent = document.getElementById("game-content");
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
      ">🧩 POSKŁADAJ OBRAZEK! 🧩</h2>
      
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
          🎨 Źli ludzie pomieszali wszystkie<br/>śmieszne obrazki Pisario!
        </p>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--white);
          margin-bottom: 15px;
        ">
          🖼️ Fanartowe rysunki zostały pocięte<br/>na kawałki i trzeba je poskładać!
        </p>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--yellow);
          margin-bottom: 15px;
          font-weight: bold;
        ">
          🔍 Tylko Ty potrafisz<br/>je ułożyć!
        </p>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--white);
        ">
          ⚡ Poskładaj śmieszne animacje<br/>i ciesz się widokiem<br/>ukończonego dzieła!
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
          font-size: 9px;
          color: var(--yellow);
          margin-bottom: 8px;
        ">
          🎯 WSKAZÓWKA 🎯
        </p>
        <p style="
          font-size: 9px;
          color: var(--white);
          line-height: 1.6;
        ">
          Klikaj kafelki obok pustego pola,<br/>
          aby je przesuwać. Im mniej ruchów,<br/>
          tym lepiej!
        </p>
      </div>
      
      <button id="puzzle-story-start-btn" style="
        font-family: 'Press Start 2P', cursive;
        font-size: 14px;
        padding: 15px 40px;
        background: var(--yellow);
        color: var(--dark-gray);
        border: 4px solid var(--dark-gray);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 6px 0 #b8860b;
      "
      onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 0 #b8860b'"
      onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 0 #b8860b'"
      onmousedown="this.style.transform='translateY(4px)'; this.style.boxShadow='0 2px 0 #b8860b'"
      onmouseup="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 0 #b8860b'"
      >
        ZACZNIJ UKŁADAĆ!
      </button>
    </div>
  `;

  document
    .getElementById("puzzle-story-start-btn")
    .addEventListener("click", () => {
      // Przejdź do wyboru obrazka
      puzzleActive = false;
      puzzleMoves = 0;
      document.getElementById("game-title").textContent = "PISAREK PUZZLE";
      document.getElementById("game-score").textContent = "WYBIERZ OBRAZEK";
      showImageSelection();
    });
}

// Funkcja wyświetlania wyboru obrazka
function showImageSelection() {
  const gameContent = document.getElementById("game-content");

  gameContent.innerHTML = `
    <div style="text-align: center; width: 100%; max-width: 600px;">
      <h2 style="font-size: 18px; color: var(--dark-gray); margin-bottom: 30px;">
        Wybierz obrazek do ułożenia:
      </h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin-bottom: 20px;">
        ${puzzleImages
          .map(
            (img, index) => `
          <div class="image-choice" data-index="${index}" style="
            cursor: pointer;
            border: 4px solid var(--dark-gray);
            border-radius: 10px;
            overflow: hidden;
            transition: transform 0.2s, border-color 0.2s;
            background: var(--light-gray);
          ">
            <img src="${img.path}" alt="${img.name}" style="width: 100%; height: auto; display: block;">
            <p style="font-size: 10px; color: var(--dark-gray); padding: 10px; margin: 0;">
              ${img.name}
            </p>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;

  // Dodaj event listenery do wyboru obrazka
  const choices = gameContent.querySelectorAll(".image-choice");
  choices.forEach((choice, index) => {
    choice.addEventListener("click", function () {
      selectedImage = puzzleImages[index].path;
      startPuzzleGame();
      playBeep(660, 0.1);
    });

    // Hover effect
    choice.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.05)";
      this.style.borderColor = "var(--yellow)";
    });

    choice.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
      this.style.borderColor = "var(--dark-gray)";
    });
  });
}

// Funkcja startowania właściwej gry po wyborze obrazka
function startPuzzleGame() {
  puzzleActive = true;
  puzzleMoves = 0;

  // Ustaw wynik
  document.getElementById("game-score").textContent = "RUCHY: 0";

  // Inicjalizuj grid (0-8, gdzie 8 = puste pole)
  puzzleGrid = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  emptyPos = 8;

  // Przetasuj puzzle (zapewniając rozwiązywalność)
  shufflePuzzle();

  // Renderuj puzzle
  renderPuzzle();
}

// Funkcja tasowania puzzle (losowe ruchy)
function shufflePuzzle() {
  // Wykonaj 100 losowych ruchów
  for (let i = 0; i < 100; i++) {
    const neighbors = getNeighbors(emptyPos);
    const randomNeighbor =
      neighbors[Math.floor(Math.random() * neighbors.length)];
    swapTiles(emptyPos, randomNeighbor);
  }

  // Reset licznika ruchów po tasowaniu
  puzzleMoves = 0;
}

// Funkcja pobierania sąsiadów (góra, dół, lewo, prawo)
function getNeighbors(pos) {
  const neighbors = [];
  const row = Math.floor(pos / 3);
  const col = pos % 3;

  // Góra
  if (row > 0) neighbors.push(pos - 3);
  // Dół
  if (row < 2) neighbors.push(pos + 3);
  // Lewo
  if (col > 0) neighbors.push(pos - 1);
  // Prawo
  if (col < 2) neighbors.push(pos + 1);

  return neighbors;
}

// Funkcja zamiany kafelków
function swapTiles(pos1, pos2) {
  const temp = puzzleGrid[pos1];
  puzzleGrid[pos1] = puzzleGrid[pos2];
  puzzleGrid[pos2] = temp;

  // Aktualizuj pozycję pustego pola
  if (puzzleGrid[pos1] === 8) emptyPos = pos1;
  if (puzzleGrid[pos2] === 8) emptyPos = pos2;
}

// Funkcja renderowania puzzle
function renderPuzzle() {
  const gameContent = document.getElementById("game-content");

  gameContent.innerHTML = `
        <div style="width: 100%; max-width: 450px;">
            <div id="puzzle-grid" style="
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 5px;
                background: var(--dark-gray);
                padding: 5px;
                border-radius: 10px;
            ">
                ${puzzleGrid
                  .map((tile, index) => {
                    // Oblicz pozycję kolumny i wiersza dla kafelka (0-8)
                    const col = tile % 3;
                    const row = Math.floor(tile / 3);
                    const bgPosX = col * -150; // -150px dla każdej kolumny (450px / 3 = 150px)
                    const bgPosY = row * -150; // -150px dla każdego wiersza

                    return `
                    <div class="puzzle-tile ${tile === 8 ? "empty" : ""}" 
                         data-index="${index}"
                         data-tile="${tile}"
                         style="
                             aspect-ratio: 1;
                             background: ${
                               tile === 8
                                 ? "transparent"
                                 : `url('${selectedImage}')`
                             };
                             background-size: 450px 450px;
                             background-position: ${bgPosX}px ${bgPosY}px;
                             border: 2px solid var(--dark-gray);
                             border-radius: 5px;
                             cursor: ${tile === 8 ? "default" : "pointer"};
                             transition: transform 0.1s;
                         ">
                    </div>
                `;
                  })
                  .join("")}
            </div>
            <p style="text-align: center; margin-top: 20px; font-size: 10px; color: var(--gray);">
                Kliknij kafelek obok pustego pola aby go przesunąć
            </p>
        </div>
    `;

  // Dodaj event listenery do kafelków
  const tiles = gameContent.querySelectorAll(".puzzle-tile");
  tiles.forEach((tile) => {
    tile.addEventListener("click", function () {
      const index = parseInt(this.getAttribute("data-index"));
      handleTileClick(index);
    });

    // Hover effect
    tile.addEventListener("mouseenter", function () {
      if (this.getAttribute("data-tile") !== "8") {
        this.style.transform = "scale(0.95)";
      }
    });

    tile.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  });
}

// Funkcja obsługi kliknięcia kafelka
function handleTileClick(index) {
  if (!puzzleActive) return;

  const tileValue = puzzleGrid[index];

  // Sprawdź czy kafelek jest obok pustego pola
  const neighbors = getNeighbors(emptyPos);

  if (neighbors.includes(index) && tileValue !== 8) {
    // Zamień miejscami
    swapTiles(emptyPos, index);
    puzzleMoves++;

    // Aktualizuj licznik ruchów
    document.getElementById("game-score").textContent = "RUCHY: " + puzzleMoves;

    // Renderuj ponownie
    renderPuzzle();

    // Odtwórz dźwięk
    playBeep(440, 0.05);

    // Sprawdź czy puzzle jest ułożone
    checkPuzzleWin();
  }
}

// Funkcja sprawdzania wygranej
function checkPuzzleWin() {
  // Sprawdź czy wszystkie kafelki są na swoim miejscu
  const solved = puzzleGrid.every((tile, index) => tile === index);

  if (solved) {
    endPuzzle(true);
  }
}

// Funkcja końca puzzle
function endPuzzle(won) {
  puzzleActive = false;
  const gameContent = document.getElementById("game-content");

  if (won) {
    gameContent.innerHTML = `
            <div style="text-align: center;">
                <h2 style="font-size: 24px; color: var(--green); margin-bottom: 20px;">
                    🎉 GRATULACJE! 🎉
                </h2>
                <p style="font-size: 14px; color: var(--dark-gray); margin-bottom: 15px;">
                    Ułożyłeś puzzle!
                </p>
                <p style="font-size: 12px; color: var(--blue); margin-bottom: 20px;">
                    RUCHY: ${puzzleMoves}
                </p>
                <button class="btn-play" onclick="startPuzzle()">ZAGRAJ PONOWNIE</button>
            </div>
        `;

    // Dodaj do ukończonych gier
    addCompletedGame("puzzle");
    // Nagród 10 monet
    addCoins(10);
    showToast("+10 🪙 za ukończenie Puzzle!");

    // Sprawdź osiągnięcie MISTRZ UKŁADANIA (<60 ruchów)
    if (puzzleMoves < 60) {
      unlockAchievement("mistrz_ukladania");
    }

    // Odtwórz dźwięk wygranej
    playWinSound();
  }
}

// Funkcja zatrzymania puzzle
function stopPuzzle() {
  puzzleActive = false;
}
