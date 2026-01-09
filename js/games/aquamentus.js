

let aquamentusActive = false;
let aquamentusCanvas;
let aquamentusCtx;
let aquamentusInterval;


let link = {
  x: 100,
  y: 180,
  width: 24,
  height: 24,
  speed: 3,
  hp: 10,
  maxHp: 10,
  attackCooldown: 0,
  invincible: 0, 
  direction: "right", 
};


let aquamentus = {
  x: 450,
  y: 120,
  width: 80,
  height: 80,
  hp: 15,
  maxHp: 15,
  moveTimer: 0,
  moveInterval: 60,
  direction: { x: 0, y: 1 },
  shootTimer: 0,
  shootInterval: 120, 
};


let fireballs = [];
let swordSlashes = [];


let aquamentusKeys = {
  up: false,
  down: false,
  left: false,
  right: false,
  space: false,
};


let aquamentusGameOver = false;
let aquamentusVictory = false;


function startAquamentus() {
  
  aquamentusActive = true;
  aquamentusGameOver = false;
  aquamentusVictory = false;

  
  link.x = 100;
  link.y = 180;
  link.hp = 10;
  link.attackCooldown = 0;
  link.invincible = 0;
  link.direction = "right";

  
  aquamentus.x = 450;
  aquamentus.y = 120;
  aquamentus.hp = 15;
  aquamentus.moveTimer = 0;
  aquamentus.shootTimer = 0;
  aquamentus.direction = { x: 0, y: 1 };

  
  fireballs = [];
  swordSlashes = [];

  
  aquamentusKeys.up = false;
  aquamentusKeys.down = false;
  aquamentusKeys.left = false;
  aquamentusKeys.right = false;
  aquamentusKeys.space = false;

  
  document.getElementById("main-menu").style.display = "none";
  document.getElementById("game-container").style.display = "flex";

  
  document.getElementById("game-title").innerText = "ZELDA: AQUAMENTUS";
  document.getElementById("game-score").innerText = `❤️ ${Math.ceil(
    link.hp / 2
  )} | BOSS: ${aquamentus.hp}`;

  
  const gameContent = document.getElementById("game-content");
  gameContent.innerHTML = `<canvas id="aquamentus-canvas" width="600" height="400"></canvas>`;

  aquamentusCanvas = document.getElementById("aquamentus-canvas");
  aquamentusCtx = aquamentusCanvas.getContext("2d");

  
  document.addEventListener("keydown", handleAquamentusKeyDown);
  document.addEventListener("keyup", handleAquamentusKeyUp);

  
  aquamentusInterval = setInterval(() => {
    aquamentusGameLoop();
  }, 1000 / 60);

  playBeep(440, 0.1);
}


function handleAquamentusKeyDown(e) {
  if (!aquamentusActive) return;

  if (e.key === "ArrowUp") aquamentusKeys.up = true;
  if (e.key === "ArrowDown") aquamentusKeys.down = true;
  if (e.key === "ArrowLeft") aquamentusKeys.left = true;
  if (e.key === "ArrowRight") aquamentusKeys.right = true;
  if (e.key === " ") {
    e.preventDefault();
    aquamentusKeys.space = true;
  }
  if (e.key === "Escape") {
    stopAquamentus();
  }
}

function handleAquamentusKeyUp(e) {
  if (e.key === "ArrowUp") aquamentusKeys.up = false;
  if (e.key === "ArrowDown") aquamentusKeys.down = false;
  if (e.key === "ArrowLeft") aquamentusKeys.left = false;
  if (e.key === "ArrowRight") aquamentusKeys.right = false;
  if (e.key === " ") aquamentusKeys.space = false;
}


function aquamentusGameLoop() {
  if (!aquamentusActive || aquamentusGameOver || aquamentusVictory) {
    return;
  }

  updateAquamentus();
  drawAquamentus();
}


