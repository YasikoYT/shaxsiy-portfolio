import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Zap, Flag, Trophy } from "lucide-react";

const WORDS = [
  "kod", "dastur", "algoritm", "mantiq", "server", "baza", "funksiya", "ozgaruvchi", "vebsayt", "brauzer",
  "dizayn", "animatsiya", "frontend", "backend", "ishlab", "chiqarish", "tezlik", "mukammal", "intellekt", "tajriba"
];

export default function TypingSpeedRacerGame({ className = "" }: { className?: string }) {
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [currentWord, setCurrentWord] = useState("");
  const [inputVal, setInputVal] = useState("");
  const [playerPos, setPlayerPos] = useState(0); // 0 to 100%
  const [botPos, setBotPos] = useState(0);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [wpm, setWpm] = useState(0);
  const startTimeRef = useRef<number>(0);

  const startGame = () => {
    setPlayerPos(0);
    setBotPos(0);
    setWordsTyped(0);
    setWpm(0);
    setInputVal("");
    setCurrentWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
    startTimeRef.current = Date.now();
    setGameState("playing");
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    // Bot movement timer
    const interval = setInterval(() => {
      setBotPos((prev) => {
        const next = prev + 1.2;
        if (next >= 100) {
          setGameState("gameover");
          clearInterval(interval);
        }
        return next;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [gameState]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);

    if (val.trim() === currentWord) {
      // Word completed!
      const newTyped = wordsTyped + 1;
      setWordsTyped(newTyped);

      const elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
      const currentWpm = Math.round(newTyped / (elapsedMinutes || 0.01));
      setWpm(currentWpm);

      const newPos = playerPos + 10;
      setPlayerPos(newPos);
      setInputVal("");
      setCurrentWord(WORDS[Math.floor(Math.random() * WORDS.length)]);

      if (newPos >= 100) {
        setGameState("gameover");
      }
    }
  };

  return (
    <div className={`bg-neutral-900 text-white rounded-3xl p-6 border border-neutral-800 shadow-2xl relative overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
        <div>
          <h3 className="font-serif text-2xl font-bold text-blue-400 flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-400" /> Speed Typing Racer
          </h3>
          <p className="text-xs text-neutral-400 font-mono">So'zlarni tez va aniq yozib poygada birinchi bo'ling!</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
            <span className="text-neutral-400">Tezlik (WPM):</span> <span className="font-bold text-lg text-emerald-400">{wpm}</span>
          </div>
        </div>
      </div>

      {/* Race Track */}
      <div className="space-y-6 my-4 bg-neutral-950 p-6 rounded-2xl border border-neutral-800">
        {/* Player Track */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-neutral-400">
            <span>Siz (Sizning mashinangiz)</span>
            <span>{Math.min(100, Math.round(playerPos))}%</span>
          </div>
          <div className="h-6 bg-neutral-900 rounded-full relative overflow-hidden border border-neutral-800">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-300 flex items-center justify-end pr-2 text-[10px] font-bold"
              style={{ width: `${Math.min(100, playerPos)}%` }}
            >
              🏎️
            </div>
          </div>
        </div>

        {/* Bot Track */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-neutral-400">
            <span>AI Bot (Raqib)</span>
            <span>{Math.min(100, Math.round(botPos))}%</span>
          </div>
          <div className="h-6 bg-neutral-900 rounded-full relative overflow-hidden border border-neutral-800">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full transition-all duration-300 flex items-center justify-end pr-2 text-[10px] font-bold"
              style={{ width: `${Math.min(100, botPos)}%` }}
            >
              🚘
            </div>
          </div>
        </div>
      </div>

      {/* Typing Input */}
      {gameState === "playing" && (
        <div className="space-y-4 my-4 text-center">
          <div className="inline-block bg-neutral-800 px-6 py-3 rounded-2xl border border-neutral-700">
            <span className="text-xs font-mono text-neutral-400 block mb-1">YOZING:</span>
            <span className="text-2xl font-mono font-bold tracking-widest text-amber-300">{currentWord}</span>
          </div>
          <div>
            <input
              type="text"
              value={inputVal}
              onChange={handleInputChange}
              autoFocus
              placeholder="Shu yerga yozing..."
              className="w-full max-w-md bg-neutral-950 border border-neutral-700 text-center text-lg font-mono py-3 rounded-2xl text-white focus:outline-none focus:border-blue-500 shadow-inner"
            />
          </div>
        </div>
      )}

      {/* Overlays */}
      {gameState !== "playing" && (
        <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
          {gameState === "idle" ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-3xl flex items-center justify-center mx-auto border border-blue-500/30">
                <Flag className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-3xl font-bold text-white">Typing Speed Racer</h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Klaviatura tezligini oshiring va AI Botdan o'zib ketish uchun so'zlarni xatosiz yozing!
              </p>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-blue-500 text-white font-mono font-bold rounded-2xl hover:bg-blue-400 transition-all flex items-center gap-2 mx-auto shadow-lg cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" /> Poygani Boshlash
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-serif text-3xl font-bold text-white">
                {playerPos >= 100 ? "G'ALABA! 🏆" : "AI BOT YUTDI! 🏎️"}
              </h4>
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-1">
                <p className="text-sm text-neutral-400">Sizning Tezligingiz:</p>
                <p className="text-4xl font-mono font-bold text-emerald-400">{wpm} WPM</p>
                <p className="text-xs text-neutral-500">{wordsTyped} ta so'z yozildi</p>
              </div>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-blue-500 text-white font-mono font-bold rounded-2xl hover:bg-blue-400 transition-all flex items-center gap-2 mx-auto shadow-lg cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Qayta Poyga
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
