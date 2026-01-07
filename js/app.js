// app.js - Główna logika nawigacji i inicjalizacji

// Zmienna do przechowywania wybranego avatara
let selectedAvatar = "mario";
const avatarEmojis = {
  mario: "🍄",
  link: "🗡️",
  pacman: "🟡",
  ghost: "👾",
  star: "⭐",
  coin: "🪙",
  controller: "🎮",
  trophy: "🏆",
  // Płatne avatary (odblokowane w sklepie)
  dino: "🦖",
  lightning: "⚡",
  target: "🎯",
  rocket: "🚀",
};

// Kody do odblokowywania gier
const gameCodes = {
  PACMAN: "pacman",
  TETRIS: "tetris",
  PONG: "pong",
  KONG: "kong",
  INVADERS: "invaders",
};

// Inicjalizacja po załadowaniu strony
document.addEventListener("DOMContentLoaded", function () {
  // Inicjalizuj localStorage
  initStorage();

  // Inicjalizuj sklep
  initShop();

  // Załaduj osiągnięcia i fanarty
  renderAchievements();
  renderFanarts();

  // Sprawdź odblokowane gry i zaktualizuj UI
  updateUnlockedGames();

  // Sprawdź czy Invaders powinien być odblokowany
  checkInvadersUnlock();

  // Dodaj puchary do ukończonych gier
  updateCompletedGamesUI();

  // Zastosuj zapisane tło i styl menu
  const savedBg = getActiveBackground();
  if (savedBg && savedBg !== "default") {
    applyBackground(savedBg);
  }
  const savedStyle = getActiveMenuStyle();
  if (savedStyle && savedStyle !== "default") {
    applyMenuStyle(savedStyle);
  }

  // Sprawdź czy użytkownik ma już profil
  const userData = loadData();
  if (userData.profile && userData.profile.nick) {
    // Użytkownik ma profil - pokaż dane w menu
    updateProfileDisplay(
      userData.profile.nick,
      userData.profile.avatar || "mario"
    );
  }

  // Event listener dla przycisku START
  const startButton = document.getElementById("start-button");
  startButton.addEventListener("click", function () {
    const userData = loadData();

    // Sprawdź czy użytkownik ma już profil
    if (userData.profile && userData.profile.nick) {
      // Przejdź bezpośrednio do menu
      document.getElementById("start-screen").style.display = "none";
      document.getElementById("main-menu").style.display = "block";
    } else {
      // Pokaż ekran profilu
      document.getElementById("start-screen").style.display = "none";
      document.getElementById("profile-screen").style.display = "block";
    }

    playBeep(440, 0.1);
  });

  // Event listenery dla avatarów
  const avatarChoices = document.querySelectorAll(".avatar-choice");
  avatarChoices.forEach((choice) => {
    choice.addEventListener("click", function () {
      // Usuń zaznaczenie z innych avatarów
      avatarChoices.forEach((c) => {
        c.style.borderColor = "var(--dark-gray)";
        c.style.background = "var(--light-gray)";
        c.style.transform = "scale(1)";
      });

      // Zaznacz wybrany avatar
      this.style.borderColor = "var(--yellow)";
      this.style.background = "var(--white)";
      this.style.transform = "scale(1.1)";

      selectedAvatar = this.getAttribute("data-avatar");
      playBeep(660, 0.1);
    });

    // Hover effect
    choice.addEventListener("mouseenter", function () {
      if (this.getAttribute("data-avatar") !== selectedAvatar) {
        this.style.transform = "scale(1.05)";
      }
    });

    choice.addEventListener("mouseleave", function () {
      if (this.getAttribute("data-avatar") !== selectedAvatar) {
        this.style.transform = "scale(1)";
      }
    });
  });

  // Zaznacz domyślny avatar
  const defaultAvatar = document.querySelector(
    '.avatar-choice[data-avatar="mario"]'
  );
  if (defaultAvatar) {
    defaultAvatar.style.borderColor = "var(--yellow)";
    defaultAvatar.style.background = "var(--white)";
    defaultAvatar.style.transform = "scale(1.1)";
  }

  // Event listener dla przycisku zatwierdzenia profilu
  const confirmProfileBtn = document.getElementById("confirm-profile-btn");
  confirmProfileBtn.addEventListener("click", function () {
    const nickInput = document.getElementById("profile-nick");
    const nick = nickInput.value.trim().toUpperCase();

    if (!nick) {
      showToast("Wpisz nick!");
      playBeep(220, 0.2);
      return;
    }

    // Zapisz profil
    saveData("profile", {
      nick: nick,
      avatar: selectedAvatar,
    });

    // Aktualizuj wyświetlanie profilu
    updateProfileDisplay(nick, selectedAvatar);

    // Przejdź do menu
    document.getElementById("profile-screen").style.display = "none";
    document.getElementById("main-menu").style.display = "block";

    // Pokaż modal powitalny przy pierwszym uruchomieniu
    showWelcomeModal();

    playBeep(880, 0.2);
  });

  // Enter w input nicku
  const profileNickInput = document.getElementById("profile-nick");
  profileNickInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      confirmProfileBtn.click();
    }
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
      renderShop(); // Odśwież sklep
      playBeep(220, 0.3);

      // Odśwież stronę po krótkiej chwili
      setTimeout(function () {
        location.reload();
      }, 1000);
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

  // Kliknięcie na profil użytkownika - otwórz modal edycji
  const userProfileDisplay = document.getElementById("user-profile-display");
  if (userProfileDisplay) {
    userProfileDisplay.addEventListener("click", function () {
      openEditProfileModal();
      playBeep(660, 0.1);
    });

    // Hover effect
    userProfileDisplay.addEventListener("mouseenter", function () {
      this.style.background = "var(--yellow)";
      this.style.transform = "scale(1.05)";
    });

    userProfileDisplay.addEventListener("mouseleave", function () {
      this.style.background = "var(--light-gray)";
      this.style.transform = "scale(1)";
    });
  }

  // Modal edycji profilu - zamknięcie
  const editProfileClose = document.getElementById("edit-profile-close");
  editProfileClose.addEventListener("click", function () {
    closeEditProfileModal();
    playBeep(440, 0.1);
  });

  // Modal edycji profilu - kliknięcie w tło
  const editProfileModal = document.getElementById("edit-profile-modal");
  editProfileModal.addEventListener("click", function (e) {
    if (e.target === editProfileModal) {
      closeEditProfileModal();
      playBeep(440, 0.1);
    }
  });

  // Event listenery dla avatarów w modalU edycji
  const editAvatarChoices = document.querySelectorAll(".edit-avatar-choice");
  editAvatarChoices.forEach((choice) => {
    choice.addEventListener("click", function () {
      // Usuń zaznaczenie z innych avatarów
      editAvatarChoices.forEach((c) => {
        c.style.borderColor = "var(--dark-gray)";
        c.style.background = "var(--light-gray)";
        c.style.transform = "scale(1)";
      });

      // Zaznacz wybrany avatar
      this.style.borderColor = "var(--yellow)";
      this.style.background = "var(--white)";
      this.style.transform = "scale(1.1)";

      selectedAvatar = this.getAttribute("data-avatar");
      playBeep(660, 0.1);
    });

    // Hover effect
    choice.addEventListener("mouseenter", function () {
      if (this.getAttribute("data-avatar") !== selectedAvatar) {
        this.style.transform = "scale(1.05)";
      }
    });

    choice.addEventListener("mouseleave", function () {
      if (this.getAttribute("data-avatar") !== selectedAvatar) {
        this.style.transform = "scale(1)";
      }
    });
  });

  // Przycisk zapisu profilu
  const saveProfileBtn = document.getElementById("save-profile-btn");
  saveProfileBtn.addEventListener("click", function () {
    const nickInput = document.getElementById("edit-profile-nick");
    const nick = nickInput.value.trim().toUpperCase();

    if (!nick) {
      showToast("Wpisz nick!");
      playBeep(220, 0.2);
      return;
    }

    // Zapisz profil
    saveData("profile", {
      nick: nick,
      avatar: selectedAvatar,
    });

    // Aktualizuj wyświetlanie profilu
    updateProfileDisplay(nick, selectedAvatar);

    // Zamknij modal
    closeEditProfileModal();

    showToast("Profil zaktualizowany!");
    playBeep(880, 0.2);
  });

  // Enter w input nicku w modalu edycji
  const editProfileNickInput = document.getElementById("edit-profile-nick");
  editProfileNickInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      saveProfileBtn.click();
    }
  });
});

