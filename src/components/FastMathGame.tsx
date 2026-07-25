import React, { useState, useEffect } from "react";
import { Play, RotateCcw, Volume2, VolumeX, Trophy, Zap, Check, X } from "lucide-react";

interface FastMathProps {
  className?: string;
}

interface Question {
  text: string;
  options: number[];
  answer: number;
}

export default function FastMathGame({ className = "" }: FastMathProps) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameover">("menu");
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playBeep = (freq = 500) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      // ignore
    }
  };

  const generateQuestion = (): Question => {
    const ops = ["+", "-", "*"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let num1 = Math.floor(Math.random() * 20) + 1;
    let num2 = Math.floor(Math.random() * 15) + 1;

    let ans = 0;
    if (op === "+") ans = num1 + num2;
    if (op === "-") {
      if (num1 < num2) [num1, num2] = [num2, num1];
      ans = num1 - num2;
    }
    if (op === "*") {
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      ans = num1 * num2;
    }

    const optionsSet = new Set<number>([ans]);
    while (optionsSet.size < 4) {
      const offset = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 6) + 1);
      const wrong = ans + offset;
      if (wrong >= 0) optionsSet.add(wrong);
    }

    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

    return {
      text: `${num1} ${op} ${num2} = ?`,
      options,
      answer: ans
    };
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(15);
    setQuestion(generateQuestion());
    setGameState("playing");
  };

  const handleAnswer = (selected: number) => {
    if (gameState !== "playing" || !question) return;

    if (selected === question.answer) {
      const nextScore = score + 10;
      setScore(nextScore);
      if (nextScore > highScore) setHighScore(nextScore);
      setTimeLeft((t) => Math.min(20, t + 2)); // Bonus time!
      playBeep(750);
      setQuestion(generateQuestion());
    } else {
      setGameState("gameover");
      playBeep(200);
    }
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameState("gameover");
          playBeep(200);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  return (
    <div className={`bg-slate-950 rounded-3xl border border-slate-800 p-5 text-white shadow-2xl flex flex-col justify-between ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
          <span className="font-mono text-xs font-black uppercase text-yellow-400">FAST MATH REFLEX</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs">
          <span className="text-slate-400">Vaqt: <strong className="text-yellow-400">{timeLeft}s</strong></span>
          <span className="text-slate-400">Ochko: <strong className="text-white">{score}</strong></span>
          <span className="text-amber-400 flex items-center gap-1"><Trophy className="w-3.5 h-3.5" /> {highScore}</span>
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-slate-400 hover:text-white">
            {soundEnabled ? <Volume2 className="w-4 h-4 text-yellow-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Game Body */}
      <div className="relative my-3 min-h-[240px] flex items-center justify-center">
        {gameState === "menu" && (
          <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 text-center space-y-4 max-w-xs">
            <h4 className="font-serif text-2xl font-light text-yellow-400 uppercase tracking-wider">MATH SPEED DEMON</h4>
            <p className="text-xs text-slate-400 font-mono">Tezkor hisoblash: Har bir to'g'ri javob uchun +2 sek bonus va 10 ochko!</p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-mono font-black text-xs uppercase tracking-widest rounded-full flex items-center gap-2 cursor-pointer mx-auto shadow-lg"
            >
              <Play className="w-4 h-4 fill-black" /> O'yinni Boshlash
            </button>
          </div>
        )}

        {gameState === "playing" && question && (
          <div className="w-full max-w-xs space-y-6 text-center">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
              <span className="font-mono text-3xl font-extrabold text-white tracking-widest">{question.text}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  className="py-4 bg-slate-900 hover:bg-yellow-500 hover:text-black border border-slate-800 rounded-xl font-mono text-xl font-bold transition-all cursor-pointer shadow-md"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === "gameover" && (
          <div className="bg-slate-900/95 p-6 rounded-2xl border border-yellow-500/50 text-center space-y-4 max-w-xs shadow-2xl">
            <h4 className="font-serif text-2xl font-bold text-yellow-400">VAQT YOKI XATO! ⏱️</h4>
            <p className="text-xs text-slate-300 font-mono">To'plangan Ochko: <span className="text-yellow-400 font-bold">{score}</span></p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-mono font-black text-xs uppercase tracking-widest rounded-full flex items-center gap-2 cursor-pointer mx-auto shadow-lg"
            >
              <RotateCcw className="w-4 h-4" /> Qaytadan O'ynash
            </button>
          </div>
        )}
      </div>

      <div className="text-[10px] font-mono text-slate-400 text-center">
        Qoida: <span className="text-yellow-400 font-bold">Xatosiz va tezkor to'g'ri variantni bosing</span>
      </div>
    </div>
  );
}
