// Game State
let currentScreen = "main-menu";
let gameScores = JSON.parse(localStorage.getItem("gameScores") || "[]");

// Game Data
const triviaQuestions = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correct: 2,
    category: "Geography",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: 1,
    category: "Science",
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Van Gogh", "Picasso", "Leonardo da Vinci", "Michelangelo"],
    correct: 2,
    category: "Art",
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correct: 1,
    category: "Nature",
  },
  {
    question: "In which year did World War II end?",
    options: ["1944", "1945", "1946", "1947"],
    correct: 1,
    category: "History",
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correct: 2,
    category: "Science",
  },
  {
    question: "Which country is home to the kangaroo?",
    options: ["New Zealand", "Australia", "South Africa", "Brazil"],
    correct: 1,
    category: "Geography",
  },
  {
    question: "What is the fastest land animal?",
    options: ["Lion", "Cheetah", "Leopard", "Tiger"],
    correct: 1,
    category: "Nature",
  },
];

const memoryEmojis = ["🎮", "🎯", "🎲", "🎪", "🎨", "🎭", "🎸", "🎺"];

// Game Variables
let memoryGame = {
  cards: [],
  flippedCards: [],
  matches: 0,
  moves: 0,
  startTime: null,
};

let triviaGame = {
  questions: [],
  currentQuestion: 0,
  score: 0,
  timeLeft: 30,
  timer: null,
};

let puzzleGame = {
  board: [],
  moves: 0,
  startTime: null,
  timer: null,
};

// Utility Functions
function playSound(frequency, duration, type = "sine") {
  try {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + duration
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    console.log("Audio not supported");
  }
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function saveScore(playerName, score, gameType) {
  const newScore = {
    id: generateId(),
    playerName: playerName.trim(),
    score: score,
    gameType: gameType,
    timestamp: Date.now(),
  };

  gameScores.push(newScore);

  // Keep only top 10 scores per game type
  const gameTypeScores = gameScores.filter((s) => s.gameType === gameType);
  const topScores = gameTypeScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  const otherScores = gameScores.filter((s) => s.gameType !== gameType);

  gameScores = [...otherScores, ...topScores];
  localStorage.setItem("gameScores", JSON.stringify(gameScores));

  updatePlayerCounts();
}

function getTopScores(gameType = null) {
  let scores = gameScores;
  if (gameType) {
    scores = scores.filter((s) => s.gameType === gameType);
  }
  return scores.sort((a, b) => b.score - a.score).slice(0, 10);
}

function updatePlayerCounts() {
  const memoryCount = gameScores.filter((s) => s.gameType === "memory").length;
  const triviaCount = gameScores.filter((s) => s.gameType === "trivia").length;
  const puzzleCount = gameScores.filter((s) => s.gameType === "puzzle").length;

  document.getElementById("memory-players").textContent = memoryCount;
  document.getElementById("trivia-players").textContent = triviaCount;
  document.getElementById("puzzle-players").textContent = puzzleCount;
}

// Screen Management
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });
  document.getElementById(screenId).classList.add("active");
  currentScreen = screenId;
}

function startGame(gameType) {
  showScreen(gameType + "-game");
}

function backToMenu() {
  showScreen("main-menu");

  // Reset games
  if (memoryGame.timer) clearInterval(memoryGame.timer);
  if (triviaGame.timer) clearInterval(triviaGame.timer);
  if (puzzleGame.timer) clearInterval(puzzleGame.timer);
}

// Memory Game
function initMemoryGame() {
  // Reset game state
  memoryGame = {
    cards: [],
    flippedCards: [],
    matches: 0,
    moves: 0,
    startTime: Date.now(),
  };

  // Create card pairs
  const cardEmojis = [...memoryEmojis, ...memoryEmojis];
  memoryGame.cards = shuffleArray(cardEmojis).map((emoji, index) => ({
    id: index,
    emoji: emoji,
    flipped: false,
    matched: false,
  }));

  // Show game board
  document.getElementById("memory-start").style.display = "none";
  document.getElementById("memory-complete").style.display = "none";
  document.getElementById("memory-play").style.display = "block";

  // Update UI
  updateMemoryUI();
  renderMemoryBoard();
}

