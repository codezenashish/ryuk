import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";

export default function BookmarkLoadingState() {
  return (
    <div className="flex h-full items-center justify-center py-16 text-zinc-500">
      <HugeiconsIcon icon={Loading03Icon} className="animate-spin" size={20} />
    </div>
  );
}
