// achievements.js - System osiągnięć i fanartów

// Lista wszystkich osiągnięć
const achievementsList = [
  {
    id: "mistrz_wiedzy",
    name: "MISTRZ WIEDZY",
    description: "Ukończ Quiz 10/10",
    icon: "🎓",
    fanart: "fanart1",
  },
  {
    id: "mistrz_ukladania",
    name: "MISTRZ UKŁADANIA",
    description: "Ukończ Puzzle w mniej niż 60 ruchów",
    icon: "⚡",
    fanart: "fanart2",
  },
  {
    id: "mistrz_pamieci",
    name: "MISTRZ PAMIĘCI",
    description: "Ukończ Memory w maks 20 ruchów",
    icon: "🧠",
    fanart: "fanart3",
  },
  {
    id: "perfekcjonista",
    name: "PERFEKCJONISTA",
    description: "Ukończ Pacman bez śmierci",
    icon: "👻",
    fanart: "fanart4",
  },
  {
    id: "pong_perfekcja",
    name: "PONG PERFEKCJA",
    description: "Wygraj Pong 5-0",
    icon: "⚡",
    fanart: "fanart5",
  },
  {
    id: "kolekcjoner",
    name: "KOLEKCJONER",
    description: "Odblokuj 5 fanartów",
    icon: "🖼️",
    fanart: "fanart6",
  },
  {
    id: "kong_perfection",
    name: "KONG PERFEKCJA",
    description: "Ukończ Kong bez śmierci",
    icon: "👑",
    fanart: "fanart7",
  },
  {
    id: "coin_collector",
    name: "KOLEKCJONER MONET",
    description: "Zbierz 20+ monet w Mario",
    icon: "🪙",
    fanart: "fanart8",
  },
  {
    id: "invaders_master",
    name: "INVADERS MASTER",
    description: "Pokonaj wszystkie fale najeźdźców",
    icon: "🚀",
    fanart: "fanart9",
  },
  {
    id: "pierwszy_krok",
    name: "PIERWSZY KROK",
    description: "Zagraj w dowolną grę",
    icon: "🎮",
    fanart: "fanart10",
  },
  {
    id: "weteran_arcade",
    name: "WETERAN ARCADE",
    description: "Zagraj we wszystkie 9 gier",
    icon: "🏆",
    fanart: "fanart11",
  },
];

// Mapowanie osiągnięć do fanartów
const achievementFanartMap = {
  mistrz_wiedzy: "fanart1",
  mistrz_ukladania: "fanart2",
  mistrz_pamieci: "fanart3",
  perfekcjonista: "fanart4",
  pong_perfekcja: "fanart5",
  kolekcjoner: "fanart6",
  kong_perfection: "fanart7",
  coin_collector: "fanart8",
  invaders_master: "fanart9",
  pierwszy_krok: "fanart10",
  weteran_arcade: "fanart11",
};

// Lista fanartów
const fanartsList = [
  {
    id: "fanart1",
    path: "./assets/fanart/fanart1.png",
    alt: "Fanart #1 - Mistrz Wiedzy",
  },
  {
    id: "fanart2",
    path: "./assets/fanart/fanart2.png",
    alt: "Fanart #2 - Mistrz Układania",
  },
  {
    id: "fanart3",
    path: "./assets/fanart/fanart3.png",
    alt: "Fanart #3 - Mistrz Pamięci",
  },
  {
    id: "fanart4",
    path: "./assets/fanart/fanart4.png",
    alt: "Fanart #4 - Perfekcjonista",
  },
  {
    id: "fanart5",
    path: "./assets/fanart/fanart5.png",
    alt: "Fanart #5 - Pong Perfekcja",
  },
  {
    id: "fanart6",
    path: "./assets/fanart/fanart6.png",
    alt: "Fanart #6 - Kolekcjoner",
  },
  {
    id: "fanart7",
    path: "./assets/fanart/fanart7.png",
    alt: "Fanart #7 - Kong Perfekcja",
  },
  {
    id: "fanart8",
    path: "./assets/fanart/fanart8.png",
    alt: "Fanart #8 - Pierwszy Krok",
  },
  {
    id: "fanart9",
    path: "./assets/fanart/fanart9.png",
    alt: "Fanart #9 - Weteran Arcade",
  },
  {
    id: "fanart10",
    path: "./assets/fanart/fanart10.png",
    alt: "Fanart #10 - Kolekcjoner Monet",
  },
  {
    id: "fanart11",
    path: "./assets/fanart/fanart11.png",
    alt: "Fanart #11 - Invaders Master",
  },
];

// Funkcja odblokowania osiągnięcia
function unlockAchievement(achievementId) {
  const data = loadData();

  // Sprawdź czy już odblokowane
  if (data.achievements[achievementId]) {
    return; // Już odblokowane
  }

  // Odblokuj osiągnięcie
  saveAchievement(achievementId, true);

  // Odblokuj powiązany fanart
  const fanartId = achievementFanartMap[achievementId];
  if (fanartId) {
    saveFanart(fanartId, true);
  }

  // Znajdź nazwę osiągnięcia
  const achievement = achievementsList.find((a) => a.id === achievementId);
  const achievementName = achievement ? achievement.name : achievementId;

  // Nagroda +5 monet za każde osiągnięcie
  addCoins(5);

  // Pokaż powiadomienie
  showToast("🏆 ODBLOKOWANO: " + achievementName + " (+5 🪙)");

  // Odtwórz dźwięk
  playAchievementSound();

  // Odśwież renderowanie
  renderAchievements();
  renderFanarts();

  // Sprawdź osiągnięcia meta
  checkMetaAchievements();
}

// Funkcja sprawdzania osiągnięć meta (kolekcjoner, kompletny zbiór)
function checkMetaAchievements() {
  const data = loadData();

  // Policz odblokowane fanarty
  let unlockedCount = 0;
  for (const key in data.fanarts) {
    if (data.fanarts[key]) {
      unlockedCount++;
    }
  }

  // Kolekcjoner (5 fanartów)
  if (unlockedCount >= 5 && !data.achievements.kolekcjoner) {
    unlockAchievement("kolekcjoner");
  }

  // Kompletny zbiór (12 fanartów)
  if (unlockedCount >= 12 && !data.achievements.kompletny_zbior) {
    unlockAchievement("kompletny_zbior");
  }
}

// Funkcja renderowania listy osiągnięć
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

// Funkcja renderowania galerii fanartów
function renderFanarts() {
  const data = loadData();
  const container = document.getElementById("fanarts-gallery");
  container.innerHTML = "";

  fanartsList.forEach((fanart) => {
    const unlocked = data.fanarts[fanart.id];

    const item = document.createElement("div");
    item.className = "fanart-item " + (unlocked ? "unlocked" : "locked");

    if (unlocked) {
      const img = document.createElement("img");
      img.src = fanart.path;
      img.alt = fanart.alt;
      item.appendChild(img);

      // Kliknięcie otwiera lightbox
      item.addEventListener("click", function () {
        openLightbox(fanart.path);
      });
    } else {
      item.textContent = "???";
    }

    container.appendChild(item);
  });
}
