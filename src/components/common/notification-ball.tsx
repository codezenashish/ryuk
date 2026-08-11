"use client";

import { useState } from "react";
import { Bell, Check, Sparkles } from "lucide-react";

export function NotificationBall() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const notifications = [
    {
      id: "1",
      title: "Welcome to Ryuk",
      message: "Your developer workspace is ready. Explore bookmarks & notes.",
      time: "Just now",
      unread: true,
    },
    {
      id: "2",
      title: "System Update v1.0",
      message: "New Avatune profile generator & Better Auth integration enabled.",
      time: "2h ago",
      unread: true,
    },
  ];

  const handleMarkAllRead = () => {
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center h-9 w-9 rounded-full border border-line bg-paper-3 text-ink-3 transition hover:bg-paper-card hover:text-ink cursor-pointer"
        aria-label="Notifications"
        title="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 z-50 w-80 rounded-2xl border border-line-2 bg-paper-2 p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-ink"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="flex items-center justify-between pb-3 border-b border-line mb-3">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-semibold">Notifications</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-rose-500/10 px-2 py-0.5 font-code text-[10px] font-medium text-rose-400 border border-rose-500/20">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] text-ink-3 hover:text-ink flex items-center gap-1 transition cursor-pointer font-medium"
              >
                <Check className="h-3 w-3" />
                <span>Mark read</span>
              </button>
            )}
          </div>

          <div className="space-y-2.5 max-h-64 overflow-y-auto scrollbar-none">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-2.5 rounded-xl border transition ${
                  n.unread && unreadCount > 0
                    ? "bg-paper-3 border-line-2"
                    : "bg-paper-card/50 border-line/40 opacity-70"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-body text-xs font-semibold text-ink">
                    {n.title}
                  </span>
                  <span className="font-code text-[10px] text-ink-4">
                    {n.time}
                  </span>
                </div>
                <p className="text-[11px] text-ink-3 leading-relaxed">
                  {n.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBall;
