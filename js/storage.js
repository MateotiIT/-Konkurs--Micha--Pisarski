function initStorage() {
  const existing = localStorage.getItem("pisarskiArcade");

  if (!existing) {
    const defaultData = {
      achievements: {
        mistrz_wiedzy: false,
        ukladacz: false,
        mistrz_ukladania: false,
        mistrz_pamieci: false,
        pisacman_master: false,
        perfekcjonista: false,
        pisaris_master: false,
        legenda_pisaris: false,
        pong_master: false,
        pong_perfekcja: false,
        kolekcjoner: false,
        kompletny_zbior: false,
        kong_master: false,
        kong_perfection: false,
        mario_master: false,
        coin_collector: false,
        invaders_master: false,
        pierwszy_krok: false,
        weteran_arcade: false,
      },
      consoles: {
        console1: false,
        console2: false,
        console3: false,
        console4: false,
        console5: false,
        console6: false,
        console7: false,
        console8: false,
        console9: false,
        console10: false,
        console11: false,
      },
      scores: {
        quiz_highscore: 0,
        tetris_lines: 0,
        pacman_best: 0,
        pong_score: 0,
        kong_score: 0,
        invaders_score: 0,
        mario_score: 0,
        memory_moves: 999,
        puzzle_moves: 999,
        dino_score: 0,
      },
      gamesCompleted: [],
      stats: {
        totalGamesPlayed: 0,
        totalPlaytime: 0,
        gamesWon: 0,
        gamesLost: 0,
        totalCoinsEarned: 0,
        sessionStart: Date.now(),
        gamePlayCounts: {},
      },
      easterEggs: [],
      coins: 20,
      shop: {
        purchased: [],
      },
      activeBackground: "default",
      activeMenuStyle: "default",
    };

    localStorage.setItem("pisarskiArcade", JSON.stringify(defaultData));
  } else {
    const data = JSON.parse(existing);
    if (data.fanarts && !data.consoles) {
      data.consoles = {
        console1: data.fanarts.fanart1 || false,
        console2: data.fanarts.fanart2 || false,
        console3: data.fanarts.fanart3 || false,
        console4: data.fanarts.fanart4 || false,
        console5: data.fanarts.fanart5 || false,
        console6: data.fanarts.fanart6 || false,
        console7: data.fanarts.fanart7 || false,
        console8: data.fanarts.fanart8 || false,
        console9: data.fanarts.fanart9 || false,
        console10: data.fanarts.fanart10 || false,
        console11: data.fanarts.fanart11 || false,
      };
      delete data.fanarts;
      localStorage.setItem("pisarskiArcade", JSON.stringify(data));
    }
  }
}

function saveData(key, value) {
  const data = loadData();
  data[key] = value;
  localStorage.setItem("pisarskiArcade", JSON.stringify(data));
}

function loadData() {
  const data = localStorage.getItem("pisarskiArcade");
  return data ? JSON.parse(data) : null;
}

function loadDataKey(key) {
  const data = loadData();
  return data ? data[key] : null;
}

function resetData() {
  localStorage.removeItem("pisarskiArcade");
  initStorage();
}

function saveAchievement(achievementId, unlocked) {
  const data = loadData();
  data.achievements[achievementId] = unlocked;
  localStorage.setItem("pisarskiArcade", JSON.stringify(data));
}

function saveConsole(consoleId, unlocked) {
  const data = loadData();
  data.consoles[consoleId] = unlocked;
  localStorage.setItem("pisarskiArcade", JSON.stringify(data));
}

function addCompletedGame(gameName) {
  const data = loadData();

  if (!data.gamesCompleted.includes(gameName)) {
    data.gamesCompleted.push(gameName);
    saveData("gamesCompleted", data.gamesCompleted);

    if (data.gamesCompleted.length === 5) {
      unlockAchievement("weteran_arcade");
    }

    if (data.gamesCompleted.length >= 5) {
      unlockInvadersGame();
    }

    if (typeof updateCompletedGamesUI === "function") {
      updateCompletedGamesUI();
    }
  }
}

function saveScore(scoreKey, value) {
  const data = loadData();

  if (value > (data.scores[scoreKey] || 0)) {
    data.scores[scoreKey] = value;
    saveData("scores", data.scores);
  }
}

function saveBestScore(scoreKey, value, lowerIsBetter) {
  const data = loadData();

  if (lowerIsBetter) {
    if (!data.scores[scoreKey] || value < data.scores[scoreKey]) {
      data.scores[scoreKey] = value;
      saveData("scores", data.scores);
    }
  } else {
    if (value > (data.scores[scoreKey] || 0)) {
      data.scores[scoreKey] = value;
      saveData("scores", data.scores);
    }
  }
}

function addEasterEgg(eggName, description) {
  const data = loadData();

  const exists = data.easterEggs.find((egg) => egg.name === eggName);

  if (!exists) {
    data.easterEggs.push({
      name: eggName,
      description: description,
      date: new Date().toLocaleDateString("pl-PL"),
    });

    saveData("easterEggs", data.easterEggs);

    showToast("🥚 Easter Egg znaleziony: " + eggName);
  }
}

