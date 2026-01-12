let quizActive = false;
let selectedCategory = null;

const quizCategories = [
  { id: "pisario", name: "Pisarion3000", icon: "🎮", color: "var(--red)" },
  { id: "nintendo", name: "Nintendo", icon: "🕹️", color: "var(--blue)" },
  { id: "retro", name: "Retro Gierki", icon: "👾", color: "var(--purple)" },
];

const quizQuestions = {
  pisario: [
    {
      question: "O jakiej karierze marzył Michał Pisarski od dziecka?",
      answers: [
        "Chciał zostać piłkarzem",
        "Chciał pisać (o grach, muzyce itd.)",
        "Chciał projektować konsole",
        "Chciał zostać zawodowym streamerem",
      ],
      correct: 1,
    },
    {
      question: "Co najbardziej „kręci” Michała w wyrażaniu myśli?",
      answers: [
        "Pisanie na ekranie w edytorze",
        "Nagrywanie podcastów",
        "Przelewanie myśli na papier / druk",
        "Tylko krótkie posty w social media",
      ],
      correct: 2,
    },
    {
      question:
        "W jakiej serii na swoim kanale Michał opowiadał o mniej znanych konsolach (często będących klapami), co zainspirowało temat książki?",
      answers: [
        "Niedzielny Live",
        "TechTygodnik",
        "Gameplay Bez Cięć",
        "RetroTydzień",
      ],
      correct: 3,
    },
    {
      question:
        "W którym roku zaczął zbierać materiały do książki już z intencją ich wykorzystania?",
      answers: ["2022", "2018", "2020", "2024"],
      correct: 0,
    },
    {
      question:
        "Ile (mniej więcej) treści książki powstało w ostatnich dwóch tygodniach przed terminem oddania tekstu?",
      answers: ["Około 10%", "Około 40%", "Około 70%", "Prawie 100%"],
      correct: 1,
    },
    {
      question:
        "Jaka forma rozdziałów najbardziej odpowiadała Michałowi w „Przegranych”?",
      answers: [
        "Same suche daty i tabelki",
        "Wyłącznie opowiadanie fabularne",
        "Najpierw luźny felieton, potem konkrety",
        "Tylko wywiady z twórcami",
      ],
      correct: 2,
    },
    {
      question: "Dlaczego Michał chciał iść w self-publishing?",
      answers: [
        "Bo nie mógł znaleźć drukarni",
        "Bo bał się krytyki",
        "Bo nie miał pomysłu na okładkę",
        "Bo woli tworzyć i pisać niż prowadzić biznes/dystrybucję",
      ],
      correct: 3,
    },
    {
      question:
        "Które wydawnictwo samo się do niego zgłosiło z propozycją współpracy?",
      answers: ["Znak Horyzont", "Gamebook", "Open Beta", "APN Promise"],
      correct: 0,
    },
    {
      question:
        "Co dało Michałowi najwięcej stresu tuż przed wysłaniem książki do druku?",
      answers: [
        "Zmiana tytułu w ostatniej chwili",
        "Przeróbka rozdziału o Virtual Boyu tuż przed drukiem",
        "Problemy z ilustracjami",
        "Zgubienie notatek",
      ],
      correct: 1,
    },
    {
      question: "Który zestaw to patronaty medialne?",
      answers: [
        "Polygon, IGN, Eurogamer",
        "TVN, Polsat, Radio ZET",
        "CD-Action, PSX Extreme, ARHN.EU",
        "Netflix, HBO, Disney+",
      ],
      correct: 2,
    },
    {
      question: "Gdzie lubi czytać opinie o książce?",
      answers: [
        "Tylko na TikToku",
        "Na LinkedInie i Slacku",
        "Wyłącznie w komentarzach YouTube",
        "Na X, Instagramie i LubimyCzytać",
      ],
      correct: 3,
    },
    {
      question: "Jak Michał Pisarski określił swoją miłość do Nintendo?",
      answers: [
        "Jak rodzic kocha swoje dziecko",
        "Jak klient kocha promocje",
        "Jak rywal kibicuje przeciwnikowi",
        "Jak fan ogląda serial",
      ],
      correct: 0,
    },
    {
      question:
        "Którą konsolę uznał za „najlepszą” głównie pod kątem wygody i liczby świetnych gier?",
      answers: ["GameCube", "Pierwszy Switch", "Wii U", "Nintendo 64"],
      correct: 1,
    },
    {
      question: "Którą konsolę wskazałby jako swój nostalgiczny faworyt?",
      answers: ["Switch", "Wii", "GameCube", "SNES"],
      correct: 2,
    },
    {
      question:
        "Jaka gra (z „nowożytnych”) najbardziej na niego wpłynęła i zmieniła podejście do grania?",
      answers: [
        "Super Mario Odyssey",
        "Pokémon Red",
        "Metroid Prime",
        "The Legend of Zelda: Breath of the Wild",
      ],
      correct: 3,
    },
    {
      question: "W jaką grę indie Michał mówił, że się „zakochał”?",
      answers: ["The Messenger", "Hades", "Celeste", "Hollow Knight"],
      correct: 0,
    },
    {
      question:
        "Ile stron ma książka „Przegrani. Legendarne porażki świata gier”?",
      answers: ["320", "380", "420", "512"],
      correct: 1,
    },
    {
      question:
        "Jaka jest data wydania książki „Przegrani. Legendarne porażki świata gier”?",
      answers: ["2024-12-13", "2025-12-13", "2025-10-19", "2025-01-07"],
      correct: 2,
    },
    {
      question:
        "Jak brzmi hasło z opisu kanału Michał Pisarski Tech na YouTube?",
      answers: [
        "Kanał wyłącznie o piłce nożnej",
        "Tylko recenzje smartfonów",
        "Wyłącznie poradniki programistyczne",
        "„Wyjątkowe gadżety, wyjątkowe gry – omawiane na luzie.”",
      ],
      correct: 3,
    },
    {
      question: "Kiedy kanał Michał Pisarski Tech dołączył do YouTube?",
      answers: [
        "9 lipca 2017",
        "9 lipca 2016",
        "7 stycznia 2018",
        "1 marca 2017",
      ],
      correct: 0,
    },
    {
      question: "Ile filmów ma kanał Michał Pisarski Tech (około)?",
      answers: ["1 000+", "1 100+", "700+", "800+"],
      correct: 1,
    },
    {
      question: "Ile wyświetleń (około) ma kanał Michał Pisarski Tech ?",
      answers: ["45 000 000", "60 000 000", "85 000 000", "100 000 000"],
      correct: 2,
    },
    {
      question: "Jaki jest oficjalny handle kanału na YouTube?",
      answers: [
        "@PisarskiTech",
        "@MichalPisarski",
        "@Pisarion3000",
        "@MichaPisarskiTech",
      ],
      correct: 3,
    },
    {
      question: "Jak brzmi slogan/opis kanału widoczny na stronie kanału?",
      answers: [
        "Wyjątkowe gadżety, wyjątkowe gry – omawiane na luzie.",
        "Technologia tylko dla profesjonalistów",
        "Codziennie newsy o kryptowalutach",
        "Wyłącznie recenzje gier RPG",
      ],
      correct: 0,
    },
    {
      question:
        "Jak nazywa się film, w którym Michał świętuje 200 000 subskrypcji i ogłasza Q&A/megakonkurs?",
      answers: [
        "200K SUBÓW! DZIĘKI!",
        "Zdradzam moje tajemnice | Największy KONKURS W HISTORII",
        "Q&A: Pytania i odpowiedzi #1",
        "Najlepsze gry 2025",
      ],
      correct: 1,
    },
  ],

  nintendo: [
    {
      question: "W jakim roku wydano konsolę Famicom (NES) w Japonii?",
      answers: ["1983", "1981", "1985", "1987"],
      correct: 0,
    },
    {
      question: "Jak nazywa się główny bohater serii The Legend of Zelda?",
      answers: ["Zelda", "Link", "Ganon", "Epona"],
      correct: 1,
    },
    {
      question: "Ile światów ma podstawowa gra Super Mario Bros. na NES?",
      answers: ["10 światów", "12 światów", "8 światów", "16 światów"],
      correct: 2,
    },
    {
      question: "W jakim roku zadebiutował Game Boy?",
      answers: ["1987", "1991", "1993", "1989"],
      correct: 3,
    },
    {
      question:
        "Jak nazywa się wróg Mario, który wygląda jak brązowy grzybek z nogami?",
      answers: ["Goomba", "Koopa", "Boo", "Lakitu"],
      correct: 0,
    },
    {
      question: "W jakim roku wydano Super Famicom (SNES) w Japonii?",
      answers: ["1989", "1990", "1991", "1993"],
      correct: 1,
    },
    {
      question: "Jakiego nośnika używało Nintendo 64 dla gier?",
      answers: ["Płyt CD", "Dyskietek", "Kartridży", "DVD"],
      correct: 2,
    },
    {
      question: "W jakim roku zadebiutował Nintendo GameCube?",
      answers: ["1999", "2000", "2003", "2001"],
      correct: 3,
    },
    {
      question: "W jakim roku zadebiutowała konsola Nintendo Wii?",
      answers: ["2006", "2004", "2005", "2008"],
      correct: 0,
    },
    {
      question: "W jakim roku zadebiutowała konsola Wii U?",
      answers: ["2010", "2012", "2011", "2013"],
      correct: 1,
    },
    {
      question: "W jakim roku miała premierę konsola Nintendo Switch?",
      answers: ["2015", "2016", "2017", "2018"],
      correct: 2,
    },
    {
      question:
        "Która przenośna konsola Nintendo jako kluczową cechę miała dwa ekrany?",
      answers: ["Game Boy Advance", "PSP", "Game Gear", "Nintendo DS"],
      correct: 3,
    },
    {
      question: "Co było największą „sztuczką” Nintendo 3DS?",
      answers: [
        "3D bez okularów",
        "Ekran dotykowy",
        "Wbudowany modem 5G",
        "Gry na płytach",
      ],
      correct: 0,
    },
    {
      question:
        "W jakim roku w Japonii ukazały się pierwsze gry Pokémon (Red/Green)?",
      answers: ["1994", "1996", "1998", "2000"],
      correct: 1,
    },
    {
      question: "Jaki Pokémon jest najbardziej znaną maskotką serii?",
      answers: ["Eevee", "Charizard", "Pikachu", "Mewtwo"],
      correct: 2,
    },
    {
      question:
        "W jakim roku ukazała się pierwsza gra The Legend of Zelda (w Japonii)?",
      answers: ["1984", "1988", "1990", "1986"],
      correct: 3,
    },
    {
      question: "Jak nazywa się bohaterka serii Metroid?",
      answers: ["Samus Aran", "Zelda", "Peach", "Pauline"],
      correct: 0,
    },
    {
      question: "Które studio stworzyło serię Kirby?",
      answers: ["Square", "HAL Laboratory", "Capcom", "Rare"],
      correct: 1,
    },
    {
      question: "Jak nazywa się brat Mario?",
      answers: ["Wario", "Toad", "Luigi", "Yoshi"],
      correct: 2,
    },
    {
      question:
        "W jakim roku ukazała się arcade’owa gra Donkey Kong (debiut Mario jako Jumpman)?",
      answers: ["1979", "1983", "1985", "1981"],
      correct: 3,
    },
    {
      question:
        "Na jakiej konsoli zadebiutowało Super Smash Bros. (pierwsza część serii)?",
      answers: ["Nintendo 64", "SNES", "GameCube", "Wii"],
      correct: 0,
    },
    {
      question:
        "Na jakiej platformie zadebiutowała seria Animal Crossing w Japonii (Animal Forest)?",
      answers: ["Game Boy Advance", "Nintendo 64", "Nintendo DS", "Wii"],
      correct: 1,
    },
    {
      question: "W jakim roku zadebiutowało Splatoon?",
      answers: ["2013", "2014", "2015", "2016"],
      correct: 2,
    },
    {
      question: "Jaka była pierwsza gra z serii Mario Kart?",
      answers: [
        "Mario Kart 64",
        "Mario Kart: Double Dash!!",
        "Mario Kart Wii",
        "Super Mario Kart",
      ],
      correct: 3,
    },
    {
      question: "W jakim roku założono firmę Nintendo?",
      answers: ["1889", "1901", "1935", "1977"],
      correct: 0,
    },
    {
      question:
        "W jakim roku Nintendo wystartowało z prezentacjami Nintendo Direct?",
      answers: ["2008", "2011", "2009", "2013"],
      correct: 1,
    },
    {
      question:
        "Która gra była tytułem startowym na Switcha (i jednocześnie wyszła na Wii U) w 2017 roku?",
      answers: [
        "Super Mario Odyssey",
        "Splatoon 2",
        "The Legend of Zelda: Breath of the Wild",
        "Animal Crossing: New Horizons",
      ],
      correct: 2,
    },
    {
      question: "W jakim roku zadebiutowały prezentacje Pokémon Presents?",
      answers: ["2016", "2018", "2022", "2020"],
      correct: 3,
    },
    {
      question:
        "W jakim roku Nintendo po raz pierwszy publicznie wspomniało o projekcie konsoli pod kryptonimem „NX”?",
      answers: ["2015", "2013", "2014", "2016"],
      correct: 0,
    },
    {
      question:
        "Która konsola Nintendo najbardziej kojarzy się z kontrolerami ruchowymi?",
      answers: ["GameCube", "Wii", "Nintendo 64", "Wii U"],
      correct: 1,
    },
  ],

  retro: [
    {
      question: "W jakim roku wydano konsolę Atari 2600?",
      answers: ["1975", "1979", "1977", "1981"],
      correct: 2,
    },
    {
      question: "Która konsola była znana jako Sega Mega Drive w Europie?",
      answers: [
        "Sega Saturn",
        "Sega Dreamcast",
        "Sega Master System",
        "Sega Genesis",
      ],
      correct: 3,
    },
    {
      question:
        "Jaki nośnik wykorzystywał Commodore 64 do uruchamiania gier (najczęściej)?",
      answers: [
        "Płyty CD",
        "Kasety magnetofonowe",
        "Kartridże wyłącznie",
        "Blu-ray",
      ],
      correct: 1,
    },
    {
      question: "Która firma stworzyła konsolę PlayStation (PS1)?",
      answers: ["Sony", "Sega", "Atari", "NEC"],
      correct: 0,
    },
    {
      question:
        "W jakim roku zadebiutowała konsola PlayStation (PS1) w Japonii?",
      answers: ["1992", "1996", "1998", "1994"],
      correct: 3,
    },
    {
      question:
        "Jaka gra jest uznawana za symbol gatunku survival horror na PS1?",
      answers: ["Crash Bandicoot", "Ridge Racer", "Resident Evil", "WipEout"],
      correct: 2,
    },
    {
      question:
        "Która platforma jako jedna z pierwszych mocno stawiała na gry na płytach CD pod koniec lat 80.?",
      answers: [
        "TurboGrafx-CD / PC Engine CD",
        "Atari 7800",
        "ColecoVision",
        "Intellivision",
      ],
      correct: 0,
    },
    {
      question: "Jak nazywa się niebieski jeż – maskotka Segi?",
      answers: ["Alex Kidd", "Sonic", "Sparkster", "Ristar"],
      correct: 1,
    },
    {
      question: "W jakim roku zadebiutowała konsola Sega Dreamcast?",
      answers: ["1999", "1996", "1998", "2001"],
      correct: 0,
    },
    {
      question: "Jaka gra spopularyzowała gatunek FPS na PC w latach 90.?",
      answers: ["SimCity", "Lemmings", "Prince of Persia", "Doom"],
      correct: 3,
    },
    {
      question: "Która gra zasłynęła powiedzonkiem „Finish Him!”?",
      answers: [
        "Street Fighter II",
        "Tekken 3",
        "Mortal Kombat",
        "Soulcalibur",
      ],
      correct: 2,
    },
    {
      question:
        "Na jakiej platformie pierwotnie powstał Tetris (pierwsza wersja)?",
      answers: [
        "Arcade",
        "Komputery Elektronika 60",
        "Atari 2600",
        "Amiga 500",
      ],
      correct: 1,
    },
    {
      question: "Jak nazywa się twórca serii Metal Gear?",
      answers: [
        "Hideo Kojima",
        "Shigeru Miyamoto",
        "Yu Suzuki",
        "John Carmack",
      ],
      correct: 0,
    },
    {
      question:
        "Która platforma z połowy lat 90. była konsolą domową opartą o płyty CD?",
      answers: ["Atari Lynx", "Neo Geo Pocket", "3DO", "Game Gear"],
      correct: 2,
    },
    {
      question:
        "Jak nazywa się gra logiczna 3D z 1989 r. (opadające klocki w przestrzeni), często porównywana do Tetrisa?",
      answers: ["Blockout", "Columns", "Puyo Puyo", "Dr. Mario"],
      correct: 0,
    },
    {
      question:
        "Która konsola słynęła z bardzo drogich kartridży arcade i hasła o „mocy”?",
      answers: [
        "Sega Master System",
        "Atari Jaguar",
        "Philips CD-i",
        "Neo Geo AES",
      ],
      correct: 3,
    },
    {
      question:
        "Jak nazywa się platformówka z 1994 r., w której sterujesz dżdżownicą w skafandrze?",
      answers: ["Jazz Jackrabbit", "Earthworm Jim", "Rayman", "Commander Keen"],
      correct: 1,
    },
    {
      question:
        "Który komputer domowy był popularny w Europie i kojarzy się z gumową klawiaturą wczesnych modeli?",
      answers: ["Apple II", "IBM PC", "ZX Spectrum", "Atari ST"],
      correct: 2,
    },
    {
      question:
        "Jaki był główny nośnik gier na Atari ST i Amidze (często w latach 80.)?",
      answers: ["Dyskietki", "Kartridże", "Płyty CD", "Kasety VHS"],
      correct: 0,
    },
    {
      question:
        "Która przenośna konsola z początku lat 90. była kolorowa i miała duży ekran?",
      answers: ["PSP", "Wonderswan", "Playdate", "Atari Lynx"],
      correct: 3,
    },
    {
      question:
        "Jaka gra wyścigowa na PC z 1998 roku kojarzy się z pościgami policji?",
      answers: [
        "Gran Turismo",
        "The Need for Speed",
        "Need for Speed III: Hot Pursuit",
        "Re-Volt",
      ],
      correct: 2,
    },
    {
      question: "Która seria bijatyk zasłynęła postaciami Ryu i Ken?",
      answers: [
        "Street Fighter",
        "Fatal Fury",
        "Virtua Fighter",
        "Killer Instinct",
      ],
      correct: 0,
    },
    {
      question: "Jaka była pierwsza domowa konsola firmy Microsoft?",
      answers: ["MSX", "Xbox", "Xbox 360", "Zune"],
      correct: 1,
    },
    {
      question: "W jakim roku zadebiutował pierwszy Xbox?",
      answers: ["1999", "2003", "2001", "2005"],
      correct: 2,
    },
    {
      question:
        "Jak nazywa się gra z 1990 r. z rotoskopowaną animacją, w której sterujesz księciem w pułapkach?",
      answers: [
        "Flashback",
        "Another World",
        "Heart of the Alien",
        "Prince of Persia",
      ],
      correct: 3,
    },
    {
      question: "Która konsola była ostatnią domową konsolą Segi?",
      answers: ["Saturn", "Master System", "Dreamcast", "Genesis"],
      correct: 2,
    },
    {
      question:
        "Jaka gra RPG na PS1 z 1997 r. mocno spopularyzowała jRPG na Zachodzie?",
      answers: [
        "Chrono Trigger",
        "Suikoden",
        "Secret of Mana",
        "Final Fantasy VII",
      ],
      correct: 3,
    },
    {
      question:
        "Która seria strategiczna na PC zaczęła się od walk ludzi z kosmitami w 1994 r.?",
      answers: ["Warcraft", "X-COM", "Civilization", "Command & Conquer"],
      correct: 1,
    },
    {
      question: "Jaki tytuł RTS z 1995 r. kojarzy się z frakcjami GDI i Nod?",
      answers: [
        "Command & Conquer",
        "Warcraft II",
        "StarCraft",
        "Age of Empires",
      ],
      correct: 0,
    },
    {
      question:
        "Jak nazywa się kultowa gra przygodowa z piratami i bohaterem Guybrush Threepwood?",
      answers: [
        "Grim Fandango",
        "The Secret of Monkey Island",
        "Day of the Tentacle",
        "Full Throttle",
      ],
      correct: 1,
    },
    {
      question: "Która konsola korzystała z nośnika UMD?",
      answers: ["PS Vita", "Neo Geo Pocket", "GP32", "PSP"],
      correct: 3,
    },
    {
      question:
        "Jaka seria gier wyścigowych zasłynęła realistycznym podejściem na konsolach Sony od 1997 roku?",
      answers: ["Ridge Racer", "Burnout", "Gran Turismo", "OutRun"],
      correct: 2,
    },
    {
      question:
        "Jak nazywa się gra arcade, w której żaba próbuje przejść przez ulicę i rzekę?",
      answers: ["Frogger", "Q*bert", "Dig Dug", "Galaga"],
      correct: 0,
    },
    {
      question:
        "Która gra z 1980 roku polega na jedzeniu kropek w labiryncie i uciekaniu przed duchami?",
      answers: ["Space Invaders", "Pac-Man", "Asteroids", "Centipede"],
      correct: 1,
    },
    {
      question:
        "Jak nazywa się klasyczna strzelanka z 1978 roku z falami kosmitów?",
      answers: ["Defender", "Space Invaders", "Robotron: 2084", "Tempest"],
      correct: 1,
    },
  ],
};

