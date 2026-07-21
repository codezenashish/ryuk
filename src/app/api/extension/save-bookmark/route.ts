import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createBookmarkAction } from "@/features/bookmarks/actions/bookmark-action";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get("x-api-key");

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "API Key missing. Please link your extension.",
        },
        { status: 401, headers: corsHeaders },
      );
    }

    const user = await db.user.findUnique({
      where: { apiKey },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid API Key. Please update in Extension.",
        },
        { status: 403, headers: corsHeaders },
      );
    }

    const body = await req.json();
    const { url, title, categoryName } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, error: "URL is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    const hostname = new URL(url).hostname;
    const favicon = `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`;

    // 3. User ki verified ID ke sath bookmark create karein
    const result = await createBookmarkAction({
      url,
      title: title || hostname,
      favicon,
      categoryName: categoryName || "General",
      userId: user.id, // Authenticated User ID
    });

    return NextResponse.json(
      { success: true, bookmark: result.bookmark },
      { headers: corsHeaders },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders },
    );
  }
}