// Funkcja aktualizacji wyświetlania profilu
function updateProfileDisplay(nick, avatar) {
  const userNickDisplay = document.getElementById("user-nick");
  const userAvatarDisplay = document.getElementById("user-avatar");
  const userCoinsDisplay = document.getElementById("user-coins");

  if (userNickDisplay) {
    userNickDisplay.textContent = nick;
  }

  if (userAvatarDisplay) {
    userAvatarDisplay.textContent = avatarEmojis[avatar] || "🍄";
  }

  // Aktualizuj wyświetlanie monet
  if (userCoinsDisplay) {
    const coins = getCoins();
    userCoinsDisplay.textContent = `🪙 ${coins}`;
  }
}

// Funkcja otwierania modalu edycji profilu
function openEditProfileModal() {
  const userData = loadData();
  const currentNick = userData.profile?.nick || "";
  const currentAvatar = userData.profile?.avatar || "mario";

  // Ustaw obecne wartości w inputach
  const editNickInput = document.getElementById("edit-profile-nick");
  if (editNickInput) {
    editNickInput.value = currentNick;
  }

  // Ustaw selectedAvatar
  selectedAvatar = currentAvatar;

  // Pobierz dostępne avatary (domyślne + kupione)
  const availableAvatars = getAvailableAvatars();

  // Zaznacz obecny avatar i ukryj niedostępne
  const editAvatarChoices = document.querySelectorAll(".edit-avatar-choice");
  editAvatarChoices.forEach((choice) => {
    const avatarId = choice.getAttribute("data-avatar");

    // Sprawdź czy avatar jest dostępny
    if (!availableAvatars.includes(avatarId)) {
      choice.style.display = "none"; // Ukryj niedostępne
      return;
    }

    choice.style.display = "block"; // Pokaż dostępne

    if (avatarId === currentAvatar) {
      choice.style.borderColor = "var(--yellow)";
      choice.style.background = "var(--white)";
      choice.style.transform = "scale(1.1)";
    } else {
      choice.style.borderColor = "var(--dark-gray)";
      choice.style.background = "var(--light-gray)";
      choice.style.transform = "scale(1)";
    }
  });

  // Renderuj kupione tła i style
  renderPurchasedBackgrounds();
  renderPurchasedMenuStyles();

  // Pokaż modal
  const modal = document.getElementById("edit-profile-modal");
  if (modal) {
    modal.style.display = "flex";
  }
}