function renderMemoryBoard() {
  const board = document.getElementById("memory-board");
  board.innerHTML = "";

  memoryGame.cards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.className = "memory-card";
    cardElement.innerHTML = card.flipped || card.matched ? card.emoji : "❓";

    if (card.matched) {
      cardElement.classList.add("matched");
    } else if (card.flipped) {
      cardElement.classList.add("flipped");
    }

    cardElement.addEventListener("click", () => flipMemoryCard(card.id));
    board.appendChild(cardElement);
  });
}

function flipMemoryCard(cardId) {
  const card = memoryGame.cards.find((c) => c.id === cardId);

  if (
    !card ||
    card.flipped ||
    card.matched ||
    memoryGame.flippedCards.length >= 2
  ) {
    return;
  }

  card.flipped = true;
  memoryGame.flippedCards.push(cardId);
  playSound(440, 0.1);

  renderMemoryBoard();

  if (memoryGame.flippedCards.length === 2) {
    setTimeout(checkMemoryMatch, 500);
  }
}

function checkMemoryMatch() {
  const [firstId, secondId] = memoryGame.flippedCards;
  const firstCard = memoryGame.cards.find((c) => c.id === firstId);
  const secondCard = memoryGame.cards.find((c) => c.id === secondId);

  memoryGame.moves++;

  if (firstCard.emoji === secondCard.emoji) {
    // Match found
    firstCard.matched = true;
    secondCard.matched = true;
    memoryGame.matches++;
    playSound(660, 0.3);

    if (memoryGame.matches === memoryEmojis.length) {
      setTimeout(completeMemoryGame, 500);
    }
  } else {
    // No match
    firstCard.flipped = false;
    secondCard.flipped = false;
    playSound(220, 0.2);
  }

  memoryGame.flippedCards = [];
  updateMemoryUI();
  renderMemoryBoard();
}

function updateMemoryUI() {
  document.getElementById("memory-moves").textContent = memoryGame.moves;
  document.getElementById(
    "memory-matches"
  ).textContent = `${memoryGame.matches}/${memoryEmojis.length}`;
  document.getElementById("memory-score").textContent = memoryGame.moves;
}

function completeMemoryGame() {
  const endTime = Date.now();
  const timeBonus = Math.max(
    0,
    300 - Math.floor((endTime - memoryGame.startTime) / 1000)
  );
  const moveBonus = Math.max(0, 50 - memoryGame.moves);
  const finalScore = memoryGame.matches * 100 + timeBonus + moveBonus;

  document.getElementById("final-moves").textContent = memoryGame.moves;
  document.getElementById("memory-play").style.display = "none";
  document.getElementById("memory-complete").style.display = "block";

  playSound(880, 0.5);
  showScoreModal(finalScore, "memory");
}

// Trivia Game
function initTriviaGame() {
  // Reset game state
  triviaGame = {
    questions: shuffleArray(triviaQuestions),
    currentQuestion: 0,
    score: 0,
    timeLeft: 30,
    timer: null,
  };

  // Show game board
  document.getElementById("trivia-start").style.display = "none";
  document.getElementById("trivia-complete").style.display = "none";
  document.getElementById("trivia-play").style.display = "block";

  // Start first question
  showTriviaQuestion();
}

