"use server";

import { getBookmarkMeta } from "../utils/bookmark-metadata-scraper";

export async function fetchBookmarkMetadata(url: string) {
  try {
    const meta = await getBookmarkMeta(url);
    return { success: true, ...meta };
  } catch {
    return { success: false, title: "", icon: "" };
  }
}
