import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, CircleDot, Award, Zap } from "lucide-react";

interface Bubble {
  r: number;
  c: number;
  color: string;
  x: number;
  y: number;
}

const COLORS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#a855f7"];

export default function BubbleShooterGame({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("bubble_shooter_highscore") || "0", 10);
  });

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  const gameEngineRef = useRef({
    grid: [] as (string | null)[][],
    shooterAngle: 0,
    currentBubbleColor: COLORS[0],
    nextBubbleColor: COLORS[1],
    bullet: null as { x: number; y: number; vx: number; vy: number; color: string } | null,
    score: 0,
    animFrameId: 0,
  });

  const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

  const startGame = () => {
    const engine = gameEngineRef.current;
    const rows = 6;
    const cols = 8;
    const grid: (string | null)[][] = [];

    for (let r = 0; r < 10; r++) {
      const row: (string | null)[] = [];
      for (let c = 0; c < cols; c++) {
        if (r < rows) {
          row.push(getRandomColor());
        } else {
          row.push(null);
        }
      }
      grid.push(row);
    }

    engine.grid = grid;
    engine.currentBubbleColor = getRandomColor();
    engine.nextBubbleColor = getRandomColor();
    engine.bullet = null;
    engine.shooterAngle = 0;
    engine.score = 0;

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

    const dx = mx - 180;
    const dy = my - 300;
    let angle = Math.atan2(dy, dx);
    // Clamp angle to upward direction
    if (angle > -0.2) angle = -0.2;
    if (angle < -2.9) angle = -2.9;

    gameEngineRef.current.shooterAngle = angle;
  };

  const shootBubble = () => {
    if (gameStateRef.current !== "playing") return;
    const engine = gameEngineRef.current;
    if (engine.bullet) return;

    const angle = engine.shooterAngle;
    const speed = 12;

    engine.bullet = {
      x: 180,
      y: 300,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: engine.currentBubbleColor,
    };

    engine.currentBubbleColor = engine.nextBubbleColor;
    engine.nextBubbleColor = getRandomColor();
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const bubbleRadius = 20;

    let running = true;

    const loop = () => {
      if (!running) return;

      const engine = gameEngineRef.current;

      // Bullet physics
      if (engine.bullet) {
        engine.bullet.x += engine.bullet.vx;
        engine.bullet.y += engine.bullet.vy;

        // Wall bounces
        if (engine.bullet.x - bubbleRadius < 0 || engine.bullet.x + bubbleRadius > width) {
          engine.bullet.vx *= -1;
        }

        // Top wall or grid snap
        if (engine.bullet.y - bubbleRadius <= 0) {
          snapBulletToGrid();
        } else {
          // Check collision with existing bubbles
          let hit = false;
          for (let r = 0; r < engine.grid.length; r++) {
            for (let c = 0; c < engine.grid[r].length; c++) {
              if (engine.grid[r][c]) {
                const bx = c * (bubbleRadius * 2) + bubbleRadius + (r % 2 === 1 ? bubbleRadius / 2 : 0);
                const by = r * (bubbleRadius * 1.8) + bubbleRadius;
                if (Math.hypot(engine.bullet.x - bx, engine.bullet.y - by) < bubbleRadius * 1.8) {
                  hit = true;
                  break;
                }
              }
            }
            if (hit) break;
          }
          if (hit) snapBulletToGrid();
        }
      }

      function snapBulletToGrid() {
        if (!engine.bullet) return;
        const r = Math.max(0, Math.min(9, Math.floor(engine.bullet.y / (bubbleRadius * 1.8))));
        const c = Math.max(0, Math.min(7, Math.floor(engine.bullet.x / (bubbleRadius * 2))));

        if (engine.grid[r]) {
          const shotColor = engine.bullet.color;
          engine.grid[r][c] = shotColor;

          // Helper to get neighbor coordinates
          const getNeighbors = (row: number, col: number) => {
            const neighbors: { r: number; c: number }[] = [];
            const dirs = [
              [-1, 0], [1, 0], [0, -1], [0, 1],
              [-1, -1], [-1, 1], [1, -1], [1, 1]
            ];
            for (const [dr, dc] of dirs) {
              const nr = row + dr;
              const nc = col + dc;
              if (nr >= 0 && nr < 10 && nc >= 0 && nc < 8) {
                neighbors.push({ r: nr, c: nc });
              }
            }
            return neighbors;
          };

          // Find connected bubbles of the same color (BFS)
          const queue: { r: number; c: number }[] = [{ r, c }];
          const visited = new Set<string>();
          visited.add(`${r},${c}`);
          const matches: { r: number; c: number }[] = [];

          while (queue.length > 0) {
            const curr = queue.shift()!;
            matches.push(curr);

            for (const nb of getNeighbors(curr.r, curr.c)) {
              const key = `${nb.r},${nb.c}`;
              if (!visited.has(key) && engine.grid[nb.r]?.[nb.c] === shotColor) {
                visited.add(key);
                queue.push(nb);
              }
            }
          }

          // If 3 or more bubbles match in color, pop them all!
          if (matches.length >= 3) {
            matches.forEach((m) => {
              engine.grid[m.r][m.c] = null;
            });

            // Find and drop floating bubbles that are disconnected from row 0
            const connectedToTop = new Set<string>();
            const topQueue: { r: number; c: number }[] = [];

            for (let col = 0; col < 8; col++) {
              if (engine.grid[0][col] !== null) {
                topQueue.push({ r: 0, c: col });
                connectedToTop.add(`0,${col}`);
              }
            }

            while (topQueue.length > 0) {
              const curr = topQueue.shift()!;
              for (const nb of getNeighbors(curr.r, curr.c)) {
                const key = `${nb.r},${nb.c}`;
                if (!connectedToTop.has(key) && engine.grid[nb.r]?.[nb.c] !== null) {
                  connectedToTop.add(key);
                  topQueue.push(nb);
                }
              }
            }

            let droppedCount = 0;
            for (let row = 0; row < 10; row++) {
              for (let col = 0; col < 8; col++) {
                if (engine.grid[row][col] !== null && !connectedToTop.has(`${row},${col}`)) {
                  engine.grid[row][col] = null;
                  droppedCount++;
                }
              }
            }

            // Award points: 30 pts per matched bubble + 50 pts per dropped bubble
            const pts = matches.length * 30 + droppedCount * 50;
            engine.score += pts;
            setScore(engine.score);

            // Check if grid is completely cleared
            const isEmpty = engine.grid.every((row) => row.every((cell) => cell === null));
            if (isEmpty) {
              engine.score += 500; // Clearing bonus
              setScore(engine.score);
              // Respawn new wave
              for (let row = 0; row < 5; row++) {
                for (let col = 0; col < 8; col++) {
                  engine.grid[row][col] = getRandomColor();
                }
              }
            }
          } else {
            // Just single shot score if less than 3
            engine.score += 10;
            setScore(engine.score);
          }
        }

        engine.bullet = null;

        // Check loss condition
        if (engine.grid[8].some((cell) => cell !== null)) {
          setGameState("gameover");
          setScore((finalScore) => {
            if (finalScore > highScore) {
              setHighScore(finalScore);
              localStorage.setItem("bubble_shooter_highscore", finalScore.toString());
            }
            return finalScore;
          });
        }
      }

      // Draw Canvas
      ctx.fillStyle = "#0c0a09";
      ctx.fillRect(0, 0, width, height);

      // Draw Grid Bubbles
      for (let r = 0; r < engine.grid.length; r++) {
        for (let c = 0; c < engine.grid[r].length; c++) {
          const color = engine.grid[r][c];
          if (color) {
            const bx = c * (bubbleRadius * 2) + bubbleRadius;
            const by = r * (bubbleRadius * 1.8) + bubbleRadius;

            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(bx, by, bubbleRadius - 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // Draw Shooter Line
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(180, 300);
      ctx.lineTo(180 + Math.cos(engine.shooterAngle) * 40, 300 + Math.sin(engine.shooterAngle) * 40);
      ctx.stroke();

      // Draw Bullet / Ready Bubble
      if (engine.bullet) {
        ctx.fillStyle = engine.bullet.color;
        ctx.beginPath();
        ctx.arc(engine.bullet.x, engine.bullet.y, bubbleRadius - 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = engine.currentBubbleColor;
        ctx.beginPath();
        ctx.arc(180, 300, bubbleRadius - 2, 0, Math.PI * 2);
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
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
        <div>
          <h3 className="font-serif text-2xl font-bold text-amber-400 flex items-center gap-2">
            <CircleDot className="w-6 h-6 text-amber-400" /> Bubble Shooter
          </h3>
          <p className="text-xs text-neutral-400 font-mono">Sichqoncha bilan mo'ljal olib sharlarni otib tashlang!</p>
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
          width={360}
          height={340}
          onPointerMove={handlePointerMove}
          onClick={shootBubble}
          className="w-full max-w-sm bg-neutral-950 rounded-2xl border border-neutral-800 shadow-inner"
        />
      </div>

      {/* Overlays */}
      {gameState !== "playing" && (
        <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
          {gameState === "idle" ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-3xl flex items-center justify-center mx-auto border border-amber-500/30">
                <CircleDot className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-3xl font-bold text-white">Bubble Shooter</h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Bir xil rangdagi sharlarni mo'ljalga olib urib tushiring va maydonni tozalang!
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
              <h4 className="font-serif text-3xl font-bold text-red-400">Sharlar Pastga Tushdi!</h4>
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
