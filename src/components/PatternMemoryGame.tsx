import React, { useState, useEffect } from "react";
import { Play, RotateCcw, Brain, CheckCircle, Zap } from "lucide-react";

export default function PatternMemoryGame({ className = "" }: { className?: string }) {
  const [gameState, setGameState] = useState<"idle" | "showing" | "user_turn" | "gameover">("idle");
  const [level, setLevel] = useState(1);
  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [activeCell, setActiveCell] = useState<number | null>(null);

  const startGame = () => {
    setLevel(1);
    startLevel(1);
  };

  const startLevel = (currentLevel: number) => {
    setUserPattern([]);
    setGameState("showing");

    // Generate random sequence of length = level + 2
    const seqLength = currentLevel + 2;
    const newSeq: number[] = [];
    for (let i = 0; i < seqLength; i++) {
      newSeq.push(Math.floor(Math.random() * 9));
    }
    setPattern(newSeq);

    // Play animation
    let step = 0;
    const interval = setInterval(() => {
      if (step < newSeq.length) {
        setActiveCell(newSeq[step]);
        setTimeout(() => setActiveCell(null), 400);
        step++;
      } else {
        clearInterval(interval);
        setGameState("user_turn");
      }
    }, 700);
  };

  const handleTileClick = (index: number) => {
    if (gameState !== "user_turn") return;

    setActiveCell(index);
    setTimeout(() => setActiveCell(null), 200);

    const updatedUser = [...userPattern, index];
    setUserPattern(updatedUser);

    const stepIndex = updatedUser.length - 1;

    // Check correctness
    if (updatedUser[stepIndex] !== pattern[stepIndex]) {
      setGameState("gameover");
      return;
    }

    // Completed level sequence!
    if (updatedUser.length === pattern.length) {
      setTimeout(() => {
        const nextLevel = level + 1;
        setLevel(nextLevel);
        startLevel(nextLevel);
      }, 600);
    }
  };

  return (
    <div className={`bg-neutral-900 text-white rounded-3xl p-6 border border-neutral-800 shadow-2xl relative overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
        <div>
          <h3 className="font-serif text-2xl font-bold text-cyan-400 flex items-center gap-2">
            <Brain className="w-6 h-6 text-cyan-400" /> Matrix Pattern Memory
          </h3>
          <p className="text-xs text-neutral-400 font-mono">Yoritilgan kataklar tartibini eslab qoling va qaytaring!</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
            <span className="text-neutral-400">Bosqich:</span> <span className="font-bold text-lg text-amber-400">{level}</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex justify-center my-6">
        <div className="grid grid-cols-3 gap-3 bg-neutral-950 p-4 rounded-3xl border border-neutral-800 shadow-2xl">
          {Array.from({ length: 9 }).map((_, idx) => {
            const isActive = activeCell === idx;

            return (
              <button
                key={idx}
                onClick={() => handleTileClick(idx)}
                className={`w-20 h-20 rounded-2xl transition-all cursor-pointer border ${
                  isActive
                    ? "bg-cyan-400 border-white shadow-xl scale-105 shadow-cyan-500/50"
                    : "bg-neutral-900 border-neutral-800 hover:bg-neutral-800"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Status */}
      <div className="text-center font-mono text-xs text-neutral-400">
        {gameState === "showing" && "👀 Ketma-ketlikni eslab qoling..."}
        {gameState === "user_turn" && "👆 Endi xuddi shu tartibda bosing!"}
      </div>

      {/* Overlays */}
      {(gameState === "idle" || gameState === "gameover") && (
        <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
          {gameState === "idle" ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-cyan-500/20 text-cyan-400 rounded-3xl flex items-center justify-center mx-auto border border-cyan-500/30">
                <Brain className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-3xl font-bold text-white">Pattern Memory</h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Xotirangiz va diqqat markazingizni sinovdan o'tkazing!
              </p>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-cyan-400 text-black font-mono font-bold rounded-2xl hover:bg-cyan-300 transition-all flex items-center gap-2 mx-auto shadow-lg cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black" /> Boshlash
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-serif text-3xl font-bold text-rose-400">Xatoga Yo'l Qo'yildi!</h4>
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-1">
                <p className="text-sm text-neutral-400">Yettilgan Bosqich:</p>
                <p className="text-4xl font-mono font-bold text-emerald-400">{level}-bosqich</p>
              </div>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-cyan-400 text-black font-mono font-bold rounded-2xl hover:bg-cyan-300 transition-all flex items-center gap-2 mx-auto shadow-lg cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Qayta O'ynash
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
