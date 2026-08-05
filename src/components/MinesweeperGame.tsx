import React, { useState, useEffect } from "react";
import { Play, RotateCcw, Volume2, VolumeX, Trophy, Bomb, Flag } from "lucide-react";
import { getGameHighScore, saveGameHighScore } from "../lib/highScores";

interface MinesweeperProps {
  className?: string;
}

interface Cell {
  r: number;
  c: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

export default function MinesweeperGame({ className = "" }: MinesweeperProps) {
  const ROWS = 8;
  const COLS = 8;
  const MINES_COUNT = 9;

  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameover" | "victory">("menu");
  const [flagsCount, setFlagsCount] = useState(MINES_COUNT);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [startTime, setStartTime] = useState(0);
  const [highScore, setHighScore] = useState(() => getGameHighScore("minesweeper"));

  useEffect(() => {
    setHighScore(getGameHighScore("minesweeper"));
  }, []);

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

  const startGame = () => {
    let board: Cell[][] = [];
    for (let r = 0; r < ROWS; r++) {
      let row: Cell[] = [];
      for (let c = 0; c < COLS; c++) {
        row.push({
          r,
          c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0
        });
      }
      board.push(row);
    }

    // Place Mines
    let placed = 0;
    while (placed < MINES_COUNT) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!board[r][c].isMine) {
        board[r][c].isMine = true;
        placed++;
      }
    }

    // Calculate Numbers
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!board[r][c].isMine) {
          let mines = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].isMine) {
                mines++;
              }
            }
          }
          board[r][c].neighborMines = mines;
        }
      }
    }

    setGrid(board);
    setFlagsCount(MINES_COUNT);
    setStartTime(Date.now());
    setGameState("playing");
  };

  const revealCell = (r: number, c: number) => {
    if (gameState !== "playing") return;
    if (grid[r][c].isRevealed || grid[r][c].isFlagged) return;

    let newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

    if (newGrid[r][c].isMine) {
      // Game Over! Reveal all mines
      newGrid.forEach((row) =>
        row.forEach((cell) => {
          if (cell.isMine) cell.isRevealed = true;
        })
      );
      setGrid(newGrid);
      setGameState("gameover");
      playBeep(180);
      return;
    }

    // Flood fill empty cells
    const floodFill = (nr: number, nc: number) => {
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return;
      if (newGrid[nr][nc].isRevealed || newGrid[nr][nc].isFlagged) return;

      newGrid[nr][nc].isRevealed = true;

      if (newGrid[nr][nc].neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr !== 0 || dc !== 0) floodFill(nr + dr, nc + dc);
          }
        }
      }
    };

    floodFill(r, c);
    setGrid(newGrid);
    playBeep(500);

    // Check Victory
    let unrevealedSafe = 0;
    newGrid.forEach((row) =>
      row.forEach((cell) => {
        if (!cell.isMine && !cell.isRevealed) unrevealedSafe++;
      })
    );

    if (unrevealedSafe === 0) {
      const finalSec = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
      setGameState("victory");
      saveGameHighScore("minesweeper", finalSec);
      if (highScore === 0 || finalSec < highScore) setHighScore(finalSec);
      playBeep(880);
    }
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameState !== "playing") return;
    if (grid[r][c].isRevealed) return;

    let newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
    const currentFlagState = newGrid[r][c].isFlagged;

    if (!currentFlagState && flagsCount <= 0) return;

    newGrid[r][c].isFlagged = !currentFlagState;
    setFlagsCount((f) => (currentFlagState ? f + 1 : f - 1));
    setGrid(newGrid);
    playBeep(650);
  };

  return (
    <div className={`bg-slate-950 rounded-3xl border border-slate-800 p-5 text-white shadow-2xl flex flex-col justify-between ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Bomb className="w-5 h-5 text-red-500 animate-pulse" />
          <span className="font-mono text-xs font-black uppercase text-red-500">CYBER MINESWEEPER</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs">
          <span className="text-amber-400 flex items-center gap-1"><Flag className="w-3.5 h-3.5" /> {flagsCount}</span>
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-slate-400 hover:text-white">
            {soundEnabled ? <Volume2 className="w-4 h-4 text-red-500" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="relative my-3 min-h-[250px] flex items-center justify-center">
        {gameState === "menu" && (
          <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 text-center space-y-4 max-w-xs">
            <h4 className="font-serif text-2xl font-light text-red-500 uppercase tracking-wider">CYBER BOMBSWEEPER</h4>
            <p className="text-xs text-slate-400 font-mono">Maydonni bosing, bombalardan qoching va barcha xavfsiz kataklarni oching!</p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-red-500 hover:bg-red-400 text-black font-mono font-black text-xs uppercase tracking-widest rounded-full flex items-center gap-2 cursor-pointer mx-auto shadow-lg"
            >
              <Play className="w-4 h-4 fill-black" /> O'yinni Boshlash
            </button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="grid grid-cols-8 gap-1.5 w-full max-w-[320px]">
            {grid.map((row, r) =>
              row.map((cell, c) => (
                <button
                  key={`${r}-${c}`}
                  onClick={() => revealCell(r, c)}
                  onContextMenu={(e) => toggleFlag(e, r, c)}
                  className={`aspect-square rounded-lg font-mono text-xs font-black flex items-center justify-center transition-all cursor-pointer ${
                    cell.isRevealed
                      ? cell.isMine
                        ? "bg-red-600 text-white"
                        : "bg-slate-800 text-slate-300 border border-slate-700"
                      : "bg-slate-900 hover:bg-slate-800 border border-slate-800"
                  }`}
                >
                  {cell.isRevealed ? (
                    cell.isMine ? "💣" : cell.neighborMines > 0 ? cell.neighborMines : ""
                  ) : cell.isFlagged ? (
                    "🚩"
                  ) : (
                    ""
                  )}
                </button>
              ))
            )}
          </div>
        )}

        {gameState === "gameover" && (
          <div className="bg-slate-900/95 p-6 rounded-2xl border border-red-500/50 text-center space-y-4 max-w-xs shadow-2xl">
            <h4 className="font-serif text-2xl font-bold text-red-500">BOMBA PORTLADI! 💥</h4>
            <p className="text-xs text-slate-300 font-mono">Keyingi safar ehtiyotkorroq bo'ling!</p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-red-500 hover:bg-red-400 text-black font-mono font-black text-xs uppercase tracking-widest rounded-full flex items-center gap-2 cursor-pointer mx-auto shadow-lg"
            >
              <RotateCcw className="w-4 h-4" /> Qaytadan O'ynash
            </button>
          </div>
        )}

        {gameState === "victory" && (
          <div className="bg-slate-900/95 p-6 rounded-2xl border border-emerald-500/50 text-center space-y-4 max-w-xs shadow-2xl">
            <h4 className="font-serif text-2xl font-bold text-emerald-400">BARCHA BOMBALAR TOPILDI! 🏆</h4>
            <p className="text-xs text-slate-300 font-mono">Siz mukammal strateg bilan g'olib bo'ldingiz!</p>
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
        Boshqaruv: <span className="text-red-400 font-bold">Chap bosish: Ochish</span> | <span className="text-red-400 font-bold">O'ng bosish: Bayroq qo'yish</span>
      </div>
    </div>
  );
}
