/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ExternalLink,
  Github,
  Sparkles,
  Eye,
  X,
  Search,
  Tag,
  Rocket,
  Code2,
  FolderGit2,
  ArrowUpRight,
  Layers,
  Cpu,
  Globe
} from "lucide-react";
import { Project } from "../types";

interface ProjectsShowcaseProps {
  projects?: Project[];
  isDarkMode?: boolean;
}

export function normalizeProjectUrl(url?: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed || trimmed === "#") return "";
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function formatDisplayUrl(url?: string): string {
  if (!url) return "";
  return url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

export default function ProjectsShowcase({
  projects = [],
  isDarkMode = true
}: ProjectsShowcaseProps) {
  // Hide section completely if no projects added by Admin
  if (!projects || projects.length === 0) {
    return null;
  }

  const displayProjects = projects;

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  // Categories extraction
  const categories = ["all", ...Array.from(new Set(displayProjects.map((p) => p.category)))];

  // Filtered projects
  const filtered = displayProjects.filter((proj) => {
    const matchesCategory = selectedCategory === "all" || proj.category === selectedCategory;
    const matchesSearch =
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.tech.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.section 
      id="projects" 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="scroll-mt-24 space-y-10 relative"
    >
      {/* Background Ambient Glowing Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/10 via-purple-500/10 to-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
            <span className={`font-mono text-xs uppercase tracking-widest font-extrabold ${
              isDarkMode ? 'text-amber-400' : 'text-emerald-600'
            }`}>
              01 // MENING PORTFOLIO LOYIHALARIM
            </span>
          </div>
          <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}>
            Mustaqil loyihalarim va ijodim.
          </h2>
          <p className={`text-xs sm:text-sm max-w-xl font-sans leading-relaxed ${
            isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            Men yaratgan veb-saytlar, interaktiv platformalar va zamonaviy dasturiy mahsulotlar to'plami.
          </p>
        </div>
      </div>

      {/* SEARCH AND CATEGORY FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-neutral-900/40 p-3.5 rounded-2xl border border-neutral-800/80 backdrop-blur-md shadow-xl">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
                selectedCategory === cat
                  ? "bg-amber-400 text-black border-amber-300 shadow-lg shadow-amber-400/30 scale-105"
                  : isDarkMode
                  ? "bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800 hover:border-neutral-700"
                  : "bg-white hover:bg-neutral-100 text-neutral-700 border-neutral-200"
              }`}
            >
              <span>{cat === "all" ? "Barchasi ✨" : cat}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedCategory === cat ? "bg-black/20 text-black" : "bg-neutral-800 text-neutral-400"
              }`}>
                {cat === "all" ? displayProjects.length : displayProjects.filter((p) => p.category === cat).length}
              </span>
            </button>
          ))}
        </div>

        {/* Search input box */}
        <div className="relative min-w-[200px] sm:min-w-[240px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Loyiha yoki texnologiya izlash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs font-sans outline-none transition-all border ${
              isDarkMode
                ? "bg-black/70 border-neutral-800 text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50"
                : "bg-white border-neutral-200 text-black focus:border-black"
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* PROJECTS GRID (ULTRA CHOTKI ANIMATION WITH STAGGERED FADE-IN & HOVER ZOOM) */}
      {filtered.length === 0 ? (
        <div className="text-center py-14 bg-neutral-900/20 rounded-3xl border border-neutral-800/50 space-y-3">
          <FolderGit2 className="w-10 h-10 text-neutral-500 mx-auto" />
          <p className="text-neutral-400 font-mono text-xs">Afsuski, kiritilgan izlash so'rovi bo'yicha loyihalar topilmadi.</p>
          <button
            onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
            className="px-4 py-2 bg-amber-400 text-black font-mono font-bold text-xs rounded-xl cursor-pointer hover:bg-amber-300 transition-colors"
          >
            Barchasini ko'rsatish
          </button>
        </div>
      ) : (
        <motion.div 
          layout
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.12
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          {filtered.map((proj) => {
            const liveUrl = normalizeProjectUrl(proj.demoUrl);
            const codeUrl = normalizeProjectUrl(proj.githubUrl);
            const displayUrl = formatDisplayUrl(proj.demoUrl);

            return (
              <motion.div
                key={proj.id}
                layout
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.94 },
                  show: { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1, 
                    transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } 
                  }
                }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.015,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className={`rounded-[32px] overflow-hidden border transition-all duration-500 flex flex-col justify-between group relative shadow-2xl ${
                  isDarkMode
                    ? "bg-[#101420] border-neutral-800/90 hover:border-amber-400/80 hover:shadow-[0_25px_65px_rgba(245,158,11,0.25)]"
                    : "bg-white border-neutral-200 hover:border-black hover:shadow-2xl"
                }`}
              >
                {/* IMAGE COVER WITH GLOW & LIGHTBOX TRIGGER */}
                <div 
                  className="relative h-60 sm:h-72 overflow-hidden bg-black/80 cursor-pointer group/img" 
                  onClick={() => setActiveModalProject(proj)}
                >
                  <img
                    src={
                      proj.imageUrl ||
                      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"
                    }
                    alt={proj.title}
                    className="w-full h-full object-cover object-center group-hover/img:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover/img:opacity-100"
                  />

                  {/* Shimmer Light Sweep Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101420] via-black/20 to-transparent opacity-85 group-hover:opacity-40 transition-opacity duration-500" />

                  {/* Category Badge Floating Top Left */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3.5 py-1.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-black/80 backdrop-blur-md text-amber-300 border border-amber-400/40 shadow-lg flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                      {proj.category}
                    </span>
                  </div>

                  {/* Action Link Floating Top Right */}
                  <div className="absolute top-4 right-4 z-10 opacity-0 group-hover/img:opacity-100 transition-all duration-300 scale-90 group-hover/img:scale-100">
                    {liveUrl ? (
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-10 h-10 rounded-full bg-amber-400 hover:bg-amber-300 text-black flex items-center justify-center shadow-lg shadow-amber-400/40 hover:scale-110 transition-transform"
                        title="To'g'ridan-to'g'ri loyihaga o'tish"
                      >
                        <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                      </a>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-lg shadow-amber-400/40 hover:scale-110 transition-transform">
                        <Eye className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Project Title Overlay Bottom */}
                  <div className="absolute bottom-4 left-5 right-5 z-10">
                    <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-white drop-shadow-md group-hover:text-amber-300 transition-colors flex items-center justify-between">
                      <span className="truncate pr-2">{proj.title}</span>
                      <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 text-amber-300 shrink-0" />
                    </h3>
                  </div>
                </div>

                {/* CARD CONTENT BODY */}
                <div className="p-5 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <p className={`text-xs sm:text-sm leading-relaxed font-sans ${
                      isDarkMode ? "text-neutral-300" : "text-neutral-600"
                    }`}>
                      {proj.description}
                    </p>

                    {/* TECH STACK BADGES */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold">
                        <Code2 className="w-3.5 h-3.5 text-amber-400" /> Texnologiyalar:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {proj.tech.map((t, i) => (
                          <span
                            key={i}
                            className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded-lg border transition-all duration-300 ${
                              isDarkMode
                                ? "bg-neutral-900 border-neutral-800 text-neutral-300 group-hover:border-amber-500/30 group-hover:bg-neutral-850"
                                : "bg-neutral-100 border-neutral-200 text-neutral-700"
                            }`}
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM PROJECT LINK CONTAINER (LOYIHA TAGIDAGI LINK - BOSILGANDA TO'G'RIDAN-TO'G'RI O'TADI) */}
                  <div className="pt-4 border-t border-neutral-800/80 space-y-2.5">
                    {liveUrl ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider">
                          <span className={`flex items-center gap-1.5 ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                            <Globe className="w-3.5 h-3.5" /> Loyiha Havolasi (Sayt):
                          </span>
                          <span className="text-neutral-500 font-normal">Tashqi sayt</span>
                        </div>

                        {/* BOSSA LOYIHAGA O'TIB KETADIGAN ASOSIY HAVOLA BLOKI */}
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className={`group/link flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 shadow-md ${
                            isDarkMode
                              ? "bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-neutral-900/90 border-amber-500/40 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/20"
                              : "bg-gradient-to-r from-amber-50 via-amber-100/60 to-white border-amber-300 hover:border-amber-500 hover:shadow-lg"
                          }`}
                          title={`${proj.title} loyihasiga o'tish`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <div className="w-8 h-8 rounded-xl bg-amber-400 text-black flex items-center justify-center shrink-0 shadow-md group-hover/link:scale-110 group-hover/link:bg-amber-300 transition-all">
                              <ExternalLink className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex flex-col">
                              <span className={`text-xs font-mono font-bold truncate ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                                {displayUrl}
                              </span>
                              <span className="text-[9.5px] font-sans text-neutral-400">
                                Bosganda loyihangiz sahifasi ochiladi ↗
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono font-black text-xs uppercase tracking-wider shrink-0 transition-all shadow-md group-hover/link:translate-x-0.5">
                            <span>O'tish</span>
                            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                        </a>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-neutral-900/40 border border-neutral-800 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-neutral-500" /> Havola kiritilmagan
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveModalProject(proj)}
                          className="text-amber-400 hover:underline cursor-pointer font-bold"
                        >
                          Batafsil ko'rish
                        </button>
                      </div>
                    )}

                    {/* Secondary Action Buttons: Batafsil & GitHub */}
                    <div className="flex items-center justify-between pt-1 font-mono text-xs">
                      <button
                        type="button"
                        onClick={() => setActiveModalProject(proj)}
                        className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer text-xs font-semibold ${
                          isDarkMode
                            ? "text-neutral-400 hover:text-white hover:bg-neutral-800"
                            : "text-neutral-600 hover:text-black hover:bg-neutral-100"
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" /> Batafsil ma'lumot
                      </button>

                      {codeUrl && (
                        <a
                          href={codeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold border ${
                            isDarkMode
                              ? "bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800"
                              : "bg-neutral-100 hover:bg-neutral-200 text-black border-neutral-200"
                          }`}
                        >
                          <Github className="w-3.5 h-3.5" /> Kodi
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* FULL PROJECT DETAIL LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeModalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-neutral-950 border border-neutral-800 w-full max-w-3xl rounded-[36px] overflow-hidden shadow-2xl relative text-white space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalProject(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-red-500 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Cover Image */}
              <div className="relative h-72 sm:h-80 w-full bg-black">
                <img
                  src={
                    activeModalProject.imageUrl ||
                    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"
                  }
                  alt={activeModalProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase bg-amber-400 text-black">
                    {activeModalProject.category}
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                    {activeModalProject.title}
                  </h3>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Loyiha haqida to'liq ma'lumot:
                  </h4>
                  <p className="text-neutral-300 font-sans text-sm sm:text-base leading-relaxed">
                    {activeModalProject.description}
                  </p>
                </div>

                {/* Tech Stack Grid */}
                <div className="space-y-3 p-4 bg-neutral-900/60 rounded-2xl border border-neutral-800">
                  <h5 className="text-xs font-mono font-bold uppercase text-neutral-400 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-emerald-400" /> Ishlatilgan Texnologiyalar va Karkaslar:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {activeModalProject.tech.map((t, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-xl bg-neutral-800 border border-neutral-700 text-emerald-300 text-xs font-mono font-bold"
                      >
                        ⚡ {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Links inside Modal */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-neutral-800">
                  {normalizeProjectUrl(activeModalProject.demoUrl) && (
                    <a
                      href={normalizeProjectUrl(activeModalProject.demoUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black font-mono text-xs rounded-2xl flex items-center gap-2.5 shadow-xl shadow-amber-400/25 cursor-pointer transition-all hover:scale-105 active:scale-95 uppercase tracking-wider"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Loyihaga O'tish ({formatDisplayUrl(activeModalProject.demoUrl)}) ↗</span>
                    </a>
                  )}
                  {normalizeProjectUrl(activeModalProject.githubUrl) && (
                    <a
                      href={normalizeProjectUrl(activeModalProject.githubUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs font-bold rounded-2xl border border-neutral-800 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                    >
                      <Github className="w-4 h-4" /> GitHub Kodi
                    </a>
                  )}
                  <button
                    onClick={() => setActiveModalProject(null)}
                    className="px-5 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white font-mono text-xs font-bold rounded-2xl border border-neutral-800 cursor-pointer ml-auto transition-colors"
                  >
                    Yopish
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
