import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Volume2, VolumeX, Trophy, Shield } from "lucide-react";
import { getGameHighScore, saveGameHighScore } from "../lib/highScores";

interface BrickBreakerProps {
  className?: string;
}

export default function BrickBreakerGame({ className = "" }: BrickBreakerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameover" | "victory">("menu");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => getGameHighScore("brick"));
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setHighScore(getGameHighScore("brick"));
  }, []);

  const engineRef = useRef({
    paddleX: 120,
    paddleWidth: 70,
    paddleHeight: 10,
    ballX: 160,
    ballY: 200,
    ballVx: 3.5,
    ballVy: -3.5,
    ballRadius: 5,
    bricks: [] as { x: number; y: number; width: number; height: number; alive: boolean; color: string }[],
    score: 0
  });

  const playBeep = (freq = 500) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      // ignore
    }
  };

  const createBricks = () => {
    const bricks = [];
    const rows = 4;
    const cols = 6;
    const brickW = 45;
    const brickH = 14;
    const padding = 6;
    const offsetTop = 20;
    const offsetLeft = 10;
    const colors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6"];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        bricks.push({
          x: offsetLeft + c * (brickW + padding),
          y: offsetTop + r * (brickH + padding),
          width: brickW,
          height: brickH,
          alive: true,
          color: colors[r]
        });
      }
    }
    return bricks;
  };

  const startGame = () => {
    const engine = engineRef.current;
    engine.paddleX = 125;
    engine.ballX = 160;
    engine.ballY = 200;
    engine.ballVx = (Math.random() > 0.5 ? 1 : -1) * 3.5;
    engine.ballVy = -3.5;
    engine.bricks = createBricks();
    engine.score = 0;
    setScore(0);
    setGameState("playing");
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const engine = engineRef.current;
      engine.paddleX = Math.max(0, Math.min(canvas.width - engine.paddleWidth, mouseX - engine.paddleWidth / 2));
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;

    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const engine = engineRef.current;

      // Move Ball
      engine.ballX += engine.ballVx;
      engine.ballY += engine.ballVy;

      // Wall Bounce (Left / Right)
      if (engine.ballX - engine.ballRadius <= 0 || engine.ballX + engine.ballRadius >= canvas.width) {
        engine.ballVx *= -1;
        playBeep(300);
      }

      // Ceiling Bounce
      if (engine.ballY - engine.ballRadius <= 0) {
        engine.ballVy *= -1;
        playBeep(300);
      }

      // Paddle Collision
      if (
        engine.ballY + engine.ballRadius >= canvas.height - 20 &&
        engine.ballY - engine.ballRadius <= canvas.height - 10 &&
        engine.ballX >= engine.paddleX &&
        engine.ballX <= engine.paddleX + engine.paddleWidth
      ) {
        engine.ballVy = -Math.abs(engine.ballVy);
        const hitPos = (engine.ballX - (engine.paddleX + engine.paddleWidth / 2)) / (engine.paddleWidth / 2);
        engine.ballVx = hitPos * 4.5;
        playBeep(600);
      }

      // Bottom Fall Check
      if (engine.ballY + engine.ballRadius >= canvas.height) {
        setGameState("gameover");
        saveGameHighScore("brick", engine.score);
        playBeep(180);
        return;
      }

      // Brick Collisions
      let remaining = 0;
      engine.bricks.forEach((b) => {
        if (!b.alive) return;
        remaining++;

        if (
          engine.ballX + engine.ballRadius >= b.x &&
          engine.ballX - engine.ballRadius <= b.x + b.width &&
          engine.ballY + engine.ballRadius >= b.y &&
          engine.ballY - engine.ballRadius <= b.y + b.height
        ) {
          b.alive = false;
          engine.ballVy *= -1;
          engine.score += 20;
          setScore(engine.score);
          if (engine.score > highScore) setHighScore(engine.score);
          playBeep(750);
        }
      });

      if (remaining === 0) {
        setGameState("victory");
        saveGameHighScore("brick", engine.score);
        playBeep(900);
        return;
      }

      // Render Scene
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render Bricks
      engine.bricks.forEach((b) => {
        if (!b.alive) return;
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.width, b.height);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.strokeRect(b.x, b.y, b.width, b.height);
      });

      // Render Paddle
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(engine.paddleX, canvas.height - 20, engine.paddleWidth, engine.paddleHeight);

      // Render Ball
      ctx.beginPath();
      ctx.arc(engine.ballX, engine.ballY, engine.ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [gameState, highScore]);

  return (
    <div className={`bg-slate-950 rounded-3xl border border-slate-800 p-5 text-white shadow-2xl flex flex-col justify-between ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-400" />
          <span className="font-mono text-xs font-black uppercase text-amber-400">NEON BRICK BREAKER</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-slate-400">Ochko: <strong className="text-white">{score}</strong></span>
          <span className="text-amber-400 flex items-center gap-1"><Trophy className="w-3.5 h-3.5" /> {highScore}</span>
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-slate-400 hover:text-white">
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative aspect-[4/3] w-full max-w-[360px] mx-auto bg-slate-900 rounded-2xl overflow-hidden my-3 border border-slate-800 flex items-center justify-center">
        <canvas ref={canvasRef} width={320} height={240} className="w-full h-full block" />

        {gameState === "menu" && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur flex flex-col items-center justify-center p-6 text-center space-y-4">
            <h4 className="font-serif text-2xl font-light text-amber-400 uppercase tracking-wider">NEON BRICK BREAKER</h4>
            <p className="text-xs text-slate-400 font-mono">Sichqonchani surib tugmalarni qaytaring va barcha bloklarni urib yo'qoting!</p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-mono font-black text-xs uppercase tracking-widest rounded-full flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Play className="w-4 h-4 fill-black" /> O'yinni Boshlash
            </button>
          </div>
        )}

        {gameState === "gameover" && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur flex flex-col items-center justify-center p-6 text-center space-y-4">
            <h4 className="font-serif text-2xl font-bold text-red-500">TO'P YERGA TUSHDI!</h4>
            <p className="text-xs text-slate-300 font-mono">To'plangan Ochko: <span className="text-amber-400 font-bold">{score}</span></p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-mono font-black text-xs uppercase tracking-widest rounded-full flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <RotateCcw className="w-4 h-4" /> Qaytadan O'ynash
            </button>
          </div>
        )}

        {gameState === "victory" && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur flex flex-col items-center justify-center p-6 text-center space-y-4">
            <h4 className="font-serif text-2xl font-bold text-emerald-400">BARCHA BLOKLAR YO'Q QILINDI! 🏆</h4>
            <p className="text-xs text-slate-300 font-mono">To'plangan Ochko: <span className="text-amber-400 font-bold">{score}</span></p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-mono font-black text-xs uppercase tracking-widest rounded-full flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <RotateCcw className="w-4 h-4" /> Qaytadan O'ynash
            </button>
          </div>
        )}
      </div>

      <div className="text-[10px] font-mono text-slate-400 text-center">
        Boshqaruv: <span className="text-amber-400 font-bold">Sichqonchani chapga-ongga harakatlantiring</span>
      </div>
    </div>
  );
}
