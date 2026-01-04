// utils.js - Funkcje pomocnicze

// Funkcja pokazywania toasta (powiadomienia)
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.display = "block";

  // Ukryj po 3 sekundach
  setTimeout(function () {
    toast.style.display = "none";
  }, 3000);
}

// Funkcja odtwarzania prostego beepa (Web Audio API)
function playBeep(frequency, duration) {
  try {
    // Tworzenie kontekstu audio
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    // Tworzenie oscylatora (generator dźwięku)
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Ustawienia
    oscillator.frequency.value = frequency; // Częstotliwość w Hz
    oscillator.type = "square"; // Typ fali (square = retro)

    // Połączenie oscylator -> gain -> output
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Głośność
    gainNode.gain.value = 0.1; // 10% głośności (żeby nie było za głośno)

    // Start i stop
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    // Jeśli Web Audio API nie działa, po prostu pomiń
    console.log("Web Audio API nie dostępne");
  }
}

// Funkcja odtwarzania melodii osiągnięcia (2 nuty)
function playAchievementSound() {
  playBeep(880, 0.15); // Wysoka nuta
  setTimeout(function () {
    playBeep(660, 0.2); // Niższa nuta
  }, 150);
}

// Funkcja odtwarzania dźwięku śmierci
function playDeathSound() {
  playBeep(220, 0.3); // Niska nuta
}

// Funkcja odtwarzania dźwięku wygranej
function playWinSound() {
  playBeep(523, 0.15); // C
  setTimeout(() => playBeep(659, 0.15), 150); // E
  setTimeout(() => playBeep(784, 0.15), 300); // G
  setTimeout(() => playBeep(1047, 0.3), 450); // C (wyższa)
}

// Funkcja losowania liczby z zakresu
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Funkcja tasowania tablicy (Fisher-Yates)
function shuffleArray(array) {
  const arr = [...array]; // Kopia tablicy
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Funkcja formatowania czasu (sekundy -> mm:ss)
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins + ":" + (secs < 10 ? "0" : "") + secs;
}

// Funkcja sprawdzania kolizji prostokątów (AABB)
function checkCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}
