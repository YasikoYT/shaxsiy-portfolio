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
  Download,
  Upload,
  Layers,
  Code
} from "lucide-react";
import { SiteConfig, Project } from "../types";

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  name: "Akramov Anvar",
  firstName: "Anvar",
  lastName: "Akramov",
  age: "15 yosh",
  location: "O'zbekiston, Surxondaryo, Denov",
  email: "yasikouz152@gmail.com",
  telegram: "@akramovanvar",
  github: "https://github.com/akramovanvar",
  instagram: "https://instagram.com/akramovanvar",
  badgeText: "<yosh dasturchining portfoliosi>",
  bio: "Mening ismim Akramov Anvar. Men 15 yoshdaman va dasturlash bilan astoydil shug'ullanib kelayotgan professional yosh full-stack dasturchiman. Tengdoshlarimga murakkab algoritmlar va zamonaviy texnologiyalarni sodda, tushunarli tilda o'rgatish orqali IT sohasiga birinchi qadamlarini qo'yishda yordam bermoqdaman.",
  adminUsername: "admin",
  adminPassword: "admin123",
  stat1Value: "15",
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
  aiCustomKnowledge: "Akramov Anvar 15 yoshda, Surxondaryo Denov tumanidan. Professional Full-Stack Dasturchi. U React, Node.js va Sun'iy intellekt integratsiyalarini zo'r biladi.",
  gameMultiplier: 1,
  gameInitialLives: 3,
  gameTitle: "CYBER STRIKE 2077",
  customProjects: [
    {
      id: "p1",
      title: "AI Chat Ecosystem",
      category: "Full-Stack / AI",
      description: "Gemini AI va Node.js Express orqali ishlaydigan aqlli sun'iy intellekt ekotizimi va ovozli o'zbekcha AI chat.",
      tech: ["React", "TypeScript", "Node.js", "Gemini AI", "Tailwind CSS"],
      demoUrl: "#",
      githubUrl: "#"
    },
    {
      id: "p2",
      title: "Cyber Strike Arcade Engine",
      category: "Game Dev",
      description: "60 FPS Canvas va Web Audio API asosida tayyorlangan koinot urushi arcade o'yini.",
      tech: ["HTML5 Canvas", "TypeScript", "Web Audio API"],
      demoUrl: "#",
      githubUrl: "#"
    }
  ]
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
  const [activeTab, setActiveTab] = useState<"profile" | "stats" | "projects" | "goals" | "ai" | "game" | "security">("profile");

  // Custom project modal inside CMS
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: "",
    category: "Full-Stack",
    description: "",
    tech: ["React", "TypeScript"]
  });

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

  // Add project to CMS
  const handleAddProject = () => {
    if (!newProject.title || !newProject.description) return;
    const projectToAdd: Project = {
      id: `p-${Date.now()}`,
      title: newProject.title || "Yangi Loyiha",
      category: newProject.category || "Full-Stack",
      description: newProject.description || "",
      tech: newProject.tech || ["React", "Node.js"],
      demoUrl: newProject.demoUrl || "#",
      githubUrl: newProject.githubUrl || "#"
    };

    const updatedProjects = [...(formData.customProjects || []), projectToAdd];
    setFormData({ ...formData, customProjects: updatedProjects });
    setNewProject({ title: "", category: "Full-Stack", description: "", tech: ["React", "TypeScript"] });
  };

  // Delete project from CMS
  const handleDeleteProject = (id: string) => {
    const updated = (formData.customProjects || []).filter(p => p.id !== id);
    setFormData({ ...formData, customProjects: updated });
  };

  // Export JSON Backup
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `anvar_portfolio_config_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-6xl bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh] text-white font-sans"
        >
          {/* Header Bar */}
          <div className="bg-black px-6 py-4 flex items-center justify-between border-b border-neutral-800 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-mono text-sm sm:text-base uppercase font-extrabold tracking-wider text-white flex items-center gap-2">
                  <span>ADMIN PANEL</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono px-2 py-0.5 rounded-full font-bold">
                    PRO CMS v3.0
                  </span>
                </h3>
                <p className="text-xs font-mono text-neutral-400">
                  {isLoggedIn ? "Saytdagi barcha kontent va sozlamalarni jonli boshqarish" : "Admin tizimiga kirish oynasi"}
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
                    onClick={() => setActiveTab("projects")}
                    className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer font-bold flex items-center gap-2 ${
                      activeTab === "projects" 
                        ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" 
                        : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    <FolderPlus className="w-4 h-4" /> Loyihalar CMS
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

                {/* TAB 3: PROJECTS CMS */}
                {activeTab === "projects" && (
                  <div className="space-y-6 font-mono text-xs">
                    <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
                      <h4 className="font-bold text-amber-400 flex items-center gap-2">
                        <FolderPlus className="w-4 h-4" /> Yangi Loyiha Qo'shish
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Loyiha Nomi..."
                          value={newProject.title || ""}
                          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                          className="bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                        <input
                          type="text"
                          placeholder="Kategoriya (masalan: Full-Stack / AI)..."
                          value={newProject.category || ""}
                          onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                          className="bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <textarea
                        rows={2}
                        placeholder="Loyiha haqida tavsif..."
                        value={newProject.description || ""}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                      />

                      <button
                        type="button"
                        onClick={handleAddProject}
                        className="px-4 py-2 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <FolderPlus className="w-4 h-4" /> Ro'yxatga Qo'shish
                      </button>
                    </div>

                    {/* Project List */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-white uppercase tracking-wider">
                        Mavjud Loyihalar Ro'yxati ({(formData.customProjects || []).length}):
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(formData.customProjects || []).map((project) => (
                          <div key={project.id} className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full">
                                {project.category}
                              </span>
                              <h5 className="font-bold text-white text-sm">{project.title}</h5>
                              <p className="text-neutral-400 text-[11px] font-sans leading-relaxed">{project.description}</p>
                              <div className="flex flex-wrap gap-1 pt-1">
                                {project.tech.map((t, idx) => (
                                  <span key={idx} className="text-[9px] bg-black text-neutral-400 px-1.5 py-0.5 rounded border border-neutral-800">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteProject(project.id)}
                              className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                              title="O'chirish"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
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

                {/* TAB 5: AI KNOWLEDGE */}
                {activeTab === "ai" && (
                  <div className="space-y-3 font-mono text-xs">
                    <label className="text-amber-400 font-bold uppercase flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" /> AI Assistent Bilimlar Bazasi:
                    </label>
                    <p className="text-neutral-400 font-sans">
                      Saytdagi Gemini AI va qisqa javob generatori quyidagi bilimlar bazasidan foydalanib javob qaytaradi:
                    </p>
                    <textarea
                      rows={6}
                      value={formData.aiCustomKnowledge}
                      onChange={(e) => setFormData({ ...formData, aiCustomKnowledge: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-sans leading-relaxed"
                    />
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
                      className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4 text-neutral-400" /> Dastlabki holat
                    </button>

                    <button
                      type="button"
                      onClick={handleExportJSON}
                      className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-emerald-400" /> JSON Eksport
                    </button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black uppercase font-extrabold tracking-wider rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all shadow-xl shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4 text-black" /> O'zgarishlarni Saqlash
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
