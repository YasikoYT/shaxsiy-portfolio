import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Play, RotateCcw, Brain, Zap, ShieldCheck } from "lucide-react";
import { getGameHighScore, saveGameHighScore } from "../lib/highScores";

const COLORS = [
  { id: 0, name: "Green", bg: "bg-emerald-500", activeBg: "bg-emerald-300 shadow-emerald-400/80", border: "border-emerald-400" },
  { id: 1, name: "Red", bg: "bg-red-500", activeBg: "bg-red-300 shadow-red-400/80", border: "border-red-400" },
  { id: 2, name: "Yellow", bg: "bg-amber-400", activeBg: "bg-yellow-200 shadow-yellow-300/80", border: "border-amber-300" },
  { id: 3, name: "Blue", bg: "bg-blue-500", activeBg: "bg-blue-300 shadow-blue-400/80", border: "border-blue-400" },
];

export default function SimonSaysGame({ className = "" }: { className?: string }) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userStep, setUserStep] = useState(0);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [highScore, setHighScore] = useState(() => getGameHighScore("simonsays"));

  useEffect(() => {
    setHighScore(getGameHighScore("simonsays"));
  }, []);
  const [statusMessage, setStatusMessage] = useState("Ranglar ketma-ketligini eslab qoling!");

  const playPadSound = (index: number) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const freqs = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      osc.type = "sine";
      osc.frequency.setValueAtTime(freqs[index], ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // Audio fallback
    }
  };

  const flashPad = (index: number, duration = 400) => {
    setActivePad(index);
    playPadSound(index);
    setTimeout(() => {
      setActivePad(null);
    }, duration);
  };

  const startGame = () => {
    const firstColor = Math.floor(Math.random() * 4);
    setSequence([firstColor]);
    setUserStep(0);
    setGameState("playing");
    setStatusMessage("Kutib turing...");
    playSequence([firstColor]);
  };

  const playSequence = (seq: number[]) => {
    setIsPlayingSequence(true);
    setStatusMessage("Ranglar zanjirini diqqat bilan kuzating!");
    
    seq.forEach((colorIdx, step) => {
      setTimeout(() => {
        flashPad(colorIdx, 450);
        if (step === seq.length - 1) {
          setTimeout(() => {
            setIsPlayingSequence(false);
            setStatusMessage("Endi siz navbati bilan bosing!");
          }, 500);
        }
      }, (step + 1) * 650);
    });
  };

  const handlePadClick = (index: number) => {
    if (gameState !== "playing" || isPlayingSequence) return;

    flashPad(index, 300);

    if (index === sequence[userStep]) {
      // Correct step
      if (userStep + 1 === sequence.length) {
        // Round completed!
        const score = sequence.length;
        if (score > highScore) setHighScore(score);

        const nextSequence = [...sequence, Math.floor(Math.random() * 4)];
        setSequence(nextSequence);
        setUserStep(0);
        setStatusMessage("Barakalla! Keyingi bosqich...");

        setTimeout(() => {
          playSequence(nextSequence);
        }, 1000);
      } else {
        setUserStep((s) => s + 1);
      }
    } else {
      // Wrong step
      setGameState("gameover");
      saveGameHighScore("simonsays", Math.max(0, sequence.length - 1));
      setStatusMessage("Xato rang bosildi! O'yin tugadi.");
    }
  };

  return (
    <div className={`bg-neutral-900 text-white rounded-3xl p-6 border border-neutral-800 shadow-2xl relative overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
        <div>
          <h3 className="font-serif text-2xl font-bold text-amber-400 flex items-center gap-2">
            <Brain className="w-6 h-6 text-amber-400" /> Simon Says
          </h3>
          <p className="text-xs text-neutral-400 font-mono">Xotirani sinovdan o'tkazish o'yini</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
            <span className="text-neutral-400">Bosqich:</span> <span className="font-bold text-lg text-emerald-400">{sequence.length}</span>
          </div>
          <div className="bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
            <span className="text-neutral-400">Rekord:</span> <span className="font-bold text-lg text-amber-300">{highScore}</span>
          </div>
        </div>
      </div>

      {/* Status banner */}
      <div className="text-center mb-6">
        <span className="text-xs font-mono font-bold bg-neutral-800 text-neutral-300 px-4 py-2 rounded-full border border-neutral-700 inline-block shadow-sm">
          {statusMessage}
        </span>
      </div>

      {/* Simon Pad Circle */}
      <div className="relative w-64 h-64 mx-auto grid grid-cols-2 gap-3 p-3 bg-neutral-950 rounded-full border-4 border-neutral-800 shadow-2xl items-center justify-center">
        {COLORS.map((col) => {
          const isActive = activePad === col.id;
          return (
            <button
              key={col.id}
              onClick={() => handlePadClick(col.id)}
              disabled={isPlayingSequence || gameState !== "playing"}
              className={`w-full h-full rounded-2xl transition-all cursor-pointer shadow-lg border-2 ${
                isActive ? col.activeBg + " scale-95 brightness-125" : col.bg + " opacity-80 hover:opacity-100"
              } ${col.border}`}
            />
          );
        })}

        {/* Center hub */}
        <div className="absolute inset-0 m-auto w-20 h-20 bg-neutral-900 border-4 border-neutral-800 rounded-full flex items-center justify-center shadow-xl">
          <span className="text-xs font-mono font-bold text-amber-400">
            {sequence.length > 0 ? `lvl ${sequence.length}` : "SIMON"}
          </span>
        </div>
      </div>

      {/* Overlays */}
      {gameState !== "playing" && (
        <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
          {gameState === "idle" ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-3xl flex items-center justify-center mx-auto border border-amber-500/30">
                <Brain className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-3xl font-bold text-white">Simon Says</h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Ekranda yonib-o'chadigan ranglar tartibini aniq eslab qoling va mos ravishda bosing!
              </p>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-amber-400 text-black font-mono font-bold rounded-2xl hover:bg-amber-300 transition-all flex items-center gap-2 mx-auto shadow-lg cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black" /> Boshlash
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-serif text-3xl font-bold text-red-400">O'yin Tugadi!</h4>
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-1">
                <p className="text-sm text-neutral-400">Erishilgan Bosqich:</p>
                <p className="text-4xl font-mono font-bold text-amber-400">{sequence.length - 1}</p>
                <p className="text-xs text-neutral-500">Eng yuqori natija: {highScore}</p>
              </div>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-amber-400 text-black font-mono font-bold rounded-2xl hover:bg-amber-300 transition-all flex items-center gap-2 mx-auto shadow-lg cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Qayta Boshlash
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
