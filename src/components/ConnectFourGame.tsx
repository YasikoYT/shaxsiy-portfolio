import React, { useState } from "react";
import { motion } from "motion/react";
import { Play, RotateCcw, Bot, User, Award, Shield } from "lucide-react";

type Cell = 0 | 1 | 2; // 0: empty, 1: player (red), 2: AI (yellow)

export default function ConnectFourGame({ className = "" }: { className?: string }) {
  const [board, setBoard] = useState<Cell[][]>(
    Array.from({ length: 6 }, () => Array(7).fill(0))
  );
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1); // 1 = Human, 2 = AI
  const [winner, setWinner] = useState<0 | 1 | 2 | 3>(0); // 0 = playing, 1 = Human, 2 = AI, 3 = Draw
  const [stats, setStats] = useState({ humanWins: 0, aiWins: 0 });

  const checkWinner = (grid: Cell[][]): 0 | 1 | 2 | 3 => {
    // Horizontal
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        const val = grid[r][c];
        if (val !== 0 && val === grid[r][c + 1] && val === grid[r][c + 2] && val === grid[r][c + 3]) {
          return val;
        }
      }
    }
    // Vertical
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 7; c++) {
        const val = grid[r][c];
        if (val !== 0 && val === grid[r + 1][c] && val === grid[r + 2][c] && val === grid[r + 3][c]) {
          return val;
        }
      }
    }
    // Diagonal down-right
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        const val = grid[r][c];
        if (val !== 0 && val === grid[r + 1][c + 1] && val === grid[r + 2][c + 2] && val === grid[r + 3][c + 3]) {
          return val;
        }
      }
    }
    // Diagonal down-left
    for (let r = 0; r < 3; r++) {
      for (let c = 3; c < 7; c++) {
        const val = grid[r][c];
        if (val !== 0 && val === grid[r + 1][c - 1] && val === grid[r + 2][c - 2] && val === grid[r + 3][c - 3]) {
          return val;
        }
      }
    }

    // Check draw
    let isFull = true;
    for (let c = 0; c < 7; c++) {
      if (grid[0][c] === 0) {
        isFull = false;
        break;
      }
    }
    if (isFull) return 3;

    return 0;
  };

  const dropDisc = (colIndex: number, player: 1 | 2, currentGrid: Cell[][]): { updatedGrid: Cell[][]; row: number } | null => {
    if (currentGrid[0][colIndex] !== 0) return null; // Column full

    const newGrid = currentGrid.map((row) => [...row]);
    let targetRow = 5;
    while (targetRow >= 0 && newGrid[targetRow][colIndex] !== 0) {
      targetRow--;
    }

    if (targetRow >= 0) {
      newGrid[targetRow][colIndex] = player;
      return { updatedGrid: newGrid, row: targetRow };
    }
    return null;
  };

  const makeAiMove = (grid: Cell[][]) => {
    // Basic AI strategy: check win move, then block human win move, then middle preferred
    const validCols = [];
    for (let c = 0; c < 7; c++) {
      if (grid[0][c] === 0) validCols.push(c);
    }
    if (validCols.length === 0) return;

    // 1. Try AI win
    for (const c of validCols) {
      const res = dropDisc(c, 2, grid);
      if (res && checkWinner(res.updatedGrid) === 2) {
        applyMove(c, 2);
        return;
      }
    }

    // 2. Block Human win
    for (const c of validCols) {
      const res = dropDisc(c, 1, grid);
      if (res && checkWinner(res.updatedGrid) === 1) {
        applyMove(c, 2);
        return;
      }
    }

    // 3. Prefer center column (3) then 2, 4
    const preferredOrder = [3, 2, 4, 1, 5, 0, 6];
    for (const c of preferredOrder) {
      if (validCols.includes(c)) {
        applyMove(c, 2);
        return;
      }
    }

    // Fallback
    const randomCol = validCols[Math.floor(Math.random() * validCols.length)];
    applyMove(randomCol, 2);
  };

  const applyMove = (colIndex: number, player: 1 | 2) => {
    const res = dropDisc(colIndex, player, board);
    if (!res) return;

    setBoard(res.updatedGrid);
    const win = checkWinner(res.updatedGrid);

    if (win !== 0) {
      setWinner(win);
      if (win === 1) setStats((s) => ({ ...s, humanWins: s.humanWins + 1 }));
      if (win === 2) setStats((s) => ({ ...s, aiWins: s.aiWins + 1 }));
    } else {
      const nextP = player === 1 ? 2 : 1;
      setCurrentPlayer(nextP);
      if (nextP === 2) {
        setTimeout(() => {
          makeAiMove(res.updatedGrid);
        }, 500);
      }
    }
  };

  const handleColumnClick = (colIndex: number) => {
    if (winner !== 0 || currentPlayer !== 1) return;
    applyMove(colIndex, 1);
  };

  const resetGame = () => {
    setBoard(Array.from({ length: 6 }, () => Array(7).fill(0)));
    setCurrentPlayer(1);
    setWinner(0);
  };

  return (
    <div className={`bg-neutral-900 text-white rounded-3xl p-6 border border-neutral-800 shadow-2xl relative overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
        <div>
          <h3 className="font-serif text-2xl font-bold text-amber-400 flex items-center gap-2">
            <Bot className="w-6 h-6 text-amber-400" /> Connect Four AI
          </h3>
          <p className="text-xs text-neutral-400 font-mono">4 ta bir xil rangdagi disklarni bir qatorga tering!</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
            <span className="text-red-400 font-bold">Siz:</span> <span className="text-white font-bold">{stats.humanWins}</span>
          </div>
          <div className="bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
            <span className="text-amber-400 font-bold">AI Bot:</span> <span className="text-white font-bold">{stats.aiWins}</span>
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="max-w-md mx-auto bg-blue-700 p-4 rounded-3xl border-4 border-blue-900 shadow-2xl">
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, colIdx) => (
            <button
              key={colIdx}
              onClick={() => handleColumnClick(colIdx)}
              disabled={winner !== 0 || currentPlayer !== 1}
              className="flex flex-col gap-2 cursor-pointer group hover:bg-blue-600/50 p-1 rounded-2xl transition-colors"
            >
              {Array.from({ length: 6 }).map((_, rowIdx) => {
                const cellVal = board[rowIdx][colIdx];
                return (
                  <div
                    key={rowIdx}
                    className={`w-full aspect-square rounded-full border-2 border-blue-900 shadow-inner flex items-center justify-center transition-all ${
                      cellVal === 1
                        ? "bg-red-500 shadow-red-400/50 scale-95"
                        : cellVal === 2
                        ? "bg-amber-400 shadow-yellow-300/50 scale-95"
                        : "bg-blue-950/80 group-hover:bg-blue-900/80"
                    }`}
                  />
                );
              })}
            </button>
          ))}
        </div>
      </div>

      {/* Reset & Status */}
      <div className="flex justify-between items-center mt-6 max-w-md mx-auto">
        <div className="text-xs font-mono">
          {winner === 0 ? (
            <span className="text-amber-300 flex items-center gap-1.5 font-bold">
              <span className={`w-2.5 h-2.5 rounded-full ${currentPlayer === 1 ? "bg-red-500" : "bg-amber-400 animate-pulse"}`} />
              {currentPlayer === 1 ? "Sizning navbatingiz (Qizil)" : "AI o'ylamoqda..."}
            </span>
          ) : (
            <span className="text-emerald-400 font-bold">O'yin yakunlandi</span>
          )}
        </div>
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-neutral-800 text-neutral-200 hover:text-white hover:bg-neutral-700 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-neutral-700"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Qayta
        </button>
      </div>

      {/* Overlays */}
      {winner !== 0 && (
        <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
          <div className="space-y-4">
            <h4 className="font-serif text-3xl font-bold">
              {winner === 1 ? (
                <span className="text-emerald-400">Siz G'olib Bo'ldingiz! 🎉</span>
              ) : winner === 2 ? (
                <span className="text-amber-400">AI Bot G'olib Bo'ldi! 🤖</span>
              ) : (
                <span className="text-neutral-300">Durang Natija! 🤝</span>
              )}
            </h4>
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-amber-400 text-black font-mono font-bold rounded-2xl hover:bg-amber-300 transition-all flex items-center gap-2 mx-auto shadow-lg cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Yana O'ynash
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
