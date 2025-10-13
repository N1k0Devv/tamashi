import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Target,
  Puzzle,
  Trophy,
  Play,
  Users,
  Sparkles,
  Zap,
  Star,
} from "lucide-react";
import MemoryGame from "@/components/games/MemoryGame";
import TriviaGame from "@/components/games/TriviaGame";
import PuzzleGame from "@/components/games/PuzzleGame";
import Leaderboard from "@/components/Leaderboard";
import { getTopScores } from "@/lib/gameUtils";

type GameType = "menu" | "memory" | "trivia" | "puzzle";

export default function Index() {
  const [currentGame, setCurrentGame] = useState<GameType>("menu");
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const games = [
    {
      id: "memory" as const,
      title: "Memory Game",
      description:
        "Test your memory by matching pairs of cards. Quick thinking earns bonus points!",
      icon: Brain,
      color: "from-pink-400 via-purple-500 to-indigo-600",
      bgGlow: "bg-pink-500/20",
      difficulty: "Easy",
      players: getTopScores("memory").length,
      emoji: "🧠",
    },
    {
      id: "trivia" as const,
      title: "Trivia Quiz",
      description:
        "Answer questions across various categories. Speed and accuracy matter!",
      icon: Target,
      color: "from-blue-400 via-cyan-500 to-teal-600",
      bgGlow: "bg-blue-500/20",
      difficulty: "Medium",
      players: getTopScores("trivia").length,
      emoji: "🎯",
    },
    {
      id: "puzzle" as const,
      title: "Sliding Puzzle",
      description:
        "Arrange numbered tiles in order. Solve with fewer moves for higher scores!",
      icon: Puzzle,
      color: "from-green-400 via-emerald-500 to-cyan-600",
      bgGlow: "bg-green-500/20",
      difficulty: "Hard",
      players: getTopScores("puzzle").length,
      emoji: "🧩",
    },
  ];

  const handleGameSelect = (gameId: GameType) => {
    setCurrentGame(gameId);
  };

  const handleBackToMenu = () => {
    setCurrentGame("menu");
  };

  if (currentGame === "memory") {
    return <MemoryGame onBack={handleBackToMenu} onHome={handleBackToMenu} />;
  }

  if (currentGame === "trivia") {
    return <TriviaGame onBack={handleBackToMenu} onHome={handleBackToMenu} />;
  }

  if (currentGame === "puzzle") {
    return <PuzzleGame onBack={handleBackToMenu} onHome={handleBackToMenu} />;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-16 animate-in fade-in slide-in-from-top duration-1000">
            <div className="relative inline-block mb-6">
              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4 relative">
                <span className="relative z-10">🎮 Game Hub</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-3xl opacity-30 scale-110"></div>
              </h1>
              <div className="absolute -top-4 -right-4">
                <Sparkles className="w-8 h-8 text-yellow-400 animate-spin" />
              </div>
            </div>

            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              Challenge yourself with{" "}
              <span className="text-purple-400 font-semibold">
                brain-bending games
              </span>
              ! Test your memory, knowledge, and problem-solving skills in our
              collection of
              <span className="text-pink-400 font-semibold">
                {" "}
                interactive challenges
              </span>
              .
            </p>

            <div className="flex justify-center">
              <Button
                onClick={() => setShowLeaderboard(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-2xl hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300 px-8 py-3 text-lg font-semibold"
              >
                <Trophy className="w-5 h-5 mr-2" />
                <span>Hall of Fame</span>
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Game Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
            {games.map((game, index) => {
              const Icon = game.icon;
              return (
                <Card
                  key={game.id}
                  className="group relative overflow-hidden bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl cursor-pointer animate-in fade-in slide-in-from-bottom duration-700"
                  style={{ animationDelay: `${index * 200}ms` }}
                  onClick={() => handleGameSelect(game.id)}
                >
                  {/* Glow Effect */}
                  <div
                    className={`absolute inset-0 ${game.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}
                  ></div>

                  {/* Card Content */}
                  <div className="relative z-10">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${game.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-3xl animate-bounce group-hover:scale-125 transition-transform duration-300">
                          {game.emoji}
                        </div>
                      </div>

                      <CardTitle className="text-xl text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                        {game.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                        {game.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="secondary"
                            className={`text-xs font-semibold px-3 py-1 ${
                              game.difficulty === "Easy"
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : game.difficulty === "Medium"
                                ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                : "bg-red-500/20 text-red-400 border-red-500/30"
                            }`}
                          >
                            <Star className="w-3 h-3 mr-1" />
                            {game.difficulty}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Users className="w-3 h-3" />
                            <span className="font-medium">{game.players}</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        className={`w-full bg-gradient-to-r ${game.color} hover:shadow-lg hover:shadow-purple-500/25 border-0 text-white font-semibold py-3 group-hover:scale-105 transition-all duration-300`}
                      >
                        <Play className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                        <span>Start Playing</span>
                        <Zap className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform duration-300" />
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Enhanced Features Section */}
          <div className="text-center animate-in fade-in slide-in-from-bottom duration-1000 delay-700">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Game Hub
              </span>
              ?
            </h2>
            <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
              Experience the future of browser gaming with our cutting-edge
              features
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: Brain,
                  title: "Neural Enhancement",
                  description:
                    "Advanced algorithms designed to boost cognitive performance and mental agility",
                  color: "from-pink-500 to-purple-600",
                  glow: "group-hover:shadow-pink-500/25",
                },
                {
                  icon: Trophy,
                  title: "Global Competition",
                  description:
                    "Compete with players worldwide and climb the ranks in real-time leaderboards",
                  color: "from-blue-500 to-cyan-600",
                  glow: "group-hover:shadow-blue-500/25",
                },
                {
                  icon: Zap,
                  title: "Instant Action",
                  description:
                    "Zero downloads, maximum fun. Play instantly across all devices with lightning speed",
                  color: "from-green-500 to-emerald-600",
                  glow: "group-hover:shadow-green-500/25",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`group p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${feature.glow}`}
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className="mt-20 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
              <span className="text-gray-400">Crafted with</span>
              <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></div>
              <span className="text-gray-400">for gamers worldwide</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      )}
    </>
  );
}