function updateAquamentus() {
  
  let moveX = 0;
  let moveY = 0;

  if (aquamentusKeys.up) moveY -= 1;
  if (aquamentusKeys.down) moveY += 1;
  if (aquamentusKeys.left) moveX -= 1;
  if (aquamentusKeys.right) moveX += 1;

  
  if (moveX < 0) link.direction = "left";
  if (moveX > 0) link.direction = "right";
  if (moveY < 0) link.direction = "up";
  if (moveY > 0) link.direction = "down";

  
  if (moveX !== 0 && moveY !== 0) {
    moveX *= 0.707;
    moveY *= 0.707;
  }

  link.x += moveX * link.speed;
  link.y += moveY * link.speed;

  
  if (link.x < 10) link.x = 10;
  if (link.x > 590 - link.width) link.x = 590 - link.width;
  if (link.y < 10) link.y = 10;
  if (link.y > 390 - link.height) link.y = 390 - link.height;

  
  if (aquamentusKeys.space && link.attackCooldown === 0) {
    link.attackCooldown = 20; 

    
    let slashX = link.x;
    let slashY = link.y;
    let slashWidth = 8;
    let slashHeight = 8;

    if (link.direction === "right") {
      slashX = link.x + link.width + 5;
      slashY = link.y + link.height / 2 - 4;
      slashWidth = 20;
      slashHeight = 8;
    } else if (link.direction === "left") {
      slashX = link.x - 25;
      slashY = link.y + link.height / 2 - 4;
      slashWidth = 20;
      slashHeight = 8;
    } else if (link.direction === "up") {
      slashX = link.x + link.width / 2 - 4;
      slashY = link.y - 25;
      slashWidth = 8;
      slashHeight = 20;
    } else if (link.direction === "down") {
      slashX = link.x + link.width / 2 - 4;
      slashY = link.y + link.height + 5;
      slashWidth = 8;
      slashHeight = 20;
    }

    swordSlashes.push({
      x: slashX,
      y: slashY,
      width: slashWidth,
      height: slashHeight,
      lifetime: 10,
      direction: link.direction,
    });

    playBeep(880, 0.05);
  }

  if (link.attackCooldown > 0) link.attackCooldown--;
  if (link.invincible > 0) link.invincible--;

  
  swordSlashes = swordSlashes.filter((slash) => {
    slash.lifetime--;
    return slash.lifetime > 0;
  });

  
  aquamentus.moveTimer++;
  if (aquamentus.moveTimer >= aquamentus.moveInterval) {
    aquamentus.moveTimer = 0;
    
    const dirs = [
      { x: 0, y: 1 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: -1, y: 0 },
    ];
    aquamentus.direction = dirs[Math.floor(Math.random() * dirs.length)];
  }

  aquamentus.x += aquamentus.direction.x * 1.5;
  aquamentus.y += aquamentus.direction.y * 1.5;

  
  if (aquamentus.x < 300) aquamentus.x = 300;
  if (aquamentus.x > 590 - aquamentus.width)
    aquamentus.x = 590 - aquamentus.width;
  if (aquamentus.y < 10) aquamentus.y = 10;
  if (aquamentus.y > 390 - aquamentus.height)
    aquamentus.y = 390 - aquamentus.height;

  
  aquamentus.shootTimer++;
  if (aquamentus.shootTimer >= aquamentus.shootInterval) {
    aquamentus.shootTimer = 0;
    shootFireballs();
  }

  
  fireballs.forEach((fb) => {
    fb.x += fb.vx;
    fb.y += fb.vy;
  });

  
  fireballs = fireballs.filter(
    (fb) => fb.x > -20 && fb.x < 620 && fb.y > -20 && fb.y < 420
  );

  
  swordSlashes.forEach((slash) => {
    if (
      slash.x < aquamentus.x + aquamentus.width &&
      slash.x + slash.width > aquamentus.x &&
      slash.y < aquamentus.y + aquamentus.height &&
      slash.y + slash.height > aquamentus.y
    ) {
      aquamentus.hp -= 1;
      slash.lifetime = 0; 
      playBeep(330, 0.1);

      
      if (aquamentus.hp <= 0) {
        aquamentusVictory = true;
        endAquamentus(true);
      }
    }
  });

  
  if (link.invincible === 0) {
    fireballs.forEach((fb) => {
      if (
        fb.x < link.x + link.width &&
        fb.x + fb.width > link.x &&
        fb.y < link.y + link.height &&
        fb.y + fb.height > link.y
      ) {
        link.hp -= 2;
        link.invincible = 60; 
        fb.x = -100; 
        playBeep(220, 0.2);

        
        if (link.hp <= 0) {
          aquamentusGameOver = true;
          endAquamentus(false);
        }
      }
    });

    
    if (
      link.x < aquamentus.x + aquamentus.width &&
      link.x + link.width > aquamentus.x &&
      link.y < aquamentus.y + aquamentus.height &&
      link.y + link.height > aquamentus.y
    ) {
      link.hp -= 2;
      link.invincible = 60;
      playBeep(220, 0.2);

      
      const pushX = link.x < aquamentus.x ? -20 : 20;
      const pushY = link.y < aquamentus.y ? -20 : 20;
      link.x += pushX;
      link.y += pushY;

      if (link.hp <= 0) {
        aquamentusGameOver = true;
        endAquamentus(false);
      }
    }
  }

  
  document.getElementById("game-score").innerText = `❤️ ${Math.ceil(
    link.hp / 2
  )} | BOSS: ${aquamentus.hp}`;
}


