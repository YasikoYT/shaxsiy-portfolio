import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Play, RotateCcw, Keyboard, Award, CheckCircle2 } from "lucide-react";
import { getGameHighScore, saveGameHighScore } from "../lib/highScores";

const SNIPPETS = [
  "const developer = { name: 'Anvar Akramov', role: 'Full-Stack Specialist', status: 'Online' };",
  "import React, { useState, useEffect } from 'react';",
  "function calculateScore(wpm, accuracy) { return Math.round(wpm * (accuracy / 100)); }",
  "export default function App() { return <div className='p-4 bg-black'>Hello World</div>; }",
  "const response = await fetch('/api/gemini', { method: 'POST', body: JSON.stringify(prompt) });",
];

export default function SpeedTypingGame({ className = "" }: { className?: string }) {
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [highWpm, setHighWpm] = useState(() => getGameHighScore("speedtyping"));

  useEffect(() => {
    setHighWpm(getGameHighScore("speedtyping"));
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);
  const targetSnippet = SNIPPETS[snippetIndex];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "playing" && startTime) {
      timer = setInterval(() => {
        const secs = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
        setElapsedSeconds(secs);

        // WPM calculation: (typed chars / 5) / (secs / 60)
        const typedWords = userInput.length / 5;
        const currentWpm = Math.round((typedWords / secs) * 60);
        setWpm(currentWpm);
      }, 500);
    }
    return () => clearInterval(timer);
  }, [gameState, startTime, userInput]);

  const startGame = () => {
    const nextIdx = Math.floor(Math.random() * SNIPPETS.length);
    setSnippetIndex(nextIdx);
    setUserInput("");
    setElapsedSeconds(0);
    setWpm(0);
    setAccuracy(100);
    setGameState("playing");
    setStartTime(Date.now());
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== "playing") return;
    const val = e.target.value;
    setUserInput(val);

    // Calculate accuracy
    let correctChars = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === targetSnippet[i]) correctChars++;
    }
    const acc = val.length > 0 ? Math.round((correctChars / val.length) * 100) : 100;
    setAccuracy(acc);

    // Check completion
    if (val === targetSnippet) {
      finishGame(val);
    }
  };

  const finishGame = (finalVal: string) => {
    setGameState("finished");
    const secs = Math.max(1, Math.floor((Date.now() - (startTime || Date.now())) / 1000));
    const finalWpm = Math.round((finalVal.length / 5 / secs) * 60);
    setWpm(finalWpm);
    saveGameHighScore("speedtyping", finalWpm);
    if (finalWpm > highWpm) {
      setHighWpm(finalWpm);
    }
  };

  return (
    <div className={`bg-neutral-900 text-white rounded-3xl p-6 border border-neutral-800 shadow-2xl relative overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
        <div>
          <h3 className="font-serif text-2xl font-bold text-amber-400 flex items-center gap-2">
            <Keyboard className="w-6 h-6 text-amber-400" /> Speed Typer
          </h3>
          <p className="text-xs text-neutral-400 font-mono">Dasturlash kodlarini tez va xatosiz yozish testi</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
            <span className="text-neutral-400">WPM:</span> <span className="font-bold text-lg text-emerald-400">{wpm}</span>
          </div>
          <div className="bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
            <span className="text-neutral-400">Aniqlik:</span> <span className="font-bold text-lg text-amber-300">{accuracy}%</span>
          </div>
        </div>
      </div>

      {/* Target Code Snippet Display */}
      <div className="max-w-xl mx-auto space-y-6">
        <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 font-mono text-sm leading-relaxed tracking-wide select-none break-all shadow-inner">
          {targetSnippet.split("").map((char, i) => {
            let color = "text-neutral-500";
            if (i < userInput.length) {
              color = userInput[i] === char ? "text-emerald-400 font-bold bg-emerald-500/20 rounded" : "text-red-400 bg-red-500/20 font-bold rounded";
            }
            return (
              <span key={i} className={color}>
                {char}
              </span>
            );
          })}
        </div>

        {/* Input box */}
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          disabled={gameState !== "playing"}
          placeholder="Yuqoridagi kodni bu yerga yozing..."
          className="w-full bg-neutral-950 border border-neutral-700 rounded-2xl px-5 py-4 font-mono text-sm text-white focus:outline-none focus:border-amber-400 shadow-lg"
        />
      </div>

      {/* Overlays */}
      {gameState !== "playing" && (
        <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
          {gameState === "idle" ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-3xl flex items-center justify-center mx-auto border border-amber-500/30">
                <Keyboard className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-3xl font-bold text-white">Speed Typer</h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Kodni imkon qadar tez va xatosiz yozib, WPM (daqiqa kiritilgan so'zlar soni) rekorini o'rnating!
              </p>
              <p className="text-xs font-mono text-amber-300">Rekord: {highWpm} WPM</p>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-amber-400 text-black font-mono font-bold rounded-2xl hover:bg-amber-300 transition-all flex items-center gap-2 mx-auto shadow-lg cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black" /> Testni Boshlash
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-serif text-3xl font-bold text-emerald-400">Tabriklaymiz!</h4>
              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-2 min-w-[240px]">
                <div>
                  <p className="text-xs text-neutral-400 uppercase font-mono">Tezlik (WPM):</p>
                  <p className="text-4xl font-mono font-bold text-emerald-400">{wpm}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 uppercase font-mono">Aniqlik:</p>
                  <p className="text-2xl font-mono font-bold text-amber-300">{accuracy}%</p>
                </div>
                <p className="text-xs text-neutral-500 pt-1">Eng yuqori natija: {highWpm} WPM</p>
              </div>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-amber-400 text-black font-mono font-bold rounded-2xl hover:bg-amber-300 transition-all flex items-center gap-2 mx-auto shadow-lg cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Qayta Sinash
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
