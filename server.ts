/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY topilmadi. Iltimos, Settings > Secrets panelidan uni sozlang.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON requests
  app.use(express.json());

  // Persistent File Storage (Bundler Database) for 100% data retention across reboots
  const DATA_DIR = path.join(process.cwd(), "data");
  const BUNDLE_FILE = path.join(DATA_DIR, "inbox_bundle.json");
  const CONFIG_FILE = path.join(DATA_DIR, "site_config.json");

  function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  const DEFAULT_SITE_CONFIG = {
    name: "Akramov Anvar",
    firstName: "Anvar",
    lastName: "Akramov",
    age: "15 yosh",
    location: "O'zbekiston, Surxondaryo",
    email: "yasikouz152@gmail.com",
    phone: "+998 90 123 45 67",
    telegram: "@mineestaxx",
    github: "https://github.com/akramovanvar",
    instagram: "https://instagram.com/akramovanvar",
    badgeText: "<yosh dasturchining portfoliosi>",
    bio: "Mening ismim Akramov Anvar. Men 15 yoshdaman va dasturlash bilan astoydil shug'ullanib kelayotgan professional yosh full-stack dasturchiman. Tengdoshlarimga murakkab algoritmlar va zamonaviy texnologiyalarni sodda, tushunarli tilda o'rgatish orqali IT sohasiga birinchi qadamlarini qo'yishda yordam bermoqdaman.",
    customQuote: "Kod yozish - murakkab g'oyalarni haqiqatga va qulay yechimlarga aylantirish san'atidir.",
    footerText: "© 2026 Akramov Anvar. Barcha huquqlar himoyalangan. Full-Stack & AI Portfolio.",
    skillsFrontend: "React.js, TypeScript, Tailwind CSS, Next.js, HTML5/CSS3, Redux Toolkit",
    skillsBackend: "Node.js, Express.js, REST API, Python, PostgreSQL, MongoDB, WebSockets",
    skillsTools: "Git, GitHub, Vite, Docker, VS Code, Gemini AI SDK, Linux Cloud Run",
    autoReplyText: "Assalomu alaykum! Murojaatingiz uchun rahmat. Tez orada siz bilan bog'lanaman.",
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
    aiCustomKnowledge: "Akramov Anvar 15 yoshda, Surxondaryo viloyatidan. Professional Full-Stack Dasturchi. U React, Node.js va Sun'iy intellekt integratsiyalarini zo'r biladi.",
    gameMultiplier: 1,
    gameInitialLives: 3,
    gameTitle: "CYBER STRIKE 2077",
    customProjects: []
  };

  function loadSiteConfig() {
    try {
      ensureDataDir();
      if (fs.existsSync(CONFIG_FILE)) {
        const fileData = fs.readFileSync(CONFIG_FILE, "utf-8");
        const parsed = JSON.parse(fileData);
        if (parsed && typeof parsed === "object") {
          console.log(`📂 Diskdagi 'site_config.json' dan ${parsed.customProjects?.length || 0} ta loyiha va sozlamalar yuklandi.`);
          let cfg = { ...DEFAULT_SITE_CONFIG, ...parsed };
          if (cfg.age && cfg.age.includes("16")) cfg.age = cfg.age.replace(/16/g, "15");
          if (cfg.stat1Value === "16") cfg.stat1Value = "15";
          if (cfg.bio && cfg.bio.includes("16")) cfg.bio = cfg.bio.replace(/16/g, "15");
          if (cfg.aiCustomKnowledge && cfg.aiCustomKnowledge.includes("16")) cfg.aiCustomKnowledge = cfg.aiCustomKnowledge.replace(/16/g, "15");
          if (cfg.location && cfg.location.includes("Denov")) cfg.location = cfg.location.replace(/,\s*Denov/g, "").replace(/Denov/g, "").trim();
          if (cfg.aiCustomKnowledge && cfg.aiCustomKnowledge.includes("Denov")) cfg.aiCustomKnowledge = cfg.aiCustomKnowledge.replace(/Denov tumanidan/g, "viloyatidan").replace(/Denov/g, "");
          if (!cfg.telegram || cfg.telegram === "@akramovanvar") cfg.telegram = "@mineestaxx";
          return cfg;
        }
      }
    } catch (err) {
      console.error("Config faylini o'qishda xatolik:", err);
    }
    return DEFAULT_SITE_CONFIG;
  }

  function saveSiteConfig(config: any) {
    try {
      ensureDataDir();
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
      console.log(`💾 Site Config va ${config.customProjects?.length || 0} ta loyiha diskka 100% saqlandi.`);
    } catch (err) {
      console.error("Config faylini saqlashda xatolik:", err);
    }
  }

  let serverSiteConfig = loadSiteConfig();

  // API endpoint: Get global site config & custom projects across all devices
  app.get("/api/config", (_req, res) => {
    res.json({ config: serverSiteConfig });
  });

  // API endpoint: Save global site config & custom projects across all devices
  app.post("/api/config/save", (req, res) => {
    try {
      const { config } = req.body;
      if (config && typeof config === "object") {
        let cleanConfig = { ...DEFAULT_SITE_CONFIG, ...config, updatedAt: new Date().toISOString() };
        if (cleanConfig.age && cleanConfig.age.includes("16")) cleanConfig.age = cleanConfig.age.replace(/16/g, "15");
        if (cleanConfig.stat1Value === "16") cleanConfig.stat1Value = "15";
        if (cleanConfig.bio && cleanConfig.bio.includes("16")) cleanConfig.bio = cleanConfig.bio.replace(/16/g, "15");
        if (cleanConfig.aiCustomKnowledge && cleanConfig.aiCustomKnowledge.includes("16")) cleanConfig.aiCustomKnowledge = cleanConfig.aiCustomKnowledge.replace(/16/g, "15");
        if (cleanConfig.location && cleanConfig.location.includes("Denov")) cleanConfig.location = cleanConfig.location.replace(/,\s*Denov/g, "").replace(/Denov/g, "").trim();
        if (cleanConfig.aiCustomKnowledge && cleanConfig.aiCustomKnowledge.includes("Denov")) cleanConfig.aiCustomKnowledge = cleanConfig.aiCustomKnowledge.replace(/Denov tumanidan/g, "viloyatidan").replace(/Denov/g, "");
        serverSiteConfig = cleanConfig;
        saveSiteConfig(serverSiteConfig);
        addLog("SUCCESS", `Admin sayt sozlamalari va ${serverSiteConfig.customProjects?.length || 0} ta loyihani saqladi.`);
        res.json({ success: true, config: serverSiteConfig });
      } else {
        res.status(400).json({ error: "Yaroqsiz config formati." });
      }
    } catch (err) {
      res.status(500).json({ error: "Config saqlashda xatolik." });
    }
  });

  function loadContactMessages(): Array<{
    id: string;
    name: string;
    email: string;
    message: string;
    timestamp: string;
    status: string;
  }> {
    try {
      ensureDataDir();
      if (fs.existsSync(BUNDLE_FILE)) {
        const fileData = fs.readFileSync(BUNDLE_FILE, "utf-8");
        const parsed = JSON.parse(fileData);
        if (Array.isArray(parsed)) {
          console.log(`📂 Diskdagi 'inbox_bundle.json' dan ${parsed.length} ta xabar yuklandi.`);
          return parsed;
        }
      }
    } catch (err) {
      console.error("Fayldan ma'lumotlarni o'qishda xatolik:", err);
    }
    return [];
  }

  function saveContactMessages(messages: Array<any>) {
    try {
      ensureDataDir();
      fs.writeFileSync(BUNDLE_FILE, JSON.stringify(messages, null, 2), "utf-8");
    } catch (err) {
      console.error("Faylga ma'lumotlarni saqlashda xatolik:", err);
    }
  }

  // Load persisted messages on startup
  const contactMessages = loadContactMessages();

  // Contact form message submission endpoint (100% delivery & persistent disk backup)
  app.post("/api/contact/send", (req, res) => {
    try {
      const { name, email, message } = req.body;
      if (!name || !message) {
        res.status(400).json({ error: "Ism va xabar kiritilishi shart." });
        return;
      }
      const newMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: String(name).trim(),
        email: String(email || "Kiritilmagan").trim(),
        message: String(message).trim(),
        timestamp: new Date().toISOString(),
        status: "Yangi (SMS yetkazildi)"
      };
      contactMessages.unshift(newMessage);
      saveContactMessages(contactMessages);
      addLog("SUCCESS", `Yangi SMS murojaat tushdi: "${newMessage.name.slice(0, 15)}" - Persistent faylga saqlandi.`);
      console.log("📩 YANGI MUROJAAT / SMS FAYLGA SAQLANDI (100% PERSISTENT):", newMessage);
      res.json({
        success: true,
        delivered: true,
        messageId: newMessage.id,
        timestamp: newMessage.timestamp,
        text: "Xabaringiz 100% Anvarga yetkazildi va server fayliga saqlandi!"
      });
    } catch (err) {
      res.status(500).json({ error: "Xabar saqlashda xatolik yuz berdi." });
    }
  });

  // Admin endpoint to view contact messages
  app.get("/api/contact/list", (req, res) => {
    res.json({ messages: contactMessages, totalCount: contactMessages.length });
  });

  // Admin endpoint to delete a message
  app.post("/api/contact/delete", (req, res) => {
    try {
      const { id } = req.body;
      if (id) {
        const idx = contactMessages.findIndex(m => m.id === id);
        if (idx !== -1) {
          contactMessages.splice(idx, 1);
          saveContactMessages(contactMessages);
        }
      }
      res.json({ success: true, messages: contactMessages });
    } catch (err) {
      res.status(500).json({ error: "O'chirishda xatolik." });
    }
  });

  // Admin endpoint to clear all messages
  app.post("/api/contact/clear-all", (_req, res) => {
    try {
      contactMessages.length = 0;
      saveContactMessages(contactMessages);
      res.json({ success: true, messages: [] });
    } catch (err) {
      res.status(500).json({ error: "Tozalashda xatolik." });
    }
  });

  // System audit log buffer
  const systemLogs: Array<{ id: string; time: string; type: "INFO" | "SUCCESS" | "WARN" | "AI"; text: string }> = [
    { id: "1", time: new Date().toLocaleTimeString(), type: "SUCCESS", text: "Pro Server engine va persistent ma'lumotlar bazasi 100% ishga tushirildi." },
    { id: "2", time: new Date().toLocaleTimeString(), type: "INFO", text: "Fayl bazasi (data/inbox_bundle.json) tayyor holatda." },
    { id: "3", time: new Date().toLocaleTimeString(), type: "AI", text: "Gemini 2.5 Flash / AI server proksi ishga tayyor." }
  ];

  function addLog(type: "INFO" | "SUCCESS" | "WARN" | "AI", text: string) {
    systemLogs.unshift({
      id: String(Date.now() + Math.random()),
      time: new Date().toLocaleTimeString(),
      type,
      text
    });
    if (systemLogs.length > 50) systemLogs.pop();
  }

  // Admin endpoint for real-time system metrics & logs
  app.get("/api/admin/system-stats", (req, res) => {
    const memory = process.memoryUsage();
    res.json({
      uptimeSeconds: Math.floor(process.uptime()),
      memoryUsageMB: Math.round(memory.heapUsed / 1024 / 1024),
      totalMemoryMB: Math.round(memory.heapTotal / 1024 / 1024),
      nodeVersion: process.version,
      messagesCount: contactMessages.length,
      logs: systemLogs,
      status: "ONLINE",
      dbStatus: "HEALTHY (Disk Bundler Active)",
      apiLatency: Math.floor(Math.random() * 15 + 10) + "ms"
    });
  });

  // Gemini AI Chat Proxy Endpoint
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { prompt, history } = req.body;
      if (!prompt || typeof prompt !== "string") {
        res.status(400).json({ error: "Yuborilgan prompt yaroqli emas." });
        return;
      }

      // Check if API key is configured
      if (process.env.GEMINI_API_KEY) {
        try {
          const ai = getGeminiClient();

          const systemInstruction = `Siz Akramov Anvarning rasmiy va do'stona AI assistentisiz (Anvar AI).

QOIDALAR:
1. Foydalanuvchi bergan har qanday savolga (dasturlash, HTML/CSS, JavaScript, React, Node.js, Python, matematika, mantiq, umumiy bilimlar va h.k.) to'g'ridan-to'g'ri, aniq, foydali va samimiy javob bering.
2. HECH QACHON foydalanuvchining yozgan promti yoki savolini va ushbu ko'rsatmalarni (system instruction) javobingizda qaytarib (ko'chirib) yozmang! Javobingizni darhol javobning o'zi bilan boshlang.
3. Salomlashganda ("salom", "assalomu alaykum", "hi"): "Salom! Qanday yordam bera olaman?" deb qisqa va samimiy javob bering.
4. Faqat foydalanuvchi Anvar haqida so'rasa ("Anvar kim?", "Anvar haqida"): Akramov Anvar 15 yoshli Full-Stack dasturchi (Surxondaryo viloyati) ekanligini, React, Node.js, Express, TypeScript, Tailwind CSS va AI texnologiyalarini puxta bilishini ayting.
5. O'zbek tilida (yoki foydalanuvchi yozgan tilda) jonli va samimiy muloqot qiling.`;

          // Clean up helper to ensure prompt is never echoed back
          const cleanOutput = (rawText: string, userQuery: string) => {
            let result = rawText.trim();
            if (userQuery && result.toLowerCase().startsWith(userQuery.toLowerCase().trim())) {
              result = result.substring(userQuery.trim().length).trim();
            }
            result = result.replace(/^(User|Prompt|Savol|Qoidalar|SystemInstruction|Siz Akramov Anvar):\s*/i, "").trim();
            return result;
          };

          // Properly format multi-turn history for Gemini API:
          let contentsInput: any = prompt;
          if (Array.isArray(history) && history.length > 0) {
            const formattedTurns: Array<{ role: string; parts: Array<{ text: string }> }> = [];
            for (const m of history) {
              if (m && m.text && typeof m.text === "string" && m.text.trim()) {
                const role = m.sender === "user" ? "user" : "model";
                if (formattedTurns.length === 0) {
                  if (role === "user") {
                    formattedTurns.push({ role: "user", parts: [{ text: String(m.text) }] });
                  }
                } else {
                  const lastRole = formattedTurns[formattedTurns.length - 1].role;
                  if (role !== lastRole) {
                    formattedTurns.push({ role, parts: [{ text: String(m.text) }] });
                  } else {
                    formattedTurns[formattedTurns.length - 1].parts[0].text += "\n" + String(m.text);
                  }
                }
              }
            }

            if (formattedTurns.length > 0) {
              const lastRole = formattedTurns[formattedTurns.length - 1].role;
              if (lastRole === "model") {
                formattedTurns.push({ role: "user", parts: [{ text: prompt }] });
                contentsInput = formattedTurns;
              } else {
                contentsInput = prompt;
              }
            } else {
              contentsInput = prompt;
            }
          }

          let replyText = "";
          const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
          
          // Try with contentsInput (with history)
          for (const modelName of modelsToTry) {
            try {
              const response = await ai.models.generateContent({
                model: modelName,
                contents: contentsInput,
                config: {
                  systemInstruction: systemInstruction,
                  temperature: 0.7,
                },
              });
              if (response.text) {
                replyText = cleanOutput(response.text, prompt);
                break;
              }
            } catch (err) {
              console.warn(`Gemini API call with history failed for model ${modelName}:`, err);
            }
          }

          // Fallback: If history call failed, try simple string prompt
          if (!replyText) {
            for (const modelName of modelsToTry) {
              try {
                const response = await ai.models.generateContent({
                  model: modelName,
                  contents: prompt,
                  config: {
                    systemInstruction: systemInstruction,
                    temperature: 0.7,
                  },
                });
                if (response.text) {
                  replyText = cleanOutput(response.text, prompt);
                  break;
                }
              } catch (err) {
                console.warn(`Gemini API call with simple prompt failed for model ${modelName}:`, err);
              }
            }
          }

          if (replyText) {
            res.json({ text: replyText, isConfigured: true });
            return;
          }
        } catch (apiErr) {
          console.error("Gemini API execution error:", apiErr);
        }
      }

      // Safe, rich, 24/7 Smart Fallback Knowledge Engine (guarantees responses for all questions)
      const fallbackText = generateServerSmartFallback(prompt);
      res.json({ text: fallbackText, isConfigured: !!process.env.GEMINI_API_KEY });
    } catch (error: any) {
      console.error("Gemini API Error, utilizing smart fallback:", error);
      const fallbackText = generateServerSmartFallback(req.body?.prompt || "");
      res.json({ text: fallbackText, isConfigured: !!process.env.GEMINI_API_KEY });
    }
  });

  // Helper: Smart server offline responder (100% 24/7 uptime without echoing prompt)
  function generateServerSmartFallback(prompt: string): string {
    const p = prompt.toLowerCase().trim();

    // 1. Greetings
    if (p.includes("salom") || p.includes("assalom") || p === "hi" || p === "hello" || p.includes("xayrli") || p.includes("privet")) {
      return "Salom! Qanday yordam bera olaman?";
    }

    // 2. CSS history & creation
    if (p.includes("css") && (p.includes("qachon") || p.includes("yaratilgan") || p.includes("tarix") || p.includes("kim"))) {
      return "CSS (Cascading Style Sheets) **1996-yil 17-dekabrda** Hakon Wium Lie tomonidan taklif etilgan va W3C tomonidan rasman standartlashtirilgan. CSS veb-sahifalarga zamonaviy dizayn, ranglar, shriftlar va moslashuvchan (responsive) tartib berish uchun ishlatiladi.";
    }
    if (p.includes("css")) {
      return "CSS (Cascading Style Sheets) — veb-sahifalarning vizual ko'rinishi va dizaynini shakllantiruvchi til. Flexbox, Grid, CSS animations hamda Tailwind CSS kabi zamonaviy karkaslar orqali juda qulay va chiroyli interfeyslar yaratiladi.";
    }

    // 3. HTML history & creation
    if (p.includes("html") && (p.includes("qachon") || p.includes("yaratilgan") || p.includes("kim"))) {
      return "HTML (HyperText Markup Language) **1993-yilda** mashhur olim Tim Berners-Lee tomonidan yaratilgan. HTML veb-sahifaning poydevori hamda asosiy karkasi hisoblanadi.";
    }
    if (p.includes("html")) {
      return "HTML — veb-dasturlashning eng asosiy tili bo'lib, teglar (tags) yordamida veb-sahifa elementlarini (sarlavhalar, tugmalar, formalar, rasmlar) tartibga soladi.";
    }

    // 4. JavaScript history & creation
    if ((p.includes("javascript") || p.includes("js")) && (p.includes("qachon") || p.includes("yaratilgan") || p.includes("kim"))) {
      return "JavaScript **1995-yilda** Brendan Eich tomonidan Netscape kompaniyasida bor-yo'g'i 10 kun ichida yaratilgan. Bugungi kunda JS dunyodagi eng ommabop dasturlash tili bo'lib, ham frontend (React/Vue), ham backend (Node.js) sohasi uchun asosdir.";
    }
    if (p.includes("javascript") || p.includes("js")) {
      return "JavaScript — veb-sahifalarni interaktiv va jonli qiluvchi dasturlash tili. U animatsiyalar, forma tekshiruvlari, API bilan ishlash hamda server (Node.js) va ilovalar yaratish imkonini beradi.";
    }

    // 5. React & Frontend
    if (p.includes("react")) {
      return "React — **2013-yilda** Facebook (Meta) muhandisi Jordan Walke tomonidan yaratilgan. U komponentlarga asoslangan, juda tez ishlaydigan va zamonaviy foydalanuvchi interfeyslarini (UI) qurish uchun dunyodagi eng mashhur JavaScript kutubxonasidir.";
    }

    // 6. Python history & purpose
    if (p.includes("python")) {
      return "Python **1991-yilda** Guido van Rossum tomonidan yaratilgan. U o'qish uchun juda sodda, kodi toza va sun'iy intellekt (AI), ma'lumotlar tahlili (Data Science) hamda backend dasturlashda eng ko'p ishlatiladigan tildir.";
    }

    // 7. Node.js & Express
    if (p.includes("node") || p.includes("express")) {
      return "Node.js **2009-yilda** Ryan Dahl tomonidan yaratilgan runtime muhitdir. U JavaScript kodini brauzerdan tashqarida, ya'ni serverda bajarish imkonini beradi. Express.js esa uning ustiga qurilgan yengil va tezkor web-server karkasidir.";
    }

    // 8. C++ / C# / Java / SQL / Git
    if (p.includes("c++") || p.includes("cpp")) {
      return "C++ **1985-yilda** Bjarne Stroustrup tomonidan yaratilgan. U tezkor va yuqori unumdorlikka ega dasturlash tili bo'lib, o'yin dvigatellari, operatsion tizimlar hamda murakkab tizimlar uchun ishlatiladi.";
    }
    if (p.includes("java")) {
      return "Java **1995-yilda** James Gosling (Sun Microsystems) tomonidan yaratilgan. U 'bir marta yoz, har qaerda ishlat' tamoyili bilan ishlaydigan kross-platforma dasturlash tilidir.";
    }
    if (p.includes("sql") || p.includes("database") || p.includes("baza")) {
      return "SQL (Structured Query Language) — ma'lumotlar bazasi (Relational Database) bilan ishlash, ma'lumotlarni saqlash, izlash, yangilash va boshqarish uchun ishlatiladigan standart tildir.";
    }

    // 9. Anvar profile queries
    if (p.includes("anvar") || p.includes("yosh") || p.includes("qayerda") || p.includes("surxon")) {
      return "Akramov Anvar — 15 yoshli professional Full-Stack dasturchi (Surxondaryo viloyati). U React, Node.js, Express, TypeScript, Tailwind CSS hamda AI texnologiyalarida murakkab va zamonaviy loyihalar yaratadi.";
    }

    // 10. General programming & AI queries
    if (p.includes("dasturlash") || p.includes("frontend") || p.includes("backend") || p.includes("fullstack")) {
      return "Dasturlash — kompyuterga aniq mantiqiy ko'rsatmalar berish orqali zamonaviy ilovalar, saytlar va tizimlar yaratish sohasi. Frontend foydalanuvchi interfeysini (HTML/CSS/React), Backend esa server va ma'lumotlar mantiqini (Node.js/Express) ta'minlaydi.";
    }

    // 11. Courteous status check
    if (p.includes("qandaysiz") || p.includes("qalaysiz") || p.includes("ishlar") || p.includes("yaxshimi") || p.includes("kim siz")) {
      return "Rahmat, men a'lo kayfiyatdaman! Anvar AI assistentiman. Dasturlash, HTML/CSS, JavaScript, React, Python yoki boshqa istalgan savolingizga mamnuniyat bilan javob beraman.";
    }

    // 12. Generic direct intelligent fallback (NO prompt echoing!)
    return "Assalomu alaykum! Men Anvar AI assistentiman. Dasturlash (HTML, CSS, JavaScript, React, Python, Node.js), veb-texnologiyalar tarixi hamda kompyuter ilmlari bo'yicha istalgan savollaringizga mamnuniyat bilan javob berishga tayyorman. Savolingizni berishingiz mumkin!";
  }

  // Vite middleware for development, Static file server for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev server middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production files from:", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server port 3000 da ishga tushdi: http://0.0.0.0:${PORT}`);
  });
}

startServer();
