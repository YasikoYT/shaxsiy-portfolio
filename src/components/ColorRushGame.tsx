import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Volume2, VolumeX, Trophy, Disc } from "lucide-react";

interface ColorRushProps {
  className?: string;
}

const COLORS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b"];

export default function ColorRushGame({ className = "" }: ColorRushProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameover">("menu");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const engineRef = useRef({
    ballY: 180,
    ballVy: 0,
    gravity: 0.35,
    jumpForce: -6,
    ballColorIdx: 0,
    obstacleAngle: 0,
    obstacleY: 100,
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
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      // ignore
    }
  };

  const jump = () => {
    if (gameState !== "playing") return;
    engineRef.current.ballVy = engineRef.current.jumpForce;
    playBeep(600);
  };

  const startGame = () => {
    const engine = engineRef.current;
    engine.ballY = 180;
    engine.ballVy = 0;
    engine.ballColorIdx = Math.floor(Math.random() * COLORS.length);
    engine.obstacleAngle = 0;
    engine.obstacleY = 100;
    engine.score = 0;
    setScore(0);
    setGameState("playing");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

      // Ball Physics
      engine.ballVy += engine.gravity;
      engine.ballY += engine.ballVy;

      // Obstacle Rotation
      engine.obstacleAngle += 0.03;

      // Screen Boundary Check
      if (engine.ballY > canvas.height + 10 || engine.ballY < -20) {
        setGameState("gameover");
        playBeep(200);
        return;
      }

      // Check Obstacle Passing
      const distToObstacle = Math.abs(engine.ballY - engine.obstacleY);
      if (distToObstacle < 10) {
        // Successful pass
        engine.score += 10;
        setScore(engine.score);
        if (engine.score > highScore) setHighScore(engine.score);
        playBeep(880);

        // Reset obstacle and change color
        engine.obstacleY = 100;
        engine.ballY = 190;
        engine.ballVy = -4;
        engine.ballColorIdx = (engine.ballColorIdx + 1) % COLORS.length;
      }

      // Render Scene
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render Rotating Color Ring
      ctx.save();
      ctx.translate(canvas.width / 2, engine.obstacleY);
      ctx.rotate(engine.obstacleAngle);

      const radius = 45;
      const thickness = 10;

      COLORS.forEach((color, i) => {
        const startAngle = (i * Math.PI) / 2;
        const endAngle = ((i + 1) * Math.PI) / 2;

        ctx.beginPath();
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.stroke();
      });

      ctx.restore();

      // Render Ball
      ctx.beginPath();
      ctx.arc(canvas.width / 2, engine.ballY, 9, 0, Math.PI * 2);
      ctx.fillStyle = COLORS[engine.ballColorIdx];
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

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
          <Disc className="w-5 h-5 text-purple-400 animate-spin" />
          <span className="font-mono text-xs font-black uppercase text-purple-400">COLOR RUSH SWITCH</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-slate-400">Ochko: <strong className="text-white">{score}</strong></span>
          <span className="text-amber-400 flex items-center gap-1"><Trophy className="w-3.5 h-3.5" /> {highScore}</span>
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-slate-400 hover:text-white">
            {soundEnabled ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
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
            <h4 className="font-serif text-2xl font-light text-purple-400 uppercase tracking-wider">COLOR RUSH</h4>
            <p className="text-xs text-slate-400 font-mono">Topni bir xil rangdagi aylanadan o'tkazing!</p>
            <button
              onClick={(e) => { e.stopPropagation(); startGame(); }}
              className="px-6 py-2.5 bg-purple-500 hover:bg-purple-400 text-black font-mono font-black text-xs uppercase tracking-widest rounded-full flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Play className="w-4 h-4 fill-black" /> O'yinni Boshlash
            </button>
          </div>
        )}

        {gameState === "gameover" && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur flex flex-col items-center justify-center p-6 text-center space-y-4">
            <h4 className="font-serif text-2xl font-bold text-red-500">O'YIN TUGADI!</h4>
            <p className="text-xs text-slate-300 font-mono">To'plangan Ochko: <span className="text-purple-400 font-bold">{score}</span></p>
            <button
              onClick={(e) => { e.stopPropagation(); startGame(); }}
              className="px-6 py-2.5 bg-purple-500 hover:bg-purple-400 text-black font-mono font-black text-xs uppercase tracking-widest rounded-full flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <RotateCcw className="w-4 h-4" /> Qaytadan O'ynash
            </button>
          </div>
        )}
      </div>

      <div className="text-[10px] font-mono text-slate-400 text-center">
        Boshqaruv: <span className="text-purple-400 font-bold">Probel</span> yoki <span className="text-purple-400 font-bold">Ekranga bosing</span>
      </div>
    </div>
  );
}
