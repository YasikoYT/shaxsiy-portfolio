/**
 * Central High Score Persistence Engine for Games
 * Uses localStorage to preserve high scores across page refreshes and sessions.
 */

export interface GameMetadata {
  id: string;
  name: string;
  category: "top" | "action" | "logic";
  badge: string;
  unit: string;
  icon?: string;
}

export const GAME_HIGH_SCORES_STORAGE_KEY = "anvar_games_high_scores_v2";

export const ALL_GAMES_METADATA: GameMetadata[] = [
  { id: "tetris", name: "Tetris Matrix", category: "top", badge: "TOP 🎮", unit: "ochko" },
  { id: "tictactoe", name: "X no'l (Tic-Tac-Toe AI)", category: "top", badge: "TOP 🤖", unit: "g'alaba" },
  { id: "spaceinvaders", name: "Space Invaders", category: "top", badge: "ACTION 👾", unit: "ochko" },
  { id: "bubbleshooter", name: "Bubble Shooter", category: "top", badge: "HOT 🔴", unit: "ochko" },
  { id: "fruitninja", name: "Fruit Ninja", category: "top", badge: "SLICE 🍉", unit: "ochko" },
  { id: "brick", name: "Brick Breaker", category: "top", badge: "ARCADE 🧱", unit: "ochko" },
  { id: "typingracer", name: "Speed Typing Racer", category: "action", badge: "RACER 🏎️", unit: "WPM" },
  { id: "snake", name: "Cyber Snake", category: "action", badge: "CLASSIC 🐍", unit: "ochko" },
  { id: "knifehit", name: "Knife Hit", category: "action", badge: "HIT 🎯", unit: "pichoq" },
  { id: "archery", name: "Archery Master", category: "action", badge: "BOW 🏹", unit: "ochko" },
  { id: "space", name: "Space Shooter", category: "action", badge: "ACTION 🚀", unit: "ochko" },
  { id: "flappy", name: "Flappy Bird", category: "action", badge: "HARD 🐥", unit: "ochko" },
  { id: "dino", name: "Dino Runner", category: "action", badge: "RETRO 🦖", unit: "ochko" },
  { id: "mazerunner", name: "Maze Escape", category: "logic", badge: "MAZE 🧭", unit: "sekund" },
  { id: "patternmemory", name: "Pattern Memory", category: "logic", badge: "BRAIN 🧠", unit: "daraja" },
  { id: "gravityrunner", name: "Gravity Runner", category: "logic", badge: "RUN 🚀", unit: "ochko" },
  { id: "speedtyping", name: "Speed Typer", category: "logic", badge: "TYPER ⌨️", unit: "WPM" },
  { id: "minesweeper", name: "Minesweeper", category: "logic", badge: "LOGIC 💣", unit: "sekund" },
  { id: "fastmath", name: "Fast Math", category: "logic", badge: "REFLEX ⚡", unit: "ochko" },
  { id: "pong", name: "Retro Pong", category: "logic", badge: "DUEL 🏓", unit: "ochko" },
  { id: "memory", name: "Memory Match", category: "logic", badge: "BRAIN 🧠", unit: "yurish" },
  { id: "aimtrainer", name: "Aim Trainer", category: "action", badge: "AIM 🎯", unit: "ochko" },
  { id: "colorrush", name: "Color Rush", category: "action", badge: "COLOR 🎨", unit: "ochko" },
  { id: "connect4", name: "Connect Four", category: "logic", badge: "LOGIC 🔴", unit: "g'alaba" },
  { id: "doodlejump", name: "Doodle Jump", category: "action", badge: "JUMP 🦘", unit: "ochko" },
  { id: "helixjump", name: "Helix Jump", category: "action", badge: "DROP 🌀", unit: "ochko" },
  { id: "numbermerge", name: "Number Merge 2048", category: "logic", badge: "2048 🔢", unit: "ochko" },
  { id: "simonsays", name: "Simon Says", category: "logic", badge: "MEMORY 💡", unit: "daraja" },
  { id: "sniper", name: "Sniper Master", category: "action", badge: "SNIPER 🎯", unit: "ochko" },
  { id: "sudoku", name: "Sudoku Mini", category: "logic", badge: "PUZZLE 🔢", unit: "sekund" },
  { id: "tile2048", name: "2048 Classic", category: "logic", badge: "MATH 🔢", unit: "ochko" },
  { id: "towerstack", name: "Tower Stack", category: "action", badge: "STACK 🧱", unit: "qavat" },
  { id: "whackamole", name: "Whack-a-Mole", category: "action", badge: "REFLEX 🔨", unit: "ochko" },
  { id: "wordscramble", name: "Word Scramble", category: "logic", badge: "WORD 🔤", unit: "ochko" },
];

export interface ScoreRecord {
  score: number;
  updatedAt: string;
}

export function getHighScoresMap(): Record<string, ScoreRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(GAME_HIGH_SCORES_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn("Error reading high scores from localStorage:", e);
  }
  return {};
}

export function getGameHighScore(gameId: string): number {
  const map = getHighScoresMap();
  if (map[gameId]?.score !== undefined) {
    return map[gameId].score;
  }
  // Fallback to direct legacy localStorage key
  try {
    const legacy = localStorage.getItem(`game_highscore_${gameId}`) || localStorage.getItem(`${gameId}_high_score`);
    if (legacy) return parseInt(legacy, 10) || 0;
  } catch (e) {}
  return 0;
}

export function saveGameHighScore(gameId: string, newScore: number): boolean {
  if (typeof window === "undefined" || newScore <= 0) return false;
  try {
    const map = getHighScoresMap();
    const currentScore = map[gameId]?.score || 0;
    const gameMeta = ALL_GAMES_METADATA.find((g) => g.id === gameId);

    // Check if lower is better (e.g. seconds or moves)
    const lowerIsBetter = gameMeta?.unit === "sekund" || gameMeta?.unit === "yurish";

    let isNewRecord = false;
    if (lowerIsBetter) {
      if (currentScore === 0 || newScore < currentScore) {
        isNewRecord = true;
      }
    } else {
      if (newScore > currentScore) {
        isNewRecord = true;
      }
    }

    if (isNewRecord) {
      map[gameId] = {
        score: newScore,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(GAME_HIGH_SCORES_STORAGE_KEY, JSON.stringify(map));

      // Also persist to individual legacy keys for standalone game compatibility
      try {
        localStorage.setItem(`game_highscore_${gameId}`, newScore.toString());
        localStorage.setItem(`${gameId}_high_score`, newScore.toString());
      } catch (e) {}

      window.dispatchEvent(new CustomEvent("highscore_updated", { detail: { gameId, score: newScore } }));
      window.dispatchEvent(new CustomEvent("new_record_achieved", { 
        detail: { 
          gameId, 
          score: newScore, 
          gameName: gameMeta?.name || gameId,
          unit: gameMeta?.unit || "ochko"
        } 
      }));
      return true;
    }
  } catch (e) {
    console.warn("Error saving high score to localStorage:", e);
  }
  return false;
}

export function resetAllHighScores(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(GAME_HIGH_SCORES_STORAGE_KEY);
    window.dispatchEvent(new Event("highscore_updated"));
  } catch (e) {
    console.warn("Error resetting high scores:", e);
  }
}
