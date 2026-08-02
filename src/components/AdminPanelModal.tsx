import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, 
  KeyRound, 
  ShieldCheck, 
  LogOut, 
  Save, 
  RotateCcw, 
  X, 
  CheckCircle2, 
  AlertCircle,
  User,
  MapPin,
  Mail,
  Sparkles,
  Target,
  BarChart3,
  Bot,
  FolderPlus,
  Trash2,
  Edit3,
  Globe,
  Github,
  Send,
  Gamepad2,
  Upload,
  Layers,
  Code,
  Phone,
  Share2,
  FileText,
  Sliders,
  Play,
  Sparkle
} from "lucide-react";
import { SiteConfig, Project } from "../types";

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  name: "Akramov Anvar",
  firstName: "Anvar",
  lastName: "Akramov",
  age: "16 yosh",
  location: "O'zbekiston, Surxondaryo",
  email: "yasikouz152@gmail.com",
  phone: "+998 90 123 45 67",
  telegram: "@akramovanvar",
  github: "https://github.com/akramovanvar",
  instagram: "https://instagram.com/akramovanvar",
  badgeText: "<yosh dasturchining portfoliosi>",
  bio: "Mening ismim Akramov Anvar. Men 16 yoshdaman va dasturlash bilan astoydil shug'ullanib kelayotgan professional yosh full-stack dasturchiman. Tengdoshlarimga murakkab algoritmlar va zamonaviy texnologiyalarni sodda, tushunarli tilda o'rgatish orqali IT sohasiga birinchi qadamlarini qo'yishda yordam bermoqdaman.",
  customQuote: "Kod yozish - murakkab g'oyalarni haqiqatga va qulay yechimlarga aylantirish san'atidir.",
  footerText: "© 2026 Akramov Anvar. Barcha huquqlar himoyalangan. Full-Stack & AI Portfolio.",
  skillsFrontend: "React.js, TypeScript, Tailwind CSS, Next.js, HTML5/CSS3, Redux Toolkit",
  skillsBackend: "Node.js, Express.js, REST API, Python, PostgreSQL, MongoDB, WebSockets",
  skillsTools: "Git, GitHub, Vite, Docker, VS Code, Gemini AI SDK, Linux Cloud Run",
  autoReplyText: "Assalomu alaykum! Murojaatingiz uchun rahmat. Tez orada siz bilan bog'lanaman.",
  adminUsername: "admin",
  adminPassword: "admin123",
  stat1Value: "16",
  stat1Label: "Yoshim",
  stat2Value: "1+ Yil",
  stat2Label: "Tajribam",
  stat3Value: "100%",
  stat3Label: "Natija",
  goal1Title: "Ajoyib Dasturlar Yasash",
  goal1Desc: "Men kelajakda insonlar hayotini osonlashtiradigan, yuqori sifatli va foydali ajoyib dasturlar yasayman.",
  goal2Title: "Sun'iy Intellekt Loyihalari",
  goal2Desc: "Gemini va zamonaviy neyron tarmoqlardan foydalanib, avtomatlashtirilgan aqlli AI platformalarni yaratish.",
  goal3Title: "Yosh Dasturchilar Hamjamiyati",
  goal3Desc: "O'zbekistonda yoshlar orasida eng faol va do'stona IT o'quv hamjamiyatini shakllantirish va tengdoshlarga yordam berish.",
  goal4Title: "Xalqaro IT Sertifikatsiyalar",
  goal4Desc: "Full-Stack va zamonaviy veb-arxitektura bo'yicha dunyo miqyosidagi nufuzli IT sertifikatlarini muvaffaqiyatli topshirish.",
  aiCustomKnowledge: "Akramov Anvar 16 yoshda, Surxondaryo viloyatidan. Professional Full-Stack Dasturchi. U React, Node.js va Sun'iy intellekt integratsiyalarini zo'r biladi.",
  gameMultiplier: 1,
  gameInitialLives: 3,
  gameTitle: "CYBER STRIKE 2077",
  customProjects: []
};

interface AdminPanelModalProps {
  isOpen: boolean;
  isLoggedIn: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  onLogout: () => void;
  siteConfig: SiteConfig;
  onSaveConfig: (newConfig: SiteConfig) => void;
}