// Funkcja renderowania kupionych tła
function renderPurchasedBackgrounds() {
  const container = document.getElementById("background-choices");
  const containerDiv = document.getElementById(
    "background-selection-container"
  );
  if (!container || !containerDiv) return;

  const currentBg = getActiveBackground();

  // Pobierz kupione tła
  const purchasedBgs = [];
  if (hasPurchased("bg_night"))
    purchasedBgs.push({ id: "bg-night", name: "NOCNE", emoji: "🌙" });
  if (hasPurchased("bg_retro"))
    purchasedBgs.push({ id: "bg-retro", name: "RETRO", emoji: "📺" });
  if (hasPurchased("bg_neon"))
    purchasedBgs.push({ id: "bg-neon", name: "NEON", emoji: "💫" });
  if (hasPurchased("bg_switch"))
    purchasedBgs.push({ id: "bg-switch", name: "SWITCH", emoji: "🎮" });

  // Jeśli są kupione tła, pokaż sekcję
  if (purchasedBgs.length > 0) {
    containerDiv.style.display = "block";

    // Dodaj kupione tła do wyboru
    purchasedBgs.forEach((bg) => {
      const bgChoice = document.createElement("div");
      bgChoice.className = "bg-choice";
      bgChoice.setAttribute("data-bg", bg.id);
      bgChoice.style.cssText = `
        cursor: pointer;
        padding: 10px 15px;
        border: 4px solid var(--dark-gray);
        border-radius: 10px;
        background: var(--light-gray);
        font-size: 8px;
        text-align: center;
        transition: all 0.2s;
      `;
      bgChoice.textContent = `${bg.emoji} ${bg.name}`;

      // Zaznacz aktywne
      if (currentBg === bg.id) {
        bgChoice.style.borderColor = "var(--yellow)";
        bgChoice.style.background = "var(--white)";
      }

      bgChoice.addEventListener("click", () => {
        // Odznacz wszystkie
        document.querySelectorAll(".bg-choice").forEach((c) => {
          c.style.borderColor = "var(--dark-gray)";
          c.style.background =
            c.getAttribute("data-bg") === "default"
              ? "linear-gradient(135deg, var(--red) 0%, var(--yellow) 50%, var(--blue) 100%)"
              : "var(--light-gray)";
        });

        // Zaznacz wybrany
        bgChoice.style.borderColor = "var(--yellow)";
        bgChoice.style.background = "var(--white)";

        // Zastosuj tło
        applyBackground(bg.id);
        setActiveBackground(bg.id);
        playBeep(660, 0.1);
      });

      container.appendChild(bgChoice);
    });
  }

  // Event listener dla domyślnego tła
  const defaultBg = container.querySelector('[data-bg="default"]');
  if (defaultBg) {
    if (currentBg === "default") {
      defaultBg.style.borderColor = "var(--yellow)";
    }

    defaultBg.addEventListener("click", () => {
      document.querySelectorAll(".bg-choice").forEach((c) => {
        c.style.borderColor = "var(--dark-gray)";
        c.style.background =
          c.getAttribute("data-bg") === "default"
            ? "linear-gradient(135deg, var(--red) 0%, var(--yellow) 50%, var(--blue) 100%)"
            : "var(--light-gray)";
      });

      defaultBg.style.borderColor = "var(--yellow)";
      applyBackground("default");
      setActiveBackground("default");
      playBeep(660, 0.1);
    });
  }
}

