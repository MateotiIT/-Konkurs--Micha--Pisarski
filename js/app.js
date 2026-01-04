// app.js - Główna logika nawigacji i inicjalizacji

// Inicjalizacja po załadowaniu strony
document.addEventListener("DOMContentLoaded", function () {
  // Inicjalizuj localStorage
  initStorage();

  // Załaduj osiągnięcia i fanarty
  renderAchievements();
  renderFanarts();

  // Event listener dla przycisku START
  const startButton = document.getElementById("start-button");
  startButton.addEventListener("click", function () {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("main-menu").style.display = "block";
    playBeep(440, 0.1); // Beep przy kliknięciu
  });

  // Event listenery dla zakładek
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab");
      showTab(tabName);
      playBeep(440, 0.1);
    });
  });

  // Event listenery dla przycisków gier
  const playButtons = document.querySelectorAll(".btn-play");
  playButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const gameName = this.getAttribute("data-game");
      startGame(gameName);
      playBeep(660, 0.1);
    });
  });

  // Przycisk wyjścia do menu
  const exitButton = document.getElementById("exit-btn");
  exitButton.addEventListener("click", function () {
    exitToMenu();
    playBeep(440, 0.1);
  });

  // Przyciski w zakładce O Projekcie
  const resetProgressBtn = document.getElementById("reset-progress-btn");
  resetProgressBtn.addEventListener("click", function () {
    if (
      confirm(
        "Czy na pewno chcesz zresetować cały progres? Tej operacji nie można cofnąć!"
      )
    ) {
      resetData();
      showToast("Progres został zresetowany!");
      renderAchievements();
      renderFanarts();
      playBeep(220, 0.3);
    }
  });

  // Przycisk w zakładce Kod
  const submitCodeBtn = document.getElementById("submit-code-btn");
  submitCodeBtn.addEventListener("click", function () {
    handleCodeSubmit();
  });

  // Enter w input kodu
  const codeInput = document.getElementById("code-input");
  codeInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      handleCodeSubmit();
    }
  });

  // Lightbox - zamknięcie
  const lightboxClose = document.getElementById("lightbox-close");
  lightboxClose.addEventListener("click", function () {
    closeLightbox();
  });

  // Lightbox - kliknięcie w tło
  const lightbox = document.getElementById("lightbox");
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
});

// Funkcja pokazywania zakładek
function showTab(tabName) {
  // Ukryj wszystkie zakładki
  const allTabs = document.querySelectorAll(".tab-content");
  allTabs.forEach((tab) => {
    tab.classList.remove("active");
  });

  // Usuń aktywność z przycisków zakładek
  const allTabButtons = document.querySelectorAll(".tab");
  allTabButtons.forEach((btn) => {
    btn.classList.remove("active");
  });

  // Pokaż wybraną zakładkę
  const selectedTab = document.getElementById(tabName + "-tab");
  if (selectedTab) {
    selectedTab.classList.add("active");
  }

  // Zaznacz aktywny przycisk
  const selectedButton = document.querySelector(`.tab[data-tab="${tabName}"]`);
  if (selectedButton) {
    selectedButton.classList.add("active");
  }
}

// Funkcja startowania gry
function startGame(gameName) {
  // Ukryj menu
  document.getElementById("main-menu").style.display = "none";

  // Pokaż kontener gry
  document.getElementById("game-container").style.display = "block";

  // Wyczyść poprzednią zawartość
  const gameContent = document.getElementById("game-content");
  gameContent.innerHTML = "";

  // Uruchom odpowiednią grę
  switch (gameName) {
    case "quiz":
      startQuiz();
      break;
    case "puzzle":
      startPuzzle();
      break;
    case "pacman":
      startPacman();
      break;
    case "mario":
      startMario();
      break;
    case "tetris":
      startTetris();
      break;
    default:
      gameContent.innerHTML =
        '<p style="text-align: center;">Gra w przygotowaniu...</p>';
  }

  // Zwiększ licznik zagranych gier (dla osiągnięcia PIERWSZY KROK)
  incrementGamesPlayed();
}

// Funkcja wyjścia do menu
function exitToMenu() {
  // Zatrzymaj wszystkie gry (jeśli są aktywne)
  stopAllGames();

  // Ukryj kontener gry
  document.getElementById("game-container").style.display = "none";

  // Pokaż menu
  document.getElementById("main-menu").style.display = "block";
}

// Funkcja zatrzymania wszystkich gier
function stopAllGames() {
  // Wyczyść wszystkie interval/timeout dla gier
  // (każda gra powinna mieć swoją funkcję stop)
  if (typeof stopQuiz === "function") stopQuiz();
  if (typeof stopPuzzle === "function") stopPuzzle();
  if (typeof stopPacman === "function") stopPacman();
  if (typeof stopMario === "function") stopMario();
  if (typeof stopTetris === "function") stopTetris();
}

// Funkcja obsługi wpisania kodu
function handleCodeSubmit() {
  const codeInput = document.getElementById("code-input");
  const code = codeInput.value.trim().toUpperCase();

  if (!code) {
    showToast("Wpisz kod!");
    playBeep(220, 0.2);
    return;
  }

  // Tutaj będzie logika sprawdzania kodów
  showToast("Nieprawidłowy kod!");
  playBeep(220, 0.2);
  codeInput.value = "";
}

// Funkcja zamykania lightboxa
function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

// Funkcja otwierania lightboxa
function openLightbox(imageSrc) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  lightboxImg.src = imageSrc;
  lightbox.style.display = "flex";
  playBeep(660, 0.1);
}

// Funkcja zwiększania licznika zagranych gier
function incrementGamesPlayed() {
  const data = loadData();

  if (!data.stats) {
    data.stats = {};
  }

  if (!data.stats.totalGamesPlayed) {
    data.stats.totalGamesPlayed = 0;
  }

  data.stats.totalGamesPlayed++;
  saveData("stats", data.stats);

  // Sprawdź osiągnięcie PIERWSZY KROK
  if (data.stats.totalGamesPlayed === 1) {
    unlockAchievement("pierwszy_krok");
  }
}
