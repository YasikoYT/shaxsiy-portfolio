import React, { useState } from "react";
import { Play, RotateCcw, Volume2, VolumeX, Trophy, Bot, User, Cpu } from "lucide-react";

interface TicTacToeProps {
  className?: string;
}

type BoardState = (string | null)[];

export default function TicTacToeGame({ className = "" }: TicTacToeProps) {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [playerWins, setPlayerWins] = useState(0);
  const [aiWins, setAiWins] = useState(0);
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

  const checkWinner = (b: BoardState) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let line of lines) {
      const [a, bIdx, c] = line;
      if (b[a] && b[a] === b[bIdx] && b[a] === b[c]) return b[a];
    }
    if (b.every((cell) => cell !== null)) return "Tie";
    return null;
  };

  // Minimax Unbeatable AI
  const minimax = (b: BoardState, depth: number, isMax: boolean): { score: number; index?: number } => {
    const res = checkWinner(b);
    if (res === "O") return { score: 10 - depth };
    if (res === "X") return { score: depth - 10 };
    if (res === "Tie") return { score: 0 };

    if (isMax) {
      let bestScore = -Infinity;
      let bestMove = -1;
      for (let i = 0; i < 9; i++) {
        if (b[i] === null) {
          b[i] = "O";
          const evalRes = minimax(b, depth + 1, false);
          b[i] = null;
          if (evalRes.score > bestScore) {
            bestScore = evalRes.score;
            bestMove = i;
          }
        }
      }
      return { score: bestScore, index: bestMove };
    } else {
      let bestScore = Infinity;
      let bestMove = -1;
      for (let i = 0; i < 9; i++) {
        if (b[i] === null) {
          b[i] = "X";
          const evalRes = minimax(b, depth + 1, true);
          b[i] = null;
          if (evalRes.score < bestScore) {
            bestScore = evalRes.score;
            bestMove = i;
          }
        }
      }
      return { score: bestScore, index: bestMove };
    }
  };

  const makeAiMove = (currentBoard: BoardState) => {
    const best = minimax(currentBoard, 0, true);
    if (best.index !== undefined && best.index !== -1) {
      const newBoard = [...currentBoard];
      newBoard[best.index] = "O";
      setBoard(newBoard);
      playBeep(450);

      const win = checkWinner(newBoard);
      if (win) {
        setWinner(win);
        setGameState("gameover");
        if (win === "O") setAiWins((w) => w + 1);
        playBeep(win === "O" ? 200 : 700);
      } else {
        setIsPlayerTurn(true);
      }
    }
  };

  const handleCellClick = (index: number) => {
    if (gameState !== "playing" || !isPlayerTurn || board[index] !== null) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    playBeep(650);

    const win = checkWinner(newBoard);
    if (win) {
      setWinner(win);
      setGameState("gameover");
      if (win === "X") setPlayerWins((w) => w + 1);
      playBeep(win === "X" ? 880 : 300);
    } else {
      setIsPlayerTurn(false);
      setTimeout(() => makeAiMove(newBoard), 400);
    }
  };

  const startGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setGameState("playing");
  };

  return (
    <div className={`bg-slate-950 rounded-3xl border border-slate-800 p-5 text-white shadow-2xl flex flex-col justify-between ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <span className="font-mono text-xs font-black uppercase text-emerald-400">TIC-TAC-TOE AI MASTER</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs">
          <span className="text-emerald-400 font-bold">SIZ (X): {playerWins}</span>
          <span className="text-slate-500">VS</span>
          <span className="text-rose-400 font-bold">AI (O): {aiWins}</span>
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-slate-400 hover:text-white">
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="relative my-3 min-h-[250px] flex items-center justify-center">
        {gameState === "menu" && (
          <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 text-center space-y-4 max-w-xs">
            <h4 className="font-serif text-2xl font-light text-emerald-400 uppercase tracking-wider">CYBER TIC-TAC-TOE</h4>
            <p className="text-xs text-slate-400 font-mono">Aqlli Sun'iy Intelekt botiga qarshi o'ynang va uni mag'lub qilishga urinib ko'ring!</p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-black text-xs uppercase tracking-widest rounded-full flex items-center gap-2 cursor-pointer mx-auto shadow-lg"
            >
              <Play className="w-4 h-4 fill-black" /> O'yinni Boshlash
            </button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="grid grid-cols-3 gap-3 w-full max-w-[260px]">
            {board.map((cell, i) => (
              <button
                key={i}
                onClick={() => handleCellClick(i)}
                className={`aspect-square rounded-2xl border text-3xl font-mono font-extrabold flex items-center justify-center transition-all cursor-pointer ${
                  cell === "X"
                    ? "bg-slate-900 border-emerald-500 text-emerald-400 shadow-md"
                    : cell === "O"
                    ? "bg-slate-900 border-rose-500 text-rose-400 shadow-md"
                    : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-transparent"
                }`}
              >
                {cell}
              </button>
            ))}
          </div>
        )}

        {gameState === "gameover" && (
          <div className="bg-slate-900/95 p-6 rounded-2xl border border-emerald-500/50 text-center space-y-4 max-w-xs shadow-2xl">
            <h4 className={`font-serif text-2xl font-bold ${winner === "X" ? "text-emerald-400" : winner === "O" ? "text-rose-500" : "text-amber-400"}`}>
              {winner === "X" ? "G'OLIB BO'LDINGIZ! 🏆" : winner === "O" ? "AI BOT G'OLIB BO'LDI!" : "DURANG!"}
            </h4>
            <p className="text-xs text-slate-300 font-mono">Jami: Siz {playerWins} - AI {aiWins}</p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-black text-xs uppercase tracking-widest rounded-full flex items-center gap-2 cursor-pointer mx-auto shadow-lg"
            >
              <RotateCcw className="w-4 h-4" /> Qaytadan O'ynash
            </button>
          </div>
        )}
      </div>

      <div className="text-[10px] font-mono text-slate-400 text-center">
        Rejim: <span className="text-emerald-400 font-bold">Siz "X" siz | AI Bot "O"</span>
      </div>
    </div>
  );
}
