import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Home, Trophy, Sparkles } from "lucide-react";
import { ReactNode } from "react";

interface GameLayoutProps {
  title: string;
  children: ReactNode;
  score?: number;
  onBack: () => void;
  onHome: () => void;
  showLeaderboard?: () => void;
}

export default function GameLayout({
  title,
  children,
  score,
  onBack,
  onHome,
  showLeaderboard,
}: GameLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto p-4 relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8 p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onHome}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>

          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400 animate-spin" />
              {title}
              <Sparkles className="w-6 h-6 text-pink-400 animate-spin" />
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {score !== undefined && (
              <Card className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl border-white/20">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="text-purple-400">Score:</span>
                  <span className="text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {score}
                  </span>
                </div>
              </Card>
            )}
            {showLeaderboard && (
              <Button
                variant="outline"
                size="sm"
                onClick={showLeaderboard}
                className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Leaderboard
              </Button>
            )}
          </div>
        </div>

        {/* Game Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </div>
    </div>
  );
}
