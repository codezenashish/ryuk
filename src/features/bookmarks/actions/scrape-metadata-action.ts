"use server";

import { getBookmarkMeta } from "../utils/bookmark-metadata-scraper";

/**
 * Server action wrapper around the Cheerio-based metadata parser.
 * Called from the client when the user enters/pastes a URL.
 */
export async function fetchBookmarkMetadata(url: string) {
  try {
    const meta = await getBookmarkMeta(url);
    return { success: true, ...meta };
  } catch {
    return { success: false, title: "", icon: "" };
  }
}
