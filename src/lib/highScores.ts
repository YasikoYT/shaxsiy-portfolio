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
  { id: "spaceshooter", name: "Space Shooter", category: "action", badge: "ACTION 🚀", unit: "ochko" },
  { id: "flappy", name: "Flappy Bird", category: "action", badge: "HARD 🐥", unit: "ochko" },
  { id: "dino", name: "Dino Runner", category: "action", badge: "RETRO 🦖", unit: "ochko" },
  { id: "mazerunner", name: "Maze Escape", category: "logic", badge: "MAZE 🧭", unit: "sekund" },
  { id: "patternmemory", name: "Pattern Memory", category: "logic", badge: "BRAIN 🧠", unit: "daraja" },
  { id: "gravityrunner", name: "Gravity Runner", category: "logic", badge: "RUN 🚀", unit: "ochko" },
  { id: "speedtyping", name: "Speed Typer", category: "logic", badge: "TYPER ⌨️", unit: "WPM" },
  { id: "minesweeper", name: "Minesweeper", category: "logic", badge: "LOGIC 💣", unit: "sekund" },
  { id: "fastmath", name: "Fast Math", category: "logic", badge: "REFLEX ⚡", unit: "ochko" },
  { id: "pingpong", name: "Retro Pong", category: "logic", badge: "DUEL 🏓", unit: "ochko" },
  { id: "memory", name: "Memory Match", category: "logic", badge: "BRAIN 🧠", unit: "yurish" },
  { id: "aimtrainer", name: "Aim Trainer", category: "action", badge: "AIM 🎯", unit: "ochko" },
  { id: "colorrush", name: "Color Rush", category: "action", badge: "COLOR 🎨", unit: "ochko" },
  { id: "connectfour", name: "Connect Four", category: "logic", badge: "LOGIC 🔴", unit: "g'alaba" },
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
  holderName?: string;
  holderAvatar?: string;
}

import { getCurrentPlayerAccount } from "./playerAccount";

export function getHighScoresMap(): Record<string, ScoreRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(GAME_HIGH_SCORES_STORAGE_KEY);
    let map: Record<string, ScoreRecord> = {};
    if (raw) {
      try {
        map = JSON.parse(raw);
      } catch (e) {
        map = {};
      }
    }

    let changed = false;
    const activePlayer = getCurrentPlayerAccount();
    const fallbackNick = activePlayer?.username || "Jasur Pro";
    const fallbackAvatar = activePlayer?.avatarEmoji || "🎮";

    // Scan all legacy and individual keys to ensure no game score is missed or lost
    ALL_GAMES_METADATA.forEach((game) => {
      const currentRecord = map[game.id];
      const currentScore = currentRecord?.score ?? 0;
      const lowerIsBetter = game.unit === "sekund" || game.unit === "yurish";

      const legacyKeys = [
        `game_highscore_${game.id}`,
        `${game.id}_high_score`,
        `${game.id}_highscore`,
        `${game.id}_high_wpm`,
        `anvar_game_${game.id}_score`,
        game.id === "spaceshooter" ? "spaceshooter_highscore" : "",
        game.id === "simonsays" ? "simon_says_highscore" : "",
        game.id === "speedtyping" ? "speed_typing_high_wpm" : "",
        game.id === "archery" ? "archery_high_score" : "",
        game.id === "gravityrunner" ? "gravity_runner_highscore" : "",
        game.id === "knifehit" ? "knife_hit_highscore" : "",
        game.id === "bubbleshooter" ? "bubble_shooter_highscore" : "",
        game.id === "wordscramble" ? "word_scramble_highscore" : "",
      ].filter(Boolean);

      let foundLegacyScore = 0;
      for (const key of legacyKeys) {
        try {
          const val = localStorage.getItem(key);
          if (val) {
            const num = parseInt(val, 10);
            if (!isNaN(num) && num > 0) {
              if (foundLegacyScore === 0) foundLegacyScore = num;
              else if (lowerIsBetter && num < foundLegacyScore) foundLegacyScore = num;
              else if (!lowerIsBetter && num > foundLegacyScore) foundLegacyScore = num;
            }
          }
        } catch (e) {}
      }

      if (foundLegacyScore > 0) {
        let isBetter = false;
        if (currentScore === 0) isBetter = true;
        else if (lowerIsBetter && foundLegacyScore < currentScore) isBetter = true;
        else if (!lowerIsBetter && foundLegacyScore > currentScore) isBetter = true;

        if (isBetter) {
          const savedHolder = localStorage.getItem(`game_record_holder_${game.id}`) || fallbackNick;
          map[game.id] = {
            score: foundLegacyScore,
            updatedAt: map[game.id]?.updatedAt || new Date().toISOString(),
            holderName: savedHolder,
            holderAvatar: fallbackAvatar
          };
          changed = true;
        }
      }

      // Ensure holderName exists if record is present
      if (map[game.id] && !map[game.id].holderName) {
        const savedHolder = localStorage.getItem(`game_record_holder_${game.id}`) || fallbackNick;
        map[game.id] = {
          ...map[game.id],
          holderName: savedHolder,
          holderAvatar: map[game.id].holderAvatar || fallbackAvatar
        };
        changed = true;
      }
    });

    if (changed) {
      try {
        localStorage.setItem(GAME_HIGH_SCORES_STORAGE_KEY, JSON.stringify(map));
      } catch (e) {}
    }

    return map;
  } catch (e) {
    console.warn("Error reading high scores from localStorage:", e);
  }
  return {};
}

