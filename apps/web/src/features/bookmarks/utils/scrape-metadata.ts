import * as cheerio from "cheerio";

export interface ScrapedMetadata {
  title?: string;
  description?: string;
  faviconUrl?: string;
}

export async function scrapeUrlMetadata(
  targetUrl: string,
): Promise<ScrapedMetadata> {
  try {
    const urlObj = new URL(targetUrl);

    const response = await fetch(urlObj.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RyukBot/1.0)",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return {
        faviconUrl: `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`,
      };
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const title =
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      $("title").text().trim() ||
      undefined;

    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      undefined;

    let faviconUrl =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href") ||
      $('link[rel="apple-touch-icon"]').attr("href");

    if (faviconUrl && !faviconUrl.startsWith("http")) {
      faviconUrl = new URL(faviconUrl, urlObj.origin).toString();
    } else if (!faviconUrl) {
      faviconUrl = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
    }

    return { title, description, faviconUrl };
  } catch {
    try {
      const hostname = new URL(targetUrl).hostname;
      return {
        faviconUrl: `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
      };
    } catch {
      return {};
    }
  }
}
