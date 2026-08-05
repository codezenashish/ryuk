"use client";

import { motion, type Variants } from "framer-motion";
import {
  LuGitBranch,
  LuShieldAlert,
  LuServer,
  LuGithub,
  LuArrowRight,
} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import OpenSourceMockup from "./open-source-mockup";

const bulletVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function OpenSourceSection() {
  return (
    <section
      className="relative w-full overflow-hidden px-4 py-28"
      id="open-source"
    >
      <div className="pointer-events-none absolute top-1/2 right-0 h-150 w-150 -translate-y-1/2 bg-[radial-gradient(circle,rgba(107,143,113,0.03)_0%,transparent_70%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-stone-800/40 to-transparent" />

      <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            transition={{ staggerChildren: 0.1 }}
            className="flex flex-col gap-6"
          >
            <motion.div
              variants={bulletVariants}
              className="text-[10px] font-bold tracking-widest text-stone-500 uppercase"
            >
              Open Source &amp; Auditable
            </motion.div>
            <motion.h2
              variants={bulletVariants}
              className="font-inter text-3xl leading-tight tracking-tight text-stone-200 sm:text-5xl"
            >
              Privacy by design, <br />
              <span className="text-stone-500 font-serif">not by promise.</span>
            </motion.h2>

            <div className="mt-4 flex flex-col gap-6">
              <motion.div variants={bulletVariants}>
                <Bullet
                  icon={<LuGitBranch size={15} />}
                  title="Fully open source"
                  desc="Every single line of backend and interface code lives transparently on GitHub — read it, fork it, or audit it freely."
                />
              </motion.div>
              <motion.div variants={bulletVariants}>
                <Bullet
                  icon={<LuShieldAlert size={15} />}
                  title="Client-side AES-256 encryption"
                  desc="Notes and raw configuration snippets undergo cryptographic transforms before escaping your client runtime environment. Passphrases never visit database instances."
                />
              </motion.div>
              <motion.div variants={bulletVariants}>
                <Bullet
                  icon={<LuServer size={15} />}
                  title="Self-hostable architecture"
                  desc="Spin up dedicated containers locally or on private clouds in minutes for uncompromised personal data sovereignty."
                />
              </motion.div>
            </div>

            <motion.div
              variants={bulletVariants}
              className="mt-4 flex flex-wrap items-center gap-4"
            >
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
                size="sm"
                className="h-9 rounded-lg border-stone-800 bg-stone-900/60 px-4 text-xs text-stone-300 transition-all duration-300 hover:bg-stone-800 hover:text-white"
              >
                <LuGithub size={14} />
                View on GitHub
              </Button>
              <span className="font-mono text-xs text-stone-600">
                MIT License
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4"
          >
            <OpenSourceMockup />

            <div className="group flex cursor-pointer items-center justify-between rounded-xl border border-white/6 bg-[#111110]/60 p-4 transition-all duration-500 hover:border-white/12 hover:shadow-lg hover:shadow-black/10">
              <div className="flex flex-col gap-0.5">
                <h4 className="text-xs font-semibold text-stone-300 transition-colors group-hover:text-white">
                  Review Cryptographic Audits
                </h4>
                <p className="text-[11px] text-stone-500">
                  Inspect mathematical proof reports and build configurations.
                </p>
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-stone-800 bg-stone-900 text-stone-400 transition-all duration-300 group-hover:bg-white group-hover:text-stone-900">
                <LuArrowRight size={12} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

interface BulletProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

function Bullet({ icon, title, desc }: BulletProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-stone-800 bg-stone-900/30 text-stone-400">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium text-stone-200">{title}</h3>
        <p className="text-xs leading-relaxed font-normal text-stone-500">
          {desc}
        </p>
      </div>
    </div>
  );
}
