// quiz.js - Gra: PISARIO QUIZ (Milionerzy)

// Zmienna do zatrzymywania gry
let quizActive = false;

// Pula pytań (przykładowe - dodasz więcej później)
const quizQuestions = [
  {
    question: "W którym roku Michał Pisarski założył kanał YouTube?",
    answers: ["2008", "2010", "2012", "2015"],
    correct: 1, // Index odpowiedzi (0-3)
  },
  {
    question: "Która konsola Nintendo była ulubioną Michała?",
    answers: ["NES", "SNES", "N64", "GameCube"],
    correct: 1,
  },
  {
    question: "Ile gier Mario Bros wydano na NES?",
    answers: ["2", "3", "5", "7"],
    correct: 1,
  },
  {
    question: "Która gra jest najczęściej omawiana na kanale?",
    answers: ["Zelda", "Mario", "Metroid", "Pokémon"],
    correct: 1,
  },
  {
    question:
      "W jakim roku wydano konsolę Nintendo Entertainment System w Japonii?",
    answers: ["1981", "1983", "1985", "1987"],
    correct: 1,
  },
  {
    question: "Jak nazywa się główny bohater serii The Legend of Zelda?",
    answers: ["Zelda", "Link", "Ganon", "Navi"],
    correct: 1,
  },
  {
    question: "Ile poziomów ma Super Mario Bros na NES?",
    answers: ["8 światów", "16 światów", "32 poziomy", "64 poziomy"],
    correct: 0,
  },
  {
    question: "Która firma stworzyła konsolę Game Boy?",
    answers: ["Sony", "Sega", "Nintendo", "Atari"],
    correct: 2,
  },
  {
    question: "Jak nazywa się wróg Mario który wygląda jak grzyb?",
    answers: ["Koopa", "Goomba", "Boo", "Shy Guy"],
    correct: 1,
  },
  {
    question: "W którym roku wydano grę Tetris?",
    answers: ["1984", "1985", "1986", "1987"],
    correct: 0,
  },
  // Dodaj tutaj 90-140 więcej pytań później
];

// Zmienne stanu gry
let currentQuestions = [];
let currentQuestionIndex = 0;
let quizScore = 0;

// Funkcja startowania quizu
function startQuiz() {
  quizActive = true;

  // Ustaw tytuł gry
  document.getElementById("game-title").textContent = "PISARIO QUIZ";

  // Losuj 10 pytań z puli
  currentQuestions = shuffleArray(quizQuestions).slice(0, 10);
  currentQuestionIndex = 0;
  quizScore = 0;

  // Aktualizuj wynik
  updateQuizScore();

  // Pokaż pierwsze pytanie
  showQuestion();
}

// Funkcja pokazywania pytania
function showQuestion() {
  const gameContent = document.getElementById("game-content");

  if (currentQuestionIndex >= currentQuestions.length) {
    // Koniec quizu - wygrana!
    endQuiz(true);
    return;
  }

  const q = currentQuestions[currentQuestionIndex];

  gameContent.innerHTML = `
        <div style="width: 100%; max-width: 600px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <p style="font-size: 10px; color: var(--gray); margin-bottom: 10px;">
                    PYTANIE ${currentQuestionIndex + 1} / 10
                </p>
                <h2 style="font-size: 14px; line-height: 1.6; color: var(--dark-gray);">
                    ${q.question}
                </h2>
            </div>
            
            <div style="display: grid; gap: 15px;">
                ${q.answers
                  .map(
                    (answer, index) => `
                    <button class="quiz-answer-btn" data-index="${index}">
                        <span style="color: var(--yellow);">${String.fromCharCode(
                          65 + index
                        )}:</span> ${answer}
                    </button>
                `
                  )
                  .join("")}
            </div>
        </div>
    `;

  // Dodaj event listenery do przycisków odpowiedzi
  const answerButtons = gameContent.querySelectorAll(".quiz-answer-btn");
  answerButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const selectedIndex = parseInt(this.getAttribute("data-index"));
      checkAnswer(selectedIndex);
    });
  });

  // Dodaj style dla przycisków odpowiedzi
  addQuizStyles();
}

// Funkcja sprawdzania odpowiedzi
function checkAnswer(selectedIndex) {
  if (!quizActive) return;

  const q = currentQuestions[currentQuestionIndex];

  if (selectedIndex === q.correct) {
    // Poprawna odpowiedź!
    quizScore += 100;
    updateQuizScore();
    playBeep(660, 0.15);

    // Następne pytanie po krótkiej chwili
    setTimeout(() => {
      currentQuestionIndex++;
      showQuestion();
    }, 500);
  } else {
    // Błędna odpowiedź - koniec gry
    playDeathSound();
    endQuiz(false);
  }
}

// Funkcja aktualizacji wyniku
function updateQuizScore() {
  document.getElementById("game-score").textContent = "WYNIK: " + quizScore;
}

// Funkcja końca quizu
function endQuiz(won) {
  quizActive = false;
  const gameContent = document.getElementById("game-content");

  if (won) {
    // Wygrana!
    gameContent.innerHTML = `
            <div style="text-align: center;">
                <h2 style="font-size: 24px; color: var(--green); margin-bottom: 20px;">
                    🎉 WYGRANA! 🎉
                </h2>
                <p style="font-size: 14px; color: var(--dark-gray); margin-bottom: 15px;">
                    Ukończyłeś quiz 10/10!
                </p>
                <p style="font-size: 12px; color: var(--blue);">
                    WYNIK: ${quizScore}
                </p>
            </div>
        `;

    // Zapisz wynik
    saveScore("quiz_highscore", quizScore);

    // Dodaj do ukończonych gier
    addCompletedGame("quiz");

    // Odblokuj osiągnięcie
    unlockAchievement("mistrz_wiedzy");

    // Odtwórz dźwięk wygranej
    playWinSound();
  } else {
    // Przegrana
    gameContent.innerHTML = `
            <div style="text-align: center;">
                <h2 style="font-size: 24px; color: var(--red); margin-bottom: 20px;">
                    💀 PRZEGRANA 💀
                </h2>
                <p style="font-size: 14px; color: var(--dark-gray); margin-bottom: 15px;">
                    Błędna odpowiedź!
                </p>
                <p style="font-size: 12px; color: var(--blue); margin-bottom: 20px;">
                    WYNIK: ${quizScore}
                </p>
                <button class="btn-play" onclick="startQuiz()">SPRÓBUJ PONOWNIE</button>
            </div>
        `;
  }
}

// Funkcja zatrzymania quizu
function stopQuiz() {
  quizActive = false;
}

// Funkcja dodawania stylów dla przycisków quizu
function addQuizStyles() {
  // Sprawdź czy style już istnieją
  if (document.getElementById("quiz-styles")) return;

  const style = document.createElement("style");
  style.id = "quiz-styles";
  style.textContent = `
        .quiz-answer-btn {
            font-family: 'Press Start 2P', cursive;
            font-size: 12px;
            padding: 20px;
            background: var(--light-gray);
            color: var(--dark-gray);
            border: 4px solid var(--dark-gray);
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s;
            text-align: left;
        }
        
        .quiz-answer-btn:hover {
            background: var(--yellow);
            transform: translateX(10px);
        }
        
        .quiz-answer-btn:active {
            background: var(--green);
            color: var(--white);
        }
    `;

  document.head.appendChild(style);
}
