import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handlers = toNextJsHandler(auth);

async function handleAuthRequest(request: Request) {
  const pathname = new URL(request.url).pathname;

  try {
    const response = await (request.method === "GET"
      ? handlers.GET(request)
      : handlers.POST(request));

    if (!response.ok) {
      // Do not log the query string: OAuth callbacks contain a one-time code.
      console.error("[auth] Request failed", {
        method: request.method,
        pathname,
        status: response.status,
        vercelId: request.headers.get("x-vercel-id"),
      });
    }

    return response;
  } catch (error) {
    console.error("[auth] Unhandled handler error", {
      method: request.method,
      pathname,
      vercelId: request.headers.get("x-vercel-id"),
      error,
    });

    return Response.json(
      { message: "Authentication service error. Check server logs for details." },
      { status: 500 }
    );
  }
}

export const GET = handleAuthRequest;
export const POST = handleAuthRequest;
