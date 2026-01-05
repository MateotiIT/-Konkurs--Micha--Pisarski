// quiz.js - Gra: PISARIO QUIZ (Milionerzy)

// Zmienna do zatrzymywania gry
let quizActive = false;
let selectedCategory = null;

// Kategorie pytań
const quizCategories = [
  { id: "pisario", name: "Pisario3000", icon: "🎮", color: "var(--red)" },
  { id: "nintendo", name: "Nintendo", icon: "🕹️", color: "var(--blue)" },
  { id: "retro", name: "Retro Gierki <3", icon: "👾", color: "var(--purple)" },
];

// Pula pytań podzielona na kategorie
const quizQuestions = {
  pisario: [
    {
      question: "W którym roku Michał Pisarski założył kanał YouTube?",
      answers: ["2008", "2010", "2012", "2015"],
      correct: 1,
    },
    {
      question: "Która konsola Nintendo była ulubioną Michała?",
      answers: ["NES", "SNES", "N64", "GameCube"],
      correct: 1,
    },
    {
      question: "Która gra jest najczęściej omawiana na kanale?",
      answers: ["Zelda", "Mario", "Metroid", "Pokémon"],
      correct: 1,
    },
    // Dodaj więcej pytań o Pisario
  ],
  nintendo: [
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
    // Dodaj więcej pytań o Nintendo
  ],
  retro: [
    {
      question: "W którym roku wydano grę Tetris?",
      answers: ["1984", "1985", "1986", "1987"],
      correct: 0,
    },
    {
      question: "Ile gier Mario Bros wydano na NES?",
      answers: ["2", "3", "5", "7"],
      correct: 1,
    },
    // Dodaj więcej pytań o retro gry
  ],
};

// Zmienne stanu gry
let currentQuestions = [];
let currentQuestionIndex = 0;
let quizScore = 0;

// Funkcja startowania quizu
function startQuiz() {
  quizActive = false; // Zablokuj grę do wyboru kategorii
  selectedCategory = null;

  // Ustaw tytuł gry
  document.getElementById("game-title").textContent = "PISARIO QUIZ";
  document.getElementById("game-score").textContent = "WYBIERZ KATEGORIĘ";

  // Pokaż ekran wyboru kategorii
  showCategorySelection();
}

// Funkcja wyświetlania wyboru kategorii
function showCategorySelection() {
  const gameContent = document.getElementById("game-content");

  gameContent.innerHTML = `
    <div style="text-align: center; width: 100%; max-width: 700px;">
      <h2 style="font-size: 18px; color: var(--dark-gray); margin-bottom: 30px;">
        Wybierz kategorię pytań:
      </h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
        ${quizCategories
          .map(
            (cat) => `
          <div class="category-choice" data-category="${cat.id}" style="
            cursor: pointer;
            border: 4px solid var(--dark-gray);
            border-radius: 15px;
            padding: 30px 20px;
            transition: transform 0.2s, border-color 0.2s, background 0.2s;
            background: var(--light-gray);
          ">
            <div style="font-size: 48px; margin-bottom: 15px;">${cat.icon}</div>
            <h3 style="font-size: 14px; color: var(--dark-gray); margin-bottom: 10px;">
              ${cat.name}
            </h3>
            <p style="font-size: 8px; color: var(--gray);">
              10 pytań
            </p>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;

  // Dodaj event listenery do wyboru kategorii
  const choices = gameContent.querySelectorAll(".category-choice");
  choices.forEach((choice) => {
    const categoryId = choice.getAttribute("data-category");
    const category = quizCategories.find((c) => c.id === categoryId);

    choice.addEventListener("click", function () {
      selectedCategory = categoryId;
      startQuizGame();
      playBeep(660, 0.1);
    });

    // Hover effect
    choice.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.05) translateY(-5px)";
      this.style.borderColor = category.color;
      this.style.background = "var(--white)";
    });

    choice.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1) translateY(0)";
      this.style.borderColor = "var(--dark-gray)";
      this.style.background = "var(--light-gray)";
    });
  });
}

