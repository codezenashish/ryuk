import PageHeader from "@/src/features/bookmarks/components/PageHeader";
import CategoryGridSection from "@/src/features/bookmarks/components/social-category-section";
import { db } from "@/src/lib/db";

const MOCK_USER_ID = "mock-user-id-123";

export default async function BookmarksPage() {
  const categories = await db.category.findMany({
    where: { userId: MOCK_USER_ID },
    orderBy: { position: "asc" },
    include: {
      bookmarks: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          title: true,
          url: true,
          favicon: true,
        },
      },
    },
  });

  return (
    <>
      <PageHeader title="Bookmarks" />
      <div className="flex flex-col gap-8 px-4 pb-12">
        {categories.map((category) => (
          <CategoryGridSection
            key={category.id}
            id={category.id}
            initialName={category.name}
            initialIcon={category.icon}
            initialBookmarks={category.bookmarks.map((b) => ({
              id: String(b.id),
              title: b.title,
              url: b.url ?? "",
              favicon: b.favicon,
            }))}
          />
        ))}

        {categories.length === 0 && (
          <p className="text-center text-xs text-zinc-600 font-mono mt-16">
            No bookmarks yet — add your first one above ↑
          </p>
        )}
      </div>
    </>
  );
}
