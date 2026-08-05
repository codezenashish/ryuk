"use client";

import { motion } from "framer-motion";
import { LuHouse, LuStar } from "react-icons/lu";
import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section className="relative w-full overflow-hidden px-4 pb-32">
      <div className="pointer-events-none absolute top-1/2 left-1/4 h-96 w-96 -translate-y-1/2 bg-[radial-gradient(circle,rgba(139,115,85,0.03)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute top-1/2 right-1/4 h-96 w-96 -translate-y-1/2 bg-[radial-gradient(circle,rgba(107,143,113,0.03)_0%,transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto w-full max-w-5xl"
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/6 bg-[#111110]/80 px-6 py-16 text-center backdrop-blur-xl sm:py-20">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-stone-700/20 to-transparent" />

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-stone-800 bg-stone-900/30 px-3 py-1 text-[10px] font-semibold tracking-widest text-stone-500 uppercase backdrop-blur-md">
            <LuHouse size={12} className="text-stone-600" />
            <span>DevNest Hub</span>
          </div>

          <h2 className="mx-auto mb-5 max-w-2xl font-sans text-3xl leading-tight tracking-tight text-stone-200 sm:text-5xl">
            Start gathering it all <br />
            <span className="text-stone-500 font-serif">in one unified space.</span>
          </h2>

          <p className="mx-auto mb-10 max-w-sm text-sm leading-relaxed text-stone-400 sm:text-base">
            Open source, privacy-first infrastructure, and completely free to
            self-host. Your control, your data layer rules.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              render={<a href="#features" />}
              nativeButton={false}
              className="h-11 rounded-xl bg-white px-6 text-sm font-medium text-stone-900 transition-all duration-300 hover:bg-stone-100 hover:shadow-lg hover:shadow-white/5"
            >
              Create your nest
            </Button>

            <Button
              render={
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              nativeButton={false}
              variant="outline"
              className="h-11 rounded-xl border-stone-800 bg-stone-900/40 px-6 text-sm text-stone-400 transition-all duration-300 hover:border-stone-700 hover:bg-stone-900/60 hover:text-stone-200"
            >
              <LuStar size={14} className="text-stone-500" />
              Star on GitHub
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