// Funkcja renderowania kupionych stylów menu
function renderPurchasedMenuStyles() {
  const container = document.getElementById("menustyle-choices");
  const containerDiv = document.getElementById("menustyle-selection-container");
  if (!container || !containerDiv) return;

  const currentStyle = getActiveMenuStyle();

  // Pobierz kupione style
  const purchasedStyles = [];
  if (hasPurchased("style_nes"))
    purchasedStyles.push({ id: "menu-nes", name: "NES", emoji: "🎮" });
  if (hasPurchased("style_gameboy"))
    purchasedStyles.push({ id: "menu-gameboy", name: "GAME BOY", emoji: "🟢" });
  if (hasPurchased("style_switch"))
    purchasedStyles.push({ id: "menu-switch", name: "SWITCH", emoji: "🔴" });

  // Jeśli są kupione style, pokaż sekcję
  if (purchasedStyles.length > 0) {
    containerDiv.style.display = "block";

    // Dodaj kupione style do wyboru
    purchasedStyles.forEach((style) => {
      const styleChoice = document.createElement("div");
      styleChoice.className = "style-choice";
      styleChoice.setAttribute("data-style", style.id);
      styleChoice.style.cssText = `
        cursor: pointer;
        padding: 10px 15px;
        border: 4px solid var(--dark-gray);
        border-radius: 10px;
        background: var(--light-gray);
        font-size: 8px;
        text-align: center;
        transition: all 0.2s;
      `;
      styleChoice.textContent = `${style.emoji} ${style.name}`;

      // Zaznacz aktywny
      if (currentStyle === style.id) {
        styleChoice.style.borderColor = "var(--yellow)";
        styleChoice.style.background = "var(--white)";
      }

      styleChoice.addEventListener("click", () => {
        // Odznacz wszystkie
        document.querySelectorAll(".style-choice").forEach((c) => {
          c.style.borderColor = "var(--dark-gray)";
          c.style.background = "var(--light-gray)";
        });

        // Zaznacz wybrany
        styleChoice.style.borderColor = "var(--yellow)";
        styleChoice.style.background = "var(--white)";

        // Zastosuj styl
        applyMenuStyle(style.id);
        setActiveMenuStyle(style.id);
        playBeep(660, 0.1);
      });

      container.appendChild(styleChoice);
    });
  }

  // Event listener dla domyślnego stylu
  const defaultStyle = container.querySelector('[data-style="default"]');
  if (defaultStyle) {
    if (currentStyle === "default") {
      defaultStyle.style.borderColor = "var(--yellow)";
    }

    defaultStyle.addEventListener("click", () => {
      document.querySelectorAll(".style-choice").forEach((c) => {
        c.style.borderColor = "var(--dark-gray)";
        c.style.background = "var(--light-gray)";
      });

      defaultStyle.style.borderColor = "var(--yellow)";
      applyMenuStyle("default");
      setActiveMenuStyle("default");
      playBeep(660, 0.1);
    });
  }
}

