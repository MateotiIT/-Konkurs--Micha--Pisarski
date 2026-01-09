


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
  
  dino: "🦖",
  lightning: "⚡",
  target: "🎯",
  rocket: "🚀",
};


const gameCodes = {
  PACMAN: "pacman",
  TETRIS: "tetris",
  PONG: "pong",
  KONG: "kong",
  INVADERS: "invaders",
};


document.addEventListener("DOMContentLoaded", function () {
  
  initStorage();

  
  initShop();

  
  renderAchievements();
  renderConsoles();

  
  updateUnlockedGames();

  
  checkInvadersUnlock();

  
  updateCompletedGamesUI();

  
  const savedBg = getActiveBackground();
  if (savedBg && savedBg !== "default") {
    applyBackground(savedBg);
  }
  const savedStyle = getActiveMenuStyle();
  if (savedStyle && savedStyle !== "default") {
    applyMenuStyle(savedStyle);
  }

  
  const userData = loadData();
  if (userData.profile && userData.profile.nick) {
    
    updateProfileDisplay(
      userData.profile.nick,
      userData.profile.avatar || "mario"
    );
  }

  
  const startButton = document.getElementById("start-button");
  startButton.addEventListener("click", function () {
    const userData = loadData();

    
    if (userData.profile && userData.profile.nick) {
      
      document.getElementById("start-screen").style.display = "none";
      document.getElementById("main-menu").style.display = "block";
    } else {
      
      document.getElementById("start-screen").style.display = "none";
      document.getElementById("profile-screen").style.display = "block";
    }

    playBeep(440, 0.1);
  });

  
  const avatarChoices = document.querySelectorAll(".avatar-choice");
  avatarChoices.forEach((choice) => {
    choice.addEventListener("click", function () {
      
      avatarChoices.forEach((c) => {
        c.style.borderColor = "var(--dark-gray)";
        c.style.background = "var(--light-gray)";
        c.style.transform = "scale(1)";
      });

      
      this.style.borderColor = "var(--yellow)";
      this.style.background = "var(--white)";
      this.style.transform = "scale(1.1)";

      selectedAvatar = this.getAttribute("data-avatar");
      playBeep(660, 0.1);
    });

    
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

  
  const defaultAvatar = document.querySelector(
    '.avatar-choice[data-avatar="mario"]'
  );
  if (defaultAvatar) {
    defaultAvatar.style.borderColor = "var(--yellow)";
    defaultAvatar.style.background = "var(--white)";
    defaultAvatar.style.transform = "scale(1.1)";
  }

  
  const confirmProfileBtn = document.getElementById("confirm-profile-btn");
  confirmProfileBtn.addEventListener("click", function () {
    const nickInput = document.getElementById("profile-nick");
    const nick = nickInput.value.trim().toUpperCase();

    if (!nick) {
      showToast("Wpisz nick!");
      playBeep(220, 0.2);
      return;
    }

    
    saveData("profile", {
      nick: nick,
      avatar: selectedAvatar,
    });

    
    updateProfileDisplay(nick, selectedAvatar);

    
    document.getElementById("profile-screen").style.display = "none";
    document.getElementById("main-menu").style.display = "block";

    
    showWelcomeModal();

    playBeep(880, 0.2);
  });

  
  const profileNickInput = document.getElementById("profile-nick");
  profileNickInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      confirmProfileBtn.click();
    }
  });

  
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab");
      showTab(tabName);
      playBeep(440, 0.1);
    });
  });

  
  const playButtons = document.querySelectorAll(".btn-play");
  playButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const gameName = this.getAttribute("data-game");
      startGame(gameName);
      playBeep(660, 0.1);
    });
  });

  
  const exitButton = document.getElementById("exit-btn");
  exitButton.addEventListener("click", function () {
    exitToMenu();
    playBeep(440, 0.1);
  });

  
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
      renderConsoles();
      renderShop(); 
      playBeep(220, 0.3);

      
      setTimeout(function () {
        location.reload();
      }, 1000);
    }
  });

  
  const submitCodeBtn = document.getElementById("submit-code-btn");
  submitCodeBtn.addEventListener("click", function () {
    handleCodeSubmit();
  });

  
  const codeInput = document.getElementById("code-input");
  codeInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      handleCodeSubmit();
    }
  });

  
  const lightboxClose = document.getElementById("lightbox-close");
  lightboxClose.addEventListener("click", function () {
    closeLightbox();
  });

  
  const lightbox = document.getElementById("lightbox");
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  
  const userProfileDisplay = document.getElementById("user-profile-display");
  if (userProfileDisplay) {
    userProfileDisplay.addEventListener("click", function () {
      openEditProfileModal();
      playBeep(660, 0.1);
    });

    
    userProfileDisplay.addEventListener("mouseenter", function () {
      this.style.background = "var(--yellow)";
      this.style.transform = "scale(1.05)";
    });

    userProfileDisplay.addEventListener("mouseleave", function () {
      this.style.background = "var(--light-gray)";
      this.style.transform = "scale(1)";
    });
  }

  
  const editProfileClose = document.getElementById("edit-profile-close");
  editProfileClose.addEventListener("click", function () {
    closeEditProfileModal();
    playBeep(440, 0.1);
  });

  
  const editProfileModal = document.getElementById("edit-profile-modal");
  editProfileModal.addEventListener("click", function (e) {
    if (e.target === editProfileModal) {
      closeEditProfileModal();
      playBeep(440, 0.1);
    }
  });

  
  const editAvatarChoices = document.querySelectorAll(".edit-avatar-choice");
  editAvatarChoices.forEach((choice) => {
    choice.addEventListener("click", function () {
      
      editAvatarChoices.forEach((c) => {
        c.style.borderColor = "var(--dark-gray)";
        c.style.background = "var(--light-gray)";
        c.style.transform = "scale(1)";
      });

      
      this.style.borderColor = "var(--yellow)";
      this.style.background = "var(--white)";
      this.style.transform = "scale(1.1)";

      selectedAvatar = this.getAttribute("data-avatar");
      playBeep(660, 0.1);
    });

    
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

  
  const saveProfileBtn = document.getElementById("save-profile-btn");
  saveProfileBtn.addEventListener("click", function () {
    const nickInput = document.getElementById("edit-profile-nick");
    const nick = nickInput.value.trim().toUpperCase();

    if (!nick) {
      showToast("Wpisz nick!");
      playBeep(220, 0.2);
      return;
    }

    
    saveData("profile", {
      nick: nick,
      avatar: selectedAvatar,
    });

    
    updateProfileDisplay(nick, selectedAvatar);

    
    closeEditProfileModal();

    showToast("Profil zaktualizowany!");
    playBeep(880, 0.2);
  });

  
  const editProfileNickInput = document.getElementById("edit-profile-nick");
  editProfileNickInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      saveProfileBtn.click();
    }
  });
});


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

  
  if (userCoinsDisplay) {
    const coins = getCoins();
    userCoinsDisplay.textContent = `🪙 ${coins}`;
  }
}


