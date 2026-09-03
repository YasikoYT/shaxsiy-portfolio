import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Layers, Award, Sparkles } from "lucide-react";
import { getGameHighScore, saveGameHighScore } from "../lib/highScores";
import { GameOverModal } from "./GameOverModal";

interface Block {
  x: number;
  y: number;
  width: number;
  color: string;
}

export default function TowerStackGame({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [stackHeight, setStackHeight] = useState(0);
  const [highScore, setHighScore] = useState(() => getGameHighScore("towerstack"));

  useEffect(() => {
    setHighScore(getGameHighScore("towerstack"));
  }, []);

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  const gameEngineRef = useRef({
    blocks: [] as Block[],
    currentX: 0,
    currentVx: 3.5,
    currentWidth: 160,
    blockHeight: 22,
    score: 0,
    animFrameId: 0,
    colorHue: 180,
  });

  const dropBlock = () => {
    if (gameStateRef.current !== "playing") return;
    const engine = gameEngineRef.current;
    const topBlock = engine.blocks[engine.blocks.length - 1];

    if (!topBlock) return;

    const diff = engine.currentX - topBlock.x;
    const absDiff = Math.abs(diff);

    if (absDiff >= engine.currentWidth) {
      // Missed completely -> Game Over
      setGameState("gameover");
      saveGameHighScore("towerstack", engine.score);
      return;
    }

    // Perfect or Sliced drop
    let newWidth = engine.currentWidth;
    let newX = engine.currentX;

    if (absDiff > 3) {
      // Sliced overhang
      newWidth = engine.currentWidth - absDiff;
      newX = diff > 0 ? engine.currentX : topBlock.x;
    } else {
      // Perfect drop snap!
      newX = topBlock.x;
    }

    engine.currentWidth = newWidth;
    engine.colorHue = (engine.colorHue + 25) % 360;

    const newY = topBlock.y - engine.blockHeight;
    const newBlock: Block = {
      x: newX,
      y: newY,
      width: newWidth,
      color: `hsl(${engine.colorHue}, 85%, 60%)`,
    };

    engine.blocks.push(newBlock);
    engine.score++;
    setStackHeight(engine.score);
    if (engine.score > highScore) setHighScore(engine.score);

    // Reset slider
    engine.currentX = 0;
    engine.currentVx = (engine.currentVx > 0 ? 1 : -1) * (3.5 + Math.min(engine.score * 0.1, 4));
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

      if (["Space", " ", "ArrowUp"].includes(e.code) || ["Space", " ", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        dropBlock();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const startGame = () => {
    const engine = gameEngineRef.current;
    const canvasWidth = 360;
    const baseWidth = 160;
    const blockHeight = 22;

    engine.colorHue = 180;
    engine.blocks = [
      {
        x: (canvasWidth - baseWidth) / 2,
        y: 280,
        width: baseWidth,
        color: `hsl(${engine.colorHue}, 85%, 60%)`,
      },
    ];
    engine.currentWidth = baseWidth;
    engine.currentX = 0;
    engine.currentVx = 3.5;
    engine.score = 0;

    setStackHeight(0);
    setGameState("playing");
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const blockHeight = 22;

    let running = true;

    const loop = () => {
      if (!running) return;

      const engine = gameEngineRef.current;

      // Update sliding current block
      engine.currentX += engine.currentVx;
      if (engine.currentX < 0 || engine.currentX + engine.currentWidth > width) {
        engine.currentVx *= -1;
      }

      // Camera Y scroll compensation if stack gets high
      const topBlock = engine.blocks[engine.blocks.length - 1];
      const offsetY = topBlock.y < 120 ? 120 - topBlock.y : 0;

      // Draw Canvas
      ctx.fillStyle = "#0c0c0d";
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(0, offsetY);

      // Draw Stack Blocks
      engine.blocks.forEach((b) => {
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.width, blockHeight - 2, 4);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Sliding Block
      if (topBlock) {
        ctx.fillStyle = `hsl(${engine.colorHue + 25}, 85%, 65%)`;
        ctx.shadowColor = `hsl(${engine.colorHue + 25}, 85%, 65%)`;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.roundRect(engine.currentX, topBlock.y - blockHeight, engine.currentWidth, blockHeight - 2, 4);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.restore();

      gameEngineRef.current.animFrameId = requestAnimationFrame(loop);
    };

    gameEngineRef.current.animFrameId = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(gameEngineRef.current.animFrameId);
    };
  }, [gameState]);

  return (
    <div className={`bg-neutral-900 text-white rounded-3xl p-6 border border-neutral-800 shadow-2xl relative overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
        <div>
          <h3 className="font-serif text-2xl font-bold text-amber-400 flex items-center gap-2">
            <Layers className="w-6 h-6 text-amber-400" /> Tower Stack
          </h3>
          <p className="text-xs text-neutral-400 font-mono">Bloklarni ustma-ust taxlab eng baland minorani quring!</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
            <span className="text-neutral-400">Qavatlar:</span> <span className="font-bold text-lg text-emerald-400">{stackHeight}</span>
          </div>
          <div className="bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
            <span className="text-neutral-400">Rekord:</span> <span className="font-bold text-lg text-amber-300">{highScore}</span>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative flex justify-center cursor-pointer" onClick={dropBlock}>
        <canvas
          ref={canvasRef}
          width={360}
          height={320}
          className="w-full max-w-sm bg-neutral-950 rounded-2xl border border-neutral-800 shadow-inner"
        />
      </div>

      {/* Overlays */}
      {gameState !== "playing" && (
        <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
          {gameState === "idle" ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-3xl flex items-center justify-center mx-auto border border-amber-500/30">
                <Layers className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-3xl font-bold text-white">Tower Stack</h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Ekranga yoki Probel tugmasiga bosib bloklarni bir-birining ustiga aniq tashlang!
              </p>
              <p className="text-xs font-mono text-amber-300">Rekord: {highScore} qavat</p>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-amber-400 text-black font-mono font-bold rounded-2xl hover:bg-amber-300 transition-all flex items-center gap-2 mx-auto shadow-lg cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black" /> Boshlash
              </button>
            </div>
          ) : (
            <div className="absolute inset-0">
              <GameOverModal
                score={stackHeight}
                highScore={highScore}
                gameTitle="TOWER STACK"
                unit="qavat"
                onRestart={startGame}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
