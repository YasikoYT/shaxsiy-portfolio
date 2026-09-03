import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Gamepad2, 
  KeyRound, 
  UserPlus, 
  LogIn, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Chrome, 
  ShieldCheck, 
  LogOut, 
  Edit3, 
  Crown,
  Trophy,
  Zap,
  ArrowRight
} from "lucide-react";
import { 
  PlayerAccount, 
  getCurrentPlayerAccount, 
  savePlayerAccount, 
  registerPlayerAccount, 
  loginWithCredentials, 
  loginWithGoogleAccount,
  getRegisteredPlayersList
} from "../lib/playerAccount";

interface GamesAuthGateProps {
  isDarkMode?: boolean;
  onUnlocked?: () => void;
  onOpenPlayerAccountModal?: () => void;
  children: React.ReactNode;
}

const AVATAR_EMOJIS = ["🎮", "🔥", "🚀", "👾", "⚡", "🤖", "👑", "🎯", "🏆", "✨", "🧠", "🦁"];

export default function GamesAuthGate({
  isDarkMode = false,
  onUnlocked,
  onOpenPlayerAccountModal,
  children
}: GamesAuthGateProps) {
  const [account, setAccount] = useState<PlayerAccount>(getCurrentPlayerAccount);
  const [activeTab, setActiveTab] = useState<"login" | "register" | "gmail">("login");

  // Form states
  const [loginInput, setLoginInput] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("🎮");

  const [gmailInput, setGmailInput] = useState("");
  const [gmailName, setGmailName] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const refreshAccount = () => {
    const cur = getCurrentPlayerAccount();
    setAccount(cur);
  };

  useEffect(() => {
    refreshAccount();
    const handleUpdate = () => refreshAccount();
    window.addEventListener("player_account_updated", handleUpdate);
    return () => window.removeEventListener("player_account_updated", handleUpdate);
  }, []);

  const isAuthenticated = account.authMethod !== "guest";

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanInput = loginInput.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    // Check for Admin
    if (
      (cleanInput === "admin" || cleanInput === "anvar_admin" || cleanInput === "admin@gmail.com" || cleanInput === "anvar") &&
      (cleanPass === "admin" || cleanPass === "anvar_admin" || cleanPass === "admin123" || cleanPass === "pass")
    ) {
      localStorage.setItem("anvar_admin_logged_in", "true");
      const adminAcc: PlayerAccount = {
        id: "admin-master-1",
        username: "Anvar Admin",
        email: "admin@anvar.uz",
        password: cleanPass,
        authMethod: "email",
        avatarEmoji: "🛡️",
        createdAt: new Date().toISOString(),
        level: 99,
        xp: 9999,
        badge: "Bosh Admin 🛡️"
      };
      savePlayerAccount(adminAcc);
      setAccount(adminAcc);
      window.dispatchEvent(new Event("admin_status_changed"));
      setSuccessMsg("Bosh Admin tizimiga muvaffaqiyatli kirdingiz!");
      setTimeout(() => {
        setSuccessMsg("");
        if (onUnlocked) onUnlocked();
      }, 1000);
      return;
    }

    const res = loginWithCredentials(loginInput, loginPassword);
    if (!res.success) {
      setErrorMsg(res.error || "Tizimga kirishda xatolik yuz berdi.");
      return;
    }

    if (res.account) {
      setAccount(res.account);
      setSuccessMsg(`Xush kelibsiz, "${res.account.username}"! O'yinlar arenasi ochildi.`);
      setTimeout(() => {
        setSuccessMsg("");
        if (onUnlocked) onUnlocked();
      }, 1200);
    }
  };

  // Handle Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const res = registerPlayerAccount(regUsername, regEmail, regPassword, selectedEmoji);
    if (!res.success) {
      setErrorMsg(res.error || "Ro'yxatdan o'tishda xatolik yuz berdi!");
      return;
    }

    if (res.account) {
      setAccount(res.account);
      setSuccessMsg(`Tabriklaymiz! "${res.account.username}" nicki saqlandi. O'yinlar arenasi ochildi.`);
      setTimeout(() => {
        setSuccessMsg("");
        if (onUnlocked) onUnlocked();
      }, 1200);
    }
  };

  // Handle Google Login
  const handleGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!gmailInput.trim().includes("@")) {
      setErrorMsg("Iltimos, to'g'ri Gmail manzilini kiriting!");
      return;
    }

    const acc = loginWithGoogleAccount(gmailInput.trim(), gmailName.trim());
    setAccount(acc);
    setSuccessMsg(`Gmail orqali muvaffaqiyatli kirdingiz! Xush kelibsiz, ${acc.username}.`);
    setTimeout(() => {
      setSuccessMsg("");
      if (onUnlocked) onUnlocked();
    }, 1200);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("anvar_admin_logged_in");
    window.dispatchEvent(new Event("admin_status_changed"));

    const guestAcc: PlayerAccount = {
      id: `guest-${Date.now()}`,
      username: "Mehmon O'yinchi",
      email: "guest@gmail.com",
      password: "",
      authMethod: "guest",
      avatarEmoji: "🎮",
      createdAt: new Date().toISOString(),
      level: 1,
      xp: 0,
      badge: "Mehmon O'yinchi 🎮"
    };
    savePlayerAccount(guestAcc);
    setAccount(guestAcc);
  };

  if (!isAuthenticated) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.97, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`rounded-3xl p-6 sm:p-10 border shadow-2xl my-6 relative overflow-hidden transition-all ${
          isDarkMode 
            ? "bg-[#0b0e1b] border-amber-500/30 text-white" 
            : "bg-gradient-to-b from-amber-50/90 to-slate-50 border-amber-300 text-slate-900"
        }`}
      >
        {/* Glow ambient background */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl mx-auto space-y-6 relative z-10">
          {/* Header Banner */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 font-mono text-xs font-bold uppercase tracking-wider">
              <KeyRound className="w-4 h-4 text-amber-500 animate-bounce" />
              <span>O'YINLAR RO'YXATIGA KIRISH</span>
            </div>

            <h2 className={`font-serif text-2xl sm:text-4xl font-black tracking-tight ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}>
              Login va Parol Kiritish
            </h2>

            <p className={`text-xs sm:text-sm font-sans max-w-lg mx-auto ${
              isDarkMode ? "text-slate-300" : "text-slate-600"
            }`}>
              O'yinlar ro'yxatini ochish, 34+ mini-o'yinlarni o'ynash va shaxsiy rekordlarni saqlash uchun profilingizga kiring yoki yangi nik oching.
            </p>
          </div>

          {/* Auth Card Box */}
          <div className={`rounded-2xl border p-5 sm:p-7 shadow-xl backdrop-blur-md transition-colors ${
            isDarkMode 
              ? "bg-slate-950/90 border-slate-800 text-white" 
              : "bg-white/95 border-slate-200 text-slate-900 shadow-slate-200/50"
          }`}>
            {/* Tabs */}
            <div className={`flex border-b pb-3 gap-2 text-xs font-mono font-bold mb-5 ${
              isDarkMode ? "border-slate-800" : "border-slate-200"
            }`}>
              <button
                type="button"
                onClick={() => { setActiveTab("login"); setErrorMsg(""); setSuccessMsg(""); }}
                className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === "login"
                    ? "bg-amber-500 text-slate-950 shadow-md font-black"
                    : isDarkMode
                      ? "text-slate-400 hover:text-white hover:bg-slate-800/60"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Kirish (Login)</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab("register"); setErrorMsg(""); setSuccessMsg(""); }}
                className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === "register"
                    ? "bg-emerald-500 text-slate-950 shadow-md font-black"
                    : isDarkMode
                      ? "text-slate-400 hover:text-white hover:bg-slate-800/60"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Ro'yxatdan O'tish</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab("gmail"); setErrorMsg(""); setSuccessMsg(""); }}
                className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === "gmail"
                    ? "bg-rose-500 text-white shadow-md font-black"
                    : isDarkMode
                      ? "text-slate-400 hover:text-white hover:bg-slate-800/60"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Chrome className="w-4 h-4" />
                <span>Google</span>
              </button>
            </div>

            {/* Status alerts */}
            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-300 text-xs font-mono font-bold flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-600 dark:text-rose-300 text-xs font-mono font-bold flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* LOGIN FORM */}
            {activeTab === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className={`block text-xs font-mono font-bold mb-1 flex items-center gap-1.5 ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}>
                    <User className="w-3.5 h-3.5 text-amber-500" />
                    <span>TAXALLUS (NICKNAME) YOKI EMAIL *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="masalan: CyberGamer yoki email@gmail.com"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-colors ${
                      isDarkMode
                        ? "bg-slate-900 border-slate-800 text-white placeholder:text-slate-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-mono font-bold mb-1 flex items-center gap-1.5 ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}>
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                    <span>MAXFIY PAROL *</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      required
                      placeholder="Parolingizni kiriting"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className={`w-full px-4 py-3 pr-12 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-colors ${
                        isDarkMode
                          ? "bg-slate-900 border-slate-800 text-white placeholder:text-slate-500"
                          : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>KIRISH VA O'YINLARNI OCHISH</span>
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {activeTab === "register" && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className={`block text-xs font-mono font-bold mb-1 flex items-center gap-1.5 ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}>
                    <User className="w-3.5 h-3.5 text-emerald-500" />
                    <span>O'YINCHI TAXALLUSI (NICKNAME) *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="masalan: CyberMaster2026"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors ${
                      isDarkMode
                        ? "bg-slate-900 border-slate-800 text-white placeholder:text-slate-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
                    }`}
                  />
                  <span className={`text-[10px] font-mono mt-1 block ${
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  }`}>
                    Ushbu nick unikal bo'ladi va o'yinlar ro'yxatida rekordlaringizni saqlaydi.
                  </span>
                </div>

                <div>
                  <label className={`block text-xs font-mono font-bold mb-1 flex items-center gap-1.5 ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}>
                    <Lock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>PAROL YARATISH *</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? "text" : "password"}
                      required
                      placeholder="Kuchli parol o'ylab toping"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className={`w-full px-4 py-2.5 pr-12 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors ${
                        isDarkMode
                          ? "bg-slate-900 border-slate-800 text-white placeholder:text-slate-500"
                          : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-mono font-bold mb-1 ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}>
                    EMAIL MANZIL (IXTIYORIY)
                  </label>
                  <input
                    type="email"
                    placeholder="masalan: gamer@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors ${
                      isDarkMode
                        ? "bg-slate-900 border-slate-800 text-white placeholder:text-slate-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-mono font-bold mb-1.5 ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}>
                    AVATAR EMOJI
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {AVATAR_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setSelectedEmoji(emoji)}
                        className={`w-9 h-9 rounded-xl border text-lg flex items-center justify-center transition-all cursor-pointer ${
                          selectedEmoji === emoji
                            ? "bg-emerald-500 border-emerald-400 text-slate-950 font-bold scale-105 shadow-md"
                            : isDarkMode
                              ? "bg-slate-900 border-slate-800 hover:bg-slate-800"
                              : "bg-slate-100 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>RO'YXATDAN O'TISH VA O'YINLARNI OCHISH</span>
                </button>
              </form>
            )}

            {/* GMAIL FORM */}
            {activeTab === "gmail" && (
              <form onSubmit={handleGoogleSubmit} className="space-y-4">
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-mono space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <Chrome className="w-4 h-4 text-rose-500" /> Google Bilan Kirish
                  </div>
                  <p className={`text-[11px] ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                    Gmail hisobingiz orqali 1 bosishda kiring va barcha o'yinlarni oching.
                  </p>
                </div>

                <div>
                  <label className={`block text-xs font-mono font-bold mb-1 ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}>
                    GMAIL MANZIL *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="masalan: anvar.gamer@gmail.com"
                    value={gmailInput}
                    onChange={(e) => setGmailInput(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-colors ${
                      isDarkMode
                        ? "bg-slate-900 border-slate-800 text-white placeholder:text-slate-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-mono font-bold mb-1 ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}>
                    ISMINGIZ (IXTIYORIY)
                  </label>
                  <input
                    type="text"
                    placeholder="masalan: Anvar Akramov"
                    value={gmailName}
                    onChange={(e) => setGmailName(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-colors ${
                      isDarkMode
                        ? "bg-slate-900 border-slate-800 text-white placeholder:text-slate-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Chrome className="w-4 h-4" />
                  <span>GOOGLE BILAN O'YINLARNI OCHISH</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Logged-in Header Bar for Games Arena
  return (
    <div className="space-y-6">
      <div className={`p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl ${
        isDarkMode 
          ? "bg-slate-950/90 border-amber-500/30 text-white" 
          : "bg-white border-amber-300 text-neutral-900"
      }`}>
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-2xl sm:text-3xl flex items-center justify-center shrink-0 shadow-inner">
            {account.avatarEmoji || "🎮"}
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-mono font-black text-sm sm:text-base flex items-center gap-1.5 truncate ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}>
                {account.username}
                {account.authMethod === "google" && <Chrome className="w-4 h-4 text-rose-500 shrink-0" />}
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-extrabold font-mono shrink-0">
                FAOL AKOUNT
              </span>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-mono font-extrabold truncate">
              Lvl {account.level || 1} // {account.badge || "O'yinchi"} ({account.xp || 0} XP)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => onOpenPlayerAccountModal?.()}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl border text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${
              isDarkMode
                ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30"
                : "bg-amber-500 text-slate-950 border-amber-400 shadow-sm"
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Profilni Tahrirlash</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer shrink-0 transition-all active:scale-95"
            title="Akauntdan chiqish (Qayta login qilish)"
          >
            <LogOut className="w-4 h-4" />
            <span>Chiqish</span>
          </button>
        </div>
      </div>

      {/* Children: The Unlocked Games & Leaderboard */}
      {children}
    </div>
  );
}
