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
  Lock
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
  if (p.includes("salom") || p.includes("assalom") || p === "hi" || p === "hello") {
    return "Salom! Qanday yordam bera olaman?";
  }
  if (p.includes("yosh") || p.includes("necha")) {
    return `${config.name} Hozirda ${config.age}! U juda yosh bo'lishiga qaramay, 1 yildan ortiq vaqtdan beri professional full-stack dasturlash bilan shug'ullanib keladi.`;
  }
  if (p.includes("qayer") || p.includes("manzil") || p.includes("yashaydi") || p.includes("surxon") || p.includes("denov")) {
    return `${config.name} ${config.location} manzilida istiqomat qiladi.`;
  }
  if (p.includes("kim") || p.includes("anvar") || p.includes("haqida")) {
    return config.bio;
  }
  if (p.includes("stak") || p.includes("kod") || p.includes("react") || p.includes("texnologiya") || p.includes("til")) {
    return `${config.firstName} asosiy texnologiya sifatida JavaScript, TypeScript, React, Node.js, Express, HTML5, CSS3 hamda Tailwind CSS va Gemini AI dan foydalanadi.`;
  }
  if (p.includes("aloqa") || p.includes("email") || p.includes("gmail") || p.includes("murojaat")) {
    return `${config.firstName} bilan bog'lanish uchun rasmiy email: ${config.email} . Sahifaning pastki qismidagi formadan ham xabar yuborishingiz mumkin!`;
  }
  return `Salom! Men ${config.name}ning AI assistentiman. Sizga qanday yordam bera olaman?`;
}

