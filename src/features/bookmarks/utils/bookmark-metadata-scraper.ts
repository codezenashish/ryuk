import * as cheerio from "cheerio";

export async function getBookmarkMeta(
  url: string,
): Promise<{ title: string; icon: string }> {
  let hostname: string;
  try {
    hostname = new URL(url).hostname;
  } catch {
    return { title: url, icon: getFallbackFavicon(url) };
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; DevNest/1.0; +https://devnest.app)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return { title: hostname, icon: getFallbackFavicon(url) };
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // --- Title extraction (ordered by preference) ---
    const title =
      $('meta[property="og:title"]').attr("content")?.trim() ||
      $('meta[name="twitter:title"]').attr("content")?.trim() ||
      $("title").first().text().trim() ||
      hostname;

    // --- Favicon extraction (ordered by preference) ---
    const icon = extractFavicon($, url) || getFallbackFavicon(url);

    return { title, icon };
  } catch (error) {
    console.error("[metadata-parser] Fetch error:", error);
    return { title: hostname, icon: getFallbackFavicon(url) };
  }
}

/**
 * Attempts to find the best favicon from <link> tags in the parsed HTML.
 */
function extractFavicon($: cheerio.CheerioAPI, pageUrl: string): string | null {
  // Selectors ordered from most specific/high-res to least
  const selectors = [
    'link[rel="apple-touch-icon"]',
    'link[rel="apple-touch-icon-precomposed"]',
    'link[rel="icon"][type="image/svg+xml"]',
    'link[rel="icon"]',
    'link[rel="shortcut icon"]',
  ];

  for (const selector of selectors) {
    const href = $(selector).attr("href");
    if (href) {
      return resolveUrl(href, pageUrl);
    }
  }

  return null;
}

/**
 * Resolves a potentially relative URL against the page origin.
 */
function resolveUrl(href: string, pageUrl: string): string {
  try {
    return new URL(href, pageUrl).href;
  } catch {
    return href;
  }
}

/**
 * Google S2 fallback — always returns a usable icon URL.
 */
function getFallbackFavicon(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
  } catch {
    return `https://www.google.com/s2/favicons?sz=64&domain=example.com`;
  }
}
