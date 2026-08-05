import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Volume2, VolumeX, Trophy, Zap } from "lucide-react";
import { getGameHighScore, saveGameHighScore } from "../lib/highScores";

interface FlappyProps {
  className?: string;
}

export default function FlappyBirdGame({ className = "" }: FlappyProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameover">("menu");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => getGameHighScore("flappy"));
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setHighScore(getGameHighScore("flappy"));
  }, []);

  const engineRef = useRef({
    birdY: 140,
    birdVy: 0,
    gravity: 0.38,
    jumpForce: -6.5,
    pipes: [] as { x: number; top: number; bottom: number; passed: boolean }[],
    frame: 0
  });

  const playBeep = (freq = 400) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      // ignore
    }
  };

  const jump = () => {
    if (gameState !== "playing") return;
    const engine = engineRef.current;
    engine.birdVy = engine.jumpForce;
    playBeep(520);
  };

  const startGame = () => {
    const engine = engineRef.current;
    engine.birdY = 140;
    engine.birdVy = 0;
    engine.pipes = [];
    engine.frame = 0;
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

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", " "].includes(e.key) || ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === "Space" || e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
        jump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "playing") return;

    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const engine = engineRef.current;
      engine.frame++;

      // Bird Physics
      engine.birdVy += engine.gravity;
      engine.birdY += engine.birdVy;

      // Pipe Spawning
      if (engine.frame % 90 === 0) {
        const gap = 80;
        const minTop = 30;
        const maxTop = canvas.height - gap - 40;
        const top = Math.floor(Math.random() * (maxTop - minTop)) + minTop;
        engine.pipes.push({
          x: canvas.width,
          top: top,
          bottom: canvas.height - (top + gap),
          passed: false
        });
      }

      // Move Pipes
      engine.pipes.forEach((p) => {
        p.x -= 2;
      });

      // Remove offscreen pipes
      engine.pipes = engine.pipes.filter((p) => p.x > -40);

      // Collisions & Scoring
      const birdRadius = 10;
      const birdX = 60;

      // Ceiling / Floor Collision
      if (engine.birdY - birdRadius <= 0 || engine.birdY + birdRadius >= canvas.height) {
        setGameState("gameover");
        playBeep(180);
        return;
      }

      // Pipe Collisions
      for (const p of engine.pipes) {
        if (birdX + birdRadius > p.x && birdX - birdRadius < p.x + 35) {
          if (engine.birdY - birdRadius < p.top || engine.birdY + birdRadius > canvas.height - p.bottom) {
            setGameState("gameover");
            playBeep(180);
            return;
          }
        }

        if (!p.passed && p.x + 35 < birdX) {
          p.passed = true;
          setScore((s) => {
            const next = s + 1;
            if (next > highScore) setHighScore(next);
            saveGameHighScore("flappy", next);
            return next;
          });
          playBeep(750);
        }
      }

      // Render Scene
      ctx.fillStyle = "#090d16";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render Pipes
      engine.pipes.forEach((p) => {
        // Top Pipe
        ctx.fillStyle = "#10b981";
        ctx.fillRect(p.x, 0, 35, p.top);
        ctx.strokeStyle = "#34d399";
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x, 0, 35, p.top);

        // Bottom Pipe
        ctx.fillRect(p.x, canvas.height - p.bottom, 35, p.bottom);
        ctx.strokeRect(p.x, canvas.height - p.bottom, 35, p.bottom);
      });

      // Render Cyber Bird
      ctx.save();
      ctx.translate(birdX, engine.birdY);
      const angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, engine.birdVy * 0.08));
      ctx.rotate(angle);

      ctx.beginPath();
      ctx.arc(0, 0, birdRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#f59e0b";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Eye
      ctx.beginPath();
      ctx.arc(4, -3, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#000000";
      ctx.fill();

      ctx.restore();

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
          <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
          <span className="font-mono text-xs font-black uppercase text-amber-400">FLAPPY CYBER BIRD</span>
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
      <div 
        onClick={jump}
        className="relative aspect-[4/3] w-full max-w-[360px] mx-auto bg-slate-900 rounded-2xl overflow-hidden my-3 border border-slate-800 flex items-center justify-center cursor-pointer select-none"
      >
        <canvas ref={canvasRef} width={320} height={240} className="w-full h-full block" />

        {gameState === "menu" && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur flex flex-col items-center justify-center p-6 text-center space-y-4">
            <h4 className="font-serif text-2xl font-light text-amber-400 uppercase tracking-wider">FLAPPY BIRD 2077</h4>
            <p className="text-xs text-slate-400 font-mono">Probel / Sichqoncha tugmasini bosib qushni balandlikda ushlab turing!</p>
            <button
              onClick={(e) => { e.stopPropagation(); startGame(); }}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-mono font-black text-xs uppercase tracking-widest rounded-full flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Play className="w-4 h-4 fill-black" /> O'yinni Boshlash
            </button>
          </div>
        )}

        {gameState === "gameover" && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur flex flex-col items-center justify-center p-6 text-center space-y-4">
            <h4 className="font-serif text-2xl font-bold text-red-500">QULADINIGIZ!</h4>
            <p className="text-xs text-slate-300 font-mono">To'plangan Ochko: <span className="text-amber-400 font-bold">{score}</span></p>
            <button
              onClick={(e) => { e.stopPropagation(); startGame(); }}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-mono font-black text-xs uppercase tracking-widest rounded-full flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <RotateCcw className="w-4 h-4" /> Qaytadan O'ynash
            </button>
          </div>
        )}
      </div>

      <div className="text-[10px] font-mono text-slate-400 text-center">
        Boshqaruv: <span className="text-amber-400 font-bold">Probel tugmasi</span> yoki <span className="text-amber-400 font-bold">Ekran ustiga bosing</span>
      </div>
    </div>
  );
}
