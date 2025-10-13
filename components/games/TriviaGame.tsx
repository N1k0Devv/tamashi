import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  triviaQuestions,
  saveScore,
  generateId,
  playSound,
  shuffleArray,
} from "@/lib/gameUtils";
import GameLayout from "@/components/GameLayout";
import Leaderboard from "@/components/Leaderboard";

interface TriviaGameProps {
  onBack: () => void;
  onHome: () => void;
}

export default function TriviaGame({ onBack, onHome }: TriviaGameProps) {
  const [questions, setQuestions] = useState(shuffleArray(triviaQuestions));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [finalScore, setFinalScore] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const startGame = () => {
    setQuestions(shuffleArray(triviaQuestions));
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameStarted(true);
    setGameCompleted(false);
    setTimeLeft(30);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && !gameCompleted && !showResult && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showResult) {
      handleAnswer(-1); // Time's up
    }
    return () => clearTimeout(timer);
  }, [gameStarted, gameCompleted, showResult, timeLeft]);

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return;

    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 3);
      setScore((prev) => prev + 100 + timeBonus);
      playSound(660, 0.3);
    } else {
      playSound(220, 0.3);
    }

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(30);
      } else {
        // Game completed
        const finalGameScore = isCorrect
          ? score + 100 + Math.floor(timeLeft / 3)
          : score;
        setFinalScore(finalGameScore);
        setGameCompleted(true);
        setShowNameDialog(true);
        playSound(880, 0.5);
      }
    }, 2000);
  };

  const handleSaveScore = () => {
    if (playerName.trim()) {
      saveScore({
        id: generateId(),
        playerName: playerName.trim(),
        score: finalScore,
        gameType: "trivia",
        timestamp: Date.now(),
      });
      setShowNameDialog(false);
      setPlayerName("");
    }
  };

  const shareScore = () => {
    const text = `I just scored ${finalScore} points in the Trivia Game! Can you beat my score?`;
    if (navigator.share) {
      navigator.share({
        title: "Trivia Game Score",
        text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${text} ${window.location.href}`);
      alert("Score copied to clipboard!");
    }
  };

  const getButtonVariant = (index: number) => {
    if (!showResult) return "outline";
    if (index === questions[currentQuestion].correctAnswer) return "default";
    if (
      index === selectedAnswer &&
      selectedAnswer !== questions[currentQuestion].correctAnswer
    )
      return "destructive";
    return "outline";
  };

  return (
    <>
      <GameLayout
        title="Trivia Game"
        score={gameStarted ? score : undefined}
        onBack={onBack}
        onHome={onHome}
        showLeaderboard={() => setShowLeaderboard(true)}
      >
        <div className="space-y-6">
          {!gameStarted ? (
            <Card className="p-8 text-center">
              <CardContent className="space-y-4">
                <h2 className="text-2xl font-bold">Trivia Quiz</h2>
                <p className="text-muted-foreground">
                  Answer questions correctly and quickly to earn bonus points.
                  You have 30 seconds per question!
                </p>
                <Button
                  onClick={startGame}
                  size="lg"
                  className="hover:scale-105 transition-transform"
                >
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          ) : gameCompleted ? (
            <Card className="p-6 text-center bg-gradient-to-r from-green-50 to-blue-50">
              <CardContent className="space-y-4">
                <h3 className="text-2xl font-bold text-green-600">
                  Quiz Complete! 🎉
                </h3>
                <div className="text-3xl font-bold">{finalScore} Points</div>
                <p>
                  You answered {Math.floor(finalScore / 100)} questions
                  correctly!
                </p>
                <div className="flex justify-center gap-4">
                  <Button onClick={startGame}>Play Again</Button>
                  <Button variant="outline" onClick={shareScore}>
                    Share Score
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Progress and Timer */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Time:</span>
                    <Badge variant={timeLeft <= 10 ? "destructive" : "default"}>
                      {timeLeft}s
                    </Badge>
                  </div>
                </div>
                <Progress value={(currentQuestion / questions.length) * 100} />
              </div>

              {/* Question Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {questions[currentQuestion].category}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      Score: {score}
                    </div>
                  </div>
                  <CardTitle className="text-xl">
                    {questions[currentQuestion].question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      variant={getButtonVariant(index)}
                      className="w-full text-left justify-start p-4 h-auto hover:scale-[1.02] transition-transform"
                      onClick={() => handleAnswer(index)}
                      disabled={showResult}
                    >
                      <span className="font-medium mr-2">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {option}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Result Feedback */}
              {showResult && (
                <Card
                  className={`p-4 text-center ${
                    selectedAnswer === questions[currentQuestion].correctAnswer
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="text-lg font-bold">
                    {selectedAnswer === questions[currentQuestion].correctAnswer
                      ? "✅ Correct!"
                      : selectedAnswer === -1
                      ? "⏰ Time's up!"
                      : "❌ Incorrect"}
                  </div>
                  {selectedAnswer !==
                    questions[currentQuestion].correctAnswer && (
                    <div className="text-sm text-muted-foreground mt-1">
                      The correct answer was:{" "}
                      {
                        questions[currentQuestion].options[
                          questions[currentQuestion].correctAnswer
                        ]
                      }
                    </div>
                  )}
                </Card>
              )}
            </div>
          )}
        </div>
      </GameLayout>

      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excellent Work! Save Your Score</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {finalScore} Points!
              </div>
              <p className="text-muted-foreground">
                Enter your name to save this score
              </p>
            </div>
            <Input
              placeholder="Your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={(e: { key: string; }) => e.key === "Enter" && handleSaveScore()}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSaveScore}
                disabled={!playerName.trim()}
                className="flex-1"
              >
                Save Score
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowNameDialog(false)}
              >
                Skip
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      )}
    </>
  );
}
