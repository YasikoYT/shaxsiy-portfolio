import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Zap, Flame, Award } from "lucide-react";
import { getGameHighScore, saveGameHighScore } from "../lib/highScores";
import { GameOverModal } from "./GameOverModal";

interface Fruit {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: "watermelon" | "apple" | "orange" | "banana" | "bomb";
  sliced: boolean;
  color: string;
  emoji: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
}

export default function FruitNinjaGame({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => getGameHighScore("fruitninja"));

  useEffect(() => {
    setHighScore(getGameHighScore("fruitninja"));
  }, []);

  const gameEngineRef = useRef({
    fruits: [] as Fruit[],
    particles: [] as Particle[],
    mouseTrail: [] as { x: number; y: number }[],
    score: 0,
    lastSpawn: 0,
    animFrameId: 0,
  });

  const startGame = () => {
    const engine = gameEngineRef.current;
    engine.fruits = [];
    engine.particles = [];
    engine.mouseTrail = [];
    engine.score = 0;
    engine.lastSpawn = Date.now();

    setScore(0);
    setGameState("playing");
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (gameState !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const engine = gameEngineRef.current;
    engine.mouseTrail.push({ x: mx, y: my });
    if (engine.mouseTrail.length > 8) engine.mouseTrail.shift();

    // Check slice intersection with fruits
    engine.fruits.forEach((fruit) => {
      if (!fruit.sliced) {
        const dist = Math.hypot(mx - fruit.x, my - fruit.y);
        if (dist < fruit.radius + 15) {
          fruit.sliced = true;
          if (fruit.type === "bomb") {
            // Game over
            setGameState("gameover");
            saveGameHighScore("fruitninja", engine.score);
            if (engine.score > highScore) setHighScore(engine.score);
          } else {
            engine.score += 10;
            setScore(engine.score);
            if (engine.score > highScore) setHighScore(engine.score);

            // Spawn juice particles
            for (let i = 0; i < 12; i++) {
              engine.particles.push({
                x: fruit.x,
                y: fruit.y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                color: fruit.color,
                life: 1.0,
              });
            }
          }
        }
      }
    });
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const gravity = 0.35;

    let running = true;

    const loop = () => {
      if (!running) return;

      const engine = gameEngineRef.current;
      const now = Date.now();

      // Spawn Fruit Waves
      if (now - engine.lastSpawn > 1200) {
        engine.lastSpawn = now;
        const count = 1 + Math.floor(Math.random() * 3);
        const types: Array<Fruit["type"]> = ["watermelon", "apple", "orange", "banana", "bomb"];

        for (let i = 0; i < count; i++) {
          const randType = types[Math.floor(Math.random() * (Math.random() < 0.25 ? 5 : 4))];
          const spawnX = 80 + Math.random() * (width - 160);
          
          let col = "#ef4444";
          let emoji = "🍎";
          if (randType === "watermelon") { col = "#22c55e"; emoji = "🍉"; }
          if (randType === "orange") { col = "#f97316"; emoji = "🍊"; }
          if (randType === "banana") { col = "#eab308"; emoji = "🍌"; }
          if (randType === "bomb") { col = "#1e293b"; emoji = "💣"; }

          engine.fruits.push({
            id: Math.random(),
            x: spawnX,
            y: height + 20,
            vx: (spawnX > width / 2 ? -1 : 1) * (1 + Math.random() * 3),
            vy: -(12 + Math.random() * 4),
            radius: randType === "bomb" ? 22 : 28,
            type: randType,
            sliced: false,
            color: col,
            emoji: emoji,
          });
        }
      }

      // Update Fruits
      engine.fruits.forEach((f) => {
        f.x += f.vx;
        f.y += f.vy;
        f.vy += gravity;
      });
      engine.fruits = engine.fruits.filter((f) => f.y < height + 60);

      // Update Particles
      engine.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.04;
      });
      engine.particles = engine.particles.filter((p) => p.life > 0);

      // Draw Canvas
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, width, height);

      // Draw Juice Particles
      engine.particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // Draw Fruits
      ctx.font = "32px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      engine.fruits.forEach((f) => {
        if (!f.sliced) {
          ctx.fillText(f.emoji, f.x, f.y);
        } else {
          // Half sliced visual
          ctx.fillText(f.emoji, f.x - 12, f.y);
          ctx.fillText(f.emoji, f.x + 12, f.y);
        }
      });

      // Draw Mouse Slice Trail
      if (engine.mouseTrail.length > 1) {
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.shadowColor = "#f59e0b";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(engine.mouseTrail[0].x, engine.mouseTrail[0].y);
        for (let i = 1; i < engine.mouseTrail.length; i++) {
          ctx.lineTo(engine.mouseTrail[i].x, engine.mouseTrail[i].y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
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
            <Flame className="w-6 h-6 text-amber-400" /> Fruit Ninja
          </h3>
          <p className="text-xs text-neutral-400 font-mono">Sichqonchani surib mevalarni to'g'rang! Bombaga tegmang!</p>
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
      <div className="relative flex justify-center cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={480}
          height={320}
          onPointerMove={handlePointerMove}
          className="w-full max-w-md bg-neutral-950 rounded-2xl border border-neutral-800 shadow-inner touch-none"
        />
      </div>

      {/* Overlays */}
      {gameState !== "playing" && (
        <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
          {gameState === "idle" ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-3xl flex items-center justify-center mx-auto border border-amber-500/30 text-3xl">
                🍉
              </div>
              <h4 className="font-serif text-3xl font-bold text-white">Fruit Ninja</h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Tepadagi barcha mevalarni qirqib tashlang! Portlovchi bombalardan saqlaning!
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
            <div className="absolute inset-0">
              <GameOverModal
                score={score}
                highScore={highScore}
                gameTitle="FRUIT NINJA"
                unit="ochko"
                onRestart={startGame}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