function addCoins(amount) {
  const data = loadData();
  if (!data.coins) data.coins = 0;
  data.coins += amount;
  saveData("coins", data.coins);

  if (amount > 0) {
    addCoinsEarned(amount);
  }

  if (typeof updateProfileDisplay === "function") {
    const nick = data.profile?.nick || "GRACZ";
    const avatar = data.profile?.avatar || "mario";
    updateProfileDisplay(nick, avatar);
  }

  return data.coins;
}

function spendCoins(amount) {
  const data = loadData();
  if (!data.coins) data.coins = 0;

  if (data.coins >= amount) {
    data.coins -= amount;
    saveData("coins", data.coins);

    if (typeof updateProfileDisplay === "function") {
      const nick = data.profile?.nick || "GRACZ";
      const avatar = data.profile?.avatar || "mario";
      updateProfileDisplay(nick, avatar);
    }

    return true;
  }
  return false;
}

function getCoins() {
  const data = loadData();
  return data.coins || 0;
}

function hasPurchased(itemId) {
  const data = loadData();
  if (!data.shop) data.shop = { purchased: [] };
  return data.shop.purchased.includes(itemId);
}

function addPurchase(itemId) {
  const data = loadData();
  if (!data.shop) data.shop = { purchased: [] };

  if (!data.shop.purchased.includes(itemId)) {
    data.shop.purchased.push(itemId);
    saveData("shop", data.shop);
  }
}

function setActiveBackground(bgId) {
  saveData("activeBackground", bgId);
}

function getActiveBackground() {
  const data = loadData();
  return data.activeBackground || "default";
}

function setActiveMenuStyle(styleId) {
  saveData("activeMenuStyle", styleId);
}

function updatePlaytime() {
  var data = loadData();
  if (!data.stats) data.stats = {};
  if (!data.stats.sessionStart) data.stats.sessionStart = Date.now();

  var currentTime = Date.now();
  var sessionTime = Math.floor((currentTime - data.stats.sessionStart) / 1000);

  if (!data.stats.totalPlaytime) data.stats.totalPlaytime = 0;
  data.stats.totalPlaytime += sessionTime;
  data.stats.sessionStart = currentTime;

  localStorage.setItem("pisarskiArcade", JSON.stringify(data));
}

function incrementGamePlayed(gameName) {
  var data = loadData();
  if (!data.stats) data.stats = {};
  if (!data.stats.totalGamesPlayed) data.stats.totalGamesPlayed = 0;
  if (!data.stats.gamePlayCounts) data.stats.gamePlayCounts = {};

  data.stats.totalGamesPlayed++;
  if (!data.stats.gamePlayCounts[gameName]) {
    data.stats.gamePlayCounts[gameName] = 0;
  }
  data.stats.gamePlayCounts[gameName]++;

  localStorage.setItem("pisarskiArcade", JSON.stringify(data));
}

function incrementGameWon() {
  var data = loadData();
  if (!data.stats) data.stats = {};
  if (!data.stats.gamesWon) data.stats.gamesWon = 0;
  data.stats.gamesWon++;
  localStorage.setItem("pisarskiArcade", JSON.stringify(data));
}

function incrementGameLost() {
  var data = loadData();
  if (!data.stats) data.stats = {};
  if (!data.stats.gamesLost) data.stats.gamesLost = 0;
  data.stats.gamesLost++;
  localStorage.setItem("pisarskiArcade", JSON.stringify(data));
}

function addCoinsEarned(amount) {
  var data = loadData();
  if (!data.stats) data.stats = {};
  if (!data.stats.totalCoinsEarned) data.stats.totalCoinsEarned = 0;
  data.stats.totalCoinsEarned += amount;
  localStorage.setItem("pisarskiArcade", JSON.stringify(data));
}

function getStats() {
  var data = loadData();
  return (
    data.stats || {
      totalGamesPlayed: 0,
      totalPlaytime: 0,
      gamesWon: 0,
      gamesLost: 0,
      totalCoinsEarned: 0,
      gamePlayCounts: {},
    }
  );
}

function getFavoriteGame() {
  var stats = getStats();
  var counts = stats.gamePlayCounts || {};
  var maxCount = 0;
  var favGame = "Brak";

  for (var game in counts) {
    if (counts[game] > maxCount) {
      maxCount = counts[game];
      favGame = game;
    }
  }

  // Mapowanie nazw gier na pełne nazwy
  var gameNames = {
    "Quiz": "PISARIO QUIZ",
    "Mario": "SUPER PISARIO BROS",
    "Pacman": "PISACMAN",
    "Tetris": "PISARIS",
    "Pong": "PISARIO PONG",
    "Kong": "PISARIO KONG",
    "Invaders": "SPACE INVADERS",
    "Memory": "PISARIO MEMORY",
    "Puzzle": "PISARIO PUZZLE",
    "Dino": "YOSHI RUNNER"
  };

  return gameNames[favGame] || favGame;
}

function formatPlaytime(seconds) {
  if (!seconds || seconds < 0) return "0 min";

  var hours = Math.floor(seconds / 3600);
  var minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return hours + "h " + minutes + "min";
  }
  return minutes + " min";
}

function getActiveMenuStyle() {
  const data = loadData();
  return data.activeMenuStyle || "default";
}
function getAllHighScores() {
  const data = loadData();
  return data.scores || {};
}

function getHighScore(scoreKey) {
  const data = loadData();
  return data.scores[scoreKey] || 0;
}
