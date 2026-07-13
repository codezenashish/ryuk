"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TbAlertTriangle } from "react-icons/tb";

interface ConflictWarningsProps {
  warnings: string[];
}

export default function ConflictWarnings({ warnings }: ConflictWarningsProps) {
  return (
    <AnimatePresence>
      {warnings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0, y: -10 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="overflow-hidden space-y-2.5 pt-2"
        >
          {warnings.map((warning, idx) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              key={warning + idx}
              className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs leading-relaxed text-amber-300/90 shadow-lg shadow-amber-950/5"
            >
              <TbAlertTriangle className="h-4.5 w-4.5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-400 mr-1.5 font-mono uppercase tracking-wider text-[10px]">
                  Conflict Warning:
                </span>
                {warning}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