function drawAquamentus() {
  const ctx = aquamentusCtx;

  
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, 600, 400);

  
  ctx.fillStyle = "#2a2a2a";
  for (let i = 0; i < 600; i += 40) {
    for (let j = 0; j < 400; j += 40) {
      ctx.fillRect(i + 2, j + 2, 36, 36);
    }
  }

  
  if (link.invincible % 8 < 4) {
    
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(link.x, link.y, link.width, link.height);

    
    ctx.fillStyle = "#8b4513";
    ctx.fillRect(link.x - 6, link.y + 4, 8, 16);
  }

  
  swordSlashes.forEach((slash) => {
    
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(slash.x, slash.y, slash.width, slash.height);

    
    ctx.strokeStyle = "#c0c0c0";
    ctx.lineWidth = 2;
    ctx.strokeRect(slash.x, slash.y, slash.width, slash.height);
  });

  
  ctx.fillStyle = "#00aa00";
  ctx.fillRect(aquamentus.x, aquamentus.y, aquamentus.width, aquamentus.height);

  
  ctx.fillStyle = "#008800";
  ctx.fillRect(aquamentus.x - 20, aquamentus.y + 20, 25, 40);

  
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(aquamentus.x - 22, aquamentus.y + 18, 6, 12);
  ctx.fillRect(aquamentus.x - 22, aquamentus.y + 50, 6, 12);

  
  ctx.fillStyle = "#ff3300";
  fireballs.forEach((fb) => {
    ctx.beginPath();
    ctx.arc(
      fb.x + fb.width / 2,
      fb.y + fb.height / 2,
      fb.width / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    
    ctx.fillStyle = "#ff9900";
    ctx.beginPath();
    ctx.arc(
      fb.x + fb.width / 2,
      fb.y + fb.height / 2,
      fb.width / 4,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.fillStyle = "#ff3300";
  });

  
  ctx.fillStyle = "#333";
  ctx.fillRect(300, 10, 280, 20);
  ctx.fillStyle = "#00ff00";
  const hpPercent = aquamentus.hp / aquamentus.maxHp;
  ctx.fillRect(302, 12, 276 * hpPercent, 16);

  
  ctx.fillStyle = "#fff";
  ctx.font = "12px 'Press Start 2P'";
  ctx.fillText("AQUAMENTUS", 310, 24);
}


function shootFireballs() {
  const centerX = aquamentus.x;
  const centerY = aquamentus.y + aquamentus.height / 2;

  
  const angles = [-0.3, 0, 0.3]; 

  angles.forEach((angle) => {
    fireballs.push({
      x: centerX - 20,
      y: centerY,
      width: 16,
      height: 16,
      vx: -4 * Math.cos(angle),
      vy: -4 * Math.sin(angle),
    });
  });

  playBeep(660, 0.1);
}


function endAquamentus(won) {
  aquamentusActive = false;
  clearInterval(aquamentusInterval);

  document.removeEventListener("keydown", handleAquamentusKeyDown);
  document.removeEventListener("keyup", handleAquamentusKeyUp);

  const gameContent = document.getElementById("game-content");

  if (won) {
    playAchievementSound();
    gameContent.innerHTML = `
      <div style="text-align: center;">
        <h2 style="font-size: 24px; color: var(--green); margin-bottom: 20px;">
          🏆 AQUAMENTUS POKONANY! 🏆
        </h2>
        <p style="font-size: 14px; color: var(--dark-gray); margin-bottom: 15px;">
          Link triumfuje!
        </p>
        <div style="font-size: 48px; margin: 20px 0;">
          🗡️
        </div>
        <p style="font-size: 16px; color: var(--green); margin-bottom: 20px; font-weight: bold;">
          ZWYCIĘSTWO!
        </p>
        <button class="btn-play" onclick="startAquamentus()">ZAGRAJ PONOWNIE</button>
        <button class="btn-secondary" onclick="stopAquamentus()" style="margin-top: 10px;">WYJDŹ</button>
      </div>
    `;
  } else {
    playBeep(220, 0.5);
    gameContent.innerHTML = `
      <div style="text-align: center;">
        <h2 style="font-size: 24px; color: var(--red); margin-bottom: 20px;">
          💀 KONIEC GRY 💀
        </h2>
        <p style="font-size: 14px; color: var(--dark-gray); margin-bottom: 15px;">
          Aquamentus cię pokonał!
        </p>
        <div style="font-size: 48px; margin: 20px 0;">
          😵
        </div>
        <p style="font-size: 16px; color: var(--red); margin-bottom: 20px; font-weight: bold;">
          PRZEGRANA
        </p>
        <button class="btn-play" onclick="startAquamentus()">ZAGRAJ PONOWNIE</button>
        <button class="btn-secondary" onclick="stopAquamentus()" style="margin-top: 10px;">WYJDŹ</button>
      </div>
    `;
  }
}


function stopAquamentus() {
  aquamentusActive = false;
  aquamentusGameOver = false;
  aquamentusVictory = false;

  if (aquamentusInterval) {
    clearInterval(aquamentusInterval);
  }

  document.removeEventListener("keydown", handleAquamentusKeyDown);
  document.removeEventListener("keyup", handleAquamentusKeyUp);

  
  aquamentusKeys.up = false;
  aquamentusKeys.down = false;
  aquamentusKeys.left = false;
  aquamentusKeys.right = false;
  aquamentusKeys.space = false;

  
  const gameContent = document.getElementById("game-content");
  if (gameContent) {
    gameContent.innerHTML = "";
  }

  
  document.getElementById("main-menu").style.display = "block";
  document.getElementById("game-container").style.display = "none";
}
