


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
      },
      gamesCompleted: [],
      stats: {
        totalGamesPlayed: 0,
        totalPlaytime: 0,
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


function getActiveMenuStyle() {
  const data = loadData();
  return data.activeMenuStyle || "default";
}
