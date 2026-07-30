"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  Cancel01Icon,
  Copy02Icon,
  EyeIcon,
  Key01Icon,
  RefreshIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

import {
  useApiKeyQuery,
  useGenerateApiKeyMutation,
} from "../hooks/use-api-key-queries";

interface ApiKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function maskApiKey(apiKey: string) {
  const prefixLength = "devnest_sec_".length;
  const visiblePrefix = apiKey.slice(0, prefixLength);
  return `${visiblePrefix}${"•".repeat(Math.max(12, apiKey.length - prefixLength))}`;
}

export default function ApiKeyDialog({ isOpen, onClose }: ApiKeyDialogProps) {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id ?? null;

  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

  const apiKeyQuery = useApiKeyQuery(userId, isOpen);
  const generateApiKeyMutation = useGenerateApiKeyMutation();

  const apiKey = apiKeyQuery.data ?? null;

  const keyPreview = useMemo(() => {
    if (!apiKey) return "No API Key generated";
    return isKeyVisible ? apiKey : maskApiKey(apiKey);
  }, [apiKey, isKeyVisible]);

  useEffect(() => {
    if (!isOpen) {
      setIsKeyVisible(false);
      setCopied(false);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleCopyKey = async () => {
    if (!apiKey) return;

    await navigator.clipboard.writeText(apiKey);
    setCopied(true);

    if (copyTimerRef.current) {
      window.clearTimeout(copyTimerRef.current);
    }

    copyTimerRef.current = window.setTimeout(() => {
      setCopied(false);
    }, 1600);
  };

  const handleGenerateKey = async () => {
    if (!userId) return;

    await generateApiKeyMutation.mutateAsync(userId);
    setIsKeyVisible(true);
    setCopied(false);
  };

  const hasApiKey = Boolean(apiKey);
  const isGenerating = generateApiKeyMutation.isPending;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="api-key-dialog-title"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950 shadow-2xl shadow-black/60"
          >
            <div className="border-b border-zinc-900 bg-zinc-950/95 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-100 shadow-inner shadow-black/30">
                    <HugeiconsIcon icon={Key01Icon} size={18} />
                  </div>
                  <div>
                    <h2
                      id="api-key-dialog-title"
                      className="text-sm font-semibold tracking-tight text-zinc-100"
                    >
                      API Key / Settings
                    </h2>
                    <p className="mt-1 text-[11px] tracking-[0.24em] text-zinc-500 uppercase">
                      Manage your extension key
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-zinc-500 transition-colors hover:border-zinc-800 hover:bg-zinc-900 hover:text-zinc-100"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-5 px-6 py-6">
              <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-[11px] tracking-[0.24em] text-zinc-500 uppercase">
                    Current API Key
                  </span>
                  {apiKeyQuery.isPending && isOpen ? (
                    <span className="text-[11px] text-zinc-500">
                      Fetching...
                    </span>
                  ) : null}
                </div>

                <div className="flex min-h-14 items-center rounded-2xl border border-zinc-900 bg-black/40 px-4 py-3 font-mono text-sm text-zinc-200">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={apiKey ?? "empty"}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.16 }}
                      className={cn("break-all", !apiKey && "text-zinc-500")}
                    >
                      {keyPreview}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setIsKeyVisible((current) => !current)}
                  disabled={!apiKey}
                  className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 text-sm font-medium text-zinc-100 transition-colors hover:border-zinc-700 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <HugeiconsIcon icon={EyeIcon} size={16} />
                  {isKeyVisible ? "Hide Key" : "Show Key"}
                </button>

                <button
                  type="button"
                  onClick={handleCopyKey}
                  disabled={!apiKey}
                  className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 text-sm font-medium text-zinc-100 transition-colors hover:border-zinc-700 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {copied ? (
                    <>
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <HugeiconsIcon icon={Copy02Icon} size={16} />
                      Copy Key
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={handleGenerateKey}
                disabled={!userId || isGenerating}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-100 px-4 text-sm font-semibold text-zinc-950 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isGenerating ? (
                  <>
                    <HugeiconsIcon icon={RefreshIcon} size={16} />
                    Generating...
                  </>
                ) : (
                  <>
                    <HugeiconsIcon icon={Tick02Icon} size={16} />
                    {hasApiKey ? "Regenerate Key" : "Generate Key"}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
