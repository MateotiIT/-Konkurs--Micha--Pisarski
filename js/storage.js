// storage.js - Zarządzanie localStorage

// Inicjalizacja localStorage z domyślnymi wartościami
function initStorage() {
  // Sprawdź czy już jest coś w localStorage
  const existing = localStorage.getItem("pisarskiArcade");

  if (!existing) {
    // Utwórz nowe dane
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
      fanarts: {
        fanart1: false,
        fanart2: false,
        fanart3: false,
        fanart4: false,
        fanart5: false,
        fanart6: false,
        fanart7: false,
        fanart8: false,
        fanart9: false,
        fanart10: false,
        fanart11: false,
        fanart12: false,
        fanart13: false,
        fanart14: false,
        fanart17: false,
        fanart18: false,
        fanart19: false,
        fanart15: false,
        fanart16: false,
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

    // Zapisz domyślne dane
    localStorage.setItem("pisarskiArcade", JSON.stringify(defaultData));
  }
}

// Funkcja zapisywania danych
function saveData(key, value) {
  const data = loadData();
  data[key] = value;
  localStorage.setItem("pisarskiArcade", JSON.stringify(data));
}

// Funkcja ładowania wszystkich danych
function loadData() {
  const data = localStorage.getItem("pisarskiArcade");
  return data ? JSON.parse(data) : null;
}

// Funkcja ładowania konkretnego klucza
function loadDataKey(key) {
  const data = loadData();
  return data ? data[key] : null;
}

// Funkcja resetowania danych
function resetData() {
  localStorage.removeItem("pisarskiArcade");
  initStorage();
}

// Funkcja zapisywania osiągnięcia
function saveAchievement(achievementId, unlocked) {
  const data = loadData();
  data.achievements[achievementId] = unlocked;
  localStorage.setItem("pisarskiArcade", JSON.stringify(data));
}

// Funkcja zapisywania fanarta
function saveFanart(fanartId, unlocked) {
  const data = loadData();
  data.fanarts[fanartId] = unlocked;
  localStorage.setItem("pisarskiArcade", JSON.stringify(data));
}

// Funkcja dodawania ukończonej gry
function addCompletedGame(gameName) {
  const data = loadData();

  // Sprawdź czy gra już nie jest na liście
  if (!data.gamesCompleted.includes(gameName)) {
    data.gamesCompleted.push(gameName);
    saveData("gamesCompleted", data.gamesCompleted);

    // Sprawdź osiągnięcie WETERAN ARCADE
    if (data.gamesCompleted.length === 5) {
      unlockAchievement("weteran_arcade");
    }

    // Odblokuj Invaders po ukończeniu 5 gier
    if (data.gamesCompleted.length >= 5) {
      unlockInvadersGame();
    }

    // Aktualizuj UI z pucharami
    if (typeof updateCompletedGamesUI === "function") {
      updateCompletedGamesUI();
    }
  }
}

// Funkcja zapisywania wyniku
function saveScore(scoreKey, value) {
  const data = loadData();

  // Zapisz nowy wynik tylko jeśli jest lepszy
  if (value > (data.scores[scoreKey] || 0)) {
    data.scores[scoreKey] = value;
    saveData("scores", data.scores);
  }
}

// Funkcja dodawania easter egga
function addEasterEgg(eggName, description) {
  const data = loadData();

  // Sprawdź czy easter egg już nie istnieje
  const exists = data.easterEggs.find((egg) => egg.name === eggName);

  if (!exists) {
    data.easterEggs.push({
      name: eggName,
      description: description,
      date: new Date().toLocaleDateString("pl-PL"),
    });

    saveData("easterEggs", data.easterEggs);

    // Pokaż powiadomienie
    showToast("🥚 Easter Egg znaleziony: " + eggName);
  }
}

// ============== SYSTEM MONET ==============

// Funkcja dodawania monet
function addCoins(amount) {
  const data = loadData();
  if (!data.coins) data.coins = 0;
  data.coins += amount;
  saveData("coins", data.coins);

  // Aktualizuj wyświetlanie profilu
  if (typeof updateProfileDisplay === "function") {
    const nick = data.profile?.nick || "GRACZ";
    const avatar = data.profile?.avatar || "mario";
    updateProfileDisplay(nick, avatar);
  }

  return data.coins;
}

// Funkcja wydawania monet
function spendCoins(amount) {
  const data = loadData();
  if (!data.coins) data.coins = 0;

  if (data.coins >= amount) {
    data.coins -= amount;
    saveData("coins", data.coins);

    // Aktualizuj wyświetlanie profilu
    if (typeof updateProfileDisplay === "function") {
      const nick = data.profile?.nick || "GRACZ";
      const avatar = data.profile?.avatar || "mario";
      updateProfileDisplay(nick, avatar);
    }

    return true;
  }
  return false;
}

// Funkcja pobierania salda monet
function getCoins() {
  const data = loadData();
  return data.coins || 0;
}

// ============== SYSTEM SKLEPU ==============

// Funkcja sprawdzania czy przedmiot został kupiony
function hasPurchased(itemId) {
  const data = loadData();
  if (!data.shop) data.shop = { purchased: [] };
  return data.shop.purchased.includes(itemId);
}

// Funkcja dodawania zakupu
function addPurchase(itemId) {
  const data = loadData();
  if (!data.shop) data.shop = { purchased: [] };

  if (!data.shop.purchased.includes(itemId)) {
    data.shop.purchased.push(itemId);
    saveData("shop", data.shop);
  }
}

// Funkcja ustawiania aktywnego tła
function setActiveBackground(bgId) {
  saveData("activeBackground", bgId);
}

// Funkcja pobierania aktywnego tła
function getActiveBackground() {
  const data = loadData();
  return data.activeBackground || "default";
}

// Funkcja ustawiania aktywnego stylu menu
function setActiveMenuStyle(styleId) {
  saveData("activeMenuStyle", styleId);
}

// Funkcja pobierania aktywnego stylu menu
function getActiveMenuStyle() {
  const data = loadData();
  return data.activeMenuStyle || "default";
}