export function getGameHighScore(gameId: string): number {
  if (typeof window === "undefined") return 0;
  const map = getHighScoresMap();
  if (map[gameId]?.score !== undefined) {
    return map[gameId].score;
  }
  return 0;
}

export function getGameRecordHolder(gameId: string): { name: string; avatar: string; score: number } {
  if (typeof window === "undefined") return { name: "Gamer #1", avatar: "🎮", score: 0 };
  const map = getHighScoresMap();
  const rec = map[gameId];
  if (rec && rec.score > 0) {
    return {
      name: rec.holderName || "Jasur Pro",
      avatar: rec.holderAvatar || "🎮",
      score: rec.score
    };
  }
  return { name: "Rekord xali yo'q", avatar: "👤", score: 0 };
}

export function saveGameHighScore(gameId: string, newScore: number, customNickname?: string): boolean {
  if (typeof window === "undefined") return false;
  const scoreNum = Number(newScore);
  if (isNaN(scoreNum) || scoreNum < 0) return false;

  try {
    const map = getHighScoresMap();
    const currentRecord = map[gameId];
    const currentScore = currentRecord?.score;
    const gameMeta = ALL_GAMES_METADATA.find((g) => g.id === gameId);

    const activePlayer = getCurrentPlayerAccount();
    const activeNickname = customNickname || activePlayer?.username || localStorage.getItem("anvar_player_name") || "Gamer #1";
    const activeAvatar = activePlayer?.avatarEmoji || "🎮";

    const lowerIsBetter = gameMeta?.unit === "sekund" || gameMeta?.unit === "yurish";

    let isNewRecord = false;
    if (currentScore === undefined) {
      if (scoreNum > 0) isNewRecord = true;
    } else if (lowerIsBetter) {
      if (currentScore === 0 || (scoreNum > 0 && scoreNum < currentScore)) {
        isNewRecord = true;
      }
    } else {
      if (scoreNum > currentScore) {
        isNewRecord = true;
      }
    }

    if (isNewRecord) {
      map[gameId] = {
        score: scoreNum,
        updatedAt: new Date().toISOString(),
        holderName: activeNickname,
        holderAvatar: activeAvatar
      };

      localStorage.setItem(GAME_HIGH_SCORES_STORAGE_KEY, JSON.stringify(map));

      // Also persist to individual legacy keys for direct access
      try {
        localStorage.setItem(`game_highscore_${gameId}`, scoreNum.toString());
        localStorage.setItem(`${gameId}_high_score`, scoreNum.toString());
        localStorage.setItem(`${gameId}_highscore`, scoreNum.toString());
        localStorage.setItem(`game_record_holder_${gameId}`, activeNickname);
      } catch (e) {}

      window.dispatchEvent(new CustomEvent("highscore_updated", { detail: { gameId, score: scoreNum, holderName: activeNickname } }));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("new_record_achieved", { 
        detail: { 
          gameId, 
          score: scoreNum, 
          gameName: gameMeta?.name || gameId,
          unit: gameMeta?.unit || "ochko",
          holderName: activeNickname
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
    // Remove individual legacy keys as well
    ALL_GAMES_METADATA.forEach((g) => {
      try {
        localStorage.removeItem(`game_highscore_${g.id}`);
        localStorage.removeItem(`${g.id}_high_score`);
        localStorage.removeItem(`${g.id}_highscore`);
        localStorage.removeItem(`${g.id}_high_wpm`);
      } catch (e) {}
    });
    window.dispatchEvent(new CustomEvent("highscore_updated"));
  } catch (e) {
    console.warn("Error resetting high scores:", e);
  }
}
