


const shopItems = [
  
  {
    id: "avatar_dino",
    type: "avatar",
    name: "Avatar Dinozaur",
    emoji: "🦖",
    price: 20,
    avatarId: "dino",
  },
  {
    id: "avatar_lightning",
    type: "avatar",
    name: "Avatar Błyskawica",
    emoji: "⚡",
    price: 20,
    avatarId: "lightning",
  },
  {
    id: "avatar_target",
    type: "avatar",
    name: "Avatar Cel",
    emoji: "🎯",
    price: 20,
    avatarId: "target",
  },
  {
    id: "avatar_rocket",
    type: "avatar",
    name: "Avatar Rakieta",
    emoji: "🚀",
    price: 20,
    avatarId: "rocket",
  },

  
  {
    id: "code_pacman",
    type: "code",
    name: "Odblokuj PACMAN",
    emoji: "🟡",
    price: 30,
    gameCode: "pacman",
  },
  {
    id: "code_tetris",
    type: "code",
    name: "Odblokuj TETRIS",
    emoji: "🟦",
    price: 30,
    gameCode: "tetris",
  },
  {
    id: "code_pong",
    type: "code",
    name: "Odblokuj PONG",
    emoji: "🏓",
    price: 30,
    gameCode: "pong",
  },

  
  {
    id: "bg_night",
    type: "background",
    name: "Tło Nocne",
    emoji: "🌙",
    price: 50,
    bgClass: "bg-night",
    preview: "Gradient ciemny (granat-fiolet)",
  },
  {
    id: "bg_retro",
    type: "background",
    name: "Tło Retro",
    emoji: "📺",
    price: 50,
    bgClass: "bg-retro",
    preview: "Gradient vintage (beż-brąz)",
  },
  {
    id: "bg_neon",
    type: "background",
    name: "Tło Neon",
    emoji: "💫",
    price: 50,
    bgClass: "bg-neon",
    preview: "Gradient neonowy (róż-cyan)",
  },
  {
    id: "bg_switch",
    type: "background",
    name: "Tło Nintendo Switch",
    emoji: "🎮",
    price: 50,
    bgClass: "bg-switch",
    preview: "Gradient czerwono-niebiesko-czarny",
  },

  
  {
    id: "style_nes",
    type: "menu_style",
    name: "Styl NES",
    emoji: "🎮",
    price: 150,
    styleClass: "menu-nes",
    preview: "Kwadratowe przyciski, pixel art",
  },
  {
    id: "style_gameboy",
    type: "menu_style",
    name: "Styl Game Boy",
    emoji: "🟢",
    price: 150,
    styleClass: "menu-gameboy",
    preview: "Zielonkawy odcień, zaokrąglone",
  },
  {
    id: "style_switch",
    type: "menu_style",
    name: "Styl Nintendo Switch",
    emoji: "🔴",
    price: 150,
    styleClass: "menu-switch",
    preview: "Nowoczesny, joy-con style",
  },
];


function initShop() {
  
  const shopVisited = localStorage.getItem("shopVisited");
  if (!shopVisited) {
    document.getElementById("shop-welcome").style.display = "block";
    localStorage.setItem("shopVisited", "true");
  }

  
  document
    .getElementById("shop-welcome-close")
    .addEventListener("click", () => {
      document.getElementById("shop-welcome").style.display = "none";
    });

  
  renderShop();
}


function renderShop() {
  renderShopCategory("avatar", "shop-avatars");
  renderShopCategory("code", "shop-codes");
  renderShopCategory("background", "shop-backgrounds");
  renderShopCategory("menu_style", "shop-styles");
}