let currentQuestions = [];
let currentQuestionIndex = 0;
let quizScore = 0;

function startQuiz() {
  showQuizStory();
}

function showQuizStory() {
  const gameContent = document.getElementById("game-content");
  gameContent.innerHTML = `
    <div style="
      max-width: 600px;
      margin: 0 auto;
      padding: 30px;
      text-align: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border: 4px solid var(--purple);
      border-radius: 15px;
    ">
      <h2 style="
        font-size: 24px;
        color: var(--purple);
        margin-bottom: 30px;
        text-shadow: 2px 2px 0 #000;
      ">🧠 TEST WIEDZY PISARIO 🧠</h2>
      
      <div style="
        background: rgba(0,0,0,0.4);
        padding: 25px;
        border-radius: 10px;
        margin-bottom: 25px;
        border: 2px solid var(--yellow);
      ">
        <p style="
          font-size: 13px;
          line-height: 1.8;
          color: var(--yellow);
          margin-bottom: 20px;
          font-weight: bold;
        ">
          🎯 NIE BĄDŹ GOOMBA,<br/>BĄDŹ JAK PISARIO!
        </p>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--white);
          margin-bottom: 15px;
        ">
          😈 Źli ludzie chcą nam utrudnić<br/>przyjemność z grania!
        </p>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--white);
          margin-bottom: 15px;
        ">
          🌍 To Twój test wiedzy, żeby sprawdzić,<br/>czy jesteś w stanie<br/><span style="color: var(--green); font-weight: bold;">OCHRONIĆ ZIEMIĘ</span><br/>przed tymi złoczyńcami!
        </p>
        
        <p style="
          font-size: 11px;
          line-height: 1.8;
          color: var(--yellow);
          font-weight: bold;
        ">
          🦸 Udowodnij, że zasługujesz<br/>na polskie napisy w grach!
        </p>
      </div>
      
      <div style="
        background: rgba(147, 51, 234, 0.2);
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 25px;
        border: 2px solid var(--purple);
      ">
        <p style="
          font-size: 9px;
          color: var(--purple);
          margin-bottom: 8px;
        ">
          📚 ZASADY 📚
        </p>
        <p style="
          font-size: 9px;
          color: var(--white);
          line-height: 1.6;
        ">
          Wybierz kategorię i odpowiedz<br/>
          na pytania o grach i Nintendo!<br/>
          Pokaż swoją wiedzę!
        </p>
      </div>
      
      <button id="quiz-story-start-btn" style="
        font-family: 'Press Start 2P', cursive;
        font-size: 14px;
        padding: 15px 40px;
        background: var(--purple);
        color: var(--white);
        border: 4px solid var(--dark-gray);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 6px 0 #5b21b6;
      "
      onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 0 #5b21b6'"
      onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 0 #5b21b6'"
      onmousedown="this.style.transform='translateY(4px)'; this.style.boxShadow='0 2px 0 #5b21b6'"
      onmouseup="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 0 #5b21b6'"
      >
        ROZPOCZNIJ TEST!
      </button>
    </div>
  `;

  document
    .getElementById("quiz-story-start-btn")
    .addEventListener("click", () => {
      quizActive = false;
      selectedCategory = null;
      document.getElementById("game-title").textContent = "PISARIO QUIZ";
      document.getElementById("game-score").textContent = "WYBIERZ KATEGORIĘ";
      showCategorySelection();
    });
}

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
              ${quizQuestions[cat.id].length} pytań
            </p>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;

  const choices = gameContent.querySelectorAll(".category-choice");
  choices.forEach((choice) => {
    const categoryId = choice.getAttribute("data-category");
    const category = quizCategories.find((c) => c.id === categoryId);

    choice.addEventListener("click", function () {
      selectedCategory = categoryId;
      startQuizGame();
      playBeep(660, 0.1);
    });

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

function startQuizGame() {
  quizActive = true;

  incrementGamePlayed("Quiz");

  const categoryQuestions = quizQuestions[selectedCategory] || [];

  if (categoryQuestions.length < 10) {
    currentQuestions = shuffleArray(categoryQuestions);
  } else {
    currentQuestions = shuffleArray(categoryQuestions).slice(0, 10);
  }

  currentQuestionIndex = 0;
  quizScore = 0;

  updateQuizScore();

  showQuestion();
}

function showQuestion() {
  const gameContent = document.getElementById("game-content");

  if (currentQuestionIndex >= currentQuestions.length) {
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

  const answerButtons = gameContent.querySelectorAll(".quiz-answer-btn");
  answerButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const selectedIndex = parseInt(this.getAttribute("data-index"));
      checkAnswer(selectedIndex);
    });
  });

  addQuizStyles();
}

