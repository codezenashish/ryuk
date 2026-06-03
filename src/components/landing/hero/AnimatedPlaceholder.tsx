"use client";

import { useEffect, useState } from "react";

interface AnimatedPlaceholderProps {
  text: string;
}

export default function AnimatedPlaceholder({ text }: AnimatedPlaceholderProps) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let index = 0;
    setDisplayText(""); 

    const interval = setInterval(() => {
      index++;
      setDisplayText(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="absolute inset-y-0 left-6 right-16 flex items-center pointer-events-none overflow-hidden">
      <span className="font-mono text-xs sm:text-sm text-zinc-400 whitespace-nowrap">
        {displayText}
      </span>
      <span className="ml-1 h-4 w-[2px] bg-indigo-400 animate-pulse shrink-0" />
    </div>
  );
}