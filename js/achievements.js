


const achievementsList = [
  {
    id: "mistrz_wiedzy",
    name: "MISTRZ WIEDZY",
    description: "Ukończ Quiz 10/10",
    icon: "🎓",
    console: "console1",
  },
  {
    id: "mistrz_ukladania",
    name: "MISTRZ UKŁADANIA",
    description: "Ukończ Puzzle w mniej niż 60 ruchów",
    icon: "⚡",
    console: "console2",
  },
  {
    id: "mistrz_pamieci",
    name: "MISTRZ PAMIĘCI",
    description: "Ukończ Memory w maks 20 ruchów",
    icon: "🧠",
    console: "console3",
  },
  {
    id: "perfekcjonista",
    name: "PERFEKCJONISTA",
    description: "Ukończ Pacman bez śmierci",
    icon: "👻",
    console: "console4",
  },
  {
    id: "pong_perfekcja",
    name: "PONG PERFEKCJA",
    description: "Wygraj Pong 5-0",
    icon: "⚡",
    console: "console5",
  },
  {
    id: "kolekcjoner",
    name: "KOLEKCJONER",
    description: "Odblokuj 5 konsol",
    icon: "🖼️",
    console: "console6",
  },
  {
    id: "kong_perfection",
    name: "KONG PERFEKCJA",
    description: "Ukończ Kong bez śmierci",
    icon: "👑",
    console: "console7",
  },
  {
    id: "coin_collector",
    name: "KOLEKCJONER MONET",
    description: "Zbierz 20+ monet w Mario",
    icon: "🪙",
    console: "console8",
  },
  {
    id: "invaders_master",
    name: "INVADERS MASTER",
    description: "Pokonaj wszystkie fale najeźdźców",
    icon: "🚀",
    console: "console9",
  },
  {
    id: "pierwszy_krok",
    name: "PIERWSZY KROK",
    description: "Zagraj w dowolną grę",
    icon: "🎮",
    console: "console10",
  },
  {
    id: "weteran_arcade",
    name: "WETERAN ARCADE",
    description: "Zagraj we wszystkie 9 gier",
    icon: "🏆",
    console: "console11",
  },
];


const achievementConsoleMap = {
  mistrz_wiedzy: "console1",
  mistrz_ukladania: "console2",
  mistrz_pamieci: "console3",
  perfekcjonista: "console4",
  pong_perfekcja: "console5",
  kolekcjoner: "console6",
  kong_perfection: "console7",
  coin_collector: "console8",
  invaders_master: "console9",
  pierwszy_krok: "console10",
  weteran_arcade: "console11",
};


const consolesList = [
  {
    id: "console1",
    path: "./assets/img/switch.png",
    alt: "Nintendo Switch - Mistrz Wiedzy",
    name: "Nintendo Switch",
    releaseDate: "3 marca 2017",
    soldUnits: "154 mln",
    popularGame: "Mario Kart 8 Deluxe (64 mln)",
  },
  {
    id: "console2",
    path: "./assets/img/psx.png",
    alt: "PlayStation - Mistrz Układania",
    name: "PlayStation",
    releaseDate: "15 września 1995",
    soldUnits: "102 mln",
    popularGame: "Gran Turismo (10.85 mln)",
  },
  {
    id: "console3",
    path: "./assets/img/sega.png",
    alt: "SEGA - Mistrz Pamięci",
    name: "SEGA Mega Drive",
    releaseDate: "1990",
    soldUnits: "30.75 mln",
    popularGame: "Sonic the Hedgehog (15 mln)",
  },
  {
    id: "console4",
    path: "./assets/img/gb.png",
    alt: "Game Boy - Perfekcjonista",
    name: "Game Boy",
    releaseDate: "1990",
    soldUnits: "118 mln",
    popularGame: "Pokémon Generation I (łącznie) - 45,9 mln , Tetris (35 mln)",
  },
  {
    id: "console5",
    path: "./assets/img/ps2.png",
    alt: "PlayStation 2 - Pong Perfekcja",
    name: "PlayStation 2",
    releaseDate: "24 listopada 2000",
    soldUnits: "160 mln",
    popularGame: "Grand Theft Auto: San Andreas (17.33 mln)",
  },
  {
    id: "console6",
    path: "./assets/img/wii.png",
    alt: "Wii - Kolekcjoner",
    name: "Nintendo Wii",
    releaseDate: "8 grudnia 2006",
    soldUnits: "101.63 mln",
    popularGame: "Wii Sports (82.9 mln)",
  },
  {
    id: "console7",
    path: "./assets/img/x360.png",
    alt: "Xbox 360 - Kong Perfekcja",
    name: "Xbox 360",
    releaseDate: "2 grudnia 2005",
    soldUnits: "84 mln",
    popularGame: "Kinect Adventures! (24 mln)",
  },
  {
    id: "console8",
    path: "./assets/img/ps5.png",
    alt: "PlayStation 5 - Kolekcjoner Monet",
    name: "PlayStation 5",
    releaseDate: "19 listopada 2020",
    soldUnits: "84 mln",
    popularGame: "Marvel’s Spider Man 2 (16 mln)",
  },
  {
    id: "console9",
    path: "./assets/img/ds.png",
    alt: "Nintendo DS - Invaders Master",
    name: "Nintendo DS",
    releaseDate: "11 marca 2005",
    soldUnits: "154 mln",
    popularGame: "New Super Mario Bros. (30.8 mln)",
  },
  {
    id: "console10",
    path: "./assets/img/gba.png",
    alt: "Game Boy Advance - Pierwszy Krok",
    name: "Game Boy Advance",
    releaseDate: "22 czerwca 2001",
    soldUnits: "81.5 mln",
    popularGame: "Pokémon Ruby/Sapphire (16.22 mln)",
  },
  {
    id: "console11",
    path: "./assets/img/ps4.png",
    alt: "PlayStation 4 - Weteran Arcade",
    name: "PlayStation 4",
    releaseDate: "29 listopada 2013",
    soldUnits: "117 mln",
    popularGame: "Grand Theft Auto V (20 mln)",
  },
];


