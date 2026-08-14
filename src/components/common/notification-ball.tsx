"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Inbox,
  Sparkles,
  Info,
  AlertCircle,
} from "lucide-react";
import { useNotificationStore } from "@/store/useNotificationStore";

function formatTimeAgo(isoString: string): string {
  try {
    const diff = Math.floor(
      (Date.now() - new Date(isoString).getTime()) / 1000
    );
    if (diff < 30) return "Just now";
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return "Just now";
  }
}

export function NotificationBall() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { notifications, markAsRead, markAllAsRead, clearAll } =
    useNotificationStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!mounted) {
    return (
      <div className="relative flex items-center justify-center h-9 w-9 rounded-full border border-line bg-paper-3 text-ink-3">
        <Bell className="h-4 w-4" />
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center h-9 w-9 rounded-full border border-line bg-paper-3 text-ink-3 transition hover:bg-paper-card hover:text-ink cursor-pointer active:translate-y-px"
        aria-label="Notifications"
        title="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500 border border-neutral-950" />
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop overlay to dismiss on outside click */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 top-full mt-2 z-50 w-80 sm:w-96 rounded-2xl border border-line-2 bg-paper-2 p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-ink">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-line mb-3">
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-semibold text-ink">
                  Notifications
                </span>
                {unreadCount > 0 ? (
                  <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 font-code text-[10px] font-medium text-indigo-400 border border-indigo-500/20">
                    {unreadCount} new
                  </span>
                ) : (
                  <span className="rounded-full bg-paper-card px-2 py-0.5 font-code text-[10px] font-medium text-ink-4 border border-line">
                    {notifications.length} total
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => markAllAsRead()}
                    className="text-[11px] text-ink-3 hover:text-indigo-400 flex items-center gap-1 transition cursor-pointer font-medium"
                    title="Mark all as read"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Mark read</span>
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={() => clearAll()}
                    className="text-[11px] text-ink-4 hover:text-rose-400 flex items-center gap-1 transition cursor-pointer font-medium ml-1"
                    title="Clear all notifications"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-none pr-0.5">
              {notifications.length === 0 ? (
                <div className="py-8 text-center flex flex-col items-center justify-center text-ink-4">
                  <Inbox className="h-8 w-8 mb-2 stroke-[1.5] opacity-50" />
                  <p className="text-xs font-medium text-ink-3">No notifications</p>
                  <p className="text-[11px] text-ink-4 mt-0.5">
                    Activity and real-time updates will appear here
                  </p>
                </div>
              ) : (
                notifications.map((n) => {
                  return (
                    <div
                      key={n.id}
                      onClick={() => !n.read && markAsRead(n.id)}
                      className={`p-3 rounded-xl border transition-all duration-150 relative group cursor-pointer ${
                        !n.read
                          ? "bg-paper-card border-line-strong hover:bg-paper-3"
                          : "bg-paper-3/40 border-line/40 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="shrink-0 mt-0.5">
                          {n.type === "system" ? (
                            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                          ) : n.type === "warning" ? (
                            <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
                          ) : n.type === "success" ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Info className="h-3.5 w-3.5 text-indigo-400" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5 gap-2">
                            <span className="font-body text-xs font-semibold text-ink truncate">
                              {n.title}
                            </span>
                            <span className="font-code text-[10px] text-ink-4 shrink-0">
                              {formatTimeAgo(n.createdAt)}
                            </span>
                          </div>
                          <p className="text-[11px] text-ink-3 leading-relaxed wrap-break-words">
                            {n.message}
                          </p>
                        </div>

                        {!n.read && (
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default NotificationBall;
