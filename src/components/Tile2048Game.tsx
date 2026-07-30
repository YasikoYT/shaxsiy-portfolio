import React, { useState, useEffect } from "react";
import { Play, RotateCcw, Volume2, VolumeX, Trophy, Sparkles } from "lucide-react";

interface Tile2048Props {
  className?: string;
}

export default function Tile2048Game({ className = "" }: Tile2048Props) {
  const [board, setBoard] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameover">("menu");
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playBeep = (freq = 500) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      // ignore
    }
  };

  const spawnRandomTile = (currentBoard: number[][]) => {
    const emptyCells: { r: number; c: number }[] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentBoard[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length === 0) return currentBoard;

    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = currentBoard.map((row) => [...row]);
    newBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
    return newBoard;
  };

  const startGame = () => {
    let emptyBoard = Array.from({ length: 4 }, () => Array(4).fill(0));
    emptyBoard = spawnRandomTile(emptyBoard);
    emptyBoard = spawnRandomTile(emptyBoard);
    setBoard(emptyBoard);
    setScore(0);
    setGameState("playing");
  };

  const slideRow = (row: number[]) => {
    let filtered = row.filter((val) => val !== 0);
    let newScoreGain = 0;

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        newScoreGain += filtered[i];
        filtered[i + 1] = 0;
      }
    }

    filtered = filtered.filter((val) => val !== 0);
    while (filtered.length < 4) {
      filtered.push(0);
    }

    return { row: filtered, gain: newScoreGain };
  };

  const rotateBoard = (b: number[][]) => {
    return b[0].map((_, c) => b.map((row) => row[c]).reverse());
  };

  const moveLeft = (b: number[][]) => {
    let totalGain = 0;
    const newBoard = b.map((row) => {
      const { row: newRow, gain } = slideRow(row);
      totalGain += gain;
      return newRow;
    });
    return { board: newBoard, gain: totalGain };
  };

  const handleMove = (direction: "left" | "right" | "up" | "down") => {
    if (gameState !== "playing") return;

    let b = board.map((row) => [...row]);
    let moves = 0;
    if (direction === "left") moves = 0;
    if (direction === "down") moves = 1;
    if (direction === "right") moves = 2;
    if (direction === "up") moves = 3;

    for (let i = 0; i < moves; i++) b = rotateBoard(b);

    const { board: movedBoard, gain } = moveLeft(b);

    let finalBoard = movedBoard;
    for (let i = 0; i < (4 - moves) % 4; i++) finalBoard = rotateBoard(finalBoard);

    const changed = JSON.stringify(board) !== JSON.stringify(finalBoard);

    if (changed) {
      const spawnedBoard = spawnRandomTile(finalBoard);
      setBoard(spawnedBoard);
      setScore((s) => {
        const next = s + gain;
        if (next > highScore) setHighScore(next);
        return next;
      });
      playBeep(400 + gain);

      // Check Game Over
      if (!canMove(spawnedBoard)) {
        setGameState("gameover");
        playBeep(200);
      }
    }
  };

  const canMove = (b: number[][]) => {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (b[r][c] === 0) return true;
        if (c < 3 && b[r][c] === b[r][c + 1]) return true;
        if (r < 3 && b[r][c] === b[r + 1][c]) return true;
      }
    }
    return false;
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

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", " "].includes(e.key) || ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
        e.preventDefault();
      }
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") handleMove("left");
      else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") handleMove("right");
      else if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") handleMove("up");
      else if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") handleMove("down");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [board, gameState]);

  const getTileColor = (val: number) => {
    switch (val) {
      case 2: return "bg-slate-800 text-slate-200";
      case 4: return "bg-amber-950 text-amber-300 border border-amber-800";
      case 8: return "bg-amber-600 text-white font-bold";
      case 16: return "bg-orange-600 text-white font-bold";
      case 32: return "bg-rose-600 text-white font-bold";
      case 64: return "bg-red-600 text-white font-bold";
      case 128: return "bg-yellow-500 text-black font-extrabold shadow-lg";
      case 256: return "bg-emerald-500 text-black font-extrabold shadow-lg";
      case 512: return "bg-cyan-400 text-black font-extrabold shadow-lg";
      case 1024: return "bg-purple-500 text-white font-extrabold shadow-xl";
      case 2048: return "bg-pink-500 text-white font-black shadow-2xl animate-pulse";
      default: return "bg-slate-900/60 text-transparent";
    }
  };

  return (
    <div className={`bg-slate-950 rounded-3xl border border-slate-800 p-5 text-white shadow-2xl flex flex-col justify-between ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="font-mono text-xs font-black uppercase text-amber-400">2077 PUZZLE (2048)</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-slate-400">Ochko: <strong className="text-white">{score}</strong></span>
          <span className="text-amber-400 flex items-center gap-1"><Trophy className="w-3.5 h-3.5" /> {highScore}</span>
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-slate-400 hover:text-white">
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="relative my-3 aspect-square max-w-[300px] w-full mx-auto bg-slate-900 rounded-2xl p-3 border border-slate-800 flex items-center justify-center">
        {gameState === "menu" && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur z-20 rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-4">
            <h4 className="font-serif text-2xl font-light text-amber-400 uppercase tracking-wider">2048 PUZZLE</h4>
            <p className="text-xs text-slate-400 font-mono">Bir xil sonli kataklarni birlashtirib 2048 soniga yetib boring!</p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-mono font-black text-xs uppercase tracking-widest rounded-full flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Play className="w-4 h-4 fill-black" /> O'yinni Boshlash
            </button>
          </div>
        )}

        {gameState === "gameover" && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur z-20 rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-4">
            <h4 className="font-serif text-2xl font-bold text-red-500">YURISHLAR QALMADI!</h4>
            <p className="text-xs text-slate-300 font-mono">To'plangan Ochko: <span className="text-amber-400 font-bold">{score}</span></p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-mono font-black text-xs uppercase tracking-widest rounded-full flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <RotateCcw className="w-4 h-4" /> Qaytadan O'ynash
            </button>
          </div>
        )}

        {/* 4x4 Grid */}
        <div className="grid grid-cols-4 gap-2.5 w-full h-full">
          {board.length > 0
            ? board.map((row, rIdx) =>
                row.map((val, cIdx) => (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`rounded-xl flex items-center justify-center text-sm md:text-base font-mono transition-all duration-150 ${getTileColor(val)}`}
                  >
                    {val > 0 ? val : ""}
                  </div>
                ))
              )
            : Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="bg-slate-900 rounded-xl border border-slate-800" />
              ))}
        </div>
      </div>

      <div className="text-[10px] font-mono text-slate-400 text-center">
        Boshqaruv: <span className="text-amber-400 font-bold">W A S D</span> / <span className="text-amber-400 font-bold">⬆️ ⬇️ ⬅️ ➡️</span> Strelkalar
      </div>
    </div>
  );
}
