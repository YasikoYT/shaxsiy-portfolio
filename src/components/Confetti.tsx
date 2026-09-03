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
  // We strictly avoid rendering full-screen blocking banners during gameplay
  // to ensure games never freeze or get obstructed while the user is playing.
  useEffect(() => {
    if (propRecordData && propRecordData.score && propRecordData.score > 0) {
      fireConfettiAnimation();
      if (onClose) {
        const t = setTimeout(onClose, 2000);
        return () => clearTimeout(t);
      }
    }
  }, [propRecordData, onClose]);

  return null;
}
