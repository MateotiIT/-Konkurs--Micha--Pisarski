


function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.display = "block";

  
  setTimeout(function () {
    toast.style.display = "none";
  }, 3000);
}


function playBeep(frequency, duration) {
  try {
    
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    
    oscillator.frequency.value = frequency; 
    oscillator.type = "square"; 

    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    
    gainNode.gain.value = 0.1; 

    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    
    console.log("Web Audio API nie dostępne");
  }
}


function playAchievementSound() {
  playBeep(880, 0.15); 
  setTimeout(function () {
    playBeep(660, 0.2); 
  }, 150);
}


function playDeathSound() {
  playBeep(220, 0.3); 
}


function playWinSound() {
  playBeep(523, 0.15); 
  setTimeout(() => playBeep(659, 0.15), 150); 
  setTimeout(() => playBeep(784, 0.15), 300); 
  setTimeout(() => playBeep(1047, 0.3), 450); 
}


function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function shuffleArray(array) {
  const arr = [...array]; 
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}


function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins + ":" + (secs < 10 ? "0" : "") + secs;
}


function checkCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}
