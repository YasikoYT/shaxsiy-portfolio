import React, { useEffect, useState, useCallback } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, Sparkles, Award, Star, Flame, Check } from "lucide-react";

export interface ConfettiRecordData {
  gameId?: string;
  gameName?: string;
  score?: number;
  unit?: string;
}

interface ConfettiProps {
  /** Optional manual trigger data */
  recordData?: ConfettiRecordData | null;
  /** Callback when banner finishes displaying */
  onClose?: () => void;
}

/**
 * Triggers a web-audio fanfare sound effect for celebrating high scores.
 */
function playCelebrationSound() {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === notes.length - 1 ? "triangle" : "sine";
      osc.frequency.value = freq;

      const startTime = ctx.currentTime + idx * 0.1;
      const duration = idx === notes.length - 1 ? 0.8 : 0.25;

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch (e) {
    console.warn("Audio Context sound suppressed:", e);
  }
}

/**
 * Launches canvas confetti bursts from multiple angles.
 */
export function fireConfettiAnimation() {
  // Center burst
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#8b5cf6", "#ef4444"]
  });

  // Cannon left
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ["#fbbf24", "#f43f5e", "#8b5cf6"]
    });
  }, 200);

  // Cannon right
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ["#34d399", "#60a5fa", "#f472b6"]
    });
  }, 400);

  // Gold stars shower
  setTimeout(() => {
    confetti({
      particleCount: 30,
      spread: 100,
      origin: { y: 0.4 },
      shapes: ["star"],
      colors: ["#ffd700", "#ffae00", "#ffffff"]
    });
  }, 650);
}

export default function Confetti({ recordData: propRecordData, onClose }: ConfettiProps) {
  const [activeBanner, setActiveBanner] = useState<ConfettiRecordData | null>(null);

  const triggerCelebration = useCallback((data: ConfettiRecordData) => {
    setActiveBanner(data);
    fireConfettiAnimation();
    playCelebrationSound();

    // Auto dismiss after 4.5 seconds
    const timer = setTimeout(() => {
      setActiveBanner(null);
      if (onClose) onClose();
    }, 4500);

    return () => clearTimeout(timer);
  }, [onClose]);

  // Handle manual prop trigger
  useEffect(() => {
    if (propRecordData && propRecordData.score && propRecordData.score > 0) {
      triggerCelebration(propRecordData);
    }
  }, [propRecordData, triggerCelebration]);

  // Listen for global custom event "new_record_achieved"
  useEffect(() => {
    const handleNewRecord = (e: Event) => {
      const customEvent = e as CustomEvent<ConfettiRecordData>;
      if (customEvent.detail && customEvent.detail.score) {
        triggerCelebration(customEvent.detail);
      }
    };

    window.addEventListener("new_record_achieved", handleNewRecord);
    return () => {
      window.removeEventListener("new_record_achieved", handleNewRecord);
    };
  }, [triggerCelebration]);

  return (
    <AnimatePresence>
      {activeBanner && (
        <div className="fixed inset-0 z-[9999] pointer-events-none flex items-start justify-center pt-8 sm:pt-14 px-4">
          <motion.div
            initial={{ opacity: 0, y: -60, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="pointer-events-auto max-w-md w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 p-[2px] rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.5)] overflow-hidden"
          >
            <div className="bg-[#121624] p-5 sm:p-6 rounded-[22px] flex flex-col items-center text-center space-y-3 relative overflow-hidden">
              {/* Background ambient glow */}
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl" />

              {/* Animated Trophy Badge */}
              <motion.div
                initial={{ rotate: -15, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-black shadow-lg shadow-amber-500/40 relative"
              >
                <Trophy className="w-9 h-9 text-black drop-shadow" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-2xl border-2 border-dashed border-black/30"
                />
              </motion.div>

              {/* Celebration Title */}
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-[11px] font-mono font-bold text-amber-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> YANGI REKORD!
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white">
                  YANGI SHAXSIY REKORD!
                </h2>
                {activeBanner.gameName && (
                  <p className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wide">
                    🎮 {activeBanner.gameName}
                  </p>
                )}
              </div>

              {/* Score Display */}
              <div className="py-2 px-6 rounded-2xl bg-black/60 border border-amber-500/30 w-full flex items-center justify-center gap-2">
                <Flame className="w-5 h-5 text-amber-500 animate-bounce" />
                <span className="text-3xl sm:text-4xl font-mono font-black text-amber-400 drop-shadow">
                  {activeBanner.score?.toLocaleString()}
                </span>
                <span className="text-xs font-mono font-bold text-neutral-400">
                  {activeBanner.unit || "ochko"}
                </span>
              </div>

              <p className="text-xs text-neutral-400 font-sans max-w-xs">
                Tabriklaymiz! Siz brauzeringiz xotirasidagi eng yuqori natijani yangiladingiz!
              </p>

              {/* Close Button */}
              <button
                onClick={() => {
                  setActiveBanner(null);
                  if (onClose) onClose();
                }}
                className="w-full mt-1 py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-mono font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95"
              >
                <Check className="w-4 h-4" /> Ajoyib! Rahmat!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
