export interface GameScore {
  id: string;
  playerName: string;
  score: number;
  gameType: "memory" | "trivia" | "puzzle";
  timestamp: number;
}

export interface TriviaQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

export const triviaQuestions: TriviaQuestion[] = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    category: "Geography",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    category: "Science",
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Van Gogh", "Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: 2,
    category: "Art",
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: 1,
    category: "Nature",
  },
  {
    question: "In which year did World War II end?",
    options: ["1944", "1945", "1946", "1947"],
    correctAnswer: 1,
    category: "History",
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
    category: "Science",
  },
  {
    question: "Which country is home to the kangaroo?",
    options: ["New Zealand", "Australia", "South Africa", "Brazil"],
    correctAnswer: 1,
    category: "Geography",
  },
  {
    question: "What is the fastest land animal?",
    options: ["Lion", "Cheetah", "Leopard", "Tiger"],
    correctAnswer: 1,
    category: "Nature",
  },
];

export const saveScore = (score: GameScore): void => {
  const scores = getScores();
  scores.push(score);
  // Keep only top 10 scores per game type
  const gameScores = scores.filter((s) => s.gameType === score.gameType);
  const topScores = gameScores.sort((a, b) => b.score - a.score).slice(0, 10);
  const otherScores = scores.filter((s) => s.gameType !== score.gameType);
  localStorage.setItem(
    "gameScores",
    JSON.stringify([...otherScores, ...topScores])
  );
};

export const getScores = (): GameScore[] => {
  const scores = localStorage.getItem("gameScores");
  return scores ? JSON.parse(scores) : [];
};

export const getTopScores = (gameType?: string): GameScore[] => {
  const scores = getScores();
  const filtered = gameType
    ? scores.filter((s) => s.gameType === gameType)
    : scores;
  return filtered.sort((a, b) => b.score - a.score).slice(0, 10);
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const playSound = (
  frequency: number,
  duration: number,
  type: "sine" | "square" | "triangle" = "sine"
): void => {
  try {
    const audioContext = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
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
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