function openEditProfileModal() {
  const userData = loadData();
  const currentNick = userData.profile?.nick || "";
  const currentAvatar = userData.profile?.avatar || "mario";

  
  const editNickInput = document.getElementById("edit-profile-nick");
  if (editNickInput) {
    editNickInput.value = currentNick;
  }

  
  selectedAvatar = currentAvatar;

  
  const availableAvatars = getAvailableAvatars();

  
  const editAvatarChoices = document.querySelectorAll(".edit-avatar-choice");
  editAvatarChoices.forEach((choice) => {
    const avatarId = choice.getAttribute("data-avatar");

    
    if (!availableAvatars.includes(avatarId)) {
      choice.style.display = "none"; 
      return;
    }

    choice.style.display = "block"; 

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

  
  renderPurchasedBackgrounds();
  renderPurchasedMenuStyles();

  
  const modal = document.getElementById("edit-profile-modal");
  if (modal) {
    modal.style.display = "flex";
  }
}


function renderPurchasedBackgrounds() {
  const container = document.getElementById("background-choices");
  const containerDiv = document.getElementById(
    "background-selection-container"
  );
  if (!container || !containerDiv) return;

  const currentBg = getActiveBackground();

  
  const purchasedBgs = [];
  if (hasPurchased("bg_night"))
    purchasedBgs.push({ id: "bg-night", name: "NOCNE", emoji: "🌙" });
  if (hasPurchased("bg_retro"))
    purchasedBgs.push({ id: "bg-retro", name: "RETRO", emoji: "📺" });
  if (hasPurchased("bg_neon"))
    purchasedBgs.push({ id: "bg-neon", name: "NEON", emoji: "💫" });
  if (hasPurchased("bg_switch"))
    purchasedBgs.push({ id: "bg-switch", name: "SWITCH", emoji: "🎮" });

  
  if (purchasedBgs.length > 0) {
    containerDiv.style.display = "block";

    
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

      
      if (currentBg === bg.id) {
        bgChoice.style.borderColor = "var(--yellow)";
        bgChoice.style.background = "var(--white)";
      }

      bgChoice.addEventListener("click", () => {
        
        document.querySelectorAll(".bg-choice").forEach((c) => {
          c.style.borderColor = "var(--dark-gray)";
          c.style.background =
            c.getAttribute("data-bg") === "default"
              ? "linear-gradient(135deg, var(--red) 0%, var(--yellow) 50%, var(--blue) 100%)"
              : "var(--light-gray)";
        });

        
        bgChoice.style.borderColor = "var(--yellow)";
        bgChoice.style.background = "var(--white)";

        
        applyBackground(bg.id);
        setActiveBackground(bg.id);
        playBeep(660, 0.1);
      });

      container.appendChild(bgChoice);
    });
  }

  
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


function renderPurchasedMenuStyles() {
  const container = document.getElementById("menustyle-choices");
  const containerDiv = document.getElementById("menustyle-selection-container");
  if (!container || !containerDiv) return;

  const currentStyle = getActiveMenuStyle();

  
  const purchasedStyles = [];
  if (hasPurchased("style_nes"))
    purchasedStyles.push({ id: "menu-nes", name: "NES", emoji: "🎮" });
  if (hasPurchased("style_gameboy"))
    purchasedStyles.push({ id: "menu-gameboy", name: "GAME BOY", emoji: "🟢" });
  if (hasPurchased("style_switch"))
    purchasedStyles.push({ id: "menu-switch", name: "SWITCH", emoji: "🔴" });

  
  if (purchasedStyles.length > 0) {
    containerDiv.style.display = "block";

    
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

      
      if (currentStyle === style.id) {
        styleChoice.style.borderColor = "var(--yellow)";
        styleChoice.style.background = "var(--white)";
      }

      styleChoice.addEventListener("click", () => {
        
        document.querySelectorAll(".style-choice").forEach((c) => {
          c.style.borderColor = "var(--dark-gray)";
          c.style.background = "var(--light-gray)";
        });

        
        styleChoice.style.borderColor = "var(--yellow)";
        styleChoice.style.background = "var(--white)";

        
        applyMenuStyle(style.id);
        setActiveMenuStyle(style.id);
        playBeep(660, 0.1);
      });

      container.appendChild(styleChoice);
    });
  }

  
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