// Funkcja otwierania modalu edycji profilu
function openEditProfileModal() {
  const userData = loadData();
  const currentNick = userData.profile?.nick || "";
  const currentAvatar = userData.profile?.avatar || "mario";

  // Ustaw obecne wartości w inputach
  const editNickInput = document.getElementById("edit-profile-nick");
  if (editNickInput) {
    editNickInput.value = currentNick;
  }

  // Ustaw selectedAvatar
  selectedAvatar = currentAvatar;

  // Pobierz dostępne avatary (domyślne + kupione)
  const availableAvatars = getAvailableAvatars();

  // Zaznacz obecny avatar i ukryj niedostępne
  const editAvatarChoices = document.querySelectorAll(".edit-avatar-choice");
  editAvatarChoices.forEach((choice) => {
    const avatarId = choice.getAttribute("data-avatar");

    // Sprawdź czy avatar jest dostępny
    if (!availableAvatars.includes(avatarId)) {
      choice.style.display = "none"; // Ukryj niedostępne
      return;
    }

    choice.style.display = "block"; // Pokaż dostępne

    if (avatarId === currentAvatar) {
      choice.style.borderColor = "var(--yellow)";
      choice.style.background = "var(--white)";
      choice.style.transform = "scale(1.1)";
    } else {
      choice.style.borderColor = "var(--dark-gray)";
      choice.style.background = "var(--light-gray)";
      choice.style.transform = "scale(1)";
    }
  });

  // Wyczyść i renderuj kupione tła/style
  const bgContainer = document.getElementById("background-choices");
  const styleContainer = document.getElementById("menustyle-choices");
  if (bgContainer) {
    // Zachowaj tylko domyślny element
    const defaultBg = bgContainer.querySelector('[data-bg="default"]');
    bgContainer.innerHTML = "";
    if (defaultBg) bgContainer.appendChild(defaultBg);
  }
  if (styleContainer) {
    // Zachowaj tylko domyślny element
    const defaultStyle = styleContainer.querySelector('[data-style="default"]');
    styleContainer.innerHTML = "";
    if (defaultStyle) styleContainer.appendChild(defaultStyle);
  }

  // Renderuj kupione tła i style
  renderPurchasedBackgrounds();
  renderPurchasedMenuStyles();

  // Pokaż modal
  const modal = document.getElementById("edit-profile-modal");
  if (modal) {
    modal.style.display = "flex";
  }
}

