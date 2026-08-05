import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Rocket, ShieldAlert } from "lucide-react";
import { getGameHighScore, saveGameHighScore } from "../lib/highScores";

interface Invader {
  x: number;
  y: number;
  alive: boolean;
}

interface Bullet {
  x: number;
  y: number;
  dy: number;
  fromPlayer: boolean;
}

export default function SpaceInvadersGame({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover" | "victory">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => getGameHighScore("spaceinvaders"));

  useEffect(() => {
    setHighScore(getGameHighScore("spaceinvaders"));
  }, []);

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  const gameEngineRef = useRef({
    playerX: 180,
    invaders: [] as Invader[],
    invaderDx: 1.5,
    bullets: [] as Bullet[],
    score: 0,
    keys: { left: false, right: false, space: false },
    animFrameId: 0,
    lastShootTime: 0,
  });

  const startGame = () => {
    const engine = gameEngineRef.current;
    const invaders: Invader[] = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 8; col++) {
        invaders.push({
          x: 30 + col * 38,
          y: 30 + row * 28,
          alive: true,
        });
      }
    }

    engine.playerX = 180;
    engine.invaders = invaders;
    engine.invaderDx = 1.5;
    engine.bullets = [];
    engine.score = 0;
    engine.lastShootTime = 0;

    setScore(0);
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

      if (e.code === "ArrowLeft" || e.code === "KeyA") gameEngineRef.current.keys.left = true;
      if (e.code === "ArrowRight" || e.code === "KeyD") gameEngineRef.current.keys.right = true;
      if (e.code === "Space") {
        gameEngineRef.current.keys.space = true;
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") gameEngineRef.current.keys.left = false;
      if (e.code === "ArrowRight" || e.code === "KeyD") gameEngineRef.current.keys.right = false;
      if (e.code === "Space") gameEngineRef.current.keys.space = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    let running = true;

    const loop = () => {
      if (!running) return;

      const engine = gameEngineRef.current;
      const now = Date.now();

      // Controls
      if (engine.keys.left) engine.playerX = Math.max(20, engine.playerX - 4);
      if (engine.keys.right) engine.playerX = Math.min(width - 20, engine.playerX + 4);
      if (engine.keys.space && now - engine.lastShootTime > 300) {
        engine.bullets.push({
          x: engine.playerX,
          y: height - 35,
          dy: -7,
          fromPlayer: true,
        });
        engine.lastShootTime = now;
      }

      // Move Invaders
      let edgeReached = false;
      engine.invaders.forEach((inv) => {
        if (!inv.alive) return;
        inv.x += engine.invaderDx;
        if (inv.x > width - 25 || inv.x < 15) edgeReached = true;
      });

      if (edgeReached) {
        engine.invaderDx *= -1;
        engine.invaders.forEach((inv) => {
          if (inv.alive) inv.y += 12;
        });
      }

      // Invader Shooting
      if (Math.random() < 0.02) {
        const aliveInvaders = engine.invaders.filter((i) => i.alive);
        if (aliveInvaders.length > 0) {
          const randomInvader = aliveInvaders[Math.floor(Math.random() * aliveInvaders.length)];
          engine.bullets.push({
            x: randomInvader.x,
            y: randomInvader.y + 10,
            dy: 4,
            fromPlayer: false,
          });
        }
      }

      // Move Bullets
      for (let i = engine.bullets.length - 1; i >= 0; i--) {
        const b = engine.bullets[i];
        b.y += b.dy;

        // Player bullet hitting invader
        if (b.fromPlayer) {
          for (const inv of engine.invaders) {
            if (inv.alive && Math.abs(b.x - inv.x) < 16 && Math.abs(b.y - inv.y) < 12) {
              inv.alive = false;
              engine.bullets.splice(i, 1);
              engine.score += 50;
              setScore(engine.score);
              saveGameHighScore("spaceinvaders", engine.score);
              if (engine.score > highScore) setHighScore(engine.score);
              break;
            }
          }
        } else {
          // Enemy bullet hitting player
          if (Math.abs(b.x - engine.playerX) < 18 && Math.abs(b.y - (height - 25)) < 12) {
            setGameState("gameover");
            saveGameHighScore("spaceinvaders", engine.score);
            return;
          }
        }

        // Out of bounds
        if (b.y < 0 || b.y > height) {
          engine.bullets.splice(i, 1);
        }
      }

      // Check win or loss by invasion
      const remainingInvaders = engine.invaders.filter((i) => i.alive);
      if (remainingInvaders.length === 0) {
        setGameState("victory");
        return;
      }

      if (remainingInvaders.some((i) => i.y >= height - 60)) {
        setGameState("gameover");
        return;
      }

      // Render
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, width, height);

      // Draw Invaders
      engine.invaders.forEach((inv) => {
        if (!inv.alive) return;
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(inv.x, inv.y, 10, 0, Math.PI * 2);
        ctx.fill();

        // Antennae
        ctx.strokeStyle = "#f87171";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(inv.x - 5, inv.y - 10);
        ctx.lineTo(inv.x - 8, inv.y - 15);
        ctx.moveTo(inv.x + 5, inv.y - 10);
        ctx.lineTo(inv.x + 8, inv.y - 15);
        ctx.stroke();
      });

      // Draw Player Cannon
      ctx.fillStyle = "#10b981";
      ctx.fillRect(engine.playerX - 16, height - 25, 32, 12);
      ctx.fillRect(engine.playerX - 4, height - 32, 8, 8);

      // Draw Bullets
      engine.bullets.forEach((b) => {
        ctx.fillStyle = b.fromPlayer ? "#38bdf8" : "#f59e0b";
        ctx.fillRect(b.x - 2, b.y - 6, 4, 12);
      });

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
          <h3 className="font-serif text-2xl font-bold text-red-400 flex items-center gap-2">
            <Rocket className="w-6 h-6 text-red-400" /> Space Invaders
          </h3>
          <p className="text-xs text-neutral-400 font-mono">Yo'nalish tugmalari [A/D] - Harakat, [SPACE] - Otish!</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
            <span className="text-neutral-400">Ochko:</span> <span className="font-bold text-lg text-emerald-400">{score}</span>
          </div>
          <div className="bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
            <span className="text-neutral-400">Rekord:</span> <span className="font-bold text-lg text-amber-300">{highScore}</span>
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
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          onPointerDown={() => (gameEngineRef.current.keys.left = true)}
          onPointerUp={() => (gameEngineRef.current.keys.left = false)}
          className="px-5 py-2.5 bg-neutral-800 rounded-xl text-xs font-mono font-bold hover:bg-neutral-700 active:scale-95"
        >
          ◄ Chap
        </button>
        <button
          onClick={() => {
            gameEngineRef.current.keys.space = true;
            setTimeout(() => (gameEngineRef.current.keys.space = false), 100);
          }}
          className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-xs font-mono font-bold hover:bg-red-500 active:scale-95 shadow-md"
        >
          🚀 OTISH
        </button>
        <button
          onPointerDown={() => (gameEngineRef.current.keys.right = true)}
          onPointerUp={() => (gameEngineRef.current.keys.right = false)}
          className="px-5 py-2.5 bg-neutral-800 rounded-xl text-xs font-mono font-bold hover:bg-neutral-700 active:scale-95"
        >
          O'ng ►
        </button>
      </div>

      {/* Overlays */}
      {gameState !== "playing" && (
        <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
          {gameState === "idle" ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-3xl flex items-center justify-center mx-auto border border-red-500/30">
                <Rocket className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-3xl font-bold text-white">Space Invaders</h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Koinot bosqinchilarini yo'q qiling va galaktikani saqlang!
              </p>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-red-500 text-white font-mono font-bold rounded-2xl hover:bg-red-400 transition-all flex items-center gap-2 mx-auto shadow-lg cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" /> Boshlash
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-serif text-3xl font-bold text-red-400">
                {gameState === "victory" ? "G'ALABA! 🎉" : "KEMA VAYRON BO'LDI!"}
              </h4>
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-1">
                <p className="text-sm text-neutral-400">Yakuniy Natija:</p>
                <p className="text-4xl font-mono font-bold text-emerald-400">{score}</p>
              </div>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-red-500 text-white font-mono font-bold rounded-2xl hover:bg-red-400 transition-all flex items-center gap-2 mx-auto shadow-lg cursor-pointer"
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
