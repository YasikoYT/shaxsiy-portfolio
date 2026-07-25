import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, ArrowUp, Award } from "lucide-react";

interface Platform {
  x: number;
  y: number;
  w: number;
  h: number;
}

export default function DoodleJumpGame({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("doodle_jump_highscore") || "0", 10);
  });

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  const gameEngineRef = useRef({
    playerX: 180,
    playerY: 280,
    vy: -10,
    vx: 0,
    platforms: [] as Platform[],
    score: 0,
    animFrameId: 0,
  });

  const startGame = () => {
    const engine = gameEngineRef.current;
    const platforms: Platform[] = [
      { x: 140, y: 320, w: 80, h: 12 },
      { x: 50, y: 240, w: 80, h: 12 },
      { x: 220, y: 180, w: 80, h: 12 },
      { x: 100, y: 100, w: 80, h: 12 },
    ];

    engine.playerX = 180;
    engine.playerY = 280;
    engine.vy = -10;
    engine.vx = 0;
    engine.platforms = platforms;
    engine.score = 0;

    setScore(0);
    setGameState("playing");
  };

  const movePlayer = (dir: number) => {
    if (gameStateRef.current !== "playing") return;
    gameEngineRef.current.vx = dir * 6;
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const gravity = 0.4;
    const jumpPower = -11;

    let running = true;

    const loop = () => {
      if (!running) return;

      const engine = gameEngineRef.current;

      // Physics
      engine.vy += gravity;
      engine.playerY += engine.vy;
      engine.playerX += engine.vx;

      // Friction
      engine.vx *= 0.9;

      // Wrap horizontal walls
      if (engine.playerX < 0) engine.playerX = width;
      if (engine.playerX > width) engine.playerX = 0;

      // Platform collisions (falling down only)
      if (engine.vy > 0) {
        engine.platforms.forEach((p) => {
          if (
            engine.playerX + 12 > p.x &&
            engine.playerX - 12 < p.x + p.w &&
            engine.playerY + 16 >= p.y &&
            engine.playerY + 16 <= p.y + p.h
          ) {
            engine.vy = jumpPower;
          }
        });
      }

      // Camera Scroll Up
      if (engine.playerY < height / 2) {
        const diff = height / 2 - engine.playerY;
        engine.playerY = height / 2;
        engine.score += Math.round(diff);
        setScore(engine.score);

        engine.platforms.forEach((p) => {
          p.y += diff;
          if (p.y > height) {
            p.y = 0;
            p.x = Math.random() * (width - 80);
          }
        });
      }

      // Game Over (fall to bottom)
      if (engine.playerY > height + 20) {
        setGameState("gameover");
        setScore((finalScore) => {
          if (finalScore > highScore) {
            setHighScore(finalScore);
            localStorage.setItem("doodle_jump_highscore", finalScore.toString());
          }
          return finalScore;
        });
        return;
      }

      // Render
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, width, height);

      // Draw Platforms
      engine.platforms.forEach((p) => {
        ctx.fillStyle = "#10b981";
        ctx.shadowColor = "#10b981";
        ctx.shadowBlur = 6;
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.shadowBlur = 0;
      });

      // Draw Player Character
      ctx.fillStyle = "#f59e0b";
      ctx.shadowColor = "#f59e0b";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(engine.playerX, engine.playerY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Eyes
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(engine.playerX - 4, engine.playerY - 4, 3, 0, Math.PI * 2);
      ctx.arc(engine.playerX + 4, engine.playerY - 4, 3, 0, Math.PI * 2);
      ctx.fill();

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
            <ArrowUp className="w-6 h-6 text-amber-400" /> Doodle Jump
          </h3>
          <p className="text-xs text-neutral-400 font-mono">Platformalar uzra yuqoriga sakrab eng baland marrani zabt eting!</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
            <span className="text-neutral-400">Balandlik:</span> <span className="font-bold text-lg text-emerald-400">{score}m</span>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative flex justify-center">
        <canvas
          ref={canvasRef}
          width={360}
          height={340}
          className="w-full max-w-sm bg-neutral-950 rounded-2xl border border-neutral-800 shadow-inner"
        />
      </div>

      {/* Mobile Controls */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <button
          onClick={() => movePlayer(-1)}
          className="px-6 py-3 bg-neutral-800 rounded-2xl text-xs font-mono font-bold hover:bg-neutral-700 active:scale-95 cursor-pointer"
        >
          ◄ Chapga
        </button>
        <button
          onClick={() => movePlayer(1)}
          className="px-6 py-3 bg-neutral-800 rounded-2xl text-xs font-mono font-bold hover:bg-neutral-700 active:scale-95 cursor-pointer"
        >
          O'ngga ►
        </button>
      </div>

      {/* Overlays */}
      {gameState !== "playing" && (
        <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
          {gameState === "idle" ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-3xl flex items-center justify-center mx-auto border border-amber-500/30">
                <ArrowUp className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-3xl font-bold text-white">Doodle Jump</h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Bulut Platformalar uzra sakrang va yuqoriga ko'tariling!
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
              <h4 className="font-serif text-3xl font-bold text-amber-400">Pastga Tushib Ketdingiz!</h4>
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-1">
                <p className="text-sm text-neutral-400">Ershilgan Balandlik:</p>
                <p className="text-4xl font-mono font-bold text-emerald-400">{score}m</p>
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
