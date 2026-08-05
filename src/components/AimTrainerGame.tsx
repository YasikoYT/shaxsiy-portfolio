import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Target, Zap, Clock } from "lucide-react";
import { getGameHighScore, saveGameHighScore } from "../lib/highScores";

interface TargetItem {
  id: number;
  x: number; // percentage
  y: number; // percentage
  size: number;
  spawnTime: number;
}

export default function AimTrainerGame({ className = "" }: { className?: string }) {
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => getGameHighScore("aimtrainer"));
  const [targetsHit, setTargetsHit] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [targets, setTargets] = useState<TargetItem[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    setHighScore(getGameHighScore("aimtrainer"));
  }, []);

  const startGame = () => {
    setScore(0);
    setTargetsHit(0);
    setReactionTimes([]);
    setTimeLeft(30);
    setGameState("playing");
    spawnTarget();
  };

  const spawnTarget = () => {
    const newTarget: TargetItem = {
      id: Date.now(),
      x: 15 + Math.random() * 70,
      y: 15 + Math.random() * 70,
      size: 40 + Math.random() * 20,
      spawnTime: Date.now(),
    };
    setTargets([newTarget]);
  };

  const handleTargetClick = (target: TargetItem) => {
    if (gameState !== "playing") return;
    const reaction = Date.now() - target.spawnTime;
    setReactionTimes((prev) => [...prev, reaction]);
    setTargetsHit((prev) => prev + 1);
    setScore((prev) => {
      const next = prev + Math.max(10, 1000 - reaction);
      saveGameHighScore("aimtrainer", next);
      if (next > highScore) setHighScore(next);
      return next;
    });
    spawnTarget();
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("gameover");
          saveGameHighScore("aimtrainer", score);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, score]);

  const avgReaction =
    reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 0;

  return (
    <div className={`bg-neutral-900 text-white rounded-3xl p-6 border border-neutral-800 shadow-2xl relative overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
        <div>
          <h3 className="font-serif text-2xl font-bold text-rose-400 flex items-center gap-2">
            <Target className="w-6 h-6 text-rose-400" /> FPS Aim Trainer
          </h3>
          <p className="text-xs text-neutral-400 font-mono">Paydo bo'layotgan nishonlarni eng tez fursatda bosing!</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
            <span className="text-neutral-400">Vaqt:</span> <span className="font-bold text-lg text-amber-400">{timeLeft}s</span>
          </div>
          <div className="bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
            <span className="text-neutral-400">Reaksiya:</span> <span className="font-bold text-lg text-emerald-400">{avgReaction}ms</span>
          </div>
        </div>
      </div>

      {/* Target Arena */}
      <div className="relative w-full h-80 bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden cursor-crosshair">
        {gameState === "playing" &&
          targets.map((target) => (
            <button
              key={target.id}
              onClick={() => handleTargetClick(target)}
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
                width: `${target.size}px`,
                height: `${target.size}px`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500 border-4 border-white shadow-xl hover:scale-110 active:scale-95 transition-transform flex items-center justify-center cursor-pointer"
            >
              <div className="w-2.5 h-2.5 bg-white rounded-full" />
            </button>
          ))}
      </div>

      {/* Overlays */}
      {gameState !== "playing" && (
        <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
          {gameState === "idle" ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-3xl flex items-center justify-center mx-auto border border-rose-500/30">
                <Target className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-3xl font-bold text-white">Pro Aim Trainer</h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Reflekslaringiz va mo'ljal olish aniqligingizni sinang! 30 soniya ichida eng ko'p nishon urib oling.
              </p>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-rose-500 text-white font-mono font-bold rounded-2xl hover:bg-rose-400 transition-all flex items-center gap-2 mx-auto shadow-lg cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" /> Boshlash
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-serif text-3xl font-bold text-rose-400">Vaqt Tugadi! ⏱️</h4>
              <div className="grid grid-cols-2 gap-3 bg-neutral-900 border border-neutral-800 p-4 rounded-2xl text-left">
                <div>
                  <p className="text-xs text-neutral-400">Urilgan nishonlar:</p>
                  <p className="text-2xl font-mono font-bold text-emerald-400">{targetsHit}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400">O'rtacha reaksiya:</p>
                  <p className="text-2xl font-mono font-bold text-amber-300">{avgReaction} ms</p>
                </div>
              </div>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-rose-500 text-white font-mono font-bold rounded-2xl hover:bg-rose-400 transition-all flex items-center gap-2 mx-auto shadow-lg cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Qayta Test Qilish
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