// Funkcja zamykania modalu edycji profilu
function closeEditProfileModal() {
  const modal = document.getElementById("edit-profile-modal");
  if (modal) {
    modal.style.display = "none";
  }
}

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
  // Sprawdź czy gra jest zablokowana
  if (
    (gameName === "pacman" || gameName === "tetris") &&
    !isGameUnlocked(gameName)
  ) {
    showToast("Gra zablokowana! Odblokuj kodem 🔒");
    playBeep(220, 0.3);
    return;
  }

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
    case "memory":
      startMemory();
      break;
    case "pacman":
      startPacman();
      break;
    case "tetris":
      startTetris();
      break;
    case "pong":
      startPong();
      break;
    case "kong":
      if (typeof showKongStory === "function" && !storyShown) {
        showKongStory();
      } else {
        startKong();
      }
      break;
    case "mario":
      startMario();
      break;
    case "invaders":
      startInvaders();
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
  if (typeof stopMemory === "function") stopMemory();
  if (typeof stopPacman === "function") stopPacman();
  if (typeof stopTetris === "function") stopTetris();
  if (typeof stopPong === "function") stopPong();
  if (typeof stopKong === "function") stopKong();
  if (typeof stopMario === "function") stopMario();
  if (typeof stopInvaders === "function") stopInvaders();
  if (typeof stopDino === "function") stopDino();
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

  // Sprawdź nowe kody
  let codeActivated = false;

  if (code === "TETRIS" && !isGameUnlocked("tetris")) {
    unlockGame("tetris");
    showToast("🟦 Odblokowano PISARIS (Tetris)!");
    playBeep(880, 0.3);
    codeActivated = true;
  } else if (code === "PONG" && !isGameUnlocked("pong")) {
    unlockGame("pong");
    showToast("🏓 Odblokowano PISARIO PONG!");
    playBeep(880, 0.3);
    codeActivated = true;
  } else if (code === "PACMAN" && !isGameUnlocked("pacman")) {
    unlockGame("pacman");
    showToast("🟡 Odblokowano PISACMAN!");
    playBeep(880, 0.3);
    codeActivated = true;
  } else if (code === "DOLARY") {
    addCoins(500);
    showToast("💰 +500 MONET!");
    playBeep(1200, 0.5);
    codeActivated = true;
  } else if (code === "KONAMICODE") {
    // Odblokuj wszystkie gry
    const allGames = ["pacman", "tetris", "pong", "kong", "invaders"];
    allGames.forEach((game) => {
      if (!isGameUnlocked(game)) {
        unlockGame(game);
      }
    });

    // Odblokuj wszystkie osiągnięcia
    const allAchievements = achievementsList.map((a) => a.id);
    allAchievements.forEach((achId) => {
      unlockAchievement(achId);
    });

    // Dodaj 2000 monet
    addCoins(2000);

    showToast("🎮 KOD KONAMI! Wszystko odblokowane + 2000 monet!");
    playAchievementSound();
    codeActivated = true;

    // Odśwież widok osiągnięć
    if (typeof renderAchievements === "function") {
      renderAchievements();
    }
  } else if (code === "PISARION3000") {
    showToast("🎨 Odkryto tajemniczą grafikę!");
    playAchievementSound();
    codeActivated = true;

    // Otwórz lightbox z fanart15.png
    setTimeout(() => {
      openLightbox("./assets/fanart/fanart15.png");
    }, 500);
  } else if (code === "DINO") {
    showToast("🦖 Uruchamianie POLSKI YOSHI RUNNER!");
    playBeep(880, 0.3);
    codeActivated = true;

    // Uruchom grę DINO
    setTimeout(() => {
      if (typeof startDino === "function") {
        startDino();
      }
    }, 500);
  } else {
    showToast("❌ Nieprawidłowy kod!");
    playBeep(220, 0.2);
  }

  codeInput.value = "";

  // Zaktualizuj UI jeśli coś zostało odblokowane
  if (codeActivated) {
    updateUnlockedGames();
  }
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

// Funkcja odblokowywania gry
function unlockGame(gameName) {
  const data = loadData();

  if (!data.unlockedGames) {
    data.unlockedGames = [];
  }

  if (!data.unlockedGames.includes(gameName)) {
    data.unlockedGames.push(gameName);
    saveData("unlockedGames", data.unlockedGames);
  }
}