function showTriviaQuestion() {
  const question = triviaGame.questions[triviaGame.currentQuestion];

  document.getElementById("current-question").textContent =
    triviaGame.currentQuestion + 1;
  document.getElementById("total-questions").textContent =
    triviaGame.questions.length;
  document.getElementById("question-category").textContent = question.category;
  document.getElementById("question-text").textContent = question.question;

  // Update progress bar
  const progress =
    (triviaGame.currentQuestion / triviaGame.questions.length) * 100;
  document.getElementById("progress-fill").style.width = progress + "%";

  // Create answer options
  const optionsContainer = document.getElementById("answer-options");
  optionsContainer.innerHTML = "";

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "answer-option";
    button.innerHTML = `<strong>${String.fromCharCode(
      65 + index
    )}.</strong> ${option}`;
    button.addEventListener("click", () => selectTriviaAnswer(index));
    optionsContainer.appendChild(button);
  });

  // Start timer
  triviaGame.timeLeft = 30;
  updateTriviaTimer();
  triviaGame.timer = setInterval(updateTriviaTimer, 1000);

  // Hide feedback
  document.getElementById("answer-feedback").style.display = "none";
}

function updateTriviaTimer() {
  document.getElementById("time-left").textContent = triviaGame.timeLeft;

  if (triviaGame.timeLeft <= 0) {
    selectTriviaAnswer(-1); // Time's up
  } else {
    triviaGame.timeLeft--;
  }
}

function selectTriviaAnswer(answerIndex) {
  clearInterval(triviaGame.timer);

  const question = triviaGame.questions[triviaGame.currentQuestion];
  const isCorrect = answerIndex === question.correct;
  const isTimeout = answerIndex === -1;

  // Update score
  if (isCorrect) {
    const timeBonus = Math.floor(triviaGame.timeLeft / 3);
    triviaGame.score += 100 + timeBonus;
    playSound(660, 0.3);
  } else {
    playSound(220, 0.3);
  }

  // Show feedback
  const feedback = document.getElementById("answer-feedback");
  feedback.style.display = "block";

  if (isTimeout) {
    feedback.textContent = "⏰ Time's up!";
    feedback.className = "answer-feedback incorrect";
  } else if (isCorrect) {
    feedback.textContent = "✅ Correct!";
    feedback.className = "answer-feedback correct";
  } else {
    feedback.textContent = `❌ Incorrect! The correct answer was: ${
      question.options[question.correct]
    }`;
    feedback.className = "answer-feedback incorrect";
  }

  // Highlight correct/incorrect answers
  const options = document.querySelectorAll(".answer-option");
  options.forEach((option, index) => {
    if (index === question.correct) {
      option.classList.add("correct");
    } else if (index === answerIndex && !isCorrect) {
      option.classList.add("incorrect");
    }
    option.style.pointerEvents = "none";
  });

  // Update UI
  document.getElementById("trivia-score").textContent = triviaGame.score;

  // Move to next question or complete game
  setTimeout(() => {
    if (triviaGame.currentQuestion + 1 < triviaGame.questions.length) {
      triviaGame.currentQuestion++;
      showTriviaQuestion();
    } else {
      completeTriviaGame();
    }
  }, 2000);
}

function completeTriviaGame() {
  const correctAnswers = Math.floor(triviaGame.score / 100);

  document.getElementById(
    "trivia-final-score"
  ).textContent = `${triviaGame.score} Points`;
  document.getElementById("correct-answers").textContent = correctAnswers;

  document.getElementById("trivia-play").style.display = "none";
  document.getElementById("trivia-complete").style.display = "block";

  playSound(880, 0.5);
  showScoreModal(triviaGame.score, "trivia");
}

// Puzzle Game
function initPuzzleGame() {
  // Reset game state
  puzzleGame = {
    board: [1, 2, 3, 4, 5, 6, 7, 8, null],
    moves: 0,
    startTime: Date.now(),
    timer: null,
  };

  // Shuffle the puzzle
  shufflePuzzle();

  // Show game board
  document.getElementById("puzzle-start").style.display = "none";
  document.getElementById("puzzle-complete").style.display = "none";
  document.getElementById("puzzle-play").style.display = "block";

  // Start timer
  puzzleGame.timer = setInterval(updatePuzzleTimer, 1000);

  // Update UI
  updatePuzzleUI();
  renderPuzzleBoard();
}

