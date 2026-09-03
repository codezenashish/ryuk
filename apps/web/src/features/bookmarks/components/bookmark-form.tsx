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
    <section className="border border-zinc-800 bg-zinc-950 p-4">
      <h2 className="text-sm font-semibold mb-3 text-zinc-200">Add Bookmark</h2>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            name="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={handleUrlBlur}
            placeholder="Paste URL (https://...)"
            required
            className="border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 flex-1"
          />
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isScraping ? "Fetching title..." : "Title"}
            required
            className="border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 sm:w-1/3"
          />
          <button
            type="submit"
            disabled={isPending || isScraping}
            className="bg-white text-black px-5 py-2 text-sm font-medium hover:bg-zinc-200 transition disabled:opacity-50 shrink-0"
          >
            {isPending ? "Adding..." : "Add"}
          </button>
        </div>
      </form>
      {error && <p className="text-xs text-red-400 mt-2">{error.message}</p>}
    </section>
  );
}
