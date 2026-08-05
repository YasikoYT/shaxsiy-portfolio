import React, { useState, useEffect } from "react";
import { Play, RotateCcw, Layers, Award } from "lucide-react";
import { getGameHighScore, saveGameHighScore } from "../lib/highScores";

export default function NumberMergeChainGame({ className = "" }: { className?: string }) {
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [columns, setColumns] = useState<number[][]>([[], [], [], []]);
  const [nextValue, setNextValue] = useState<number>(2);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => getGameHighScore("numbermerge"));

  useEffect(() => {
    setHighScore(getGameHighScore("numbermerge"));
  }, []);

  const VALUES = [2, 4, 8, 16, 32];

  const startGame = () => {
    setColumns([[], [], [], []]);
    setScore(0);
    setNextValue(VALUES[Math.floor(Math.random() * VALUES.length)]);
    setGameState("playing");
  };

  const dropNumber = (colIdx: number) => {
    if (gameState !== "playing") return;

    const col = [...columns[colIdx]];
    if (col.length >= 6) return; // Full column

    col.push(nextValue);

    // Merge check from top to bottom
    let merged = true;
    let gainedScore = 0;
    while (merged && col.length >= 2) {
      const top = col[col.length - 1];
      const second = col[col.length - 2];

      if (top === second) {
        col.pop();
        col[col.length - 1] = top * 2;
        gainedScore += top * 2;
      } else {
        merged = false;
      }
    }

    if (gainedScore > 0) {
      setScore((s) => {
        const next = s + gainedScore;
        saveGameHighScore("numbermerge", next);
        if (next > highScore) setHighScore(next);
        return next;
      });
    }

    const newCols = [...columns];
    newCols[colIdx] = col;
    setColumns(newCols);

    // Check game over
    if (newCols.every((c) => c.length >= 6)) {
      setGameState("gameover");
      saveGameHighScore("numbermerge", score + gainedScore);
      return;
    }

    // Next random value
    setNextValue(VALUES[Math.floor(Math.random() * VALUES.length)]);
  };

  return (
    <div className={`bg-neutral-900 text-white rounded-3xl p-6 border border-neutral-800 shadow-2xl relative overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
        <div>
          <h3 className="font-serif text-2xl font-bold text-amber-400 flex items-center gap-2">
            <Layers className="w-6 h-6 text-amber-400" /> Number Merge Drop (2048 Chain)
          </h3>
          <p className="text-xs text-neutral-400 font-mono">Bir xil sonlarni ustunlarga tushirib birlashtiring!</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
            <span className="text-neutral-400">Navbatdagi:</span> <span className="font-bold text-lg text-emerald-400">{nextValue}</span>
          </div>
          <div className="bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
            <span className="text-neutral-400">Ochko:</span> <span className="font-bold text-lg text-amber-300">{score}</span>
          </div>
        </div>
      </div>

      {/* Columns Grid */}
      <div className="grid grid-cols-4 gap-3 my-4 bg-neutral-950 p-4 rounded-3xl border border-neutral-800 shadow-2xl min-h-[280px]">
        {columns.map((col, cIdx) => (
          <button
            key={cIdx}
            onClick={() => dropNumber(cIdx)}
            className="flex flex-col justify-end gap-2 bg-neutral-900/60 hover:bg-neutral-800/80 p-2 rounded-2xl border border-neutral-800 transition-colors cursor-pointer group"
          >
            {col.map((val, idx) => (
              <div
                key={idx}
                className="w-full py-2.5 rounded-xl bg-amber-500 text-black font-mono font-bold text-center text-sm shadow-md animate-fade-in"
              >
                {val}
              </div>
            ))}
            <div className="text-[10px] text-neutral-600 font-mono text-center group-hover:text-amber-400">
              [Tushirish]
            </div>
          </button>
        ))}
      </div>

      {/* Overlays */}
      {gameState !== "playing" && (
        <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
          {gameState === "idle" ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-3xl flex items-center justify-center mx-auto border border-amber-500/30">
                <Layers className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-3xl font-bold text-white">2048 Chain Drop</h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Sonlarni mos ustunlarga tushiring va zanjirli birlashuvlar hosil qiling!
              </p>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-amber-400 text-black font-mono font-bold rounded-2xl hover:bg-amber-300 transition-all flex items-center gap-2 mx-auto shadow-lg cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black" /> Boshlash
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-serif text-3xl font-bold text-rose-400">Ustunlar To'ldi!</h4>
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-1">
                <p className="text-sm text-neutral-400">Ochko:</p>
                <p className="text-4xl font-mono font-bold text-emerald-400">{score}</p>
              </div>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-amber-400 text-black font-mono font-bold rounded-2xl hover:bg-amber-300 transition-all flex items-center gap-2 mx-auto shadow-lg cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Qayta Boshlash
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
