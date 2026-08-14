import { useEffect } from "react";

type ShortcutMap = {
  [key: string]: (e: KeyboardEvent) => void;
};

export function useKeyboardShortcuts(shortcuts: ShortcutMap, isActive = true) {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      for (const [keyCombo, callback] of Object.entries(shortcuts)) {
        const keys = keyCombo.toLowerCase().split("+");
        const requiresCtrl = keys.includes("ctrl") || keys.includes("cmd");
        const requiresShift = keys.includes("shift");
        const requiresAlt = keys.includes("alt");
        
        const key = keys[keys.length - 1];

        const isCtrlPressed = e.ctrlKey || e.metaKey;
        
        if (
          (requiresCtrl === isCtrlPressed) &&
          (requiresShift === e.shiftKey) &&
          (requiresAlt === e.altKey) &&
          (e.key.toLowerCase() === key)
        ) {
          e.preventDefault();
          callback(e);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts, isActive]);
}
