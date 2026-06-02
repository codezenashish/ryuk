"use client";

import { useState } from "react";
import {
  RiGithubFill,
  RiTwitterXFill,
  RiLinkedinBoxFill,
  RiYoutubeFill,
  RiInstagramLine,
  RiDiscordFill,
  RiEditLine,
  RiPinDistanceLine,
  RiPushpinLine,
  RiPushpinFill,
  RiCloseLine,
  RiCheckLine,
} from "react-icons/ri";

export default function CategoryGridSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [categoryName, setCategoryName] = useState("Social Accounts");

  const [accounts, setAccounts] = useState([
    {
      id: "1",
      icon: RiGithubFill,
      name: "GitHub",
      href: "#",
      color: "hover:text-white",
    },
    {
      id: "2",
      icon: RiTwitterXFill,
      name: "X / Twitter",
      href: "#",
      color: "hover:text-white",
    },
    {
      id: "3",
      icon: RiLinkedinBoxFill,
      name: "LinkedIn",
      href: "https://github.com/copilot",
      color: "hover:text-indigo-400",
    },
    {
      id: "4",
      icon: RiYoutubeFill,
      name: "YouTube",
      href: "#",
      color: "hover:text-red-500",
    },
    {
      id: "5",
      icon: RiInstagramLine,
      name: "Instagram",
      href: "#",
      color: "hover:text-pink-500",
    },
    {
      id: "6",
      icon: RiDiscordFill,
      name: "Discord",
      href: "#",
      color: "hover:text-purple-500",
    },
  ]);

  const handleDelete = (id: string) => {
    setAccounts(accounts.filter((account) => account.id !== id));
  };

  return (
    <div className="w-full max-w-7xl mt-8 select-none">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          {isEditing ? (
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="text-xs font-bold uppercase tracking-widest text-white font-mono bg-white/[0.04] border border-white/[0.1] rounded px-2 py-0.5 outline-none focus:border-indigo-500"
              autoFocus
            />
          ) : (
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono">
              {categoryName}
            </h2>
          )}

          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md border border-white/6 bg-white/2 text-zinc-500">
            {accounts.length} Total
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPinned(!isPinned)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer active:scale-95 ${
              isPinned
                ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-400"
                : "border-white/6 bg-white/2 text-zinc-500 hover:text-white"
            }`}
          >
            {isPinned ? (
              <RiPushpinFill size={14} />
            ) : (
              <RiPushpinLine size={14} />
            )}
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer active:scale-95 ${
              isEditing
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-white/6 bg-white/2 text-zinc-500 hover:text-white hover:border-white/12"
            }`}
          >
            {isEditing ? <RiCheckLine size={14} /> : <RiEditLine size={14} />}
          </button>
        </div>
      </div>

      <div
        className={`w-full rounded-2xl p-2 transition-all duration-300 ${
          isEditing
            ? "border border-indigo-500/30 bg-indigo-500/[0.01]"
            : "border border-transparent bg-transparent"
        }`}
        style={{
          boxShadow: isEditing
            ? "inset 0 0 30px rgba(99, 102, 241, 0.06), inset 0 0 15px rgba(99, 102, 241, 0.04)"
            : "inset 0 0 24px rgba(99, 102, 241, 0.03), inset 0 0 12px rgba(99, 102, 241, 0.02)",
        }}
      >
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
          {accounts.map((account) => {
            const Icon = account.icon;

            return (
              <div
                key={account.id}
                className="group relative flex flex-col items-center justify-center h-20 w-full rounded-xl border border-white/4 bg-white/1 text-zinc-500 transition-all duration-200 hover:border-white/1 hover:bg-white/3 overflow-visible"
              >
                {isEditing && (
                  <button
                    onClick={() => handleDelete(account.id)}
                    className="absolute -top-1 -right-1 z-30 p-0.5 rounded-md bg-zinc-900 border border-white/10 text-zinc-400 hover:text-red-400 hover:border-red-500/30 transition-colors cursor-pointer animate-in fade-in zoom-in-75 duration-150"
                  >
                    <RiCloseLine size={12} />
                  </button>
                )}

                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={isEditing ? undefined : account.href}
                  className={`w-full h-full flex flex-col items-center justify-center rounded-xl ${
                    isEditing
                      ? "pointer-events-none opacity-60"
                      : "cursor-pointer"
                  }`}
                >
                  <Icon
                    size={22}
                    className={`transition-colors duration-200 ${account.color}`}
                  />
                </a>

                {!isEditing && (
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 scale-95 opacity-0 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 group-hover:-bottom-10 z-20 whitespace-nowrap px-2 py-1 rounded-md border border-white/8 bg-zinc-950 text-[10px] font-medium font-mono text-zinc-300 shadow-xl">
                    {account.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
