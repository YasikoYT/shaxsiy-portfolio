import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Target, Award, Zap } from "lucide-react";

interface StuckKnife {
  angle: number; // angle on log
}

interface FlyingKnife {
  y: number;
  active: boolean;
}

export default function KnifeHitGame({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [knivesLeft, setKnivesLeft] = useState(7);
  const [score, setScore] = useState(0);
  const [stage, setStage] = useState(1);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("knife_hit_highscore") || "0", 10);
  });

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  const gameEngineRef = useRef({
    logAngle: 0,
    logSpeed: 0.03,
    stuckKnives: [] as StuckKnife[],
    flyingKnife: null as FlyingKnife | null,
    knivesLeft: 7,
    score: 0,
    stage: 1,
    animFrameId: 0,
  });

  const throwKnife = () => {
    if (gameStateRef.current !== "playing") return;
    const engine = gameEngineRef.current;
    if (engine.flyingKnife || engine.knivesLeft <= 0) return;

    engine.flyingKnife = { y: 280, active: true };
    engine.knivesLeft--;
    setKnivesLeft(engine.knivesLeft);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["Space", " ", "ArrowUp"].includes(e.code) || ["Space", " ", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        throwKnife();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const startGame = () => {
    const engine = gameEngineRef.current;
    engine.logAngle = 0;
    engine.logSpeed = 0.03;
    engine.stuckKnives = [];
    engine.flyingKnife = null;
    engine.knivesLeft = 7;
    engine.score = 0;
    engine.stage = 1;

    setScore(0);
    setStage(1);
    setKnivesLeft(7);
    setGameState("playing");
  };

  const nextStage = () => {
    const engine = gameEngineRef.current;
    engine.stage++;
    engine.stuckKnives = [];
    engine.knivesLeft = 6 + engine.stage;
    engine.logSpeed = (Math.random() < 0.5 ? 1 : -1) * (0.03 + engine.stage * 0.008);
    setStage(engine.stage);
    setKnivesLeft(engine.knivesLeft);
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const logRadius = 45;
    const logX = width / 2;
    const logY = 110;

    let running = true;

    const loop = () => {
      if (!running) return;

      const engine = gameEngineRef.current;

      // Rotate log
      engine.logAngle += engine.logSpeed;

      // Flying knife physics
      if (engine.flyingKnife && engine.flyingKnife.active) {
        engine.flyingKnife.y -= 18;

        // Check collision with log target
        if (engine.flyingKnife.y <= logY + logRadius) {
          // Hit target! Calculate angle on target relative to current rotation
          const relativeAngle = (-Math.PI / 2 - engine.logAngle + Math.PI * 2) % (Math.PI * 2);

          // Check collision with existing stuck knives
          let collided = false;
          for (const k of engine.stuckKnives) {
            const angleDiff = Math.abs((k.angle - relativeAngle + Math.PI * 3) % (Math.PI * 2) - Math.PI);
            if (angleDiff < 0.22) {
              collided = true;
              break;
            }
          }

          if (collided) {
            // Game Over
            running = false;
            setGameState("gameover");
            setScore((finalScore) => {
              if (finalScore > highScore) {
                setHighScore(finalScore);
                localStorage.setItem("knife_hit_highscore", finalScore.toString());
              }
              return finalScore;
            });
            return;
          }

          // Stick knife
          engine.stuckKnives.push({ angle: relativeAngle });
          engine.flyingKnife = null;
          engine.score += 10;
          setScore(engine.score);

          // Stage completion check
          if (engine.knivesLeft === 0) {
            setTimeout(() => {
              nextStage();
            }, 300);
          }
        }
      }

      // Draw Canvas
      ctx.fillStyle = "#0d0d0d";
      ctx.fillRect(0, 0, width, height);

      // Draw Log Target
      ctx.save();
      ctx.translate(logX, logY);
      ctx.rotate(engine.logAngle);

      // Target wood body
      ctx.fillStyle = "#78350f";
      ctx.beginPath();
      ctx.arc(0, 0, logRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#b45309";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, logRadius - 8, 0, Math.PI * 2);
      ctx.stroke();

      // Target center ring
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();

      // Draw Stuck Knives attached to log
      ctx.fillStyle = "#e2e8f0";
      for (const k of engine.stuckKnives) {
        ctx.save();
        ctx.rotate(k.angle);
        ctx.fillRect(-2, logRadius, 4, 30);
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(-3, logRadius + 22, 6, 8);
        ctx.restore();
      }

      ctx.restore();

      // Draw Flying Knife
      if (engine.flyingKnife && engine.flyingKnife.active) {
        ctx.fillStyle = "#f1f5f9";
        ctx.fillRect(logX - 2, engine.flyingKnife.y, 4, 32);
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(logX - 4, engine.flyingKnife.y + 24, 8, 8);
      } else if (engine.knivesLeft > 0) {
        // Draw knife waiting at bottom
        ctx.fillStyle = "#f1f5f9";
        ctx.fillRect(logX - 2, 280, 4, 32);
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(logX - 4, 304, 8, 8);
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
            <Target className="w-6 h-6 text-amber-400" /> Knife Hit
          </h3>
          <p className="text-xs text-neutral-400 font-mono">Boshqa pichoqlarga tegmasdan mo'ljalga pichoq otib teging!</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
            <span className="text-neutral-400">Pichoqlar:</span> <span className="font-bold text-lg text-amber-300">{knivesLeft}</span>
          </div>
          <div className="bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
            <span className="text-neutral-400">Bosqich:</span> <span className="font-bold text-lg text-emerald-400">{stage}</span>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative flex justify-center cursor-pointer" onClick={throwKnife}>
        <canvas
          ref={canvasRef}
          width={360}
          height={340}
          className="w-full max-w-sm bg-neutral-950 rounded-2xl border border-neutral-800 shadow-inner"
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
              <h4 className="font-serif text-3xl font-bold text-white">Knife Hit</h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Ekranga yoki Probel tugmasiga bosib aylanayotgan nishonga barcha pichoqlarni joylashtiring!
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
              <h4 className="font-serif text-3xl font-bold text-red-400">Pichoq Tegib Ketdi!</h4>
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-1">
                <p className="text-sm text-neutral-400">Ochko:</p>
                <p className="text-4xl font-mono font-bold text-emerald-400">{score}</p>
                <p className="text-xs text-neutral-500">Eng yuqori natija: {highScore}</p>
              </div>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-amber-400 text-black font-mono font-bold rounded-2xl hover:bg-amber-300 transition-all flex items-center gap-2 mx-auto shadow-lg cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Qayta Sinash
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
