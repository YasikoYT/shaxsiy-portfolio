import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Volume2, VolumeX, Trophy, Sparkles } from "lucide-react";
import { getGameHighScore, saveGameHighScore } from "../lib/highScores";
import { GameOverModal } from "./GameOverModal";

interface SnakeProps {
  className?: string;
}

export default function SnakeGame({ className = "" }: SnakeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameover">("menu");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => getGameHighScore("snake"));
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setHighScore(getGameHighScore("snake"));
  }, []);

  const gridCount = 20;

  const gameEngineRef = useRef({
    snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
    dx: 0,
    dy: -1,
    nextDx: 0,
    nextDy: -1,
    food: { x: 15, y: 5 },
    goldenFood: { x: -1, y: -1, active: false, timer: 0 },
    score: 0
  });

  const playBeep = (freq = 400, type = "sine") => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type as OscillatorType;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      // ignore
    }
  };

  const spawnFood = () => {
    const engine = gameEngineRef.current;
    let rx = Math.floor(Math.random() * gridCount);
    let ry = Math.floor(Math.random() * gridCount);
    engine.food = { x: rx, y: ry };

    if (Math.random() < 0.3) {
      engine.goldenFood = {
        x: Math.floor(Math.random() * gridCount),
        y: Math.floor(Math.random() * gridCount),
        active: true,
        timer: 60
      };
    }
  };

  const startGame = () => {
    const engine = gameEngineRef.current;
    engine.snake = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
    engine.dx = 0;
    engine.dy = -1;
    engine.nextDx = 0;
    engine.nextDy = -1;
    engine.score = 0;
    setScore(0);
    spawnFood();
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
      const engine = gameEngineRef.current;
      if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
        if (engine.dy !== 1) { engine.nextDx = 0; engine.nextDy = -1; }
      } else if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
        if (engine.dy !== -1) { engine.nextDx = 0; engine.nextDy = 1; }
      } else if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        if (engine.dx !== 1) { engine.nextDx = -1; engine.nextDy = 0; }
      } else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        if (engine.dx !== -1) { engine.nextDx = 1; engine.nextDy = 0; }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const engine = gameEngineRef.current;
      engine.dx = engine.nextDx;
      engine.dy = engine.nextDy;

      const head = { x: engine.snake[0].x + engine.dx, y: engine.snake[0].y + engine.dy };

      // Wall Collision Check
      if (head.x < 0 || head.x >= gridCount || head.y < 0 || head.y >= gridCount) {
        setGameState("gameover");
        saveGameHighScore("snake", engine.score);
        playBeep(150, "sawtooth");
        return;
      }

      // Self Collision Check
      for (let i = 0; i < engine.snake.length; i++) {
        if (engine.snake[i].x === head.x && engine.snake[i].y === head.y) {
          setGameState("gameover");
          saveGameHighScore("snake", engine.score);
          playBeep(150, "sawtooth");
          return;
        }
      }

      engine.snake.unshift(head);

      // Eat Food Check
      if (head.x === engine.food.x && head.y === engine.food.y) {
        engine.score += 10;
        setScore(engine.score);
        if (engine.score > highScore) {
          setHighScore(engine.score);
          saveGameHighScore("snake", engine.score);
        } else {
          saveGameHighScore("snake", engine.score);
        }
        playBeep(600, "sine");
        spawnFood();
      } else if (engine.goldenFood.active && head.x === engine.goldenFood.x && head.y === engine.goldenFood.y) {
        engine.score += 30;
        setScore(engine.score);
        if (engine.score > highScore) {
          setHighScore(engine.score);
          saveGameHighScore("snake", engine.score);
        } else {
          saveGameHighScore("snake", engine.score);
        }
        engine.goldenFood.active = false;
        playBeep(880, "triangle");
      } else {
        engine.snake.pop();
      }

      if (engine.goldenFood.active) {
        engine.goldenFood.timer -= 1;
        if (engine.goldenFood.timer <= 0) engine.goldenFood.active = false;
      }

      // Render Canvas
      const size = canvas.width / gridCount;
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid Lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      for (let i = 0; i <= gridCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * size, 0);
        ctx.lineTo(i * size, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * size);
        ctx.lineTo(canvas.width, i * size);
        ctx.stroke();
      }

      // Draw Food
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc((engine.food.x + 0.5) * size, (engine.food.y + 0.5) * size, size * 0.4, 0, Math.PI * 2);
      ctx.fill();

      if (engine.goldenFood.active) {
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.arc((engine.goldenFood.x + 0.5) * size, (engine.goldenFood.y + 0.5) * size, size * 0.45, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Snake
      engine.snake.forEach((seg, idx) => {
        ctx.fillStyle = idx === 0 ? "#10b981" : "#34d399";
        ctx.fillRect(seg.x * size + 1, seg.y * size + 1, size - 2, size - 2);
      });

    }, 110);

    return () => clearInterval(interval);
  }, [gameState, highScore]);

  return (
    <div className={`bg-slate-950 rounded-3xl border border-slate-800 p-5 text-white shadow-2xl flex flex-col justify-between ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
          <span className="font-mono text-xs font-black uppercase tracking-wider text-emerald-400">CLASSIC CYBER SNAKE</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-slate-400">Ochko: <strong className="text-white">{score}</strong></span>
          <span className="text-amber-400 flex items-center gap-1"><Trophy className="w-3.5 h-3.5" /> {highScore}</span>
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-slate-400 hover:text-white">
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Canvas Screen */}
      <div className="relative aspect-square w-full max-w-[360px] mx-auto bg-slate-900 rounded-2xl overflow-hidden my-3 border border-slate-800 flex items-center justify-center">
        <canvas ref={canvasRef} width={320} height={320} className="w-full h-full block" />

        {gameState === "menu" && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur flex flex-col items-center justify-center p-6 text-center space-y-4">
            <h4 className="font-serif text-2xl font-light text-emerald-400 uppercase tracking-wider">CYBER SNAKE 2077</h4>
            <p className="text-xs text-slate-400 font-mono">WASD yoki Klaviatura strelkalari bilan ilonni boshqaring!</p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-black text-xs uppercase tracking-widest rounded-full flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Play className="w-4 h-4 fill-black" /> O'yinni Boshlash
            </button>
          </div>
        )}

        {gameState === "gameover" && (
          <GameOverModal
            score={score}
            highScore={highScore}
            gameTitle="CYBER SNAKE"
            unit="ochko"
            onRestart={startGame}
          />
        )}
      </div>

      {/* Instructions footer */}
      <div className="text-[10px] font-mono text-slate-400 text-center">
        Boshqaruv: <span className="text-emerald-400 font-bold">W A S D</span> / <span className="text-emerald-400 font-bold">⬆️ ⬇️ ⬅️ ➡️</span> Strelkalar
      </div>
    </div>
  );
}
