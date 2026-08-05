import React, { useState, useEffect } from "react";
import { 
  Trophy, 
  Search, 
  RotateCcw, 
  Flame, 
  Award, 
  Gamepad2, 
  ArrowUpRight, 
  CheckCircle2,
  Sparkles,
  Zap,
  BarChart2
} from "lucide-react";
import { 
  ALL_GAMES_METADATA, 
  getHighScoresMap, 
  resetAllHighScores, 
  ScoreRecord,
  GameMetadata
} from "../lib/highScores";

interface GamesLeaderboardProps {
  onSelectGame: (gameId: string) => void;
  isDarkMode?: boolean;
}

export default function GamesLeaderboard({ onSelectGame, isDarkMode = true }: GamesLeaderboardProps) {
  const [highScoresMap, setHighScoresMap] = useState<Record<string, ScoreRecord>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"score" | "name" | "recent">("score");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const [playerName, setPlayerName] = useState(() => {
    try {
      return localStorage.getItem("anvar_player_name") || "Gamer #1";
    } catch {
      return "Gamer #1";
    }
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(playerName);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load high scores from localStorage
  const refreshScores = () => {
    setIsRefreshing(true);
    setHighScoresMap(getHighScoresMap());
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const handleSaveName = () => {
    const trimmed = tempName.trim() || "Gamer #1";
    setPlayerName(trimmed);
    try {
      localStorage.setItem("anvar_player_name", trimmed);
    } catch (e) {}
    setIsEditingName(false);
  };

  useEffect(() => {
    refreshScores();

    const handleUpdate = () => refreshScores();
    window.addEventListener("highscore_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("highscore_updated", handleUpdate);
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
    setShowResetConfirm(false);
  };

  return (
    <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl transition-all space-y-6 ${
      isDarkMode 
        ? "bg-[#121624] border-slate-800 text-white" 
        : "bg-white border-[#e5e5ea] text-black"
    }`}>
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/10 dark:border-white/10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-mono font-bold text-amber-500">
            <Trophy className="w-3.5 h-3.5 text-amber-500 animate-bounce" /> ENG YUQORI BALLAR REYTINGI (HIGH SCORES)
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            O'yinchilar Reytingi & Shaxsiy Rekordlar
          </h3>
          <p className="text-xs text-neutral-400 font-sans">
            Barcha natijalar 100% brauzeringiz xotirasida (localStorage) saqlanadi va sahifani yangilaganda ham saqlanib qoladi.
          </p>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Player Nickname Card */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono">
            <span className="text-neutral-400">O'yinchi:</span>
            {isEditingName ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="px-2 py-0.5 bg-black border border-amber-400 rounded text-amber-400 font-bold text-xs focus:outline-none w-28"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="px-2 py-0.5 bg-amber-500 text-black font-bold rounded text-[10px] hover:bg-amber-400 cursor-pointer"
                >
                  OK
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setTempName(playerName);
                  setIsEditingName(true);
                }}
                className="font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                title="Taxallusni o'zgartirish"
              >
                <span>{playerName}</span>
                <span className="text-[10px] text-neutral-500">✏️</span>
              </button>
            )}
          </div>

          {/* Demo Confetti Button */}
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent("new_record_achieved", {
                detail: {
                  gameId: "snake",
                  gameName: "Cyber Snake (Sinov)",
                  score: 950,
                  unit: "ochko"
                }
              }));
            }}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Rekord animatsiyasi va konfetti sinab ko'rish"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>🎉 Rekord Animatsiyasi</span>
          </button>

          {/* Manual Refresh Button */}
          <button
            onClick={refreshScores}
            disabled={isRefreshing}
            className={`px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              isRefreshing ? "opacity-50 cursor-wait" : ""
            }`}
            title="Reyting jadvalini qayta yangilash"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-amber-400 ${isRefreshing ? "animate-spin" : ""}`} /> 
            <span>Yangilash</span>
          </button>

          {/* Reset button */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Natijalarni nolga tushirish"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Tozalash
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Resetting Scores */}
      {showResetConfirm && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="text-red-400 font-bold flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-red-400 animate-spin" />
            Haqiqatdan ham barcha o'yin natijalarini va rekordlarni o'chirib tashlamoqchimisiz?
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg cursor-pointer transition-colors"
            >
              Ha, Tozalansin
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-3 py-1.5 bg-neutral-800 text-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-700 transition-colors"
            >
              Bekor Qilish
            </button>
          </div>
        </div>
      )}

      {/* Key Stats Banner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Points Earned */}
        <div className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
          isDarkMode ? "bg-neutral-900/80 border-neutral-800" : "bg-neutral-50 border-neutral-200"
        }`}>
          <div className="p-3 bg-amber-500/20 text-amber-500 rounded-xl border border-amber-500/30 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-neutral-400 uppercase font-bold">JAMI REKORD OCHKO</div>
            <div className="text-xl font-mono font-black text-amber-500">
              {totalScore.toLocaleString()} <span className="text-xs font-normal">ochko</span>
            </div>
          </div>
        </div>

        {/* Highest Single Record */}
        <div className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
          isDarkMode ? "bg-neutral-900/80 border-neutral-800" : "bg-neutral-50 border-neutral-200"
        }`}>
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-neutral-400 uppercase font-bold">TOP BIRINCHI REKORD</div>
            <div className="text-xl font-mono font-black text-emerald-400 truncate max-w-[180px]">
              {topRecordGame ? `${topRecordGame.game.name}: ${topRecordGame.score}` : "Hali rekord yo'q"}
            </div>
          </div>
        </div>

        {/* Total Games Played */}
        <div className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
          isDarkMode ? "bg-neutral-900/80 border-neutral-800" : "bg-neutral-50 border-neutral-200"
        }`}>
          <div className="p-3 bg-sky-500/20 text-sky-400 rounded-xl border border-sky-500/30 shrink-0">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-neutral-400 uppercase font-bold">FAOL O'YINALGAN</div>
            <div className="text-xl font-mono font-black text-sky-400">
              {playedCount} / {ALL_GAMES_METADATA.length} <span className="text-xs font-normal">ta o'yin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls: Search, Category Filters, Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: "all", name: "Barchasi" },
            { id: "top", name: "🔥 Top" },
            { id: "action", name: "⚡ Ekshen" },
            { id: "logic", name: "🧠 Mantiq" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                selectedCategory === cat.id
                  ? "bg-amber-500 text-black border-amber-400 shadow"
                  : isDarkMode
                  ? "bg-neutral-900 text-neutral-300 border-neutral-800 hover:bg-neutral-800"
                  : "bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* High Scores List Table */}
      <div className={`overflow-x-auto rounded-2xl border ${
        isDarkMode ? "border-neutral-800 bg-neutral-950/40" : "border-neutral-200 bg-neutral-50/50"
      }`}>
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead>
            <tr className={`border-b text-[10px] uppercase font-bold ${
              isDarkMode ? "border-neutral-800 bg-neutral-900/60 text-neutral-400" : "border-neutral-200 bg-neutral-100 text-neutral-600"
            }`}>
              <th className="p-3.5 pl-4 w-12 text-center"># Rank</th>
              <th className="p-3.5">O'yin Nomi</th>
              <th className="p-3.5">O'yinchi</th>
              <th className="p-3.5">Kategoriya</th>
              <th className="p-3.5">Eng Yuqori Ball</th>
              <th className="p-3.5">Oxirgi Yangilanish</th>
              <th className="p-3.5 text-right pr-4">Harakat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/40">
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

                // Rank badge
                const rankNum = index + 1;
                const rankBadge = rankNum === 1 ? "🥇 1-o'rin" : rankNum === 2 ? "🥈 2-o'rin" : rankNum === 3 ? "🥉 3-o'rin" : `#${rankNum}`;

                return (
                  <tr 
                    key={game.id} 
                    className={`transition-colors group hover:${
                      isDarkMode ? "bg-amber-500/5" : "bg-amber-500/10"
                    }`}
                  >
                    {/* Rank */}
                    <td className="p-3.5 pl-4 text-center font-bold font-mono">
                      <span className={`px-2 py-0.5 rounded-lg text-[11px] ${
                        rankNum === 1 
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 font-black" 
                          : rankNum === 2 
                          ? "bg-slate-300/20 text-slate-300 border border-slate-400/30" 
                          : rankNum === 3 
                          ? "bg-amber-700/20 text-amber-600 border border-amber-700/30" 
                          : "text-neutral-500"
                      }`}>
                        {rankBadge}
                      </span>
                    </td>

                    {/* Name */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white dark:text-white font-sans group-hover:text-amber-400 transition-colors">
                          {game.name}
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          {game.badge}
                        </span>
                      </div>
                    </td>

                    {/* Player */}
                    <td className="p-3.5 font-bold text-amber-400">
                      {score > 0 ? (
                        <span className="flex items-center gap-1 text-xs">
                          <span>👤</span> {playerName}
                        </span>
                      ) : (
                        <span className="text-neutral-500 text-[11px] font-normal">—</span>
                      )}
                    </td>

                    {/* Category */}
                    <td className="p-3.5 text-neutral-400">
                      <span className="capitalize">
                        {game.category === "top" ? "🔥 Top" : game.category === "action" ? "⚡ Ekshen" : "🧠 Mantiq"}
                      </span>
                    </td>

                    {/* Score */}
                    <td className="p-3.5">
                      {score > 0 ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl font-bold font-mono">
                          <Trophy className="w-3.5 h-3.5 text-amber-400" />
                          <span>{score.toLocaleString()} {game.unit}</span>
                        </div>
                      ) : (
                        <span className="text-neutral-500 font-normal">
                          0 {game.unit}
                        </span>
                      )}
                    </td>

                    {/* Updated At */}
                    <td className="p-3.5 text-neutral-400 text-[11px]">
                      {formattedDate}
                    </td>

                    {/* Action button */}
                    <td className="p-3.5 text-right pr-4">
                      <button
                        onClick={() => onSelectGame(game.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 text-black hover:bg-amber-400 font-bold rounded-xl text-xs transition-all cursor-pointer shadow active:scale-95"
                      >
                        <span>O'ynash</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-neutral-400">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Har bir o'yin yakunlangach eng yuqori balingiz ushbu jadvalga avtomatik qo'shiladi.
        </span>
        <span className="font-bold text-amber-500">
          LOCALSTORAGE PERSISTENT ACTIVE ⚡
        </span>
      </div>
    </div>
  );
}
