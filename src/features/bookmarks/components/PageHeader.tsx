"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, Download, Upload, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import AddBookmarkDialog from "./AddBookmarkDialog";
import { OverflowMenu } from "./OverflowMenu";
import type { OverflowMenuItem } from "./OverflowMenu";

const secondaryActions: OverflowMenuItem[] = [
  {
    label: "Edit All",
    icon: <Pencil className="h-3.5 w-3.5" />,
    onClick: () => {},
  },
  {
    label: "Import",
    icon: <Upload className="h-3.5 w-3.5" />,
    onClick: () => {},
  },
  {
    label: "Export",
    icon: <Download className="h-3.5 w-3.5" />,
    onClick: () => {},
  },
];

export default function PageHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollParent =
      headerRef.current?.closest("[data-scroll-container]") ??
      headerRef.current?.closest("main") ??
      window;

    const handleScroll = () => {
      const scrollTop =
        scrollParent === window
          ? window.scrollY
          : (scrollParent as Element).scrollTop;
      setIsScrolled(scrollTop > 8);
    };

    scrollParent.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollParent.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        ref={headerRef}
        className="sticky top-0 z-30"
        style={{ isolation: "isolate" }}
      >
        <header className="relative flex w-full items-center justify-between bg-black px-4 py-1">
          {/* ── Left: breadcrumb + title ── */}
          <div className="flex min-w-0 flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[0.68rem] font-medium tracking-widest text-zinc-600 uppercase select-none">
                menu
              </span>
            </div>
          </div>

          {/* ── Right: actions ── */}
          <div className="flex shrink-0 items-center gap-2">
            <OverflowMenu items={secondaryActions} />

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              onClick={() => setIsDialogOpen(true)}
              aria-label="Add bookmark"
              className="relative flex cursor-pointer items-center gap-1.5 overflow-hidden rounded-[0.625rem] border border-white/8 bg-white/4 px-3.5 py-2 text-[0.8rem] font-semibold tracking-[-0.01em] whitespace-nowrap text-zinc-300 transition-colors duration-200 outline-none hover:border-white/14 hover:bg-white/7 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(255,255,255,0.12)_0%,transparent_60%)]"
              />
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Add Bookmark</span>
            </motion.button>
          </div>
        </header>

        {/* ── Scroll-fade: pure black → transparent ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full"
          style={{
            height: "3.5rem",
            background:
              "linear-gradient(to bottom, #000000 0%, rgba(0,0,0,0.6) 50%, transparent 100%)",
          }}
        />
      </div>

      <AddBookmarkDialog
        isDialogOpen={isDialogOpen}
        onDialogClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}
