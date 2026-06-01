"use client";

import React, { useState } from "react";
import {
  Bookmark,
  FileText,
  Layers,
  CheckSquare,
  BarChart2,
  Settings,
  ArrowRight,
} from "lucide-react";

const tabs = [
  { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "diagrams", label: "Diagrams", icon: Layers },
  { id: "habits", label: "Habits", icon: CheckSquare },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function HeroSearchInput() {
  const [activeTab, setActiveTab] = useState("bookmarks");
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    console.log(`Navigating to ${activeTab} with search/URL: ${url}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-8">
      <div className="bg-white/3 border border-white/8 rounded-[28px] p-3 backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-3 px-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-300 relative ${
                  isActive
                    ? "bg-white/8 text-white border border-white/15 shadow-[0_4px_12px_rgba(255,255,255,0.03)]"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/4 border border-transparent"
                }`}
              >
                <div
                  className={`p-0.5 rounded transition-colors ${isActive ? "text-indigo-400" : "text-zinc-500"}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* Frosted +4 Badge */}
          <span className="text-[11px] font-semibold text-zinc-400 bg-white/5 border border-white/8 px-2 py-1 rounded-md ml-1 select-none">
            +4
          </span>
        </div>

        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a link or quick search across your vault..."
            className="w-full pl-6 pr-16 py-4 bg-black/40 border border-white/6 rounded-[20px] text-base text-zinc-200 placeholder-zinc-600 outline-none focus:border-white/15 focus:bg-black/60 focus:ring-2 focus:ring-indigo-500/10 transition-all backdrop-blur-md"
          />

          <button
            type="submit"
            disabled={!url}
            className="absolute right-3 p-2.5 bg-white text-black rounded-full hover:bg-zinc-200 hover:scale-105 active:scale-95 disabled:opacity-20 disabled:scale-100 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center justify-center"
          >
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </form>
      </div>
    </div>
  );
}
