"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Share2, Copy, Check, Globe, Link as LinkIcon, Loader2, Users, UserPlus, Trash2 } from "lucide-react";
import { BookmarkCategory } from "../components/bookmark-card";
import { useCollaboratorsQuery, useInviteCollaboratorMutation, useRemoveCollaboratorMutation } from "../hooks/use-category-collaborators";

interface ShareCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: BookmarkCategory;
  onShareUpdate: (updatedCategory: BookmarkCategory) => void;
}

export function ShareCategoryDialog({
  isOpen,
  onClose,
  category,
  onShareUpdate,
}: ShareCategoryDialogProps) {
  const [isShared, setIsShared] = useState(Boolean(category.isShared));
  const [localCategory, setLocalCategory] = useState<BookmarkCategory>(category);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");

  const { data: collaborators, isLoading: isLoadingCollaborators } = useCollaboratorsQuery(category.id, isOpen);
  const inviteMutation = useInviteCollaboratorMutation(category.id);
  const removeMutation = useRemoveCollaboratorMutation(category.id);

  if (!isOpen) return null;

  const shareUrl = localCategory.shareToken
    ? `${window.location.origin}/shared/c/${localCategory.shareToken}`
    : "";

  const handleToggleShare = async () => {
    const previousSharedState = isShared;
    const newSharedState = !isShared;
    
    // Optimistic Update
    setIsShared(newSharedState);
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/category/${category.id}/share`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isShared: newSharedState }),
      });

      if (!res.ok) {
        throw new Error("Failed to update sharing settings");
      }

      const data = await res.json();
      setLocalCategory(data.category);
      onShareUpdate(data.category);
    } catch (err) {
      console.error(err);
      // Revert Optimistic Update
      setIsShared(previousSharedState);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    try {
      await inviteMutation.mutateAsync(inviteEmail);
      setInviteEmail("");
    } catch {
      // Error is handled by toast in hook
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div
        className="my-auto w-full max-w-md flex flex-col rounded-3xl bg-paper-2 border border-line-2 shadow-2xl overflow-hidden relative text-ink animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-line bg-paper-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-ink/10 rounded-xl">
              <Share2 className="w-5 h-5 text-ink" />
            </div>
            <div>
              <h2 className="text-lg font-sans font-bold text-ink tracking-tight">
                Share Category
              </h2>
              <p className="text-xs font-medium text-ink-3">
                {category.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-ink-3 hover:text-ink hover:bg-paper-2 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between p-4 rounded-2xl bg-paper border border-line">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-ink flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-mark" />
                Public Access
              </span>
              <span className="text-xs text-ink-3 mt-1 max-w-[200px]">
                Anyone with the link can view bookmarks in this category.
              </span>
            </div>
            
            <button
              onClick={handleToggleShare}
              disabled={isLoading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                isShared ? 'bg-emerald-500' : 'bg-line-2'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isShared ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {isShared && (
            <div className="space-y-3 animate-in slide-in-from-top-2 fade-in duration-300">
              <label className="text-xs font-bold text-ink-2 uppercase tracking-wider font-code flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5" />
                Public Link
              </label>
              
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-paper-card border border-line-2 text-ink-2 text-sm font-mono focus:outline-none focus:border-ink transition"
                />
                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-center p-2.5 rounded-xl bg-ink text-paper hover:bg-ink-2 transition shadow-sm cursor-pointer shrink-0"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Collaborators Section */}
          <div className="pt-4 border-t border-line space-y-4">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-ink flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                Collaborators
              </span>
              <span className="text-xs text-ink-3 mt-1">
                Invite friends to view this category in their dashboard.
              </span>
            </div>

            <form onSubmit={handleInvite} className="flex gap-2">
              <input
                type="email"
                placeholder="friend@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-paper border border-line-2 text-ink-2 text-sm focus:outline-none focus:border-indigo-500 transition"
              />
              <button
                type="submit"
                disabled={inviteMutation.isPending || !inviteEmail.trim()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 text-white font-semibold text-xs hover:bg-indigo-600 transition disabled:opacity-50 cursor-pointer"
              >
                {inviteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                Invite
              </button>
            </form>

            {isLoadingCollaborators ? (
              <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 text-ink-3 animate-spin" /></div>
            ) : collaborators && collaborators.length > 0 ? (
              <div className="space-y-2 mt-4">
                <span className="text-xs font-bold text-ink-3 uppercase tracking-wider font-code">People with access</span>
                <div className="max-h-[150px] overflow-y-auto space-y-2 pr-2">
                  {collaborators.map((collab) => (
                    <div key={collab.id} className="flex items-center justify-between p-2 rounded-xl bg-paper-2 border border-line-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-ink">{collab.user.name || "User"}</span>
                        <span className="text-xs text-ink-3">{collab.user.email}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMutation.mutate(collab.user.id)}
                        disabled={removeMutation.isPending}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-line bg-paper-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-paper border border-line text-xs font-semibold text-ink hover:bg-paper-2 transition cursor-pointer shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