// Funkcja sprawdzania czy gra jest odblokowana
function isGameUnlocked(gameName) {
  const data = loadData();
  return data.unlockedGames && data.unlockedGames.includes(gameName);
}

// Funkcja aktualizacji UI odblokowanych gier
function updateUnlockedGames() {
  const gameCards = document.querySelectorAll(".game-card[data-locked]");

  gameCards.forEach((card) => {
    const gameName = card.getAttribute("data-game");

    if (isGameUnlocked(gameName)) {
      // Odblokuj kartę
      card.classList.remove("locked");
      card.removeAttribute("data-locked");

      // Ukryj info o zablokowaniu
      const lockedInfo = card.querySelector(".locked-info");
      if (lockedInfo) {
        lockedInfo.style.display = "none";
      }

      // Zmień przycisk
      const button = card.querySelector(".btn-play");
      if (button) {
        button.textContent = "ZAGRAJ";
        button.removeAttribute("disabled");
      }
    }
  });
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

// Funkcja wyświetlania modalu powitalnego
function showWelcomeModal() {
  const modal = document.getElementById("welcome-modal");
  const closeBtn = document.getElementById("close-welcome-btn");

  if (modal && closeBtn) {
    modal.style.display = "flex";
    playBeep(660, 0.3);

    // Event listener dla przycisku zamknięcia (tylko raz)
    const handleClose = function () {
      modal.style.display = "none";
      playBeep(880, 0.2);

      const userData = loadData();
      showToast("Witaj, " + userData.profile.nick + "!");

      // Usuń listener po użyciu
      closeBtn.removeEventListener("click", handleClose);
    };

    closeBtn.addEventListener("click", handleClose);
  }
}

// Funkcja sprawdzająca czy Invaders powinien być odblokowany
function checkInvadersUnlock() {
  const data = loadData();
  const completedGames = data.gamesCompleted || [];

  if (completedGames.length >= 5) {
    unlockInvadersGame();
  }
}

// Funkcja odblokowująca grę Invaders
function unlockInvadersGame() {
  const invadersCard = document.getElementById("invaders-card");
  const invadersTitle = document.getElementById("invaders-title");
  const invadersDesc = document.getElementById("invaders-desc");

  if (!invadersCard || !invadersTitle || !invadersDesc) return;

  // Sprawdź czy już odblokowane
  if (invadersTitle.textContent !== "??????") return;

  // Odblokuj grę w systemie
  unlockGame("invaders");

  // Zmień tytuł i opis
  invadersTitle.textContent = "PISARIO INVADERS";
  invadersDesc.textContent = "Space Invaders z bossem";

  // Odblokuj kartę
  invadersCard.classList.remove("locked");
  invadersCard.removeAttribute("data-locked");

  // Ukryj info o zablokowaniu
  const lockedInfo = invadersCard.querySelector(".locked-info");
  if (lockedInfo) {
    lockedInfo.style.display = "none";
  }

  // Zmień przycisk
  const button = invadersCard.querySelector(".btn-play");
  if (button) {
    button.textContent = "ZAGRAJ";
    button.removeAttribute("disabled");
  }

  // Pokaż toast
  showToast("🚀 Odblokowano PISARIO INVADERS!");
  playAchievementSound();
}

// Funkcja dodawania pucharów do ukończonych gier
function updateCompletedGamesUI() {
  const userData = loadData();
  const completedGames = userData.gamesCompleted || [];

  completedGames.forEach(function (gameName) {
    const gameCard = document.querySelector(
      '.game-card[data-game="' + gameName + '"]'
    );

    if (gameCard && !gameCard.querySelector(".trophy-badge")) {
      // Dodaj puchar w prawym górnym rogu
      const trophy = document.createElement("div");
      trophy.className = "trophy-badge";
      trophy.innerHTML = "🏆";
      trophy.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 32px;
        animation: bounce 1s infinite;
        filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
      `;

      // Upewnij się, że karta ma position: relative
      gameCard.style.position = "relative";
      gameCard.appendChild(trophy);
    }
  });
}
