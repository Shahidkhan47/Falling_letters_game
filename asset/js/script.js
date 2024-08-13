const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

//function for creating and selecting tags
const createAndSelect = (type, value) => document[type](value);

//function for append and remove child
const appendAndRemove = (parent, method, child) => parent[method](child);

//selecting some of html tags
const gameContainer = createAndSelect("querySelector", ".game-container");
const gameOverText = createAndSelect("querySelector", "#gameOver");
const scoreElement = createAndSelect("querySelector", "#score");
const showMissedLetters = createAndSelect("querySelector", "missing-letters");
const playAgainBtn = createAndSelect("querySelector", "#play-again");
const scoreDiv = createAndSelect("querySelector", ".game-score");
const highScoreTag = createAndSelect("querySelector", "#highScore");
const rules = createAndSelect("querySelector", "#rules");
const lifeLineDiv = createAndSelect("querySelector", ".lifeLine");
const lifeLineValue = createAndSelect("querySelector", "#lifeLineValue");

//To set background image
document.body.style.backgroundImage = "url(asset/images/background.jpeg)";
gameContainer.style.backgroundImage = "url(asset/images/boxBackground.jpeg)";

// Variables
let score = 0;
let gameIsOver = false;
let fallingLetters = [];
let lifeLines = 5;
let letterCaught;
let highScore = localStorage.getItem("highScore") || 0;
const negativeScorePenalty = 0.5;
playAgainBtn.style.display = "none";
let speedIncrease = 0.5;

//for showing rules to user
rules.innerHTML = `<strong>Rules For the game :-<br><strong>1. Score will increase by 1 on correct typed letter.</strong> <br> <strong>2. On wrong input,Score will deduct by 0.5.</strong> <br> <strong>3.After 5 missed letters game will be over. </strong>`;

// Function to get a random letter
function getRandomLetter() {
  const randomIndex = Math.floor(Math.random() * letters.length);
  return letters[randomIndex];
}

// Function to create a falling letter
function createFallingLetter() {
  const letter = getRandomLetter();
  const leftPosition = Math.floor(
    Math.random() * (gameContainer.clientWidth - 30)
  );
  const fallingLetterElement = createAndSelect("createElement", "div");
  fallingLetterElement.className = "falling-letter";
  fallingLetterElement.textContent = letter;
  fallingLetterElement.style.left = leftPosition + "px";
  appendAndRemove(gameContainer, "appendChild", fallingLetterElement);
  fallingLetters.push({ element: fallingLetterElement, letter, top: 0 });
}

// Function to move the falling letters
function moveFallingLetters() {
  if (gameIsOver) {
    return;
  }
  audio.play();
  fallingLetters.forEach((fallingLetter, index) => {
    fallingLetter.top += 2 * speedIncrease;
    fallingLetter.element.style.top = fallingLetter.top + "px";
// Check if the letter reaches the bottom
    if (fallingLetter.top >= gameContainer.clientHeight - 40) {
      appendAndRemove(gameContainer, "removeChild", fallingLetter.element);
      fallingLetters.splice(index, 1);
      lifeLines--;
      lifeLineValue.textContent = lifeLines;
      if (lifeLines <= 2) {
        lifeLineDiv.style.color = "red";
      }
      if (lifeLines <= 0) {
        gameOver();
        audio.pause();
      }
    }
  });

// Create a new falling letter every second
  if (Math.random() <= 0.02) createFallingLetter();
}

lifeLineValue.textContent = lifeLines;

// Function to handle key presses
function handleKeyPress(event) {
  if (gameIsOver) {
    return;
  }
  const typedLetter = event.key.toUpperCase();
  letterCaught = false;
  fallingLetters.forEach((fallingLetter, index) => {
    if (typedLetter === fallingLetter.letter) {
      score++;
      letterCaught = true;
      scoreElement.textContent = score;
      appendAndRemove(gameContainer, "removeChild", fallingLetter.element);
      fallingLetters.splice(index, 1);
    }
  });

  if (!letterCaught) {
    score -= negativeScorePenalty;
    scoreElement.textContent = score;
  }

  switch (true) {
    case score >= 10 && score <= 20:
      speedIncrease = 1.0;
      break;
    case score >= 21 && score <= 40:
      speedIncrease = 1.5;
      break;
    case score >= 25 && score <= 40:
      speedIncrease = 2.0;
      break;
    case score >= 41 && score <= 60:
      speedIncrease = 2.5;
      break;
    case score >= 61:
      speedIncrease = 3.0;
      break;
  }
}

// Function to end the game
function gameOver() {
  gameIsOver = true;
  gameOverText.style.display = "block";
  const p = createAndSelect("createElement", "p");
  appendAndRemove(gameContainer, "appendChild", p);
  p.className = "show-Result";
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
  p.innerHTML = `<strong> Your Final Score Is : ${score}</strong> <br> <strong> High Score Is: ${highScore}</strong>`;
  clearInterval(gameLoop);
  playAgainBtn.style.display = "block";
  scoreDiv.style.display = "none";
  lifeLineDiv.style.display = "none";

  fallingLetters.forEach((fallingLetter) => {
    const existingElements = fallingLetter.element;
    existingElements.style.display = "none";
  });
  setTimeout(() => music.play(),30000)
}

// Event listener for key presses
document.addEventListener("keydown", handleKeyPress);

// Start the game loop
const gameLoop = setInterval(moveFallingLetters, 1000 / 20);
