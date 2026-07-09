/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
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

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Gemini AI Chat Proxy Endpoint
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== "string") {
        res.status(400).json({ error: "Yuborilgan prompt yaroqli emas." });
        return;
      }

      // Lazy check API key presence
      if (!process.env.GEMINI_API_KEY) {
        res.status(500).json({
          error: "GEMINI_API_KEY topilmadi. Iltimos, Google AI Studio'ning Settings -> Secrets bo'limida API kalitini kiriting.",
          isConfigured: false
        });
        return;
      }

      const ai = getGeminiClient();
      
      const systemInstruction = `Siz Akramov Anvar ismli 14 yoshli o'zbekistonlik dasturchi va IT murabbiyining shaxsiy sun'iy intellekt assistentisiz. 
Anvar haqida ma'lumotlar:
- Yosh: 14 da.
- Kasb: Full-Stack Dasturchi, IT Mentor va murabbiy.
- Texnologiyalar: React, Node.js, Express, TypeScript, Tailwind CSS, Python, C++, HTML, CSS, JavaScript, SQL.
- Maqsadi: Tengdoshlariga va IT olamiga qiziquvchi barcha yoshlarga dasturlash asoslarini silliq, sodda va tushunarli darslar orqali o'rgatish, ularga ustozlik qilish.
- Shaxsiyat: Kamtar, intiluvchan, juda yosh bo'lishiga qaramay o'z ustida ishlaydigan va boshqalarga yordam berishni sevadigan iste'dod.

Sizning vazifangiz:
- Foydalanuvchilarga samimiy, iliq, o'zbek tilida, do'stona va ilhomlantiruvchi tarzda javob berish.
- Foydalanuvchilarning dasturlash, veb-texnologiyalar va sun'iy intellekt haqidagi savollariga sodda dars uslubida tushuntirishlar berish.
- Anvarni doimo ijobiy va professional tarafdan tanishtirish.
- Javoblarni chiroyli formatda va Markdown elementlaridan foydalanib bering.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "Kechirasiz, javob shakllantirilmadi.";
      res.json({ text: replyText, isConfigured: true });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ 
        error: error.message || "Gemini so'rovini bajarishda xatolik yuz berdi.",
        isConfigured: process.env.GEMINI_API_KEY ? true : false
      });
    }
  });

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
