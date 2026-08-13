import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
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
  CheckCircle2,
  Maximize2
} from "lucide-react";
import { 
  PlayerAccount, 
  getCurrentPlayerAccount, 
  getRegisteredPlayersList 
} from "../lib/playerAccount";
import { getHighScoresMap, ScoreRecord } from "../lib/highScores";

interface GamesLeaderboardProps {
  onSelectGame?: (gameId: string, fullScreen?: boolean) => void;
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
  const [playerAcc, setPlayerAcc] = useState<PlayerAccount>(getCurrentPlayerAccount);
  const [registeredList, setRegisteredList] = useState<PlayerAccount[]>(getRegisteredPlayersList);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [highScoresMap, setHighScoresMap] = useState<Record<string, ScoreRecord>>({});

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
  const sortedPlayers = [...registeredList].map(player => {
    // Check if player matches current user
    const isCurrent = player.id === playerAcc.id || player.username.toLowerCase() === playerAcc.username.toLowerCase();
    const effectivePlayer = isCurrent ? { ...player, ...playerAcc } : player;
    
    return {
      ...effectivePlayer,
      score: effectivePlayer.xp || 100,
    };
  }).sort((a, b) => b.score - a.score);

  // Filter players by search query
  const filteredPlayers = sortedPlayers.filter(p => 
    p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.badge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const podium1 = sortedPlayers[0];
  const podium2 = sortedPlayers[1];
  const podium3 = sortedPlayers[2];

  return (
    <div className={`rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 md:p-8 border shadow-2xl transition-all space-y-6 sm:space-y-8 ${
      isDarkMode 
        ? "bg-[#0d101d] border-slate-800 text-white" 
        : "bg-white border-[#e5e5ea] text-neutral-900"
    }`}>
      {/* Title & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-black/10 dark:border-white/10">
        <div className="space-y-1.5 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-mono font-bold text-amber-500">
            <Trophy className="w-4 h-4 text-amber-500 animate-bounce shrink-0" /> 
            <span>TOP O'YINCHILAR REYTINGI</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            🏆 Yetakchi O'yinchilar Jadvali
          </h3>
          <p className={`text-xs font-sans max-w-xl ${isDarkMode ? "text-neutral-400" : "text-neutral-600"}`}>
            Barcha ro'yxatdan o'tgan va faol o'yinchilarning to'plagan umumiy ballari (XP), darajalari hamda unvonlari.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Current Profile Card */}
          <button
            type="button"
            onClick={() => onOpenPlayerAccount?.()}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl sm:rounded-2xl border text-xs font-mono transition-all cursor-pointer shadow-sm active:scale-95 ${
              isDarkMode 
                ? "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300" 
                : "bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900"
            }`}
            title="Sizning profilingiz"
          >
            <span className="text-base">{playerAcc.avatarEmoji || "🎮"}</span>
            <div className="flex flex-col text-left">
              <span className="font-extrabold flex items-center gap-1 text-xs">
                {playerAcc.username}
                {playerAcc.authMethod === "google" && <Chrome className="w-3 h-3 text-rose-400" />}
              </span>
              <span className="text-[10px] text-amber-500 font-bold">Lvl {playerAcc.level || 1} // {playerAcc.badge || "O'yinchi"}</span>
            </div>
          </button>

          {/* Admin Button */}
          {onOpenAdminPanel && (
            <button
              type="button"
              onClick={onOpenAdminPanel}
              className="px-3 py-2 rounded-xl sm:rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {/* Refresh Button */}
          <button
            type="button"
            onClick={refreshData}
            disabled={isRefreshing}
            className={`px-3 py-2 rounded-xl sm:rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              isRefreshing ? "opacity-50 cursor-wait" : ""
            }`}
          >
            <RotateCcw className={`w-3.5 h-3.5 text-amber-400 ${isRefreshing ? "animate-spin" : ""}`} /> 
            <span>Yangilash</span>
          </button>
        </div>
      </div>

      {/* TOP 3 PLAYERS PODIUM */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400" /> TOP 3 YETAKCHI O'YINCHILAR
          </h4>
          <span className="text-[10px] font-mono text-neutral-400">Eng ko'p XP va ball to'plagan chempionlar</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 items-end">
          {/* 1ST PLACE CHAMPION (GOLD) */}
          {podium1 && (
            <div
              className={`order-1 md:order-2 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 relative overflow-hidden shadow-2xl transition-all md:-translate-y-2 ${
                isDarkMode 
                  ? "bg-gradient-to-b from-amber-950/80 via-[#1e170a] to-[#0f1118] border-amber-500/70 shadow-amber-500/20" 
                  : "bg-gradient-to-b from-amber-50 via-yellow-100 to-amber-100 border-amber-400 shadow-amber-500/30"
              }`}
            >
              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-mono font-black text-xs rounded-full flex items-center gap-1.5 shadow-md">
                  <Crown className="w-3.5 h-3.5 fill-black" /> 🥇 1-O'RIN CHEMPION
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/40">
                  Lvl {podium1.level || 1}
                </span>
              </div>

              <div className="space-y-2 my-2 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-2xl shadow-inner shrink-0">
                    {podium1.avatarEmoji || "🏆"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className={`font-mono text-base sm:text-lg font-black truncate flex items-center gap-1.5 ${isDarkMode ? "text-amber-300" : "text-amber-950"}`}>
                      {podium1.username}
                      {podium1.authMethod === "google" && <Chrome className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                    </h5>
                    <p className="text-[11px] font-mono text-amber-500 font-bold truncate">
                      {podium1.badge || "Chempion"}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/40 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-amber-400/80 uppercase font-bold">Jami Ochko / XP:</span>
                  <span className="text-lg font-mono font-black text-amber-400 flex items-center gap-1">
                    <Zap className="w-4 h-4 fill-amber-400" />
                    <span>{(podium1.score || 0).toLocaleString()} XP</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 2ND PLACE (SILVER) */}
          {podium2 && (
            <div
              className={`order-2 md:order-1 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border relative overflow-hidden shadow-xl transition-all ${
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

              <div className="space-y-2 my-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-500/20 border border-slate-400 flex items-center justify-center text-xl shrink-0">
                    {podium2.avatarEmoji || "✨"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className={`font-mono text-sm sm:text-base font-black truncate flex items-center gap-1.5 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                      {podium2.username}
                      {podium2.authMethod === "google" && <Chrome className="w-3 h-3 text-rose-500 shrink-0" />}
                    </h5>
                    <p className="text-[11px] font-mono text-slate-400 font-bold truncate">
                      {podium2.badge || "O'yinchi"}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-black/30 border border-slate-700/50 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Jami Ochko:</span>
                  <span className="text-base font-mono font-black text-slate-200">
                    {(podium2.score || 0).toLocaleString()} XP
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 3RD PLACE (BRONZE) */}
          {podium3 && (
            <div
              className={`order-3 md:order-3 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border relative overflow-hidden shadow-xl transition-all ${
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

              <div className="space-y-2 my-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-800/20 border border-amber-600 flex items-center justify-center text-xl shrink-0">
                    {podium3.avatarEmoji || "🎮"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className={`font-mono text-sm sm:text-base font-black truncate flex items-center gap-1.5 ${isDarkMode ? "text-white" : "text-amber-950"}`}>
                      {podium3.username}
                      {podium3.authMethod === "google" && <Chrome className="w-3 h-3 text-rose-500 shrink-0" />}
                    </h5>
                    <p className="text-[11px] font-mono text-amber-500 font-bold truncate">
                      {podium3.badge || "O'yinchi"}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-black/30 border border-amber-900/50 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-amber-500/80 uppercase font-bold">Jami Ochko:</span>
                  <span className="text-base font-mono font-black text-amber-400">
                    {(podium3.score || 0).toLocaleString()} XP
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SEARCH BAR & ALL PLAYERS LIST */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            <h4 className={`font-mono font-bold text-sm sm:text-base ${isDarkMode ? "text-white" : "text-neutral-900"}`}>
              Barcha O'yinchilar Ro'yxati ({filteredPlayers.length})
            </h4>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="O'yinchi nikini qidirish..."
              className={`w-full pl-8 pr-3 py-2 text-xs font-mono border rounded-xl focus:outline-none transition-colors ${
                isDarkMode 
                  ? "bg-neutral-900 border-neutral-800 text-white focus:border-amber-400" 
                  : "bg-neutral-50 border-neutral-200 text-black focus:border-black"
              }`}
            />
          </div>
        </div>

        {/* PLAYERS LEADERBOARD TABLE */}
        <div className={`overflow-x-auto rounded-2xl border ${
          isDarkMode ? "border-neutral-800 bg-neutral-950/60" : "border-neutral-200 bg-white"
        }`}>
          <table className="w-full text-left border-collapse font-mono text-xs min-w-[500px]">
            <thead>
              <tr className={`border-b text-[10px] uppercase font-bold ${
                isDarkMode ? "border-neutral-800 bg-neutral-900/80 text-neutral-400" : "border-neutral-200 bg-neutral-100 text-neutral-700"
              }`}>
                <th className="p-3 pl-4 w-16 text-center"># O'rin</th>
                <th className="p-3">👤 O'yinchi Nik / Profil</th>
                <th className="p-3">🏷️ Unvoni (Badge)</th>
                <th className="p-3">⭐ Daraja (Level)</th>
                <th className="p-3 text-right pr-4">⚡ Jami XP / Ochko</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/30">
              {filteredPlayers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-400 text-xs">
                    Hech qanday o'yinchi topilmadi.
                  </td>
                </tr>
              ) : (
                filteredPlayers.map((player, idx) => {
                  const rankNum = idx + 1;
                  const isCurrent = player.id === playerAcc.id || player.username.toLowerCase() === playerAcc.username.toLowerCase();

                  return (
                    <tr 
                      key={player.id || idx}
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
                      <td className="p-3 pl-4 text-center font-bold">
                        <span className={`px-2.5 py-1 rounded-xl text-[11px] inline-block ${
                          rankNum === 1 
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 font-black shadow" 
                            : rankNum === 2 
                            ? "bg-slate-300/20 text-slate-300 border border-slate-400/30 font-bold" 
                            : rankNum === 3 
                            ? "bg-amber-700/20 text-amber-600 border border-amber-700/30 font-bold" 
                            : "text-neutral-500 font-medium"
                        }`}>
                          {rankNum === 1 ? "🥇 1" : rankNum === 2 ? "🥈 2" : rankNum === 3 ? "🥉 3" : `#${rankNum}`}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl shrink-0">{player.avatarEmoji || "🎮"}</span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 font-bold text-xs">
                              <span className={`truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                {player.username}
                              </span>
                              {isCurrent && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500 text-black font-black uppercase shrink-0">
                                  SIZEN
                                </span>
                              )}
                              {player.authMethod === "google" && <Chrome className="w-3 h-3 text-rose-500 shrink-0" />}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-500 border border-amber-500/30 font-bold truncate inline-block max-w-[160px]">
                          {player.badge || "O'yinchi"}
                        </span>
                      </td>

                      <td className="p-3 font-bold text-slate-300">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/20 text-amber-400 text-xs">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>Lvl {player.level || 1}</span>
                        </span>
                      </td>

                      <td className="p-3 text-right pr-4 font-black text-amber-400 text-sm">
                        {(player.score || 0).toLocaleString()} XP
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-neutral-400">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          O'yinlarni o'ynab XP to'plang va Top O'yinchilar Reytingida 1-o'ringa ko'tariling!
        </span>
      </div>
    </div>
  );
}
