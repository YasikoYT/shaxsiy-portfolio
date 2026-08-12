import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Trophy, 
  Search, 
  RotateCcw, 
  Flame, 
  Award, 
  Gamepad2, 
  ArrowUpRight, 
  Sparkles,
  Zap,
  Crown,
  Medal,
  Play,
  LayoutGrid,
  List,
  Clock,
  User,
  Maximize2,
  ShieldCheck,
  Chrome,
  KeyRound
} from "lucide-react";
import { 
  ALL_GAMES_METADATA, 
  getHighScoresMap, 
  resetAllHighScores, 
  ScoreRecord,
  GameMetadata
} from "../lib/highScores";
import { 
  PlayerAccount, 
  getCurrentPlayerAccount, 
  getRegisteredPlayersList 
} from "../lib/playerAccount";

interface GamesLeaderboardProps {
  onSelectGame: (gameId: string, fullScreen?: boolean) => void;
  isDarkMode?: boolean;
  onOpenPlayerAccount?: () => void;
  onOpenAdminPanel?: () => void;
  onToggleFullScreen?: () => void;
}

export default function GamesLeaderboard({ 
  onSelectGame, 
  isDarkMode = false,
  onOpenPlayerAccount,
  onOpenAdminPanel,
  onToggleFullScreen
}: GamesLeaderboardProps) {
  const [highScoresMap, setHighScoresMap] = useState<Record<string, ScoreRecord>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"score" | "name" | "recent">("score");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const [playerAcc, setPlayerAcc] = useState<PlayerAccount>(getCurrentPlayerAccount);
  const [registeredList, setRegisteredList] = useState<PlayerAccount[]>(getRegisteredPlayersList);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load high scores from localStorage
  const refreshScores = () => {
    setIsRefreshing(true);
    setHighScoresMap(getHighScoresMap());
    setPlayerAcc(getCurrentPlayerAccount());
    setRegisteredList(getRegisteredPlayersList());
    setTimeout(() => setIsRefreshing(false), 300);
  };

  useEffect(() => {
    refreshScores();

    const handleUpdate = () => refreshScores();
    window.addEventListener("highscore_updated", handleUpdate);
    window.addEventListener("player_account_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("highscore_updated", handleUpdate);
      window.removeEventListener("player_account_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Filter and sort games
  const filteredGames = ALL_GAMES_METADATA.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          game.badge.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    const scoreA = highScoresMap[a.id]?.score || 0;
    const scoreB = highScoresMap[b.id]?.score || 0;

    if (sortBy === "score") {
      return scoreB - scoreA;
    } else if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "recent") {
      const dateA = highScoresMap[a.id]?.updatedAt ? new Date(highScoresMap[a.id].updatedAt).getTime() : 0;
      const dateB = highScoresMap[b.id]?.updatedAt ? new Date(highScoresMap[b.id].updatedAt).getTime() : 0;
      return dateB - dateA;
    }
    return 0;
  });

  // Calculate stats
  const totalScore = (Object.values(highScoresMap) as ScoreRecord[]).reduce((acc, item) => acc + (item?.score || 0), 0);
  const playedCount = (Object.values(highScoresMap) as ScoreRecord[]).filter((item) => (item?.score || 0) > 0).length;
  
  // Find top 3 games overall by score
  const sortedByScoreAll = [...ALL_GAMES_METADATA].sort((a, b) => {
    const scoreA = highScoresMap[a.id]?.score || 0;
    const scoreB = highScoresMap[b.id]?.score || 0;
    return scoreB - scoreA;
  });

  const podium1 = sortedByScoreAll[0];
  const podium2 = sortedByScoreAll[1];
  const podium3 = sortedByScoreAll[2];

  let topRecordGame: { game: GameMetadata; score: number } | null = null;
  let maxVal = 0;
  ALL_GAMES_METADATA.forEach((g) => {
    const s = highScoresMap[g.id]?.score || 0;
    if (s > maxVal) {
      maxVal = s;
      topRecordGame = { game: g, score: s };
    }
  });

  const handleReset = () => {
    resetAllHighScores();
    refreshScores();
    setShowResetConfirm(false);
  };

  return (
    <div className={`rounded-3xl p-5 sm:p-8 border shadow-2xl transition-all space-y-8 ${
      isDarkMode 
        ? "bg-[#0d101d] border-slate-800 text-white" 
        : "bg-white border-[#e5e5ea] text-neutral-900"
    }`}>
      {/* Title & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-black/10 dark:border-white/10">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-mono font-bold text-amber-500">
            <Trophy className="w-4 h-4 text-amber-500 animate-bounce" /> TOP REYTING & HIGH SCORES
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            🏆 O'yinchilar Reytingi & Shaxsiy Rekordlar
          </h3>
          <p className={`text-xs font-sans max-w-xl ${isDarkMode ? "text-neutral-400" : "text-neutral-600"}`}>
            O'yinlar reytingi va shaxsiy rekordlar ro'yxati. Istalgan o'yin yonidagi <strong>"O'ynash"</strong> tugmasini bosib yangi rekord o'rnating.
          </p>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Active Player Account Card */}
          <button
            onClick={() => onOpenPlayerAccount?.()}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-mono transition-all cursor-pointer shadow-sm active:scale-95 ${
              isDarkMode 
                ? "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300" 
                : "bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900"
            }`}
            title="Akaunt profilini ko'rish va Gmail bilan kirish"
          >
            <span className="text-base">{playerAcc.avatarEmoji || "🎮"}</span>
            <div className="flex flex-col text-left">
              <span className="font-extrabold flex items-center gap-1">
                {playerAcc.username}
                {playerAcc.authMethod === "google" && <Chrome className="w-3 h-3 text-rose-400" />}
              </span>
              <span className="text-[10px] text-amber-500 font-bold">Lvl {playerAcc.level} // {playerAcc.badge}</span>
            </div>
          </button>

          {/* Admin Panel Button */}
          {onOpenAdminPanel && (
            <button
              onClick={onOpenAdminPanel}
              className="px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
              title="Admin Oynasini Ochish"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Admin Oynasi</span>
            </button>
          )}

          {/* Full Screen Arena Button */}
          {onToggleFullScreen && (
            <button
              onClick={onToggleFullScreen}
              className="px-3.5 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
              title="Butun ekranda o'yinlar va reytingni ochish"
            >
              <Maximize2 className="w-3.5 h-3.5 fill-black" />
              <span>Full Screen</span>
            </button>
          )}

          {/* Refresh Button */}
          <button
            onClick={refreshScores}
            disabled={isRefreshing}
            className={`px-3.5 py-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              isRefreshing ? "opacity-50 cursor-wait" : ""
            }`}
            title="Reyting jadvalini yangilash"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-amber-400 ${isRefreshing ? "animate-spin" : ""}`} /> 
            <span>Reytingni Yangilash</span>
          </button>
        </div>
      </div>

      {/* TOP 3 PODIUM CARDS SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400" /> TOP 3 REKORDCHILAR PODIUMI
          </h4>
          <span className="text-[10px] font-mono text-neutral-400">Eng yuqori natija ko'rsatgan 3 ta o'yin va rekordchilar</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 items-end">
          {/* 1ST PLACE (GOLD) - FIRST ON MOBILE, CENTER & ELEVATED ON DESKTOP */}
          {podium1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.02 }}
              className={`order-1 md:order-2 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 relative overflow-hidden transition-all hover:scale-[1.02] shadow-2xl md:-translate-y-2 ${
                isDarkMode 
                  ? "bg-gradient-to-b from-amber-950/80 via-[#1e170a] to-[#0f1118] border-amber-500/70 shadow-amber-500/20" 
                  : "bg-gradient-to-b from-amber-50 via-yellow-100 to-amber-100 border-amber-400 shadow-amber-500/30"
              }`}
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3 relative z-10">
                <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-mono font-black text-xs rounded-full flex items-center gap-1.5 shadow-md">
                  <Crown className="w-3.5 h-3.5 fill-black" /> 🥇 1-O'RIN CHAMPION
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/40">
                  {podium1.badge}
                </span>
              </div>
              <div className="space-y-2 my-2 relative z-10">
                <h5 className={`font-mono text-base sm:text-xl font-black truncate ${isDarkMode ? "text-amber-300" : "text-amber-950"}`}>
                  {podium1.name}
                </h5>
                <div className="p-2.5 rounded-xl sm:rounded-2xl bg-black/40 border border-amber-500/40 space-y-0.5">
                  <div className="text-[9px] sm:text-[10px] font-mono text-amber-400/80 uppercase font-bold">Champion Rekord Ball:</div>
                  <div className="text-lg sm:text-2xl font-mono font-black text-amber-400 flex items-baseline gap-1.5">
                    <span>{(highScoresMap[podium1.id]?.score || 0).toLocaleString()}</span>
                    <span className="text-xs font-normal text-amber-300/80">{podium1.unit}</span>
                  </div>
                </div>
                <div className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-mono font-bold flex items-center justify-between">
                  <span className="text-[10px] text-amber-400/80">Rekordchi niki:</span>
                  <span className="flex items-center gap-1 truncate font-extrabold text-amber-300">
                    <span>{highScoresMap[podium1.id]?.holderAvatar || "🎮"}</span>
                    <span className="truncate">{highScoresMap[podium1.id]?.holderName || "Jasur Pro"}</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => onSelectGame(podium1.id)}
                className="w-full mt-2 py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-mono font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-lg shadow-amber-500/30"
              >
                <Play className="w-3.5 h-3.5 fill-black" /> O'YINNI O'YNASH
              </button>
            </motion.div>
          )}

          {/* 2ND PLACE (SILVER) */}
          {podium2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className={`order-2 md:order-1 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border relative overflow-hidden transition-all hover:scale-[1.02] shadow-xl ${
                isDarkMode 
                  ? "bg-gradient-to-b from-slate-900 via-slate-950 to-[#12172a] border-slate-700/60" 
                  : "bg-gradient-to-b from-slate-100 to-slate-200 border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="px-2.5 py-1 bg-slate-400/20 text-slate-300 border border-slate-400/40 rounded-full font-mono font-bold text-xs flex items-center gap-1">
                  <Medal className="w-3.5 h-3.5 text-slate-300" /> 🥈 2-O'RIN
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-300 font-extrabold border border-slate-500/30">
                  {podium2.badge}
                </span>
              </div>
              <div className="space-y-2 my-2">
                <h5 className={`font-mono text-base sm:text-lg font-black truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  {podium2.name}
                </h5>
                <div className="p-2 rounded-xl sm:rounded-2xl bg-black/30 border border-slate-700/50 space-y-0.5">
                  <div className="text-[9px] sm:text-[10px] font-mono text-slate-400 uppercase font-bold">Rekord Ball:</div>
                  <div className="text-base sm:text-xl font-mono font-black text-slate-200 flex items-center gap-1.5">
                    <span>{(highScoresMap[podium2.id]?.score || 0).toLocaleString()}</span>
                    <span className="text-xs font-normal text-slate-400">{podium2.unit}</span>
                  </div>
                </div>
                <div className="px-2 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Rekordchi:</span>
                  <span className="flex items-center gap-1 truncate font-extrabold">
                    <span>{highScoresMap[podium2.id]?.holderAvatar || "🎮"}</span>
                    <span className="truncate">{highScoresMap[podium2.id]?.holderName || "Jasur Pro"}</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => onSelectGame(podium2.id)}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-mono font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> O'ynash
              </button>
            </motion.div>
          )}

          {/* 3RD PLACE (BRONZE) */}
          {podium3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className={`order-3 md:order-3 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border relative overflow-hidden transition-all hover:scale-[1.02] shadow-xl ${
                isDarkMode 
                  ? "bg-gradient-to-b from-[#24160e] via-[#1a110a] to-[#12131c] border-amber-900/60" 
                  : "bg-gradient-to-b from-orange-50 to-amber-100 border-amber-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="px-2.5 py-1 bg-amber-800/30 text-amber-400 border border-amber-700/40 rounded-full font-mono font-bold text-xs flex items-center gap-1">
                  <Medal className="w-3.5 h-3.5 text-amber-600" /> 🥉 3-O'RIN
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-700/20 text-amber-400 font-extrabold border border-amber-700/30">
                  {podium3.badge}
                </span>
              </div>
              <div className="space-y-2 my-2">
                <h5 className={`font-mono text-base sm:text-lg font-black truncate ${isDarkMode ? "text-white" : "text-amber-950"}`}>
                  {podium3.name}
                </h5>
                <div className="p-2 rounded-xl sm:rounded-2xl bg-black/30 border border-amber-900/50 space-y-0.5">
                  <div className="text-[9px] sm:text-[10px] font-mono text-amber-600/80 uppercase font-bold">Rekord Ball:</div>
                  <div className="text-base sm:text-xl font-mono font-black text-amber-400 flex items-center gap-1.5">
                    <span>{(highScoresMap[podium3.id]?.score || 0).toLocaleString()}</span>
                    <span className="text-xs font-normal text-amber-600/80">{podium3.unit}</span>
                  </div>
                </div>
                <div className="px-2 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold flex items-center justify-between">
                  <span className="text-[10px] text-amber-500/70">Rekordchi:</span>
                  <span className="flex items-center gap-1 truncate font-extrabold">
                    <span>{highScoresMap[podium3.id]?.holderAvatar || "🎮"}</span>
                    <span className="truncate">{highScoresMap[podium3.id]?.holderName || "Jasur Pro"}</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => onSelectGame(podium3.id)}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 font-mono font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> O'ynash
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* KEY STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Points Earned */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
            isDarkMode ? "bg-neutral-900/90 border-neutral-800" : "bg-neutral-50 border-neutral-200"
          }`}
        >
          <div className="p-3 bg-amber-500/20 text-amber-500 rounded-xl border border-amber-500/30 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-neutral-400 uppercase font-bold">JAMI REKORD OCHKO</div>
            <div className="text-xl font-mono font-black text-amber-500">
              {totalScore.toLocaleString()} <span className="text-xs font-normal">ochko</span>
            </div>
          </div>
        </motion.div>

        {/* Highest Single Record */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.28 }}
          className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
            isDarkMode ? "bg-neutral-900/90 border-neutral-800" : "bg-neutral-50 border-neutral-200"
          }`}
        >
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-neutral-400 uppercase font-bold">ENG YUQORI O'YIN REKORDI</div>
            <div className="text-sm font-mono font-black text-emerald-400 truncate max-w-[180px]">
              {topRecordGame ? `${topRecordGame.game.name}: ${topRecordGame.score}` : "Hali rekord yo'q"}
            </div>
          </div>
        </motion.div>

        {/* Total Games Played */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.36 }}
          className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
            isDarkMode ? "bg-neutral-900/90 border-neutral-800" : "bg-neutral-50 border-neutral-200"
          }`}
        >
          <div className="p-3 bg-sky-500/20 text-sky-400 rounded-xl border border-sky-500/30 shrink-0">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-neutral-400 uppercase font-bold">FAOL O'YINALGAN</div>
            <div className="text-xl font-mono font-black text-sky-400">
              {playedCount} / {ALL_GAMES_METADATA.length} <span className="text-xs font-normal">ta o'yin</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CONTROLS: SEARCH, CATEGORY FILTERS, SORT */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
        {/* Category Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: "all", name: "Barchasi 🎮" },
            { id: "top", name: "🔥 Top" },
            { id: "action", name: "⚡ Ekshen" },
            { id: "logic", name: "🧠 Mantiq" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                selectedCategory === cat.id
                  ? "bg-amber-500 text-black border-amber-400 shadow-md scale-105"
                  : isDarkMode
                  ? "bg-neutral-900 text-neutral-300 border-neutral-800 hover:bg-neutral-800"
                  : "bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search, Sort & View Mode Switcher */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Search bar */}
          <div className="relative flex-grow sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="O'yin nomini qidirish..."
              className={`w-full pl-8 pr-3 py-2 text-xs font-mono border rounded-xl focus:outline-none transition-colors ${
                isDarkMode 
                  ? "bg-neutral-900 border-neutral-800 text-white focus:border-amber-400" 
                  : "bg-neutral-50 border-neutral-200 text-black focus:border-black"
              }`}
            />
          </div>

          {/* Sort selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "score" | "name" | "recent")}
            className={`px-3 py-2 text-xs font-mono border rounded-xl focus:outline-none cursor-pointer ${
              isDarkMode 
                ? "bg-neutral-900 border-neutral-800 text-white" 
                : "bg-neutral-50 border-neutral-200 text-black"
            }`}
          >
            <option value="score">🏆 Rekord bo'yicha</option>
            <option value="name">🔤 Nomi bo'yicha</option>
            <option value="recent">🕒 Oxirgi o'ynalgan</option>
          </select>

          {/* Grid / Table View Mode Toggle */}
          <div className={`flex items-center p-1 rounded-xl border text-xs font-mono shrink-0 ${
            isDarkMode ? "bg-neutral-900 border-neutral-800" : "bg-neutral-100 border-neutral-200"
          }`}>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-all ${
                viewMode === "grid"
                  ? "bg-amber-500 text-black shadow-md font-black"
                  : "text-neutral-400 hover:text-white"
              }`}
              title="Karta ko'rinishi (Grid Cards)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Karta</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-all ${
                viewMode === "table"
                  ? "bg-amber-500 text-black shadow-md font-black"
                  : "text-neutral-400 hover:text-white"
              }`}
              title="Jadval ko'rinishi (Table)"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Jadval</span>
            </button>
          </div>
        </div>
      </div>

      {/* GRID CARDS VIEW OR TABLE VIEW */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
          {filteredGames.length === 0 ? (
            <div className="col-span-full p-12 text-center text-neutral-400 font-mono text-xs">
              Aks ettiriladigan o'yinlar topilmadi.
            </div>
          ) : (
            filteredGames.map((game, index) => {
              const rec = highScoresMap[game.id];
              const score = rec?.score || 0;
              const formattedDate = rec?.updatedAt 
                ? new Date(rec.updatedAt).toLocaleDateString("uz-UZ", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                : "Hali o'ynalmagan";

              const rankNum = index + 1;

              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 25, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.5) }}
                  whileHover={{ y: -6, scale: 1.03 }}
                  className={`rounded-xl sm:rounded-2xl border p-3 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-lg relative overflow-hidden group cursor-pointer ${
                    isDarkMode 
                      ? "bg-gradient-to-b from-[#131728] to-[#0c0f1c] border-neutral-800/80 hover:border-amber-400/80 hover:ring-2 hover:ring-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/20" 
                      : "bg-gradient-to-b from-white to-neutral-50 border-neutral-200 hover:border-amber-400 hover:ring-2 hover:ring-amber-400/40 hover:shadow-2xl hover:shadow-amber-500/15"
                  }`}
                >
                  {/* Subtle corner glow */}
                  <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-400/25 group-hover:scale-125 transition-all duration-500" />

                  {/* Header: Rank Badge & Game Badge */}
                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-black flex items-center gap-1.5 shadow-sm ${
                      rankNum === 1 
                        ? "bg-amber-500 text-black border border-amber-400" 
                        : rankNum === 2 
                        ? "bg-slate-300 text-black border border-slate-200" 
                        : rankNum === 3 
                        ? "bg-amber-800 text-amber-100 border border-amber-700" 
                        : isDarkMode
                        ? "bg-neutral-800/80 text-neutral-300 border border-neutral-700/60"
                        : "bg-neutral-100 text-neutral-700 border border-neutral-200"
                    }`}>
                      {rankNum === 1 ? "🥇 1-o'rin" : rankNum === 2 ? "🥈 2-o'rin" : rankNum === 3 ? "🥉 3-o'rin" : `#${rankNum} O'rin`}
                    </span>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-extrabold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                      {game.badge}
                    </span>
                  </div>

                  {/* Title & Category */}
                  <div className="space-y-2 mb-4 relative z-10">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className={`font-serif text-lg font-bold truncate group-hover:text-amber-500 transition-colors ${
                        isDarkMode ? "text-white" : "text-neutral-900"
                      }`}>
                        {game.name}
                      </h5>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-neutral-800/50 text-neutral-400 shrink-0">
                        {game.category === "top" ? "🔥 Top" : game.category === "action" ? "⚡ Ekshen" : "🧠 Mantiq"}
                      </span>
                    </div>

                    {/* High Score Display */}
                    <div className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
                      score > 0
                        ? isDarkMode
                          ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-400"
                          : "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : isDarkMode
                          ? "bg-neutral-900/60 border-neutral-800/80 text-neutral-500"
                          : "bg-neutral-100/60 border-neutral-200 text-neutral-500"
                    }`}>
                      <div className="flex items-center gap-2">
                        <Trophy className={`w-4 h-4 shrink-0 ${score > 0 ? "text-amber-400" : "text-neutral-500"}`} />
                        <div>
                          <div className="text-[9px] font-mono uppercase font-bold text-neutral-400">Rekord Ball</div>
                          <div className="text-sm font-mono font-black">
                            {score > 0 ? `${score.toLocaleString()} ${game.unit}` : `0 ${game.unit}`}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[9px] font-mono text-neutral-400">Rekordchi</div>
                        <div className="text-xs font-mono font-bold text-amber-500 flex items-center gap-1">
                          <span>{rec?.holderAvatar || "🎮"}</span>
                          <span className="truncate max-w-[90px]">{rec?.holderName || "Jasur Pro"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                    {/* Card Footer: Timestamp & Play Buttons */}
                    <div className="pt-3 border-t border-neutral-800/50 flex items-center justify-between gap-2 relative z-10">
                      <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-400 truncate">
                        <Clock className="w-3 h-3 shrink-0 text-neutral-500" />
                        <span className="truncate">{formattedDate}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectGame(game.id, true);
                          }}
                          className={`p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer shadow-sm active:scale-95 ${
                            isDarkMode 
                              ? "bg-neutral-800/80 hover:bg-amber-500/20 text-neutral-300 hover:text-amber-400 border-neutral-700/60" 
                              : "bg-neutral-100 hover:bg-amber-500/10 text-neutral-600 hover:text-amber-700 border-neutral-200"
                          }`}
                          title="Butun ekranda o'ynash"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onSelectGame(game.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
                        >
                          <span>O'ynash</span>
                          <Play className="w-3.5 h-3.5 fill-black" />
                        </button>
                      </div>
                    </div>
                </motion.div>
              );
            })
          )}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className={`overflow-x-auto rounded-2xl border ${
          isDarkMode ? "border-neutral-800 bg-neutral-950/60" : "border-neutral-200 bg-white"
        }`}>
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className={`border-b text-[10px] uppercase font-bold ${
                isDarkMode ? "border-neutral-800 bg-neutral-900/80 text-neutral-400" : "border-neutral-200 bg-neutral-100 text-neutral-700"
              }`}>
                <th className="p-3.5 pl-4 w-16 text-center"># O'rin</th>
                <th className="p-3.5">🎮 O'yin Nomi</th>
                <th className="p-3.5">👤 Rekordchi</th>
                <th className="p-3.5">🏷️ Kategoriya</th>
                <th className="p-3.5">🏆 Eng Yuqori Ball</th>
                <th className="p-3.5">🕒 Oxirgi Yangilanish</th>
                <th className="p-3.5 text-right pr-4">⚡ O'ynash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/30">
              {filteredGames.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-400 text-xs">
                    Aks ettiriladigan o'yinlar topilmadi.
                  </td>
                </tr>
              ) : (
                filteredGames.map((game, index) => {
                  const rec = highScoresMap[game.id];
                  const score = rec?.score || 0;
                  const formattedDate = rec?.updatedAt 
                    ? new Date(rec.updatedAt).toLocaleDateString("uz-UZ", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                    : "Hali o'ynalmagan";

                  const rankNum = index + 1;
                  const rankBadge = rankNum === 1 ? "🥇 1-o'rin" : rankNum === 2 ? "🥈 2-o'rin" : rankNum === 3 ? "🥉 3-o'rin" : `#${rankNum}`;

                  return (
                    <motion.tr 
                      key={game.id} 
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: Math.min(index * 0.035, 0.6) }}
                      className={`transition-colors group hover:${
                        isDarkMode ? "bg-amber-500/10" : "bg-amber-500/10"
                      }`}
                    >
                      <td className="p-3.5 pl-4 text-center font-bold font-mono">
                        <span className={`px-2.5 py-1 rounded-xl text-[11px] ${
                          rankNum === 1 
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 font-black shadow" 
                            : rankNum === 2 
                            ? "bg-slate-300/20 text-slate-300 border border-slate-400/30 font-bold" 
                            : rankNum === 3 
                            ? "bg-amber-700/20 text-amber-600 border border-amber-700/30 font-bold" 
                            : "text-neutral-500 font-medium"
                        }`}>
                          {rankBadge}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-sm font-sans group-hover:text-amber-500 transition-colors ${
                            isDarkMode ? "text-white" : "text-neutral-900"
                          }`}>
                            {game.name}
                          </span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full font-extrabold bg-amber-500/20 text-amber-500 border border-amber-500/30">
                            {game.badge}
                          </span>
                        </div>
                      </td>

                      <td className="p-3.5 font-bold text-amber-500">
                        <span className="flex items-center gap-1 text-xs">
                          <span>{rec?.holderAvatar || "🎮"}</span>
                          <span>{rec?.holderName || (score > 0 ? playerAcc.username : "Jasur Pro")}</span>
                        </span>
                      </td>

                      <td className="p-3.5 text-neutral-400">
                        <span className="capitalize">
                          {game.category === "top" ? "🔥 Top" : game.category === "action" ? "⚡ Ekshen" : "🧠 Mantiq"}
                        </span>
                      </td>

                      <td className="p-3.5">
                        {score > 0 ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl font-bold font-mono">
                            <Trophy className="w-3.5 h-3.5 text-amber-400" />
                            <span>{score.toLocaleString()} {game.unit}</span>
                          </div>
                        ) : (
                          <span className="text-neutral-400 font-normal">
                            0 {game.unit}
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-neutral-400 text-[11px]">
                        {formattedDate}
                      </td>

                      <td className="p-3.5 text-right pr-4">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => onSelectGame(game.id, true)}
                            className={`p-1.5 rounded-xl border transition-all cursor-pointer shadow-sm active:scale-95 ${
                              isDarkMode 
                                ? "bg-neutral-800/80 hover:bg-amber-500/20 text-neutral-300 hover:text-amber-400 border-neutral-700/60" 
                                : "bg-neutral-100 hover:bg-amber-500/10 text-neutral-600 hover:text-amber-700 border-neutral-200"
                            }`}
                            title="Butun ekranda o'ynash"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onSelectGame(game.id)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 text-black hover:bg-amber-400 font-bold rounded-xl text-xs transition-all cursor-pointer shadow active:scale-95"
                          >
                            <span>O'ynash</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-neutral-400">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Har bir o'yin yakunlangach eng yuqori balingiz va nikinizingiz ushbu reyting jadvaliga saqlanadi.
        </span>
      </div>
    </div>
  );
}