export default function App() {
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
  const [activeGameTab, setActiveGameTab] = useState("bubbleshooter");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiMessageInput, setAiMessageInput] = useState("");
  const [aiIsTyping, setAiIsTyping] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Contact form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Chat conversation history
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      id: "init-1",
      sender: "gemini",
      text: "Salom! Men Akramov Anvarning sun'iy intellekt yordamchisiman (Gemini). Men sizga Anvarning 15 yoshida erishgan muvaffaqiyatlari, uning tajribasi va dasturlashga oid har qanday savolingizga javob beraman. Nima haqida suhbatlashamiz?",
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
        body: JSON.stringify({ prompt: userMsgText })
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

  // Contact Form Submission handler
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMessage) return;
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] text-[#111111] antialiased selection:bg-[#111111] selection:text-white relative overflow-x-hidden">
      
      {/* 1. LOADING SCREEN */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            id="loader-screen"
            className="fixed inset-0 z-50 flex flex-col justify-between bg-[#0a0a0c] text-white p-6 sm:p-12 overflow-hidden"
            exit={{ 
              y: "-100%", 
              transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
            }}
          >
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)] pointer-events-none" />

            {/* Header of Loader */}
            <div className="flex justify-between items-center w-full max-w-7xl mx-auto border-b border-white/5 pb-4">
              <span className="font-mono text-xs tracking-widest text-neutral-400">AKRAMOV ANVAR // PORTFOLIO</span>
              <span className="font-mono text-xs text-emerald-400 flex items-center gap-2 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                15 YOSH
              </span>
            </div>

            {/* Main Center Content */}
            <div className="w-full max-w-3xl mx-auto flex flex-col justify-center flex-grow py-12">
              <div className="overflow-hidden mb-6">
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="font-serif text-4xl sm:text-7xl font-light tracking-tight text-white/90"
                >
                  Akramov Anvar
                </motion.div>
              </div>
              <div className="overflow-hidden mb-12">
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="font-sans text-xs sm:text-sm uppercase tracking-widest text-emerald-400 font-mono font-semibold"
                >
                  Full-Stack Dasturchi // Yosh: 15 yoshda
                </motion.div>
              </div>

              {/* Progress Counter Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-mono text-neutral-500 tracking-wider">
                    {loadingPhase}
                  </span>
                  <span className="text-4xl sm:text-6xl font-light font-mono tracking-tighter text-white">
                    {Math.round(progress)}%
                  </span>
                </div>
                
                {/* Progress bar line */}
                <div className="h-[2px] w-full bg-white/10 relative overflow-hidden rounded-full">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 absolute left-0 top-0 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>

            {/* Footer of Loader */}
            <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-white/5 pt-4 text-xs font-mono text-neutral-500">
              <div>DIZAYN ASOSI: AKRAMOV ANVAR</div>
              {progress >= 100 ? (
                <motion.button
                  id="enter-btn"
                  onClick={() => setLoading(false)}
                  className="px-6 py-2.5 bg-white text-black font-sans uppercase font-semibold text-xs tracking-widest rounded-full hover:bg-neutral-200 transition-all cursor-pointer flex items-center gap-2 shadow-xl shadow-white/5"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  KIRISH <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  YUKLANMOQDA
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
          {/* Back to top decoration line */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-black via-amber-500 to-emerald-500" />

          {/* BACKGROUND DECORATIONS */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-30 pointer-events-none" />

          {/* AESTHETIC TOP NAVIGATION BAR */}
          <header className="sticky top-0 z-30 bg-[#fdfdfd]/90 backdrop-blur-md border-b border-[#e5e5ea] transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex justify-between items-center">
              
              {/* LOGO & ADMIN PANEL BUTTON - Top Header */}
              <div className="flex items-center gap-3">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  id="logo-placeholder"
                  className="flex items-center gap-3 cursor-pointer select-none py-1 px-2.5 transition-all rounded-xl hover:bg-neutral-100"
                  onClick={() => {
                    setActiveTab("home");
                    smoothScrollTo("home", 1200);
                  }}
                >
                  <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-mono font-black text-sm tracking-widest shadow-md">
                    AA
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif text-base tracking-[0.15em] font-extrabold text-black uppercase leading-none">
                      {siteConfig.firstName} {siteConfig.lastName}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono mt-1 font-semibold">Full-Stack Dev // 15 yosh</span>
                  </div>
                </motion.div>

                {/* ADMIN PANEL BUTTON - STRICTLY NEXT TO LOGO */}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowAdminModal(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-black px-3 py-1.5 rounded-xl text-[11px] font-mono font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-sm hover:shadow transition-all border border-amber-400 cursor-pointer"
                  title="Admin Paneli ochish"
                >
                  <Lock className="w-3.5 h-3.5 text-black" />
                  <span>Admin Panel</span>
                </motion.button>
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
                      activeTab === item.id ? "text-black font-bold" : "text-neutral-500 hover:text-black"
                    }`}
                  >
                    {item.label}

                    {activeTab === item.id && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.button>
                ))}
              </nav>

              {/* Action buttons - Right Side */}
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-xs font-mono px-3.5 py-1.5 bg-neutral-100 rounded-full border border-neutral-200 text-black font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Yosh: {siteConfig.age}
                </span>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#contact"
                  className="bg-black text-white px-5 py-2.5 text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors rounded-full font-bold shadow-md hover:shadow-lg cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("contact");
                    smoothScrollTo("contact", 1200);
                  }}
                >
                  Aloqa
                </motion.a>
              </div>

              {/* Mobile menu button */}
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-neutral-600 hover:text-black focus:outline-none cursor-pointer rounded-xl border border-neutral-200"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile Navigation Dropdown */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="lg:hidden border-t border-neutral-100 bg-[#fdfdfd] px-6 py-4 space-y-3 shadow-xl"
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
                        activeTab === item.id ? "text-black font-bold pl-3 border-l-2 border-black bg-neutral-100/60" : "text-neutral-500 hover:text-black"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs font-mono text-neutral-500">Akramov Anvar // 15 yosh</span>
                    <a
                      href="#contact"
                      className="px-4 py-2 text-xs uppercase font-mono font-semibold tracking-wider bg-black text-white rounded-full text-center"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab("contact");
                        setMobileMenuOpen(false);
                        smoothScrollTo("contact", 1200);
                      }}
                    >
                      Aloqa
                    </a>
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
                  <Flame className="w-4 h-4 text-amber-500" /> 34 TA INTERAKTIV O'YIN
                </div>
                <h2 className="font-serif text-4xl md:text-6xl font-bold text-black tracking-tight uppercase">
                  INTERAKTIV O'YINLAR ARENASI
                </h2>
                <div className="h-1 w-24 bg-amber-500 mx-auto rounded-full mt-2" />
              </div>

              {/* Game Selector Navigation Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none border-b border-neutral-200">
                {[
                  { id: "bubbleshooter", name: "Bubble Shooter", badge: "NEW 🔴" },
                  { id: "spaceinvaders", name: "Space Invaders", badge: "NEW 👾" },
                  { id: "typingracer", name: "Speed Typing Racer", badge: "NEW 🏎️" },
                  { id: "sudoku", name: "Mini Sudoku", badge: "NEW 🧩" },
                  { id: "helixjump", name: "Helix Jump", badge: "NEW 🌀" },
                  { id: "aimtrainer", name: "Aim Trainer", badge: "NEW 🎯" },
                  { id: "mazerunner", name: "Maze Escape", badge: "NEW 🧭" },
                  { id: "patternmemory", name: "Pattern Memory", badge: "NEW 🧠" },
                  { id: "doodlejump", name: "Doodle Jump", badge: "NEW ⬆️" },
                  { id: "numbermerge", name: "2048 Chain Drop", badge: "NEW 🔢" },
                  { id: "tetris", name: "Tetris Matrix", badge: "TOP 🎮" },
                  { id: "whackamole", name: "Whack-A-Mole", badge: "POP 🔨" },
                  { id: "simon", name: "Simon Says", badge: "BRAIN 🧠" },
                  { id: "wordscramble", name: "Word Scramble", badge: "WORD 🔤" },
                  { id: "speedtyping", name: "Speed Typer", badge: "TYPER ⌨️" },
                  { id: "gravityrunner", name: "Gravity Runner", badge: "RUN 🚀" },
                  { id: "connectfour", name: "Connect Four", badge: "4-IN-ROW 🤖" },
                  { id: "knifehit", name: "Knife Hit", badge: "HIT 🎯" },
                  { id: "fruitninja", name: "Fruit Ninja", badge: "SLICE 🍉" },
                  { id: "archery", name: "Archery Master", badge: "BOW 🏹" },
                  { id: "towerstack", name: "Tower Stack", badge: "STACK 🏢" },
                  { id: "tile2048", name: "2048 Cyber", badge: "PUZZLE 🧩" },
                  { id: "brick", name: "Brick Breaker", badge: "HOT 🧱" },
                  { id: "sniper", name: "Sniper Blitz", badge: "AIM 🎯" },
                  { id: "colorrush", name: "Color Rush", badge: "SPEED 🌈" },
                  { id: "minesweeper", name: "Minesweeper", badge: "LOGIC 💣" },
                  { id: "fastmath", name: "Fast Math", badge: "REFLEX ⚡" },
                  { id: "tictactoe", name: "Tic-Tac-Toe AI", badge: "SMART 🤖" },
                  { id: "snake", name: "Cyber Snake", badge: "CLASSIC 🐍" },
                  { id: "flappy", name: "Flappy Bird", badge: "HARD 🐥" },
                  { id: "pong", name: "Retro Pong", badge: "DUEL 🏓" },
                  { id: "memory", name: "Memory Match", badge: "BRAIN 🧠" },
                  { id: "space", name: "Space Shooter", badge: "ACTION 🚀" },
                  { id: "dino", name: "Dino Runner", badge: "RETRO REX" },
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveGameTab(tab.id)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                      activeGameTab === tab.id
                        ? "bg-black text-white shadow-lg ring-2 ring-amber-400"
                        : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
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

            {/* SECTION 4: INTERACTIVE AI ASSISTANT SECTION */}
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
                <span className="font-mono text-xs uppercase tracking-widest text-purple-600 font-bold bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                  02 // SUN'IY INTELLEKT MARKAZI
                </span>
                <h2 className="font-serif text-3xl md:text-5xl font-light text-black tracking-tight">
                  Google Gemini AI Yordamchisi.
                </h2>
                <p className="text-xs md:text-sm text-neutral-500 max-w-lg mx-auto font-sans">
                  Akramov Anvarning sun'iy intellekt assistenti bilan 24/7 jonli muloqot qiling va dasturlash haqida istalgan savolingizga tezkor javob oling!
                </p>
                <div className="h-0.5 w-12 bg-black mx-auto mt-2" />
              </div>

              {/* AI Block */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* Column 1: Live Interactive Chat */}
                <div className="lg:col-span-7 bg-white border border-[#e5e5ea] rounded-[36px] flex flex-col justify-between overflow-hidden shadow-xl min-h-[580px]">
                  
                  {/* Chat header */}
                  <div className="bg-[#f7f7f9] border-b border-[#e5e5ea] px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center shadow-md">
                        <Brain className="w-5 h-5 text-emerald-400 animate-pulse" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2 font-mono">
                          Anvarning AI Assistenti
                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <div className="text-[10px] font-mono text-neutral-400">Model: Gemini 2.5 Flash</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-bold">
                        24/7 ONLINE
                      </span>
                    </div>
                  </div>

                  {/* Chat messages container */}
                  <div ref={chatMessagesContainerRef} className="flex-grow p-6 overflow-y-auto space-y-4 max-h-[440px]">
                    <AnimatePresence initial={false}>
                      {chatHistory.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed ${
                              msg.sender === "user"
                                ? "bg-black text-white rounded-tr-none font-sans"
                                : "bg-[#f1f3f5] text-neutral-800 rounded-tl-none font-sans border border-[#e5e5ea]"
                            }`}
                          >
                            {msg.sender === "gemini" && (
                              <div className="flex items-center gap-1.5 mb-1.5 border-b border-black/5 pb-1 text-[10px] font-mono text-purple-700 uppercase font-bold">
                                <Cpu className="w-3 h-3 text-purple-600" /> GEMINI AI ASSISTANT
                              </div>
                            )}
                            
                            <div className="whitespace-pre-line font-light">
                              {msg.text}
                            </div>
                            
                            <div className="text-[9px] font-mono mt-1.5 text-right text-neutral-400">
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
                          <div className="bg-[#f1f3f5] text-neutral-500 rounded-2xl rounded-tl-none px-4 py-3 border border-[#e5e5ea]">
                            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase font-semibold mb-1">
                              <Sparkles className="w-3.5 h-3.5 animate-spin text-purple-500" /> Gemini javob tayyorlamoqda
                            </div>
                            <div className="flex gap-1 py-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" />
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Quick question suggest chips */}
                  <div className="px-6 py-2 bg-[#fdfdfd] border-t border-[#e5e5ea] flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <span className="text-[10px] font-mono text-neutral-400 shrink-0">Savollar:</span>
                    {[
                      "Anvar necha yoshda?",
                      "Qayerda yashaydi?",
                      "Qaysi tillarni biladi?",
                      "Email manzili nima?"
                    ].map((qText) => (
                      <button
                        key={qText}
                        onClick={() => handleSendMessage(qText)}
                        className="text-[10px] font-mono bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2.5 py-1 rounded-full shrink-0 transition-colors border border-neutral-200"
                      >
                        {qText}
                      </button>
                    ))}
                  </div>

                  {/* Chat input form */}
                  <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-4 border-t border-[#e5e5ea] bg-neutral-50">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={aiMessageInput}
                        onChange={(e) => setAiMessageInput(e.target.value)}
                        placeholder="Anvar haqida yoki dasturlash bo'yicha savolingizni yozing..."
                        className="flex-grow bg-white border border-[#e5e5ea] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-black transition-colors"
                        disabled={aiIsTyping}
                      />
                      <button
                        type="submit"
                        className="px-5 bg-black text-white rounded-xl hover:bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer disabled:bg-neutral-300 font-bold"
                        disabled={aiIsTyping || !aiMessageInput.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2 px-1">
                      <span className="text-[10px] font-mono text-neutral-400">
                        24/7 Bepul AI konsultatsiya
                      </span>
                      <button
                        type="button"
                        onClick={() => setChatHistory([
                          {
                            id: `init-${Date.now()}`,
                            sender: "gemini",
                            text: "Suhbat tozalandi. Menga yana savol berishingiz mumkin!",
                            timestamp: new Date()
                          }
                        ])}
                        className="text-[10px] font-mono text-neutral-400 hover:text-red-500 underline cursor-pointer"
                      >
                        Tozalash
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
                      <span className="font-mono text-[9px] text-emerald-400 animate-pulse">● 24/7 ONLINE</span>
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
              className="bg-[#f7f7f9] border border-[#e5e5ea] rounded-3xl p-6 sm:p-12 space-y-8 relative overflow-hidden scroll-mt-24 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Description Column */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500 font-bold uppercase tracking-widest">
                    <Target className="w-4 h-4 text-emerald-600" /> 03 // MARRALAR VA REJALAR
                  </div>
                  
                  {/* Requested Title */}
                  <h3 className="font-serif text-3xl md:text-4xl font-light text-black tracking-tight leading-tight">
                    Mening keyingi marralarim va maqsadlarim.
                  </h3>

                  {/* Requested Subtitle */}
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
                    15 yosh - bu katta yo'lning boshlanishi. Men yaqin kelajakda quyidagi muhim loyihalarni ishga tushirishni va ta'lim tizimini rivojlantirishni maqsad qilganman.
                  </p>
                  <div className="h-0.5 w-12 bg-black mt-2" />
                </div>

                {/* Right 4 Goal Cards */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="bg-white border border-[#e5e5ea] p-6 rounded-[28px] space-y-3 hover:border-black transition-all shadow-sm hover:shadow-xl group"
                  >
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-mono text-xs font-bold group-hover:bg-emerald-500 transition-colors shadow-md">1</div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-black font-mono">{siteConfig.goal1Title}</h4>
                    <p className="text-xs text-neutral-600 leading-normal font-sans">
                      {siteConfig.goal1Desc}
                    </p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="bg-white border border-[#e5e5ea] p-6 rounded-[28px] space-y-3 hover:border-black transition-all shadow-sm hover:shadow-xl group"
                  >
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-mono text-xs font-bold group-hover:bg-purple-600 transition-colors shadow-md">2</div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-black font-mono">{siteConfig.goal2Title}</h4>
                    <p className="text-xs text-neutral-600 leading-normal font-sans">
                      {siteConfig.goal2Desc}
                    </p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="bg-white border border-[#e5e5ea] p-6 rounded-[28px] space-y-3 hover:border-black transition-all shadow-sm hover:shadow-xl group"
                  >
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-mono text-xs font-bold group-hover:bg-amber-500 transition-colors shadow-md">3</div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-black font-mono">{siteConfig.goal3Title}</h4>
                    <p className="text-xs text-neutral-600 leading-normal font-sans">
                      {siteConfig.goal3Desc}
                    </p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="bg-white border border-[#e5e5ea] p-6 rounded-[28px] space-y-3 hover:border-black transition-all shadow-sm hover:shadow-xl group"
                  >
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-mono text-xs font-bold group-hover:bg-blue-600 transition-colors shadow-md">4</div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-black font-mono">{siteConfig.goal4Title}</h4>
                    <p className="text-xs text-neutral-600 leading-normal font-sans">
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
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 font-bold">
                  04 // MENGA BOG'LANING
                </span>
                <h2 className="font-serif text-3xl md:text-5xl font-light text-black tracking-tight">
                  Menga bog'laning.
                </h2>
                <div className="h-0.5 w-12 bg-black mx-auto mt-2" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* Contact Info Card */}
                <div className="lg:col-span-5 bg-black text-white rounded-[36px] p-8 sm:p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden">
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
                <div className="lg:col-span-7 bg-white border border-[#e5e5ea] rounded-[36px] p-8 sm:p-10 shadow-xl flex flex-col justify-center">
                  
                  {formSubmitted ? (
                    <motion.div 
                      id="form-success-alert"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center space-y-4 py-6"
                    >
                      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
                        <Check className="w-8 h-8" />
                      </div>
                      <h3 className="font-serif text-2xl font-light text-black">Xabaringiz tayyorlandi!</h3>
                      <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto leading-relaxed font-sans">
                        Siz kiritgan xabar saqlandi. To'g'ridan-to'g'ri {siteConfig.name}ning rasmiy emailiga yuborish uchun quyidagi tugmani bosing:
                      </p>
                      
                      <div className="pt-2">
                        <a
                          href={`mailto:${siteConfig.email}?subject=Portfolio%20Murojaat%20(${encodeURIComponent(formName)})&body=${encodeURIComponent(`Ism: ${formName}\nEmail: ${formEmail}\n\nXabar:\n${formMessage}`)}`}
                          className="inline-flex items-center gap-2 px-6 py-3.5 bg-black text-white text-xs font-mono font-bold uppercase rounded-xl hover:bg-neutral-800 transition-colors shadow-lg"
                        >
                          <Mail className="w-4 h-4 text-emerald-400" /> {siteConfig.email} Ga Yuborish
                        </a>
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-5 font-sans">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold">
                            Ism Familyangiz
                          </label>
                          <input
                            type="text"
                            required
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            placeholder="Masalan: Abdullayev Temur"
                            className="w-full bg-neutral-50 border border-[#e5e5ea] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-black transition-colors"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold">
                            Email Manzilingiz
                          </label>
                          <input
                            type="email"
                            required
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value)}
                            placeholder="Masalan: sizning_email@gmail.com"
                            className="w-full bg-neutral-50 border border-[#e5e5ea] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-black transition-colors"
                          />
                        </div>
                      </div>

                      {/* Requested Textarea Label */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold">
                          Menga nima yozmoqchisiz?
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={formMessage}
                          onChange={(e) => setFormMessage(e.target.value)}
                          placeholder="Fikrlaringiz, taklifingiz yoki savolingizni yozing..."
                          className="w-full bg-neutral-50 border border-[#e5e5ea] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-black transition-colors"
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        className="w-full py-3.5 bg-black text-white text-xs font-mono uppercase font-bold tracking-wider rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
                      >
                        Xabarni Tayyorlash <Send className="w-3.5 h-3.5" />
                      </motion.button>

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
                className="fixed bottom-6 right-6 z-40 p-3.5 bg-black text-white rounded-full shadow-2xl hover:bg-neutral-800 transition-all cursor-pointer border border-neutral-700 group"
                title="Tepaga qaytish"
              >
                <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform text-emerald-400" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* SYSTEM FOOTER */}
          <footer className="border-t border-[#e5e5ea] bg-white mt-24 py-10 text-center text-xs text-neutral-400 font-mono space-y-3">
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
