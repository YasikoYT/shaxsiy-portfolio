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
  UserCheck,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  AlertCircle
} from "lucide-react";
import { 
  PlayerAccount, 
  getCurrentPlayerAccount, 
  savePlayerAccount, 
  loginWithGoogleAccount, 
  loginWithEmailAccount,
  getRegisteredPlayersList,
  isUsernameTaken,
  loginWithCredentials,
  registerPlayerAccount
} from "../lib/playerAccount";

interface PlayerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
  onOpenAdminPanel?: () => void;
}

const AVATAR_EMOJIS = ["🎮", "🔥", "🚀", "👾", "⚡", "🤖", "👑", "🎯", "🏆", "✨", "🧠", "🦁"];

export default function PlayerAccountModal({ isOpen, onClose, isDarkMode = false, onOpenAdminPanel }: PlayerAccountModalProps) {
  const [account, setAccount] = useState<PlayerAccount>(getCurrentPlayerAccount);
  const [activeView, setActiveView] = useState<"login" | "register" | "profile" | "gmail">("login");

  // Login form state
  const [loginInput, setLoginInput] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("🎮");

  // Profile edit state
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Google Login state
  const [gmailInput, setGmailInput] = useState("");
  const [gmailName, setGmailName] = useState("");
  const [isSimulatingGoogle, setIsSimulatingGoogle] = useState(false);

  // Status/Message alerts
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      const cur = getCurrentPlayerAccount();
      setAccount(cur);
      setEditUsername(cur.username);
      setEditEmail(cur.email);
      setSelectedEmoji(cur.avatarEmoji || "🎮");
      setSuccessMsg("");
      setErrorMsg("");

      // If user is guest, default to login view; otherwise profile view
      if (cur.authMethod === "guest") {
        setActiveView("login");
      } else {
        setActiveView("profile");
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Login submission (Supports both User & Admin credentials!)
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanInput = loginInput.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    // Check for Admin credentials first
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
      
      setSuccessMsg("Bosh Admin tizimiga muvaffaqiyatli kirdingiz! Admin panel faollashtirildi.");
      setTimeout(() => {
        setSuccessMsg("");
        if (onOpenAdminPanel) {
          onOpenAdminPanel();
          onClose();
        } else {
          setActiveView("profile");
        }
      }, 1200);
      return;
    }

    // Otherwise standard Player login
    const res = loginWithCredentials(loginInput, loginPassword);
    if (!res.success) {
      setErrorMsg(res.error || "Login amalga oshmadi!");
      return;
    }

    if (res.account) {
      setAccount(res.account);
      setSuccessMsg(`Xush kelibsiz, ${res.account.username}! Tizimga kirdingiz.`);
      setTimeout(() => {
        setSuccessMsg("");
        setActiveView("profile");
      }, 1200);
    }
  };

  // Handle Registration submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const res = registerPlayerAccount(regUsername, regEmail, regPassword, selectedEmoji);
    if (!res.success) {
      setErrorMsg(res.error || "Ro'yxatdan o'tishda xatolik!");
      return;
    }

    if (res.account) {
      setAccount(res.account);
      setSuccessMsg(`Tabriklaymiz! "${res.account.username}" akaunti yaratildi va saqlandi.`);
      setTimeout(() => {
        setSuccessMsg("");
        setActiveView("profile");
      }, 1500);
    }
  };

  // Handle Profile Update
  const handleUpdateProfile = () => {
    setErrorMsg("");
    setSuccessMsg("");

    const cleanNick = editUsername.trim() || "O'yinchi";
    if (isUsernameTaken(cleanNick, account.id)) {
      setErrorMsg(`"${cleanNick}" nikini boshqa o'yinchi egallagan! Iltimos, boshqa nik tanlang.`);
      return;
    }

    const updated: PlayerAccount = {
      ...account,
      username: cleanNick,
      email: editEmail.trim() || account.email,
      avatarEmoji: selectedEmoji
    };
    savePlayerAccount(updated);
    setAccount(updated);
    setSuccessMsg("Profil muvaffaqiyatli saqlandi va yangilandi!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // Handle Google Auth Submission
  const handleGoogleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanEmail = gmailInput.trim() || "user.gamer@gmail.com";
    if (!cleanEmail.includes("@")) {
      setErrorMsg("Iltimos, to'g'ri Gmail manzilini kiriting!");
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
    localStorage.removeItem("anvar_admin_logged_in");
    window.dispatchEvent(new Event("admin_status_changed"));

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
    setLoginInput("");
    setLoginPassword("");
    setActiveView("login");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
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
                  <span>GOOGLE & CYBER AKAUNT</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                    ACTIVE
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-mono truncate max-w-[200px]">
                  {account.username} ({account.email || "Offline"})
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

          {/* Sub Navigation Tabs */}
          <div className={`flex border-b p-1.5 gap-1 text-xs font-mono font-bold ${
            isDarkMode ? "border-slate-800 bg-slate-900/60" : "border-slate-200 bg-slate-100/80"
          }`}>
            <button
              type="button"
              onClick={() => { setActiveView("login"); setErrorMsg(""); setSuccessMsg(""); }}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeView === "login" 
                  ? "bg-amber-500 text-slate-950 shadow-md font-black" 
                  : isDarkMode 
                    ? "text-slate-400 hover:text-white hover:bg-slate-800" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Kirish</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveView("register"); setErrorMsg(""); setSuccessMsg(""); }}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeView === "register" 
                  ? "bg-emerald-500 text-slate-950 shadow-md font-black" 
                  : isDarkMode 
                    ? "text-slate-400 hover:text-white hover:bg-slate-800" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Ro'yxatdan o'tish</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveView("gmail"); setErrorMsg(""); setSuccessMsg(""); }}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeView === "gmail" 
                  ? "bg-rose-500 text-white shadow-md font-black" 
                  : isDarkMode 
                    ? "text-slate-400 hover:text-white hover:bg-slate-800" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <Chrome className="w-3.5 h-3.5" />
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveView("profile"); setErrorMsg(""); setSuccessMsg(""); }}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeView === "profile" 
                  ? "bg-purple-500 text-white shadow-md font-black" 
                  : isDarkMode 
                    ? "text-slate-400 hover:text-white hover:bg-slate-800" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profilim</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-4">
            {/* Status Messages */}
            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-300 text-xs font-mono font-bold flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-600 dark:text-rose-300 text-xs font-mono font-bold flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* LOGIN VIEW */}
            {activeView === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="text-center pb-2">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-2 text-amber-500">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h4 className={`font-mono font-bold text-base ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    Tizimga Kirish
                  </h4>
                  <p className={`text-xs font-mono ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Taxallusingiz va parolingizni kiriting
                  </p>
                </div>

                <div>
                  <label className={`block text-xs font-mono font-bold mb-1 flex items-center gap-1 ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}>
                    <User className="w-3.5 h-3.5 text-amber-500" />
                    <span>TAXALLUS YOKI EMAIL</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="masalan: CyberGamer yoki email@gmail.com"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-colors ${
                      isDarkMode
                        ? "bg-slate-900 border-slate-800 text-white placeholder:text-slate-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-mono font-bold mb-1 flex items-center gap-1 ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}>
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                    <span>PAROL</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="Parolingizni kiriting"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className={`w-full px-3.5 py-2.5 pr-10 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-colors ${
                        isDarkMode
                          ? "bg-slate-900 border-slate-800 text-white placeholder:text-slate-500"
                          : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>KIRISH</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveView("gmail")}
                    className="text-xs text-slate-500 hover:text-rose-500 font-mono flex items-center justify-center gap-1.5 mx-auto transition-colors"
                  >
                    <Chrome className="w-3.5 h-3.5 text-rose-500" />
                    <span>Yoki Google bilan 1-bosishda kiring</span>
                  </button>
                </div>
              </form>
            )}

            {/* REGISTER VIEW */}
            {activeView === "register" && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="text-center pb-1">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-1 text-emerald-500">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <h4 className={`font-mono font-bold text-sm ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    Yangi O'yinchi Akaunti
                  </h4>
                  <p className={`text-[11px] font-mono ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Taxallusingiz saqlanadi va boshqa o'yinchilar undan foydalana olishmaydi
                  </p>
                </div>

                <div>
                  <label className={`block text-[11px] font-mono font-bold mb-1 ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}>
                    O'YINCHI TAXALLUSI (NICKNAME) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="masalan: CyberMaster2026"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors ${
                      isDarkMode
                        ? "bg-slate-900 border-slate-800 text-white placeholder:text-slate-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[11px] font-mono font-bold mb-1 ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}>
                    EMAIL MANZILI
                  </label>
                  <input
                    type="email"
                    placeholder="masalan: gamer@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors ${
                      isDarkMode
                        ? "bg-slate-900 border-slate-800 text-white placeholder:text-slate-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[11px] font-mono font-bold mb-1 ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}>
                    MAXFIY PAROL
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? "text" : "password"}
                      placeholder="Ixtiyoriy parol kiriting"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className={`w-full px-3 py-2 pr-10 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors ${
                        isDarkMode
                          ? "bg-slate-900 border-slate-800 text-white placeholder:text-slate-500"
                          : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={`block text-[11px] font-mono font-bold mb-1 ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}>
                    AVATAR EMOJI
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {AVATAR_EMOJIS.slice(0, 8).map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setSelectedEmoji(emoji)}
                        className={`w-8 h-8 rounded-lg border text-base flex items-center justify-center transition-all cursor-pointer ${
                          selectedEmoji === emoji
                            ? "bg-emerald-500 border-emerald-400 text-slate-950 font-bold scale-105"
                            : isDarkMode
                              ? "bg-slate-900 border-slate-800 hover:bg-slate-800 text-white"
                              : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-900"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>AKAUNTNI RO'YXATDAN O'TKAZISH</span>
                </button>
              </form>
            )}

            {/* GMAIL AUTH VIEW */}
            {activeView === "gmail" && (
              <form onSubmit={handleGoogleAuthSubmit} className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/10 to-amber-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-mono space-y-2">
                  <div className={`flex items-center gap-2 font-bold text-sm ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    <Chrome className="w-5 h-5 text-rose-500" />
                    <span>Google Bilan Tezkor Kirish</span>
                  </div>
                  <p className={`text-[11px] ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                    Gmail hisobingiz orqali 1 marta bosishda kiring va o'yin natijalaringiz hamda ochkolaringizni saqlang.
                  </p>
                </div>

                <div>
                  <label className={`block text-xs font-mono font-bold mb-1 ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}>
                    GMAIL MANZILINGIZ (@gmail.com) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="masalan: anvar.gamer@gmail.com"
                    value={gmailInput}
                    onChange={(e) => setGmailInput(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-colors ${
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
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-colors ${
                      isDarkMode
                        ? "bg-slate-900 border-slate-800 text-white placeholder:text-slate-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSimulatingGoogle}
                  className="w-full py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Chrome className="w-4 h-4" />
                  <span>{isSimulatingGoogle ? "Gmail Autentifikatsiya..." : "Google Bilan Kirish"}</span>
                </button>
              </form>
            )}

            {/* PROFILE VIEW */}
            {activeView === "profile" && (
              <div className="space-y-4">
                {/* Level & XP Box */}
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}>
                  <div className="flex items-center justify-between text-xs font-mono font-bold">
                    <span className="flex items-center gap-1.5 text-amber-500">
                      <Crown className="w-4 h-4" /> Level {account.level}
                    </span>
                    <span className={isDarkMode ? "text-slate-400" : "text-slate-600"}>
                      {account.xp} / {account.level * 300} XP
                    </span>
                  </div>

                  <div className={`w-full h-2.5 rounded-full overflow-hidden p-0.5 ${
                    isDarkMode ? "bg-slate-800" : "bg-slate-200"
                  }`}>
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (account.xp / (account.level * 300)) * 100)}%` }}
                    />
                  </div>

                  <div className={`flex items-center justify-between pt-1 text-[11px] font-mono ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}>
                    <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold">
                      {account.badge}
                    </span>
                    <span className="capitalize">Kirish: {account.authMethod}</span>
                  </div>
                </div>

                {/* Avatar Picker */}
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
                        className={`w-8 h-8 rounded-lg border text-base flex items-center justify-center transition-all cursor-pointer ${
                          selectedEmoji === emoji
                            ? "bg-amber-500 border-amber-400 text-slate-950 scale-105 shadow-md font-bold"
                            : isDarkMode
                              ? "bg-slate-900 border-slate-800 text-white hover:bg-slate-800"
                              : "bg-slate-100 border-slate-200 text-slate-900 hover:bg-slate-200"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Admin Panel Launch Button if Admin logged in */}
                {(localStorage.getItem("anvar_admin_logged_in") === "true" || account.username.toLowerCase().includes("admin")) && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono font-bold">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-amber-400" /> Bosh Admin Huquqlari
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                        FAOL
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenAdminPanel) {
                          onOpenAdminPanel();
                          onClose();
                        }
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>ADMIN PANELNI OCHISH</span>
                    </button>
                  </div>
                )}

                {/* Edit Form */}
                <div className="space-y-2.5">
                  <div>
                    <label className={`block text-xs font-mono font-bold mb-1 ${
                      isDarkMode ? "text-slate-300" : "text-slate-700"
                    }`}>
                      TAXALLUS (USERNAME)
                    </label>
                    <input
                      type="text"
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      className={`w-full px-3.5 py-2 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-colors ${
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
                      EMAIL
                    </label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className={`w-full px-3.5 py-2 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-colors ${
                        isDarkMode
                          ? "bg-slate-900 border-slate-800 text-white placeholder:text-slate-500"
                          : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
                      }`}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
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
                    className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 font-mono font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Chiqish
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
