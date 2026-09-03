/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  Send, 
  Mail, 
  MapPin, 
  Check, 
  Cpu, 
  Brain, 
  ArrowRight,
  Menu,
  X,
  Gamepad2,
  Rocket,
  Flame,
  Target,
  Code2,
  Terminal,
  Layers,
  ArrowUp,
  Zap,
  CheckCircle2,
  Award,
  ShieldCheck,
  Lock,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Copy,
  RotateCcw,
  Maximize2,
  Minimize2,
  Search,
  Trophy
} from "lucide-react";
import { isSoundEnabled, setSoundEnabled, playClickSound, playTransitionSound, playAIMessageSound } from "./lib/soundEffects";
import { Message, SiteConfig } from "./types";
import DinoGame from "./components/DinoGame";
import SpaceShooter from "./components/SpaceShooter";
import SnakeGame from "./components/SnakeGame";
import PingPongGame from "./components/PingPongGame";
import FlappyBirdGame from "./components/FlappyBirdGame";
import MemoryMatchGame from "./components/MemoryMatchGame";
import TetrisGame from "./components/TetrisGame";
import Tile2048Game from "./components/Tile2048Game";
import BrickBreakerGame from "./components/BrickBreakerGame";
import SniperGame from "./components/SniperGame";
import ColorRushGame from "./components/ColorRushGame";
import MinesweeperGame from "./components/MinesweeperGame";
import FastMathGame from "./components/FastMathGame";
import TicTacToeGame from "./components/TicTacToeGame";
import WhackAMoleGame from "./components/WhackAMoleGame";
import SimonSaysGame from "./components/SimonSaysGame";
import WordScrambleGame from "./components/WordScrambleGame";
import SpeedTypingGame from "./components/SpeedTypingGame";
import GravityRunnerGame from "./components/GravityRunnerGame";
import ConnectFourGame from "./components/ConnectFourGame";
import KnifeHitGame from "./components/KnifeHitGame";
import FruitNinjaGame from "./components/FruitNinjaGame";
import ArcheryShooterGame from "./components/ArcheryShooterGame";
import TowerStackGame from "./components/TowerStackGame";
import BubbleShooterGame from "./components/BubbleShooterGame";
import SpaceInvadersGame from "./components/SpaceInvadersGame";
import TypingSpeedRacerGame from "./components/TypingSpeedRacerGame";
import SudokuMiniGame from "./components/SudokuMiniGame";
import HelixJumpGame from "./components/HelixJumpGame";
import AimTrainerGame from "./components/AimTrainerGame";
import MazeRunnerGame from "./components/MazeRunnerGame";
import PatternMemoryGame from "./components/PatternMemoryGame";
import ProjectsShowcase from "./components/ProjectsShowcase";
import DoodleJumpGame from "./components/DoodleJumpGame";
import NumberMergeChainGame from "./components/NumberMergeChainGame";
import Confetti from "./components/Confetti";
import AdminPanelModal, { DEFAULT_SITE_CONFIG } from "./components/AdminPanelModal";
import PlayerAccountModal from "./components/PlayerAccountModal";
import GamesAuthGate from "./components/GamesAuthGate";
import { getHighScoresMap, ScoreRecord, ALL_GAMES_METADATA } from "./lib/highScores";

