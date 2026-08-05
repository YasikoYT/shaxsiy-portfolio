import React, { useState, useEffect } from "react";
import { Play, RotateCcw, Compass, Award, Flag } from "lucide-react";
import { getGameHighScore, saveGameHighScore } from "../lib/highScores";

// 7x7 Grid Maze (0 = path, 1 = wall, 2 = exit)
const MAZE = [
  [0, 1, 0, 0, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0],
  [1, 1, 0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 1, 0],
  [0, 1, 1, 1, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 2],
];

export default function MazeRunnerGame({ className = "" }: { className?: string }) {
  const [gameState, setGameState] = useState<"idle" | "playing" | "victory">("idle");
  const [playerPos, setPlayerPos] = useState<[number, number]>([0, 0]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [highScore, setHighScore] = useState(() => getGameHighScore("mazerunner"));

  useEffect(() => {
    setHighScore(getGameHighScore("mazerunner"));
  }, []);

  const startGame = () => {
    setPlayerPos([0, 0]);
    setMoves(0);
    setStartTime(Date.now());
    setGameState("playing");
  };

  const movePlayer = (dr: number, dc: number) => {
    if (gameState !== "playing") return;
    const [r, c] = playerPos;
    const nr = r + dr;
    const nc = c + dc;

    if (nr >= 0 && nr < 7 && nc >= 0 && nc < 7) {
      if (MAZE[nr][nc] !== 1) {
        setPlayerPos([nr, nc]);
        setMoves((m) => m + 1);

        if (MAZE[nr][nc] === 2) {
          const finalTime = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
          setGameState("victory");
          saveGameHighScore("mazerunner", finalTime);
          if (highScore === 0 || finalTime < highScore) setHighScore(finalTime);
        }
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target?.isContentEditable ||
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (gameState !== "playing") return;
      if (e.key === "ArrowUp" || e.key === "w") movePlayer(-1, 0);
      if (e.key === "ArrowDown" || e.key === "s") movePlayer(1, 0);
      if (e.key === "ArrowLeft" || e.key === "a") movePlayer(0, -1);
      if (e.key === "ArrowRight" || e.key === "d") movePlayer(0, 1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerPos, gameState]);

  return (
    <div className={`bg-neutral-900 text-white rounded-3xl p-6 border border-neutral-800 shadow-2xl relative overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
        <div>
          <h3 className="font-serif text-2xl font-bold text-amber-400 flex items-center gap-2">
            <Compass className="w-6 h-6 text-amber-400" /> Maze Escape
          </h3>
          <p className="text-xs text-neutral-400 font-mono">Yo'nalish tugmalari [W/A/S/D] orqali labirintdan chiqing!</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
            <span className="text-neutral-400">Yurishlar:</span> <span className="font-bold text-lg text-emerald-400">{moves}</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex flex-col items-center justify-center my-4 space-y-6">
        <div className="grid grid-cols-7 gap-1 bg-neutral-950 p-3 rounded-2xl border border-neutral-800 shadow-2xl">
          {MAZE.map((row, r) =>
            row.map((cell, c) => {
              const isPlayer = playerPos[0] === r && playerPos[1] === c;
              const isWall = cell === 1;
              const isExit = cell === 2;

              return (
                <div
                  key={`${r}-${c}`}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all ${
                    isPlayer
                      ? "bg-amber-400 shadow-lg scale-110 z-10 animate-bounce"
                      : isWall
                      ? "bg-neutral-800 border border-neutral-700"
                      : isExit
                      ? "bg-emerald-500/20 border border-emerald-500/50"
                      : "bg-neutral-900/40"
                  }`}
                >
                  {isPlayer ? "🚶" : isExit ? "🏁" : ""}
                </div>
              );
            })
          )}
        </div>

        {/* Mobile D-Pad */}
        {gameState === "playing" && (
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => movePlayer(-1, 0)}
              className="w-12 h-10 bg-neutral-800 hover:bg-neutral-700 rounded-xl font-bold text-xs"
            >
              ▲
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => movePlayer(0, -1)}
                className="w-12 h-10 bg-neutral-800 hover:bg-neutral-700 rounded-xl font-bold text-xs"
              >
                ◄
              </button>
              <button
                onClick={() => movePlayer(1, 0)}
                className="w-12 h-10 bg-neutral-800 hover:bg-neutral-700 rounded-xl font-bold text-xs"
              >
                ▼
              </button>
              <button
                onClick={() => movePlayer(0, 1)}
                className="w-12 h-10 bg-neutral-800 hover:bg-neutral-700 rounded-xl font-bold text-xs"
              >
                ►
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Overlays */}
      {gameState !== "playing" && (
        <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
          {gameState === "idle" ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-3xl flex items-center justify-center mx-auto border border-amber-500/30">
                <Compass className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-3xl font-bold text-white">Labirintdan Chiqish</h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Eng qisqa yo'lni toping va chiqish bayrog'iga tezroq yetib boring!
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
              <h4 className="font-serif text-3xl font-bold text-emerald-400">LABIRINTDAN CHIQDINGIZ! 🎉</h4>
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-1">
                <p className="text-sm text-neutral-400">Jami qilingan qadamlar:</p>
                <p className="text-4xl font-mono font-bold text-emerald-400">{moves} ta</p>
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