export default function AdminPanelModal({
  isOpen,
  isLoggedIn,
  onClose,
  onLoginSuccess,
  onLogout,
  siteConfig,
  onSaveConfig,
}: AdminPanelModalProps) {
  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Config editor state
  const [formData, setFormData] = useState<SiteConfig>(siteConfig);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"inbox" | "projects" | "profile" | "banner" | "stats" | "contacts" | "skills" | "siteText" | "goals" | "ai" | "game" | "security">("inbox");
  const [inboxMessages, setInboxMessages] = useState<Array<{ id: string; name: string; email: string; message: string; timestamp: string; status: string }>>([]);
  const [inboxLoading, setInboxLoading] = useState(false);

  // Projects CMS form state
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [projTitle, setProjTitle] = useState("");
  const [projCategory, setProjCategory] = useState("Full-Stack / AI");
  const [projDesc, setProjDesc] = useState("");
  const [projImageUrl, setProjImageUrl] = useState("");
  const [projDemoUrl, setProjDemoUrl] = useState("");
  const [projGithubUrl, setProjGithubUrl] = useState("");
  const [projTech, setProjTech] = useState("React, TypeScript, Node.js");

  const handleSaveProject = () => {
    if (!projTitle.trim()) return;
    const techArray = projTech.split(",").map(t => t.trim()).filter(Boolean);
    const updatedProjects = [...(formData.customProjects || [])];
    
    if (editingProjectId) {
      const idx = updatedProjects.findIndex(p => p.id === editingProjectId);
      if (idx !== -1) {
        updatedProjects[idx] = {
          id: editingProjectId,
          title: projTitle,
          category: projCategory,
          description: projDesc,
          tech: techArray,
          imageUrl: projImageUrl || undefined,
          demoUrl: projDemoUrl || undefined,
          githubUrl: projGithubUrl || undefined,
        };
      }
    } else {
      const newProj: Project = {
        id: `p-${Date.now()}`,
        title: projTitle,
        category: projCategory,
        description: projDesc,
        tech: techArray,
        imageUrl: projImageUrl || undefined,
        demoUrl: projDemoUrl || undefined,
        githubUrl: projGithubUrl || undefined,
      };
      updatedProjects.unshift(newProj);
    }

    const newConfig = { ...formData, customProjects: updatedProjects };
    setFormData(newConfig);
    onSaveConfig(newConfig);

    // Reset form
    setEditingProjectId(null);
    setProjTitle("");
    setProjCategory("Full-Stack / AI");
    setProjDesc("");
    setProjImageUrl("");
    setProjDemoUrl("");
    setProjGithubUrl("");
    setProjTech("React, TypeScript, Node.js");
  };

  const handleEditProject = (p: Project) => {
    setEditingProjectId(p.id);
    setProjTitle(p.title);
    setProjCategory(p.category);
    setProjDesc(p.description);
    setProjImageUrl(p.imageUrl || "");
    setProjDemoUrl(p.demoUrl || "");
    setProjGithubUrl(p.githubUrl || "");
    setProjTech(p.tech.join(", "));
  };

  const handleDeleteProject = (id: string) => {
    const updated = (formData.customProjects || []).filter(p => p.id !== id);
    const newConfig = { ...formData, customProjects: updated };
    setFormData(newConfig);
    onSaveConfig(newConfig);

    if (editingProjectId === id) {
      setEditingProjectId(null);
      setProjTitle("");
      setProjCategory("Full-Stack / AI");
      setProjDesc("");
      setProjImageUrl("");
      setProjDemoUrl("");
      setProjGithubUrl("");
      setProjTech("React, TypeScript, Node.js");
    }
  };

  // AI Test bench state
  const [aiTestPrompt, setAiTestPrompt] = useState("");
  const [aiTestResponse, setAiTestResponse] = useState("");
  const [aiTestLoading, setAiTestLoading] = useState(false);

  // Fetch contact messages when inbox tab is opened or on mount
  const fetchInboxMessages = React.useCallback(async () => {
    try {
      const res = await fetch("/api/contact/list");
      if (res.ok) {
        const data = await res.json();
        setInboxMessages(data.messages || []);
      }
    } catch (err) {
      console.warn("Server inbox fetch failed:", err);
    } finally {
      setInboxLoading(false);
    }
  }, []);

  const handleDeleteInboxMessage = async (id: string) => {
    try {
      await fetch("/api/contact/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      setInboxMessages(prev => prev.filter(m => m.id !== id));
      const saved = localStorage.getItem("anvar_inbox_messages");
      if (saved) {
        const parsed = JSON.parse(saved).filter((m: any) => m.id !== id);
        localStorage.setItem("anvar_inbox_messages", JSON.stringify(parsed));
      }
    } catch (e) {}
  };

  const handleClearAllInbox = async () => {
    if (!window.confirm("Barcha kelgan SMS va murojaatlarni tozalashni xohlaysizmi?")) return;
    try {
      await fetch("/api/contact/clear-all", { method: "POST" });
      setInboxMessages([]);
      localStorage.removeItem("anvar_inbox_messages");
    } catch (e) {}
  };

  const handleRunAiTest = async () => {
    if (!aiTestPrompt.trim()) return;
    setAiTestLoading(true);
    setAiTestResponse("");
    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiTestPrompt, history: [] })
      });
      const data = await res.json();
      if (data.text) {
        setAiTestResponse(data.text);
      } else {
        setAiTestResponse(data.error || "Xatolik yuz berdi.");
      }
    } catch (e: any) {
      setAiTestResponse("Bog'lanish xatosi: " + e.message);
    } finally {
      setAiTestLoading(false);
    }
  };

  React.useEffect(() => {
    if (isLoggedIn && isOpen) {
      setInboxLoading(true);
      fetchInboxMessages();
      // Auto-poll every 4 seconds for live incoming SMS/messages from any phone or PC
      const timer = setInterval(() => {
        fetchInboxMessages();
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [isLoggedIn, isOpen, fetchInboxMessages]);

  // Keep local formData in sync when prop changes
  React.useEffect(() => {
    setFormData(siteConfig);
  }, [siteConfig]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expectedUser = siteConfig.adminUsername || "admin";
    const expectedPass = siteConfig.adminPassword || "admin123";

    if (username.trim() === expectedUser && password.trim() === expectedPass) {
      setLoginError("");
      setUsername("");
      setPassword("");
      onLoginSuccess();
    } else {
      setLoginError("Login yoki parol xato! Qayta urinib ko'ring.");
    }
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  const handleReset = () => {
    if (window.confirm("Barcha ma'lumotlarni dastlabki holatga qaytarishni xohlaysizmi?")) {
      setFormData(DEFAULT_SITE_CONFIG);
      onSaveConfig(DEFAULT_SITE_CONFIG);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-2xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-7xl bg-neutral-950 border border-neutral-800/90 rounded-3xl shadow-2xl overflow-hidden my-2 flex flex-col max-h-[96vh] text-white font-sans"
        >
          {/* Header Bar */}
          <div className="bg-black/90 px-6 py-4 flex items-center justify-between border-b border-neutral-800 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-mono text-base sm:text-lg uppercase font-extrabold tracking-wider text-white flex items-center gap-2">
                  <span>ADMIN PANEL</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono px-2.5 py-0.5 rounded-full font-bold">
                    FULL CMS CONTROL v4.0
                  </span>
                </h3>
                <p className="text-xs font-mono text-neutral-400">
                  {isLoggedIn ? "Saytdagi barcha kontent, xabarlar va sozlamalarni to'liq boshqarish binosi" : "Admin tizimiga kirish oynasi"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isLoggedIn && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-3.5 py-2 bg-neutral-900 border border-neutral-700 hover:border-red-500 hover:bg-red-500/10 text-neutral-300 hover:text-red-400 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Chiqish
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Modal Main Content Container */}
          <div className="flex-grow overflow-y-auto p-6 sm:p-8">
            {!isLoggedIn ? (
              /* LOGIN FORM */
              <form onSubmit={handleLoginSubmit} className="space-y-6 max-w-md mx-auto py-8">
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/30 rounded-3xl flex items-center justify-center mx-auto text-amber-400 shadow-xl shadow-amber-500/10">
                    <KeyRound className="w-10 h-10" />
                  </div>
                  <h4 className="font-serif text-3xl font-bold text-white">Admin Panel</h4>
                  <p className="text-xs text-neutral-400 font-sans">
                    Saytni boshqarish va sozlamalarni o'zgartirish uchun admin login va parolingizni kiriting.
                  </p>
                </div>

                {loginError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/10 border border-red-500/40 rounded-2xl flex items-center gap-3 text-xs text-red-400 font-medium font-mono"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span>{loginError}</span>
                  </motion.div>
                )}

                <div className="space-y-4 font-sans">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold flex items-center gap-2">
                      <User className="w-4 h-4 text-amber-400" /> Login:
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Login kiriting"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-400" /> Parol:
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono transition-colors"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-mono text-xs uppercase font-extrabold tracking-wider rounded-2xl hover:from-amber-400 hover:to-amber-500 transition-all shadow-xl shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5 text-black" /> Tizimga Kirish
                </motion.button>
              </form>
            ) : (
              /* DASHBOARD EDITOR FORM */
              <form onSubmit={handleSaveSubmit} className="space-y-6">
                
                {/* Save Toast Notification */}
                <AnimatePresence>
                  {saveSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-emerald-500 text-black rounded-2xl flex items-center justify-between shadow-2xl font-mono text-xs font-bold"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-black" />
                        <span>O'zgarishlar muvaffaqiyatli saqlandi! Sayt ma'lumotlari yangilandi.</span>
                      </div>
                      <span className="text-[10px] bg-black text-emerald-400 px-3 py-1 rounded-full">REALTIME SYNC</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Sub Navigation Sidebar/Tabs */}
                <div className="flex flex-wrap items-center gap-2 border-b border-neutral-800 pb-4 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab("inbox")}
                    className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer font-bold flex items-center gap-2 relative ${
                      activeTab === "inbox" 
                        ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" 
                        : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    <Mail className="w-4 h-4" /> Kelgan Murojaatlar / SMS
                    {inboxMessages.length > 0 && (
                      <span className="bg-emerald-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {inboxMessages.length}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("projects")}
                    className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer font-bold flex items-center gap-2 relative ${
                      activeTab === "projects" 
                        ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" 
                        : "bg-neutral-900 text-amber-300 border border-amber-500/30 hover:bg-neutral-800"
                    }`}
                  >
                    <FolderPlus className="w-4 h-4 text-amber-400" /> Loyihalar CMS
                    <span className="bg-amber-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {(formData.customProjects || []).length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("banner")}
                    className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer font-bold flex items-center gap-2 ${
                      activeTab === "banner" 
                        ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" 
                        : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    <Sparkles className="w-4 h-4" /> Sayt E'lon Banderi
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("profile")}
                    className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer font-bold flex items-center gap-2 ${
                      activeTab === "profile" 
                        ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" 
                        : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    <User className="w-4 h-4" /> Profil & Tarjimai hol
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("stats")}
                    className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer font-bold flex items-center gap-2 ${
                      activeTab === "stats" 
                        ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" 
                        : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" /> Statistikalar
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("contacts")}
                    className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer font-bold flex items-center gap-2 ${
                      activeTab === "contacts" 
                        ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" 
                        : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    <Share2 className="w-4 h-4" /> Aloqa & Ijtimoiy Tarmoqlar
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("skills")}
                    className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer font-bold flex items-center gap-2 ${
                      activeTab === "skills" 
                        ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" 
                        : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    <Code className="w-4 h-4" /> Ko'nikmalar & Texnologiyalar
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("siteText")}
                    className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer font-bold flex items-center gap-2 ${
                      activeTab === "siteText" 
                        ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" 
                        : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    <FileText className="w-4 h-4" /> Ibora, Footer & Avto-Javob
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("goals")}
                    className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer font-bold flex items-center gap-2 ${
                      activeTab === "goals" 
                        ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" 
                        : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    <Target className="w-4 h-4" /> Maqsadlar
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("ai")}
                    className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer font-bold flex items-center gap-2 ${
                      activeTab === "ai" 
                        ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" 
                        : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    <Bot className="w-4 h-4" /> AI Assistent Sozlamasi
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("game")}
                    className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer font-bold flex items-center gap-2 ${
                      activeTab === "game" 
                        ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" 
                        : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    <Gamepad2 className="w-4 h-4" /> O'yin Sozlamalari
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("security")}
                    className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer font-bold flex items-center gap-2 ${
                      activeTab === "security" 
                        ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" 
                        : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    <Lock className="w-4 h-4" /> Parol & Xavfsizlik
                  </button>
                </div>

                {/* TAB 0-A: INBOX MESSAGES */}
                {activeTab === "inbox" && (
                  <div className="space-y-4 font-mono text-xs">
                    <div className="flex flex-wrap justify-between items-center bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800 gap-3">
                      <div>
                        <h4 className="font-bold text-sm text-white flex items-center gap-2">
                          <Mail className="w-4 h-4 text-amber-400" /> Kelgan SMS va Murojaatlar jurnali
                        </h4>
                        <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                          Foydalanuvchilar (telefon yoki kompyuter) tomonidan yuborilgan barcha xabarlar 100% bu yerga keladi va saqlanadi. (Har 4 soniyada avto-yangilanadi)
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={fetchInboxMessages}
                          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Yangilash
                        </button>
                        {inboxMessages.length > 0 && (
                          <button
                            type="button"
                            onClick={handleClearAllInbox}
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Tozalash
                          </button>
                        )}
                      </div>
                    </div>

                    {inboxLoading ? (
                      <div className="p-8 text-center text-neutral-500 font-mono">
                        Xabarlar yuklanmoqda...
                      </div>
                    ) : inboxMessages.length === 0 ? (
                      <div className="p-12 text-center bg-neutral-900/40 rounded-2xl border border-neutral-800 space-y-2">
                        <Mail className="w-10 h-10 text-neutral-600 mx-auto" />
                        <div className="text-neutral-400 font-bold">Hozircha kelgan yangi xabar yo'q</div>
                        <p className="text-[11px] text-neutral-500 max-w-sm mx-auto font-sans">
                          Telefon yoki veb brauzerdan yozilgan har qanday SMS yoki murojaatlar bu yerda avtomatik 100% paydo bo'ladi.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                        {inboxMessages.map((msg, idx) => (
                          <div 
                            key={msg.id || idx}
                            className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-2.5 hover:border-amber-500/50 transition-colors"
                          >
                            <div className="flex flex-wrap justify-between items-center gap-2 border-b border-neutral-800 pb-2">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="font-bold text-white text-sm">{msg.name}</span>
                                <span className="text-[11px] text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                                  {msg.email}
                                </span>
                              </div>
                              <span className="text-[10px] text-neutral-500 font-mono">
                                {new Date(msg.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <div className="text-neutral-200 text-xs font-sans whitespace-pre-line leading-relaxed bg-black/40 p-3 rounded-xl border border-neutral-800/80">
                              {msg.message}
                            </div>
                            <div className="flex justify-between items-center pt-1 text-[10px]">
                              <span className="text-emerald-400 font-bold flex items-center gap-1 font-mono">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {msg.status || "Yetkazildi"}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteInboxMessage(msg.id)}
                                  className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-colors flex items-center gap-1 font-bold cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" /> O'chirish
                                </button>
                                <a
                                  href={`mailto:${msg.email}?subject=Re:%20Akramov%20Anvar%20Portfoliosi`}
                                  className="px-3 py-1 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  <Send className="w-3 h-3" /> Javob Berish
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 0-PROJECTS: LOYIHALAR CMS EDITOR */}
                {activeTab === "projects" && (
                  <div className="space-y-6 font-mono text-xs">
                    {/* Header Banner */}
                    <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                          <FolderPlus className="w-4 h-4 text-amber-400" /> Shaxsiy Loyihalarni Boshqarish (Projects CMS)
                        </h4>
                        <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                          Ushbu bo'lim orqali yaratgan loyihalaringiz nomi, tavsifi, rasmi hamda havola (link)larini bir necha soniyada qo'shishingiz va tahrirlashingiz mumkin.
                        </p>
                      </div>
                      {editingProjectId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProjectId(null);
                            setProjTitle("");
                            setProjCategory("Full-Stack / AI");
                            setProjDesc("");
                            setProjImageUrl("");
                            setProjDemoUrl("");
                            setProjGithubUrl("");
                            setProjTech("React, TypeScript, Node.js");
                          }}
                          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-bold cursor-pointer"
                        >
                          + Yangi loyiha qo'shish rejimiga o'tish
                        </button>
                      )}
                    </div>

                    {/* Project Creator / Editor Box */}
                    <div className="bg-black p-5 rounded-2xl border border-amber-500/30 space-y-4">
                      <h5 className="font-bold text-amber-400 text-xs uppercase flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-amber-400" />
                        {editingProjectId ? "Loyihani Tahrirlash" : "Yangi Loyiha Qo'shish Forma Formati"}
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-neutral-400 font-bold uppercase">Loyiha Nomi (Sarlavha): *</label>
                          <input
                            type="text"
                            placeholder="Masalan: AI Chat Assistant, Online Edu Platform..."
                            value={projTitle}
                            onChange={(e) => setProjTitle(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-neutral-400 font-bold uppercase">Kategoriya:</label>
                          <input
                            type="text"
                            placeholder="Full-Stack / AI, Game Dev, Mobile App, Web Design..."
                            value={projCategory}
                            onChange={(e) => setProjCategory(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-neutral-400 font-bold uppercase">Loyiha Haqida Qisqa Tavsif:</label>
                        <textarea
                          rows={3}
                          placeholder="Loyiha nima vazifa bajaradi, nima uchun foydali va qanday imkoniyatlarga ega..."
                          value={projDesc}
                          onChange={(e) => setProjDesc(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-neutral-400 font-bold uppercase">Veb-sayt / Demo Linki (Demo URL):</label>
                          <input
                            type="text"
                            placeholder="https://myproject.com yoki #"
                            value={projDemoUrl}
                            onChange={(e) => setProjDemoUrl(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-neutral-400 font-bold uppercase">GitHub / Manba Kodingiz Linki:</label>
                          <input
                            type="text"
                            placeholder="https://github.com/username/repository"
                            value={projGithubUrl}
                            onChange={(e) => setProjGithubUrl(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-neutral-400 font-bold uppercase">Texnologiyalar (Vergul bilan ajrating):</label>
                        <input
                          type="text"
                          placeholder="React, TypeScript, Node.js, Express, Tailwind CSS"
                          value={projTech}
                          onChange={(e) => setProjTech(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      {/* Image URL & Preset Selection */}
                      <div className="space-y-2 pt-2 border-t border-neutral-800">
                        <label className="text-neutral-400 font-bold uppercase flex items-center gap-2">
                          <Globe className="w-4 h-4 text-sky-400" /> Loyiha Rasmi (Image URL yoki tayyor rasmlardan birini tanlang):
                        </label>
                        <input
                          type="text"
                          placeholder="https://images.unsplash.com/... yoki tayyor rasmlarga bosing"
                          value={projImageUrl}
                          onChange={(e) => setProjImageUrl(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        />

                        {/* Presets */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          <span className="text-[10px] text-neutral-500 font-sans">Tayyor rasmlar:</span>
                          {[
                            { name: "🤖 AI Mesh", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop" },
                            { name: "🎮 Cyber Gaming", url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop" },
                            { name: "💻 Dashboard", url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop" },
                            { name: "📱 Mobile App", url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000&auto=format&fit=crop" },
                            { name: "🛍️ E-Commerce", url: "https://images.unsplash.com/photo-1556742049-0a67568d0d9f?q=80&w=1000&auto=format&fit=crop" },
                            { name: "⚡ Coding Code", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop" }
                          ].map((p, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setProjImageUrl(p.url)}
                              className="text-[10px] bg-neutral-900 hover:bg-neutral-800 text-amber-300 px-2.5 py-1 rounded-lg border border-neutral-800 cursor-pointer"
                            >
                              {p.name}
                            </button>
                          ))}
                        </div>

                        {/* Image Preview Box */}
                        {projImageUrl && (
                          <div className="relative h-32 w-full max-w-sm rounded-xl overflow-hidden border border-neutral-800 mt-2">
                            <img src={projImageUrl} alt="Preview" className="w-full h-full object-cover" />
                            <span className="absolute bottom-1 left-2 bg-black/80 text-amber-300 text-[9px] px-2 py-0.5 rounded font-mono font-bold">
                              Rasm Ko'rinishi
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Add/Save Project Action Button */}
                      <button
                        type="button"
                        onClick={handleSaveProject}
                        disabled={!projTitle.trim()}
                        className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-40 text-black font-extrabold rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/20 text-xs font-mono flex items-center justify-center gap-2"
                      >
                        <FolderPlus className="w-4 h-4 text-black" />
                        {editingProjectId ? "Loyihani Yangilash (Saqlash)" : "Yangi Loyihani Portfolioga Qo'shish"}
                      </button>
                    </div>

                    {/* EXISTING PROJECTS LIST */}
                    <div className="space-y-3 pt-4 border-t border-neutral-800">
                      <div className="flex justify-between items-center">
                        <h5 className="font-bold text-white text-xs uppercase flex items-center gap-2">
                          <Layers className="w-4 h-4 text-emerald-400" /> Hozirgi Qo'shilgan Loyihalarim ({(formData.customProjects || []).length} ta)
                        </h5>
                      </div>

                      {(formData.customProjects || []).length === 0 ? (
                        <div className="p-8 text-center text-neutral-500 bg-neutral-900/50 rounded-2xl border border-neutral-800">
                          Hali hech qanday loyiha qo'shilmagan. Yuqoridagi formadan foydalanib birinchi loyihangizni qo'shing!
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(formData.customProjects || []).map((proj) => (
                            <div
                              key={proj.id}
                              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-neutral-700 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                  <span className="text-[9px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                                    {proj.category}
                                  </span>
                                  <h6 className="font-bold text-white text-sm mt-1">{proj.title}</h6>
                                  <p className="text-[11px] text-neutral-400 font-sans line-clamp-2">{proj.description}</p>
                                </div>
                                {proj.imageUrl && (
                                  <img
                                    src={proj.imageUrl}
                                    alt={proj.title}
                                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-neutral-800"
                                  />
                                )}
                              </div>

                              <div className="flex flex-wrap gap-1">
                                {proj.tech.map((t, i) => (
                                  <span key={i} className="text-[9px] bg-black text-neutral-400 px-2 py-0.5 rounded border border-neutral-800 font-mono">
                                    #{t}
                                  </span>
                                ))}
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                                <span className="text-[10px] text-neutral-500 font-mono">ID: {proj.id}</span>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleEditProject(proj)}
                                    className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                                  >
                                    <Edit3 className="w-3 h-3" /> Tahrirlash
                                  </button>

                                  {confirmDeleteId === proj.id ? (
                                    <div className="flex items-center gap-1 bg-red-950/80 p-1 rounded-lg border border-red-500/50">
                                      <span className="text-[9px] text-red-200 font-bold px-1">O'chirilsinmi?</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          handleDeleteProject(proj.id);
                                          setConfirmDeleteId(null);
                                        }}
                                        className="px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white rounded font-extrabold text-[9px] cursor-pointer shadow"
                                      >
                                        Ha
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setConfirmDeleteId(null)}
                                        className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded font-bold text-[9px] cursor-pointer"
                                      >
                                        Yo'q
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setConfirmDeleteId(proj.id)}
                                      className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                                    >
                                      <Trash2 className="w-3 h-3" /> O'chirish
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 0-B: ANNOUNCEMENT BANNER */}
                {activeTab === "banner" && (
                  <div className="space-y-4 font-mono text-xs">
                    <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-white text-sm flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-400" /> Sayt Yuqori E'lon Banderi
                          </h4>
                          <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                            Saytning eng tepa qismida ko'rinadigan maxsus e'lon va bildirishnoma matni
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!formData.showBanner}
                            onChange={(e) => setFormData({ ...formData, showBanner: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                        </label>
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <label className="text-neutral-400 font-bold uppercase">E'lon Matni:</label>
                        <input
                          type="text"
                          value={formData.bannerText || "🔥 Akramov Anvar - 15 yoshli Full-Stack Dasturchi va AI Assistent platformasiga xush kelibsiz!"}
                          onChange={(e) => setFormData({ ...formData, bannerText: e.target.value })}
                          placeholder="E'lon matnini kiriting..."
                          className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 1: PROFILE INFO */}
                {activeTab === "profile" && (
                  <div className="space-y-4 font-mono text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-neutral-400 font-bold uppercase">To'liq Ism Familya:</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-neutral-400 font-bold uppercase">Ism (First Name):</label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-neutral-400 font-bold uppercase">Familiya (Last Name):</label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-neutral-400 font-bold uppercase">Yosh:</label>
                        <input
                          type="text"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-neutral-400 font-bold uppercase">Yashash Joyi / Manzil:</label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-neutral-400 font-bold uppercase">Email Manzil:</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-neutral-400 font-bold uppercase">Telegram:</label>
                        <input
                          type="text"
                          value={formData.telegram || ""}
                          onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-neutral-400 font-bold uppercase">GitHub Link:</label>
                        <input
                          type="text"
                          value={formData.github || ""}
                          onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-neutral-400 font-bold uppercase">Yuqori Badge Matni:</label>
                        <input
                          type="text"
                          value={formData.badgeText}
                          onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-neutral-400 font-bold uppercase">Bosh Sahifadagi Tarjimai Hol (Bio):</label>
                      <textarea
                        rows={4}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 2: STATS */}
                {activeTab === "stats" && (
                  <div className="space-y-4 font-mono text-xs">
                    <p className="text-neutral-400 font-sans">
                      Hero bo'limidagi 3 ta statistika ko'rsatkichlarini jonli tahrirlang:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Stat 1 */}
                      <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2">
                        <span className="font-bold text-amber-400">1-Karta (Yosh)</span>
                        <input
                          type="text"
                          placeholder="Qiymat (masalan: 15)"
                          value={formData.stat1Value}
                          onChange={(e) => setFormData({ ...formData, stat1Value: e.target.value })}
                          className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                        <input
                          type="text"
                          placeholder="Nomlanishi (masalan: Yoshim)"
                          value={formData.stat1Label}
                          onChange={(e) => setFormData({ ...formData, stat1Label: e.target.value })}
                          className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      {/* Stat 2 */}
                      <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2">
                        <span className="font-bold text-amber-400">2-Karta (Tajriba)</span>
                        <input
                          type="text"
                          placeholder="Qiymat (masalan: 1+ Yil)"
                          value={formData.stat2Value}
                          onChange={(e) => setFormData({ ...formData, stat2Value: e.target.value })}
                          className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                        <input
                          type="text"
                          placeholder="Nomlanishi (masalan: Tajribam)"
                          value={formData.stat2Label}
                          onChange={(e) => setFormData({ ...formData, stat2Label: e.target.value })}
                          className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      {/* Stat 3 */}
                      <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2">
                        <span className="font-bold text-amber-400">3-Karta (Natija)</span>
                        <input
                          type="text"
                          placeholder="Qiymat (masalan: 100%)"
                          value={formData.stat3Value}
                          onChange={(e) => setFormData({ ...formData, stat3Value: e.target.value })}
                          className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                        <input
                          type="text"
                          placeholder="Nomlanishi (masalan: Natija)"
                          value={formData.stat3Label}
                          onChange={(e) => setFormData({ ...formData, stat3Label: e.target.value })}
                          className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: CONTACTS & SOCIAL LINKS */}
                {activeTab === "contacts" && (
                  <div className="space-y-4 font-mono text-xs">
                    <p className="text-neutral-400 font-sans">
                      Saytdagi barcha ijtimoiy tarmoqlar, aloqa kanallari va bog'lanish ma'lumotlarini boshqaring:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-neutral-400 font-bold uppercase flex items-center gap-1.5">
                          <Send className="w-3.5 h-3.5 text-sky-400" /> Telegram Username / Link:
                        </label>
                        <input
                          type="text"
                          value={formData.telegram || ""}
                          onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                          placeholder="@akramovanvar"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-neutral-400 font-bold uppercase flex items-center gap-1.5">
                          <Github className="w-3.5 h-3.5 text-purple-400" /> GitHub Profil Linki:
                        </label>
                        <input
                          type="text"
                          value={formData.github || ""}
                          onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                          placeholder="https://github.com/akramovanvar"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-neutral-400 font-bold uppercase flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-pink-400" /> Instagram Linki:
                        </label>
                        <input
                          type="text"
                          value={formData.instagram || ""}
                          onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                          placeholder="https://instagram.com/akramovanvar"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-neutral-400 font-bold uppercase flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-emerald-400" /> Telefon Raqam:
                        </label>
                        <input
                          type="text"
                          value={formData.phone || ""}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+998 90 123 45 67"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-neutral-400 font-bold uppercase flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-amber-400" /> Rasmiy Email:
                        </label>
                        <input
                          type="email"
                          value={formData.email || ""}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="yasikouz152@gmail.com"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-neutral-400 font-bold uppercase flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-red-400" /> Joylashuv / Manzil:
                        </label>
                        <input
                          type="text"
                          value={formData.location || ""}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="O'zbekiston, Surxondaryo, Denov"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: SKILLS & TECH STACK */}
                {activeTab === "skills" && (
                  <div className="space-y-4 font-mono text-xs">
                    <p className="text-neutral-400 font-sans">
                      Portfolioda ko'rinadigan texnologiyalar va ko'nikmalar ro'yxatini tahrirlang (vergul bilan ajratilgan):
                    </p>

                    <div className="space-y-4">
                      <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2">
                        <label className="font-bold text-amber-400 uppercase flex items-center gap-2">
                          <Code className="w-4 h-4 text-amber-400" /> Frontend Texnologiyalari:
                        </label>
                        <input
                          type="text"
                          value={formData.skillsFrontend || ""}
                          onChange={(e) => setFormData({ ...formData, skillsFrontend: e.target.value })}
                          placeholder="React.js, TypeScript, Tailwind CSS, Next.js..."
                          className="w-full bg-black border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>

                      <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2">
                        <label className="font-bold text-emerald-400 uppercase flex items-center gap-2">
                          <Layers className="w-4 h-4 text-emerald-400" /> Backend Texnologiyalari:
                        </label>
                        <input
                          type="text"
                          value={formData.skillsBackend || ""}
                          onChange={(e) => setFormData({ ...formData, skillsBackend: e.target.value })}
                          placeholder="Node.js, Express.js, REST API, Python, PostgreSQL..."
                          className="w-full bg-black border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>

                      <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2">
                        <label className="font-bold text-purple-400 uppercase flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-400" /> Asboblar & Cloud AI:
                        </label>
                        <input
                          type="text"
                          value={formData.skillsTools || ""}
                          onChange={(e) => setFormData({ ...formData, skillsTools: e.target.value })}
                          placeholder="Git, Vite, Docker, VS Code, Gemini AI SDK..."
                          className="w-full bg-black border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: SITE TEXT, FOOTER & AUTO-REPLY */}
                {activeTab === "siteText" && (
                  <div className="space-y-4 font-mono text-xs">
                    <p className="text-neutral-400 font-sans">
                      Saytdagi shior (quote), footer mualliflik matni va avto-javob xabarini sozlashingiz mumkin:
                    </p>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-amber-400 font-bold uppercase flex items-center gap-2">
                          <FileText className="w-4 h-4 text-amber-400" /> Shior / Motto (Custom Quote):
                        </label>
                        <textarea
                          rows={2}
                          value={formData.customQuote || ""}
                          onChange={(e) => setFormData({ ...formData, customQuote: e.target.value })}
                          placeholder="Kod yozish - murakkab g'oyalarni haqiqatga va qulay yechimlarga aylantirish san'atidir."
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-amber-400 font-bold uppercase flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Footer Mualliflik Matni:
                        </label>
                        <input
                          type="text"
                          value={formData.footerText || ""}
                          onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                          placeholder="© 2026 Akramov Anvar. Barcha huquqlar himoyalangan."
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-amber-400 font-bold uppercase flex items-center gap-2">
                          <Send className="w-4 h-4 text-sky-400" /> Murojaat Yuborilgandagi Avto-Tasdiq Matni:
                        </label>
                        <textarea
                          rows={2}
                          value={formData.autoReplyText || ""}
                          onChange={(e) => setFormData({ ...formData, autoReplyText: e.target.value })}
                          placeholder="Assalomu alaykum! Murojaatingiz uchun rahmat. Tez orada siz bilan bog'lanaman."
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: GOALS */}
                {activeTab === "goals" && (
                  <div className="space-y-4 font-mono text-xs">
                    <p className="text-neutral-400 font-sans">
                      "Maqsadlarim" bo'limidagi 4 ta marra va rejalarni o'zgartiring:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Goal 1 */}
                      <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2">
                        <span className="font-bold text-amber-400">1-Marra</span>
                        <input
                          type="text"
                          value={formData.goal1Title}
                          onChange={(e) => setFormData({ ...formData, goal1Title: e.target.value })}
                          className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-500"
                        />
                        <textarea
                          rows={2}
                          value={formData.goal1Desc}
                          onChange={(e) => setFormData({ ...formData, goal1Desc: e.target.value })}
                          className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                        />
                      </div>

                      {/* Goal 2 */}
                      <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2">
                        <span className="font-bold text-amber-400">2-Marra</span>
                        <input
                          type="text"
                          value={formData.goal2Title}
                          onChange={(e) => setFormData({ ...formData, goal2Title: e.target.value })}
                          className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-500"
                        />
                        <textarea
                          rows={2}
                          value={formData.goal2Desc}
                          onChange={(e) => setFormData({ ...formData, goal2Desc: e.target.value })}
                          className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                        />
                      </div>

                      {/* Goal 3 */}
                      <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2">
                        <span className="font-bold text-amber-400">3-Marra</span>
                        <input
                          type="text"
                          value={formData.goal3Title}
                          onChange={(e) => setFormData({ ...formData, goal3Title: e.target.value })}
                          className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-500"
                        />
                        <textarea
                          rows={2}
                          value={formData.goal3Desc}
                          onChange={(e) => setFormData({ ...formData, goal3Desc: e.target.value })}
                          className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                        />
                      </div>

                      {/* Goal 4 */}
                      <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2">
                        <span className="font-bold text-amber-400">4-Marra</span>
                        <input
                          type="text"
                          value={formData.goal4Title}
                          onChange={(e) => setFormData({ ...formData, goal4Title: e.target.value })}
                          className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-500"
                        />
                        <textarea
                          rows={2}
                          value={formData.goal4Desc}
                          onChange={(e) => setFormData({ ...formData, goal4Desc: e.target.value })}
                          className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: AI KNOWLEDGE & LIVE PLAYGROUND */}
                {activeTab === "ai" && (
                  <div className="space-y-6 font-mono text-xs">
                    <div className="space-y-2">
                      <label className="text-amber-400 font-bold uppercase flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" /> AI Assistent Bilimlar Bazasi (System Context):
                      </label>
                      <p className="text-neutral-400 font-sans">
                        Saytdagi Gemini 2.5 AI va qisqa javob generatori ushbu kontekst asosida muloqot qiladi:
                      </p>
                      <textarea
                        rows={5}
                        value={formData.aiCustomKnowledge}
                        onChange={(e) => setFormData({ ...formData, aiCustomKnowledge: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-sans leading-relaxed"
                      />
                    </div>

                    {/* LIVE AI PLAYGROUND / TEST BENCH */}
                    <div className="p-4 bg-black border border-neutral-800 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                        <h4 className="font-bold text-white text-xs uppercase flex items-center gap-2">
                          <Bot className="w-4 h-4 text-purple-400 animate-pulse" /> Jonli AI Sinov Xonasi (Live Test Bench)
                        </h4>
                        <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full font-bold border border-purple-500/20">
                          Gemini 2.5 Flash Active
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-[10px] text-neutral-400">Tezkor promptlar:</span>
                          <button
                            type="button"
                            onClick={() => setAiTestPrompt("Anvar kim va u qanday proyektlar qiladi?")}
                            className="text-[10px] bg-neutral-900 hover:bg-neutral-800 text-amber-300 px-2 py-0.5 rounded border border-neutral-800 cursor-pointer"
                          >
                            "Anvar kim?"
                          </button>
                          <button
                            type="button"
                            onClick={() => setAiTestPrompt("Frontend va Full-stack bo'yicha maslahat ber")}
                            className="text-[10px] bg-neutral-900 hover:bg-neutral-800 text-sky-300 px-2 py-0.5 rounded border border-neutral-800 cursor-pointer"
                          >
                            "Full-Stack maslahat"
                          </button>
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="AIdan nimadir so'rab sinab ko'ring..."
                            value={aiTestPrompt}
                            onChange={(e) => setAiTestPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleRunAiTest()}
                            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                          />
                          <button
                            type="button"
                            onClick={handleRunAiTest}
                            disabled={aiTestLoading}
                            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-600/20"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" /> Sinash
                          </button>
                        </div>
                      </div>

                      {/* AI Response Preview */}
                      {(aiTestLoading || aiTestResponse) && (
                        <div className="p-3.5 bg-neutral-950 border border-neutral-900 rounded-xl space-y-2 font-sans text-xs">
                          <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono border-b border-neutral-900 pb-1">
                            <span>AIning Javobi:</span>
                            {aiTestLoading ? (
                              <span className="text-purple-400 animate-pulse">Generatsiya qilinmoqda...</span>
                            ) : (
                              <span className="text-emerald-400 font-bold">200 OK (0.2s)</span>
                            )}
                          </div>
                          <p className="text-neutral-200 leading-relaxed whitespace-pre-wrap">
                            {aiTestResponse || "Generatsiya..."}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 6: GAME SETTINGS */}
                {activeTab === "game" && (
                  <div className="space-y-4 font-mono text-xs">
                    <p className="text-neutral-400 font-sans">
                      Cyber Strike 2077 Arcade o'yini parametrlarini sozlashingiz mumkin:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-neutral-400 font-bold uppercase">O'yin Nomi:</label>
                        <input
                          type="text"
                          value={formData.gameTitle || "CYBER STRIKE 2077"}
                          onChange={(e) => setFormData({ ...formData, gameTitle: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-neutral-400 font-bold uppercase">Ball Ko'paytirgichi (Score Multiplier):</label>
                        <input
                          type="number"
                          step="0.5"
                          min="1"
                          max="10"
                          value={formData.gameMultiplier || 1}
                          onChange={(e) => setFormData({ ...formData, gameMultiplier: parseFloat(e.target.value) || 1 })}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 7: SECURITY */}
                {activeTab === "security" && (
                  <div className="space-y-4 font-mono text-xs max-w-md">
                    <h4 className="font-bold text-amber-400 flex items-center gap-2">
                      <Lock className="w-4 h-4" /> Admin Kirish Malumotlarini Yangilash
                    </h4>

                    <div className="space-y-1.5">
                      <label className="text-neutral-400 font-bold uppercase">Yangi Admin Login:</label>
                      <input
                        type="text"
                        value={formData.adminUsername || "admin"}
                        onChange={(e) => setFormData({ ...formData, adminUsername: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-neutral-400 font-bold uppercase">Yangi Admin Parol:</label>
                      <input
                        type="text"
                        value={formData.adminPassword || "admin123"}
                        onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                )}

                {/* Bottom Action Bar */}
                <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-neutral-800"
                    >
                      <RotateCcw className="w-4 h-4 text-neutral-400" /> Dastlabki holat
                    </button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black uppercase font-extrabold tracking-wider rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all shadow-xl shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4 text-black" /> O'zgarishlarni Saqlash (100% Sync)
                  </motion.button>
                </div>

              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