// Hero Typewriter Component (Cycles smoothly with eye-catching neon gradient glass HUD & dynamic icons)
function HeroTypewriter() {
  const roles = [
    { title: "Full-Stack Developer", icon: <Layers className="w-5 h-5 text-emerald-400" />, color: "from-emerald-500 via-teal-500 to-cyan-500", glow: "shadow-emerald-500/30", badge: "NODE + REACT ⚡" },
    { title: "HTML5 & CSS3 Specialist", icon: <Code2 className="w-5 h-5 text-orange-400" />, color: "from-orange-500 via-amber-500 to-yellow-500", glow: "shadow-orange-500/30", badge: "PIXEL PERFECT 🎨" },
    { title: "Backend & Express.js", icon: <Terminal className="w-5 h-5 text-emerald-400" />, color: "from-green-500 via-emerald-600 to-teal-500", glow: "shadow-green-500/30", badge: "REST API & DB 🛡️" },
    { title: "Frontend & React.js", icon: <Zap className="w-5 h-5 text-cyan-400" />, color: "from-cyan-500 via-blue-500 to-indigo-500", glow: "shadow-cyan-500/30", badge: "UI / UX MAGIC ✨" },
    { title: "Gemini AI Architect", icon: <Sparkles className="w-5 h-5 text-purple-400 animate-spin-slow" />, color: "from-purple-500 via-pink-500 to-rose-500", glow: "shadow-purple-500/30", badge: "GEN-AI PRO 🤖" }
  ];

  const [wordIdx, setWordIdx] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const targetWord = roles[wordIdx].title;

    if (!isDeleting && currentText === targetWord) {
      // Pause 2.5 seconds when word is fully typed so user can easily read it
      const pauseTimer = setTimeout(() => {
        setIsDeleting(true);
      }, 2500);
      return () => clearTimeout(pauseTimer);
    }

    if (isDeleting && currentText === "") {
      // Pause 0.3s before typing next word
      const nextWordTimer = setTimeout(() => {
        setIsDeleting(false);
        setWordIdx((prev) => (prev + 1) % roles.length);
      }, 300);
      return () => clearTimeout(nextWordTimer);
    }

    const speed = isDeleting ? 45 : 90;
    const charTimer = setTimeout(() => {
      if (!isDeleting) {
        setCurrentText(targetWord.substring(0, currentText.length + 1));
      } else {
        setCurrentText(targetWord.substring(0, currentText.length - 1));
      }
    }, speed);

    return () => clearTimeout(charTimer);
  }, [currentText, isDeleting, wordIdx]);

  const activeRole = roles[wordIdx];

  return (
    <div className="flex flex-col items-center gap-3.5 my-3 w-full max-w-xl mx-auto">
      {/* Outer Glowing Gradient Frame with HUD card */}
      <motion.div 
        key={wordIdx}
        initial={{ scale: 0.96, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`p-[2px] rounded-3xl bg-gradient-to-r ${activeRole.color} shadow-2xl ${activeRole.glow} transition-all duration-500 w-full`}
      >
        <div className="bg-neutral-950/95 backdrop-blur-md px-3.5 sm:px-6 py-3 sm:py-4 rounded-[22px] flex items-center justify-between gap-2.5 text-white border border-white/10 shadow-inner">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shadow-md shrink-0">
              {activeRole.icon}
            </div>
            <div className="text-left min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider sm:tracking-widest text-neutral-400 font-bold block truncate">
                  MUTAXASSISLIK
                </span>
              </div>
              <div className="font-mono text-xs sm:text-base md:text-lg font-bold tracking-tight text-white flex items-center gap-1.5 min-w-0">
                <span className="truncate">{currentText}</span>
                <span className="w-1.5 sm:w-2 h-4 sm:h-5 bg-amber-400 inline-block animate-pulse shrink-0" />
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <span className="text-[9px] sm:text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/10 text-amber-300 border border-amber-400/30 flex items-center gap-1 shadow-sm">
              {activeRole.badge}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Interactive Tech Badge Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        {[
          { name: "HTML5", color: "hover:border-orange-500 hover:text-orange-400 hover:bg-orange-950/30" },
          { name: "CSS3", color: "hover:border-blue-500 hover:text-blue-400 hover:bg-blue-950/30" },
          { name: "JavaScript", color: "hover:border-yellow-500 hover:text-yellow-400 hover:bg-yellow-950/30" },
          { name: "React.js", color: "hover:border-cyan-500 hover:text-cyan-400 hover:bg-cyan-950/30" },
          { name: "Node.js", color: "hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-950/30" },
          { name: "Express", color: "hover:border-purple-500 hover:text-purple-400 hover:bg-purple-950/30" },
          { name: "Tailwind CSS", color: "hover:border-sky-500 hover:text-sky-400 hover:bg-sky-950/30" },
          { name: "Gemini AI", color: "hover:border-rose-500 hover:text-rose-400 hover:bg-rose-950/30" },
        ].map((skill) => (
          <motion.span
            key={skill.name}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1 bg-neutral-900/90 text-neutral-300 font-mono text-[11px] font-semibold rounded-xl border border-neutral-800 transition-all cursor-default shadow-sm ${skill.color}`}
          >
            #{skill.name}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  // Dark/Light Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("anvar_theme") === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("anvar_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("anvar_theme", "light");
    }
  }, [isDarkMode]);

  // Site Config state (persisted on server disk + fallback cache in localStorage)
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem("anvar_site_config_v4");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to parse site config", e);
    }
    return {
      ...DEFAULT_SITE_CONFIG,
      customProjects: []
    };
  });

  // Global server state sync: fetch site config & custom projects across all devices
  useEffect(() => {
    const fetchGlobalConfig = async () => {
      try {
        const res = await fetch("/api/config");
        if (res.ok) {
          const data = await res.json();
          if (data && data.config) {
            // Check if local config has user updates that should be merged
            setSiteConfig((prevConfig) => {
              const serverConfig = data.config;
              
              // If local storage has custom projects that server missing, merge them
              const mergedProjects = [...(serverConfig.customProjects || [])];
              if (prevConfig.customProjects && Array.isArray(prevConfig.customProjects)) {
                prevConfig.customProjects.forEach((p) => {
                  if (!mergedProjects.some((sp) => sp.id === p.id)) {
                    mergedProjects.push(p);
                  }
                });
              }

              const mergedConfig = {
                ...serverConfig,
                ...prevConfig,
                ...serverConfig, // server config takes priority when saved
                customProjects: mergedProjects,
              };

              try {
                localStorage.setItem("anvar_site_config_v4", JSON.stringify(mergedConfig));
              } catch (e) {}

              return mergedConfig;
            });
          }
        }
      } catch (err) {
        console.warn("Server config sync error:", err);
      }
    };

    fetchGlobalConfig();
    const timer = setInterval(fetchGlobalConfig, 5000);
    return () => clearInterval(timer);
  }, []);

  // Admin modal & authentication states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem("anvar_admin_logged_in") === "true";
  });
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showPlayerAccountModal, setShowPlayerAccountModal] = useState(false);
  const [inboxCount, setInboxCount] = useState(0);

  // Poll server for incoming SMS/messages count across all devices
  useEffect(() => {
    const fetchInboxCount = async () => {
      try {
        const res = await fetch("/api/contact/list");
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.messages)) {
            setInboxCount(data.messages.length);
          }
        }
      } catch (err) {}
    };

    fetchInboxCount();
    const timer = setInterval(fetchInboxCount, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSaveConfig = async (newConfig: SiteConfig) => {
    setSiteConfig(newConfig);
    try {
      localStorage.setItem("anvar_site_config_v4", JSON.stringify(newConfig));
    } catch (e) {
      console.error("Failed to save site config locally", e);
    }

    try {
      const res = await fetch("/api/config/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: newConfig })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.config) {
          setSiteConfig(data.config);
          try {
            localStorage.setItem("anvar_site_config_v4", JSON.stringify(data.config));
          } catch (e) {}
        }
      }
    } catch (err) {
      console.error("Failed to sync config to server", err);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    localStorage.setItem("anvar_admin_logged_in", "true");
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem("anvar_admin_logged_in");
  };

  // Loading screen states
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState("Interaktiv tizimlar yuklanmoqda...");
  
  // App navigation and interactive states
  const [activeTab, setActiveTab] = useState("home");
  const [activeGameTab, setActiveGameTab] = useState("tetris");
  const [gameCategory, setGameCategory] = useState("all");
  const gameTabsRef = useRef<HTMLDivElement>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [isGameFullScreen, setIsGameFullScreen] = useState(false);
  const [highScoresMap, setHighScoresMap] = useState<Record<string, ScoreRecord>>({});

  useEffect(() => {
    const updateHighScores = () => {
      setHighScoresMap(getHighScoresMap());
    };
    updateHighScores();
    window.addEventListener("highscore_updated", updateHighScores);
    window.addEventListener("player_account_updated", updateHighScores);
    window.addEventListener("storage", updateHighScores);
    return () => {
      window.removeEventListener("highscore_updated", updateHighScores);
      window.removeEventListener("player_account_updated", updateHighScores);
      window.removeEventListener("storage", updateHighScores);
    };
  }, []);

  useEffect(() => {
    const handleFSChange = () => {
      setIsGameFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFSChange);
    return () => document.removeEventListener("fullscreenchange", handleFSChange);
  }, []);

  const toggleGameFullScreen = (forceState?: boolean) => {
    const next = forceState !== undefined ? forceState : !isGameFullScreen;
    setIsGameFullScreen(next);

    if (next) {
      if (gameContainerRef.current && gameContainerRef.current.requestFullscreen) {
        gameContainerRef.current.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const [gameSearchQuery, setGameSearchQuery] = useState("");

  const ALL_GAMES = useMemo(() => [
    { id: "tetris", name: "Tetris Matrix", category: "top", badge: "TOP 🎮", emoji: "🧱", desc: "Klassik bloklarni yig'ish va qatorlarni yo'qotish" },
    { id: "tictactoe", name: "X no'l (Tic-Tac-Toe AI)", category: "top", badge: "TOP 🤖", emoji: "❌", desc: "Mantiqiy AI ga qarshi X va O bellashuvi" },
    { id: "spaceinvaders", name: "Space Invaders", category: "top", badge: "ACTION 👾", emoji: "👾", desc: "Koinot bosqinchilarini urib tushiring" },
    { id: "bubbleshooter", name: "Bubble Shooter", category: "top", badge: "HOT 🔴", emoji: "🔴", desc: "Rangli pufakchalarni 3 tadan portlating" },
    { id: "fruitninja", name: "Fruit Ninja", category: "top", badge: "SLICE 🍉", emoji: "🍉", desc: "Uchib chiqqan mevalarni o'tkir qilich bilan kesing" },
    { id: "brick", name: "Brick Breaker", category: "top", badge: "ARCADE 🧱", emoji: "🏓", desc: "G'ishtlarni koptokcha bilan urib yakson qiling" },
    { id: "typingracer", name: "Speed Typing Racer", category: "action", badge: "RACER 🏎️", emoji: "🏎️", desc: "So'zlarni tez va xatosiz yozib poygalashing" },
    { id: "snake", name: "Cyber Snake", category: "action", badge: "CLASSIC 🐍", emoji: "🐍", desc: "Ilonchani ovlantiring va devorga urilmang" },
    { id: "knifehit", name: "Knife Hit", category: "action", badge: "HIT 🎯", emoji: "🗡️", desc: "Pichoqlarni aylanuvchi g'o'laga aniq sanching" },
    { id: "archery", name: "Archery Master", category: "action", badge: "BOW 🏹", emoji: "🏹", desc: "Kamondan nishon markaziga mo'ljal oling" },
    { id: "spaceshooter", name: "Space Shooter", category: "action", badge: "ACTION 🚀", emoji: "🚀", desc: "Kema bilan dushmanlarni torpedada urib tushiring" },
    { id: "flappy", name: "Flappy Bird", category: "action", badge: "HARD 🐥", emoji: "🐥", desc: "Qushchani quvurlar orasidan xavfsiz uchiring" },
    { id: "dino", name: "Dino Runner", category: "action", badge: "RETRO 🦖", emoji: "🦖", desc: "Dinozavr bilan to'siqlardan sakrab o'ting" },
    { id: "aimtrainer", name: "Aim Trainer", category: "action", badge: "AIM 🎯", emoji: "🎯", desc: "Tezkor paydo bo'luvchi nishonlarni urib oling" },
    { id: "colorrush", name: "Color Rush", category: "action", badge: "COLOR 🎨", emoji: "🎨", desc: "To'g'ri rangga ega to'siqlarga moslashing" },
    { id: "doodlejump", name: "Doodle Jump", category: "action", badge: "JUMP 🦘", emoji: "🦘", desc: "Platformalar bo'ylab iloji boricha yuqoriga sakrang" },
    { id: "helixjump", name: "Helix Jump", category: "action", badge: "DROP 🌀", emoji: "🌀", desc: "Aylanuvchi minoradan koptokni pastga tushiring" },
    { id: "towerstack", name: "Tower Stack", category: "action", badge: "STACK 🏢", emoji: "🏢", desc: "Bloklarni ustma-ust tekis joylashtiring" },
    { id: "whackamole", name: "Whack-A-Mole", category: "action", badge: "HAMMER 🔨", emoji: "🔨", desc: "Chiqqan yumronqoziqlarni bolg'a bilan urib oling" },
    { id: "sniper", name: "Sniper 3D", category: "action", badge: "SCOPE 🎯", emoji: "🔍", desc: "Snayper optikasida dushmanlarni yo'qoting" },
    { id: "mazerunner", name: "Maze Escape", category: "logic", badge: "MAZE 🧭", emoji: "🧭", desc: "Chigal labirintdan chiqish yo'lini toping" },
    { id: "patternmemory", name: "Pattern Memory", category: "logic", badge: "BRAIN 🧠", emoji: "🧠", desc: "Kataklar ketma-ketligini xotirada saqlang" },
    { id: "gravityrunner", name: "Gravity Runner", category: "logic", badge: "RUN 🚀", emoji: "⚡", desc: "Tortishish kuchini o'zgartirib yuguring" },
    { id: "speedtyping", name: "Speed Typer", category: "logic", badge: "TYPER ⌨️", emoji: "⌨️", desc: "Klaviatura tezligingiz va aniqligingizni sinang" },
    { id: "minesweeper", name: "Minesweeper", category: "logic", badge: "LOGIC 💣", emoji: "💣", desc: "Minalangan maydondan xavfsiz kataklarni oching" },
    { id: "fastmath", name: "Fast Math", category: "logic", badge: "REFLEX ⚡", emoji: "🧮", desc: "Matematik misollarni soniyalar ichida yeching" },
    { id: "pingpong", name: "Retro Pong", category: "logic", badge: "DUEL 🏓", emoji: "🏓", desc: "Klassik stol tennisi va AI ga qarshi duel" },
    { id: "memory", name: "Memory Match", category: "logic", badge: "BRAIN 🧠", emoji: "🃏", desc: "Bir xil juft kartalarni toping" },
    { id: "connectfour", name: "Connect Four", category: "logic", badge: "LOGIC 🔴", emoji: "🔴", desc: "4 ta bir xil diskni qatorga joylashtiring" },
    { id: "numbermerge", name: "Number Merge 2048", category: "logic", badge: "2048 🔢", emoji: "🔢", desc: "Bir xil raqamli zanjirlarni birlashtiring" },
    { id: "sudoku", name: "Sudoku Mini", category: "logic", badge: "LOGIC 🧩", emoji: "🧩", desc: "Raqamlarni kataklarga takrorlanmasdan terib chiqing" },
    { id: "simonsays", name: "Simon Says", category: "logic", badge: "MEMORY 🎵", emoji: "🎵", desc: "Ovozli va rangli kuylarni xotirada saqlang" },
    { id: "wordscramble", name: "Word Scramble", category: "logic", badge: "WORD 📝", emoji: "📝", desc: "Aralashib ketgan harflardan so'z yasang" },
    { id: "tile2048", name: "Tile 2048", category: "logic", badge: "2048 🔢", emoji: "🎲", desc: "2048 plitkasiga erishish uchun suring" }
  ], []);

  const filteredGames = useMemo(() => {
    return ALL_GAMES.filter(g => {
      const matchesCat = gameCategory === "all" || g.category === gameCategory;
      const q = gameSearchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        g.name.toLowerCase().includes(q) || 
        g.badge.toLowerCase().includes(q) ||
        g.desc.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [ALL_GAMES, gameCategory, gameSearchQuery]);

  const handlePrevGame = () => {
    const list = filteredGames;
    const currentIndex = list.findIndex(g => g.id === activeGameTab);
    const prevIndex = currentIndex <= 0 ? list.length - 1 : currentIndex - 1;
    if (list[prevIndex]) {
      setActiveGameTab(list[prevIndex].id);
    }
  };

  const handleNextGame = () => {
    const list = filteredGames;
    const currentIndex = list.findIndex(g => g.id === activeGameTab);
    const nextIndex = currentIndex < 0 || currentIndex >= list.length - 1 ? 0 : currentIndex + 1;
    if (list[nextIndex]) {
      setActiveGameTab(list[nextIndex].id);
    }
  };

  const scrollGameTabs = (direction: "left" | "right") => {
    if (gameTabsRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      gameTabsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleSoundToggle = (e: CustomEvent<{ enabled: boolean }>) => {
      setSoundOn(e.detail.enabled);
    };
    window.addEventListener("sound_toggle_changed", handleSoundToggle as EventListener);
    return () => window.removeEventListener("sound_toggle_changed", handleSoundToggle as EventListener);
  }, []);
  
  // Contact form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSending, setFormSending] = useState(false);

  // Fast, high-performance smooth scroll handler using native browser behavior
  const smoothScrollTo = (target: string | number | HTMLElement | null, _duration?: number) => {
    if (target === null || target === undefined) return;
    const startY = window.pageYOffset || document.documentElement.scrollTop;
    let targetY = 0;

    if (typeof target === "number") {
      targetY = target;
    } else if (typeof target === "string") {
      if (target === "home" || target === "top") {
        targetY = 0;
      } else {
        const el = document.getElementById(target);
        if (!el) return;
        targetY = el.getBoundingClientRect().top + startY - 80;
      }
    } else if (target instanceof HTMLElement) {
      targetY = target.getBoundingClientRect().top + startY - 80;
    }

    window.scrollTo({
      top: targetY,
      behavior: "smooth"
    });
  };

  // Scroll position listener for Scroll-To-Top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent page scroll when pressing Arrow keys or Space during gameplay (NEVER prevents when typing in inputs)
  useEffect(() => {
    const handleGameKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      const tag = activeEl?.tagName?.toLowerCase();
      const isInput =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        activeEl?.isContentEditable ||
        activeEl?.closest("form, input, textarea, .chat-input");

      // Never prevent default key behavior if the user is inside an input box or form
      if (isInput) {
        return;
      }

      // Only prevent space/arrow scroll if focus is explicitly inside game section
      const keysToPrevent = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", " "];
      if (keysToPrevent.includes(e.key)) {
        const gameSection = document.getElementById("games");
        if (gameSection && gameSection.contains(activeEl)) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleGameKeyDown);
    return () => window.removeEventListener("keydown", handleGameKeyDown);
  }, []);

  // Loader Animation Counter
  useEffect(() => {
    if (progress < 100) {
      const duration = 1000;
      const interval = 20;
      const step = 100 / (duration / interval);
      
      const timer = setInterval(() => {
        setProgress((prev) => {
          const next = prev + step + (Math.random() * 3);
          if (next >= 100) {
            clearInterval(timer);
            return 100;
          }
          return next;
        });
      }, interval);

      return () => clearInterval(timer);
    } else {
      // Auto enter site when loader hits 100%
      const autoEnterTimer = setTimeout(() => {
        setLoading(false);
      }, 250);
      return () => clearTimeout(autoEnterTimer);
    }
  }, [progress]);

  // Loading text phrases
  useEffect(() => {
    if (progress < 30) {
      setLoadingPhase("Akramov Anvar portfolio komponentlari yuklanmoqda...");
    } else if (progress < 65) {
      setLoadingPhase("15 yoshli Full-Stack dasturchi ma'lumotlari indekslanmoqda...");
    } else if (progress < 90) {
      setLoadingPhase("Interaktiv o'yinlar arenasi va loyihalar tayyorlanmoqda...");
    } else {
      setLoadingPhase("Tizim tayyor. Kirishga ruxsat berildi!");
    }
  }, [progress]);

  // Contact Form Submission handler (Direct routing to Telegram & Gmail)
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formMessage.trim()) return;

    setFormSending(true);

    const contactInfo = formEmail.trim() || "Kiritilmagan";
    const tgHandle = (siteConfig.telegram || "@mineestaxx").replace("@", "");
    const textMsg = `Assalomu alaykum Anvar! Men portfoliodan yozmoqdaman.\nIsmim: ${formName.trim()}\nKontakt: ${contactInfo}\n\nXabar: ${formMessage.trim()}`;
    const tgUrl = `https://t.me/${tgHandle}?text=${encodeURIComponent(textMsg)}`;

    try {
      window.open(tgUrl, "_blank");
    } catch (e) {}

    setFormSending(false);
    setFormSubmitted(true);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 antialiased relative overflow-x-hidden ${isDarkMode ? 'bg-[#0b0c10] text-[#f1f5f9] selection:bg-amber-400 selection:text-black' : 'bg-[#fdfdfd] text-[#111111] selection:bg-[#111111] selection:text-white'}`}>
      
      {/* 1. SPECTACULAR HIGH-TECH LOADING SCREEN */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            id="loader-screen"
            className="fixed inset-0 z-50 flex flex-col justify-between bg-[#08090d] text-white p-6 sm:p-10 overflow-hidden select-none"
            exit={{ 
              opacity: 0,
              scale: 1.05,
              filter: "blur(10px)",
              transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
            }}
          >
            {/* Ambient Animated Radial Glows */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse [animation-delay:1s]" />
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

            {/* Header of Loader */}
            <div className="flex justify-between items-center w-full max-w-7xl mx-auto border-b border-white/10 pb-4 relative z-10">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span className="font-mono text-xs tracking-widest text-neutral-300 font-bold uppercase">
                  AKRAMOV ANVAR // FULL-STACK AI SYSTEM
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setLoading(false)}
                  className="font-mono text-xs text-slate-950 font-black bg-gradient-to-r from-amber-400 to-yellow-300 px-3.5 py-1.5 rounded-full shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 fill-black" />
                  <span>SAYTGA KIRISH ⚡</span>
                </button>
              </div>
            </div>

            {/* Main Center Content */}
            <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center flex-grow py-8 text-center relative z-10">
              
              {/* Rotating Futuristic Cyber Core */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative w-28 h-28 sm:w-36 sm:h-36 my-4 flex items-center justify-center"
              >
                <div className="absolute inset-0 rounded-full border-2 border-amber-500/30 border-t-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-2 rounded-full border-2 border-emerald-500/30 border-b-emerald-400 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
                <div className="absolute inset-4 rounded-full border border-purple-500/20 border-l-purple-400 animate-spin" style={{ animationDuration: '4s' }} />
                
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 via-neutral-900 to-emerald-500/20 border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)] backdrop-blur-md">
                  <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 animate-pulse" />
                </div>
              </motion.div>

              {/* Title & Badge */}
              <div className="overflow-hidden mt-2 mb-2">
                <motion.div
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="font-serif text-3xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-amber-200 bg-clip-text text-transparent"
                >
                  Akramov Anvar
                </motion.div>
              </div>

              <div className="overflow-hidden mb-6">
                <motion.div
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="font-mono text-xs sm:text-sm uppercase tracking-widest text-emerald-400 font-bold flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  Full-Stack Dasturchi // 15 Yoshda // Surxondaryo
                </motion.div>
              </div>

              {/* Live Checklist diagnostic readout */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full max-w-xl my-3 text-[11px] font-mono">
                <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-2 text-neutral-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>React 18 Engine</span>
                </div>
                <div className="bg-white/5 border border-amber-400/20 rounded-xl px-3 py-1.5 flex items-center gap-2 text-amber-300">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                  <span>Gemini AI Core</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-2 text-neutral-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Arcade Games Matrix</span>
                </div>
              </div>

              {/* Progress Counter Section */}
              <div className="w-full max-w-xl mt-4 space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-mono text-neutral-400 tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    {loadingPhase}
                  </span>
                  <span className="text-3xl sm:text-5xl font-extrabold font-mono tracking-tighter bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
                    {Math.round(progress)}%
                  </span>
                </div>
                
                {/* Glowing progress bar */}
                <div className="h-2 w-full bg-white/10 relative overflow-hidden rounded-full border border-white/10">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-teal-300 absolute left-0 top-0 shadow-[0_0_16px_rgba(245,158,11,0.9)] rounded-full"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>

            {/* Footer of Loader */}
            <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-white/10 pt-4 text-xs font-mono text-neutral-400 relative z-10">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>AKRAMOV ANVAR ARCHITECTURE // 2026 EDITION</span>
              </div>

              {progress >= 100 ? (
                <motion.button
                  id="enter-btn"
                  onClick={() => setLoading(false)}
                  className="px-8 py-3 bg-gradient-to-r from-amber-400 to-emerald-400 text-black font-sans uppercase font-extrabold text-xs tracking-widest rounded-full hover:brightness-110 transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.5)] border border-amber-300"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: [1, 1.05, 1], opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  PORTFOLIOGA KIRISH <ArrowRight className="w-4 h-4 font-bold" />
                </motion.button>
              ) : (
                <div className="flex items-center gap-2 font-bold text-amber-400">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  YUKLANMOQDA...
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. PORTFOLIO PAGE */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* ANNOUNCEMENT BANNER IF ENABLED */}
          {siteConfig.showBanner && (
            <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 text-black py-2.5 px-4 font-mono text-xs font-bold text-center flex items-center justify-center gap-2 shadow-sm relative z-40">
              <Sparkles className="w-4 h-4 animate-spin shrink-0 text-black" />
              <span>{siteConfig.bannerText || "🔥 Akramov Anvar - 15 yoshli Full-Stack Dasturchi va AI Assistent platformasi!"}</span>
            </div>
          )}

          {/* Back to top decoration line */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-black via-amber-500 to-emerald-500" />

          {/* BACKGROUND DECORATIONS */}
          <div className={`absolute inset-0 [background-size:32px_32px] opacity-30 pointer-events-none ${isDarkMode ? 'bg-[radial-gradient(#334155_1px,transparent_1px)]' : 'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)]'}`} />

          {/* AESTHETIC TOP NAVIGATION BAR */}
          <header className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors duration-300 ${isDarkMode ? 'bg-[#0b0c10]/90 border-neutral-800' : 'bg-[#fdfdfd]/90 border-[#e5e5ea]'}`}>
            <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex justify-between items-center">
              
              {/* LOGO & ADMIN PANEL BUTTON - Top Header */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Black AA Icon - Clicking opens Admin Login Modal */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setShowAdminModal(true)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center font-mono font-black text-xs sm:text-sm tracking-widest shadow-md hover:ring-2 hover:ring-amber-400 cursor-pointer transition-all relative group shrink-0 ${
                    isDarkMode ? 'bg-amber-400 text-black hover:bg-amber-300' : 'bg-black text-white hover:bg-neutral-800'
                  }`}
                  title="Admin Panel Login (AA)"
                >
                  AA
                  {inboxCount > 0 ? (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-rose-500 rounded-full border-2 border-white text-[9px] font-mono font-bold text-white flex items-center justify-center shadow-md animate-pulse">
                      {inboxCount}
                    </span>
                  ) : (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </motion.button>

                {/* Name & Subtitle - Navigates to Home */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  id="logo-placeholder"
                  className={`flex flex-col cursor-pointer select-none py-1 px-1 transition-all rounded-xl ${isDarkMode ? 'hover:bg-neutral-800/80' : 'hover:bg-neutral-100'}`}
                  onClick={() => {
                    setActiveTab("home");
                    smoothScrollTo("home", 1200);
                  }}
                >
                  <span className={`font-serif text-xs sm:text-base tracking-tight sm:tracking-[0.15em] font-extrabold uppercase leading-none truncate max-w-[130px] xs:max-w-[180px] sm:max-w-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    {siteConfig.firstName} {siteConfig.lastName}
                  </span>
                  <span className={`text-[8.5px] sm:text-[10px] font-mono mt-0.5 sm:mt-1 font-semibold truncate ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Full-Stack Dev // {siteConfig.age || 15} yosh</span>
                </motion.div>
              </div>

              {/* Desktop Menu - Center */}
              <nav className="hidden lg:flex items-center gap-8 text-xs font-mono uppercase tracking-wider font-semibold">
                {[
                  { id: "home", label: "Asosiy" },
                  ...(siteConfig.customProjects && siteConfig.customProjects.length > 0 ? [{ id: "projects", label: "Loyihalarim" }] : []),
                  { id: "games", label: "O'yinlar Arena" },
                  { id: "goals", label: "Maqsadlarim" },
                  { id: "contact", label: "Bog'lanish" }
                ].map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    id={`nav-link-${item.id}`}
                    onClick={() => {
                      playTransitionSound();
                      setActiveTab(item.id);
                      smoothScrollTo(item.id);
                    }}
                    className={`relative py-2 cursor-pointer transition-colors ${
                      activeTab === item.id 
                        ? (isDarkMode ? "text-white font-bold" : "text-black font-bold") 
                        : (isDarkMode ? "text-neutral-400 hover:text-white" : "text-neutral-500 hover:text-black")
                    }`}
                  >
                    {item.label}

                    {activeTab === item.id && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${isDarkMode ? 'bg-amber-400' : 'bg-black'}`}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.button>
                ))}
              </nav>

              {/* Action buttons - Right Side */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* GLOBAL AUDIO SOUND TOGGLE BUTTON */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const nextState = !soundOn;
                    setSoundOn(nextState);
                    setSoundEnabled(nextState);
                  }}
                  id="sound-toggle-btn"
                  className={`px-3 py-1.5 rounded-full border text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                    isDarkMode 
                      ? (soundOn ? 'bg-neutral-800 border-neutral-700 text-emerald-400 hover:bg-neutral-700 hover:border-emerald-500/50' : 'bg-neutral-800 border-neutral-700 text-neutral-500 hover:bg-neutral-700') 
                      : (soundOn ? 'bg-neutral-100 border-neutral-200 text-emerald-600 hover:bg-neutral-200' : 'bg-neutral-100 border-neutral-200 text-neutral-400 hover:bg-neutral-200')
                  }`}
                  title={soundOn ? "Ovoz effektlari yoqilgan (O'chirish)" : "Ovoz effektlari o'chirilgan (Yoqish)"}
                >
                  {soundOn ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      <span className="hidden sm:inline">AUDIO</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
                      <span className="hidden sm:inline">MUTED</span>
                    </>
                  )}
                </motion.button>

                {/* DARK / LIGHT THEME TOGGLE BUTTON */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    playClickSound();
                    setIsDarkMode(!isDarkMode);
                  }}
                  id="theme-toggle-btn"
                  className={`px-3 py-1.5 rounded-full border text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                    isDarkMode 
                      ? 'bg-neutral-800 border-neutral-700 text-amber-400 hover:bg-neutral-700 hover:border-amber-400/50' 
                      : 'bg-neutral-100 border-neutral-200 text-neutral-800 hover:bg-neutral-200 hover:border-neutral-300'
                  }`}
                  title={isDarkMode ? "Yorug' tema (Light Mode)" : "Qorong'u tema (Dark Mode)"}
                >
                  {isDarkMode ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span className="hidden sm:inline">LIGHT</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-neutral-700" />
                      <span className="hidden sm:inline">DARK</span>
                    </>
                  )}
                </motion.button>

                <span className={`hidden md:flex text-xs font-mono px-3.5 py-1.5 rounded-full border font-bold items-center gap-1.5 ${
                  isDarkMode ? 'bg-neutral-800/80 border-neutral-700 text-neutral-200' : 'bg-neutral-100 border-neutral-200 text-black'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Yosh: {siteConfig.age}
                </span>

                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#contact"
                  className={`hidden sm:inline-block px-5 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors rounded-full font-bold shadow-md hover:shadow-lg cursor-pointer ${
                    isDarkMode ? 'bg-amber-400 text-black hover:bg-amber-300' : 'bg-black text-white hover:bg-neutral-800'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("contact");
                    smoothScrollTo("contact", 1200);
                  }}
                >
                  Aloqa
                </motion.a>

                {/* Mobile menu button */}
                <button
                  id="mobile-menu-toggle"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={`lg:hidden p-2 focus:outline-none cursor-pointer rounded-xl border ${
                    isDarkMode ? 'text-neutral-300 hover:text-white border-neutral-800 bg-neutral-900' : 'text-neutral-600 hover:text-black border-neutral-200'
                  }`}
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className={`lg:hidden border-t px-5 py-6 space-y-4 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center text-center ${
                    isDarkMode ? 'border-neutral-800/80 bg-[#0e1017]/95 text-white' : 'border-neutral-200/80 bg-white/95 text-black'
                  }`}
                >
                  <div className="w-full max-w-sm flex flex-col items-center justify-center space-y-2.5">
                    {[
                      { id: "home", label: "Asosiy Sahifa", icon: Sparkles },
                      ...(siteConfig.customProjects && siteConfig.customProjects.length > 0 ? [{ id: "projects", label: "Loyihalarim", icon: Code2 }] : []),
                      { id: "games", label: "O'yinlar Arena", icon: Gamepad2 },
                      { id: "goals", label: "Maqsadlarim", icon: Target },
                      { id: "contact", label: "Menga Bog'laning", icon: Mail }
                    ].map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          id={`nav-link-mobile-${item.id}`}
                          onClick={() => {
                            setActiveTab(item.id);
                            setMobileMenuOpen(false);
                            smoothScrollTo(item.id);
                            playClickSound();
                          }}
                          className={`w-full py-3.5 px-6 text-xs sm:text-sm uppercase tracking-widest font-mono font-bold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2.5 active:scale-95 shadow-sm ${
                            isActive 
                              ? (isDarkMode 
                                  ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-lg shadow-amber-500/20" 
                                  : "bg-slate-950 text-amber-400 font-black shadow-lg shadow-slate-950/20") 
                              : (isDarkMode 
                                  ? "bg-neutral-900/80 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800/80" 
                                  : "bg-slate-100/90 text-slate-700 hover:text-black hover:bg-slate-200 border border-slate-200/80")
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? "text-current animate-pulse" : "opacity-75"}`} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className={`w-full max-w-sm pt-4 border-t flex flex-col items-center justify-center gap-3 ${isDarkMode ? 'border-neutral-800/80' : 'border-neutral-200/80'}`}>
                    <span className={`text-xs font-mono font-semibold ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      Akramov Anvar // {siteConfig.age || 15} yosh
                    </span>
                    <button
                      onClick={() => {
                        setIsDarkMode(!isDarkMode);
                        playClickSound();
                      }}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-bold flex items-center gap-2 border transition-all active:scale-95 cursor-pointer ${
                        isDarkMode ? 'bg-neutral-800 border-neutral-700 text-amber-400 hover:bg-neutral-700' : 'bg-neutral-100 border-neutral-300 text-neutral-800 hover:bg-neutral-200'
                      }`}
                    >
                      {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
                      <span>{isDarkMode ? 'YORUG\' TEMA' : 'QORONG\'U TEMA'}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          {/* MAIN WRAPPER CONTAINER */}
          <main className="max-w-7xl mx-auto px-3.5 sm:px-6 py-6 md:py-16 space-y-16 sm:space-y-24 md:space-y-32">

            {/* SECTION 1: HERO VIEW */}
            <motion.section 
              id="home" 
              className="pt-2 md:pt-6 scroll-mt-24 relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Floating Ambient Glow Background Orbs (Optimized GPU-friendly) */}
              <div 
                className="absolute w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] rounded-full bg-gradient-to-tr from-emerald-400/20 to-cyan-400/15 blur-2xl sm:blur-3xl -top-28 -left-28 pointer-events-none -z-10 animate-float-glow gpu-accelerated"
              />
              <div 
                className="absolute w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] rounded-full bg-gradient-to-br from-purple-500/15 to-amber-400/15 blur-2xl sm:blur-3xl -bottom-28 -right-28 pointer-events-none -z-10 animate-float-glow gpu-accelerated"
                style={{ animationDelay: '-4s' }}
              />

              <div className="max-w-4xl mx-auto text-center flex flex-col items-center space-y-6 sm:space-y-8 relative z-10">
                
                {/* Subheading Badge */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center space-x-2 bg-neutral-900/90 text-white px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full border border-neutral-700/80 shadow-xl backdrop-blur-md hover:border-emerald-500/50 transition-colors max-w-full"
                >
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono uppercase font-bold tracking-wider sm:tracking-widest bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 bg-clip-text text-transparent truncate">
                    {siteConfig.badgeText}
                  </span>
                </motion.div>

                {/* Main Editorial Heading */}
                <div className="space-y-3 sm:space-y-4 flex flex-col items-center w-full px-2">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[1.08] sm:leading-[0.95] tracking-tight sm:tracking-tighter uppercase text-center relative break-words w-full"
                  >
                    <span className={isDarkMode ? "text-white drop-shadow-sm" : "text-neutral-950 drop-shadow-sm"}>
                      {siteConfig.firstName}
                    </span>
                    <br />
                    <span 
                      className={`text-transparent bg-clip-text ${
                        isDarkMode 
                          ? "bg-gradient-to-r from-amber-400 via-yellow-200 to-white" 
                          : "bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-400"
                      }`} 
                      style={isDarkMode ? undefined : { WebkitTextStroke: "1.5px black" }}
                    >
                      {siteConfig.lastName}
                    </span>
                  </motion.h1>

                  {/* Interactive Typewriter Animation */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="pt-1 sm:pt-2 flex justify-center w-full"
                  >
                    <HeroTypewriter />
                  </motion.div>
                </div>

                {/* Bio Text */}
                <motion.p 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className={`${
                    isDarkMode ? "text-neutral-300" : "text-neutral-700"
                  } text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-sans text-center font-medium px-2`}
                >
                  {siteConfig.bio}
                </motion.p>

                {/* Action buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1 sm:pt-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setActiveTab("games");
                      smoothScrollTo("games", 1200);
                    }}
                    className="px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 text-xs font-mono uppercase font-black tracking-wider rounded-full hover:shadow-2xl hover:shadow-amber-500/30 transition-all cursor-pointer flex items-center gap-2 border border-amber-400"
                  >
                    <Gamepad2 className="w-4 h-4 animate-bounce" /> O'yinlar Arenasi
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const targetId = siteConfig.customProjects && siteConfig.customProjects.length > 0 ? "projects" : "contact";
                      setActiveTab(targetId);
                      smoothScrollTo(targetId, 1200);
                    }}
                    className={`px-6 sm:px-8 py-3.5 sm:py-4 border rounded-full text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-lg ${
                      isDarkMode 
                        ? 'border-neutral-700 bg-neutral-900/90 text-white hover:bg-neutral-800 hover:border-amber-400' 
                        : 'border-neutral-300 bg-white/90 text-black hover:bg-white hover:border-amber-500'
                    }`}
                  >
                    <Target className="w-4 h-4 text-amber-500" /> {siteConfig.customProjects && siteConfig.customProjects.length > 0 ? "Loyihalarim" : "Menga Bog'lanish"}
                  </motion.button>
                </motion.div>

                {/* Stats Widget */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className={`grid grid-cols-3 gap-2 sm:gap-6 pt-6 sm:pt-8 border-t max-w-2xl mx-auto w-full text-center ${
                    isDarkMode ? 'border-neutral-800' : 'border-neutral-200/80'
                  }`}
                >
                  <motion.div 
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`p-2.5 sm:p-6 backdrop-blur-md border rounded-2xl sm:rounded-3xl flex-1 shadow-md hover:shadow-xl transition-all relative overflow-hidden group ${
                      isDarkMode ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white/90 border-neutral-200'
                    }`}
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-80 group-hover:opacity-100 transition-opacity" />
                    <span className={`block text-lg sm:text-4xl font-bold mb-0.5 sm:mb-1 font-mono ${isDarkMode ? 'text-white' : 'text-black'}`}>
                      {siteConfig.stat1Value}
                    </span>
                    <span className="text-[8.5px] sm:text-[10px] uppercase tracking-normal sm:tracking-widest text-neutral-400 font-mono font-bold leading-tight block truncate">
                      {siteConfig.stat1Label}
                    </span>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`p-2.5 sm:p-6 backdrop-blur-md border rounded-2xl sm:rounded-3xl flex-1 shadow-md hover:shadow-xl transition-all relative overflow-hidden group ${
                      isDarkMode ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white/90 border-neutral-200'
                    }`}
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500 opacity-80 group-hover:opacity-100 transition-opacity" />
                    <span className={`block text-lg sm:text-4xl font-bold mb-0.5 sm:mb-1 font-mono ${isDarkMode ? 'text-white' : 'text-black'}`}>
                      {siteConfig.stat2Value}
                    </span>
                    <span className="text-[8.5px] sm:text-[10px] uppercase tracking-normal sm:tracking-widest text-neutral-400 font-mono font-bold leading-tight block truncate">
                      {siteConfig.stat2Label}
                    </span>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`p-2.5 sm:p-6 backdrop-blur-md border rounded-2xl sm:rounded-3xl flex-1 shadow-md hover:shadow-xl transition-all relative overflow-hidden group ${
                      isDarkMode ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white/90 border-neutral-200'
                    }`}
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-80 group-hover:opacity-100 transition-opacity" />
                    <span className="block text-lg sm:text-4xl font-bold mb-0.5 sm:mb-1 font-mono text-emerald-500">
                      {siteConfig.stat3Value}
                    </span>
                    <span className="text-[8.5px] sm:text-[10px] uppercase tracking-normal sm:tracking-widest text-neutral-400 font-mono font-bold leading-tight block truncate">
                      {siteConfig.stat3Label}
                    </span>
                  </motion.div>
                </motion.div>

              </div>
            </motion.section>

            {/* SECTION 2: MENING SHAXSIY LOYIHALARIM (PROJECTS SHOWCASE) */}
            <ProjectsShowcase 
              projects={siteConfig.customProjects} 
              isDarkMode={isDarkMode} 
            />

            {/* SECTION 3: INTERAKTIV O'YINLAR ARENASI */}
            <motion.section 
              id="games" 
              className="scroll-mt-24 space-y-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-center space-y-3 py-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-mono text-amber-500 font-bold shadow-sm">
                  <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span>34+ INTERAKTIV MINI-O'YINLAR KATALOGI</span>
                </div>
                <h2 className={`font-serif text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}>
                  INTERAKTIV O'YINLAR ARENASI
                </h2>
                <p className={`text-xs sm:text-sm font-mono max-w-xl mx-auto ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}>
                  Sevimli o'yiningizni tanlang, reytinglarni zabt eting va do'stlaringiz orasida yetakchi bo'ling!
                </p>
                <div className="h-1 w-24 bg-gradient-to-r from-amber-500 to-yellow-400 mx-auto rounded-full mt-2" />
              </div>

              <GamesAuthGate
                isDarkMode={isDarkMode}
                onOpenPlayerAccountModal={() => setShowPlayerAccountModal(true)}
              >
                <div className="space-y-6">
                  {/* ACTIVE GAME STAGE WITH MOBILE-OPTIMIZED CONTROLS */}
                  {(() => {
                    const currentGameObj = ALL_GAMES.find(g => g.id === activeGameTab) || ALL_GAMES[0];
                    const rec = highScoresMap[activeGameTab];
                    const recScore = rec?.score ?? 0;
                    const recHolder = rec?.holderName || "O'yinchi";
                    const recAvatar = rec?.holderAvatar || "🎮";
                    const meta = ALL_GAMES_METADATA.find(m => m.id === activeGameTab);
                    const unit = meta?.unit || "ochko";

                    return (
                      <div className="space-y-4 sm:space-y-6 w-full max-w-full">
                        {/* Control Bar - Fully Responsive for Mobile & Desktop */}
                        <div className="bg-neutral-950/95 backdrop-blur-xl text-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-2xl border border-amber-500/40 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
                          {/* Top / Left: Prev + Dropdown Select + Next */}
                          <div className="flex items-center gap-2 w-full md:w-auto">
                            <button
                              type="button"
                              onClick={() => { handlePrevGame(); playClickSound(); }}
                              className="h-11 w-11 rounded-xl sm:rounded-2xl bg-neutral-900 hover:bg-amber-500 hover:text-black border border-neutral-800 text-amber-400 font-mono text-xs font-bold transition-all shrink-0 cursor-pointer shadow-md active:scale-95 flex items-center justify-center"
                              title="Oldingi o'yin"
                              aria-label="Oldingi o'yin"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>

                            {/* Dropdown Selector */}
                            <div className="relative flex-1 min-w-0 md:w-80">
                              <select
                                value={activeGameTab}
                                onChange={(e) => {
                                  setActiveGameTab(e.target.value);
                                  playClickSound();
                                }}
                                className="w-full bg-neutral-900 text-amber-300 font-mono font-bold text-xs sm:text-sm py-3 pl-3.5 pr-9 rounded-xl sm:rounded-2xl border border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer appearance-none truncate shadow-inner tracking-wide"
                              >
                                {ALL_GAMES.map((g) => (
                                  <option key={g.id} value={g.id} className="bg-neutral-900 text-white font-mono py-1">
                                    {g.emoji} {g.name} ({g.badge})
                                  </option>
                                ))}
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-amber-400 text-xs">
                                ▼
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => { handleNextGame(); playClickSound(); }}
                              className="h-11 w-11 rounded-xl sm:rounded-2xl bg-neutral-900 hover:bg-amber-500 hover:text-black border border-neutral-800 text-amber-400 font-mono text-xs font-bold transition-all shrink-0 cursor-pointer shadow-md active:scale-95 flex items-center justify-center"
                              title="Keyingi o'yin"
                              aria-label="Keyingi o'yin"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </div>

                          {/* Bottom / Right: Record Info & Fullscreen Controls */}
                          <div className="flex items-center justify-between md:justify-end gap-2.5 text-xs font-mono w-full md:w-auto">
                            <div className="flex items-center gap-1.5 text-amber-400 font-bold bg-amber-500/10 px-3.5 py-2.5 rounded-xl sm:rounded-2xl border border-amber-500/30 flex-1 md:flex-initial justify-between md:justify-start min-w-0">
                              <div className="flex items-center gap-1.5 shrink-0">
                                <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                                <span className="hidden xs:inline">Rekord:</span>
                              </div>
                              <span className="font-extrabold text-amber-300 truncate text-[11px] sm:text-xs">
                                {recScore > 0 ? `${recScore.toLocaleString()} ${unit}` : "Yo'q"}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleGameFullScreen()}
                              className="h-11 px-4 sm:px-5 rounded-xl sm:rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 shadow-lg shadow-amber-500/20 active:scale-95"
                            >
                              {isGameFullScreen ? <Minimize2 className="w-4 h-4 shrink-0" /> : <Maximize2 className="w-4 h-4 shrink-0" />}
                              <span className="hidden sm:inline">{isGameFullScreen ? "Kichiklashtirish" : "Butun ekran"}</span>
                            </button>
                          </div>
                        </div>

                        {/* Active Game Canvas Container */}
                        <div 
                          ref={gameContainerRef}
                          className={
                            isGameFullScreen 
                              ? "fixed inset-0 z-[99999] bg-slate-950 p-2 sm:p-6 overflow-y-auto flex flex-col items-center justify-center min-h-screen"
                              : "w-full max-w-full relative py-1 sm:py-2 overflow-hidden flex flex-col items-center justify-center"
                          }
                        >
                          {isGameFullScreen && (
                            <button
                              type="button"
                              onClick={() => toggleGameFullScreen(false)}
                              className="fixed top-3 right-3 sm:top-5 sm:right-5 z-[100000] px-3.5 py-2 sm:px-4 sm:py-2.5 bg-neutral-900/95 hover:bg-neutral-800 text-amber-400 border border-amber-500/40 rounded-xl sm:rounded-2xl text-xs font-mono font-black flex items-center gap-2 shadow-2xl backdrop-blur-md cursor-pointer transition-all active:scale-95"
                            >
                              <Minimize2 className="w-4 h-4" />
                              <span>Chiqish</span>
                            </button>
                          )}

                          <AnimatePresence mode="wait">
                            <motion.div
                              key={activeGameTab}
                              initial={{ opacity: 0, y: 15, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -15, scale: 0.97 }}
                              transition={{ duration: 0.25 }}
                              className={isGameFullScreen ? "w-full max-w-4xl mx-auto my-auto flex justify-center" : "w-full max-w-3xl mx-auto flex justify-center"}
                            >
                              {activeGameTab === "bubbleshooter" && <BubbleShooterGame className="w-full shadow-2xl" />}
                              {activeGameTab === "spaceinvaders" && <SpaceInvadersGame className="w-full shadow-2xl" />}
                              {activeGameTab === "typingracer" && <TypingSpeedRacerGame className="w-full shadow-2xl" />}
                              {activeGameTab === "sudoku" && <SudokuMiniGame className="w-full shadow-2xl" />}
                              {activeGameTab === "helixjump" && <HelixJumpGame className="w-full shadow-2xl" />}
                              {activeGameTab === "aimtrainer" && <AimTrainerGame className="w-full shadow-2xl" />}
                              {activeGameTab === "mazerunner" && <MazeRunnerGame className="w-full shadow-2xl" />}
                              {activeGameTab === "patternmemory" && <PatternMemoryGame className="w-full shadow-2xl" />}
                              {activeGameTab === "doodlejump" && <DoodleJumpGame className="w-full shadow-2xl" />}
                              {activeGameTab === "numbermerge" && <NumberMergeChainGame className="w-full shadow-2xl" />}
                              {activeGameTab === "tetris" && <TetrisGame className="w-full shadow-2xl" />}
                              {activeGameTab === "whackamole" && <WhackAMoleGame className="w-full shadow-2xl" />}
                              {activeGameTab === "simonsays" && <SimonSaysGame className="w-full shadow-2xl" />}
                              {activeGameTab === "wordscramble" && <WordScrambleGame className="w-full shadow-2xl" />}
                              {activeGameTab === "speedtyping" && <SpeedTypingGame className="w-full shadow-2xl" />}
                              {activeGameTab === "gravityrunner" && <GravityRunnerGame className="w-full shadow-2xl" />}
                              {activeGameTab === "connectfour" && <ConnectFourGame className="w-full shadow-2xl" />}
                              {activeGameTab === "knifehit" && <KnifeHitGame className="w-full shadow-2xl" />}
                              {activeGameTab === "fruitninja" && <FruitNinjaGame className="w-full shadow-2xl" />}
                              {activeGameTab === "archery" && <ArcheryShooterGame className="w-full shadow-2xl" />}
                              {activeGameTab === "towerstack" && <TowerStackGame className="w-full shadow-2xl" />}
                              {activeGameTab === "tile2048" && <Tile2048Game className="w-full shadow-2xl" />}
                              {activeGameTab === "brick" && <BrickBreakerGame className="w-full shadow-2xl" />}
                              {activeGameTab === "sniper" && <SniperGame className="w-full shadow-2xl" />}
                              {activeGameTab === "colorrush" && <ColorRushGame className="w-full shadow-2xl" />}
                              {activeGameTab === "minesweeper" && <MinesweeperGame className="w-full shadow-2xl" />}
                              {activeGameTab === "fastmath" && <FastMathGame className="w-full shadow-2xl" />}
                              {activeGameTab === "tictactoe" && <TicTacToeGame isDarkMode={isDarkMode} className="w-full shadow-2xl" />}
                              {activeGameTab === "snake" && <SnakeGame className="w-full shadow-2xl" />}
                              {activeGameTab === "flappy" && <FlappyBirdGame className="w-full shadow-2xl" />}
                              {activeGameTab === "pingpong" && <PingPongGame className="w-full shadow-2xl" />}
                              {activeGameTab === "memory" && <MemoryMatchGame className="w-full shadow-2xl" />}
                              {activeGameTab === "spaceshooter" && <SpaceShooter className="w-full shadow-2xl" />}
                              {activeGameTab === "dino" && <DinoGame className="w-full shadow-2xl bg-white border border-neutral-200" />}
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </GamesAuthGate>
            </motion.section>

            {/* SECTION 3: KELAJAKDAGI MARRALAR VA MAQSADLAR */}
            <motion.section 
              id="goals" 
              className={`rounded-3xl p-6 sm:p-12 space-y-8 relative overflow-hidden scroll-mt-24 shadow-sm border transition-colors ${
                isDarkMode 
                  ? 'bg-[#121824] border-slate-800/80 text-white' 
                  : 'bg-[#f7f7f9] border-[#e5e5ea] text-black'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Description Column */}
                <div className="lg:col-span-5 space-y-4">
                  <div className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-widest ${
                    isDarkMode ? 'text-amber-400' : 'text-emerald-600'
                  }`}>
                    <Target className="w-4 h-4" /> 03 // MARRALAR VA REJALAR
                  </div>
                  
                  {/* Requested Title */}
                  <h3 className={`font-serif text-3xl md:text-4xl font-extrabold tracking-tight leading-tight ${
                    isDarkMode ? 'text-white' : 'text-black'
                  }`}>
                    Mening keyingi marralarim va maqsadlarim.
                  </h3>

                  {/* Requested Subtitle */}
                  <p className={`text-xs sm:text-sm leading-relaxed font-sans ${
                    isDarkMode ? 'text-slate-300' : 'text-neutral-600'
                  }`}>
                    15 yosh - bu katta yo'lning boshlanishi. Men yaqin kelajakda quyidagi muhim loyihalarni ishga tushirishni va ta'lim tizimini rivojlantirishni maqsad qilganman.
                  </p>
                  <div className={`h-0.5 w-12 mt-2 ${isDarkMode ? 'bg-amber-400' : 'bg-black'}`} />
                </div>

                {/* Right 4 Goal Cards */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className={`p-6 rounded-[28px] space-y-3 transition-all border shadow-sm hover:shadow-xl group ${
                      isDarkMode 
                        ? 'bg-[#1a2233] border-slate-800 hover:border-amber-400 text-white' 
                        : 'bg-white border-[#e5e5ea] hover:border-black text-black'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center font-mono text-xs font-bold shadow-md">1</div>
                    <h4 className={`text-xs uppercase tracking-wider font-bold font-mono ${isDarkMode ? 'text-amber-300' : 'text-black'}`}>{siteConfig.goal1Title}</h4>
                    <p className={`text-xs leading-normal font-sans ${isDarkMode ? 'text-slate-300' : 'text-neutral-600'}`}>
                      {siteConfig.goal1Desc}
                    </p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className={`p-6 rounded-[28px] space-y-3 transition-all border shadow-sm hover:shadow-xl group ${
                      isDarkMode 
                        ? 'bg-[#1a2233] border-slate-800 hover:border-amber-400 text-white' 
                        : 'bg-white border-[#e5e5ea] hover:border-black text-black'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center font-mono text-xs font-bold shadow-md">2</div>
                    <h4 className={`text-xs uppercase tracking-wider font-bold font-mono ${isDarkMode ? 'text-emerald-300' : 'text-black'}`}>{siteConfig.goal2Title}</h4>
                    <p className={`text-xs leading-normal font-sans ${isDarkMode ? 'text-slate-300' : 'text-neutral-600'}`}>
                      {siteConfig.goal2Desc}
                    </p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className={`p-6 rounded-[28px] space-y-3 transition-all border shadow-sm hover:shadow-xl group ${
                      isDarkMode 
                        ? 'bg-[#1a2233] border-slate-800 hover:border-amber-400 text-white' 
                        : 'bg-white border-[#e5e5ea] hover:border-black text-black'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-mono text-xs font-bold shadow-md">3</div>
                    <h4 className={`text-xs uppercase tracking-wider font-bold font-mono ${isDarkMode ? 'text-purple-300' : 'text-black'}`}>{siteConfig.goal3Title}</h4>
                    <p className={`text-xs leading-normal font-sans ${isDarkMode ? 'text-slate-300' : 'text-neutral-600'}`}>
                      {siteConfig.goal3Desc}
                    </p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className={`p-6 rounded-[28px] space-y-3 transition-all border shadow-sm hover:shadow-xl group ${
                      isDarkMode 
                        ? 'bg-[#1a2233] border-slate-800 hover:border-amber-400 text-white' 
                        : 'bg-white border-[#e5e5ea] hover:border-black text-black'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-mono text-xs font-bold shadow-md">4</div>
                    <h4 className={`text-xs uppercase tracking-wider font-bold font-mono ${isDarkMode ? 'text-blue-300' : 'text-black'}`}>{siteConfig.goal4Title}</h4>
                    <p className={`text-xs leading-normal font-sans ${isDarkMode ? 'text-slate-300' : 'text-neutral-600'}`}>
                      {siteConfig.goal4Desc}
                    </p>
                  </motion.div>

                </div>

              </div>
            </motion.section>

            {/* SECTION 6: CONTACT / MENGA BOG'LANING */}
            <motion.section 
              id="contact" 
              className="scroll-mt-24 space-y-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              
              {/* Requested Heading */}
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className={`font-mono text-xs uppercase tracking-widest font-bold ${
                  isDarkMode ? 'text-amber-400' : 'text-neutral-400'
                }`}>
                  04 // MENGA BOG'LANING
                </span>
                <h2 className={`font-serif text-3xl md:text-5xl font-extrabold tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`}>
                  Menga bog'laning.
                </h2>
                <div className={`h-0.5 w-12 mx-auto mt-2 ${isDarkMode ? 'bg-amber-400' : 'bg-black'}`} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* Contact Info Card */}
                <div className="lg:col-span-5 bg-black text-white rounded-[36px] p-8 sm:p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden border border-neutral-800">
                  <div className="space-y-8 z-10">
                    <div className="space-y-3">
                      <h3 className="font-serif text-2xl font-bold">Sizni eshitishdan xursandman</h3>
                      <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                        Yangi loyihalar, takliflar yoki savollaringiz bo'lsa, istalgan vaqtda xabar qoldiring. Men tez fursatda javob qaytaraman.
                      </p>
                    </div>

                    <div className="space-y-4 font-mono text-xs">
                      {/* Email */}
                      <div className="flex items-center gap-4 p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-emerald-500/50 transition-colors">
                        <Mail className="w-5 h-5 text-emerald-400" />
                        <div>
                          <div className="text-[10px] text-neutral-500 uppercase tracking-widest">EMAIL MANZIL</div>
                          <a href={`mailto:${siteConfig.email}`} className="text-white mt-0.5 font-bold hover:text-emerald-400 transition-colors block">
                            {siteConfig.email}
                          </a>
                        </div>
                      </div>

                      {/* Requested Location */}
                      <div className="flex items-center gap-4 p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-emerald-500/50 transition-colors">
                        <MapPin className="w-5 h-5 text-emerald-400" />
                        <div>
                          <div className="text-[10px] text-neutral-500 uppercase tracking-widest">YASHASH JOYI</div>
                          <div className="text-white mt-0.5 font-bold">{siteConfig.location}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-neutral-900 z-10 text-[10px] font-mono text-neutral-500">
                    {siteConfig.name.toUpperCase()} // BARCHA HUQUQLAR HIMOYALANGAN
                  </div>

                </div>

                {/* Form Card */}
                <div className={`lg:col-span-7 rounded-[36px] p-8 sm:p-10 shadow-xl flex flex-col justify-center border transition-colors ${
                  isDarkMode 
                    ? 'bg-[#121824] border-slate-800/80 text-white' 
                    : 'bg-white border-[#e5e5ea] text-black'
                }`}>
                  
                  {formSubmitted ? (
                    <motion.div 
                      id="form-success-alert"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center space-y-4 py-6 font-sans"
                    >
                      <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40 shadow-sm">
                        <Check className="w-8 h-8" />
                      </div>
                      <h3 className={`font-serif text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        Xabaringiz Tayyorlandi!
                      </h3>
                      <div className="p-4 bg-sky-500/10 border border-sky-500/30 rounded-2xl max-w-md mx-auto text-xs font-mono text-sky-400 space-y-1">
                        <div className="font-bold flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-sky-400" />
                          Telegram va Gmail Orqali Yuborish
                        </div>
                        <p className="text-[11px] text-neutral-300 font-sans">
                          Murojaatingiz bevosita Telegram (@mineestaxx) hamda Gmail ({siteConfig.email}) ga yo'naltirildi.
                        </p>
                      </div>
                      
                      <div className="pt-3 flex flex-wrap justify-center gap-3">
                        <a
                          href={`https://t.me/${(siteConfig.telegram || "@mineestaxx").replace("@", "")}?text=${encodeURIComponent(`Assalomu alaykum Anvar! Men portfoliodan yozmoqdaman.\nIsmim: ${formName}\nKontakt: ${formEmail}\n\nXabar: ${formMessage}`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3.5 bg-sky-500 text-white text-xs font-mono font-bold uppercase rounded-xl hover:bg-sky-400 transition-colors shadow-lg"
                        >
                          <Send className="w-4 h-4 text-white" /> Telegram Orqali Yuborish (@mineestaxx)
                        </a>
                        <a
                          href={`mailto:${siteConfig.email}?subject=Portfolio%20Murojaat%20(${encodeURIComponent(formName)})&body=${encodeURIComponent(`Ism: ${formName}\nKontakt: ${formEmail}\n\nXabar:\n${formMessage}`)}`}
                          className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-500 text-black text-xs font-mono font-bold uppercase rounded-xl hover:bg-amber-400 transition-colors shadow-lg"
                        >
                          <Mail className="w-4 h-4 text-black" /> Gmail Orqali Yuborish ({siteConfig.email})
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            setFormSubmitted(false);
                            setFormName("");
                            setFormEmail("");
                            setFormMessage("");
                          }}
                          className="px-5 py-3.5 bg-neutral-800 text-neutral-300 text-xs font-mono rounded-xl hover:bg-neutral-700 transition-colors"
                        >
                          Yangi Xabar Yozish
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-5 font-sans">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className={`text-[10px] font-mono uppercase tracking-widest font-bold ${
                            isDarkMode ? 'text-slate-400' : 'text-neutral-500'
                          }`}>
                            Ism Familyangiz *
                          </label>
                          <input
                            type="text"
                            required
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            placeholder="Masalan: Abdullayev Temur"
                            className={`w-full border rounded-xl px-4 py-3 text-xs focus:outline-none transition-colors ${
                              isDarkMode 
                                ? 'bg-[#1a2233] border-slate-700 text-white focus:border-amber-400 placeholder:text-slate-500' 
                                : 'bg-neutral-50 border-[#e5e5ea] text-black focus:border-black'
                            }`}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className={`text-[10px] font-mono uppercase tracking-widest font-bold ${
                            isDarkMode ? 'text-slate-400' : 'text-neutral-500'
                          }`}>
                            Email yoki Telefon Raqamingiz
                          </label>
                          <input
                            type="text"
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value)}
                            placeholder="Masalan: +998901234567 yoki email@gmail.com"
                            className={`w-full border rounded-xl px-4 py-3 text-xs focus:outline-none transition-colors ${
                              isDarkMode 
                                ? 'bg-[#1a2233] border-slate-700 text-white focus:border-amber-400 placeholder:text-slate-500' 
                                : 'bg-neutral-50 border-[#e5e5ea] text-black focus:border-black'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className={`text-[10px] font-mono uppercase tracking-widest font-bold ${
                          isDarkMode ? 'text-slate-400' : 'text-neutral-500'
                        }`}>
                          Xabaringiz Matni
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={formMessage}
                          onChange={(e) => setFormMessage(e.target.value)}
                          placeholder="Menga taklif yoki loyihangiz haqida yozing..."
                          className={`w-full border rounded-xl p-4 text-xs focus:outline-none transition-colors ${
                            isDarkMode 
                              ? 'bg-[#1a2233] border-slate-700 text-white focus:border-amber-400 placeholder:text-slate-500' 
                              : 'bg-neutral-50 border-[#e5e5ea] text-black focus:border-black'
                          }`}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={formSending}
                        className={`w-full py-4 rounded-xl font-mono text-xs uppercase font-extrabold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                          isDarkMode 
                            ? 'bg-amber-400 text-black hover:bg-amber-300 shadow-amber-400/10' 
                            : 'bg-black text-white hover:bg-neutral-800'
                        }`}
                      >
                        {formSending ? (
                          <span>YETKAZILMOQDA...</span>
                        ) : (
                          <>
                            <Send className="w-4 h-4 text-emerald-400" />
                            XABARNI 100% YUBORISH (SMS VA EMAIL)
                          </>
                        )}
                      </button>

                    </form>
                  )}

                </div>

              </div>
            </motion.section>

          </main>

          {/* Floating Scroll-To-Top Button */}
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setActiveTab("home");
                  smoothScrollTo(0, 1200);
                }}
                className={`fixed bottom-6 right-6 z-40 p-3.5 rounded-full shadow-2xl transition-all cursor-pointer border group ${
                  isDarkMode 
                    ? 'bg-amber-400 text-black border-amber-300 hover:bg-amber-300' 
                    : 'bg-black text-white border-neutral-700 hover:bg-neutral-800'
                }`}
                title="Tepaga qaytish"
              >
                <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* SYSTEM FOOTER */}
          <footer className={`border-t mt-24 py-10 text-center text-xs font-mono transition-colors ${
            isDarkMode 
              ? 'bg-[#080a12] border-slate-800/80 text-slate-400' 
              : 'bg-white border-[#e5e5ea] text-neutral-400'
          }`}>
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                {siteConfig.name.toUpperCase()} // PORTFOLIO ({siteConfig.age.toUpperCase()})
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase">{siteConfig.location}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] uppercase">{siteConfig.email}</span>
              </div>
            </div>
          </footer>

          {/* Global High Score Confetti & New Record Celebration */}
          <Confetti />

          {/* Player Account Modal Overlay */}
          <PlayerAccountModal
            isOpen={showPlayerAccountModal}
            onClose={() => setShowPlayerAccountModal(false)}
            isDarkMode={isDarkMode}
            onOpenAdminPanel={() => setShowAdminModal(true)}
          />

          {/* Admin Panel Modal Overlay */}
          <AdminPanelModal
            isOpen={showAdminModal}
            isLoggedIn={isAdminLoggedIn}
            onClose={() => setShowAdminModal(false)}
            onLoginSuccess={handleAdminLoginSuccess}
            onLogout={handleAdminLogout}
            siteConfig={siteConfig}
            onSaveConfig={handleSaveConfig}
          />

        </motion.div>
      )}

    </div>
  );
}
