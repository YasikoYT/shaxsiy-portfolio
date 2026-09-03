export interface PlayerAccount {
  id: string;
  username: string;
  email: string;
  password?: string;
  authMethod: "google" | "email" | "guest";
  avatarEmoji: string;
  avatarUrl?: string;
  createdAt: string;
  level: number;
  xp: number;
  badge: string;
  gameScores?: Record<string, number>;
  totalGamesPlayed?: number;
}

const PLAYER_ACCOUNT_KEY = "anvar_user_account";
const REGISTERED_PLAYERS_KEY = "anvar_registered_players_list";

const DEFAULT_GUEST_ACCOUNT: PlayerAccount = {
  id: "player-guest",
  username: "Gamer #1",
  email: "gamer1@portfolio.uz",
  password: "",
  authMethod: "guest",
  avatarEmoji: "🎮",
  createdAt: new Date().toISOString(),
  level: 1,
  xp: 0,
  badge: "Boshlang'ich O'yinchi ⚡",
  gameScores: {},
  totalGamesPlayed: 0
};

export function getCurrentPlayerAccount(): PlayerAccount {
  try {
    const raw = localStorage.getItem(PLAYER_ACCOUNT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.username) {
        // Ensure gameScores and fields exist
        return {
          ...DEFAULT_GUEST_ACCOUNT,
          ...parsed,
          gameScores: parsed.gameScores || {},
          totalGamesPlayed: parsed.totalGamesPlayed || 0
        };
      }
    }
  } catch (e) {
    console.warn("Failed to load player account", e);
  }
  return DEFAULT_GUEST_ACCOUNT;
}

export function savePlayerAccount(account: PlayerAccount): void {
  try {
    localStorage.setItem(PLAYER_ACCOUNT_KEY, JSON.stringify(account));
    localStorage.setItem("anvar_player_name", account.username);
    
    // Also save into registered players list
    const players = getRegisteredPlayersList();
    const idx = players.findIndex((p) => p.id === account.id || (p.email && account.email && p.email.toLowerCase() === account.email.toLowerCase()) || p.username.toLowerCase() === account.username.toLowerCase());
    if (idx >= 0) {
      players[idx] = account;
    } else {
      players.push(account);
    }
    
    // Filter out old legacy dummy bots if any were stored
    const cleanedPlayers = players.filter(p => 
      !p.email?.includes("jasur.cyber") && 
      !p.email?.includes("malika.gamer") &&
      p.username !== "Jasur Pro" &&
      p.username !== "Malika AI"
    );

    // If cleaned list is empty, include current account
    if (cleanedPlayers.length === 0) {
      cleanedPlayers.push(account);
    }

    localStorage.setItem(REGISTERED_PLAYERS_KEY, JSON.stringify(cleanedPlayers));
    window.dispatchEvent(new Event("player_account_updated"));
  } catch (e) {
    console.warn("Failed to save player account", e);
  }
}

export function getRegisteredPlayersList(): PlayerAccount[] {
  try {
    const raw = localStorage.getItem(REGISTERED_PLAYERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Clean out legacy fake bots
        const cleaned = parsed.filter((p: PlayerAccount) => 
          p && 
          p.username &&
          !p.email?.includes("jasur.cyber") && 
          !p.email?.includes("malika.gamer") &&
          p.username !== "Jasur Pro" &&
          p.username !== "Malika AI"
        );
        if (cleaned.length > 0) return cleaned;
      }
    }
  } catch (e) {}
  
  const cur = getCurrentPlayerAccount();
  const defaultList: PlayerAccount[] = [cur];

  try {
    localStorage.setItem(REGISTERED_PLAYERS_KEY, JSON.stringify(defaultList));
  } catch (e) {}

  return defaultList;
}

export function isUsernameTaken(username: string, currentAccountId: string): boolean {
  const clean = username.trim().toLowerCase();
  if (!clean) return false;
  const list = getRegisteredPlayersList();
  return list.some(p => p.id !== currentAccountId && p.username.trim().toLowerCase() === clean);
}

export function registerPlayerAccount(username: string, email: string, password?: string, avatarEmoji = "👾"): { success: boolean; account?: PlayerAccount; error?: string } {
  const cleanNick = username.trim();
  const cleanEmail = email.trim().toLowerCase() || `${cleanNick.toLowerCase().replace(/\s+/g, "")}@gmail.com`;

  if (!cleanNick) {
    return { success: false, error: "Taxallus (nickname) kiritilishi shart!" };
  }

  const list = getRegisteredPlayersList();
  const duplicate = list.find(p => p.username.toLowerCase() === cleanNick.toLowerCase() || p.email.toLowerCase() === cleanEmail.toLowerCase());
  
  if (duplicate) {
    return { success: false, error: `"${cleanNick}" yoki "${cleanEmail}" nomli akaunt allaqachon mavjud! Iltimos, Kirish formasidan foydalaning.` };
  }

  const newAcc: PlayerAccount = {
    id: `user-${Date.now()}`,
    username: cleanNick,
    email: cleanEmail,
    password: password || "",
    authMethod: "email",
    avatarEmoji: avatarEmoji,
    createdAt: new Date().toISOString(),
    level: 1,
    xp: 100,
    badge: "Akaunt O'yinchi 🎮"
  };

  savePlayerAccount(newAcc);
  return { success: true, account: newAcc };
}

