import React, { useState } from "react";
import { Play, RotateCcw, Grid, CheckCircle, HelpCircle } from "lucide-react";

// 4x4 Mini Sudoku puzzle initial state & solution
const PUZZLES = [
  {
    initial: [
      [1, 0, 0, 4],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [3, 0, 0, 2],
    ],
    solution: [
      [1, 3, 2, 4],
      [4, 2, 1, 3],
      [2, 4, 3, 1],
      [3, 1, 4, 2],
    ],
  },
  {
    initial: [
      [0, 2, 4, 0],
      [1, 0, 0, 3],
      [4, 0, 0, 2],
      [0, 1, 3, 0],
    ],
    solution: [
      [3, 2, 4, 1],
      [1, 4, 2, 3],
      [4, 3, 1, 2],
      [2, 1, 3, 4],
    ],
  },
];

export default function SudokuMiniGame({ className = "" }: { className?: string }) {
  const [gameState, setGameState] = useState<"idle" | "playing" | "victory">("idle");
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [board, setBoard] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [errors, setErrors] = useState<boolean[][]>([]);

  const startGame = () => {
    const idx = Math.floor(Math.random() * PUZZLES.length);
    setPuzzleIndex(idx);
    const initialBoard = PUZZLES[idx].initial.map((row) => [...row]);
    setBoard(initialBoard);
    setSelectedCell(null);
    setErrors(Array(4).fill(0).map(() => Array(4).fill(false)));
    setGameState("playing");
  };

  const handleCellClick = (r: number, c: number) => {
    if (PUZZLES[puzzleIndex].initial[r][c] !== 0) return; // Original fixed cells
    setSelectedCell([r, c]);
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell || gameState !== "playing") return;
    const [r, c] = selectedCell;

    const newBoard = board.map((row) => [...row]);
    newBoard[r][c] = num;
    setBoard(newBoard);

    // Check solution
    let solved = true;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (newBoard[row][col] !== PUZZLES[puzzleIndex].solution[row][col]) {
          solved = false;
          break;
        }
      }
    }

    if (solved) {
      setGameState("victory");
    }
  };

  return (
    <div className={`bg-neutral-900 text-white rounded-3xl p-6 border border-neutral-800 shadow-2xl relative overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
        <div>
          <h3 className="font-serif text-2xl font-bold text-emerald-400 flex items-center gap-2">
            <Grid className="w-6 h-6 text-emerald-400" /> Mini Sudoku (4x4)
          </h3>
          <p className="text-xs text-neutral-400 font-mono">Bo'sh xanalarni 1, 2, 3 va 4 raqamlari bilan to'ldiring!</p>
        </div>
      </div>

      {/* Sudoku Grid */}
      <div className="flex flex-col items-center justify-center my-4 space-y-6">
        <div className="grid grid-cols-4 gap-1.5 bg-neutral-800 p-2 rounded-2xl border border-neutral-700 shadow-xl">
          {board.map((row, r) =>
            row.map((val, c) => {
              const isOriginal = PUZZLES[puzzleIndex]?.initial[r][c] !== 0;
              const isSelected = selectedCell && selectedCell[0] === r && selectedCell[1] === c;

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={`w-14 h-14 rounded-xl text-xl font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${
                    isOriginal
                      ? "bg-neutral-950 text-neutral-300 font-black cursor-not-allowed border border-neutral-800"
                      : isSelected
                      ? "bg-emerald-500 text-black shadow-lg scale-105 border-2 border-emerald-300"
                      : val !== 0
                      ? "bg-neutral-800 text-emerald-400 border border-neutral-700"
                      : "bg-neutral-900 text-neutral-600 hover:bg-neutral-800 border border-neutral-800"
                  }`}
                >
                  {val !== 0 ? val : ""}
                </button>
              );
            })
          )}
        </div>

        {/* Number Numpad */}
        {gameState === "playing" && (
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberInput(num)}
                className="w-12 h-12 bg-neutral-800 hover:bg-emerald-500 hover:text-black text-white font-mono font-bold rounded-xl border border-neutral-700 text-lg transition-all shadow-md active:scale-95 cursor-pointer"
              >
                {num}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Overlays */}
      {gameState !== "playing" && (
        <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
          {gameState === "idle" ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto border border-emerald-500/30">
                <Grid className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-3xl font-bold text-white">4x4 Sudoku Puzzle</h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Mantiqiy o'ylang va har bir qatorda va ustunda takrorlanmas raqamlarni joylashtiring!
              </p>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-emerald-500 text-black font-mono font-bold rounded-2xl hover:bg-emerald-400 transition-all flex items-center gap-2 mx-auto shadow-lg cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black" /> Boshlash
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-3xl font-bold text-emerald-400">TO'G'RI YECHDINGIZ! 🎉</h4>
              <p className="text-xs text-neutral-400">Barakalla, mantiqiy topshiriq muvaffaqiyatli bajarildi!</p>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-emerald-500 text-black font-mono font-bold rounded-2xl hover:bg-emerald-400 transition-all flex items-center gap-2 mx-auto shadow-lg cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Keyingi Boshqotirma
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