function renderShopCategory(type, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  const items = shopItems.filter((item) => item.type === type);

  items.forEach((item) => {
    
    if (hasPurchased(item.id)) {
      return; 
    }

    
    if (item.type === "code") {
      const data = loadData();
      if (data.unlockedGames && data.unlockedGames.includes(item.gameCode)) {
        return; 
      }
    }

    const itemCard = document.createElement("div");
    itemCard.className = "shop-item-card";
    itemCard.style.cssText = `
      background: var(--light-gray);
      border: 4px solid var(--dark-gray);
      border-radius: 10px;
      padding: 15px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    `;

    itemCard.innerHTML = `
      <div style="font-size: 40px; margin-bottom: 10px;">${item.emoji}</div>
      <h4 style="font-size: 8px; margin-bottom: 5px; color: var(--dark-gray);">${
        item.name
      }</h4>
      ${
        item.preview
          ? `<p style="font-size: 6px; color: var(--gray); margin-bottom: 10px;">${item.preview}</p>`
          : ""
      }
      <div style="font-size: 10px; color: var(--dark-gray); font-weight: bold; margin-bottom: 10px;">🪙 ${
        item.price
      }</div>
      <button class="btn-shop-buy" data-item-id="${item.id}" style="
        font-family: 'Press Start 2P', cursive;
        font-size: 7px;
        padding: 8px 12px;
        background: var(--green);
        color: var(--white);
        border: 3px solid var(--dark-gray);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
      ">KUP</button>
    `;

    
    itemCard.addEventListener("mouseenter", () => {
      itemCard.style.transform = "scale(1.05)";
      itemCard.style.borderColor = "var(--yellow)";
    });
    itemCard.addEventListener("mouseleave", () => {
      itemCard.style.transform = "scale(1)";
      itemCard.style.borderColor = "var(--dark-gray)";
    });

    
    const buyBtn = itemCard.querySelector(".btn-shop-buy");
    buyBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      purchaseItem(item.id);
    });

    container.appendChild(itemCard);
  });

  
  if (container.children.length === 0) {
    container.innerHTML = `
      <p style="font-size: 8px; color: var(--gray); text-align: center; padding: 20px;">
        Wszystkie przedmioty z tej kategorii zostały już kupione! ✨
      </p>
    `;
  }
}


function purchaseItem(itemId) {
  const item = shopItems.find((i) => i.id === itemId);
  if (!item) return;

  const currentCoins = getCoins();

  
  if (currentCoins < item.price) {
    showToast(`❌ Za mało monet! Potrzebujesz ${item.price} 🪙`);
    return;
  }

  
  if (!spendCoins(item.price)) {
    showToast("❌ Błąd podczas zakupu!");
    return;
  }

  
  addPurchase(itemId);

  
  switch (item.type) {
    case "avatar":
      showToast(`✅ Kupiono avatar ${item.emoji}! Zmień w profilu.`);
      break;

    case "code":
      
      if (typeof unlockGame === "function") {
        unlockGame(item.gameCode);
        
        if (typeof updateUnlockedGames === "function") {
          updateUnlockedGames();
        }
      }
      showToast(`✅ Odblokowano grę ${item.name}!`);
      break;

    case "background":
      applyBackground(item.bgClass);
      setActiveBackground(item.bgClass);
      showToast(`✅ Zastosowano ${item.name}!`);
      break;

    case "menu_style":
      applyMenuStyle(item.styleClass);
      setActiveMenuStyle(item.styleClass);
      showToast(`✅ Zastosowano ${item.name}!`);
      break;
  }

  
  renderShop();
}


function applyBackground(bgClass) {
  const body = document.body;

  
  body.classList.remove("bg-night", "bg-retro", "bg-neon", "bg-switch");

  
  if (bgClass !== "default") {
    body.classList.add(bgClass);
  }
}


function applyMenuStyle(styleClass) {
  const body = document.body;

  
  body.classList.remove("menu-nes", "menu-gameboy", "menu-switch");

  
  if (styleClass !== "default") {
    body.classList.add(styleClass);
  }
}


function getAvailableAvatars() {
  const defaultAvatars = [
    "mario",
    "link",
    "pacman",
    "ghost",
    "star",
    "coin",
    "controller",
    "trophy",
  ];
  const purchasedAvatars = [];

  
  shopItems.forEach((item) => {
    if (item.type === "avatar" && hasPurchased(item.id)) {
      purchasedAvatars.push(item.avatarId);
    }
  });

  return [...defaultAvatars, ...purchasedAvatars];
}
