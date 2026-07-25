import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Layers, Award } from "lucide-react";

interface Floor {
  y: number;
  gapStartAngle: number;
  gapAngleSize: number;
}

export default function HelixJumpGame({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("helix_jump_highscore") || "0", 10);
  });

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  const gameEngineRef = useRef({
    towerAngle: 0,
    ballY: 100,
    ballVy: 0,
    floors: [] as Floor[],
    score: 0,
    animFrameId: 0,
  });

  const startGame = () => {
    const engine = gameEngineRef.current;
    const floors: Floor[] = [];

    for (let i = 1; i <= 15; i++) {
      floors.push({
        y: 150 + i * 90,
        gapStartAngle: Math.random() * Math.PI * 2,
        gapAngleSize: Math.PI / 3, // 60 degrees gap
      });
    }

    engine.towerAngle = 0;
    engine.ballY = 100;
    engine.ballVy = 0;
    engine.floors = floors;
    engine.score = 0;

    setScore(0);
    setGameState("playing");
  };

  const rotateTower = (deltaAngle: number) => {
    if (gameStateRef.current !== "playing") return;
    gameEngineRef.current.towerAngle += deltaAngle;
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
    const bounceVelocity = -8;

    let running = true;

    const loop = () => {
      if (!running) return;

      const engine = gameEngineRef.current;

      // Ball Physics
      engine.ballVy += gravity;
      engine.ballY += engine.ballVy;

      // Check collision with floors
      for (const floor of engine.floors) {
        if (Math.abs(engine.ballY - floor.y) < 8 && engine.ballVy > 0) {
          // Normalize angle
          let currentAngle = (engine.towerAngle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
          let gapStart = (floor.gapStartAngle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
          let gapEnd = (gapStart + floor.gapAngleSize) % (Math.PI * 2);

          let isInGap = false;
          if (gapEnd > gapStart) {
            isInGap = currentAngle >= gapStart && currentAngle <= gapEnd;
          } else {
            isInGap = currentAngle >= gapStart || currentAngle <= gapEnd;
          }

          if (isInGap) {
            // Passed through floor!
            engine.score += 20;
            setScore(engine.score);
          } else {
            // Bounce!
            engine.ballVy = bounceVelocity;
            engine.ballY = floor.y - 10;
          }
        }
      }

      // Check Out of Bounds or Fall
      if (engine.ballY > 1600) {
        setGameState("gameover");
        setScore((finalScore) => {
          if (finalScore > highScore) {
            setHighScore(finalScore);
            localStorage.setItem("helix_jump_highscore", finalScore.toString());
          }
          return finalScore;
        });
        return;
      }

      // Render
      ctx.fillStyle = "#0c0a09";
      ctx.fillRect(0, 0, width, height);

      const cameraOffsetY = height / 2 - engine.ballY;

      // Draw Center Pole
      ctx.fillStyle = "#262626";
      ctx.fillRect(width / 2 - 20, 0, 40, height);

      // Draw Floors
      engine.floors.forEach((floor) => {
        const renderY = floor.y + cameraOffsetY;
        if (renderY < -50 || renderY > height + 50) return;

        ctx.strokeStyle = "#a855f7";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(
          width / 2,
          renderY,
          90,
          floor.gapStartAngle - engine.towerAngle + floor.gapAngleSize,
          floor.gapStartAngle - engine.towerAngle + Math.PI * 2
        );
        ctx.stroke();
      });

      // Draw Bouncing Ball
      ctx.fillStyle = "#38bdf8";
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

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
          <h3 className="font-serif text-2xl font-bold text-purple-400 flex items-center gap-2">
            <Layers className="w-6 h-6 text-purple-400" /> Helix Tower Jump
          </h3>
          <p className="text-xs text-neutral-400 font-mono">Minorani burib to'plar bo'shliqdan tushishini ta'minlang!</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
            <span className="text-neutral-400">Ochko:</span> <span className="font-bold text-lg text-emerald-400">{score}</span>
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

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={() => rotateTower(-0.25)}
          className="px-6 py-3 bg-purple-600 text-white rounded-2xl font-mono font-bold text-xs hover:bg-purple-500 active:scale-95 shadow-md cursor-pointer"
        >
          ◄ Burish Chapga
        </button>
        <button
          onClick={() => rotateTower(0.25)}
          className="px-6 py-3 bg-purple-600 text-white rounded-2xl font-mono font-bold text-xs hover:bg-purple-500 active:scale-95 shadow-md cursor-pointer"
        >
          Burish O'ngga ►
        </button>
      </div>

      {/* Overlays */}
      {gameState !== "playing" && (
        <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
          {gameState === "idle" ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-purple-500/20 text-purple-400 rounded-3xl flex items-center justify-center mx-auto border border-purple-500/30">
                <Layers className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-3xl font-bold text-white">Helix Jump</h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Minorani aylantirib sharni ochiq teshiklardan pastga tushiring!
              </p>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-purple-500 text-white font-mono font-bold rounded-2xl hover:bg-purple-400 transition-all flex items-center gap-2 mx-auto shadow-lg cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" /> Boshlash
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-serif text-3xl font-bold text-purple-400">O'yin Yakunlandi!</h4>
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-1">
                <p className="text-sm text-neutral-400">Ochko:</p>
                <p className="text-4xl font-mono font-bold text-emerald-400">{score}</p>
              </div>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-purple-500 text-white font-mono font-bold rounded-2xl hover:bg-purple-400 transition-all flex items-center gap-2 mx-auto shadow-lg cursor-pointer"
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
