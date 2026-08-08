import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RotateCcw, Volume2, VolumeX, Trophy, Bot, User, Cpu, Sparkles } from "lucide-react";
import { getGameHighScore, saveGameHighScore } from "../lib/highScores";

interface TicTacToeProps {
  className?: string;
  isDarkMode?: boolean;
}

type BoardState = (string | null)[];

interface WinResult {
  winner: "X" | "O" | "Tie" | null;
  line: number[] | null;
}

export default function TicTacToeGame({ className = "" }: TicTacToeProps) {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [winner, setWinner] = useState<"X" | "O" | "Tie" | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [playerWins, setPlayerWins] = useState(0);
  const [aiWins, setAiWins] = useState(0);
  const [highScore, setHighScore] = useState(() => getGameHighScore("tictactoe"));
  const [soundEnabled, setSoundEnabled] = useState(true);

  const audioCtxRef = React.useRef<AudioContext | null>(null);

  useEffect(() => {
    setHighScore(getGameHighScore("tictactoe"));
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, []);

  const playBeep = (freq = 500) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // ignore audio restrictions
    }
  };

  const checkWinDetails = (b: BoardState): WinResult => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]            // diagonals
    ];
    for (const line of lines) {
      const [a, bIdx, c] = line;
      if (b[a] && b[a] === b[bIdx] && b[a] === b[c]) {
        return { winner: b[a] as "X" | "O", line };
      }
    }
    if (b.every((cell) => cell !== null)) {
      return { winner: "Tie", line: null };
    }
    return { winner: null, line: null };
  };

  // High-performance Minimax algorithm with Alpha-Beta Pruning (0ms compute overhead)
  const minimax = (
    tempBoard: BoardState,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
  ): { score: number; index?: number } => {
    const result = checkWinDetails(tempBoard).winner;
    if (result === "O") return { score: 10 - depth };
    if (result === "X") return { score: depth - 10 };
    if (result === "Tie") return { score: 0 };

    const emptyIndices: number[] = [];
    for (let i = 0; i < 9; i++) {
      if (tempBoard[i] === null) emptyIndices.push(i);
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      let bestMove = emptyIndices[0];
      for (const idx of emptyIndices) {
        tempBoard[idx] = "O";
        const res = minimax(tempBoard, depth + 1, alpha, beta, false);
        tempBoard[idx] = null;
        if (res.score > bestScore) {
          bestScore = res.score;
          bestMove = idx;
        }
        alpha = Math.max(alpha, bestScore);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      return { score: bestScore, index: bestMove };
    } else {
      let bestScore = Infinity;
      let bestMove = emptyIndices[0];
      for (const idx of emptyIndices) {
        tempBoard[idx] = "X";
        const res = minimax(tempBoard, depth + 1, alpha, beta, true);
        tempBoard[idx] = null;
        if (res.score < bestScore) {
          bestScore = res.score;
          bestMove = idx;
        }
        beta = Math.min(beta, bestScore);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      return { score: bestScore, index: bestMove };
    }
  };

  // Fast AI decision maker
  const getBestAiMove = (currentBoard: BoardState): number => {
    const emptyCount = currentBoard.filter((c) => c === null).length;
    // Immediate opening move optimization for zero calculation delay
    if (emptyCount === 8) {
      if (currentBoard[4] === null) return 4;
      return 0;
    }
    const res = minimax([...currentBoard], 0, -Infinity, Infinity, true);
    return res.index ?? -1;
  };

  const executeAiTurn = (currentBoard: BoardState) => {
    setIsAiThinking(true);

    setTimeout(() => {
      const aiMoveIndex = getBestAiMove(currentBoard);

      if (aiMoveIndex !== -1 && currentBoard[aiMoveIndex] === null) {
        const nextBoard = [...currentBoard];
        nextBoard[aiMoveIndex] = "O";
        setBoard(nextBoard);
        playBeep(450);

        const winRes = checkWinDetails(nextBoard);
        if (winRes.winner) {
          setWinner(winRes.winner);
          setWinningLine(winRes.line);
          setIsAiThinking(false);

          if (winRes.winner === "O") {
            setAiWins((w) => w + 1);
            playBeep(250);
          } else if (winRes.winner === "Tie") {
            playBeep(400);
          }
        } else {
          setIsAiThinking(false);
          setIsPlayerTurn(true);
        }
      } else {
        setIsAiThinking(false);
        setIsPlayerTurn(true);
      }
    }, 400);
  };

  const handleCellClick = (index: number) => {
    if (!isPlayerTurn || isAiThinking || winner !== null || board[index] !== null) return;

    const nextBoard = [...board];
    nextBoard[index] = "X";
    setBoard(nextBoard);
    playBeep(650);

    const winRes = checkWinDetails(nextBoard);
    if (winRes.winner) {
      setWinner(winRes.winner);
      setWinningLine(winRes.line);
      setIsPlayerTurn(false);

      // Save high score ONLY when player wins ("X")
      if (winRes.winner === "X") {
        setPlayerWins((w) => {
          const newWins = w + 1;
          saveGameHighScore("tictactoe", newWins);
          if (newWins > highScore) setHighScore(newWins);
          return newWins;
        });
        playBeep(880);
      } else if (winRes.winner === "Tie") {
        playBeep(400);
      }
    } else {
      setIsPlayerTurn(false);
      executeAiTurn(nextBoard);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setIsAiThinking(false);
    setWinner(null);
    setWinningLine(null);
  };

  return (
    <div className={`rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-2xl flex flex-col justify-between bg-slate-950 text-white ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <span className="font-mono text-xs font-black uppercase tracking-wider text-emerald-400">
            TIC-TAC-TOE AI
          </span>
        </div>

        <div className="flex items-center gap-2.5 font-mono text-xs">
          <span className="px-2.5 py-1 font-bold rounded-xl flex items-center gap-1 border bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
            <User className="w-3.5 h-3.5" /> SIZ (X): {playerWins}
          </span>
          <span className="font-bold text-slate-500">VS</span>
          <span className="px-2.5 py-1 font-bold rounded-xl flex items-center gap-1 border bg-rose-500/10 border-rose-500/30 text-rose-400">
            <Bot className="w-3.5 h-3.5" /> AI (O): {aiWins}
          </span>
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)} 
            className="p-1.5 rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-white hover:bg-slate-800"
            title="Ovozli / Ovozsiz"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Turn Indicator */}
      <div className="my-3 text-center min-h-[28px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isAiThinking ? (
            <motion.div
              key="ai-turn"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold border bg-rose-500/10 border-rose-500/30 text-rose-400"
            >
              <Bot className="w-3.5 h-3.5 animate-bounce text-rose-400" />
              <span>AI bot o'ylamoqda...</span>
            </motion.div>
          ) : winner ? (
            <motion.div
              key="winner-turn"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold border ${
                winner === "X"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                  : winner === "O"
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/50"
                  : "bg-amber-500/20 text-amber-300 border-amber-500/50"
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>
                {winner === "X" ? "G'alaba! SIZ yutdingiz 🎉" : winner === "O" ? "AI Bot yutdi!" : "Durang qayd etildi!"}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="player-turn"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold border bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sizning navbatingiz (X ni bosing)</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3x3 Grid Board Stage */}
      <div className="relative my-2 flex flex-col items-center justify-center">
        <div className="grid grid-cols-3 gap-3 w-full max-w-[270px] aspect-square">
          {board.map((cell, i) => {
            const isWinningCell = winningLine?.includes(i);

            return (
              <motion.button
                key={i}
                onClick={() => handleCellClick(i)}
                disabled={winner !== null || !isPlayerTurn || isAiThinking || cell !== null}
                whileHover={cell === null && isPlayerTurn && !isAiThinking && !winner ? { scale: 1.05 } : {}}
                whileTap={cell === null && isPlayerTurn && !isAiThinking && !winner ? { scale: 0.95 } : {}}
                className={`aspect-square rounded-2xl border text-4xl font-mono font-black flex items-center justify-center transition-all relative overflow-hidden cursor-pointer ${
                  isWinningCell
                    ? cell === "X"
                      ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/50 scale-105 z-10 animate-pulse"
                      : "bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/50 scale-105 z-10 animate-pulse"
                    : cell === "X"
                    ? "bg-slate-900 border-emerald-500/60 text-emerald-400 shadow-md"
                    : cell === "O"
                    ? "bg-slate-900 border-rose-500/60 text-rose-400 shadow-md"
                    : "bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-transparent"
                }`}
              >
                <AnimatePresence>
                  {cell && (
                    <motion.span
                      initial={{ scale: 0, rotate: -45, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 20 }}
                    >
                      {cell}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        {/* Restart Action Bar */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={resetGame}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-xs uppercase tracking-widest rounded-full flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" /> {winner ? "Qaytadan Boshlash" : "Yangilash"}
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-[10px] font-mono text-center flex items-center justify-center gap-2 pt-3 border-t border-slate-900 text-slate-400">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        <span>Faqat g'alaba qozonsangizgina bal beriladi</span>
      </div>
    </div>
  );
}
