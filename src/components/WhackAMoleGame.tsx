import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, RotateCcw, Award, Zap, AlertTriangle, Crosshair } from "lucide-react";

interface Mole {
  id: number;
  type: "normal" | "golden" | "bomb";
  active: boolean;
  timeoutId?: NodeJS.Timeout;
}

export default function WhackAMoleGame({ className = "" }: { className?: string }) {
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("whack_mole_highscore") || "0", 10);
  });
  const [timeLeft, setTimeLeft] = useState(30);
  const [moles, setMoles] = useState<Mole[]>(
    Array.from({ length: 9 }, (_, i) => ({ id: i, type: "normal", active: false }))
  );
  const [combo, setCombo] = useState(0);

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  // Prevent page scroll when using keys 1-9
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStateRef.current !== "playing") return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 9) {
        e.preventDefault();
        whackMole(num - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Timer loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Mole pop loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const popInterval = setInterval(() => {
      // Pick random hole
      const inactiveIndices = moles.map((m, idx) => (!m.active ? idx : -1)).filter((idx) => idx !== -1);
      if (inactiveIndices.length === 0) return;

      const randomIdx = inactiveIndices[Math.floor(Math.random() * inactiveIndices.length)];
      const randType = Math.random();
      const moleType: "normal" | "golden" | "bomb" = randType < 0.65 ? "normal" : randType < 0.85 ? "golden" : "bomb";

      setMoles((prev) =>
        prev.map((m, i) => (i === randomIdx ? { ...m, type: moleType, active: true } : m))
      );

      // Hide after random duration
      setTimeout(() => {
        setMoles((prev) =>
          prev.map((m, i) => (i === randomIdx ? { ...m, active: false } : m))
        );
      }, Math.max(700, 1500 - Math.floor(score / 50) * 100));
    }, 600);

    return () => clearInterval(popInterval);
  }, [gameState, score]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setCombo(0);
    setMoles(Array.from({ length: 9 }, (_, i) => ({ id: i, type: "normal", active: false })));
    setGameState("playing");
  };

  const endGame = () => {
    setGameState("gameover");
    setScore((currentScore) => {
      if (currentScore > highScore) {
        setHighScore(currentScore);
        localStorage.setItem("whack_mole_highscore", currentScore.toString());
      }
      return currentScore;
    });
  };

  const whackMole = (index: number) => {
    if (gameState !== "playing") return;

    const targetMole = moles[index];
    if (!targetMole || !targetMole.active) {
      setCombo(0);
      return;
    }

    // Hide hit mole immediately
    setMoles((prev) => prev.map((m, i) => (i === index ? { ...m, active: false } : m)));

    if (targetMole.type === "bomb") {
      setScore((s) => Math.max(0, s - 20));
      setCombo(0);
    } else if (targetMole.type === "golden") {
      const added = 30 + combo * 5;
      setScore((s) => s + added);
      setCombo((c) => c + 1);
    } else {
      const added = 10 + combo * 2;
      setScore((s) => s + added);
      setCombo((c) => c + 1);
    }
  };

  return (
    <div className={`bg-neutral-900 text-white rounded-3xl p-6 border border-neutral-800 shadow-2xl relative overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
        <div>
          <h3 className="font-serif text-2xl font-bold text-amber-400 flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-400" /> Whack-A-Mole
          </h3>
          <p className="text-xs text-neutral-400 font-mono">Klaviatura 1-9 yoki ustiga bosish orqali zarba bering!</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
            <span className="text-neutral-400">Vaqt:</span> <span className={`font-bold text-lg ${timeLeft <= 5 ? "text-red-400 animate-pulse" : "text-amber-300"}`}>{timeLeft}s</span>
          </div>
          <div className="bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
            <span className="text-neutral-400">Ochko:</span> <span className="font-bold text-lg text-emerald-400">{score}</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto aspect-square my-2">
        {moles.map((mole, idx) => (
          <button
            key={mole.id}
            onClick={() => whackMole(idx)}
            className="relative bg-neutral-950 border-2 border-neutral-800 rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer hover:border-amber-500/50 transition-colors shadow-inner"
          >
            {/* Hole background */}
            <div className="absolute inset-2 bg-neutral-900 rounded-xl border border-neutral-800" />

            {/* Key shortcut label */}
            <span className="absolute top-1.5 left-2 text-[10px] font-mono text-neutral-600 font-bold">
              {idx + 1}
            </span>

            {/* Mole sprite */}
            <AnimatePresence>
              {mole.active && (
                <motion.div
                  initial={{ y: 50, scale: 0.5, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  exit={{ y: 50, scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg border ${
                    mole.type === "bomb"
                      ? "bg-red-600 border-red-400 text-white animate-bounce"
                      : mole.type === "golden"
                      ? "bg-amber-400 border-yellow-200 text-neutral-950 shadow-amber-500/50"
                      : "bg-emerald-500 border-emerald-300 text-white"
                  }`}
                >
                  {mole.type === "bomb" ? "💣" : mole.type === "golden" ? "👑" : "🐹"}
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>

      {/* Combo Indicator */}
      {combo > 1 && (
        <div className="text-center mt-3">
          <span className="inline-flex items-center gap-1 text-xs font-mono font-bold bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/40 animate-pulse">
            <Zap className="w-3.5 h-3.5" /> COMBO x{combo}!
          </span>
        </div>
      )}

      {/* Start / Gameover Overlays */}
      {gameState !== "playing" && (
        <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
          {gameState === "idle" ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-3xl flex items-center justify-center mx-auto border border-amber-500/30">
                <Crosshair className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-3xl font-bold text-white">Whack-A-Mole</h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Chıqqan hayvonchalarni imkon qadar tezroq urib ochko yig'ing. Bombadan saqlaning!
              </p>
              <p className="text-xs font-mono text-amber-300">Rekord: {highScore} ochko</p>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-amber-400 text-black font-mono font-bold rounded-2xl hover:bg-amber-300 transition-all flex items-center gap-2 mx-auto shadow-lg cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black" /> Boshlash
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-serif text-3xl font-bold text-amber-400">Vaqt Tugadi!</h4>
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-1">
                <p className="text-sm text-neutral-400">Yig'ilgan Ochko:</p>
                <p className="text-4xl font-mono font-bold text-emerald-400">{score}</p>
                <p className="text-xs text-neutral-500">Eng yuqori natija: {highScore}</p>
              </div>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-amber-400 text-black font-mono font-bold rounded-2xl hover:bg-amber-300 transition-all flex items-center gap-2 mx-auto shadow-lg cursor-pointer"
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