function openEditProfileModal() {
  const userData = loadData();
  const currentNick = userData.profile?.nick || "";
  const currentAvatar = userData.profile?.avatar || "mario";

  
  const editNickInput = document.getElementById("edit-profile-nick");
  if (editNickInput) {
    editNickInput.value = currentNick;
  }

  
  selectedAvatar = currentAvatar;

  
  const availableAvatars = getAvailableAvatars();

  
  const editAvatarChoices = document.querySelectorAll(".edit-avatar-choice");
  editAvatarChoices.forEach((choice) => {
    const avatarId = choice.getAttribute("data-avatar");

    
    if (!availableAvatars.includes(avatarId)) {
      choice.style.display = "none"; 
      return;
    }

    choice.style.display = "block"; 

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

  
  const bgContainer = document.getElementById("background-choices");
  const styleContainer = document.getElementById("menustyle-choices");
  if (bgContainer) {
    
    const defaultBg = bgContainer.querySelector('[data-bg="default"]');
    bgContainer.innerHTML = "";
    if (defaultBg) bgContainer.appendChild(defaultBg);
  }
  if (styleContainer) {
    
    const defaultStyle = styleContainer.querySelector('[data-style="default"]');
    styleContainer.innerHTML = "";
    if (defaultStyle) styleContainer.appendChild(defaultStyle);
  }

  
  renderPurchasedBackgrounds();
  renderPurchasedMenuStyles();

  
  const modal = document.getElementById("edit-profile-modal");
  if (modal) {
    modal.style.display = "flex";
  }
}


function closeEditProfileModal() {
  const modal = document.getElementById("edit-profile-modal");
  if (modal) {
    modal.style.display = "none";
  }
}


function showTab(tabName) {
  
  const allTabs = document.querySelectorAll(".tab-content");
  allTabs.forEach((tab) => {
    tab.classList.remove("active");
  });

  
  const allTabButtons = document.querySelectorAll(".tab");
  allTabButtons.forEach((btn) => {
    btn.classList.remove("active");
  });

  
  const selectedTab = document.getElementById(tabName + "-tab");
  if (selectedTab) {
    selectedTab.classList.add("active");
  }

  
  const selectedButton = document.querySelector(`.tab[data-tab="${tabName}"]`);
  if (selectedButton) {
    selectedButton.classList.add("active");
  }
}


function startGame(gameName) {
  
  if (
    (gameName === "pacman" || gameName === "tetris") &&
    !isGameUnlocked(gameName)
  ) {
    showToast("Gra zablokowana! Odblokuj kodem 🔒");
    playBeep(220, 0.3);
    return;
  }

  
  document.getElementById("main-menu").style.display = "none";

  
  document.getElementById("game-container").style.display = "block";

  
  const gameContent = document.getElementById("game-content");
  gameContent.innerHTML = "";

  
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

  
  incrementGamesPlayed();
}


function exitToMenu() {
  
  stopAllGames();

  
  document.getElementById("game-container").style.display = "none";

  
  document.getElementById("main-menu").style.display = "block";
}


function stopAllGames() {
  
  
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
  if (typeof stopAquamentus === "function") stopAquamentus();
}


function handleCodeSubmit() {
  const codeInput = document.getElementById("code-input");
  const code = codeInput.value.trim().toUpperCase();

  if (!code) {
    showToast("Wpisz kod!");
    playBeep(220, 0.2);
    return;
  }

  
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
    
    const allGames = ["pacman", "tetris", "pong", "kong", "invaders"];
    allGames.forEach((game) => {
      if (!isGameUnlocked(game)) {
        unlockGame(game);
      }
    });

    
    const allAchievements = achievementsList.map((a) => a.id);
    allAchievements.forEach((achId) => {
      unlockAchievement(achId);
    });

    
    addCoins(2000);

    showToast("🎮 KOD KONAMI! Wszystko odblokowane + 2000 monet!");
    playAchievementSound();
    codeActivated = true;

    
    if (typeof renderAchievements === "function") {
      renderAchievements();
    }
  } else if (code === "DINO") {
    showToast("🦖 Uruchamianie POLSKI YOSHI RUNNER!");
    playBeep(880, 0.3);
    codeActivated = true;

    
    setTimeout(() => {
      if (typeof startDino === "function") {
        startDino();
      }
    }, 500);
  } else if (code === "ZELDA") {
    showToast("🐉 Uruchamianie ZELDA BOSS FIGHT!");
    playBeep(880, 0.3);
    codeActivated = true;

    
    setTimeout(() => {
      if (typeof startAquamentus === "function") {
        startAquamentus();
      }
    }, 500);
  } else {
    showToast("❌ Nieprawidłowy kod!");
    playBeep(220, 0.2);
  }

  codeInput.value = "";

  
  if (codeActivated) {
    updateUnlockedGames();
  }
}


function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxVideo = document.getElementById("lightbox-video");
  const consoleDetails = document.getElementById("console-details");

  
  if (lightboxVideo && lightboxVideo.style.display !== "none") {
    lightboxVideo.pause();
    lightboxVideo.currentTime = 0;
  }

  
  if (consoleDetails) {
    consoleDetails.style.display = "none";
  }

  lightbox.style.display = "none";
}


