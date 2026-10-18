import type { Bookmark } from "@ryuk/db";

interface BookmarkCardProps {
  bookmark: Bookmark;
}

export function BookmarkCard({ bookmark }: BookmarkCardProps) {
  return (
    <a
      href={bookmark.url}
      target="_blank"
      rel="noreferrer"
      className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/40 hover:shadow-sm transition-all text-foreground"
    >
      {bookmark.faviconUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={bookmark.faviconUrl}
          alt=""
          width={16}
          height={16}
          loading="lazy"
          className="w-4 h-4 mt-0.5 rounded-xs shrink-0 object-contain"
        />
      ) : (
        <div className="w-4 h-4 mt-0.5 rounded-xs bg-muted shrink-0 flex items-center justify-center text-[10px] text-muted-foreground">
          🔗
        </div>
      )}
      <div className="overflow-hidden min-w-0">
        <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
          {bookmark.title || bookmark.url}
        </h3>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{bookmark.url}</p>
      </div>
    </a>
  );
}