function checkAnswer(selectedIndex) {
  if (!quizActive) return;

  const q = currentQuestions[currentQuestionIndex];
  const answerButtons = document.querySelectorAll(".quiz-answer-btn");

  answerButtons.forEach((btn) => {
    btn.style.pointerEvents = "none";
  });

  answerButtons[q.correct].style.background = "var(--green)";
  answerButtons[q.correct].style.borderColor = "var(--green)";
  answerButtons[q.correct].style.color = "var(--white)";

  if (selectedIndex === q.correct) {
    quizScore++;
    playBeep(660, 0.15);
  } else {
    answerButtons[selectedIndex].style.background = "var(--red)";
    answerButtons[selectedIndex].style.borderColor = "var(--red)";
    answerButtons[selectedIndex].style.color = "var(--white)";
    playBeep(220, 0.15);
  }

  updateQuizScore();

  setTimeout(() => {
    currentQuestionIndex++;
    showQuestion();
  }, 1500);
}

function updateQuizScore() {
  document.getElementById("game-score").textContent = quizScore + " / 10";
}

function endQuiz() {
  quizActive = false;
  const gameContent = document.getElementById("game-content");

  const percentage = (quizScore / 10) * 100;

  // Zapisz wynik zawsze
  saveBestScore("quiz_highscore", quizScore, false);

  if (percentage >= 70) {
    incrementGameWon();
  } else {
    incrementGameLost();
  }

  let resultData = {};

  if (percentage < 30) {
    resultData = {
      emoji: "💀",
      title: "NIE POSZŁO...",
      message: "Może spróbuj jeszcze raz? 🤔",
      color: "var(--red)",
      funnyText: "Nawet Goomba wiedziałby więcej!",
    };
  } else if (percentage < 60) {
    resultData = {
      emoji: "😅",
      title: "NIEŹLE!",
      message: "Ale jest jeszcze nad czym pracować!",
      color: "var(--yellow)",
      funnyText: "Luigi byłby dumny (ale tylko trochę)",
    };
  } else if (percentage < 100) {
    resultData = {
      emoji: "⭐",
      title: "SUPER!",
      message: "Świetna robota!",
      color: "var(--green)",
      funnyText: "Mario klepie Cię po plecach! 🍄",
    };
  } else {
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

  addCompletedGame("quiz");

  addCoins(10);
  showToast("+10 🪙 za ukończenie Quiz!");

  if (percentage === 100) {
    unlockAchievement("mistrz_wiedzy");
    playWinSound();
  } else {
    playBeep(440, 0.3);
  }
}

function stopQuiz() {
  quizActive = false;
}

function addQuizStyles() {
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
