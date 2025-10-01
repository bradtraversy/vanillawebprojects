const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');
const figureParts = document.querySelectorAll('.figure-part');

const timeElem = document.getElementById('time'); // timer element
let timerInterval = null;
const timePerGuess = 10; // seconds allowed per guess

const words = ['application', 'programming', 'interface', 'wizard', 'developer', 'hangman'];
let selectedWord = words[Math.floor(Math.random() * words.length)];

const correctLetters = [];
const wrongLetters = [];

// ---------------- TIMER FUNCTIONS ----------------
function startTimer() {
  let timeLeft = timePerGuess;
  timeElem.textContent = timeLeft;

  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    timeLeft--;
    timeElem.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      onTimerExpire();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function onTimerExpire() {
  // Time’s up = count as wrong guess
  wrongLetters.push('*'); // placeholder wrong guess
  updateWrongLettersEl();

  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = '😢 You lost! Time ran out ⏳';
    popup.style.display = 'flex';
    stopTimer();
  } else {
    startTimer();
  }
}

// ---------------- GAME FUNCTIONS ----------------
function displayWord() {
  wordEl.innerHTML = `
    ${selectedWord
      .split('')
      .map(
        letter => `
          <span class="letter">
            ${correctLetters.includes(letter) ? letter : ''}
          </span>
        `
      )
      .join('')}
  `;

  const innerWord = wordEl.innerText.replace(/\n/g, '');
  if (innerWord === selectedWord) {
    finalMessage.innerText = '🎉 Congratulations! You won!';
    popup.style.display = 'flex';
    stopTimer();
  }
}

function updateWrongLettersEl() {
  // Display wrong letters
  wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? '<p>Wrong</p>' : ''}
    ${wrongLetters.map(letter => `<span>${letter}</span>`)}
  `;

  // Display parts
  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;
    if (index < errors) {
      part.style.display = 'block';
    } else {
      part.style.display = 'none';
    }
  });

  // Check if lost
  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = '😢 Unfortunately you lost!';
    popup.style.display = 'flex';
    stopTimer();
  }
}

function showNotification() {
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}

// ---------------- EVENT LISTENERS ----------------
window.addEventListener('keydown', e => {
  if (popup.style.display === 'flex') return; // stop if game ended

  // Stop old timer when a guess is made
  stopTimer();

  if (e.keyCode >= 65 && e.keyCode <= 90) {
    const letter = e.key.toLowerCase();

    if (selectedWord.includes(letter)) {
      if (!correctLetters.includes(letter)) {
        correctLetters.push(letter);
        displayWord();
      } else {
        showNotification();
      }
    } else {
      if (!wrongLetters.includes(letter)) {
        wrongLetters.push(letter);
        updateWrongLettersEl();
      } else {
        showNotification();
      }
    }
  }

  // Restart timer after each guess
  if (popup.style.display !== 'flex') {
    startTimer();
  }
});

playAgainBtn.addEventListener('click', () => {
  // Empty arrays
  correctLetters.splice(0);
  wrongLetters.splice(0);

  selectedWord = words[Math.floor(Math.random() * words.length)];

  displayWord();
  updateWrongLettersEl();
  popup.style.display = 'none';

  // Restart timer
  startTimer();
});

// ---------------- INIT ----------------
displayWord();
startTimer();
