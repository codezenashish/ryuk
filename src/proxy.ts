import { NextResponse } from "next/server";
// import { clerkMiddleware } from "@clerk/nextjs/server";

// Temporarily passing through requests since auth setup is in progress
export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

