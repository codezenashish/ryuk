import { notFound } from "next/navigation";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { BookmarkCard, BookmarkItem } from "@/features/bookmarks/components/bookmark-card";
import { getIconComponent } from "@/features/bookmarks/utils/category-icon-registry";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SharedCategoryPage({
  params,
}: {
  params: Promise<{ shareToken: string }>;
}) {
  const { shareToken } = await params;

  if (!shareToken) {
    notFound();
  }

  // Find the category by shareToken
  const sharedCategory = await db.query.categories.findFirst({
    where: and(eq(categories.shareToken, shareToken), eq(categories.isShared, true)),
    with: {
      user: {
        columns: {
          name: true,
          email: true,
          image: true,
        },
      },
      bookmarks: {
        with: {
          category: true,
          // tags: true, // tags might be needed if you display them
        }
      },
    },
  });

  if (!sharedCategory) {
    notFound();
  }

  const categoryIcon = getIconComponent(sharedCategory.icon);
  const ownerName = sharedCategory.user?.name || sharedCategory.user?.email || "Someone";

  return (
    <div className="min-h-screen bg-paper font-body text-ink pb-24">
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 h-16 border-b border-line bg-paper/80 backdrop-blur-md flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-display text-lg font-bold tracking-tight text-ink hover:text-ink-2 transition">
            Ryuk
          </Link>
          <span className="text-ink-3">/</span>
          <span className="text-sm font-medium text-ink-2">Shared Category</span>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2 text-xs font-medium text-paper hover:bg-ink-2 transition shadow-sm"
        >
          Create your own
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        {/* Category Info */}
        <div className="flex flex-col items-center text-center space-y-6 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="p-4 rounded-3xl bg-paper-2 border border-line shadow-sm relative overflow-hidden group">
             <div 
               className="absolute inset-0 opacity-20 group-hover:opacity-30 transition duration-500" 
               style={{ backgroundColor: sharedCategory.color }} 
             />
             <HugeiconsIcon icon={categoryIcon} size={48} className="text-ink relative z-10" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-ink">
              {sharedCategory.name}
            </h1>
            <p className="text-lg text-ink-3 max-w-xl mx-auto">
              A curated collection by <span className="font-semibold text-ink">{ownerName}</span>
            </p>
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-paper-3 border border-line-2 text-sm text-ink-2 font-mono">
            {sharedCategory.bookmarks.length} Bookmarks
          </div>
        </div>

        {/* Bookmarks Grid */}
        {sharedCategory.bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-1000 delay-150">
            {sharedCategory.bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="pointer-events-auto">
                <BookmarkCard
                  bookmark={bookmark as unknown as BookmarkItem}
                  layoutMode="grid"
                  // We omit edit/delete actions so they are read-only
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-line-2 rounded-3xl bg-paper-2">
            <h3 className="text-xl font-semibold text-ink-2 mb-2">It&apos;s empty here!</h3>
            <p className="text-ink-3">There are no bookmarks in this category yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