// Funkcja startowania właściwej gry po wyborze kategorii
function startQuizGame() {
  quizActive = true;

  // Losuj 10 pytań z wybranej kategorii
  const categoryQuestions = quizQuestions[selectedCategory] || [];

  if (categoryQuestions.length < 10) {
    // Jeśli jest mniej niż 10 pytań, użyj wszystkich
    currentQuestions = shuffleArray(categoryQuestions);
  } else {
    currentQuestions = shuffleArray(categoryQuestions).slice(0, 10);
  }

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
    // Koniec quizu - pokaż wynik!
    endQuiz();
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
    quizScore++;
    playBeep(660, 0.15);
  } else {
    // Błędna odpowiedź
    playBeep(220, 0.15);
  }

  // Aktualizuj wynik
  updateQuizScore();

  // Następne pytanie po krótkiej chwili
  setTimeout(() => {
    currentQuestionIndex++;
    showQuestion();
  }, 500);
}

// Funkcja aktualizacji wyniku
function updateQuizScore() {
  document.getElementById("game-score").textContent = quizScore + " / 10";
}

// Funkcja końca quizu
function endQuiz() {
  quizActive = false;
  const gameContent = document.getElementById("game-content");

  // Oblicz procent
  const percentage = (quizScore / 10) * 100;

  let resultData = {};

  if (percentage < 30) {
    // 0-30% - Przegrana
    resultData = {
      emoji: "💀",
      title: "NIE POSZŁO...",
      message: "Może spróbuj jeszcze raz? 🤔",
      color: "var(--red)",
      funnyText: "Nawet Goomba wiedziałby więcej!",
    };
  } else if (percentage < 60) {
    // 30-60% - Średni wynik
    resultData = {
      emoji: "😅",
      title: "NIEŹLE!",
      message: "Ale jest jeszcze nad czym pracować!",
      color: "var(--yellow)",
      funnyText: "Luigi byłby dumny (ale tylko trochę)",
    };
  } else if (percentage < 100) {
    // 60-90% - Super wynik
    resultData = {
      emoji: "⭐",
      title: "SUPER!",
      message: "Świetna robota!",
      color: "var(--green)",
      funnyText: "Mario klepie Cię po plecach! 🍄",
    };
  } else {
    // 100% - Mistrz
    resultData = {
      emoji: "👑",
      title: "MISTRZ WIEDZY!",
      message: "PERFEKCYJNY WYNIK!",
      color: "var(--blue)",
      funnyText: "Nawet Bowser Cię szanuje! 🔥",
    };
  }

  gameContent.innerHTML = `
    <div style="text-align: center;">
      <h2 style="font-size: 32px; margin-bottom: 20px;">
        ${resultData.emoji}
      </h2>
      <h2 style="font-size: 20px; color: ${resultData.color}; margin-bottom: 15px;">
        ${resultData.title}
      </h2>
      <p style="font-size: 14px; color: var(--dark-gray); margin-bottom: 10px;">
        ${resultData.message}
      </p>
      <div style="font-size: 48px; font-weight: bold; color: ${resultData.color}; margin: 30px 0 15px 0;">
        ${quizScore}/10
      </div>
      <p style="font-size: 12px; color: var(--gray); margin-bottom: 20px;">
        (${percentage}%)
      </p>
      <p style="font-size: 10px; color: var(--purple); margin-bottom: 30px; font-style: italic;">
        ${resultData.funnyText}
      </p>
      <button class="btn-play" onclick="startQuiz()">ZAGRAJ PONOWNIE</button>
    </div>
  `;

  // Zapisz wynik
  saveScore("quiz_highscore", quizScore);

  // Dodaj do ukończonych gier
  addCompletedGame("quiz");

  // Odblokuj osiągnięcie dla perfekcjonistów
  if (percentage === 100) {
    unlockAchievement("mistrz_wiedzy");
    playWinSound();
  } else {
    playBeep(440, 0.3);
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
