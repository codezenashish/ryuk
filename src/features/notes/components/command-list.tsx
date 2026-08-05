"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

export const CommandList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        setSelectedIndex(
          (selectedIndex + props.items.length - 1) % props.items.length,
        );
        return true;
      }
      if (event.key === "ArrowDown") {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
        return true;
      }
      if (event.key === "Enter") {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  useEffect(() => {
    setSelectedIndex(0);
  }, [props.items]);

  return (
    <div className="animate-in fade-in slide-in-from-top-1 z-50 w-52 rounded-xl border border-stone-200 dark:border-white/10 bg-white/95 dark:bg-[#111110]/95 p-1.5 shadow-xl shadow-stone-950/10 dark:shadow-black/80 backdrop-blur-md duration-100">
      {props.items.length ? (
        props.items.map((item: any, index: number) => (
          <button
            key={index}
            onClick={() => selectItem(index)}
            className={`flex w-full cursor-pointer flex-col gap-0.5 rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
              index === selectedIndex
                ? "bg-stone-100 dark:bg-white/8 text-stone-900 dark:text-stone-100"
                : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
            }`}
          >
            <span className="font-medium">{item.title}</span>
            <span className="text-[10px] text-stone-400 dark:text-stone-500">
              {item.description}
            </span>
          </button>
        ))
      ) : (
        <div className="px-2 py-1.5 text-xs text-stone-400 dark:text-stone-500">
          No results found
        </div>
      )}
    </div>
  );
});

CommandList.displayName = "CommandList";
