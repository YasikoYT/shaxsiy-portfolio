import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Volume2, VolumeX, Trophy, Target, Crosshair } from "lucide-react";

interface SniperProps {
  className?: string;
}

interface TargetObj {
  id: number;
  x: number;
  y: number;
  vx: number;
  radius: number;
  points: number;
}

export default function SniperGame({ className = "" }: SniperProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameover">("menu");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [highScore, setHighScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const engineRef = useRef({
    targets: [] as TargetObj[],
    mouseX: 160,
    mouseY: 120,
    score: 0,
    timeLeft: 30
  });

  const playBeep = (freq = 600, type = "sine") => {
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

  const spawnTargets = () => {
    const targets: TargetObj[] = [];
    for (let i = 0; i < 5; i++) {
      targets.push({
        id: i,
        x: Math.random() * 260 + 30,
        y: Math.random() * 160 + 40,
        vx: (Math.random() - 0.5) * 4,
        radius: Math.random() > 0.6 ? 12 : 18,
        points: Math.random() > 0.6 ? 50 : 25
      });
    }
    return targets;
  };

  const startGame = () => {
    const engine = engineRef.current;
    engine.targets = spawnTargets();
    engine.score = 0;
    engine.timeLeft = 30;
    setScore(0);
    setTimeLeft(30);
    setGameState("playing");
  };

  const handleShoot = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;

    const engine = engineRef.current;
    playBeep(200, "sawtooth");

    let hit = false;
    engine.targets.forEach((t) => {
      const dist = Math.hypot(clickX - t.x, clickY - t.y);
      if (dist <= t.radius) {
        hit = true;
        engine.score += t.points;
        setScore(engine.score);
        if (engine.score > highScore) setHighScore(engine.score);
        playBeep(880, "triangle");

        // Respawn target
        t.x = Math.random() * 260 + 30;
        t.y = Math.random() * 160 + 40;
        t.vx = (Math.random() - 0.5) * (4 + engine.score / 200);
      }
    });

    if (!hit) {
      engine.score = Math.max(0, engine.score - 10);
      setScore(engine.score);
    }
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      const engine = engineRef.current;
      engine.timeLeft -= 1;
      setTimeLeft(engine.timeLeft);

      if (engine.timeLeft <= 0) {
        setGameState("gameover");
        playBeep(300);
      }
    }, 1000);

    return () => clearInterval(timer);
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

      // Clear Canvas
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Move Targets
      engine.targets.forEach((t) => {
        t.x += t.vx;
        if (t.x - t.radius <= 0 || t.x + t.radius >= canvas.width) {
          t.vx *= -1;
        }

        // Draw Target Rings
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
        ctx.fillStyle = t.points === 50 ? "#ef4444" : "#f59e0b";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      });

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
          <Crosshair className="w-5 h-5 text-rose-500 animate-spin-slow" />
          <span className="font-mono text-xs font-black uppercase text-rose-500">SNIPER TARGET BLITZ</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-slate-400">Vaqt: <strong className="text-rose-400">{timeLeft}s</strong></span>
          <span className="text-slate-400">Ochko: <strong className="text-white">{score}</strong></span>
          <span className="text-amber-400 flex items-center gap-1"><Trophy className="w-3.5 h-3.5" /> {highScore}</span>
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-slate-400 hover:text-white">
            {soundEnabled ? <Volume2 className="w-4 h-4 text-rose-500" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div 
        onClick={handleShoot}
        className="relative aspect-[4/3] w-full max-w-[360px] mx-auto bg-slate-900 rounded-2xl overflow-hidden my-3 border border-slate-800 flex items-center justify-center cursor-crosshair select-none"
      >
        <canvas ref={canvasRef} width={320} height={240} className="w-full h-full block" />

        {gameState === "menu" && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur flex flex-col items-center justify-center p-6 text-center space-y-4">
            <h4 className="font-serif text-2xl font-light text-rose-500 uppercase tracking-wider">SNIPER BLITZ</h4>
            <p className="text-xs text-slate-400 font-mono">Harakatlanayotgan nishonlarni aniq moljallab bosing! 30 soniyada maksimal ochko to'plang.</p>
            <button
              onClick={(e) => { e.stopPropagation(); startGame(); }}
              className="px-6 py-2.5 bg-rose-500 hover:bg-rose-400 text-black font-mono font-black text-xs uppercase tracking-widest rounded-full flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Play className="w-4 h-4 fill-black" /> O'yinni Boshlash
            </button>
          </div>
        )}

        {gameState === "gameover" && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur flex flex-col items-center justify-center p-6 text-center space-y-4">
            <h4 className="font-serif text-2xl font-bold text-amber-400">VAQT TUGADI! 🎯</h4>
            <p className="text-xs text-slate-300 font-mono">Toplangan Ochko: <span className="text-rose-400 font-bold">{score}</span></p>
            <button
              onClick={(e) => { e.stopPropagation(); startGame(); }}
              className="px-6 py-2.5 bg-rose-500 hover:bg-rose-400 text-black font-mono font-black text-xs uppercase tracking-widest rounded-full flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <RotateCcw className="w-4 h-4" /> Qaytadan O'ynash
            </button>
          </div>
        )}
      </div>

      <div className="text-[10px] font-mono text-slate-400 text-center">
        Boshqaruv: <span className="text-rose-400 font-bold">Nishon ustiga bosing (Kirmasdan oldin o'q teging)</span>
      </div>
    </div>
  );
}
