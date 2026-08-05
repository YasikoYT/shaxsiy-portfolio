import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, RotateCcw, Lightbulb, Check, Sparkles, HelpCircle } from "lucide-react";
import { getGameHighScore, saveGameHighScore } from "../lib/highScores";

const WORDS = [
  { word: "REACT", hint: "Mashhur Frontend UI kutubxonasi" },
  { word: "TYPESCRIPT", hint: "Tip-xavfsiz JavaScript dasturlash tili" },
  { word: "JAVASCRIPT", hint: "Veb saytlarning asosiy skript tili" },
  { word: "DATABASE", hint: "Ma'lumotlar bazasi va saqlash ombori" },
  { word: "ALGORITHM", hint: "Masalani bosqichma-bosqich hal qilish ketma-ketligi" },
  { word: "FRONTEND", hint: "Foydalanuvchi ko'radigan interfeys qismi" },
  { word: "TAILWIND", hint: "Zamonaviy utility-first CSS freymvorki" },
  { word: "COMPONENT", hint: "Qayta ishlatiluvchi UI bloki" },
  { word: "EXPRESS", hint: "Node.js uchun tezkor server freymvorki" },
  { word: "GEMINI", hint: "Google tomonidan yaratilgan ilg'or AI modeli" },
  { word: "BACKEND", hint: "Server va ma'lumotlar mantiqiy qismi" },
  { word: "FUNCTION", hint: "Muayyan vazifani bajaruvchi kod bloki" },
];

export default function WordScrambleGame({ className = "" }: { className?: string }) {
  const [currentWordObj, setCurrentWordObj] = useState(WORDS[0]);
  const [scrambled, setScrambled] = useState("");
  const [userGuess, setUserGuess] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [highScore, setHighScore] = useState(() => getGameHighScore("wordscramble"));

  useEffect(() => {
    setHighScore(getGameHighScore("wordscramble"));
  }, []);
  const [timeLeft, setTimeLeft] = useState(45);

  const scrambleWord = (word: string) => {
    const arr = word.split("");
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    const res = arr.join("");
    return res === word ? scrambleWord(word) : res;
  };

  const loadNextWord = () => {
    const randomObj = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWordObj(randomObj);
    setScrambled(scrambleWord(randomObj.word));
    setUserGuess("");
    setShowHint(false);
    setFeedbackMessage(null);
  };

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(45);
    setGameState("playing");
    loadNextWord();
  };

  useEffect(() => {
    if (gameState !== "playing") return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState("gameover");
          saveGameHighScore("wordscramble", score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, score]);

  const handleCheckWord = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (gameState !== "playing" || !userGuess.trim()) return;

    if (userGuess.trim().toUpperCase() === currentWordObj.word) {
      const addedScore = 10 + streak * 5 + (showHint ? 0 : 5);
      setScore((s) => {
        const next = s + addedScore;
        saveGameHighScore("wordscramble", next);
        if (next > highScore) setHighScore(next);
        return next;
      });
      setStreak((st) => st + 1);
      setFeedbackMessage(`To'g'ri! +${addedScore} ochko 🎉`);
      setTimeout(() => {
        loadNextWord();
      }, 800);
    } else {
      setStreak(0);
      setFeedbackMessage("Noto'g'ri, qayta urinib ko'ring! ❌");
    }
  };

  return (
    <div className={`bg-neutral-900 text-white rounded-3xl p-6 border border-neutral-800 shadow-2xl relative overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
        <div>
          <h3 className="font-serif text-2xl font-bold text-amber-400 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" /> Word Scramble
          </h3>
          <p className="text-xs text-neutral-400 font-mono">Dasturlash tushunchalari va so'zlarni toping</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
            <span className="text-neutral-400">Vaqt:</span> <span className={`font-bold text-lg ${timeLeft <= 10 ? "text-red-400 animate-pulse" : "text-amber-300"}`}>{timeLeft}s</span>
          </div>
          <div className="bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
            <span className="text-neutral-400">Ochko:</span> <span className="font-bold text-lg text-emerald-400">{score}</span>
          </div>
        </div>
      </div>

      {/* Main Game Container */}
      <div className="max-w-md mx-auto space-y-6 text-center">
        {/* Scrambled Word Tile Display */}
        <div className="flex flex-wrap justify-center gap-2 py-4">
          {scrambled.split("").map((char, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0.8, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="w-12 h-14 bg-gradient-to-b from-neutral-800 to-neutral-950 border-2 border-amber-500/50 text-amber-300 font-mono text-2xl font-black rounded-2xl flex items-center justify-center shadow-lg"
            >
              {char}
            </motion.div>
          ))}
        </div>

        {/* Hint button & text */}
        <div className="space-y-2">
          {showHint ? (
            <p className="text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-2xl inline-block">
              💡 Maslahat: {currentWordObj.hint}
            </p>
          ) : (
            <button
              onClick={() => setShowHint(true)}
              disabled={gameState !== "playing"}
              className="text-xs font-mono text-neutral-400 hover:text-amber-300 underline cursor-pointer inline-flex items-center gap-1"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Maslahatni ko'rish
            </button>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleCheckWord} className="flex gap-2 max-w-xs mx-auto">
          <input
            type="text"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value.toUpperCase())}
            placeholder="Javobni yozing..."
            disabled={gameState !== "playing"}
            className="flex-1 bg-neutral-950 border border-neutral-700 rounded-2xl px-4 py-3 font-mono text-sm uppercase text-white focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            disabled={gameState !== "playing"}
            className="px-5 py-3 bg-amber-400 text-black font-mono font-bold rounded-2xl hover:bg-amber-300 transition-all cursor-pointer shadow-md flex items-center justify-center"
          >
            <Check className="w-5 h-5" />
          </button>
        </form>

        {/* Feedback message */}
        {feedbackMessage && (
          <p className="text-xs font-mono font-bold text-amber-300 animate-bounce">{feedbackMessage}</p>
        )}
      </div>

      {/* Overlays */}
      {gameState !== "playing" && (
        <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
          {gameState === "idle" ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-3xl flex items-center justify-center mx-auto border border-amber-500/30">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-3xl font-bold text-white">Word Scramble</h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Aralashib ketgan dasturlash va texnologiya so'zlarini to'g'ri tartibda toping!
              </p>
              <p className="text-xs font-mono text-amber-300">Rekord: {highScore} ochko</p>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-amber-400 text-black font-mono font-bold rounded-2xl hover:bg-amber-300 transition-all flex items-center gap-2 mx-auto shadow-lg cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black" /> Boshlash
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-serif text-3xl font-bold text-amber-400">Vaqt Tugadi!</h4>
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-1">
                <p className="text-sm text-neutral-400">Umumiy Ochko:</p>
                <p className="text-4xl font-mono font-bold text-emerald-400">{score}</p>
                <p className="text-xs text-neutral-500">Eng yuqori natija: {highScore}</p>
              </div>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-amber-400 text-black font-mono font-bold rounded-2xl hover:bg-amber-300 transition-all flex items-center gap-2 mx-auto shadow-lg cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Qayta O'ynash
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
