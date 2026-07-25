import React, { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Volume2, VolumeX, Rocket, Trophy, Flame } from "lucide-react";

interface SpaceShooterProps {
  className?: string;
}

export default function SpaceShooter({ className = "" }: SpaceShooterProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const gameStateRef = useRef({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    playerX: 180,
    playerY: 280,
    playerSpeed: 5,
    bullets: [] as { x: number; y: number; vy: number }[],
    enemies: [] as { x: number; y: number; vx: number; vy: number; radius: number; hp: number; maxHp: number; color: string }[],
    stars: [] as { x: number; y: number; speed: number; size: number }[],
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string }[],
    keys: { left: false, right: false, up: false, down: false, space: false },
    lastShot: 0,
    frameCount: 0
  });

  // Sound generator using Web Audio API
  const playSound = (freq: number, type: OscillatorType = "square", duration = 0.1) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio fallback
    }
  };

  useEffect(() => {
    // Load high score
    const saved = localStorage.getItem("spaceshooter_highscore");
    if (saved) setHighScore(parseInt(saved, 10));

    // Initialize stars
    const stars = [];
    for (let i = 0; i < 40; i++) {
      stars.push({
        x: Math.random() * 360,
        y: Math.random() * 340,
        speed: 0.5 + Math.random() * 1.5,
        size: Math.random() * 2 + 0.5
      });
    }
    gameStateRef.current.stars = stars;
  }, []);

  const startGame = () => {
    const state = gameStateRef.current;
    state.isPlaying = true;
    state.isGameOver = false;
    state.score = 0;
    state.playerX = 160;
    state.playerY = 280;
    state.bullets = [];
    state.enemies = [];
    state.particles = [];
    state.frameCount = 0;

    setScore(0);
    setIsPlaying(true);
    setIsGameOver(false);
    playSound(440, "sine", 0.2);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const spawnEnemy = () => {
      const state = gameStateRef.current;
      const radius = 12 + Math.random() * 10;
      const hp = radius > 18 ? 3 : 1;
      const colors = ["#ef4444", "#f97316", "#a855f7", "#ec4899"];
      state.enemies.push({
        x: radius + Math.random() * (360 - radius * 2),
        y: -radius,
        vx: (Math.random() - 0.5) * 1.5,
        vy: 1.2 + Math.random() * 1.8 + state.score * 0.005,
        radius,
        hp,
        maxHp: hp,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    };

    const addParticles = (x: number, y: number, color: string, count = 8) => {
      const state = gameStateRef.current;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        state.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 20 + Math.random() * 15,
          color
        });
      }
    };

    const updateAndRender = () => {
      const state = gameStateRef.current;
      state.frameCount++;

      ctx.save();
      ctx.scale(2, 2);

      ctx.clearRect(0, 0, 360, 340);

      // 1. Background (Dark Space)
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, 360, 340);

      // 2. Stars
      ctx.fillStyle = "#ffffff";
      state.stars.forEach(star => {
        star.y += star.speed;
        if (star.y > 340) {
          star.y = 0;
          star.x = Math.random() * 360;
        }
        ctx.globalAlpha = star.speed / 2;
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });
      ctx.globalAlpha = 1.0;

      if (state.isPlaying && !state.isGameOver) {
        // Player Controls
        if (state.keys.left && state.playerX > 15) state.playerX -= state.playerSpeed;
        if (state.keys.right && state.playerX < 345) state.playerX += state.playerSpeed;
        if (state.keys.up && state.playerY > 20) state.playerY -= state.playerSpeed;
        if (state.keys.down && state.playerY < 320) state.playerY += state.playerSpeed;

        // Auto/Manual Shooting
        if (state.frameCount - state.lastShot > 12) {
          state.bullets.push({ x: state.playerX, y: state.playerY - 15, vy: -7 });
          state.lastShot = state.frameCount;
          playSound(600, "square", 0.05);
        }

        // Spawn Enemies
        if (state.frameCount % Math.max(20, 60 - Math.floor(state.score / 20)) === 0) {
          spawnEnemy();
        }

        // Update Bullets
        for (let i = state.bullets.length - 1; i >= 0; i--) {
          const b = state.bullets[i];
          b.y += b.vy;
          if (b.y < -10) {
            state.bullets.splice(i, 1);
          }
        }

        // Update Enemies
        for (let i = state.enemies.length - 1; i >= 0; i--) {
          const enemy = state.enemies[i];
          enemy.x += enemy.vx;
          enemy.y += enemy.vy;

          // Wall bounce
          if (enemy.x - enemy.radius < 0 || enemy.x + enemy.radius > 360) {
            enemy.vx *= -1;
          }

          // Bullet - Enemy Collision
          for (let j = state.bullets.length - 1; j >= 0; j--) {
            const b = state.bullets[j];
            const dist = Math.hypot(b.x - enemy.x, b.y - enemy.y);
            if (dist < enemy.radius + 4) {
              state.bullets.splice(j, 1);
              enemy.hp--;
              addParticles(b.x, b.y, "#fef08a", 4);
              playSound(300, "sawtooth", 0.04);

              if (enemy.hp <= 0) {
                addParticles(enemy.x, enemy.y, enemy.color, 12);
                playSound(150, "sawtooth", 0.15);
                state.score += enemy.maxHp * 10;
                setScore(state.score);
                if (state.score > highScore) {
                  setHighScore(state.score);
                  localStorage.setItem("spaceshooter_highscore", state.score.toString());
                }
                state.enemies.splice(i, 1);
                break;
              }
            }
          }

          // Enemy - Player Collision
          const playerDist = Math.hypot(state.playerX - enemy.x, state.playerY - enemy.y);
          if (playerDist < enemy.radius + 12) {
            addParticles(state.playerX, state.playerY, "#ef4444", 25);
            playSound(100, "sawtooth", 0.3);
            state.isGameOver = true;
            setIsGameOver(true);
            setIsPlaying(false);
          }

          // Out of screen
          if (enemy.y > 360) {
            state.enemies.splice(i, 1);
          }
        }

        // Update Particles
        for (let i = state.particles.length - 1; i >= 0; i--) {
          const p = state.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life--;
          if (p.life <= 0) {
            state.particles.splice(i, 1);
          }
        }
      }

      // Render Bullets
      ctx.fillStyle = "#38bdf8";
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#38bdf8";
      state.bullets.forEach(b => {
        ctx.fillRect(b.x - 2, b.y - 6, 4, 10);
      });
      ctx.shadowBlur = 0;

      // Render Enemies
      state.enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fill();

        // Eye / Core
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(enemy.x - 2, enemy.y - 2, 4, 4);
      });

      // Render Particles
      state.particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 35;
        ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
      });
      ctx.globalAlpha = 1.0;

      // Render Player Ship
      if (!state.isGameOver) {
        const px = state.playerX;
        const py = state.playerY;

        // Engine Trail Thruster
        ctx.fillStyle = state.frameCount % 4 < 2 ? "#f97316" : "#ef4444";
        ctx.beginPath();
        ctx.moveTo(px - 4, py + 10);
        ctx.lineTo(px, py + 18 + Math.random() * 4);
        ctx.lineTo(px + 4, py + 10);
        ctx.fill();

        // Ship Body
        ctx.fillStyle = "#10b981";
        ctx.beginPath();
        ctx.moveTo(px, py - 14); // Nose
        ctx.lineTo(px + 12, py + 10); // Right Wing
        ctx.lineTo(px, py + 4); // Inner Back
        ctx.lineTo(px - 12, py + 10); // Left Wing
        ctx.closePath();
        ctx.fill();

        // Cockpit
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(px - 2, py - 6, 4, 6);
      }

      // Render UI overlay on canvas
      if (!state.isPlaying && !state.isGameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
        ctx.fillRect(0, 0, 360, 340);

        ctx.fillStyle = "#10b981";
        ctx.font = "bold 16px monospace";
        ctx.textAlign = "center";
        ctx.fillText("🚀 CYBER SPACE SHOOTER", 180, 120);

        ctx.fillStyle = "#a1a1aa";
        ctx.font = "11px monospace";
        ctx.fillText("Surish: Strelkalar yoki Sichqoncha", 180, 150);
        ctx.fillText("Anvar Akramov Pixel Game", 180, 170);
      }

      if (state.isGameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(0, 0, 360, 340);

        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 20px monospace";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER!", 180, 130);

        ctx.fillStyle = "#ffffff";
        ctx.font = "14px monospace";
        ctx.fillText(`NATIJA: ${state.score} REKORD`, 180, 165);
      }

      ctx.restore();

      animId = requestAnimationFrame(updateAndRender);
    };

    animId = requestAnimationFrame(updateAndRender);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events when typing inside inputs or textareas
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      const state = gameStateRef.current;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", " "].includes(e.key) || ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === "ArrowLeft" || e.code === "KeyA") state.keys.left = true;
      if (e.code === "ArrowRight" || e.code === "KeyD") state.keys.right = true;
      if (e.code === "ArrowUp" || e.code === "KeyW") state.keys.up = true;
      if (e.code === "ArrowDown" || e.code === "KeyS") state.keys.down = true;
      if (e.code === "Space") {
        e.preventDefault();
        if (!state.isPlaying) startGame();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const state = gameStateRef.current;
      if (e.code === "ArrowLeft" || e.code === "KeyA") state.keys.left = false;
      if (e.code === "ArrowRight" || e.code === "KeyD") state.keys.right = false;
      if (e.code === "ArrowUp" || e.code === "KeyW") state.keys.up = false;
      if (e.code === "ArrowDown" || e.code === "KeyS") state.keys.down = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [highScore, soundEnabled]);

  // Touch / Mouse Move Control
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 360;
    const y = ((e.clientY - rect.top) / rect.height) * 340;
    const state = gameStateRef.current;
    if (state.isPlaying && !state.isGameOver) {
      state.playerX = Math.max(15, Math.min(345, x));
      state.playerY = Math.max(20, Math.min(320, y));
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !e.touches[0]) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = ((touch.clientX - rect.left) / rect.width) * 360;
    const y = ((touch.clientY - rect.top) / rect.height) * 340;
    const state = gameStateRef.current;
    if (state.isPlaying && !state.isGameOver) {
      state.playerX = Math.max(15, Math.min(345, x));
      state.playerY = Math.max(20, Math.min(320, y));
    }
  };

  return (
    <div className={`bg-neutral-950 border border-neutral-800 rounded-[32px] p-5 shadow-2xl overflow-hidden flex flex-col justify-between ${className}`}>
      {/* Header bar */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-center text-emerald-400">
            <Rocket className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-white tracking-wide block">
              CYBER SPACE SHOOTER
            </span>
            <span className="text-[9px] font-mono text-emerald-400 block">
              ANVAR AKRAMOV ARCADE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-neutral-400 hover:text-white p-1"
            title="O'yin ovozi"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <div className="text-right">
            <span className="text-[9px] font-mono text-neutral-500 block">REKORD</span>
            <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
              <Trophy className="w-3 h-3 inline" /> {highScore}
            </span>
          </div>
        </div>
      </div>

      {/* Canvas view */}
      <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-black flex justify-center">
        <canvas
          ref={canvasRef}
          width={720}
          height={680}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onClick={() => {
            if (!isPlaying) startGame();
          }}
          className="w-full max-w-[360px] aspect-[360/340] object-contain cursor-crosshair touch-none block"
        />

        {/* Floating current score badge */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-mono text-white font-bold flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
          <span>OCHKO: {score}</span>
        </div>
      </div>

      {/* Footer controls */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-[10px] font-mono text-neutral-500">
          STRELKALAR / SICHQONChA // SPACE
        </span>

        {isPlaying && !isGameOver ? (
          <button
            onClick={startGame}
            className="px-4 py-2 bg-neutral-800 text-neutral-200 text-xs font-mono font-bold rounded-xl hover:bg-neutral-700 transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Qayta boshlash
          </button>
        ) : (
          <button
            onClick={startGame}
            className="px-5 py-2.5 bg-emerald-500 text-black text-xs font-mono font-bold rounded-xl hover:bg-emerald-400 transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> {isGameOver ? "QAYTA O'YNASH" : "O'YINNI BOSHLASH"}
          </button>
        )}
      </div>
    </div>
  );
}
