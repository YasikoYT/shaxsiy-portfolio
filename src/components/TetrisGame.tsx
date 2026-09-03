import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Volume2, VolumeX, Trophy, Grid, RotateCw, ArrowDown, ArrowLeft, ArrowRight, ChevronsDown } from "lucide-react";
import { getGameHighScore, saveGameHighScore } from "../lib/highScores";
import { GameOverModal } from "./GameOverModal";

interface TetrisProps {
  className?: string;
}

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 18;

const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 0, 0], [1, 1, 1]], // L
  [[0, 0, 1], [1, 1, 1]], // J
  [[0, 1, 1], [1, 1, 0]], // S
  [[1, 1, 0], [0, 1, 1]], // Z
];

const COLORS = [
  "#06b6d4", // cyan
  "#f59e0b", // amber
  "#a855f7", // purple
  "#3b82f6", // blue
  "#f97316", // orange
  "#10b981", // green
  "#ef4444", // red
];

export default function TetrisGame({ className = "" }: TetrisProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameover">("menu");
  const [score, setScore] = useState(0);
  const [linesCleared, setLinesCleared] = useState(0);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(() => getGameHighScore("tetris"));
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setHighScore(getGameHighScore("tetris"));
  }, []);

  const engineRef = useRef({
    grid: Array.from({ length: ROWS }, () => Array(COLS).fill(0)),
    currentPiece: null as { shape: number[][]; x: number; y: number; colorIndex: number } | null,
    score: 0,
    lines: 0,
    level: 1,
    dropInterval: 600,
    lastTime: 0,
  });

  const playBeep = (freq = 440) => {
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

  const spawnPiece = () => {
    const idx = Math.floor(Math.random() * SHAPES.length);
    const shape = SHAPES[idx];
    const piece = {
      shape,
      x: Math.floor((COLS - shape[0].length) / 2),
      y: 0,
      colorIndex: idx,
    };

    if (checkCollision(piece.shape, piece.x, piece.y)) {
      setGameState("gameover");
      saveGameHighScore("tetris", engineRef.current.score);
      playBeep(180);
      return false;
    }

    engineRef.current.currentPiece = piece;
    return true;
  };

  const checkCollision = (shape: number[][], posX: number, posY: number) => {
    const grid = engineRef.current.grid;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const newX = posX + c;
          const newY = posY + r;
          if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
          if (newY >= 0 && grid[newY][newX]) return true;
        }
      }
    }
    return false;
  };

  const rotate = (matrix: number[][]) => {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]).reverse());
  };

  const lockPiece = () => {
    const engine = engineRef.current;
    if (!engine.currentPiece) return;

    const { shape, x, y, colorIndex } = engine.currentPiece;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] && y + r >= 0) {
          engine.grid[y + r][x + c] = colorIndex + 1;
        }
      }
    }

    // Clear completed lines
    let cleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (engine.grid[r].every((cell) => cell > 0)) {
        engine.grid.splice(r, 1);
        engine.grid.unshift(Array(COLS).fill(0));
        cleared++;
        r++;
      }
    }

    if (cleared > 0) {
      engine.lines += cleared;
      engine.score += cleared === 1 ? 100 : cleared === 2 ? 300 : cleared === 3 ? 500 : 800;
      engine.level = Math.floor(engine.lines / 10) + 1;
      engine.dropInterval = Math.max(100, 600 - (engine.level - 1) * 50);

      setScore(engine.score);
      setLinesCleared(engine.lines);
      setLevel(engine.level);
      if (engine.score > highScore) {
        setHighScore(engine.score);
      }
      playBeep(700);
    } else {
      playBeep(350);
    }

    spawnPiece();
  };

  const movePiece = (dirX: number) => {
    const engine = engineRef.current;
    if (!engine.currentPiece) return;
    const { shape, x, y } = engine.currentPiece;
    if (!checkCollision(shape, x + dirX, y)) {
      engine.currentPiece.x += dirX;
    }
  };

  const dropPiece = () => {
    const engine = engineRef.current;
    if (!engine.currentPiece) return;
    const { shape, x, y } = engine.currentPiece;
    if (!checkCollision(shape, x, y + 1)) {
      engine.currentPiece.y += 1;
    } else {
      lockPiece();
    }
  };

  const rotatePiece = () => {
    const engine = engineRef.current;
    if (!engine.currentPiece) return;
    const rotated = rotate(engine.currentPiece.shape);
    if (!checkCollision(rotated, engine.currentPiece.x, engine.currentPiece.y)) {
      engine.currentPiece.shape = rotated;
      playBeep(500);
    }
  };

  const hardDrop = () => {
    const engine = engineRef.current;
    if (!engine.currentPiece || gameState !== "playing") return;
    while (!checkCollision(engine.currentPiece.shape, engine.currentPiece.x, engine.currentPiece.y + 1)) {
      engine.currentPiece.y += 1;
    }
    lockPiece();
  };

  const startGame = () => {
    const engine = engineRef.current;
    engine.grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    engine.score = 0;
    engine.lines = 0;
    engine.level = 1;
    engine.dropInterval = 600;
    setScore(0);
    setLinesCleared(0);
    setLevel(1);
    spawnPiece();
    setGameState("playing");
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
      if (gameState !== "playing") return;
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") movePiece(-1);
      else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") movePiece(1);
      else if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") dropPiece();
      else if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") rotatePiece();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "playing") return;

    let animId: number;
    let lastDropTime = performance.now();

    const render = (now: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const engine = engineRef.current;

      if (now - lastDropTime > engine.dropInterval) {
        dropPiece();
        lastDropTime = now;
      }

      // Clear Canvas
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      for (let r = 0; r <= ROWS; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * BLOCK_SIZE);
        ctx.lineTo(COLS * BLOCK_SIZE, r * BLOCK_SIZE);
        ctx.stroke();
      }
      for (let c = 0; c <= COLS; c++) {
        ctx.beginPath();
        ctx.moveTo(c * BLOCK_SIZE, 0);
        ctx.lineTo(c * BLOCK_SIZE, ROWS * BLOCK_SIZE);
        ctx.stroke();
      }

      // Draw Fixed Grid
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (engine.grid[r][c] > 0) {
            ctx.fillStyle = COLORS[engine.grid[r][c] - 1];
            ctx.fillRect(c * BLOCK_SIZE + 1, r * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
          }
        }
      }

      // Draw Active Piece
      if (engine.currentPiece) {
        const { shape, x, y, colorIndex } = engine.currentPiece;
        ctx.fillStyle = COLORS[colorIndex];
        for (let r = 0; r < shape.length; r++) {
          for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
              ctx.fillRect((x + c) * BLOCK_SIZE + 1, (y + r) * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
            }
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [gameState]);

  return (
    <div className={`relative bg-slate-950 rounded-3xl border border-slate-800 p-3.5 sm:p-5 text-white shadow-2xl flex flex-col justify-between select-none ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Grid className="w-5 h-5 text-cyan-400" />
          <span className="font-mono text-xs font-black uppercase text-cyan-400">TETRIS MATRIX 2077</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-slate-400">Ochko: <strong className="text-white">{score}</strong></span>
          <span className="text-amber-400 flex items-center gap-1"><Trophy className="w-3.5 h-3.5" /> {highScore}</span>
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-slate-400 hover:text-white">
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative w-full max-w-[220px] mx-auto bg-slate-900 rounded-2xl overflow-hidden my-2.5 border border-slate-800 flex items-center justify-center p-2">
        <canvas ref={canvasRef} width={COLS * BLOCK_SIZE} height={ROWS * BLOCK_SIZE} className="block shadow-inner" />

        {gameState === "menu" && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur flex flex-col items-center justify-center p-4 text-center space-y-3">
            <h4 className="font-serif text-xl font-light text-cyan-400 uppercase tracking-wider">TETRIS MATRIX</h4>
            <p className="text-[10px] text-slate-400 font-mono">Ekrandagi tugmalar yoki A/D/S/W bilan boshqaring!</p>
            <button
              onClick={startGame}
              className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-black text-xs uppercase tracking-widest rounded-full flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
            >
              <Play className="w-4 h-4 fill-black" /> Boshlash
            </button>
          </div>
        )}
      </div>

      {/* Mobile Touch Controls */}
      <div className="flex flex-col items-center gap-2 py-1">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => movePiece(-1)}
            className="w-12 h-11 bg-slate-800/80 hover:bg-cyan-500 hover:text-black active:bg-cyan-400 text-white rounded-xl font-bold flex items-center justify-center shadow transition-all border border-slate-700 active:scale-95"
            aria-label="Chapga"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={rotatePiece}
            className="w-14 h-11 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-400 hover:text-black active:bg-cyan-400 rounded-xl font-bold flex items-center justify-center shadow transition-all border border-cyan-500/40 active:scale-95 gap-1 text-xs font-mono"
            aria-label="Aylantirish"
          >
            <RotateCw className="w-4 h-4" /> Burish
          </button>
          <button
            type="button"
            onClick={() => movePiece(1)}
            className="w-12 h-11 bg-slate-800/80 hover:bg-cyan-500 hover:text-black active:bg-cyan-400 text-white rounded-xl font-bold flex items-center justify-center shadow transition-all border border-slate-700 active:scale-95"
            aria-label="O'ngga"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={dropPiece}
            className="w-20 h-10 bg-slate-800/80 hover:bg-slate-700 active:bg-cyan-500 active:text-black text-slate-200 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-1 shadow border border-slate-700 active:scale-95"
            aria-label="Sekin tushirish"
          >
            <ArrowDown className="w-4 h-4" /> Pastga
          </button>
          <button
            type="button"
            onClick={hardDrop}
            className="w-24 h-10 bg-amber-500/20 hover:bg-amber-400 hover:text-black active:bg-amber-400 text-amber-300 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-1 shadow border border-amber-500/40 active:scale-95"
            aria-label="Tez tushirish"
          >
            <ChevronsDown className="w-4 h-4" /> Tashlash
          </button>
        </div>
      </div>

      <div className="text-[10px] font-mono text-slate-400 text-center mt-1">
        Level: <span className="text-cyan-400 font-bold">{level}</span> | Qatorlar: <span className="text-cyan-400 font-bold">{linesCleared}</span>
      </div>

      {gameState === "gameover" && (
        <div onClick={(e) => e.stopPropagation()} className="absolute inset-0 z-30">
          <GameOverModal
            score={score}
            highScore={highScore}
            gameTitle="TETRIS MATRIX"
            unit="ochko"
            onRestart={startGame}
          />
        </div>
      )}
    </div>
  );
}
