import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { saveScore, generateId, playSound } from "@/lib/gameUtils";
import GameLayout from "@/components/GameLayout";
import Leaderboard from "@/components/Leaderboard";

interface PuzzleGameProps {
  onBack: () => void;
  onHome: () => void;
}

type PuzzleState = (number | null)[];

export default function PuzzleGame({ onBack, onHome }: PuzzleGameProps) {
  const [puzzle, setPuzzle] = useState<PuzzleState>([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [finalScore, setFinalScore] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const createSolvedPuzzle = (): PuzzleState => {
    return [1, 2, 3, 4, 5, 6, 7, 8, null];
  };

  const shufflePuzzle = (puzzle: PuzzleState): PuzzleState => {
    const shuffled = [...puzzle];
    // Perform random valid moves to ensure solvability
    for (let i = 0; i < 1000; i++) {
      const emptyIndex = shuffled.indexOf(null);
      const possibleMoves = getPossibleMoves(emptyIndex);
      if (possibleMoves.length > 0) {
        const randomMove =
          possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        [shuffled[emptyIndex], shuffled[randomMove]] = [
          shuffled[randomMove],
          shuffled[emptyIndex],
        ];
      }
    }
    return shuffled;
  };

  const getPossibleMoves = (emptyIndex: number): number[] => {
    const moves: number[] = [];
    const row = Math.floor(emptyIndex / 3);
    const col = emptyIndex % 3;

    // Up
    if (row > 0) moves.push(emptyIndex - 3);
    // Down
    if (row < 2) moves.push(emptyIndex + 3);
    // Left
    if (col > 0) moves.push(emptyIndex - 1);
    // Right
    if (col < 2) moves.push(emptyIndex + 1);

    return moves;
  };

  const initializeGame = () => {
    const solved = createSolvedPuzzle();
    const shuffled = shufflePuzzle(solved);
    setPuzzle(shuffled);
    setMoves(0);
    setGameStarted(true);
    setGameCompleted(false);
    setStartTime(Date.now());
  };

  const handleTileClick = (index: number) => {
    if (!gameStarted || gameCompleted) return;

    const emptyIndex = puzzle.indexOf(null);
    const possibleMoves = getPossibleMoves(emptyIndex);

    if (possibleMoves.includes(index)) {
      const newPuzzle = [...puzzle];
      [newPuzzle[emptyIndex], newPuzzle[index]] = [
        newPuzzle[index],
        newPuzzle[emptyIndex],
      ];
      setPuzzle(newPuzzle);
      setMoves((prev) => prev + 1);
      playSound(440, 0.1);
    }
  };

  const isSolved = (puzzle: PuzzleState): boolean => {
    const solved = createSolvedPuzzle();
    return puzzle.every((tile, index) => tile === solved[index]);
  };

  useEffect(() => {
    if (gameStarted && isSolved(puzzle)) {
      const endTime = Date.now();
      const timeInSeconds = Math.floor((endTime - startTime) / 1000);
      const timeBonus = Math.max(0, 300 - timeInSeconds);
      const moveBonus = Math.max(0, 100 - moves);
      const score = 1000 + timeBonus * 10 + moveBonus * 5;

      setFinalScore(score);
      setGameCompleted(true);
      setShowNameDialog(true);
      playSound(880, 0.5);
    }
  }, [puzzle, gameStarted, moves, startTime]);

  const handleSaveScore = () => {
    if (playerName.trim()) {
      saveScore({
        id: generateId(),
        playerName: playerName.trim(),
        score: finalScore,
        gameType: "puzzle",
        timestamp: Date.now(),
      });
      setShowNameDialog(false);
      setPlayerName("");
    }
  };

  const shareScore = () => {
    const text = `I just solved the sliding puzzle in ${moves} moves and scored ${finalScore} points! Can you beat my score?`;
    if (navigator.share) {
      navigator.share({
        title: "Puzzle Game Score",
        text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${text} ${window.location.href}`);
      alert("Score copied to clipboard!");
    }
  };

  return (
    <>
      <GameLayout
        title="Sliding Puzzle"
        score={gameStarted ? moves : undefined}
        onBack={onBack}
        onHome={onHome}
        showLeaderboard={() => setShowLeaderboard(true)}
      >
        <div className="space-y-6">
          {!gameStarted ? (
            <Card className="p-8 text-center">
              <CardContent className="space-y-4">
                <h2 className="text-2xl font-bold">Sliding Puzzle</h2>
                <p className="text-muted-foreground">
                  Arrange the numbers 1-8 in order by sliding tiles into the
                  empty space. Solve it quickly with fewer moves for a higher
                  score!
                </p>
                <Button
                  onClick={initializeGame}
                  size="lg"
                  className="hover:scale-105 transition-transform"
                >
                  Start Puzzle
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-center gap-8 text-center">
                <div>
                  <div className="text-2xl font-bold">{moves}</div>
                  <div className="text-sm text-muted-foreground">Moves</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {Math.floor((Date.now() - startTime) / 1000)}s
                  </div>
                  <div className="text-sm text-muted-foreground">Time</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                {puzzle.map((tile, index) => (
                  <Card
                    key={index}
                    className={`aspect-square cursor-pointer transition-all duration-200 ${
                      tile === null
                        ? "opacity-0 pointer-events-none"
                        : "hover:scale-105 hover:shadow-md"
                    }`}
                    onClick={() => handleTileClick(index)}
                  >
                    <CardContent className="flex items-center justify-center h-full p-0">
                      <div className="text-2xl font-bold text-primary">
                        {tile}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {gameCompleted && (
                <Card className="p-6 text-center bg-gradient-to-r from-green-50 to-blue-50">
                  <CardContent className="space-y-4">
                    <h3 className="text-2xl font-bold text-green-600">
                      Puzzle Solved! 🎉
                    </h3>
                    <p>You completed the puzzle in {moves} moves!</p>
                    <div className="flex justify-center gap-4">
                      <Button onClick={initializeGame}>Play Again</Button>
                      <Button variant="outline" onClick={shareScore}>
                        Share Score
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </GameLayout>

      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Puzzle Master! Save Your Score</DialogTitle>
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
              onKeyPress={(e) => e.key === "Enter" && handleSaveScore()}
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
