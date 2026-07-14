import BookmarksToolbar from "@/features/bookmarks/components/bookmark-toolbar";

export default function BookmarksPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-white font-sans">Bookmarks</h1>
        <p className="text-sm text-zinc-400">Organize and quickly access your developer resources.</p>
      </div>

      <BookmarksToolbar />
    </div>
  );
}