function openLightbox(src, type = "image") {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxVideo = document.getElementById("lightbox-video");

  if (type === "video") {
    lightboxImg.style.display = "none";
    lightboxVideo.style.display = "block";
    lightboxVideo.querySelector("source").src = src;
    lightboxVideo.load();
    
    lightboxVideo
      .play()
      .catch((err) => console.log("Autoplay prevented:", err));
  } else {
    lightboxVideo.style.display = "none";
    lightboxImg.style.display = "block";
    lightboxImg.src = src;
  }

  lightbox.style.display = "flex";
  playBeep(660, 0.1);
}


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


function isGameUnlocked(gameName) {
  const data = loadData();
  return data.unlockedGames && data.unlockedGames.includes(gameName);
}


function updateUnlockedGames() {
  const gameCards = document.querySelectorAll(".game-card[data-locked]");

  gameCards.forEach((card) => {
    const gameName = card.getAttribute("data-game");

    if (isGameUnlocked(gameName)) {
      
      card.classList.remove("locked");
      card.removeAttribute("data-locked");

      
      const lockedInfo = card.querySelector(".locked-info");
      if (lockedInfo) {
        lockedInfo.style.display = "none";
      }

      
      const button = card.querySelector(".btn-play");
      if (button) {
        button.textContent = "ZAGRAJ";
        button.removeAttribute("disabled");
      }
    }
  });
}


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

  
  if (data.stats.totalGamesPlayed === 1) {
    unlockAchievement("pierwszy_krok");
  }
}