function unlockAchievement(achievementId) {
  const data = loadData();

  
  if (data.achievements[achievementId]) {
    return; 
  }

  
  saveAchievement(achievementId, true);

  
  const consoleId = achievementConsoleMap[achievementId];
  if (consoleId) {
    saveConsole(consoleId, true);
  }

  
  const achievement = achievementsList.find((a) => a.id === achievementId);
  const achievementName = achievement ? achievement.name : achievementId;

  
  addCoins(5);

  
  showToast("🏆 ODBLOKOWANO: " + achievementName + " (+5 🪙)");

  
  playAchievementSound();

  
  renderAchievements();
  renderConsoles();

  
  checkMetaAchievements();
}


function checkMetaAchievements() {
  const data = loadData();

  
  let unlockedCount = 0;
  for (const key in data.consoles) {
    if (data.consoles[key]) {
      unlockedCount++;
    }
  }

  
  if (unlockedCount >= 5 && !data.achievements.kolekcjoner) {
    unlockAchievement("kolekcjoner");
  }

  
  if (unlockedCount >= 12 && !data.achievements.kompletny_zbior) {
    unlockAchievement("kompletny_zbior");
  }
}


function renderAchievements() {
  const data = loadData();
  const container = document.getElementById("achievements-list");
  container.innerHTML = "";

  achievementsList.forEach((achievement) => {
    const unlocked = data.achievements[achievement.id];

    const item = document.createElement("div");
    item.className = "achievement-item " + (unlocked ? "unlocked" : "locked");

    item.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.description}</div>
            </div>
            <div class="achievement-status ${unlocked ? "unlocked" : "locked"}">
                ${unlocked ? "ODBLOKOWANE" : "ZABLOKOWANE"}
            </div>
        `;

    container.appendChild(item);
  });
}


function renderConsoles() {
  const data = loadData();
  const container = document.getElementById("consoles-gallery");
  container.innerHTML = "";

  consolesList.forEach((console) => {
    const unlocked = data.consoles[console.id];

    const item = document.createElement("div");
    item.className = "console-item " + (unlocked ? "unlocked" : "locked");

    if (unlocked) {
      const img = document.createElement("img");
      img.src = console.path;
      img.alt = console.alt;
      item.appendChild(img);

      
      item.addEventListener("click", function () {
        showConsoleDetails(console);
      });
    } else {
      item.textContent = "???";
    }

    container.appendChild(item);
  });
}


function showConsoleDetails(console) {
  const lightbox = document.getElementById("lightbox");
  const lightboxContent = lightbox.querySelector(".lightbox-content");

  
  document.getElementById("lightbox-img").style.display = "none";
  document.getElementById("lightbox-video").style.display = "none";

  
  let detailsContainer = document.getElementById("console-details");
  if (!detailsContainer) {
    detailsContainer = document.createElement("div");
    detailsContainer.id = "console-details";
    lightboxContent.appendChild(detailsContainer);
  }

  
  detailsContainer.style.display = "block";

  
  detailsContainer.innerHTML = `
    <div style="
      max-width: 700px;
      background: var(--dark-gray);
      border-radius: 15px;
      overflow: hidden;
      border: 4px solid var(--yellow);
    ">
      <div style="
        width: 100%;
        height: 300px;
        background: rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 4px solid var(--yellow);
      ">
        <img src="${console.path}" alt="${console.alt}" style="
          max-width: 95%;
          max-height: 95%;
          object-fit: contain;
        ">
      </div>
      <div style="padding: 30px;">
        <h2 style="
          font-family: 'Press Start 2P', cursive;
          font-size: 18px;
          color: var(--yellow);
          margin-bottom: 25px;
          text-align: center;
        ">${console.name}</h2>
        
        <div style="
          display: grid;
          gap: 15px;
          font-size: 10px;
          color: var(--white);
        ">
          <div style="
            background: rgba(0,0,0,0.3);
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid var(--yellow);
          ">
            <strong style="color: var(--yellow);">📅 Data wydania w Polsce:</strong><br>
            <span style="margin-left: 20px;">${console.releaseDate}</span>
          </div>
          
          <div style="
            background: rgba(0,0,0,0.3);
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid var(--yellow);
          ">
            <strong style="color: var(--yellow);">📦 Liczba sprzedanych konsoli:</strong><br>
            <span style="margin-left: 20px;">${console.soldUnits}</span>
          </div>
          
          <div style="
            background: rgba(0,0,0,0.3);
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid var(--yellow);
          ">
            <strong style="color: var(--yellow);">🎮 Najpopularniejsza gra:</strong><br>
            <span style="margin-left: 20px;">${console.popularGame}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  lightbox.style.display = "flex";
  playBeep(660, 0.1);
}
