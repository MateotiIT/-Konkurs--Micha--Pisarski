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
};

// Kody do odblokowywania gier
const gameCodes = {
  PACMAN: "pacman",
  TETRIS: "tetris",
  PONG: "pong",
  KONG: "kong",
};

// Inicjalizacja po załadowaniu strony
document.addEventListener("DOMContentLoaded", function () {
  // Inicjalizuj localStorage
  initStorage();

  // Załaduj osiągnięcia i fanarty
  renderAchievements();
  renderFanarts();

  // Sprawdź odblokowane gry i zaktualizuj UI
  updateUnlockedGames();

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

    showToast("Witaj, " + nick + "!");
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

  if (userNickDisplay) {
    userNickDisplay.textContent = nick;
  }

  if (userAvatarDisplay) {
    userAvatarDisplay.textContent = avatarEmojis[avatar] || "🍄";
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

  // Zaznacz obecny avatar
  const editAvatarChoices = document.querySelectorAll(".edit-avatar-choice");
  editAvatarChoices.forEach((choice) => {
    const avatarId = choice.getAttribute("data-avatar");
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

  // Sprawdź kody odblokowujące gry
  let gameUnlocked = false;

  if (code === "PACMAN" && !isGameUnlocked("pacman")) {
    unlockGame("pacman");
    showToast("Odblokowano PISACMAN! 🟡");
    playBeep(880, 0.3);
    gameUnlocked = true;
  } else if (code === "TETRIS" && !isGameUnlocked("tetris")) {
    unlockGame("tetris");
    showToast("Odblokowano PISARIS! 🟦");
    playBeep(880, 0.3);
    gameUnlocked = true;
  } else if (code === "PONG" && !isGameUnlocked("pong")) {
    unlockGame("pong");
    showToast("Odblokowano PISARIO PONG! 🏓");
    playBeep(880, 0.3);
    gameUnlocked = true;
  } else if (code === "KONG" && !isGameUnlocked("kong")) {
    unlockGame("kong");
    showToast("Odblokowano PISARIO KONG! 🦍");
    playBeep(880, 0.3);
    gameUnlocked = true;
  } else {
    showToast("Nieprawidłowy kod!");
    playBeep(220, 0.2);
  }

  codeInput.value = "";

  // Zaktualizuj UI jeśli gra została odblokowana
  if (gameUnlocked) {
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
