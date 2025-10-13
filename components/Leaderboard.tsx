import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, X, Crown, Star, Zap } from "lucide-react";
import { GameScore, getTopScores } from "@/lib/gameUtils";
import { useState } from "react";

interface LeaderboardProps {
  onClose: () => void;
}

export default function Leaderboard({ onClose }: LeaderboardProps) {
  const [selectedGame, setSelectedGame] = useState<
    "all" | "memory" | "trivia" | "puzzle"
  >("all");

  const getScores = () => {
    if (selectedGame === "all") {
      return getTopScores();
    }
    return getTopScores(selectedGame);
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-6 h-6 text-yellow-400 animate-pulse" />;
      case 1:
        return <Trophy className="w-5 h-5 text-gray-300" />;
      case 2:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return (
          <div className="w-6 h-6 flex items-center justify-center text-sm font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
            {index + 1}
          </div>
        );
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const gameTypeColors = {
    memory:
      "bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border-pink-500/30",
    trivia:
      "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30",
    puzzle:
      "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30",
  };

  const gameEmojis = {
    memory: "🧠",
    trivia: "🎯",
    puzzle: "🧩",
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl max-h-[85vh] overflow-hidden bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-xl border-white/20">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10">
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Hall of Fame
            </span>
            <Star className="w-5 h-5 text-yellow-400 animate-pulse" />
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/10 hover:scale-110 transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          {/* Enhanced Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            {(["all", "memory", "trivia", "puzzle"] as const).map((game) => (
              <Button
                key={game}
                variant={selectedGame === game ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedGame(game)}
                className={`capitalize transition-all duration-300 ${
                  selectedGame === game
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-lg"
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:scale-105"
                }`}
              >
                {game === "all" ? (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    All Games
                  </>
                ) : (
                  <>
                    <span className="mr-2">{gameEmojis[game]}</span>
                    {game} Game
                  </>
                )}
              </Button>
            ))}
          </div>

          {/* Enhanced Scores List */}
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {getScores().length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <p className="text-gray-400 text-lg">No champions yet!</p>
                <p className="text-gray-500 text-sm mt-2">
                  Be the first to claim your spot on the leaderboard
                </p>
              </div>
            ) : (
              getScores().map((score, index) => (
                <div
                  key={score.id}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                    index === 0
                      ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 shadow-lg shadow-yellow-500/10"
                      : index === 1
                      ? "bg-gradient-to-r from-gray-400/20 to-gray-600/20 border border-gray-400/30"
                      : index === 2
                      ? "bg-gradient-to-r from-amber-500/20 to-amber-700/20 border border-amber-500/30"
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">{getRankIcon(index)}</div>
                    <div>
                      <div className="font-bold text-white text-lg flex items-center gap-2">
                        {score.playerName}
                        {index === 0 && (
                          <Crown className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                      <div className="text-sm text-gray-400 flex items-center gap-2">
                        <span>{formatDate(score.timestamp)}</span>
                        <span>•</span>
                        <span className="capitalize">
                          {score.gameType} master
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      className={`${
                        gameTypeColors[score.gameType]
                      } font-semibold px-3 py-1`}
                    >
                      <span className="mr-1">{gameEmojis[score.gameType]}</span>
                      {score.gameType}
                    </Badge>
                    <div className="text-right">
                      <div
                        className={`text-2xl font-black ${
                          index === 0
                            ? "text-yellow-400"
                            : index === 1
                            ? "text-gray-300"
                            : index === 2
                            ? "text-amber-500"
                            : "text-white"
                        }`}
                      >
                        {score.score.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