function shufflePuzzle() {
  // Perform random valid moves to ensure solvability
  for (let i = 0; i < 1000; i++) {
    const emptyIndex = puzzleGame.board.indexOf(null);
    const possibleMoves = getPuzzleMoves(emptyIndex);
    if (possibleMoves.length > 0) {
      const randomMove =
        possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      [puzzleGame.board[emptyIndex], puzzleGame.board[randomMove]] = [
        puzzleGame.board[randomMove],
        puzzleGame.board[emptyIndex],
      ];
    }
  }
}

function getPuzzleMoves(emptyIndex) {
  const moves = [];
  const row = Math.floor(emptyIndex / 3);
  const col = emptyIndex % 3;

  if (row > 0) moves.push(emptyIndex - 3); // Up
  if (row < 2) moves.push(emptyIndex + 3); // Down
  if (col > 0) moves.push(emptyIndex - 1); // Left
  if (col < 2) moves.push(emptyIndex + 1); // Right

  return moves;
}

function renderPuzzleBoard() {
  const board = document.getElementById("puzzle-board");
  board.innerHTML = "";

  puzzleGame.board.forEach((tile, index) => {
    const tileElement = document.createElement("div");
    tileElement.className = "puzzle-tile";

    if (tile === null) {
      tileElement.classList.add("empty");
    } else {
      tileElement.textContent = tile;
      tileElement.addEventListener("click", () => movePuzzleTile(index));
    }

    board.appendChild(tileElement);
  });
}

function movePuzzleTile(tileIndex) {
  const emptyIndex = puzzleGame.board.indexOf(null);
  const possibleMoves = getPuzzleMoves(emptyIndex);

  if (possibleMoves.includes(tileIndex)) {
    [puzzleGame.board[emptyIndex], puzzleGame.board[tileIndex]] = [
      puzzleGame.board[tileIndex],
      puzzleGame.board[emptyIndex],
    ];

    puzzleGame.moves++;
    playSound(440, 0.1);

    updatePuzzleUI();
    renderPuzzleBoard();

    if (isPuzzleSolved()) {
      setTimeout(completePuzzleGame, 500);
    }
  }
}

function isPuzzleSolved() {
  const solved = [1, 2, 3, 4, 5, 6, 7, 8, null];
  return puzzleGame.board.every((tile, index) => tile === solved[index]);
}

function updatePuzzleTimer() {
  const elapsed = Math.floor((Date.now() - puzzleGame.startTime) / 1000);
  document.getElementById("puzzle-time").textContent = `${elapsed}s`;
}

function updatePuzzleUI() {
  document.getElementById("puzzle-moves").textContent = puzzleGame.moves;
  document.getElementById("puzzle-moves-display").textContent =
    puzzleGame.moves;
}

function completePuzzleGame() {
  clearInterval(puzzleGame.timer);

  const endTime = Date.now();
  const timeInSeconds = Math.floor((endTime - puzzleGame.startTime) / 1000);
  const timeBonus = Math.max(0, 300 - timeInSeconds);
  const moveBonus = Math.max(0, 100 - puzzleGame.moves);
  const finalScore = 1000 + timeBonus * 10 + moveBonus * 5;

  document.getElementById("puzzle-final-moves").textContent = puzzleGame.moves;

  document.getElementById("puzzle-play").style.display = "none";
  document.getElementById("puzzle-complete").style.display = "block";

  playSound(880, 0.5);
  showScoreModal(finalScore, "puzzle");
}

// Modal Functions
function showScoreModal(score, gameType) {
  document.getElementById("modal-score").textContent = score;
  document.getElementById("score-modal").classList.add("active");

  // Store for saving
  window.currentScore = { score, gameType };
}

function hideScoreModal() {
  document.getElementById("score-modal").classList.remove("active");
  document.getElementById("player-name").value = "";
}

