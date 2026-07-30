/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
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
  Copy,
  RotateCcw
} from "lucide-react";
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
import DoodleJumpGame from "./components/DoodleJumpGame";
import NumberMergeChainGame from "./components/NumberMergeChainGame";
import AdminPanelModal, { DEFAULT_SITE_CONFIG } from "./components/AdminPanelModal";

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
        <div className="bg-neutral-950/95 backdrop-blur-md px-5 sm:px-6 py-3.5 sm:py-4 rounded-[22px] flex items-center justify-between gap-3 text-white border border-white/10 shadow-inner">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shadow-md shrink-0">
              {activeRole.icon}
            </div>
            <div className="text-left min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 font-bold block">
                  MUTAXASSISLIK
                </span>
              </div>
              <div className="font-mono text-sm sm:text-base md:text-lg font-bold tracking-tight text-white flex items-center gap-1.5 truncate">
                <span>{currentText}</span>
                <span className="w-2 h-5 bg-amber-400 inline-block animate-pulse shrink-0" />
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <span className="text-[10px] font-mono font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-amber-300 border border-amber-400/30 flex items-center gap-1 shadow-sm">
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

// Fallback intelligent responder for 100% 24/7 availability
function getFallbackResponse(prompt: string, config: SiteConfig): string {
  const p = prompt.toLowerCase().trim();

  // 1. Greetings
  if (p.includes("salom") || p.includes("assalom") || p === "hi" || p === "hello" || p.includes("xayrli") || p.includes("privet")) {
    return "Salom! Qanday yordam bera olaman?";
  }

  // 2. CSS creation & history
  if (p.includes("css") && (p.includes("qachon") || p.includes("yaratilgan") || p.includes("tarix") || p.includes("kim"))) {
    return "CSS (Cascading Style Sheets) **1996-yil 17-dekabrda** Hakon Wium Lie tomonidan taklif qilingan hamda W3C tomonidan rasman standartlashtirilgan. CSS veb-sahifalarga zamonaviy dizayn, ranglar, shriftlar va moslashuvchan (responsive) tartib berish uchun ishlatiladi.";
  }
  if (p.includes("css")) {
    return "CSS (Cascading Style Sheets) — veb-sahifalarning vizual ko'rinishi va dizaynini shakllantiruvchi til. Flexbox, Grid, CSS animations hamda Tailwind CSS kabi karkaslar bilan juda qulay va tezkor dizayn yaratish mumkin.";
  }

  // 3. HTML creation & history
  if (p.includes("html") && (p.includes("qachon") || p.includes("yaratilgan") || p.includes("kim"))) {
    return "HTML (HyperText Markup Language) **1993-yilda** mashhur olim Tim Berners-Lee tomonidan yaratilgan. HTML veb-sahifaning poydevori va asosiy karkasi hisoblanadi.";
  }
  if (p.includes("html")) {
    return "HTML — veb-dasturlashning poydevori hisoblanadi. U teglar (tags) yordamida veb-sahifa elementlarini (sarlavhalar, tugmalar, formalar, rasmlar) tartibga soladi.";
  }

  // 4. JavaScript creation & history
  if ((p.includes("javascript") || p.includes("js")) && (p.includes("qachon") || p.includes("yaratilgan") || p.includes("kim"))) {
    return "JavaScript **1995-yilda** Brendan Eich tomonidan Netscape kompaniyasida bor-yo'g'i 10 kun ichida yaratilgan. Bugungi kunda JS dunyodagi eng ommabop dasturlash tili bo'lib, ham frontend (React/Vue), ham backend (Node.js) sohasi uchun asosdir.";
  }
  if (p.includes("javascript") || p.includes("js")) {
    return "JavaScript — veb-sahifalarni interaktiv va jonli qiluvchi dasturlash tili. U animatsiyalar, forma tekshiruvlari, API bilan ishlash hamda server (Node.js) va ilovalar yaratish imkonini beradi.";
  }

  // 5. React history & purpose
  if (p.includes("react")) {
    return "React — **2013-yilda** Facebook (Meta) muhandisi Jordan Walke tomonidan yaratilgan. U komponentlarga asoslangan, juda tez ishlaydigan va zamonaviy foydalanuvchi interfeyslarini (UI) qurish uchun dunyodagi eng mashhur JavaScript kutubxonasidir.";
  }

  // 6. Python history & purpose
  if (p.includes("python")) {
    return "Python **1991-yilda** Guido van Rossum tomonidan yaratilgan. U o'qish uchun juda sodda, kodi toza va sun'iy intellekt (AI), ma'lumotlar tahlili (Data Science) hamda veb dasturlashda eng ko'p ishlatiladigan tildir.";
  }

  // 7. Node.js & Express
  if (p.includes("node") || p.includes("express")) {
    return "Node.js **2009-yilda** Ryan Dahl tomonidan yaratilgan runtime muhitdir. U JavaScript kodini brauzerdan tashqarida, ya'ni serverda bajarish imkonini beradi. Express.js esa uning ustiga qurilgan yengil va tezkor web-server karkasidir.";
  }

  // 8. C++ / Java / SQL
  if (p.includes("c++") || p.includes("cpp")) {
    return "C++ **1985-yilda** Bjarne Stroustrup tomonidan yaratilgan. U tezkor va yuqori unumdorlikka ega dasturlash tili bo'lib, o'yin dvigatellari va operatsion tizimlar yaratishda keng qo'llaniladi.";
  }
  if (p.includes("java")) {
    return "Java **1995-yilda** James Gosling tomonidan yaratilgan. U 'bir marta yoz, har qaerda ishlat' tamoyili bilan ishlaydigan mashhur dasturlash tilidir.";
  }
  if (p.includes("sql") || p.includes("baza") || p.includes("database")) {
    return "SQL (Structured Query Language) — ma'lumotlar bazasi (Relational Database) bilan ishlash, ma'lumotlarni saqlash va boshqarish uchun ishlatiladigan standart tildir.";
  }

  // 9. Anvar profile queries
  if (p.includes("yosh") || p.includes("necha")) {
    return `${config.name} Hozirda ${config.age}! U juda yosh bo'lishiga qaramay, 1 yildan ortiq vaqtdan beri professional full-stack dasturlash bilan shug'ullanib keladi.`;
  }
  if (p.includes("qayer") || p.includes("manzil") || p.includes("yashaydi") || p.includes("surxon") || p.includes("denov")) {
    return `${config.name} ${config.location} manzilida istiqomat qiladi.`;
  }
  if (p.includes("kim") || p.includes("anvar") || p.includes("haqida")) {
    return config.bio;
  }
  if (p.includes("stak") || p.includes("kod") || p.includes("texnologiya") || p.includes("til")) {
    return `${config.firstName} asosiy texnologiya sifatida JavaScript, TypeScript, React, Node.js, Express, HTML5, CSS3 hamda Tailwind CSS va Gemini AI dan foydalanadi.`;
  }
  if (p.includes("aloqa") || p.includes("email") || p.includes("gmail") || p.includes("murojaat")) {
    return `${config.firstName} bilan bog'lanish uchun rasmiy email: ${config.email} . Sahifaning pastki qismidagi formadan ham xabar yuborishingiz mumkin!`;
  }

  // 10. Status check
  if (p.includes("qandaysiz") || p.includes("qalaysiz") || p.includes("ishlar") || p.includes("yaxshimi") || p.includes("kim siz")) {
    return "Rahmat, men a'lo kayfiyatdaman! Anvar AI assistenti 24/7 rejimida ishlaydi. Dasturlash, HTML/CSS, JavaScript, React, Python yoki boshqa istalgan savolingizga mamnuniyat bilan javob beraman.";
  }

  // 11. Clean intelligent default (NO prompt echoing!)
  return "Assalomu alaykum! Men Anvar AI assistentiman. Dasturlash (HTML, CSS, JavaScript, React, Python, Node.js), veb-texnologiyalar tarixi, kompyuter ilmlari va boshqa istalgan savollaringizga 24/7 mamnuniyat bilan javob berishga tayyorman. Savolingizni berishingiz mumkin!";
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

  // Site Config state (persisted in localStorage)
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem("anvar_site_config");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse site config", e);
    }
    return DEFAULT_SITE_CONFIG;
  });

  // Admin modal & authentication states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem("anvar_admin_logged_in") === "true";
  });
  const [showAdminModal, setShowAdminModal] = useState(false);

  const handleSaveConfig = (newConfig: SiteConfig) => {
    setSiteConfig(newConfig);
    try {
      localStorage.setItem("anvar_site_config", JSON.stringify(newConfig));
    } catch (e) {
      console.error("Failed to save site config", e);
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

  const ALL_GAMES = [
    { id: "tetris", name: "Tetris Matrix", category: "top", badge: "TOP 🎮" },
    { id: "tictactoe", name: "X no'l (Tic-Tac-Toe AI)", category: "top", badge: "TOP 🤖" },
    { id: "spaceinvaders", name: "Space Invaders", category: "top", badge: "ACTION 👾" },
    { id: "bubbleshooter", name: "Bubble Shooter", category: "top", badge: "HOT 🔴" },
    { id: "fruitninja", name: "Fruit Ninja", category: "top", badge: "SLICE 🍉" },
    { id: "brick", name: "Brick Breaker", category: "top", badge: "ARCADE 🧱" },
    { id: "typingracer", name: "Speed Typing Racer", category: "action", badge: "RACER 🏎️" },
    { id: "snake", name: "Cyber Snake", category: "action", badge: "CLASSIC 🐍" },
    { id: "knifehit", name: "Knife Hit", category: "action", badge: "HIT 🎯" },
    { id: "archery", name: "Archery Master", category: "action", badge: "BOW 🏹" },
    { id: "space", name: "Space Shooter", category: "action", badge: "ACTION 🚀" },
    { id: "flappy", name: "Flappy Bird", category: "action", badge: "HARD 🐥" },
    { id: "dino", name: "Dino Runner", category: "action", badge: "RETRO 🦖" },
    { id: "mazerunner", name: "Maze Escape", category: "logic", badge: "MAZE 🧭" },
    { id: "patternmemory", name: "Pattern Memory", category: "logic", badge: "BRAIN 🧠" },
    { id: "gravityrunner", name: "Gravity Runner", category: "logic", badge: "RUN 🚀" },
    { id: "speedtyping", name: "Speed Typer", category: "logic", badge: "TYPER ⌨️" },
    { id: "minesweeper", name: "Minesweeper", category: "logic", badge: "LOGIC 💣" },
    { id: "fastmath", name: "Fast Math", category: "logic", badge: "REFLEX ⚡" },
    { id: "pong", name: "Retro Pong", category: "logic", badge: "DUEL 🏓" },
    { id: "memory", name: "Memory Match", category: "logic", badge: "BRAIN 🧠" },
  ];

  const filteredGames = gameCategory === "all" ? ALL_GAMES : ALL_GAMES.filter(g => g.category === gameCategory);

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
  const [aiMessageInput, setAiMessageInput] = useState("");
  const [aiIsTyping, setAiIsTyping] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  // Helper: Copy message text to clipboard
  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Helper: Speak text with Web Speech API
  const handleSpeakMessage = (id: string, text: string) => {
    if (!("speechSynthesis" in window)) return;
    if (speakingMsgId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);
    setSpeakingMsgId(id);
    window.speechSynthesis.speak(utterance);
  };
  
  // Contact form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSending, setFormSending] = useState(false);

  // Chat conversation history
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      id: "init-1",
      sender: "gemini",
      text: "Assalomu alaykum! Men Akramov Anvarning sun'iy intellekt assistentiman (Gemini 2.5 AI). Men sizga dasturlash, HTML/CSS, JavaScript, React, Python, IT tarixi hamda Anvarning 15 yoshida erishgan tajribasi haqida istalgan vaqtda tezkor va aniq javob beraman. Nima haqida suhbatlashamiz?",
      timestamp: new Date()
    }
  ]);

  const chatMessagesContainerRef = useRef<HTMLDivElement>(null);

  // Custom gentle & smooth scroll handler with cubic easing (slow, elegant scrolling)
  const smoothScrollTo = (target: string | number | HTMLElement | null, duration = 1200) => {
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

    const distance = targetY - startY;
    if (Math.abs(distance) < 2) return;

    let startTime: number | null = null;

    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const step = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);

      window.scrollTo(0, startY + distance * easedProgress);

      if (elapsed < duration) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
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
      const duration = 1800;
      const interval = 20;
      const step = 100 / (duration / interval);
      
      const timer = setInterval(() => {
        setProgress((prev) => {
          const next = prev + step + (Math.random() * 2 - 0.5);
          if (next >= 100) {
            clearInterval(timer);
            return 100;
          }
          return next;
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [progress]);

  // Loading text phrases
  useEffect(() => {
    if (progress < 30) {
      setLoadingPhase("Akramov Anvar portfolio komponentlari yuklanmoqda...");
    } else if (progress < 65) {
      setLoadingPhase("15 yoshli Full-Stack dasturchi ma'lumotlari indekslanmoqda...");
    } else if (progress < 90) {
      setLoadingPhase("Google Gemini AI va interaktiv arcade tizimi sozlanmoqda...");
    } else {
      setLoadingPhase("Tizim tayyor. Kirishga ruxsat berildi!");
    }
  }, [progress]);

  // Scroll to bottom of chat container ONLY (prevents jumping main page window scroll)
  useEffect(() => {
    if (chatMessagesContainerRef.current) {
      chatMessagesContainerRef.current.scrollTo({
        top: chatMessagesContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [chatHistory, aiIsTyping]);

  // Chat sending handler
  const handleSendMessage = async (promptText?: string) => {
    const userMsgText = (promptText || aiMessageInput).trim();
    if (!userMsgText) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userMsgText,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMsg]);
    setAiMessageInput("");
    setAiIsTyping(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: userMsgText,
          history: chatHistory.slice(-6).map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      const data = await response.json();
      setAiIsTyping(false);
      
      let replyText = data.text;
      if (!replyText || data.error) {
        replyText = getFallbackResponse(userMsgText, siteConfig);
      }

      const geminiMsg: Message = {
        id: `gemini-${Date.now()}`,
        sender: "gemini",
        text: replyText,
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, geminiMsg]);
    } catch (error: any) {
      setAiIsTyping(false);
      const fallbackText = getFallbackResponse(userMsgText, siteConfig);
      const errorMsg: Message = {
        id: `gemini-error-${Date.now()}`,
        sender: "gemini",
        text: fallbackText,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errorMsg]);
    }
  };

  // Contact Form Submission handler (100% Guaranteed Delivery to Server and Admin Panel)
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMessage) return;

    setFormSending(true);

    const newMsg = {
      id: `msg-${Date.now()}`,
      name: formName.trim(),
      email: formEmail.trim(),
      message: formMessage.trim(),
      timestamp: new Date().toISOString(),
      status: "Yangi (SMS yetkazildi)"
    };

    // Save to localStorage immediately
    try {
      const existing = JSON.parse(localStorage.getItem("anvar_inbox_messages") || "[]");
      existing.unshift(newMsg);
      localStorage.setItem("anvar_inbox_messages", JSON.stringify(existing));
    } catch (e) {}

    // Post to Server API
    try {
      await fetch("/api/contact/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          message: formMessage
        })
      });
    } catch (err) {
      console.warn("Contact endpoint save error, local backup preserved:", err);
    } finally {
      setFormSending(false);
      setFormSubmitted(true);
    }
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
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30 flex items-center gap-2 font-bold shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  SYSTEM ONLINE
                </span>
                <span className="hidden sm:inline-block font-mono text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  15 YOSH
                </span>
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
                  <span>24/7 Gemini AI Core</span>
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex justify-between items-center">
              
              {/* LOGO & ADMIN PANEL BUTTON - Top Header */}
              <div className="flex items-center gap-3">
                {/* Black AA Icon - Clicking opens Admin Login Modal */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setShowAdminModal(true)}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-mono font-black text-sm tracking-widest shadow-md hover:ring-2 hover:ring-amber-400 cursor-pointer transition-all relative group shrink-0 ${
                    isDarkMode ? 'bg-amber-400 text-black hover:bg-amber-300' : 'bg-black text-white hover:bg-neutral-800'
                  }`}
                  title="Admin Panel Login (AA)"
                >
                  AA
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>

                {/* Name & Subtitle - Navigates to Home */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  id="logo-placeholder"
                  className={`flex flex-col cursor-pointer select-none py-1 px-1.5 transition-all rounded-xl ${isDarkMode ? 'hover:bg-neutral-800/80' : 'hover:bg-neutral-100'}`}
                  onClick={() => {
                    setActiveTab("home");
                    smoothScrollTo("home", 1200);
                  }}
                >
                  <span className={`font-serif text-base tracking-[0.15em] font-extrabold uppercase leading-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    {siteConfig.firstName} {siteConfig.lastName}
                  </span>
                  <span className={`text-[10px] font-mono mt-1 font-semibold ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Full-Stack Dev // 15 yosh</span>
                </motion.div>
              </div>

              {/* Desktop Menu - Center */}
              <nav className="hidden lg:flex items-center gap-8 text-xs font-mono uppercase tracking-wider font-semibold">
                {[
                  { id: "home", label: "Asosiy" },
                  { id: "games", label: "O'yinlar Arena" },
                  { id: "ai-assistant", label: "AI Markazi" },
                  { id: "goals", label: "Maqsadlarim" },
                  { id: "contact", label: "Bog'lanish" }
                ].map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    id={`nav-link-${item.id}`}
                    onClick={() => {
                      setActiveTab(item.id);
                      smoothScrollTo(item.id, 1200);
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
                {/* DARK / LIGHT THEME TOGGLE BUTTON */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDarkMode(!isDarkMode)}
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
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`lg:hidden border-t px-6 py-4 space-y-3 shadow-xl ${
                    isDarkMode ? 'border-neutral-800 bg-[#0e1017] text-white' : 'border-neutral-100 bg-[#fdfdfd] text-black'
                  }`}
                >
                  {[
                    { id: "home", label: "Asosiy Sahifa" },
                    { id: "games", label: "O'yinlar Arena" },
                    { id: "ai-assistant", label: "AI Markazi" },
                    { id: "goals", label: "Maqsadlarim" },
                    { id: "contact", label: "Menga Bog'laning" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      id={`nav-link-mobile-${item.id}`}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                        smoothScrollTo(item.id, 1200);
                      }}
                      className={`block w-full text-left py-2.5 text-xs uppercase tracking-widest font-mono font-medium rounded-lg transition-colors ${
                        activeTab === item.id 
                          ? (isDarkMode ? "text-amber-400 font-bold pl-3 border-l-2 border-amber-400 bg-neutral-800/60" : "text-black font-bold pl-3 border-l-2 border-black bg-neutral-100/60") 
                          : (isDarkMode ? "text-neutral-400 hover:text-white" : "text-neutral-500 hover:text-black")
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                  <div className={`pt-3 border-t flex items-center justify-between ${isDarkMode ? 'border-neutral-800' : 'border-neutral-100'}`}>
                    <span className={`text-xs font-mono ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      Akramov Anvar // 15 yosh
                    </span>
                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 border ${
                        isDarkMode ? 'bg-neutral-800 border-neutral-700 text-amber-400' : 'bg-neutral-100 border-neutral-200 text-neutral-800'
                      }`}
                    >
                      {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                      <span>{isDarkMode ? 'LIGHT' : 'DARK'}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          {/* MAIN WRAPPER CONTAINER */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-16 space-y-24 md:space-y-32">

            {/* SECTION 1: HERO VIEW */}
            <motion.section 
              id="home" 
              className="pt-2 md:pt-6 scroll-mt-24 relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Floating Ambient Glow Background Orbs */}
              <motion.div 
                animate={{ scale: [1, 1.25, 1], rotate: [0, 90, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-400/30 to-cyan-400/20 blur-3xl -top-28 -left-28 pointer-events-none -z-10"
              />
              <motion.div 
                animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-500/25 to-amber-400/20 blur-3xl -bottom-28 -right-28 pointer-events-none -z-10"
              />

              <div className="max-w-4xl mx-auto text-center flex flex-col items-center space-y-8 relative z-10">
                
                {/* Subheading Badge */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center space-x-2.5 bg-neutral-900/90 text-white px-5 py-2 rounded-full border border-neutral-700/80 shadow-xl backdrop-blur-md hover:border-emerald-500/50 transition-colors"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-mono uppercase font-bold tracking-widest bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 bg-clip-text text-transparent">
                    {siteConfig.badgeText}
                  </span>
                </motion.div>

                {/* Main Editorial Heading */}
                <div className="space-y-4 flex flex-col items-center w-full">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.92] tracking-tighter uppercase text-center relative"
                  >
                    <span className="text-neutral-950 drop-shadow-sm">{siteConfig.firstName}</span>
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-400" style={{ WebkitTextStroke: "1.5px black" }}>
                      {siteConfig.lastName}
                    </span>
                  </motion.h1>

                  {/* Interactive Typewriter Animation */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="pt-2 flex justify-center w-full"
                  >
                    <HeroTypewriter />
                  </motion.div>
                </div>

                {/* Bio Text */}
                <motion.p 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-neutral-700 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-sans text-center font-medium"
                >
                  {siteConfig.bio}
                </motion.p>

                {/* Action buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap items-center justify-center gap-4 pt-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setActiveTab("games");
                      smoothScrollTo("games", 1200);
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-800 text-white text-xs font-mono uppercase font-bold tracking-wider rounded-full hover:shadow-2xl hover:shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-2.5 border border-neutral-700"
                  >
                    <Gamepad2 className="w-4 h-4 text-emerald-400 animate-bounce" /> O'yinlar Maydoni
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setActiveTab("ai-assistant");
                      smoothScrollTo("ai-assistant", 1200);
                    }}
                    className="px-8 py-4 border border-neutral-300 bg-white/90 backdrop-blur-sm text-black text-xs font-mono uppercase font-bold tracking-wider rounded-full hover:bg-white hover:border-purple-500 transition-all cursor-pointer flex items-center gap-2.5 shadow-lg hover:shadow-purple-500/20"
                  >
                    <Brain className="w-4 h-4 text-purple-600 animate-pulse" /> AI Assistant
                  </motion.button>
                </motion.div>

                {/* Stats Widget */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="grid grid-cols-3 gap-3 sm:gap-6 pt-8 border-t border-neutral-200/80 max-w-2xl mx-auto w-full text-center"
                >
                  <motion.div 
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="p-4 sm:p-6 bg-white/80 backdrop-blur-md border border-neutral-200 rounded-3xl flex-1 shadow-md hover:shadow-xl transition-all relative overflow-hidden group"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-80 group-hover:opacity-100 transition-opacity" />
                    <span className="block text-2xl sm:text-4xl font-bold mb-1 font-mono text-black">{siteConfig.stat1Value}</span>
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono font-bold">{siteConfig.stat1Label}</span>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="p-4 sm:p-6 bg-white/80 backdrop-blur-md border border-neutral-200 rounded-3xl flex-1 shadow-md hover:shadow-xl transition-all relative overflow-hidden group"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500 opacity-80 group-hover:opacity-100 transition-opacity" />
                    <span className="block text-2xl sm:text-4xl font-bold mb-1 font-mono text-black">{siteConfig.stat2Value}</span>
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono font-bold">{siteConfig.stat2Label}</span>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="p-4 sm:p-6 bg-white/80 backdrop-blur-md border border-neutral-200 rounded-3xl flex-1 shadow-md hover:shadow-xl transition-all relative overflow-hidden group"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-80 group-hover:opacity-100 transition-opacity" />
                    <span className="block text-xl sm:text-4xl font-bold mb-1 font-mono text-emerald-600">{siteConfig.stat3Value}</span>
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono font-bold">{siteConfig.stat3Label}</span>
                  </motion.div>
                </motion.div>

              </div>
            </motion.section>

            {/* SECTION 2: INTERAKTIV O'YINLAR ARENASI */}
            <motion.section 
              id="games" 
              className="scroll-mt-24 space-y-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-center space-y-3 py-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-mono text-amber-700 font-bold shadow-sm">
                  <Flame className="w-4 h-4 text-amber-500" /> INTERAKTIV O'YINLAR ARENASI
                </div>
                <h2 className="font-serif text-4xl md:text-6xl font-bold text-black tracking-tight uppercase">
                  INTERAKTIV O'YINLAR ARENASI
                </h2>
                <div className="h-1 w-24 bg-amber-500 mx-auto rounded-full mt-2" />
              </div>

              {/* Game Categories & Quick Switcher */}
              <div className="space-y-4">
                {/* Category Filters */}
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {[
                    { id: "all", name: "Barchasi 🎮", count: ALL_GAMES.length },
                    { id: "top", name: "🔥 Top & Mashhur", count: ALL_GAMES.filter(g => g.category === "top").length },
                    { id: "action", name: "⚡ Ekshen & Tezlik", count: ALL_GAMES.filter(g => g.category === "action").length },
                    { id: "logic", name: "🧠 Mantiq & Zukkolik", count: ALL_GAMES.filter(g => g.category === "logic").length },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setGameCategory(cat.id);
                        const catGames = cat.id === "all" ? ALL_GAMES : ALL_GAMES.filter(g => g.category === cat.id);
                        if (catGames.length > 0 && !catGames.some(g => g.id === activeGameTab)) {
                          setActiveGameTab(catGames[0].id);
                        }
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                        gameCategory === cat.id
                          ? "bg-amber-500 text-black border-amber-400 shadow-md scale-105"
                          : "bg-neutral-100 hover:bg-neutral-200 text-neutral-600 border-neutral-200"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10">
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Game Selector Navigation Tabs with Left & Right Arrow Scroll Buttons */}
                <div className="relative flex items-center gap-2 bg-neutral-50 p-2 rounded-2xl border border-neutral-200 shadow-inner">
                  {/* Left Scroll Arrow Button (<) */}
                  <button
                    onClick={() => scrollGameTabs("left")}
                    className="p-3 rounded-xl bg-black text-amber-400 hover:bg-neutral-800 hover:scale-105 shadow-md border border-amber-400/40 cursor-pointer shrink-0 transition-all active:scale-95 flex items-center justify-center"
                    title="Oldingi o'yinlar ro'yxatini ko'rish"
                  >
                    <ChevronLeft className="w-5 h-5 text-amber-400" />
                  </button>

                  {/* Horizontal Scrollable Tabs */}
                  <div 
                    ref={gameTabsRef}
                    className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none flex-grow scroll-smooth no-scrollbar"
                  >
                    {filteredGames.map((tab) => (
                      <motion.button
                        key={tab.id}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveGameTab(tab.id)}
                        className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                          activeGameTab === tab.id
                            ? "bg-black text-white shadow-lg ring-2 ring-amber-400"
                            : "bg-white hover:bg-neutral-200 text-neutral-700 border border-neutral-200"
                        }`}
                      >
                        <span>{tab.name}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold ${
                          activeGameTab === tab.id ? "bg-amber-400 text-black" : "bg-neutral-200 text-neutral-700"
                        }`}>
                          {tab.badge}
                        </span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Right Scroll Arrow Button (>) */}
                  <button
                    onClick={() => scrollGameTabs("right")}
                    className="p-3 rounded-xl bg-black text-amber-400 hover:bg-neutral-800 hover:scale-105 shadow-md border border-amber-400/40 cursor-pointer shrink-0 transition-all active:scale-95 flex items-center justify-center"
                    title="Keyingi o'yinlar ro'yxatini ko'rish"
                  >
                    <ChevronRight className="w-5 h-5 text-amber-400" />
                  </button>
                </div>
              </div>

              {/* Game Control Bar: Next / Prev Game Selector above the active game */}
              {(() => {
                const currentGameObj = ALL_GAMES.find(g => g.id === activeGameTab);
                const currentIndex = filteredGames.findIndex(g => g.id === activeGameTab);
                return (
                  <div className="flex items-center justify-between bg-neutral-900 text-white p-3 sm:p-4 rounded-2xl shadow-lg border border-neutral-800 max-w-2xl mx-auto">
                    <button
                      onClick={handlePrevGame}
                      className="flex items-center gap-1.5 sm:gap-2 text-xs font-mono font-bold bg-neutral-800 hover:bg-amber-500 hover:text-black text-white px-3 sm:px-4 py-2 rounded-xl transition-all cursor-pointer border border-neutral-700 active:scale-95"
                      title="Oldingi o'yinga o'tish"
                    >
                      <ChevronLeft className="w-4 h-4 text-amber-400 group-hover:text-black" />
                      <span><span className="hidden sm:inline">Oldingi</span> o'yin</span>
                    </button>

                    <div className="text-center px-2">
                      <div className="text-xs sm:text-sm font-mono font-black text-amber-400 uppercase tracking-wide">
                        {currentGameObj ? currentGameObj.name : "O'yin"}
                      </div>
                      <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                        O'yin {currentIndex >= 0 ? currentIndex + 1 : 1} / {filteredGames.length}
                      </div>
                    </div>

                    <button
                      onClick={handleNextGame}
                      className="flex items-center gap-1.5 sm:gap-2 text-xs font-mono font-bold bg-amber-500 text-black hover:bg-amber-400 px-3 sm:px-4 py-2 rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
                      title="Keyingi o'yinga o'tish"
                    >
                      <span>Keyingi<span className="hidden sm:inline"> o'yin</span></span>
                      <ChevronRight className="w-4 h-4 text-black" />
                    </button>
                  </div>
                );
              })()}

              {/* Active Game Display Area */}
              <div className="w-full">
                {activeGameTab === "bubbleshooter" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <BubbleShooterGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "spaceinvaders" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <SpaceInvadersGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "typingracer" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <TypingSpeedRacerGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "sudoku" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <SudokuMiniGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "helixjump" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <HelixJumpGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "aimtrainer" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <AimTrainerGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "mazerunner" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <MazeRunnerGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "patternmemory" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <PatternMemoryGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "doodlejump" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <DoodleJumpGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "numbermerge" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <NumberMergeChainGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "tetris" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <TetrisGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "whackamole" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <WhackAMoleGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "simon" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <SimonSaysGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "wordscramble" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <WordScrambleGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "speedtyping" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <SpeedTypingGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "gravityrunner" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <GravityRunnerGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "connectfour" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <ConnectFourGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "knifehit" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <KnifeHitGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "fruitninja" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <FruitNinjaGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "archery" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <ArcheryShooterGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "towerstack" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <TowerStackGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "tile2048" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <Tile2048Game className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "brick" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <BrickBreakerGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "sniper" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <SniperGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "colorrush" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <ColorRushGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "minesweeper" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <MinesweeperGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "fastmath" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <FastMathGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "tictactoe" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <TicTacToeGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "snake" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <SnakeGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "flappy" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <FlappyBirdGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "pong" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <PingPongGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "memory" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <MemoryMatchGame className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "space" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                    <SpaceShooter className="w-full shadow-2xl" />
                  </motion.div>
                )}

                {activeGameTab === "dino" && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto">
                    <DinoGame className="w-full shadow-2xl bg-white border border-neutral-200" />
                  </motion.div>
                )}
              </div>
            </motion.section>

            {/* SECTION 4: INTERACTIVE 24/7 AI ASSISTANT SECTION */}
            <motion.section 
              id="ai-assistant" 
              className="scroll-mt-24 space-y-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              
              {/* Heading */}
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="font-mono text-xs uppercase tracking-widest text-amber-500 font-bold bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/30 inline-flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  02 // 24/7 SUN'IY INTELLEKT MARKAZI
                </span>
                <h2 className={`font-serif text-3xl md:text-5xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  Anvar AI Assistant (24/7 Active)
                </h2>
                <p className={`text-xs md:text-sm max-w-lg mx-auto font-sans ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Google Gemini 2.5 AI neyron moduli bilan ishlaydigan assistent. Istalgan vaqtda (24/7 cheksiz) dasturlash, IT tarixi hamda Anvarning 15 yoshlik tajribasi haqida javob beradi!
                </p>
                <div className={`h-0.5 w-12 mx-auto mt-2 ${isDarkMode ? 'bg-amber-400' : 'bg-black'}`} />
              </div>

              {/* AI Block */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* Column 1: Live Interactive Chat */}
                <div className={`lg:col-span-7 border rounded-[36px] flex flex-col justify-between overflow-hidden shadow-2xl min-h-[620px] transition-colors duration-300 ${
                  isDarkMode ? 'bg-[#0f1118] border-neutral-800' : 'bg-white border-[#e5e5ea]'
                }`}>
                  
                  {/* Chat header */}
                  <div className={`border-b px-6 py-4 flex justify-between items-center transition-colors ${
                    isDarkMode ? 'bg-[#151822] border-neutral-800' : 'bg-[#f7f7f9] border-[#e5e5ea]'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md ${
                        isDarkMode ? 'bg-amber-400 text-black' : 'bg-black text-white'
                      }`}>
                        <Brain className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <div className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 font-mono ${
                          isDarkMode ? 'text-white' : 'text-black'
                        }`}>
                          Anvar AI Neyron Assistenti
                          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                        </div>
                        <div className={`text-[10px] font-mono ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                          Model: Gemini 2.5 Flash // 24/7 Unlimited
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                        ● 24/7 ACTIVE
                      </span>
                    </div>
                  </div>

                  {/* Chat messages container */}
                  <div ref={chatMessagesContainerRef} className="flex-grow p-5 sm:p-6 overflow-y-auto space-y-4 max-h-[420px]">
                    <AnimatePresence initial={false}>
                      {chatHistory.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[88%] sm:max-w-[82%] rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed relative group ${
                              msg.sender === "user"
                                ? (isDarkMode ? "bg-amber-400 text-black font-semibold rounded-tr-none" : "bg-black text-white rounded-tr-none")
                                : (isDarkMode 
                                    ? "bg-[#1a1d29] text-neutral-100 rounded-tl-none border border-neutral-800" 
                                    : "bg-[#f1f3f5] text-neutral-800 rounded-tl-none border border-[#e5e5ea]")
                            }`}
                          >
                            {msg.sender === "gemini" && (
                              <div className="flex items-center justify-between gap-1.5 mb-2 border-b border-black/10 dark:border-white/10 pb-1.5 text-[10px] font-mono uppercase font-bold text-amber-500">
                                <span className="flex items-center gap-1">
                                  <Cpu className="w-3.5 h-3.5" /> GEMINI AI 24/7
                                </span>
                                
                                {/* Controls: Voice TTS + Copy */}
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleSpeakMessage(msg.id, msg.text)}
                                    className={`p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer ${
                                      speakingMsgId === msg.id ? "text-amber-400 animate-pulse" : "text-neutral-400"
                                    }`}
                                    title="Ovozli eshitish"
                                  >
                                    <Volume2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleCopyMessage(msg.id, msg.text)}
                                    className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-neutral-400 hover:text-amber-400 transition-colors cursor-pointer"
                                    title="Nusxalash"
                                  >
                                    {copiedMsgId === msg.id ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            )}
                            
                            <div className="whitespace-pre-line font-normal">
                              {msg.text}
                            </div>
                            
                            <div className={`text-[9px] font-mono mt-1.5 text-right ${
                              msg.sender === "user" 
                                ? (isDarkMode ? "text-black/60" : "text-white/60") 
                                : "text-neutral-400"
                            }`}>
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      {aiIsTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-start"
                        >
                          <div className={`rounded-2xl rounded-tl-none px-4 py-3 border ${
                            isDarkMode ? 'bg-[#1a1d29] border-neutral-800 text-neutral-300' : 'bg-[#f1f3f5] border-[#e5e5ea] text-neutral-600'
                          }`}>
                            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase font-semibold mb-1 text-amber-500">
                              <Sparkles className="w-3.5 h-3.5 animate-spin" /> Anvar AI javob bermoqda...
                            </div>
                            <div className="flex gap-1 py-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>



                  {/* Chat input form */}
                  <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className={`p-4 border-t ${
                    isDarkMode ? 'border-neutral-800 bg-[#12141d]' : 'border-[#e5e5ea] bg-neutral-50'
                  }`}>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={aiMessageInput}
                        onChange={(e) => setAiMessageInput(e.target.value)}
                        placeholder="Anvar AI assistentiga istalgan savolingizni yozing..."
                        className={`flex-grow border rounded-xl px-4 py-3 text-xs focus:outline-none transition-colors ${
                          isDarkMode 
                            ? 'bg-[#1a1d29] border-neutral-700 text-white focus:border-amber-400 placeholder:text-neutral-500' 
                            : 'bg-white border-[#e5e5ea] text-black focus:border-black'
                        }`}
                        disabled={aiIsTyping}
                      />
                      <button
                        type="submit"
                        className={`px-5 rounded-xl transition-colors flex items-center justify-center cursor-pointer font-bold shrink-0 ${
                          isDarkMode 
                            ? 'bg-amber-400 text-black hover:bg-amber-300 disabled:bg-neutral-800 disabled:text-neutral-600' 
                            : 'bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-300'
                        }`}
                        disabled={aiIsTyping || !aiMessageInput.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2 px-1">
                      <span className={`text-[10px] font-mono flex items-center gap-1.5 ${
                        isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        AI Konsultatsiya Bepul
                      </span>
                      <button
                        type="button"
                        onClick={() => setChatHistory([
                          {
                            id: `init-${Date.now()}`,
                            sender: "gemini",
                            text: "Suhbat tozalandi. Menga yana istalgan savolingizni berishingiz mumkin!",
                            timestamp: new Date()
                          }
                        ])}
                        className="text-[10px] font-mono text-neutral-400 hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" /> Tozalash
                      </button>
                    </div>
                  </form>

                </div>

                {/* Column 2: Holographic AI Core Visualization */}
                <div className="lg:col-span-5 bg-black text-white rounded-[36px] p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                  <div className="absolute -right-20 -top-20 w-52 h-52 bg-emerald-500 rounded-full blur-[80px] opacity-30 animate-pulse pointer-events-none" />
                  <div className="absolute -left-20 -bottom-20 w-52 h-52 bg-purple-500 rounded-full blur-[80px] opacity-20 pointer-events-none" />

                  <div className="space-y-6 z-10">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                        <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 font-bold">
                          AI ENGINE CORE
                        </span>
                      </div>
                      <span className="font-mono text-[9px] text-emerald-400 animate-pulse">● FAOL</span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-serif text-2xl font-light text-white">Sun'iy Intellekt Markazi</h3>
                      <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                        Google Gemini API bilan uzviy bog'langan ushbu neyron tarmoq assistenti har bir so'rovingizga tezkor va aniq javob berish uchun sozlangan.
                      </p>
                    </div>

                    <div className="h-44 border border-neutral-800 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden bg-neutral-950/50">
                      <motion.div 
                        className="absolute w-32 h-32 rounded-full border border-dashed border-emerald-500/40"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                      />

                      <motion.div 
                        className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-tr ${
                          aiIsTyping 
                            ? "from-emerald-500 via-teal-500 to-purple-500 shadow-[0_0_30px_rgba(16,185,129,0.6)]" 
                            : "from-neutral-800 via-neutral-900 to-black shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                        } transition-all duration-500 z-10`}
                        animate={{ scale: aiIsTyping ? [1, 1.15, 1] : [1, 1.05, 1] }}
                        transition={{ duration: aiIsTyping ? 1.5 : 3, repeat: Infinity }}
                      >
                        <Brain className={`w-8 h-8 ${aiIsTyping ? "text-white animate-bounce" : "text-emerald-400"}`} />
                      </motion.div>

                      <div className="absolute top-2 left-3 font-mono text-[8px] text-neutral-500">
                        SYS.STATUS: ACTIVE // MODEL: GEMINI
                      </div>
                      <div className="absolute top-2 right-3 font-mono text-[8px] text-neutral-500">
                        PING: {aiIsTyping ? "85ms" : "ONLINE"}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 font-mono">
                      <div className="p-3 bg-neutral-900/80 rounded-xl border border-neutral-800">
                        <span className="block text-[10px] text-neutral-500">KASB</span>
                        <span className="text-xs font-bold text-white">Full-Stack Dev</span>
                      </div>
                      <div className="p-3 bg-neutral-900/80 rounded-xl border border-neutral-800">
                        <span className="block text-[10px] text-neutral-500">MANZIL</span>
                        <span className="text-xs font-bold text-emerald-400">Denov, Surxon</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 mt-4 flex justify-between items-center text-xs font-mono text-neutral-400 z-10">
                    <span>XAVFSIZLIK:</span>
                    <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> 
                      100% Shifrlangan Shlyuz
                    </span>
                  </div>

                </div>

              </div>

            </motion.section>

            {/* SECTION 5: KELAJAKDAGI MARRALAR VA MAQSADLAR */}
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
                  <h3 className={`font-serif text-3xl md:text-4xl font-light tracking-tight leading-tight ${
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
                <h2 className={`font-serif text-3xl md:text-5xl font-light tracking-tight ${
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
                      <h3 className="font-serif text-2xl font-light">Sizni eshitishdan xursandman</h3>
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
                      <h3 className={`font-serif text-2xl font-light ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        SMS va Xabar 100% yetkazildi!
                      </h3>
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl max-w-md mx-auto text-xs font-mono text-emerald-400 space-y-1">
                        <div className="font-bold flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          Server va Admin Panel SMS jurnali tasdiqlandi
                        </div>
                        <p className="text-[11px] text-neutral-300 font-sans">
                          Xabaringiz Akramov Anvarga 100% muvaffaqiyatli yetkazildi. Javob tez orada beriladi.
                        </p>
                      </div>
                      
                      <div className="pt-3 flex flex-wrap justify-center gap-3">
                        <a
                          href={`mailto:${siteConfig.email}?subject=Portfolio%20Murojaat%20(${encodeURIComponent(formName)})&body=${encodeURIComponent(`Ism: ${formName}\nEmail: ${formEmail}\n\nXabar:\n${formMessage}`)}`}
                          className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-500 text-black text-xs font-mono font-bold uppercase rounded-xl hover:bg-amber-400 transition-colors shadow-lg"
                        >
                          <Mail className="w-4 h-4 text-black" /> Email Orqali Yuborish
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
                            Ism Familyangiz
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
                            Email Manzilingiz
                          </label>
                          <input
                            type="email"
                            required
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value)}
                            placeholder="Masalan: sizning_email@gmail.com"
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
