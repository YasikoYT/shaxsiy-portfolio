import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  LogOut, 
  Check, 
  X, 
  Trophy, 
  Zap, 
  Gamepad2, 
  KeyRound, 
  Chrome,
  Crown,
  Edit3,
  UserCheck
} from "lucide-react";
import { 
  PlayerAccount, 
  getCurrentPlayerAccount, 
  savePlayerAccount, 
  loginWithGoogleAccount, 
  loginWithEmailAccount,
  getRegisteredPlayersList
} from "../lib/playerAccount";

interface PlayerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}

const AVATAR_EMOJIS = ["🎮", "🔥", "🚀", "👾", "⚡", "🤖", "👑", "🎯", "🏆", "✨", "🧠", "🦁"];

export default function PlayerAccountModal({ isOpen, onClose, isDarkMode = false }: PlayerAccountModalProps) {
  const [account, setAccount] = useState<PlayerAccount>(getCurrentPlayerAccount);
  const [activeView, setActiveView] = useState<"profile" | "login" | "gmail">("profile");

  // Form states for custom login/registration
  const [username, setUsername] = useState(account.username);
  const [email, setEmail] = useState(account.email);
  const [selectedEmoji, setSelectedEmoji] = useState(account.avatarEmoji);

  // Google Login state
  const [gmailInput, setGmailInput] = useState("");
  const [gmailName, setGmailName] = useState("");
  const [isSimulatingGoogle, setIsSimulatingGoogle] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      const cur = getCurrentPlayerAccount();
      setAccount(cur);
      setUsername(cur.username);
      setEmail(cur.email);
      setSelectedEmoji(cur.avatarEmoji);
      setSuccessMsg("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpdateProfile = () => {
    const updated: PlayerAccount = {
      ...account,
      username: username.trim() || "O'yinchi",
      email: email.trim() || account.email,
      avatarEmoji: selectedEmoji
    };
    savePlayerAccount(updated);
    setAccount(updated);
    setSuccessMsg("Profil muvaffaqiyatli yangilandi!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    const newAcc = loginWithEmailAccount(username.trim(), email.trim());
    setAccount(newAcc);
    setSuccessMsg(`Xush kelibsiz, ${newAcc.username}!`);
    setTimeout(() => {
      setSuccessMsg("");
      setActiveView("profile");
    }, 1500);
  };

  const handleGoogleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = gmailInput.trim() || "user.gamer@gmail.com";
    if (!cleanEmail.includes("@")) {
      alert("Iltimos, to'g'ri Gmail manzilini kiriting!");
      return;
    }

    setIsSimulatingGoogle(true);
    setTimeout(() => {
      const name = gmailName.trim() || cleanEmail.split("@")[0];
      const newAcc = loginWithGoogleAccount(cleanEmail, name);
      setAccount(newAcc);
      setIsSimulatingGoogle(false);
      setSuccessMsg(`Google (${cleanEmail}) orqali muvaffaqiyatli kirdingiz! 🎉`);
      setTimeout(() => {
        setSuccessMsg("");
        setActiveView("profile");
      }, 1500);
    }, 1000);
  };

  const handleLogout = () => {
    const guestAcc: PlayerAccount = {
      id: `guest-${Date.now()}`,
      username: "Mehmon O'yinchi",
      email: "guest@gmail.com",
      authMethod: "guest",
      avatarEmoji: "🎮",
      createdAt: new Date().toISOString(),
      level: 1,
      xp: 0,
      badge: "Mehmon"
    };
    savePlayerAccount(guestAcc);
    setAccount(guestAcc);
    setUsername("Mehmon O'yinchi");
    setEmail("guest@gmail.com");
    setActiveView("login");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden relative ${
            isDarkMode 
              ? "bg-slate-950 text-white border-slate-800" 
              : "bg-white text-slate-900 border-slate-200"
          }`}
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-800/60 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-emerald-500/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl shadow-inner">
                {account.avatarEmoji || "🎮"}
              </div>
              <div>
                <h3 className="font-mono font-black text-sm uppercase tracking-wide flex items-center gap-2">
                  <span>O'YINCHI AKAUNTI</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    ONLINE
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-mono truncate max-w-[200px]">
                  {account.email || "Akaunt biriktirilgan"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub Navigation */}
          <div className="flex border-b border-slate-800 bg-slate-900/50 p-1.5 gap-1 text-xs font-mono font-bold">
            <button
              onClick={() => setActiveView("profile")}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeView === "profile" 
                  ? "bg-amber-500 text-black shadow-md" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profilim</span>
            </button>

            <button
              onClick={() => setActiveView("gmail")}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeView === "gmail" 
                  ? "bg-rose-500 text-white shadow-md" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Chrome className="w-3.5 h-3.5" />
              <span>Gmail Login</span>
            </button>

            <button
              onClick={() => setActiveView("login")}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeView === "login" 
                  ? "bg-emerald-500 text-black shadow-md" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Ro'yxatdan o'tish</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6">
            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {activeView === "profile" && (
              <div className="space-y-5">
                {/* Level & XP Box */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono font-bold">
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <Crown className="w-4 h-4" /> Level {account.level}
                    </span>
                    <span className="text-slate-400">{account.xp} / {account.level * 300} XP</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (account.xp / (account.level * 300)) * 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-slate-400">
                    <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                      {account.badge}
                    </span>
                    <span className="capitalize">Usul: {account.authMethod}</span>
                  </div>
                </div>

                {/* Avatar Picker */}
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-400 mb-2">
                    AVATAR EMOJI
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setSelectedEmoji(emoji)}
                        className={`w-9 h-9 rounded-xl border text-lg flex items-center justify-center transition-all cursor-pointer ${
                          selectedEmoji === emoji
                            ? "bg-amber-500 border-amber-400 text-black scale-110 shadow-lg shadow-amber-500/30"
                            : "bg-slate-900 border-slate-800 text-white hover:bg-slate-800"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Edit Form */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-400 mb-1">
                      O'YINCHI TAXALLUSI (USERNAME)
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-400 mb-1">
                      GMAIL / EMAIL MANZILI
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleUpdateProfile}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" /> Saqlash
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-mono font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                    title="Akauntdan chiqish"
                  >
                    <LogOut className="w-4 h-4" /> Chiqish
                  </button>
                </div>
              </div>
            )}

            {activeView === "gmail" && (
              <form onSubmit={handleGoogleAuthSubmit} className="space-y-4">
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Chrome className="w-5 h-5 text-rose-400" />
                    <span>Gmail Bilan Tezkor Kirish</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Gmail hisobingiz bilan tizmga kiring va barcha o'yin natijalaringiz hamda rekordlaringizni yagona akaunt ostida saqlang.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-400 mb-1">
                    GMAIL MANZILINGIZ (@gmail.com)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="masalan: anvar.gamer@gmail.com"
                    value={gmailInput}
                    onChange={(e) => setGmailInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-400 mb-1">
                    ISMINGIZ (IXTIYORIY)
                  </label>
                  <input
                    type="text"
                    placeholder="masalan: Akramov Anvar"
                    value={gmailName}
                    onChange={(e) => setGmailName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-rose-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSimulatingGoogle}
                  className="w-full py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Chrome className="w-4 h-4" />
                  <span>{isSimulatingGoogle ? "Gmail tasdiqlanmoqda..." : "Gmail Bilan Kirish"}</span>
                </button>
              </form>
            )}

            {activeView === "login" && (
              <form onSubmit={handleCustomLogin} className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <UserCheck className="w-5 h-5 text-emerald-400" />
                    <span>Yangi Akaunt Yarating</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    O'zingizga yoqqan taxallus va login ma'lumotlarini kiriting.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-400 mb-1">
                    O'YINCHI TAXALLUSI *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="masalan: CyberGamer2026"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-400 mb-1">
                    EMAIL MANZIL
                  </label>
                  <input
                    type="email"
                    placeholder="masalan: gamer@mail.uz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Akaunt Yaratish va Kirish</span>
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
