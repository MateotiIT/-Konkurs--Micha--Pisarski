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
    id: "ukladacz",
    name: "UKŁADACZ",
    description: "Ukończ Sliding Puzzle",
    icon: "🧩",
    fanart: "fanart2",
  },
  {
    id: "mistrz_ukladania",
    name: "MISTRZ UKŁADANIA",
    description: "Ukończ Puzzle w mniej niż 30 ruchów",
    icon: "⚡",
    fanart: "fanart3",
  },
  {
    id: "mistrz_pamieci",
    name: "MISTRZ PAMIĘCI",
    description: "Ukończ Memory w maks 20 ruchów",
    icon: "🧠",
    fanart: "fanart4",
  },
  {
    id: "pisacman_master",
    name: "PISACMAN MASTER",
    description: "Ukończ Pacman (zbierz wszystkie kropki)",
    icon: "🟡",
    fanart: "fanart5",
  },
  {
    id: "perfekcjonista",
    name: "PERFEKCJONISTA",
    description: "Ukończ Pacman bez śmierci",
    icon: "👻",
    fanart: "fanart6",
  },
  {
    id: "pisaris_master",
    name: "PISARIS MASTER",
    description: "Zestrzel 10 linii w Tetris",
    icon: "🟦",
    fanart: "fanart7",
  },
  {
    id: "legenda_pisaris",
    name: "LEGENDA PISARIS",
    description: "Zestrzel 50 linii w Tetris",
    icon: "👑",
    fanart: "fanart8",
  },
  {
    id: "pong_master",
    name: "PONG MASTER",
    description: "Wygraj grę Pong",
    icon: "🏓",
    fanart: "fanart9",
  },
  {
    id: "pong_perfekcja",
    name: "PONG PERFEKCJA",
    description: "Wygraj Pong 5-0",
    icon: "⚡",
    fanart: "fanart10",
  },
  {
    id: "kolekcjoner",
    name: "KOLEKCJONER",
    description: "Odblokuj 5 fanartów",
    icon: "🖼️",
    fanart: "fanart11",
  },
  {
    id: "kompletny_zbior",
    name: "KOMPLETNY ZBIÓR",
    description: "Odblokuj wszystkie 16 fanartów",
    icon: "💎",
    fanart: "fanart12",
  },
  {
    id: "kong_master",
    name: "KONG MASTER",
    description: "Zdobądź Nintendo Switch 2",
    icon: "🦍",
    fanart: "fanart13",
  },
  {
    id: "kong_perfection",
    name: "KONG PERFEKCJA",
    description: "Ukończ Kong bez śmierci",
    icon: "👑",
    fanart: "fanart14",
  },
  {
    id: "pierwszy_krok",
    name: "PIERWSZY KROK",
    description: "Zagraj w dowolną grę",
    icon: "🎮",
    fanart: "fanart15",
  },
  {
    id: "weteran_arcade",
    name: "WETERAN ARCADE",
    description: "Ukończ wszystkie 7 gier",
    icon: "🏆",
    fanart: "fanart16",
  },
];

// Mapowanie osiągnięć do fanartów
const achievementFanartMap = {
  mistrz_wiedzy: "fanart1",
  ukladacz: "fanart2",
  mistrz_ukladania: "fanart3",
  mistrz_pamieci: "fanart4",
  pisacman_master: "fanart5",
  perfekcjonista: "fanart6",
  pisaris_master: "fanart7",
  legenda_pisaris: "fanart8",
  pong_master: "fanart9",
  pong_perfekcja: "fanart10",
  kolekcjoner: "fanart11",
  kompletny_zbior: "fanart12",
  kong_master: "fanart13",
  kong_perfection: "fanart14",
  pierwszy_krok: "fanart15",
  weteran_arcade: "fanart16",
};

// Lista fanartów
const fanartsList = [
  {
    id: "fanart1",
    path: "./assets/fanart/placeholder1.jpg",
    alt: "Fanart #1 - Mistrz Wiedzy",
  },
  {
    id: "fanart2",
    path: "./assets/fanart/placeholder2.jpg",
    alt: "Fanart #2 - Układacz",
  },
  {
    id: "fanart3",
    path: "./assets/fanart/placeholder3.jpg",
    alt: "Fanart #3 - Mistrz Układania",
  },
  {
    id: "fanart4",
    path: "./assets/fanart/placeholder4.jpg",
    alt: "Fanart #4 - Mistrz Pamięci",
  },
  {
    id: "fanart5",
    path: "./assets/fanart/placeholder5.jpg",
    alt: "Fanart #5 - Pisacman Master",
  },
  {
    id: "fanart6",
    path: "./assets/fanart/placeholder6.jpg",
    alt: "Fanart #6 - Perfekcjonista",
  },
  {
    id: "fanart7",
    path: "./assets/fanart/placeholder7.jpg",
    alt: "Fanart #7 - Pisaris Master",
  },
  {
    id: "fanart8",
    path: "./assets/fanart/placeholder8.jpg",
    alt: "Fanart #8 - Legenda Pisaris",
  },
  {
    id: "fanart9",
    path: "./assets/fanart/placeholder9.jpg",
    alt: "Fanart #9 - Pong Master",
  },
  {
    id: "fanart10",
    path: "./assets/fanart/placeholder10.jpg",
    alt: "Fanart #10 - Pong Perfekcja",
  },
  {
    id: "fanart11",
    path: "./assets/fanart/placeholder11.jpg",
    alt: "Fanart #11 - Kolekcjoner",
  },
  {
    id: "fanart12",
    path: "./assets/fanart/placeholder12.jpg",
    alt: "Fanart #12 - Kompletny Zbiór",
  },
  {
    id: "fanart13",
    path: "./assets/fanart/placeholder13.jpg",
    alt: "Fanart #13 - Kong Master",
  },
  {
    id: "fanart14",
    path: "./assets/fanart/placeholder14.jpg",
    alt: "Fanart #14 - Kong Perfekcja",
  },
  {
    id: "fanart15",
    path: "./assets/fanart/placeholder15.jpg",
    alt: "Fanart #15 - Pierwszy Krok",
  },
  {
    id: "fanart16",
    path: "./assets/fanart/placeholder16.jpg",
    alt: "Fanart #16 - Weteran Arcade",
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

  // Pokaż powiadomienie
  showToast("🏆 ODBLOKOWANO: " + achievementName);

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
