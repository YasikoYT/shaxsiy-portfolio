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
}

const PLAYER_ACCOUNT_KEY = "anvar_user_account";
const REGISTERED_PLAYERS_KEY = "anvar_registered_players_list";

const DEFAULT_GUEST_ACCOUNT: PlayerAccount = {
  id: "guest-1",
  username: "Gamer #1",
  email: "gamer1@gmail.com",
  password: "",
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
    const idx = players.findIndex((p) => p.id === account.id || (p.email && p.email.toLowerCase() === account.email.toLowerCase()) || p.username.toLowerCase() === account.username.toLowerCase());
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
  const defaultList: PlayerAccount[] = [
    cur,
    {
      id: "pro-player-2",
      username: "Jasur Pro",
      email: "jasur.cyber@gmail.com",
      password: "pass",
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
      password: "pass",
      authMethod: "google",
      avatarEmoji: "✨",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      level: 3,
      xp: 780,
      badge: "Aql-idrok Ustasi 🧠"
    }
  ];

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
