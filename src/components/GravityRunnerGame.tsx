import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Zap, Rocket, Star } from "lucide-react";

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  isCeiling: boolean;
}

interface StarItem {
  x: number;
  y: number;
  collected: boolean;
}

export default function GravityRunnerGame({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("gravity_runner_highscore") || "0", 10);
  });

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  const gameEngineRef = useRef({
    playerY: 180,
    playerVy: 0,
    gravity: 0.8,
    isCeiling: false,
    speed: 4.5,
    score: 0,
    obstacles: [] as Obstacle[],
    stars: [] as StarItem[],
    animFrameId: 0,
    lastSpawn: 0,
  });

  const flipGravity = () => {
    if (gameStateRef.current !== "playing") return;
    const engine = gameEngineRef.current;
    engine.gravity *= -1;
    engine.isCeiling = !engine.isCeiling;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["Space", " ", "ArrowUp", "KeyW"].includes(e.code) || ["Space", " ", "ArrowUp", "w", "W"].includes(e.key)) {
        e.preventDefault();
        flipGravity();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const startGame = () => {
    const engine = gameEngineRef.current;
    engine.playerY = 180;
    engine.playerVy = 0;
    engine.gravity = 0.8;
    engine.isCeiling = false;
    engine.speed = 4.5;
    engine.score = 0;
    engine.obstacles = [];
    engine.stars = [];
    engine.lastSpawn = Date.now();

    setScore(0);
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
    const playerWidth = 24;
    const playerHeight = 24;
    const floorY = height - 30;
    const ceilingY = 30;

    let running = true;

    const loop = () => {
      if (!running) return;

      const engine = gameEngineRef.current;
      engine.score += 0.1;
      setScore(Math.floor(engine.score));
      engine.speed = 4.5 + Math.floor(engine.score / 100) * 0.5;

      // Physics update
      engine.playerVy += engine.gravity;
      engine.playerY += engine.playerVy;

      // Floor & ceiling clamp
      if (engine.playerY + playerHeight >= floorY) {
        engine.playerY = floorY - playerHeight;
        engine.playerVy = 0;
      } else if (engine.playerY <= ceilingY) {
        engine.playerY = ceilingY;
        engine.playerVy = 0;
      }

      // Obstacle & Star Spawning
      const now = Date.now();
      if (now - engine.lastSpawn > Math.max(800, 1600 - engine.score * 2)) {
        engine.lastSpawn = now;
        const isCeil = Math.random() < 0.5;
        const obsWidth = 20 + Math.random() * 20;
        const obsHeight = 35 + Math.random() * 20;

        engine.obstacles.push({
          x: width + 20,
          y: isCeil ? ceilingY : floorY - obsHeight,
          width: obsWidth,
          height: obsHeight,
          isCeiling: isCeil,
        });

        // Spawn star
        if (Math.random() < 0.6) {
          engine.stars.push({
            x: width + 60,
            y: isCeil ? floorY - 50 : ceilingY + 50,
            collected: false,
          });
        }
      }

      // Move obstacles & stars
      engine.obstacles.forEach((obs) => {
        obs.x -= engine.speed;
      });
      engine.stars.forEach((star) => {
        star.x -= engine.speed;
      });

      engine.obstacles = engine.obstacles.filter((obs) => obs.x + obs.width > -50);
      engine.stars = engine.stars.filter((s) => s.x > -50);

      // Collision checks
      const px = 50;
      const py = engine.playerY;

      for (const obs of engine.obstacles) {
        if (
          px < obs.x + obs.width &&
          px + playerWidth > obs.x &&
          py < obs.y + obs.height &&
          py + playerHeight > obs.y
        ) {
          // Game Over
          running = false;
          setGameState("gameover");
          setScore((finalScore) => {
            if (finalScore > highScore) {
              setHighScore(finalScore);
              localStorage.setItem("gravity_runner_highscore", finalScore.toString());
            }
            return finalScore;
          });
          return;
        }
      }

      // Star collection
      for (const star of engine.stars) {
        if (!star.collected && Math.hypot(px + playerWidth / 2 - star.x, py + playerHeight / 2 - star.y) < 25) {
          star.collected = true;
          engine.score += 25;
        }
      }

      // Draw Canvas
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, width, height);

      // Draw Floor & Ceiling Rails
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, 0, width, ceilingY);
      ctx.fillRect(0, floorY, width, height - floorY);

      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(0, ceilingY - 2, width, 2);
      ctx.fillRect(0, floorY, width, 2);

      // Draw Player
      ctx.fillStyle = "#f59e0b";
      ctx.shadowColor = "#f59e0b";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(px, py, playerWidth, playerHeight, 6);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Obstacles (Spikes)
      ctx.fillStyle = "#ef4444";
      for (const obs of engine.obstacles) {
        ctx.beginPath();
        if (obs.isCeiling) {
          ctx.moveTo(obs.x, obs.y);
          ctx.lineTo(obs.x + obs.width / 2, obs.y + obs.height);
          ctx.lineTo(obs.x + obs.width, obs.y);
        } else {
          ctx.moveTo(obs.x, obs.y + obs.height);
          ctx.lineTo(obs.x + obs.width / 2, obs.y);
          ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
        }
        ctx.closePath();
        ctx.fill();
      }

      // Draw Stars
      ctx.fillStyle = "#fbbf24";
      for (const star of engine.stars) {
        if (!star.collected) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, 8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

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
            <Zap className="w-6 h-6 text-amber-400" /> Gravity Runner
          </h3>
          <p className="text-xs text-neutral-400 font-mono">Probeldan foydalanib gravitsiyani o'zgartiring!</p>
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
      <div className="relative flex justify-center cursor-pointer" onClick={flipGravity}>
        <canvas
          ref={canvasRef}
          width={500}
          height={260}
          className="w-full max-w-md bg-neutral-950 rounded-2xl border border-neutral-800 shadow-inner"
        />
      </div>

      {/* Overlays */}
      {gameState !== "playing" && (
        <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
          {gameState === "idle" ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-3xl flex items-center justify-center mx-auto border border-amber-500/30">
                <Rocket className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-3xl font-bold text-white">Gravity Runner</h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Probel yoki ekranga bosish orqali gravitsiyani teppaga va pastga o'zgartirib to'siqlardan qoching!
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
              <h4 className="font-serif text-3xl font-bold text-red-400">To'siqqa Uchildi!</h4>
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-1">
                <p className="text-sm text-neutral-400">To'plangan Ochko:</p>
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
