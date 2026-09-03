import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Volume2, VolumeX, Trophy, Bot, User } from "lucide-react";
import { getGameHighScore, saveGameHighScore } from "../lib/highScores";

interface PingPongProps {
  className?: string;
}

export default function PingPongGame({ className = "" }: PingPongProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameover">("menu");
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [highScore, setHighScore] = useState(() => getGameHighScore("pingpong"));
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setHighScore(getGameHighScore("pingpong"));
  }, []);

  const engineRef = useRef({
    playerY: 120,
    aiY: 120,
    paddleHeight: 60,
    paddleWidth: 10,
    ballX: 160,
    ballY: 120,
    ballVx: 4,
    ballVy: 3,
    ballRadius: 6,
    speedMultiplier: 1.05
  });

  const playBeep = (freq = 300) => {
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

  const resetBall = (direction = 1) => {
    const engine = engineRef.current;
    engine.ballX = 160;
    engine.ballY = 120;
    engine.ballVx = 3.5 * direction;
    engine.ballVy = (Math.random() - 0.5) * 4;
  };

  const startGame = () => {
    setPlayerScore(0);
    setAiScore(0);
    resetBall(1);
    setGameState("playing");
  };

  useEffect(() => {
    const updatePaddlePos = (clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleY = canvas.height / rect.height;
      const relativeY = (clientY - rect.top) * scaleY;
      const engine = engineRef.current;
      engine.playerY = Math.max(0, Math.min(canvas.height - engine.paddleHeight, relativeY - engine.paddleHeight / 2));
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePaddlePos(e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        updatePaddlePos(e.touches[0].clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
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

      // Wall Bounce (Top / Bottom)
      if (engine.ballY - engine.ballRadius <= 0 || engine.ballY + engine.ballRadius >= canvas.height) {
        engine.ballVy *= -1;
        playBeep(250);
      }

      // AI Paddle Movement
      const aiCenter = engine.aiY + engine.paddleHeight / 2;
      if (aiCenter < engine.ballY - 10) {
        engine.aiY += 3.2;
      } else if (aiCenter > engine.ballY + 10) {
        engine.aiY -= 3.2;
      }
      engine.aiY = Math.max(0, Math.min(canvas.height - engine.paddleHeight, engine.aiY));

      // Player Paddle Collision Check (Left Paddle)
      if (
        engine.ballX - engine.ballRadius <= 20 + engine.paddleWidth &&
        engine.ballY >= engine.playerY &&
        engine.ballY <= engine.playerY + engine.paddleHeight
      ) {
        engine.ballVx = Math.abs(engine.ballVx) * engine.speedMultiplier;
        const deltaY = engine.ballY - (engine.playerY + engine.paddleHeight / 2);
        engine.ballVy = deltaY * 0.2;
        playBeep(500);
      }

      // AI Paddle Collision Check (Right Paddle)
      if (
        engine.ballX + engine.ballRadius >= canvas.width - 20 - engine.paddleWidth &&
        engine.ballY >= engine.aiY &&
        engine.ballY <= engine.aiY + engine.paddleHeight
      ) {
        engine.ballVx = -Math.abs(engine.ballVx) * engine.speedMultiplier;
        const deltaY = engine.ballY - (engine.aiY + engine.paddleHeight / 2);
        engine.ballVy = deltaY * 0.2;
        playBeep(450);
      }

      // Score Points
      if (engine.ballX < 0) {
        // AI Point
        setAiScore((prev) => {
          const next = prev + 1;
          if (next >= 7) setGameState("gameover");
          return next;
        });
        playBeep(150);
        resetBall(1);
      } else if (engine.ballX > canvas.width) {
        // Player Point
        setPlayerScore((prev) => {
          const next = prev + 1;
          if (next >= 7) {
            saveGameHighScore("pingpong", next);
            if (next > highScore) setHighScore(next);
            setGameState("gameover");
          }
          return next;
        });
        playBeep(700);
        resetBall(-1);
      }

      // Render Scene
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Center Dotted Line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Player Paddle
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(20, engine.playerY, engine.paddleWidth, engine.paddleHeight);

      // Draw AI Paddle
      ctx.fillStyle = "#f43f5e";
      ctx.fillRect(canvas.width - 20 - engine.paddleWidth, engine.aiY, engine.paddleWidth, engine.paddleHeight);

      // Draw Ball
      ctx.beginPath();
      ctx.arc(engine.ballX, engine.ballY, engine.ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#f59e0b";
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [gameState]);

  return (
    <div className={`bg-slate-950 rounded-3xl border border-slate-800 p-5 text-white shadow-2xl flex flex-col justify-between ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-sky-400" />
          <span className="font-mono text-xs font-black uppercase text-sky-400">RETRO PONG DUEL</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs">
          <span className="text-sky-400 font-bold">SIZ: {playerScore}</span>
          <span className="text-slate-500">VS</span>
          <span className="text-rose-400 font-bold">ROBOT: {aiScore}</span>
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-slate-400 hover:text-white">
            {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Game Canvas Screen */}
      <div className="relative aspect-[4/3] w-full max-w-[360px] mx-auto bg-slate-900 rounded-2xl overflow-hidden my-3 border border-slate-800 flex items-center justify-center">
        <canvas ref={canvasRef} width={320} height={240} className="w-full h-full block" />

        {gameState === "menu" && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur flex flex-col items-center justify-center p-6 text-center space-y-4">
            <h4 className="font-serif text-2xl font-light text-sky-400 uppercase tracking-wider">RETRO PONG DUEL</h4>
            <p className="text-xs text-slate-400 font-mono">Sichqonchani yuqoriga va pastga surish orqali raketsani boshqaring! 7 ochko yig'gan g'olib bo'ladi.</p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-black font-mono font-black text-xs uppercase tracking-widest rounded-full flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Play className="w-4 h-4 fill-black" /> O'yinni Boshlash
            </button>
          </div>
        )}

        {gameState === "gameover" && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur flex flex-col items-center justify-center p-6 text-center space-y-4">
            <h4 className={`font-serif text-2xl font-bold ${playerScore > aiScore ? "text-emerald-400" : "text-rose-500"}`}>
              {playerScore > aiScore ? "Siz G'olib Bo'ldingiz! 🏆" : "Robot G'olib Bo'ldi!"}
            </h4>
            <p className="text-xs text-slate-300 font-mono">Hisob: {playerScore} - {aiScore}</p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-black font-mono font-black text-xs uppercase tracking-widest rounded-full flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <RotateCcw className="w-4 h-4" /> Qaytadan O'ynash
            </button>
          </div>
        )}
      </div>

      <div className="text-[10px] font-mono text-slate-400 text-center">
        Boshqaruv: <span className="text-sky-400 font-bold">Sichqoncha bilan yuqoriga-pastga harakatlaning</span>
      </div>
    </div>
  );
}
