import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Protected routes that require authentication
const protectedRoutes = ["/dashboard", "/bookmarks", "/notes"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute) {
    const sessionCookie = getSessionCookie(request);
    if (!sessionCookie) {
      const loginUrl = new URL("/", request.url);
      loginUrl.searchParams.set("auth", "required");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
   
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
