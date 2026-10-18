"use client";

import { useRef, useState } from "react";
import { useCreateBookmark } from "../hooks/use-bookmarks";
import { fetchUrlMetadataAction } from "../actions";

export function BookmarkForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const { mutate, isPending, error } = useCreateBookmark();

  const handleUrlBlur = async () => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) return;
    if (title.trim()) return;

    setIsScraping(true);
    const res = await fetchUrlMetadataAction(url);
    if (res?.data?.title) {
      setTitle(res.data.title);
    }
    setIsScraping(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("url", url);
    formData.append("title", title);

    mutate(formData, {
      onSuccess: () => {
        setUrl("");
        setTitle("");
        formRef.current?.reset();
      },
    });
  };

  return (
    <section className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs">
      <h2 className="text-sm font-semibold mb-3 text-foreground">Add Bookmark</h2>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <label htmlFor="bookmark-url" className="sr-only">Bookmark URL</label>
            <input
              id="bookmark-url"
              type="url"
              name="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={handleUrlBlur}
              placeholder="Paste URL (https://...)"
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="sm:w-1/3">
            <label htmlFor="bookmark-title" className="sr-only">Bookmark Title</label>
            <input
              id="bookmark-title"
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isScraping ? "Fetching title..." : "Title"}
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="submit"
            disabled={isPending || isScraping}
            className="rounded-lg bg-primary text-primary-foreground px-5 py-2 text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50 shrink-0 cursor-pointer"
          >
            {isPending ? "Adding..." : "Add"}
          </button>
        </div>
      </form>
      {error && <p className="text-xs text-destructive mt-2">{error.message}</p>}
    </section>
  );
}
