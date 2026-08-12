import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json(
      { error: "URL query parameter is required" },
      { status: 400 }
    );
  }

  let formattedUrl = targetUrl.trim();
  if (!/^https?:\/\//i.test(formattedUrl)) {
    formattedUrl = `https://${formattedUrl}`;
  }

  let domain = "";
  let googleFavicon = "";

  try {
    const urlObj = new URL(formattedUrl);
    domain = urlObj.hostname.replace(/^www\./, "");
    googleFavicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return NextResponse.json(
      { error: "Invalid URL provided" },
      { status: 400 }
    );
  }

  const fallbackTitle = domain
    .split(".")[0]
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  try {
    // Ultra-fast 2-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2200);

    const response = await fetch(formattedUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok || !response.body) {
      return NextResponse.json({
        title: fallbackTitle,
        description: "",
        favicon: googleFavicon,
        domain,
      });
    }

    // Read only first 30KB of HTML stream (where <title> & <meta> reside)
    const reader = response.body.getReader();
    let chunks = "";
    let receivedBytes = 0;
    const maxBytes = 30000; // ~30KB

    while (receivedBytes < maxBytes) {
      const { done, value } = await reader.read();
      if (done || !value) break;
      chunks += new TextDecoder().decode(value);
      receivedBytes += value.byteLength;
      if (chunks.includes("</head>") || chunks.includes("</HEAD>")) {
        reader.cancel();
        break;
      }
    }

    const $ = cheerio.load(chunks);

    // Extract Title with priority (OG Title -> Twitter Title -> Document Title -> Fallback)
    const title =
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      $("title").text() ||
      fallbackTitle;

    // Extract Description
    const description =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="twitter:description"]').attr("content") ||
      "";

    // Extract Favicon
    let favicon: string | null =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href") ||
      $('link[rel="apple-touch-icon"]').attr("href") ||
      null;

    if (favicon) {
      if (favicon.startsWith("//")) {
        favicon = `https:${favicon}`;
      } else if (favicon.startsWith("/")) {
        favicon = `${new URL(formattedUrl).origin}${favicon}`;
      } else if (!/^https?:\/\//i.test(favicon)) {
        favicon = `${new URL(formattedUrl).origin}/${favicon}`;
      }
    } else {
      favicon = googleFavicon;
    }

    return NextResponse.json({
      title: title.trim().replace(/\s+/g, " "),
      description: description.trim().replace(/\s+/g, " "),
      favicon,
      domain,
    });
  } catch {
    // If request times out or fails, instantly return clean fallback
    return NextResponse.json({
      title: fallbackTitle,
      description: "",
      favicon: googleFavicon,
      domain,
    });
  }
}