function savePlayerScore() {
  const playerName = document.getElementById("player-name").value.trim();
  if (playerName && window.currentScore) {
    saveScore(
      playerName,
      window.currentScore.score,
      window.currentScore.gameType
    );
    hideScoreModal();
    window.currentScore = null;
  }
}

function showLeaderboard() {
  document.getElementById("leaderboard-modal").classList.add("active");
  filterLeaderboard("all");
}

function hideLeaderboard() {
  document.getElementById("leaderboard-modal").classList.remove("active");
}

function filterLeaderboard(gameType) {
  // Update filter buttons
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  // Get and display scores
  const scores = gameType === "all" ? getTopScores() : getTopScores(gameType);
  displayLeaderboard(scores);
}

function displayLeaderboard(scores) {
  const container = document.getElementById("leaderboard-list");

  if (scores.length === 0) {
    container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #9ca3af;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🏆</div>
                <h3>No champions yet!</h3>
                <p>Be the first to claim your spot on the leaderboard</p>
            </div>
        `;
    return;
  }

  container.innerHTML = scores
    .map((score, index) => {
      const rankClass = index < 3 ? `rank-${index + 1}` : "";
      const rankIcon =
        index === 0
          ? "👑"
          : index === 1
          ? "🥈"
          : index === 2
          ? "🥉"
          : index + 1;
      const gameEmoji = { memory: "🧠", trivia: "🎯", puzzle: "🧩" }[
        score.gameType
      ];

      return `
            <div class="leaderboard-entry ${rankClass}">
                <div class="entry-info">
                    <div class="entry-rank ${rankClass}">${rankIcon}</div>
                    <div class="entry-details">
                        <h4>${score.playerName}</h4>
                        <p>${new Date(
                          score.timestamp
                        ).toLocaleDateString()} • ${score.gameType} master</p>
                    </div>
                </div>
                <div class="entry-score">
                    <div class="game-badge ${score.gameType}">
                        ${gameEmoji} ${score.gameType}
                    </div>
                    <div class="score-value ${rankClass}">${score.score.toLocaleString()}</div>
                </div>
            </div>
        `;
    })
    .join("");
}

function shareScore(gameType) {
  const score = window.currentScore ? window.currentScore.score : 0;
  const text = `I just scored ${score} points in the ${gameType} game! Can you beat my score?`;

  if (navigator.share) {
    navigator.share({
      title: `${gameType} Game Score`,
      text: text,
      url: window.location.href,
    });
  } else {
    navigator.clipboard.writeText(`${text} ${window.location.href}`);
    alert("Score copied to clipboard!");
  }
}

// Initialize particles
function createParticles() {
  const containers = document.querySelectorAll(".particles");

  containers.forEach((container) => {
    container.innerHTML = "";

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";
      particle.style.animationDelay = Math.random() * 5 + "s";
      particle.style.animationDuration = 3 + Math.random() * 4 + "s";
      container.appendChild(particle);
    }
  });
}

// Event Listeners
document.addEventListener("DOMContentLoaded", function () {
  updatePlayerCounts();
  createParticles();

  // Handle Enter key in player name input
  document
    .getElementById("player-name")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        savePlayerScore();
      }
    });

  // Close modals when clicking outside
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        modal.classList.remove("active");
      }
    });
  });
});

// Make functions global for HTML onclick handlers
window.startGame = startGame;
window.backToMenu = backToMenu;
window.initMemoryGame = initMemoryGame;
window.initTriviaGame = initTriviaGame;
window.initPuzzleGame = initPuzzleGame;
window.showLeaderboard = showLeaderboard;
window.hideLeaderboard = hideLeaderboard;
window.filterLeaderboard = filterLeaderboard;
window.showScoreModal = showScoreModal;
window.hideScoreModal = hideScoreModal;
window.savePlayerScore = savePlayerScore;
window.shareScore = shareScore;