export function loginWithCredentials(loginIdentifier: string, passwordInput: string): { success: boolean; account?: PlayerAccount; error?: string } {
  const clean = loginIdentifier.trim().toLowerCase();
  if (!clean) {
    return { success: false, error: "Login (username yoki email) kiritilmadi!" };
  }

  const list = getRegisteredPlayersList();
  const found = list.find(p => p.username.toLowerCase() === clean || p.email.toLowerCase() === clean);

  if (!found) {
    return { success: false, error: `"${loginIdentifier}" nomli akaunt topilmadi. Iltimos, Ro'yxatdan o'tish bo'limidan yangi profil yarating!` };
  }

  // Check password if set on account
  if (found.password && found.password.trim() !== "") {
    if (passwordInput.trim() !== found.password.trim()) {
      return { success: false, error: "Kiritilgan parol noto'g'ri!" };
    }
  }

  savePlayerAccount(found);
  return { success: true, account: found };
}

export function loginWithGoogleAccount(googleEmail: string, googleName: string): PlayerAccount {
  const existingList = getRegisteredPlayersList();
  const found = existingList.find((p) => p.email.toLowerCase() === googleEmail.toLowerCase());

  if (found) {
    savePlayerAccount(found);
    return found;
  }

  const newAcc: PlayerAccount = {
    id: `google-${Date.now()}`,
    username: googleName || googleEmail.split("@")[0],
    email: googleEmail,
    authMethod: "google",
    avatarEmoji: "🚀",
    createdAt: new Date().toISOString(),
    level: 1,
    xp: 200,
    badge: "Gmail Foydalanuvchisi 📧"
  };

  savePlayerAccount(newAcc);
  return newAcc;
}

export function loginWithEmailAccount(username: string, email: string): PlayerAccount {
  const existingList = getRegisteredPlayersList();
  const found = existingList.find((p) => p.email.toLowerCase() === email.toLowerCase());

  if (found) {
    const updated = { ...found, username: username || found.username };
    savePlayerAccount(updated);
    return updated;
  }

  const newAcc: PlayerAccount = {
    id: `user-${Date.now()}`,
    username: username || "O'yinchi",
    email: email || `${username.toLowerCase().replace(/\s+/g, "")}@gmail.com`,
    authMethod: "email",
    avatarEmoji: "👾",
    createdAt: new Date().toISOString(),
    level: 1,
    xp: 100,
    badge: "Akaunt O'yinchi 🎮"
  };

  savePlayerAccount(newAcc);
  return newAcc;
}

export function addXPToCurrentPlayer(amount: number): PlayerAccount {
  const acc = getCurrentPlayerAccount();
  const newXP = Math.max(0, acc.xp + amount);
  const newLevel = Math.max(1, Math.floor(newXP / 250) + 1);

  let newBadge = "Boshlang'ich O'yinchi ⚡";
  if (newLevel >= 15) newBadge = "Buyuk Afsona 👑";
  else if (newLevel >= 10) newBadge = "Grand Master 🔱";
  else if (newLevel >= 7) newBadge = "Kiber Chempion 🏆";
  else if (newLevel >= 4) newBadge = "Tajribali Master ⚡";
  else if (newLevel >= 2) newBadge = "Faol O'yinchi 🎯";

  const updated: PlayerAccount = {
    ...acc,
    xp: newXP,
    level: newLevel,
    badge: newBadge
  };

  savePlayerAccount(updated);
  return updated;
}

export function recordPlayerGameScore(gameId: string, score: number, lowerIsBetter = false): PlayerAccount {
  const acc = getCurrentPlayerAccount();
  const currentScores = acc.gameScores || {};
  const prevBest = currentScores[gameId];

  let isNewPersonalBest = false;
  if (prevBest === undefined) {
    isNewPersonalBest = score > 0;
  } else if (lowerIsBetter) {
    isNewPersonalBest = prevBest === 0 || (score > 0 && score < prevBest);
  } else {
    isNewPersonalBest = score > prevBest;
  }

  const updatedScores = {
    ...currentScores,
    [gameId]: isNewPersonalBest ? score : (prevBest || score)
  };

  // Award XP based on game score achieved
  let earnedXP = 30; // base participation XP
  if (score > 0) {
    if (lowerIsBetter) {
      earnedXP += 50;
    } else {
      earnedXP += Math.min(200, Math.max(10, Math.round(score / 5)));
    }
  }

  const newTotalPlayed = (acc.totalGamesPlayed || 0) + 1;
  const newXP = (acc.xp || 0) + earnedXP;
  const newLevel = Math.max(1, Math.floor(newXP / 250) + 1);

  let newBadge = acc.badge;
  if (newLevel >= 15) newBadge = "Buyuk Afsona 👑";
  else if (newLevel >= 10) newBadge = "Grand Master 🔱";
  else if (newLevel >= 7) newBadge = "Kiber Chempion 🏆";
  else if (newLevel >= 4) newBadge = "Tajribali Master ⚡";
  else if (newLevel >= 2) newBadge = "Faol O'yinchi 🎯";

  const updated: PlayerAccount = {
    ...acc,
    gameScores: updatedScores,
    totalGamesPlayed: newTotalPlayed,
    xp: newXP,
    level: newLevel,
    badge: newBadge
  };

  savePlayerAccount(updated);
  return updated;
}
