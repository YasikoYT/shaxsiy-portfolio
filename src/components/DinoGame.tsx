import React, { useEffect, useRef, useState } from "react";
import { getGameHighScore, saveGameHighScore } from "../lib/highScores";
import { GameOverModal } from "./GameOverModal";

interface DinoGameProps {
  className?: string;
}

export default function DinoGame({ className = "" }: DinoGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => getGameHighScore("dino"));

  // Keep game loop state in refs to avoid React re-render lags
  const stateRef = useRef({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    dinoY: 0,
    dinoVy: 0,
    isJumping: false,
    obstacles: [] as { x: number; width: number; height: number; speed: number }[],
    clouds: [] as { x: number; y: number; speed: number; scale: number }[],
    frameCount: 0,
    lastTime: 0,
  });

  const jump = () => {
    const s = stateRef.current;
    if (!s.isPlaying) {
      startGame();
      return;
    }
    if (s.isGameOver) {
      restartGame();
      return;
    }
    if (!s.isJumping) {
      s.dinoVy = 7.5; // Upward jump velocity (positive Y is up)
      s.isJumping = true;
      playBeep(150, 0.1); // Retro jump beep
    }
  };

  // Web Audio API Synth beep for retro feedback
  const playBeep = (frequency: number, duration: number) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "square";
      osc.frequency.value = frequency;
      
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context might be blocked or unsupported
    }
  };

  const startGame = () => {
    const s = stateRef.current;
    s.isPlaying = true;
    s.isGameOver = false;
    s.score = 0;
    s.dinoY = 0;
    s.dinoVy = 0;
    s.isJumping = false;
    s.obstacles = [];
    s.clouds = [
      { x: 150, y: 30, speed: 0.2, scale: 1 },
      { x: 300, y: 15, speed: 0.15, scale: 0.8 },
    ];
    s.frameCount = 0;
    s.lastTime = performance.now();
    
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    playBeep(300, 0.15);
  };

  const restartGame = () => {
    startGame();
  };

  const handleGameOver = () => {
    const s = stateRef.current;
    s.isPlaying = false;
    s.isGameOver = true;
    
    setIsPlaying(false);
    setIsGameOver(true);
    
    playBeep(100, 0.3); // Game over beep
    
    // Save high score
    saveGameHighScore("dino", s.score);
    if (s.score > highScore) {
      setHighScore(s.score);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input, textarea, select or contenteditable element
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

      if (e.code === "Space" || e.code === "ArrowUp") {
        jump();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [highScore]);

  // Main Game Loop using Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const GRAVITY = 0.45;
    const GROUND_Y = 110;
    const DINO_X = 30;
    const DINO_WIDTH = 22;
    const DINO_HEIGHT = 24;

    const gameLoop = (timestamp: number) => {
      const s = stateRef.current;
      
      ctx.save();
      ctx.scale(2, 2);

      // Clear canvas with a stylish grid background matching Artistic Flair
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 320, 140);

      // Draw subtle retro grid
      ctx.strokeStyle = "#f3f4f6";
      ctx.lineWidth = 1;
      for (let i = 0; i < 320; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 140);
        ctx.stroke();
      }
      for (let j = 0; j < 140; j += 20) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(320, j);
        ctx.stroke();
      }

      // Draw ground line
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y);
      ctx.lineTo(320, GROUND_Y);
      ctx.stroke();

      // Only update physics and obstacles if playing
      if (s.isPlaying && !s.isGameOver) {
        s.frameCount++;
        
        // Update score
        if (s.frameCount % 5 === 0) {
          s.score++;
          setScore(s.score);
        }

        // Apply gravity
        if (s.isJumping) {
          s.dinoY += s.dinoVy;
          s.dinoVy -= GRAVITY; // Gravity pulls down
          
          if (s.dinoY <= 0) {
            s.dinoY = 0;
            s.dinoVy = 0;
            s.isJumping = false;
          }
        }

        // Move and spawn clouds
        s.clouds.forEach(cloud => {
          cloud.x -= cloud.speed;
          if (cloud.x < -40) {
            cloud.x = 320 + 20;
            cloud.y = Math.random() * 40 + 10;
          }
        });

        // Spawn obstacles (Cacti)
        // Adjust spawning frequency based on speed
        const spawnRate = Math.max(80, 150 - Math.floor(s.score / 50));
        if (s.frameCount % spawnRate === 0) {
          const cactusHeight = Math.random() > 0.5 ? 24 : 16;
          const cactusWidth = cactusHeight === 24 ? 12 : 8;
          const speedMultiplier = 1.5 + Math.min(2.5, s.score / 200); // Gradual speedup
          s.obstacles.push({
            x: 320,
            width: cactusWidth,
            height: cactusHeight,
            speed: speedMultiplier,
          });
        }

        // Move and filter obstacles
        s.obstacles = s.obstacles.filter(obs => {
          obs.x -= obs.speed;
          
          // Collision check
          const dinoLeft = DINO_X;
          const dinoRight = DINO_X + DINO_WIDTH;
          const dinoBottom = GROUND_Y - s.dinoY;
          const dinoTop = dinoBottom - DINO_HEIGHT;

          const obsLeft = obs.x;
          const obsRight = obs.x + obs.width;
          const obsBottom = GROUND_Y;
          const obsTop = GROUND_Y - obs.height;

          // AABB Collision overlap check with some padding for fairness
          const paddingX = 4;
          const paddingY = 2;
          
          const hitX = (dinoRight - paddingX > obsLeft) && (dinoLeft + paddingX < obsRight);
          const hitY = (dinoBottom - paddingY > obsTop) && (dinoTop + paddingY < obsBottom);

          if (hitX && hitY) {
            handleGameOver();
          }

          return obs.x > -obs.width;
        });
      }

      // --- RENDER CLOUDS ---
      ctx.fillStyle = "#e5e7eb";
      s.clouds.forEach(cloud => {
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, 8 * cloud.scale, 0, Math.PI * 2);
        ctx.arc(cloud.x + 8 * cloud.scale, cloud.y - 3 * cloud.scale, 10 * cloud.scale, 0, Math.PI * 2);
        ctx.arc(cloud.x + 18 * cloud.scale, cloud.y, 8 * cloud.scale, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- RENDER OBSTACLES (Cacti in modern flat black) ---
      ctx.fillStyle = "#000000";
      s.obstacles.forEach(obs => {
        // Draw main cactus stem
        ctx.fillRect(obs.x + obs.width / 3, GROUND_Y - obs.height, obs.width / 3, obs.height);
        // Draw left branch
        if (obs.height > 18) {
          ctx.fillRect(obs.x, GROUND_Y - obs.height * 0.7, obs.width / 3, obs.height * 0.4);
          ctx.fillRect(obs.x, GROUND_Y - obs.height * 0.7, obs.width * 0.6, obs.width / 3);
        }
        // Draw right branch
        ctx.fillRect(obs.x + obs.width * 0.6, GROUND_Y - obs.height * 0.8, obs.width / 3, obs.height * 0.3);
        ctx.fillRect(obs.x + obs.width * 0.4, GROUND_Y - obs.height * 0.8, obs.width * 0.5, obs.width / 3);
      });

      // --- RENDER DINO (Modern Minimalist outline with green details) ---
      const dinoCurrentY = GROUND_Y - s.dinoY - DINO_HEIGHT;
      
      // Draw a beautiful pixel-perfect T-Rex facing right
      ctx.fillStyle = "#22c55e"; // Green dino
      
      // 1. Tail (Left side of DINO_X)
      ctx.fillRect(DINO_X - 6, dinoCurrentY + 10, 6, 6);
      ctx.fillRect(DINO_X - 4, dinoCurrentY + 6, 4, 4);
      ctx.fillRect(DINO_X - 2, dinoCurrentY + 4, 2, 2);

      // 2. Main Body
      ctx.fillRect(DINO_X, dinoCurrentY + 6, 14, 12);
      
      // 3. Neck & Head (Sticks out to the right)
      ctx.fillRect(DINO_X + 8, dinoCurrentY, 8, 8); // Neck
      ctx.fillRect(DINO_X + 10, dinoCurrentY - 4, 12, 6); // Head/Snout
      
      // 4. Eye
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(DINO_X + 16, dinoCurrentY - 3, 2, 2);
      ctx.fillStyle = "#000000";
      ctx.fillRect(DINO_X + 17, dinoCurrentY - 3, 1, 2);
      
      // 5. Tiny cute gold crown representing "AV / Anvar" logo theme
      ctx.fillStyle = "#eab308";
      ctx.beginPath();
      ctx.moveTo(DINO_X + 10, dinoCurrentY - 5);
      ctx.lineTo(DINO_X + 12, dinoCurrentY - 8);
      ctx.lineTo(DINO_X + 14, dinoCurrentY - 5);
      ctx.lineTo(DINO_X + 16, dinoCurrentY - 8);
      ctx.lineTo(DINO_X + 18, dinoCurrentY - 5);
      ctx.closePath();
      ctx.fill();

      // Little short hands
      ctx.fillStyle = "#000000";
      ctx.fillRect(DINO_X + 14, dinoCurrentY + 8, 4, 2);
      ctx.fillRect(DINO_X + 16, dinoCurrentY + 8, 2, 4); // Hand hanging down

      // Dino Legs (animating when on ground)
      const isLegUp = s.isPlaying && !s.isGameOver && !s.isJumping && (Math.floor(s.frameCount / 8) % 2 === 0);
      ctx.fillStyle = "#000000";
      if (isLegUp) {
        // Leg 1 (back) down, Leg 2 (front) up
        ctx.fillRect(DINO_X + 2, dinoCurrentY + 18, 3, 6); // Back leg down
        ctx.fillRect(DINO_X + 9, dinoCurrentY + 18, 3, 3); // Front leg up
      } else {
        // Leg 1 (back) up, Leg 2 (front) down
        ctx.fillRect(DINO_X + 2, dinoCurrentY + 18, 3, 3); // Back leg up
        ctx.fillRect(DINO_X + 9, dinoCurrentY + 18, 3, 6); // Front leg down
      }

      // Draw game over screen overlay inside canvas
      if (s.isGameOver) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
        ctx.fillRect(0, 0, 320, 140);

        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 13px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("O'YIN TUGADI", 160, 45);

        ctx.fillStyle = "#111111";
        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.fillText("Boshlash uchun bosing yoki Space bosing", 160, 65);
        ctx.fillText(`Hisobingiz: ${s.score}`, 160, 85);
      } else if (!s.isPlaying) {
        // Start screen
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.fillRect(0, 0, 320, 140);

        ctx.fillStyle = "#111111";
        ctx.font = "bold 13px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("AV DINO ADVENTURE", 160, 45);

        ctx.fillStyle = "#6b7280";
        ctx.font = "9px 'JetBrains Mono', monospace";
        ctx.fillText("Boshlash uchun istalgan joyga bosing", 160, 65);
        ctx.fillText("Tepa o'q yoki Space - Sakrash", 160, 80);
      }

      ctx.restore();

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [highScore]);

  return (
    <div 
      ref={containerRef}
      className={`border-2 border-black p-4 bg-white rounded-2xl flex flex-col items-stretch relative overflow-hidden select-none ${className}`}
      onClick={jump}
    >
      <div className="flex justify-between items-center mb-2 font-mono text-[10px] uppercase font-bold text-gray-500">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
          <span>Dino TRex Run</span>
        </div>
        <div className="flex gap-4">
          <span>HI {highScore}</span>
          <span className="text-black">SCORE {score}</span>
        </div>
      </div>

      <div className="relative border border-gray-200 bg-white overflow-hidden flex items-center justify-center rounded-xl shadow-inner">
        <canvas 
          ref={canvasRef} 
          width={640} 
          height={280}
          className="w-full aspect-[320/140] block cursor-pointer"
        />
      </div>

      <div className="mt-2.5 flex justify-between items-center">
        <div className="text-[9px] font-mono text-gray-400">
          {!isPlaying && !isGameOver ? "Tayyormisiz?" : isGameOver ? "Yana urunib ko'ring!" : "Omad tilayman!"}
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isGameOver) restartGame();
            else if (!isPlaying) startGame();
            else jump();
          }}
          className="px-3 py-1.5 bg-black text-white hover:bg-neutral-800 text-[10px] font-mono font-bold rounded uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
        >
          {isGameOver ? "Qaytadan" : !isPlaying ? "Boshlash" : "Sakrash 🦖"}
        </button>
      </div>

      {isGameOver && (
        <div onClick={(e) => e.stopPropagation()} className="absolute inset-0 z-30">
          <GameOverModal
            score={score}
            highScore={highScore}
            gameTitle="DINO RUNNER"
            unit="ochko"
            onRestart={restartGame}
          />
        </div>
      )}
    </div>
  );
}
