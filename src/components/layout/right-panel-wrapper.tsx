"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RightPanelHeader from "./right-panel-header";

export default function RightPanelWrapper({
  rightbar,
}: {
  rightbar: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-background">
      <RightPanelHeader isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />

      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="right-panel-slide-content"
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="h-full overflow-y-auto scrollbar-none"
            >
              {rightbar}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
