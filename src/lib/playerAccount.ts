export interface PlayerAccount {
  id: string;
  username: string;
  email: string;
  authMethod: "google" | "email" | "guest";
  avatarEmoji: string;
  avatarUrl?: string;
  createdAt: string;
  level: number;
  xp: number;
  badge: string;
}

const PLAYER_ACCOUNT_KEY = "anvar_user_account";
const REGISTERED_PLAYERS_KEY = "anvar_registered_players_list";

const DEFAULT_GUEST_ACCOUNT: PlayerAccount = {
  id: "guest-1",
  username: "Gamer #1",
  email: "gamer1@gmail.com",
  authMethod: "guest",
  avatarEmoji: "🎮",
  createdAt: new Date().toISOString(),
  level: 1,
  xp: 120,
  badge: "Boshlang'ich O'yinchi ⚡"
};

export function getCurrentPlayerAccount(): PlayerAccount {
  try {
    const raw = localStorage.getItem(PLAYER_ACCOUNT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.username) return parsed;
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
    const idx = players.findIndex((p) => p.id === account.id || p.email === account.email);
    if (idx >= 0) {
      players[idx] = account;
    } else {
      players.push(account);
    }
    localStorage.setItem(REGISTERED_PLAYERS_KEY, JSON.stringify(players));

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
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  
  const cur = getCurrentPlayerAccount();
  return [
    cur,
    {
      id: "pro-player-2",
      username: "Jasur Pro",
      email: "jasur.cyber@gmail.com",
      authMethod: "google",
      avatarEmoji: "🔥",
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      level: 5,
      xp: 1450,
      badge: "Kiber Chempion 🏆"
    },
    {
      id: "pro-player-3",
      username: "Malika AI",
      email: "malika.gamer@gmail.com",
      authMethod: "google",
      avatarEmoji: "✨",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      level: 3,
      xp: 780,
      badge: "Aql-idrok Ustasi 🧠"
    }
  ];
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
  const newXP = acc.xp + amount;
  const newLevel = Math.floor(newXP / 300) + 1;

  let newBadge = acc.badge;
  if (newLevel >= 10) newBadge = "Legenda 👑";
  else if (newLevel >= 5) newBadge = "Kiber Chempion 🏆";
  else if (newLevel >= 3) newBadge = "Tajribali Master ⚡";

  const updated: PlayerAccount = {
    ...acc,
    xp: newXP,
    level: newLevel,
    badge: newBadge
  };

  savePlayerAccount(updated);
  return updated;
}
