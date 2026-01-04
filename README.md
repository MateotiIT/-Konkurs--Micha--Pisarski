# PISARSKI FANART ARCADE

Strona konkursowa stworzona na konkurs fanartowy Michała Pisarskiego.  
Retro Nintendo vibe z 5 mini-grami inspirowanymi klasykami!

## 🎮 Gry

1. **PISARIO QUIZ** - Milionerzy z pytaniami o Michale Pisarskim i Nintendo
2. **PISAREK PUZZLE** - Sliding Puzzle 3×3
3. **PISACMAN** - Klasyczny Pacman z duchami
4. **SUPER PISARIO** - Platformówka w stylu Mario
5. **PISARIS** - Tetris

## 🏆 System Osiągnięć

12 osiągnięć do odblokowania, każde daje dostęp do fanarta!

## 🛠️ Stack Techniczny

- **HTML5** - struktura
- **CSS3** - style retro Nintendo, pixel font
- **Vanilla JavaScript** - logika gier
- **localStorage** - zapis progresu i osiągnięć
- **Canvas API** - gry akcji (Pacman, Mario)
- **Web Audio API** - proste dźwięki retro

## 📂 Struktura Projektu

```
index.html          → główna strona
style.css           → style retro Nintendo
/js
  ├─ app.js         → nawigacja, menu
  ├─ storage.js     → localStorage
  ├─ achievements.js → system osiągnięć
  ├─ utils.js       → helpers (beepy, toast)
  └─ /games
      ├─ quiz.js
      ├─ puzzle.js
      ├─ pacman.js
      ├─ mario.js
      └─ tetris.js
/assets/fanart      → placeholdery fanartów
```

## 🚀 Uruchomienie

1. Otwórz `index.html` w przeglądarce
2. Lub użyj Live Server w VS Code

Brak buildu, brak dependencies - po prostu działa!

## ✨ Funkcje

- ✅ 5 grywalnych mini-gier
- ✅ System osiągnięć z localStorage
- ✅ Galeria fanartów (odblokowanie przez osiągnięcia)
- ✅ Retro dźwięki (Web Audio API)
- ✅ Responsywny design
- ✅ Pixel art style
- 🔜 Easter eggi (planowane)

## 📝 TODO

- [ ] Dodać 90-140 więcej pytań do quizu
- [ ] Dodać easter eggi (Konami Code, ukryte przyciski)
- [ ] Zamienić placeholdery SVG na prawdziwe fanarty JPG
- [ ] Dopracować balance gier
- [ ] Dodać więcej poziomów (opcjonalnie)

## 👨‍💻 Autor

**Mateusz**  
Styczeń 2026  
Konkurs Fanartowy - Michał Pisarski

---

**Specjalne podziękowania dla Michała Pisarskiego za inspirację!** 🎮