function showWelcomeModal() {
  const modal = document.getElementById("welcome-modal");
  const closeBtn = document.getElementById("close-welcome-btn");

  if (modal && closeBtn) {
    modal.style.display = "flex";
    playBeep(660, 0.3);

    
    const handleClose = function () {
      modal.style.display = "none";
      playBeep(880, 0.2);

      const userData = loadData();
      showToast("Witaj, " + userData.profile.nick + "!");

      
      closeBtn.removeEventListener("click", handleClose);
    };

    closeBtn.addEventListener("click", handleClose);
  }
}


function checkInvadersUnlock() {
  const data = loadData();
  const completedGames = data.gamesCompleted || [];

  if (completedGames.length >= 5) {
    unlockInvadersGame();
  }
}


function unlockInvadersGame() {
  const invadersCard = document.getElementById("invaders-card");
  const invadersTitle = document.getElementById("invaders-title");
  const invadersDesc = document.getElementById("invaders-desc");

  if (!invadersCard || !invadersTitle || !invadersDesc) return;

  
  if (invadersTitle.textContent !== "??????") return;

  
  unlockGame("invaders");

  
  invadersTitle.textContent = "PISARIO INVADERS";
  invadersDesc.textContent = "Space Invaders z bossem";

  
  invadersCard.classList.remove("locked");
  invadersCard.removeAttribute("data-locked");

  
  const lockedInfo = invadersCard.querySelector(".locked-info");
  if (lockedInfo) {
    lockedInfo.style.display = "none";
  }

  
  const button = invadersCard.querySelector(".btn-play");
  if (button) {
    button.textContent = "ZAGRAJ";
    button.removeAttribute("disabled");
  }

  
  showToast("🚀 Odblokowano PISARIO INVADERS!");
  playAchievementSound();
}


function updateCompletedGamesUI() {
  const userData = loadData();
  const completedGames = userData.gamesCompleted || [];

  completedGames.forEach(function (gameName) {
    const gameCard = document.querySelector(
      '.game-card[data-game="' + gameName + '"]'
    );

    if (gameCard && !gameCard.querySelector(".trophy-badge")) {
      
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

      
      gameCard.style.position = "relative";
      gameCard.appendChild(trophy);
    }
  });
}
