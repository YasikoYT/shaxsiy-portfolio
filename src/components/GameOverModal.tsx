import React from "react";
import { motion } from "motion/react";
import { Trophy, RotateCcw, Sparkles, Flame, Star, Award, Zap, ArrowRight } from "lucide-react";

interface GameOverModalProps {
  score: number;
  highScore: number;
  gameTitle?: string;
  unit?: string;
  onRestart: () => void;
  isNewRecord?: boolean;
}

export function GameOverModal({
  score,
  highScore,
  gameTitle = "O'YIN TUGADI",
  unit = "ochko",
  onRestart,
  isNewRecord
}: GameOverModalProps) {
  const achievedRecord = isNewRecord || (score > 0 && score >= highScore);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className="absolute inset-0 z-30 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center overflow-hidden border border-emerald-500/30 rounded-2xl"
    >
      {/* Background radial glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
        achievedRecord ? 'bg-amber-500/20' : 'bg-red-500/15'
      }`} />

      {/* Top Trophy / Badge Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 shadow-xl relative ${
          achievedRecord
            ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-black shadow-amber-500/30 border border-amber-300/50'
            : 'bg-gradient-to-tr from-red-500 to-rose-400 text-white shadow-red-500/30 border border-red-300/30'
        }`}
      >
        {achievedRecord ? (
          <Trophy className="w-8 h-8 drop-shadow" />
        ) : (
          <Flame className="w-8 h-8 drop-shadow animate-pulse" />
        )}

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-2xl border border-dashed border-white/40"
        />
      </motion.div>

      {/* Title & Status Badge */}
      <div className="space-y-1 mb-4 relative">
        <div className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest ${
          achievedRecord
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {achievedRecord ? (
            <>
              <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
              YANGI SHAXSIY REKORD!
            </>
          ) : (
            <>
              <Zap className="w-3 h-3 text-red-400" />
              O'YIN YAKUNLANDI
            </>
          )}
        </div>

        <h3 className="font-serif text-2xl font-black tracking-tight text-white uppercase">
          {gameTitle}
        </h3>
      </div>

      {/* Score Box */}
      <div className="w-full max-w-xs bg-slate-900/90 border border-white/10 rounded-2xl p-3.5 mb-5 shadow-inner space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-white/5 pb-2">
          <span>Ochko</span>
          <span className="text-white font-bold text-lg">{score.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">{unit}</span></span>
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1 text-amber-400 font-bold">
            <Trophy className="w-3.5 h-3.5" /> Eng Yaxshi:
          </span>
          <span className="text-amber-400 font-bold text-sm">{Math.max(score, highScore).toLocaleString()} {unit}</span>
        </div>
      </div>

      {/* Restart Action Button */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={onRestart}
        className="w-full max-w-xs py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-black font-mono font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
      >
        <RotateCcw className="w-4 h-4" />
        Qaytadan Boshlash
      </motion.button>
    </motion.div>
  );
}
