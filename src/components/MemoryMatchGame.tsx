import React, { useState, useEffect } from "react";
import { Play, RotateCcw, Volume2, VolumeX, Trophy, Code2, Cpu, Terminal, Database, ShieldCheck, Globe, CpuIcon, Layers } from "lucide-react";

interface MemoryProps {
  className?: string;
}

interface Card {
  id: number;
  icon: string;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const TECH_CARDS = [
  { icon: "⚛️", label: "React" },
  { icon: "⚡", label: "Vite" },
  { icon: "🐍", label: "Python" },
  { icon: "💻", label: "JavaScript" },
  { icon: "🎨", label: "CSS3" },
  { icon: "🛡️", label: "Security" },
  { icon: "🗄️", label: "Database" },
  { icon: "🌐", label: "Web Dev" }
];

export default function MemoryMatchGame({ className = "" }: MemoryProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchesCount, setMatchesCount] = useState(0);
  const [gameState, setGameState] = useState<"menu" | "playing" | "victory">("menu");
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playBeep = (freq = 500) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      // ignore
    }
  };

  const initializeCards = () => {
    const deck = [...TECH_CARDS, ...TECH_CARDS].map((item, index) => ({
      id: index,
      icon: item.icon,
      label: item.label,
      isFlipped: false,
      isMatched: false
    }));

    // Shuffle Deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setMatchesCount(0);
    setGameState("playing");
  };

  const handleCardClick = (index: number) => {
    if (gameState !== "playing") return;
    if (cards[index].isFlipped || cards[index].isMatched) return;
    if (flippedIndices.length >= 2) return;

    playBeep(400);

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const nextFlipped = [...flippedIndices, index];
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = nextFlipped;

      if (cards[firstIdx].label === cards[secondIdx].label) {
        // Match!
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[firstIdx].isMatched = true;
            updated[secondIdx].isMatched = true;
            return updated;
          });
          setFlippedIndices([]);
          setMatchesCount((m) => {
            const nextM = m + 1;
            if (nextM === TECH_CARDS.length) {
              setGameState("victory");
              playBeep(880);
            } else {
              playBeep(650);
            }
            return nextM;
          });
        }, 400);
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[firstIdx].isFlipped = false;
            updated[secondIdx].isFlipped = false;
            return updated;
          });
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  return (
    <div className={`bg-slate-950 rounded-3xl border border-slate-800 p-5 text-white shadow-2xl flex flex-col justify-between ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-indigo-400" />
          <span className="font-mono text-xs font-black uppercase text-indigo-400">TECH MEMORY MATCH</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs">
          <span className="text-slate-400">Yurishlar: <strong className="text-white">{moves}</strong></span>
          <span className="text-indigo-400 font-bold">Juftliklar: {matchesCount} / {TECH_CARDS.length}</span>
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-slate-400 hover:text-white">
            {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="relative my-3 min-h-[250px] flex items-center justify-center">
        {gameState === "menu" && (
          <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 text-center space-y-4 max-w-xs">
            <h4 className="font-serif text-2xl font-light text-indigo-400 uppercase tracking-wider">CODE MEMORY GAME</h4>
            <p className="text-xs text-slate-400 font-mono">Bir xil IT texnologiyalar belgisini toping va xotirangizni sinab ko'ring!</p>
            <button
              onClick={initializeCards}
              className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-black font-mono font-black text-xs uppercase tracking-widest rounded-full flex items-center gap-2 cursor-pointer mx-auto shadow-lg"
            >
              <Play className="w-4 h-4 fill-black" /> O'yinni Boshlash
            </button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="grid grid-cols-4 gap-2.5 w-full max-w-[340px]">
            {cards.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className={`aspect-square rounded-xl text-2xl font-bold flex flex-col items-center justify-center transition-all duration-300 transform border cursor-pointer ${
                  card.isFlipped || card.isMatched
                    ? "bg-slate-800 border-indigo-500 text-white rotate-y-180 shadow-md"
                    : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-700"
                }`}
              >
                {card.isFlipped || card.isMatched ? (
                  <span className="animate-bounce">{card.icon}</span>
                ) : (
                  <span className="text-xs font-mono font-bold text-slate-600">?</span>
                )}
              </button>
            ))}
          </div>
        )}

        {gameState === "victory" && (
          <div className="bg-slate-900/95 p-6 rounded-2xl border border-indigo-500/50 text-center space-y-4 max-w-xs shadow-2xl">
            <h4 className="font-serif text-2xl font-bold text-emerald-400">BARAKALLA! G'OLIB BO'LDINGIZ! 🎉</h4>
            <p className="text-xs text-slate-300 font-mono">Barchasini <span className="text-indigo-400 font-bold">{moves} ta</span> yurishda topdingiz!</p>
            <button
              onClick={initializeCards}
              className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-black font-mono font-black text-xs uppercase tracking-widest rounded-full flex items-center gap-2 cursor-pointer mx-auto shadow-lg"
            >
              <RotateCcw className="w-4 h-4" /> Qaytadan O'ynash
            </button>
          </div>
        )}
      </div>

      <div className="text-[10px] font-mono text-slate-400 text-center">
        Maqsad: <span className="text-indigo-400 font-bold">Barcha bir xil kartalarni ochib toping</span>
      </div>
    </div>
  );
}
