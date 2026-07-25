import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Target, Award, Wind } from "lucide-react";

interface Arrow {
  x: number;
  y: number;
  vx: number;
  vy: number;
  stuck: boolean;
  stuckTargetY?: number;
}

export default function ArcheryShooterGame({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [arrowsLeft, setArrowsLeft] = useState(10);
  const [score, setScore] = useState(0);
  const [power, setPower] = useState(50);
  const [angle, setAngle] = useState(0); // in degrees (-30 to +30)
  const [wind, setWind] = useState(0); // wind force
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("archery_high_score") || "0", 10);
  });

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  const gameEngineRef = useRef({
    targetY: 160,
    targetVy: 2,
    arrow: null as Arrow | null,
    arrowsLeft: 10,
    score: 0,
    wind: 0,
    animFrameId: 0,
  });

  const shootArrow = () => {
    if (gameStateRef.current !== "playing") return;
    const engine = gameEngineRef.current;
    if (engine.arrow || engine.arrowsLeft <= 0) return;

    const rad = (angle * Math.PI) / 180;
    const speed = 12 + (power / 100) * 12;

    engine.arrow = {
      x: 50,
      y: 180,
      vx: Math.cos(rad) * speed,
      vy: Math.sin(rad) * speed,
      stuck: false,
    };

    engine.arrowsLeft--;
    setArrowsLeft(engine.arrowsLeft);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["Space", " ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code) || ["Space", " ", "ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        if (e.code === "Space") shootArrow();
        if (e.code === "ArrowUp") setAngle((a) => Math.max(-35, a - 2));
        if (e.code === "ArrowDown") setAngle((a) => Math.min(35, a + 2));
        if (e.code === "ArrowLeft") setPower((p) => Math.max(20, p - 5));
        if (e.code === "ArrowRight") setPower((p) => Math.min(100, p + 5));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [angle, power]);

  const startGame = () => {
    const engine = gameEngineRef.current;
    engine.targetY = 160;
    engine.targetVy = 2;
    engine.arrow = null;
    engine.arrowsLeft = 10;
    engine.score = 0;
    engine.wind = Math.round((Math.random() - 0.5) * 6);

    setScore(0);
    setArrowsLeft(10);
    setWind(engine.wind);
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
    const targetX = width - 60;
    const targetRadius = 35;

    let running = true;

    const loop = () => {
      if (!running) return;

      const engine = gameEngineRef.current;

      // Move target vertically
      engine.targetY += engine.targetVy;
      if (engine.targetY - targetRadius < 20 || engine.targetY + targetRadius > height - 20) {
        engine.targetVy *= -1;
      }

      // Arrow Physics
      if (engine.arrow) {
        if (!engine.arrow.stuck) {
          engine.arrow.x += engine.arrow.vx;
          engine.arrow.y += engine.arrow.vy;
          engine.arrow.vy += 0.15; // Gravity
          engine.arrow.vy += engine.wind * 0.02; // Wind effect

          // Hit target test
          if (engine.arrow.x >= targetX) {
            const hitDist = Math.abs(engine.arrow.y - engine.targetY);
            if (hitDist <= targetRadius) {
              // Target hit!
              engine.arrow.stuck = true;
              engine.arrow.x = targetX;
              engine.arrow.stuckTargetY = engine.arrow.y - engine.targetY;

              let points = 0;
              if (hitDist <= 8) points = 10; // Bullseye
              else if (hitDist <= 18) points = 7;
              else if (hitDist <= 28) points = 5;
              else points = 3;

              engine.score += points;
              setScore(engine.score);
            } else {
              // Missed target
              engine.arrow = null;
            }

            // New wind for next arrow
            engine.wind = Math.round((Math.random() - 0.5) * 6);
            setWind(engine.wind);

            // Check game completion
            if (engine.arrowsLeft === 0) {
              setTimeout(() => {
                running = false;
                setGameState("gameover");
                setScore((finalScore) => {
                  if (finalScore > highScore) {
                    setHighScore(finalScore);
                    localStorage.setItem("archery_high_score", finalScore.toString());
                  }
                  return finalScore;
                });
              }, 600);
            } else {
              setTimeout(() => {
                engine.arrow = null;
              }, 800);
            }
          } else if (engine.arrow.y > height || engine.arrow.x > width) {
            // Missed screen
            engine.arrow = null;
            engine.wind = Math.round((Math.random() - 0.5) * 6);
            setWind(engine.wind);
            if (engine.arrowsLeft === 0) {
              setGameState("gameover");
            }
          }
        } else if (engine.arrow.stuckTargetY !== undefined) {
          engine.arrow.y = engine.targetY + engine.arrow.stuckTargetY;
        }
      }

      // Draw Canvas
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, width, height);

      // Draw Target (rings)
      ctx.save();
      ctx.translate(targetX, engine.targetY);

      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(0, 0, targetRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(0, 0, targetRadius - 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.arc(0, 0, targetRadius - 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Draw Bow & Shooter at (50, 180)
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(40, 180, 25, (-Math.PI / 3) + (angle * Math.PI) / 180, (Math.PI / 3) + (angle * Math.PI) / 180);
      ctx.stroke();

      // Draw Arrow
      if (engine.arrow) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(engine.arrow.x - 20, engine.arrow.y);
        ctx.lineTo(engine.arrow.x, engine.arrow.y);
        ctx.stroke();

        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.arc(engine.arrow.x, engine.arrow.y, 4, 0, Math.PI * 2);
        ctx.fill();
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
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-800">
        <div>
          <h3 className="font-serif text-2xl font-bold text-amber-400 flex items-center gap-2">
            <Target className="w-6 h-6 text-amber-400" /> Archery Master
          </h3>
          <p className="text-xs text-neutral-400 font-mono">Klaviaturadagi strelkalar orqali burchak va kuchni moslang!</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
            <span className="text-neutral-400">O'qlar:</span> <span className="font-bold text-lg text-amber-300">{arrowsLeft}</span>
          </div>
          <div className="bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
            <span className="text-neutral-400">Ochko:</span> <span className="font-bold text-lg text-emerald-400">{score}</span>
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex items-center justify-between text-xs font-mono mb-3 bg-neutral-950 p-3 rounded-2xl border border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="text-neutral-400">Kuch:</span>
          <div className="w-24 h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400" style={{ width: `${power}%` }} />
          </div>
          <span className="font-bold text-amber-300">{power}%</span>
        </div>
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
          <Wind className="w-4 h-4" /> Shamol: {wind > 0 ? `+${wind}` : wind}
        </div>
        <button
          onClick={shootArrow}
          disabled={gameState !== "playing"}
          className="px-4 py-1.5 bg-amber-400 text-black font-bold rounded-xl hover:bg-amber-300 cursor-pointer shadow"
        >
          Otish (Space)
        </button>
      </div>

      {/* Canvas */}
      <div className="relative flex justify-center">
        <canvas
          ref={canvasRef}
          width={480}
          height={280}
          className="w-full max-w-md bg-neutral-950 rounded-2xl border border-neutral-800 shadow-inner"
        />
      </div>

      {/* Overlays */}
      {gameState !== "playing" && (
        <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
          {gameState === "idle" ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-3xl flex items-center justify-center mx-auto border border-amber-500/30">
                <Target className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-3xl font-bold text-white">Archery Master</h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Harakatlanayotgan nishonga o'q uzib eng yuqori ballni jamlang! Shamol yo'nalishiga e'tibor bering.
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
              <h4 className="font-serif text-3xl font-bold text-amber-400">O'qlar Tugadi!</h4>
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-1">
                <p className="text-sm text-neutral-400">Umumiy Ochko:</p>
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
