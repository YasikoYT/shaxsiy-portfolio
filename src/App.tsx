/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, FormEvent } from "react";
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useTransform 
} from "motion/react";
import { 
  Sparkles, 
  ChevronRight, 
  ArrowUpRight, 
  Send, 
  Terminal, 
  Code, 
  User, 
  BookOpen, 
  Layers, 
  Mail, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Check, 
  Cpu, 
  FileCode, 
  Database, 
  Smartphone, 
  Brain, 
  MessageSquare,
  ArrowRight,
  Menu,
  X
} from "lucide-react";
import { Project, RoadmapStep, Message } from "./types";
import DinoGame from "./components/DinoGame";

export default function App() {
  // Loading screen states
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState("Interaktiv tizimlar yuklanmoqda...");
  
  // App navigation and interactive states
  const [activeTab, setActiveTab] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiMessageInput, setAiMessageInput] = useState("");
  const [aiIsTyping, setAiIsTyping] = useState(false);
  const [badgeStep, setBadgeStep] = useState<"initial" | "html" | "css" | "js" | "frontend" | "surxon" | "creative">("initial");
  
  // Contact form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Floating code lines state for the interactive badge
  const [floatingItems, setFloatingItems] = useState<{ id: number; text: string; x: number; y: number; color: string }[]>([]);

  const triggerBadgeCycle = () => {
    if (badgeStep !== "initial") return;

    // Beep sound
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = 600;
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {}

    const addFloatingText = (text: string, color: string) => {
      const id = Date.now() + Math.random();
      const x = Math.random() * 200 - 100; // random horizontal offset
      const y = Math.random() * -80 - 40;  // float up offset
      setFloatingItems((prev) => [...prev, { id, text, x, y, color }]);
      setTimeout(() => {
        setFloatingItems((prev) => prev.filter((item) => item.id !== id));
      }, 2000);
    };

    // Cycle steps:
    // HTML
    setBadgeStep("html");
    addFloatingText("<div class='hero'>", "#f06529");
    addFloatingText("<section>", "#e34f26");
    addFloatingText("<h1>Anvar Akramov</h1>", "#f06529");

    // CSS after 1.2s
    setTimeout(() => {
      setBadgeStep("css");
      addFloatingText(".designer { display: flex; }", "#2965f1");
      addFloatingText("#hero { color: #fdfdfd; }", "#264de4");
      addFloatingText("transition: all 0.3s ease;", "#2965f1");
    }, 1200);

    // JS after 2.4s
    setTimeout(() => {
      setBadgeStep("js");
      addFloatingText("const age = 14;", "#f0db4f");
      addFloatingText("const isReady = true;", "#f0db4f");
      addFloatingText("console.log('Surxon IT');", "#323330");
    }, 2400);

    // FRONTEND after 3.6s
    setTimeout(() => {
      setBadgeStep("frontend");
      addFloatingText("import React from 'react';", "#61dbfb");
      addFloatingText("const [state, setState] = useState()", "#61dbfb");
      addFloatingText("npm run build && vite", "#22c55e");
    }, 3600);

    // SURXONDARYO after 4.8s
    setTimeout(() => {
      setBadgeStep("surxon");
      addFloatingText("Surxondaryo, Denov", "#a855f7");
      addFloatingText("IT Education", "#a855f7");
      addFloatingText("Yagona Academy", "#f59e0b");
    }, 4800);

    // CREATIVE after 6.0s
    setTimeout(() => {
      setBadgeStep("creative");
      addFloatingText("★ CREATIVE MIND ★", "#ec4899");
      addFloatingText("★ INTERACTIVE ★", "#ec4899");
      addFloatingText("★ EXCELLENCE ★", "#ec4899");
    }, 6000);

    // Initial back after 7.2s
    setTimeout(() => {
      setBadgeStep("initial");
    }, 7200);
  };

  // Chat conversation history with initial warm greeting
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      id: "init-1",
      sender: "gemini",
      text: "Salom! Men Anvarning sun'iy intellekt yordamchisiman (Gemini). Men sizga Anvarning 14 yoshida erishgan muvaffaqiyatlari, uning loyihalari va dasturlashga oid har qanday savolingizga javob berishim mumkin. Nima haqida suhbatlashamiz?",
      timestamp: new Date()
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll animations
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  // 1. Organic Loader Animation Counter
  useEffect(() => {
    if (progress < 100) {
      const duration = 2000; // total 2 seconds loading
      const interval = 20; // tick every 20ms
      const step = 100 / (duration / interval);
      
      const timer = setInterval(() => {
        setProgress((prev) => {
          const next = prev + step + (Math.random() * 2 - 0.5); // Add organic variety
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

  // Loading text phrases based on progress percentage
  useEffect(() => {
    if (progress < 25) {
      setLoadingPhase("Yagona Academy uslubi va komponentlari yuklanmoqda...");
    } else if (progress < 55) {
      setLoadingPhase("Akramov Anvar shaxsiy ma'lumotlari indekslanmoqda...");
    } else if (progress < 85) {
      setLoadingPhase("Google Gemini AI API bog'lamasi tekshirilmoqda...");
    } else {
      setLoadingPhase("Interfeys tayyor. Kirishga ruxsat berildi!");
    }
  }, [progress]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, aiIsTyping]);

  // 2. Chat sending handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMessageInput.trim()) return;

    const userMsgText = aiMessageInput.trim();
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
      
      const geminiMsg: Message = {
        id: `gemini-${Date.now()}`,
        sender: "gemini",
        text: data.text || data.error || "Kechirasiz, javob olishda muammo yuz berdi.",
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, geminiMsg]);
    } catch (error: any) {
      setAiIsTyping(false);
      const errorMsg: Message = {
        id: `gemini-error-${Date.now()}`,
        sender: "gemini",
        text: "Server bilan bog'lanishda xatolik yuz berdi. Iltimos, server ishlayotganini va API kalitingiz sozlanganligini tekshiring.",
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errorMsg]);
    }
  };

  // 3. Contact Form Submission handler
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMessage) return;
    
    // Simulate API call
    setFormSubmitted(true);
    setTimeout(() => {
      setFormName("");
      setFormEmail("");
      setFormMessage("");
    }, 2000);
  };

  // Sample Projects
  const projects: Project[] = [
    {
      id: "p1",
      title: "Yagona Learn - Ta'lim Platformasi",
      category: "Full-Stack Web App",
      description: "Yagona Academy dizayni va g'oyasidan ilhomlangan holda, yosh dasturchilar uchun interaktiv dasturlash darslarini o'tish imkonini beruvchi silliq veb-platforma. Kurslar boshqaruvi, topshiriqlar va video darslar moduli mavjud.",
      tech: ["React", "Express", "TypeScript", "Tailwind CSS"],
      demoUrl: "#",
      githubUrl: "#"
    },
    {
      id: "p2",
      title: "AI Dasturlash Hamrohi (Gemini)",
      category: "Artificial Intelligence",
      description: "14 yoshli yosh dasturchilarga kod yozish jarayonida xatolarni tushuntirib beruvchi va darsliklar tavsiya qiluvchi aqlli sun'iy intellekt chat-bot tizimi.",
      tech: ["Gemini API", "Node.js", "React", "Markdown"],
      demoUrl: "#",
      githubUrl: "#"
    },
    {
      id: "p3",
      title: "Portfolio Terminal OS",
      category: "Frontend Utility",
      description: "Brauzer ichida ishlovchi retro-modern operatsion tizim interfeysi va terminal simulyatori. Unda foydalanuvchilar buyruqlar yordamida mening kodlarim va loyihalarim bilan tanisha olishadi.",
      tech: ["React", "motion/react", "Tailwind CSS", "Vite"],
      demoUrl: "#",
      githubUrl: "#"
    },
    {
      id: "p4",
      title: "Denov Online Hub - Surxondaryo IT Portali",
      category: "Community Platform",
      description: "Surxondaryo viloyati, Denov tumanidagi yoshlar va IT ixlosmandlarini birlashtiruvchi, bir-biri bilan bilim almashish, interaktiv topshiriqlarni bajarish va loyihalarini taqdim etish imkonini beruvchi hududiy ta'lim portali.",
      tech: ["React", "TypeScript", "Tailwind CSS", "Firebase"],
      demoUrl: "#",
      githubUrl: "#"
    }
  ];



  return (
    <div className="min-h-screen bg-[#fdfdfd] text-[#111111] antialiased selection:bg-[#111111] selection:text-white">
      
      {/* 1. LOADING SCREEN - Premium Animated Overlay */}
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
              <span className="font-mono text-xs tracking-widest text-neutral-400">AKRAMOV ANVAR // V1.0</span>
              <span className="font-mono text-xs text-neutral-400 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 animate-spin" /> 2026 UTC
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
                  className="font-sans text-xs sm:text-sm uppercase tracking-widest text-neutral-400 font-medium"
                >
                  Full-Stack Dasturchi & IT Mentor // Yosh: 14 da
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
                <div className="h-[1px] w-full bg-white/10 relative overflow-hidden">
                  <motion.div 
                    className="h-full bg-white absolute left-0 top-0"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>

            {/* Footer of Loader */}
            <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-white/5 pt-4 text-xs font-mono text-neutral-500">
              <div>DIZAYN ASOSI: YAGONA ACADEMY // PROFESSIONAL USLUB</div>
              {progress >= 100 ? (
                <motion.button
                  id="enter-btn"
                  onClick={() => setLoading(false)}
                  className="px-6 py-2.5 bg-white text-black font-sans uppercase font-semibold text-xs tracking-widest rounded-full hover:bg-neutral-200 transition-all cursor-pointer flex items-center gap-2 group shadow-xl shadow-white/5"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  KIRISh <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-neutral-600 animate-pulse" />
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Back to top decoration */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-[#111111]" />

          {/* BACKGROUND DECORATIONS (Artistic Flair Theme Background) */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-30 pointer-events-none" />

          {/* AESTHETIC TOP NAVIGATION BAR */}
          <header className="sticky top-0 z-30 bg-[#fdfdfd]/80 backdrop-blur-md border-b border-[#e5e5ea]">
            <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
              
              {/* LOGO - Golden AV Monogram Logo */}
              <div className="flex flex-col">
                <motion.div 
                  id="logo-placeholder"
                  className="flex items-center gap-2.5 cursor-pointer select-none py-1 px-3 border border-transparent hover:border-neutral-100 transition-all rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    setActiveTab("home");
                  }}
                >
                  <svg width="40" height="40" viewBox="0 0 120 120" className="drop-shadow-md">
                    <defs>
                      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="30%" stopColor="#f59e0b" />
                        <stop offset="70%" stopColor="#d97706" />
                        <stop offset="100%" stopColor="#78350f" />
                      </linearGradient>
                    </defs>
                    {/* Intertwined A and V letters in golden monogram styling */}
                    <path d="M 30,95 L 55,30 L 65,30 L 80,72 L 72,72 L 60,38 L 40,88 Z" fill="url(#gold)" />
                    {/* Swoosh crossbar on A */}
                    <path d="M 23,66 Q 52,48 81,68 Q 65,74 46,70 Z" fill="url(#gold)" />
                    {/* Letter V */}
                    <path d="M 50,42 L 70,95 L 78,95 L 100,45 L 90,45 L 74,83 L 58,42 Z" fill="url(#gold)" />
                  </svg>
                  <div className="flex flex-col">
                    <span className="font-serif text-base tracking-[0.3em] font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-700 uppercase leading-none">
                      ANVAR
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="h-[1px] bg-amber-500/50 flex-grow w-7"></div>
                      <span className="text-[6px] text-amber-500">✦</span>
                      <div className="h-[1px] bg-amber-500/50 flex-grow w-7"></div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Desktop Menu - Center */}
              <nav className="hidden md:flex items-center gap-10 text-sm font-medium uppercase tracking-tighter">
                {["home", "about", "projects", "ai-assistant", "contact"].map((tab) => (
                  <button
                    key={tab}
                    id={`nav-link-${tab}`}
                    onClick={() => {
                      setActiveTab(tab);
                      const element = document.getElementById(tab);
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                    className={`relative py-2 cursor-pointer transition-colors ${
                      activeTab === tab ? "text-black" : "text-gray-900 hover:text-gray-500"
                    }`}
                  >
                    {tab === "home" && "Asosiy"}
                    {tab === "about" && "Men haqimda"}
                    {tab === "projects" && "Portfolio"}
                    {tab === "ai-assistant" && "AI Markazi"}
                    {tab === "contact" && "Bog'lanish"}

                    {activeTab === tab && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </button>
                ))}
              </nav>

              {/* Action buttons - Right Side */}
              <div className="hidden md:flex items-center gap-4">
                <span className="text-xs font-mono px-3 py-1 bg-neutral-100 rounded-none border border-neutral-200">
                  Yosh: 14 da
                </span>
                <a
                  href="#contact"
                  className="bg-black text-white px-6 py-2 text-sm font-medium uppercase tracking-tighter hover:bg-neutral-800 transition-colors rounded-none"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                    setActiveTab("contact");
                  }}
                >
                  Aloqa
                </a>
              </div>

              {/* Mobile menu button */}
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-neutral-600 hover:text-black focus:outline-none cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Mobile Navigation Dropdown */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="md:hidden border-t border-neutral-100 bg-[#fdfdfd] px-6 py-4 space-y-4"
                >
                  {["home", "about", "projects", "ai-assistant", "contact"].map((tab) => (
                    <button
                      key={tab}
                      id={`nav-link-mobile-${tab}`}
                      onClick={() => {
                        setActiveTab(tab);
                        setMobileMenuOpen(false);
                        const element = document.getElementById(tab);
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                      }}
                      className={`block w-full text-left py-2 text-xs uppercase tracking-widest font-medium ${
                        activeTab === tab ? "text-black font-bold pl-2 border-l-2 border-black" : "text-neutral-500"
                      }`}
                    >
                      {tab === "home" && "Bosh sahifa"}
                      {tab === "about" && "Men Haqimda"}
                      {tab === "projects" && "Loyihalarim"}
                      {tab === "ai-assistant" && "Sun'iy Intellekt"}
                      {tab === "contact" && "Aloqa"}
                    </button>
                  ))}
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs font-mono text-neutral-500">Akramov Anvar // 14 yosh</span>
                    <a
                      href="#contact"
                      className="px-4 py-2 text-xs uppercase font-semibold tracking-wider border border-black rounded-full text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Aloqa
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          {/* MAIN WRAPPER CONTAINER WITH BALANCED SPACINGS */}
          <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-32">

            {/* SECTION 1: HERO VIEW */}
            <section id="home" className="pt-4 md:pt-12 scroll-mt-24">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Intro Column */}
                <motion.div 
                  className="lg:col-span-7 space-y-8"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                >
                  
                  {/* Subtle Tech Badge */}
                  <div className="mb-4 inline-flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full w-fit">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-600">
                      AKTIV IT MENTOR VA FULL-STACK ISHLAB CHIQARUVCHI
                    </span>
                  </div>

                  {/* High Impact Editorial Headings */}
                  <div className="space-y-4">
                    <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-6 uppercase">
                      Anvar<br />
                      <span className="text-transparent" style={{ WebkitTextStroke: "1px black" }}>
                        Akramov
                      </span>
                    </h1>

                    {/* Designer CSS HTML JS Youtube Link/Badge */}
                    <div className="pt-2 pb-4 flex flex-wrap items-center gap-4 relative">
                      <AnimatePresence>
                        {floatingItems.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 1, y: 0, scale: 0.8 }}
                            animate={{ opacity: 0, y: item.y, scale: 1.1, x: item.x }}
                            transition={{ duration: 1.8, ease: "easeOut" }}
                            className="absolute pointer-events-none font-mono text-[10px] font-bold z-50 bg-black/95 text-white px-2.5 py-1.5 rounded-lg border border-white/10 shadow-xl"
                            style={{ color: item.color, left: "30%" }}
                          >
                            {item.text}
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      <motion.button 
                        onClick={triggerBadgeCycle}
                        className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full font-mono text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-md cursor-pointer ${
                          badgeStep === "initial" ? "bg-red-600 hover:bg-red-700 text-white shadow-red-600/20 animate-pulse hover:scale-105" :
                          badgeStep === "html" ? "bg-orange-600 text-white shadow-orange-600/20" :
                          badgeStep === "css" ? "bg-blue-600 text-white shadow-blue-600/20" :
                          badgeStep === "js" ? "bg-yellow-500 text-black shadow-yellow-500/20" :
                          badgeStep === "frontend" ? "bg-teal-500 text-white shadow-teal-500/20" :
                          badgeStep === "surxon" ? "bg-purple-600 text-white shadow-purple-600/20" :
                          "bg-pink-600 text-white shadow-pink-600/20"
                        }`}
                        whileTap={{ scale: 0.95 }}
                        animate={badgeStep !== "initial" ? { scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] } : {}}
                        transition={badgeStep !== "initial" ? { duration: 0.5, repeat: Infinity } : {}}
                      >
                        <span className="relative flex h-3 w-3">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                            badgeStep === "js" ? "bg-black" : "bg-white"
                          }`}></span>
                          <span className={`relative inline-flex rounded-full h-3 w-3 ${
                            badgeStep === "js" ? "bg-black" : "bg-white"
                          }`}></span>
                        </span>
                        
                        <span>
                          {badgeStep === "initial" && "designer css html js ✦ bosing"}
                          {badgeStep === "html" && "📂 <HTML5 />"}
                          {badgeStep === "css" && "🎨 #CSS3_STYLE"}
                          {badgeStep === "js" && "⚙️ const JS = 'V8';"}
                          {badgeStep === "frontend" && "🚀 import { React, Vite }"}
                          {badgeStep === "surxon" && "🇺🇿 SURXONDARYO // DENOV"}
                          {badgeStep === "creative" && "👑 CREATIVE DEV ANVAR"}
                        </span>

                        <Sparkles className={`w-3.5 h-3.5 ${badgeStep === "js" ? "text-black animate-spin" : "text-white animate-pulse"}`} />
                      </motion.button>

                      {badgeStep === "initial" && (
                        <a 
                          href="https://youtu.be/R3UGK1RhY6I?si=yO2JrqkpemffYstS" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-1.5 text-[11px] font-mono text-neutral-400 hover:text-red-600 transition-colors py-2 px-3 bg-neutral-50 hover:bg-neutral-100 rounded-full border border-neutral-200"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                          <span>YouTube Dars</span>
                        </a>
                      )}
                    </div>
                    
                    <p className="font-serif text-xl md:text-2xl text-neutral-600 italic font-light leading-relaxed max-w-xl pt-2">
                      "Yosh chegarasi faqat raqamlarda. Haqiqiy bilim esa yozgan loyihalaringiz va o'rgatgan shogirdlaringizda aks etadi."
                    </p>
                  </div>

                  {/* Personal Bio Description */}
                  <p className="text-neutral-500 text-sm md:text-base leading-relaxed max-w-xl">
                    Mening ismim <span className="text-black font-semibold">Akramov Anvar</span>. 
                    Men 14 yoshdaman va dasturlash bilan astoydil shug'ullanib kelayotgan professional yosh full-stack dasturchiman. 
                    Tengdoshlarimga murakkab algoritmlar va zamonaviy texnologiyalarni sodda, tushunarli tilda o'rgatish orqali IT sohasiga birinchi qadamlarini qo'yishda yordam bermoqdaman.
                  </p>

                  {/* Buttons and Action triggers */}
                  <div className="flex flex-wrap items-center gap-4 pt-4">
                    <button
                      onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                      className="px-8 py-4 bg-black text-white text-xs uppercase font-semibold tracking-widest rounded-full hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl cursor-pointer flex items-center gap-2"
                    >
                      Loyihalarim <ChevronRight className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => document.getElementById("ai-assistant")?.scrollIntoView({ behavior: "smooth" })}
                      className="px-8 py-4 border border-[#d1d1d6] bg-white text-black text-xs uppercase font-semibold tracking-widest rounded-full hover:bg-neutral-50 hover:border-black transition-all cursor-pointer flex items-center gap-2"
                    >
                      AI Assistant <Brain className="w-4 h-4 text-neutral-500" />
                    </button>
                  </div>

                  {/* Mini statistics summary widget */}
                  <div className="flex space-x-4 pt-10 border-t border-[#e5e5ea] max-w-lg">
                    <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl flex-1">
                      <span className="block text-3xl font-bold mb-1 italic text-black">14</span>
                      <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Yoshim</span>
                    </div>
                    <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl flex-1">
                      <span className="block text-3xl font-bold mb-1 italic text-black">2+ yil</span>
                      <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Tajriba</span>
                    </div>
                    <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl flex-1">
                      <span className="block text-3xl font-bold mb-1 italic text-black">10+</span>
                      <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Loyihalar</span>
                    </div>
                  </div>

                </motion.div>

                {/* Right Design Column: Premium Glass Graphic Card Layout */}
                <div className="lg:col-span-5 relative flex justify-center">
                  
                  {/* Decorative background circle */}
                  <div className="absolute w-72 h-72 rounded-full bg-neutral-100 blur-3xl -top-10 -left-10 pointer-events-none" />
                  <div className="absolute w-72 h-72 rounded-full bg-neutral-200/50 blur-3xl -bottom-10 -right-10 pointer-events-none" />

                  {/* Main Visual Frame - Interactive Dino T-Rex Game */}
                  <DinoGame className="w-full max-w-sm relative z-10 shadow-2xl bg-white border border-[#e5e5ea]" />

                </div>

              </div>
            </section>

            {/* SECTION 2: MEN HAQIMDA (BENTO GRID DESIGN) */}
            <section id="about" className="scroll-mt-24 space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 font-semibold">01 // TARJIMAI HOL VA KO'NIKMALAR</span>
                <h2 className="font-serif text-3xl md:text-5xl font-light text-black tracking-tight">
                  Tizimli ta'lim va chuqur amaliyot.
                </h2>
                <div className="h-0.5 w-12 bg-black mx-auto mt-4" />
              </div>

              {/* Bento Grid layout containing structured info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Bento Card 1: My Path */}
                <div className="bg-[#f7f7f9] border border-[#e5e5ea] rounded-[40px] p-8 md:col-span-2 space-y-6 hover:shadow-xl hover:border-black/20 transition-all group">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-white border border-[#e5e5ea] rounded-xl">
                      <User className="w-6 h-6 text-black" />
                    </div>
                    <span className="font-mono text-xs text-neutral-400">SHAXSIY YO'L</span>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-serif text-2xl font-light text-black">Mening dasturlashdagi yo'lim</h3>
                    <p className="text-sm text-neutral-500 leading-relaxed">
                      Men 12 yoshimda ilk bor veb texnologiyalar olamiga qadam qo'ydim. Boshida faqat kichik o'yinlar va oddiy veb-sahifalar yaratish bilan boshlagan bo'lsam, hozirda professional darajada mukammal full-stack loyihalar yarata olaman. Yosh bo'lishimga qaramay, Yagona Academy kabi yetakchi zamonaviy IT markazlarining metodologiyasi va dizayn uslubidan ilhomlanib, bilimlarimni tizimli tartibga soldim va ularni boshqalarga ulashishga qaror qildim.
                    </p>
                  </div>
                  
                  <div className="border-t border-[#e5e5ea] pt-4 flex flex-wrap gap-3 items-center">
                    <span className="text-xs font-mono text-neutral-400">Asosiy qadriyat:</span>
                    <span className="px-3 py-1 bg-white border border-[#e5e5ea] rounded-full text-xs font-medium text-neutral-600">Doimiy o'rganish</span>
                    <span className="px-3 py-1 bg-white border border-[#e5e5ea] rounded-full text-xs font-medium text-neutral-600">Sodda tushuntirish</span>
                    <span className="px-3 py-1 bg-white border border-[#e5e5ea] rounded-full text-xs font-medium text-neutral-600">Amaliy yondashuv</span>
                  </div>
                </div>

                {/* Bento Card 2: Age Info */}
                <div className="bg-black text-white rounded-[40px] p-8 flex flex-col justify-between relative overflow-hidden group shadow-2xl">
                  {/* Subtle noise/gradient background */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08)_0%,transparent_80%)] pointer-events-none" />
                  
                  <div className="flex justify-between items-start z-10">
                    <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800">
                      <Layers className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-mono text-xs text-neutral-500">HOLAT</span>
                  </div>

                  <div className="space-y-2 z-10 pt-12">
                    <div className="text-5xl font-light font-mono tracking-tight text-white">14 yosh</div>
                    <h3 className="font-serif text-xl font-light text-neutral-200">Katta orzular, aniq amallar.</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Yosh - faqat fikrlash darajasining ko'rsatkichi xolos. Men har kuni yangi g'oyalarni kodga aylantiraman.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-neutral-900 z-10 flex items-center gap-2 text-xs font-mono text-neutral-400">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500" /> O'zbekiston, Surxondaryo, Denov
                  </div>
                </div>

                {/* Bento Card 3: Skills Stack */}
                <div className="bg-[#f7f7f9] border border-[#e5e5ea] rounded-[40px] p-8 space-y-6 hover:shadow-xl hover:border-black/20 transition-all group">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-white border border-[#e5e5ea] rounded-xl">
                      <Code className="w-6 h-6 text-black" />
                    </div>
                    <span className="font-mono text-xs text-neutral-400">STAK // KOD</span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-serif text-xl font-medium text-black">Mening texnologiyalarim</h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      Zamonamizning eng ommabop dasturlash vositalari va tillari.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Tech Skill Progress bars */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span>Frontend (React, TS)</span>
                        <span className="text-neutral-500">82%</span>
                      </div>
                      <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
                        <div className="h-full bg-black rounded-full" style={{ width: "82%" }} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span>Backend (Node, Express)</span>
                        <span className="text-neutral-500">1%</span>
                      </div>
                      <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
                        <div className="h-full bg-black rounded-full" style={{ width: "1%" }} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span>Sun'iy Intellekt integratsiyasi</span>
                        <span className="text-neutral-500">25%</span>
                      </div>
                      <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
                        <div className="h-full bg-black rounded-full" style={{ width: "25%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bento Card 4: Mentorlik */}
                <div className="bg-[#f7f7f9] border border-[#e5e5ea] rounded-[40px] p-8 md:col-span-2 space-y-6 hover:shadow-xl hover:border-black/20 transition-all group">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-white border border-[#e5e5ea] rounded-xl">
                      <BookOpen className="w-6 h-6 text-black" />
                    </div>
                    <span className="font-mono text-xs text-neutral-400">MURABBIYLIK</span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-serif text-2xl font-light text-black">Qanday qilib dars o'taman?</h3>
                    <p className="text-sm text-neutral-500 leading-relaxed">
                      Dasturlashni o'rganish ko'pchilikka qiyin va zerikarli tuyulishi mumkin. Men esa o'z tengdoshlarimning tili va psixologiyasini yaxshi tushungan holda, ularga barcha darslarni qadam-baqadam va oddiy misollar bilan o'taman. Murakkab algoritmlarni vizual va qiziqarli o'yinlarga aylantirish - bu mening dars berish uslubim hisoblanadi.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#e5e5ea]">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-black uppercase tracking-wider">Tizimlilik</h4>
                      <p className="text-xs text-neutral-500">Tartibli va ketma-ket darslar rejasi</p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-black uppercase tracking-wider">Erkinlik</h4>
                      <p className="text-xs text-neutral-500">Xatolardan qo'rqmasdan kod yozish muhiti</p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-black uppercase tracking-wider">Amaliy loyiha</h4>
                      <p className="text-xs text-neutral-500">Birinchi kundan boshlab real kod yozish</p>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* SECTION 3: MY PROJECTS */}
            <section id="projects" className="scroll-mt-24 space-y-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 font-semibold">02 // MUALLIFLIK ISHLARI</span>
                  <h2 className="font-serif text-3xl md:text-5xl font-light text-black tracking-tight">
                    Mening loyihalarim.
                  </h2>
                  <div className="h-0.5 w-12 bg-black mt-2" />
                </div>
                <p className="text-neutral-500 text-sm max-w-md">
                  Har bir loyiha - bu nazariy bilimlarni mustahkamlovchi va hayotiy muammolarga yechim bo'ladigan real amaliyot natijasidir.
                </p>
              </div>

              {/* Projects Grid List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {projects.map((project, idx) => (
                  <motion.div
                    key={project.id}
                    id={`project-card-${project.id}`}
                    className="bg-white border border-[#e5e5ea] hover:border-black rounded-[40px] overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col justify-between group h-full"
                    whileHover={{ y: -8 }}
                  >
                    
                    {/* Visual aspect preview card top */}
                    <div className="h-48 bg-[#f7f7f9] border-b border-[#e5e5ea] p-6 relative flex flex-col justify-between overflow-hidden">
                      {/* background pattern graphic */}
                      <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]" />
                      
                      <div className="flex justify-between items-center z-10">
                        <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-400 bg-white border border-neutral-200 px-2 py-1 rounded">
                          {project.category}
                        </span>
                        <span className="font-mono text-xs text-neutral-400">0{idx + 1}</span>
                      </div>

                      <div className="z-10 flex justify-center py-4">
                        {project.id === "p1" && <Layers className="w-16 h-16 text-black/10 group-hover:text-black/20 group-hover:scale-110 transition-all duration-300" />}
                        {project.id === "p2" && <Brain className="w-16 h-16 text-black/10 group-hover:text-black/20 group-hover:scale-110 transition-all duration-300" />}
                        {project.id === "p3" && <Terminal className="w-16 h-16 text-black/10 group-hover:text-black/20 group-hover:scale-110 transition-all duration-300" />}
                        {project.id === "p4" && <MapPin className="w-16 h-16 text-black/10 group-hover:text-black/20 group-hover:scale-110 transition-all duration-300" />}
                      </div>

                      <div className="flex justify-between items-center z-10">
                        <span className="text-xs font-mono text-neutral-400">YAGONA LEARN</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </div>
                    </div>

                    {/* Description details card body */}
                    <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="font-serif text-xl font-semibold text-black group-hover:text-neutral-700 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      <div className="space-y-4 pt-4">
                        {/* Tech tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {project.tech.map((t, i) => (
                            <span key={i} className="text-[10px] font-mono text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* Action Link inside card */}
                        <div className="border-t border-[#e5e5ea] pt-4 flex justify-between items-center text-xs font-mono">
                          <span className="text-neutral-400 group-hover:text-black transition-colors">KO'RISH</span>
                          <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all cursor-pointer">
                            <ArrowUpRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>

                    </div>

                  </motion.div>
                ))}
              </div>
            </section>

            {/* SECTION 4: INTERACTIVE AI & GOOGLE GEMINI SECTION */}
            <section id="ai-assistant" className="scroll-mt-24 space-y-12">
              
              {/* Heading */}
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 font-semibold">03 // SUN'IY INTELLEKT TAJRIBASI</span>
                <h2 className="font-serif text-3xl md:text-5xl font-light text-black tracking-tight">
                  Google Gemini AI hamkorligi.
                </h2>
                <p className="text-sm text-neutral-500 max-w-lg mx-auto">
                  Veb-saytga integratsiya qilingan aqlli Gemini yordamchisi bilan jonli muloqot qilib ko'ring va tizim qanday ishlashini bilib oling!
                </p>
                <div className="h-0.5 w-12 bg-black mx-auto mt-4" />
              </div>

              {/* Main Interactive AI Sandbox Block */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                
                {/* Column 1: Live Interactive chat (7 cols) */}
                <div className="lg:col-span-7 bg-white border border-[#e5e5ea] rounded-[40px] flex flex-col justify-between overflow-hidden shadow-xl min-h-[620px]">
                  
                  {/* Chat header */}
                  <div className="bg-[#f7f7f9] border-b border-[#e5e5ea] px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white animate-pulse" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2">
                          Anvarning AI Yordamchisi
                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <div className="text-[10px] font-mono text-neutral-400">Model: gemini-2.5-flash (Real-Time)</div>
                      </div>
                    </div>
                    
                    {/* Status widget indicator */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ONLINE API
                      </span>
                    </div>
                  </div>

                  {/* Chat message dialog list */}
                  <div className="flex-grow p-6 overflow-y-auto space-y-4 max-h-[500px]">
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
                              <div className="flex items-center gap-1.5 mb-1.5 border-b border-black/5 pb-1 text-[10px] font-mono text-neutral-400 uppercase font-bold">
                                <Cpu className="w-3 h-3 text-neutral-400" /> GEMINI AI // O'ZBEKISTON
                              </div>
                            )}
                            
                            {/* Simple text formatting replacement for newlines to look great */}
                            <div className="whitespace-pre-line font-light">
                              {msg.text}
                            </div>
                            
                            <div className={`text-[9px] font-mono mt-1.5 text-right ${
                              msg.sender === "user" ? "text-neutral-400" : "text-neutral-400"
                            }`}>
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      {/* Gemini typing loading state */}
                      {aiIsTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-start"
                        >
                          <div className="bg-[#f1f3f5] text-neutral-500 rounded-2xl rounded-tl-none px-4 py-3 border border-[#e5e5ea]">
                            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase font-semibold mb-1">
                              <Sparkles className="w-3.5 h-3.5 animate-spin text-neutral-400" /> Gemini fikrlamoqda
                            </div>
                            <div className="flex gap-1 py-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" />
                              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.2s]" />
                              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.4s]" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div ref={chatEndRef} />
                  </div>

                  {/* Chat input box form */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-[#e5e5ea] bg-neutral-50">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={aiMessageInput}
                        onChange={(e) => setAiMessageInput(e.target.value)}
                        placeholder="Anvar haqida yoki dasturlash bo'yicha savol bering..."
                        className="flex-grow bg-white border border-[#e5e5ea] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-black transition-colors"
                        disabled={aiIsTyping}
                      />
                      <button
                        type="submit"
                        className="px-5 bg-black text-white rounded-xl hover:bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer disabled:bg-neutral-300"
                        disabled={aiIsTyping || !aiMessageInput.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2.5 px-1">
                      <span className="text-[10px] font-mono text-neutral-400">
                        Maslahat: "Anvar necha yoshda?" yoki "React nima?" deb so'rab ko'ring.
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
                        Suhbatni tozalash
                      </button>
                    </div>
                  </form>

                </div>

                {/* Column 2: Holographic AI Core Visualization (5 cols) */}
                <div className="lg:col-span-5 bg-black text-white rounded-[40px] p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                  
                  {/* Glowing blue/amber ambient spheres with animations */}
                  <div className="absolute -right-20 -top-20 w-52 h-52 bg-emerald-500 rounded-full blur-[80px] opacity-30 animate-pulse pointer-events-none" />
                  <div className="absolute -left-20 -bottom-20 w-52 h-52 bg-blue-500 rounded-full blur-[80px] opacity-20 pointer-events-none" />

                  {/* Subtle technical background grid */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:15px_15px] pointer-events-none" />

                  <div className="space-y-8 z-10">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                        <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 font-bold">
                          AI CORE VISUALIZER
                        </span>
                      </div>
                      <span className="font-mono text-[9px] text-emerald-400 animate-pulse">● ENGINE ACTIVE</span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-serif text-2xl font-light text-white">Sun'iy Intellekt Markazi</h3>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Gemini o'ziga xos neyron tarmoq modelining vizual gologrammasi. Quyida drayverlarning dinamik holatini va uning faolligini ko'rishingiz mumkin.
                      </p>
                    </div>

                    {/* Animated Cyber-Orb / Neural Center Visualizer */}
                    <div className="h-48 border border-neutral-800 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden bg-neutral-950/50">
                      
                      {/* Rotating Outer Ring */}
                      <motion.div 
                        className="absolute w-36 h-36 rounded-full border border-dashed border-emerald-500/30"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      />

                      {/* Counter Rotating Ring */}
                      <motion.div 
                        className="absolute w-28 h-28 rounded-full border border-dashed border-blue-500/30"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      />

                      {/* Glowing Pulsing Inner Circle */}
                      <motion.div 
                        className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-tr ${
                          aiIsTyping 
                            ? "from-emerald-500 via-teal-500 to-blue-500 shadow-[0_0_30px_rgba(16,185,129,0.6)]" 
                            : "from-neutral-800 via-neutral-900 to-black shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                        } transition-all duration-500 z-10`}
                        animate={{ scale: aiIsTyping ? [1, 1.15, 1] : [1, 1.05, 1] }}
                        transition={{ duration: aiIsTyping ? 1.5 : 3, repeat: Infinity }}
                      >
                        <Brain className={`w-8 h-8 ${aiIsTyping ? "text-white animate-bounce" : "text-neutral-500"}`} />
                      </motion.div>

                      {/* Dynamic SVG Soundwave/Mindwave lines inside the container */}
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-end gap-1 px-4 h-6">
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1 bg-emerald-500/70 rounded-full"
                            animate={{ 
                              height: aiIsTyping 
                                ? [4, Math.random() * 24 + 4, 4] 
                                : [4, Math.random() * 10 + 4, 4] 
                            }}
                            transition={{ 
                              duration: 0.5 + Math.random() * 0.5, 
                              repeat: Infinity,
                              delay: i * 0.05
                            }}
                          />
                        ))}
                      </div>

                      {/* High Tech Data Readouts */}
                      <div className="absolute top-2 left-3 font-mono text-[8px] text-neutral-500">
                        SYS.FPS: 60 // CONTEXT: 1M
                      </div>
                      <div className="absolute top-2 right-3 font-mono text-[8px] text-neutral-500">
                        LATENCY: {aiIsTyping ? "120ms" : "IDLE"}
                      </div>
                    </div>

                    {/* Technical stats breakdown */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-800/40">
                        <span className="block text-[10px] text-neutral-500 font-mono">MODEL</span>
                        <span className="text-xs font-mono font-bold text-white">Gemini 2.5 Flash</span>
                      </div>
                      <div className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-800/40">
                        <span className="block text-[10px] text-neutral-500 font-mono">STATUS</span>
                        <span className="text-xs font-mono font-bold text-emerald-400">FAOL // ONLINE</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 mt-6 flex justify-between items-center text-xs font-mono text-neutral-400 z-10">
                    <span>XAVFSIZLIK:</span>
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> 
                      Xavfsiz Server Shlyuzi
                    </span>
                  </div>

                </div>

              </div>

            </section>

            {/* SECTION 5: FUTURE ROADMAP / KELAJAK REJALARI */}
            <section className="bg-[#f7f7f9] border border-[#e5e5ea] rounded-3xl p-8 sm:p-12 space-y-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-neutral-200/40 rounded-full blur-3xl pointer-events-none" />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                <div className="lg:col-span-5 space-y-6">
                  <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 font-semibold">KELAJAK // PLAN</span>
                  <h3 className="font-serif text-3xl md:text-4xl font-light text-black tracking-tight leading-tight">
                    Anvarning keyingi marralari va maqsadlari.
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    14 yosh - bu katta yo'lning boshlanishi. Men yaqin kelajakda quyidagi muhim loyihalarni ishga tushirishni va ta'lim tizimini rivojlantirishni maqsad qilganman.
                  </p>
                  <div className="h-0.5 w-12 bg-black mt-2" />
                </div>

                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="bg-white border border-[#e5e5ea] p-6 rounded-[40px] space-y-3 hover:border-black transition-colors">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center font-mono text-xs text-black font-bold">1</div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-black">Mualliflik Kurslari</h4>
                    <p className="text-xs text-neutral-500 leading-normal">
                      Veb-dasturlash bo'yicha tengdoshlar uchun noldan boshlab silliq va bepul video darsliklar seriyasini tayyorlash.
                    </p>
                  </div>

                  <div className="bg-white border border-[#e5e5ea] p-6 rounded-[40px] space-y-3 hover:border-black transition-colors">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center font-mono text-xs text-black font-bold">2</div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-black">Gemini Auto-Grader</h4>
                    <p className="text-xs text-neutral-500 leading-normal">
                      O'quvchilar yozgan kodlardagi xatolarni avtomatik rashta tahlil qiluvchi va baholovchi sun'iy intellekt botini rivojlantirish.
                    </p>
                  </div>

                  <div className="bg-white border border-[#e5e5ea] p-6 rounded-[40px] space-y-3 hover:border-black transition-colors">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center font-mono text-xs text-black font-bold">3</div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-black">Uzbekistan IT Community</h4>
                    <p className="text-xs text-neutral-500 leading-normal">
                      O'smirlar orasida eng faol va do'stona hamjamiyatni tashkil qilish, birgalikda yirik open-source loyihalar yozish.
                    </p>
                  </div>

                  <div className="bg-white border border-[#e5e5ea] p-6 rounded-[40px] space-y-3 hover:border-black transition-colors">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center font-mono text-xs text-black font-bold">4</div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-black">Xalqaro Sertifikatlash</h4>
                    <p className="text-xs text-neutral-500 leading-normal">
                      Full-stack va cloud texnologiyalari bo'yicha yetakchi xalqaro IT sertifikatlarini muvaffaqiyatli topshirish va bilim darajasini isbotlash.
                    </p>
                  </div>

                </div>

              </div>
            </section>

            {/* SECTION 6: CONTACT & ALOQA FORM */}
            <section id="contact" className="scroll-mt-24 space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 font-semibold">04 // HAMKORLIK VA MULOQOT</span>
                <h2 className="font-serif text-3xl md:text-5xl font-light text-black tracking-tight">
                  Keling, birga kod yozamiz.
                </h2>
                <div className="h-0.5 w-12 bg-black mx-auto mt-4" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
                
                {/* Contact info card (5 cols) */}
                <div className="lg:col-span-5 bg-black text-white rounded-[40px] p-8 sm:p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none" />

                  <div className="space-y-8 z-10">
                    <div className="space-y-3">
                      <h3 className="font-serif text-3xl font-light">Sizni eshitishdan xursandman</h3>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Yangi loyihalar, shaxsiy mentorlik darslari yoki hamkorlik g'oyalari bo'lsa, istalgan vaqtda xabar yuborishingiz mumkin. Men imkon qadar tez fursatda javob berishga harakat qilaman.
                      </p>
                    </div>

                    <div className="space-y-4 font-mono text-xs">
                      <div className="flex items-center gap-4 p-3 bg-neutral-900 border border-neutral-800 rounded-xl">
                        <Mail className="w-5 h-5 text-neutral-400" />
                        <div>
                          <div className="text-[10px] text-neutral-500 uppercase tracking-widest">EMAIL MANZIL</div>
                          <div className="text-white mt-0.5 font-medium">yasikouz152@gmail.com</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-3 bg-neutral-900 border border-neutral-800 rounded-xl">
                        <MapPin className="w-5 h-5 text-neutral-400" />
                        <div>
                          <div className="text-[10px] text-neutral-500 uppercase tracking-widest">YAShASh JOYI</div>
                          <div className="text-white mt-0.5 font-medium">O'zbekiston, Toshkent shahar</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-3 bg-neutral-900 border border-neutral-800 rounded-xl">
                        <Clock className="w-5 h-5 text-neutral-400" />
                        <div>
                          <div className="text-[10px] text-neutral-500 uppercase tracking-widest">ALIKhON VAQTI</div>
                          <div className="text-white mt-0.5 font-medium">GMT +5 (Toshkent vaqti)</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-neutral-900 z-10 text-[10px] font-mono text-neutral-500">
                    AKRAMOV ANVAR // BARCHA HUQUQLAR HIMOYaLANGAN 2026
                  </div>

                </div>

                {/* Contact submit form card (7 cols) */}
                <div className="lg:col-span-7 bg-white border border-[#e5e5ea] rounded-[40px] p-8 sm:p-10 shadow-xl flex flex-col justify-center">
                  
                  {formSubmitted ? (
                    <motion.div 
                      id="form-success-alert"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center space-y-4 py-8"
                    >
                      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-black border border-neutral-200">
                        <Check className="w-8 h-8" />
                      </div>
                      <h3 className="font-serif text-2xl font-light text-black">Xabaringiz yuborildi!</h3>
                      <p className="text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed">
                        Akramov Anvarga xabaringiz muvaffaqiyatli yetkazildi. Tez orada siz bilan ko'rsatilgan email orqali bog'lanadi. Rahmat!
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
                            Ism Familyangiz
                          </label>
                          <input
                            type="text"
                            required
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            placeholder="Masalan: Abdullayev Temur"
                            className="w-full bg-neutral-50 border border-[#e5e5ea] rounded-none px-4 py-3.5 text-xs focus:outline-none focus:border-black transition-colors"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
                            Email Manzilingiz
                          </label>
                          <input
                            type="email"
                            required
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value)}
                            placeholder="Masalan: temur@gmail.com"
                            className="w-full bg-neutral-50 border border-[#e5e5ea] rounded-none px-4 py-3.5 text-xs focus:outline-none focus:border-black transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
                          Xabaringiz Matni
                        </label>
                        <textarea
                          required
                          rows={5}
                          value={formMessage}
                          onChange={(e) => setFormMessage(e.target.value)}
                          placeholder="Loyihangiz yoki taklifingiz haqida batafsil yozing..."
                          className="w-full bg-neutral-50 border border-[#e5e5ea] rounded-none px-4 py-3.5 text-xs focus:outline-none focus:border-black transition-colors"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 bg-black text-white text-xs uppercase font-semibold tracking-widest rounded-none hover:bg-neutral-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        Xabarni Yuborish <Send className="w-3.5 h-3.5" />
                      </button>

                    </form>
                  )}

                </div>

              </div>
            </section>

          </main>

          {/* SYSTEM FOOTER */}
          <footer className="border-t border-[#e5e5ea] bg-white mt-32 py-12 text-center text-xs text-neutral-400 font-mono space-y-4">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                AKRAMOV ANVAR // SHAXSIY PORTFOLIO V1.0 (2026)
              </div>
              
              {/* Reference indicator */}
              <div className="flex items-center gap-3">
                <span className="text-[10px]">DIZAYN ILHOMI: YAGONA-ACADEMY.UZ</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                <span className="text-[10px]">YUKLASH STILI: PREMUM ANIMATED LOADER</span>
              </div>
            </div>
          </footer>

        </motion.div>
      )}

    </div>
  );
}
