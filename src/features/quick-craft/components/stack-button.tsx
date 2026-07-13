import { IconType } from "react-icons";

interface StackButtonProps {
  name: string;
  icon: IconType;
  isActive: boolean;
  onClick: () => void;
}

export default function StackButton({
  name,
  icon: Icon,
  isActive,
  onClick,
}: StackButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-mono border transition-all duration-150 cursor-pointer ${
        isActive
          ? "border-violet-400/35 bg-violet-400/10 text-violet-200 font-semibold"
          : "border-white/8 bg-white/2.5 text-zinc-400 hover:border-violet-400/30 hover:text-zinc-100"
      }`}
    >
      <Icon className={`h-3.5 w-3.5 ${isActive ? "text-violet-300" : "text-zinc-500"}`} />
      <span>{name}</span>
    </button>
  );
}
