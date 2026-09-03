import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Trophy, 
  Search, 
  RotateCcw, 
  Award, 
  Sparkles,
  Zap,
  Crown,
  Medal,
  ShieldCheck,
  Chrome,
  User,
  Star,
  Users,
  Gamepad2,
  Play,
  Flame,
  Trash2,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight
} from "lucide-react";
import { 
  PlayerAccount, 
  getCurrentPlayerAccount, 
  getRegisteredPlayersList 
} from "../lib/playerAccount";
import { 
  ALL_GAMES_METADATA, 
  getHighScoresMap, 
  ScoreRecord, 
  getUserPersonalBestScore,
  resetAllHighScores 
} from "../lib/highScores";

interface GamesLeaderboardProps {
  onSelectGame?: (gameId: string, fullScreen?: boolean) => void;
  isDarkMode?: boolean;
  onOpenPlayerAccount?: () => void;
  onToggleFullScreen?: () => void;
}

export default function GamesLeaderboard({ 
  onSelectGame, 
  isDarkMode = false,
  onOpenPlayerAccount,
  onToggleFullScreen
}: GamesLeaderboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<"games" | "players">("games");
  const [playerAcc, setPlayerAcc] = useState<PlayerAccount>(getCurrentPlayerAccount);
  const [registeredList, setRegisteredList] = useState<PlayerAccount[]>(getRegisteredPlayersList);
  const [searchQuery, setSearchQuery] = useState("");
  const [gameCategoryFilter, setGameCategoryFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [highScoresMap, setHighScoresMap] = useState<Record<string, ScoreRecord>>({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const refreshData = () => {
    setIsRefreshing(true);
    setPlayerAcc(getCurrentPlayerAccount());
    setRegisteredList(getRegisteredPlayersList());
    setHighScoresMap(getHighScoresMap());
    setTimeout(() => setIsRefreshing(false), 300);
  };

  useEffect(() => {
    refreshData();

    const handleUpdate = () => refreshData();
    window.addEventListener("highscore_updated", handleUpdate);
    window.addEventListener("player_account_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("highscore_updated", handleUpdate);
      window.removeEventListener("player_account_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Compute stats per player
  const sortedPlayers = useMemo(() => {
    return [...registeredList].map(player => {
      const isCurrent = player.id === playerAcc.id || (player.username && player.username.toLowerCase() === playerAcc.username.toLowerCase());
      const effectivePlayer = isCurrent ? { ...player, ...playerAcc } : player;
      
      return {
        ...effectivePlayer,
        score: effectivePlayer.xp || 0,
      };
    }).sort((a, b) => b.score - a.score);
  }, [registeredList, playerAcc]);

  // Filter players
  const filteredPlayers = useMemo(() => {
    return sortedPlayers.filter(p => 
      p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.badge.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sortedPlayers, searchQuery]);

  // Filter games for game records table
  const filteredGames = useMemo(() => {
    return ALL_GAMES_METADATA.filter(g => {
      const matchCat = gameCategoryFilter === "all" || g.category === gameCategoryFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || g.name.toLowerCase().includes(q) || g.badge.toLowerCase().includes(q) || g.unit.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [gameCategoryFilter, searchQuery]);

  // Calculate total games with active records
  const recordedGamesCount = useMemo(() => {
    return Object.values(highScoresMap).filter((r: ScoreRecord) => Boolean(r && r.score > 0)).length;
  }, [highScoresMap]);

  const handleResetScores = () => {
    resetAllHighScores();
    refreshData();
    setShowResetConfirm(false);
  };

  const podium1 = sortedPlayers[0];
  const podium2 = sortedPlayers[1];
  const podium3 = sortedPlayers[2];

  return (
    <div className={`rounded-3xl p-5 sm:p-8 md:p-10 border shadow-2xl transition-all space-y-8 ${
      isDarkMode 
        ? "bg-[#0d101d] border-slate-800 text-white" 
        : "bg-white border-[#e5e5ea] text-neutral-900"
    }`}>
      {/* Title & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-black/10 dark:border-white/10">
        <div className="space-y-1.5 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-mono font-bold text-amber-500">
            <Trophy className="w-4 h-4 text-amber-500 animate-bounce shrink-0" /> 
            <span>HAQIQIY SAQLANADIGAN REKORDLAR & REYTING</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            🏆 O'yinlar va O'yinchilar Reytingi
          </h3>
          <p className={`text-xs font-sans max-w-xl ${isDarkMode ? "text-neutral-400" : "text-neutral-600"}`}>
            Barcha 34 ta o'yindagi shaxsiy va umumiy rekordlar sizning brauzeringizda xavfsiz saqlanadi hamda har bir g'alabadan so'ng avtomatik yangilanadi.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {/* Current Profile Card */}
          <button
            type="button"
            onClick={() => onOpenPlayerAccount?.()}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border text-xs font-mono transition-all cursor-pointer shadow-sm active:scale-95 ${
              isDarkMode 
                ? "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300" 
                : "bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900"
            }`}
            title="Sizning profilingiz"
          >
            <span className="text-xl">{playerAcc.avatarEmoji || "🎮"}</span>
            <div className="flex flex-col text-left">
              <span className="font-black flex items-center gap-1 text-xs">
                {playerAcc.username}
                {playerAcc.authMethod === "google" && <Chrome className="w-3 h-3 text-rose-400" />}
              </span>
              <span className="text-[10px] text-amber-500 font-extrabold">Lvl {playerAcc.level || 1} // {playerAcc.xp || 0} XP</span>
            </div>
          </button>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={refreshData}
            disabled={isRefreshing}
            className={`px-3.5 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              isRefreshing ? "opacity-50 cursor-wait" : ""
            }`}
            title="Ma'lumotlarni yangilash"
          >
            <RotateCcw className={`w-4 h-4 text-amber-400 ${isRefreshing ? "animate-spin" : ""}`} /> 
            <span>Yangilash</span>
          </button>
        </div>
      </div>

      {/* Sub-View Switcher: O'YINLAR REKORDLARI vs TOP O'YINCHILAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center p-1.5 bg-black/40 rounded-2xl border border-amber-500/30 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab("games")}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeSubTab === "games"
                ? "bg-amber-500 text-slate-950 shadow-md font-black"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>🎮 O'yinlar Rekordlari ({ALL_GAMES_METADATA.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("players")}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeSubTab === "players"
                ? "bg-amber-500 text-slate-950 shadow-md font-black"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>👑 Top O'yinchilar ({sortedPlayers.length})</span>
          </button>
        </div>

        {/* Quick info or Reset button */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs font-mono text-neutral-400">
            O'rnatilgan rekordlar: <strong className="text-amber-400">{recordedGamesCount} / {ALL_GAMES_METADATA.length}</strong>
          </span>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-1.5 rounded-xl text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 text-[11px] font-mono transition-all flex items-center gap-1.5 cursor-pointer"
            title="Barcha rekordlarni qayta boshlash"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Tozalash</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: O'YINLAR BO'YICHA HAQIQIY REKORDLAR JADVALI */}
      <AnimatePresence mode="wait">
        {activeSubTab === "games" && (
          <motion.div 
            key="games-records-view"
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Filter Bar & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { id: "all", label: "Barchasi" },
                  { id: "top", label: "🔥 TOP O'yinlar" },
                  { id: "action", label: "⚡ Ekshn & Reaksiya" },
                  { id: "logic", label: "🧠 Mantiq & Aql" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setGameCategoryFilter(cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer border ${
                      gameCategoryFilter === cat.id
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/50 scale-105"
                        : "bg-black/20 text-neutral-400 border-neutral-800 hover:text-white"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div className="relative w-full md:w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
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
            </div>

            {/* GAMES RECORDS TABLE */}
            <div className={`overflow-x-auto rounded-2xl border shadow-lg ${
              isDarkMode ? "border-neutral-800 bg-neutral-950/60" : "border-neutral-200 bg-white"
            }`}>
              <table className="w-full text-left border-collapse font-mono text-xs min-w-[650px]">
                <thead>
                  <tr className={`border-b text-[10px] uppercase font-bold ${
                    isDarkMode ? "border-neutral-800 bg-neutral-900/80 text-neutral-400" : "border-neutral-200 bg-neutral-100 text-neutral-700"
                  }`}>
                    <th className="p-3.5 pl-4 w-12 text-center">#</th>
                    <th className="p-3.5">🎮 O'yin Nomi</th>
                    <th className="p-3.5 text-center">🏆 Rasmiy Rekord</th>
                    <th className="p-3.5">👤 Rekordchi</th>
                    <th className="p-3.5 text-center">⭐ Sizning Natijangiz</th>
                    <th className="p-3.5 text-right pr-4">Harakat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/30">
                  {filteredGames.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-neutral-400 text-xs">
                        Qidiruv bo'yicha hech qanday o'yin topilmadi.
                      </td>
                    </tr>
                  ) : (
                    filteredGames.map((game, idx) => {
                      const rec = highScoresMap[game.id];
                      const recScore = rec?.score ?? 0;
                      const recHolder = rec?.holderName || "—";
                      const recAvatar = rec?.holderAvatar || "🎮";
                      const myPersonal = playerAcc.gameScores?.[game.id] ?? getUserPersonalBestScore(game.id);

                      const hasRecord = recScore > 0;
                      const isMyRecord = hasRecord && (recHolder === playerAcc.username || recHolder === "Gamer #1");

                      return (
                        <motion.tr 
                          key={game.id}
                          initial={{ opacity: 0, y: 8, scale: 0.99 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ 
                            duration: 0.25, 
                            delay: Math.min(idx * 0.02, 0.35),
                            ease: "easeOut"
                          }}
                          className={`transition-colors ${
                            isMyRecord
                              ? isDarkMode ? "bg-amber-500/10" : "bg-amber-50"
                              : isDarkMode ? "hover:bg-neutral-900/50" : "hover:bg-neutral-50"
                          }`}
                        >
                          <td className="p-3.5 pl-4 text-center font-bold text-neutral-500">
                            {idx + 1}
                          </td>

                          <td className="p-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="min-w-0">
                                <div className="font-bold text-xs flex items-center gap-2">
                                  <span className={isDarkMode ? "text-white" : "text-slate-900"}>{game.name}</span>
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-amber-400 font-extrabold border border-amber-500/20">
                                    {game.badge}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="p-3.5 text-center">
                            {hasRecord ? (
                              <motion.span 
                                initial={{ scale: 0.7, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 350, damping: 15 }}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-black border border-amber-500/40 text-xs shadow-sm hover:scale-105 transition-transform"
                              >
                                <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-bounce" />
                                <span>{recScore.toLocaleString()} {game.unit}</span>
                              </motion.span>
                            ) : (
                              <span className="text-neutral-500 text-[11px] italic">
                                Hali o'rnatilmagan 🆕
                              </span>
                            )}
                          </td>

                          <td className="p-3.5">
                            {hasRecord ? (
                              <div className="flex items-center gap-2">
                                <span className="text-base shrink-0">{recAvatar}</span>
                                <span className={`font-bold text-xs truncate max-w-[120px] ${
                                  isMyRecord ? "text-amber-400" : isDarkMode ? "text-slate-200" : "text-slate-800"
                                }`}>
                                  {recHolder} {isMyRecord && <span className="text-[9px] text-amber-500 font-extrabold">(Siz)</span>}
                                </span>
                              </div>
                            ) : (
                              <span className="text-neutral-500 text-xs">—</span>
                            )}
                          </td>

                          <td className="p-3.5 text-center">
                            {myPersonal > 0 ? (
                              <motion.span 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                                className="font-extrabold text-emerald-400 text-xs inline-flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20"
                              >
                                <Star className="w-3 h-3 fill-emerald-400" />
                                <span>{myPersonal.toLocaleString()} {game.unit}</span>
                              </motion.span>
                            ) : (
                              <span className="text-neutral-500 text-xs">O'ynalmagan</span>
                            )}
                          </td>

                          <td className="p-3.5 text-right pr-4">
                            <button
                              type="button"
                              onClick={() => onSelectGame?.(game.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-mono transition-all inline-flex items-center gap-1.5 shadow active:scale-95 cursor-pointer hover:shadow-amber-500/30"
                            >
                              <Play className="w-3 h-3 fill-slate-950" />
                              <span>O'ynash</span>
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIEW 2: TOP O'YINCHILAR (XP & DARAGALAR) */}
      <AnimatePresence mode="wait">
        {activeSubTab === "players" && (
          <motion.div 
            key="players-records-view"
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* TOP 3 PLAYERS PODIUM */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400 animate-bounce" /> TOP O'YINCHILAR ShOHSUPASI
                </h4>
                <span className="text-[10px] font-mono text-neutral-400">O'yinlardan to'plangan umumiy XP va ballar</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-2">
                {/* 1ST PLACE CHAMPION (GOLD) - WITH DYNAMIC SCALE/GROWTH ENTRANCE */}
                {podium1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.72, y: 35 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    whileHover={{ scale: 1.03 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 280, 
                      damping: 18, 
                      delay: 0.15 
                    }}
                    className={`order-1 md:order-2 p-5 sm:p-6 rounded-3xl border-2 relative overflow-hidden shadow-2xl transition-all md:-translate-y-2 cursor-pointer ${
                      isDarkMode 
                        ? "bg-gradient-to-b from-amber-950/90 via-[#1e170a] to-[#0f1118] border-amber-400/90 shadow-amber-500/25 ring-2 ring-amber-500/20" 
                        : "bg-gradient-to-b from-amber-50 via-yellow-100 to-amber-100 border-amber-500 shadow-amber-500/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <motion.span 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 350, damping: 15, delay: 0.3 }}
                        className="px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-mono font-black text-xs rounded-full flex items-center gap-1.5 shadow-lg shadow-amber-500/30"
                      >
                        <Crown className="w-3.5 h-3.5 fill-black animate-pulse" /> 🥇 1-O'RIN CHEMPION
                      </motion.span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/40">
                        Lvl {podium1.level || 1}
                      </span>
                    </div>

                    <div className="space-y-3 my-2 relative z-10">
                      <div className="flex items-center gap-3">
                        <motion.div 
                          initial={{ rotate: -15, scale: 0.5 }}
                          animate={{ rotate: 0, scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.25 }}
                          className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-inner shrink-0 ring-4 ring-amber-500/10"
                        >
                          {podium1.avatarEmoji || "🏆"}
                        </motion.div>
                        <div className="min-w-0 flex-1">
                          <h5 className={`font-mono text-base sm:text-lg font-black truncate flex items-center gap-1.5 ${isDarkMode ? "text-amber-300" : "text-amber-950"}`}>
                            {podium1.username}
                            {podium1.authMethod === "google" && <Chrome className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                          </h5>
                          <p className="text-xs font-mono text-amber-500 font-bold truncate">
                            {podium1.badge || "Chempion"}
                          </p>
                        </div>
                      </div>

                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="p-3 rounded-2xl bg-black/50 border border-amber-500/40 flex items-center justify-between shadow-inner"
                      >
                        <span className="text-[10px] font-mono text-amber-400/90 uppercase font-bold">To'plangan XP:</span>
                        <span className="text-lg font-mono font-black text-amber-400 flex items-center gap-1">
                          <Zap className="w-4 h-4 fill-amber-400 animate-bounce" />
                          <span>{(podium1.score || 0).toLocaleString()} XP</span>
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* 2ND PLACE (SILVER) - WITH ENTRANCE SPRING ANIMATION */}
                {podium2 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 260, 
                      damping: 20, 
                      delay: 0.25 
                    }}
                    className={`order-2 md:order-1 p-5 rounded-3xl border relative overflow-hidden shadow-xl transition-all cursor-pointer ${
                      isDarkMode 
                        ? "bg-gradient-to-b from-slate-900 via-slate-950 to-[#12172a] border-slate-700/60" 
                        : "bg-gradient-to-b from-slate-100 to-slate-200 border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 bg-slate-400/20 text-slate-300 border border-slate-400/40 rounded-full font-mono font-bold text-xs flex items-center gap-1">
                        <Medal className="w-3.5 h-3.5 text-slate-300" /> 🥈 2-O'RIN
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-300 font-extrabold border border-slate-500/30">
                        Lvl {podium2.level || 1}
                      </span>
                    </div>

                    <div className="space-y-3 my-2">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-slate-500/20 border border-slate-400 flex items-center justify-center text-2xl shrink-0">
                          {podium2.avatarEmoji || "✨"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className={`font-mono text-sm sm:text-base font-black truncate flex items-center gap-1.5 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                            {podium2.username}
                            {podium2.authMethod === "google" && <Chrome className="w-3 h-3 text-rose-500 shrink-0" />}
                          </h5>
                          <p className="text-xs font-mono text-slate-400 font-bold truncate">
                            {podium2.badge || "O'yinchi"}
                          </p>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-black/30 border border-slate-700/50 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">To'plangan XP:</span>
                        <span className="text-base font-mono font-black text-slate-200">
                          {(podium2.score || 0).toLocaleString()} XP
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 3RD PLACE (BRONZE) - WITH ENTRANCE SPRING ANIMATION */}
                {podium3 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 260, 
                      damping: 20, 
                      delay: 0.35 
                    }}
                    className={`order-3 md:order-3 p-5 rounded-3xl border relative overflow-hidden shadow-xl transition-all cursor-pointer ${
                      isDarkMode 
                        ? "bg-gradient-to-b from-[#24160e] via-[#1a110a] to-[#12131c] border-amber-900/60" 
                        : "bg-gradient-to-b from-orange-50 to-amber-100 border-amber-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 bg-amber-800/30 text-amber-400 border border-amber-700/40 rounded-full font-mono font-bold text-xs flex items-center gap-1">
                        <Medal className="w-3.5 h-3.5 text-amber-600" /> 🥉 3-O'RIN
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-700/20 text-amber-400 font-extrabold border border-amber-700/30">
                        Lvl {podium3.level || 1}
                      </span>
                    </div>

                    <div className="space-y-3 my-2">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-amber-800/20 border border-amber-600 flex items-center justify-center text-2xl shrink-0">
                          {podium3.avatarEmoji || "🎮"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className={`font-mono text-sm sm:text-base font-black truncate flex items-center gap-1.5 ${isDarkMode ? "text-white" : "text-amber-950"}`}>
                            {podium3.username}
                            {podium3.authMethod === "google" && <Chrome className="w-3 h-3 text-rose-500 shrink-0" />}
                          </h5>
                          <p className="text-xs font-mono text-amber-500 font-bold truncate">
                            {podium3.badge || "O'yinchi"}
                          </p>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-black/30 border border-amber-900/50 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-amber-500/80 uppercase font-bold">To'plangan XP:</span>
                        <span className="text-base font-mono font-black text-amber-400">
                          {(podium3.score || 0).toLocaleString()} XP
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* ALL PLAYERS TABLE */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-500" />
                  <h4 className={`font-mono font-bold text-sm ${isDarkMode ? "text-white" : "text-neutral-900"}`}>
                    Barcha Ro'yxatdan O'tgan O'yinchilar ({filteredPlayers.length})
                  </h4>
                </div>

                <div className="relative w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="O'yinchi qidirish..."
                    className={`w-full pl-8 pr-3 py-1.5 text-xs font-mono border rounded-xl focus:outline-none transition-colors ${
                      isDarkMode 
                        ? "bg-neutral-900 border-neutral-800 text-white focus:border-amber-400" 
                        : "bg-neutral-50 border-neutral-200 text-black focus:border-black"
                    }`}
                  />
                </div>
              </div>

              <div className={`overflow-x-auto rounded-2xl border shadow-lg ${
                isDarkMode ? "border-neutral-800 bg-neutral-950/60" : "border-neutral-200 bg-white"
              }`}>
                <table className="w-full text-left border-collapse font-mono text-xs min-w-[500px]">
                  <thead>
                    <tr className={`border-b text-[10px] uppercase font-bold ${
                      isDarkMode ? "border-neutral-800 bg-neutral-900/80 text-neutral-400" : "border-neutral-200 bg-neutral-100 text-neutral-700"
                    }`}>
                      <th className="p-3.5 pl-4 w-16 text-center"># O'rin</th>
                      <th className="p-3.5">👤 O'yinchi Nik / Profil</th>
                      <th className="p-3.5">🏷️ Unvon (Badge)</th>
                      <th className="p-3.5">⭐ Daraja</th>
                      <th className="p-3.5 text-right pr-4">⚡ Jami XP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/30">
                    {filteredPlayers.map((player, idx) => {
                      const rankNum = idx + 1;
                      const isCurrent = player.id === playerAcc.id || (player.username && player.username.toLowerCase() === playerAcc.username.toLowerCase());

                      return (
                        <motion.tr 
                          key={player.id || idx}
                          initial={{ opacity: 0, x: -15, scale: 0.98 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{ 
                            duration: 0.25, 
                            delay: Math.min(idx * 0.03, 0.4),
                            ease: "easeOut"
                          }}
                          className={`transition-colors ${
                            isCurrent 
                              ? isDarkMode 
                                ? "bg-amber-500/15 font-bold" 
                                : "bg-amber-100 font-bold"
                              : isDarkMode 
                                ? "hover:bg-neutral-900/60" 
                                : "hover:bg-neutral-50"
                          }`}
                        >
                          <td className="p-3.5 pl-4 text-center font-bold">
                            <motion.span 
                              initial={{ scale: 0.6 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 350, damping: 15 }}
                              className={`px-2.5 py-1 rounded-xl text-[11px] inline-block ${
                                rankNum === 1 
                                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 font-black shadow-md scale-105" 
                                  : rankNum === 2 
                                  ? "bg-slate-300/20 text-slate-300 border border-slate-400/30 font-bold" 
                                  : rankNum === 3 
                                  ? "bg-amber-700/20 text-amber-600 border border-amber-700/30 font-bold" 
                                  : "text-neutral-500 font-medium"
                              }`}
                            >
                              {rankNum === 1 ? "🥇 1" : rankNum === 2 ? "🥈 2" : rankNum === 3 ? "🥉 3" : `#${rankNum}`}
                            </motion.span>
                          </td>

                          <td className="p-3.5">
                            <div className="flex items-center gap-2.5">
                              <span className="text-xl shrink-0">{player.avatarEmoji || "🎮"}</span>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 font-bold text-xs">
                                  <span className={`truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                    {player.username}
                                  </span>
                                  {isCurrent && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500 text-black font-black uppercase shrink-0 animate-pulse">
                                      SIZ
                                    </span>
                                  )}
                                  {player.authMethod === "google" && <Chrome className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-500 border border-amber-500/30 font-bold truncate inline-block">
                              {player.badge || "O'yinchi"}
                            </span>
                          </td>

                          <td className="p-3.5 font-bold">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/20 text-amber-400 text-xs">
                              <Star className="w-3 h-3 fill-amber-400" />
                              <span>Lvl {player.level || 1}</span>
                            </span>
                          </td>

                          <td className="p-3.5 text-right pr-4 font-black text-amber-400 text-sm">
                            {(player.score || 0).toLocaleString()} XP
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONFIRM RESET MODAL */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-950 border border-amber-500/50 p-6 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-2xl text-white"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-2xl border border-rose-500/40">
                <Trash2 className="w-6 h-6" />
              </div>
              <h4 className="font-mono font-black text-base">Rekordlarni tozalash</h4>
              <p className="text-xs text-neutral-400 font-sans">
                Haqiqatan ham barcha o'yinlarning saqlangan rekordlarini tozalab, noldan boshlamoqchimisiz?
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-mono text-xs font-bold cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={handleResetScores}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-black cursor-pointer shadow-lg shadow-rose-600/30"
                >
                  Ha, Tozalash
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
