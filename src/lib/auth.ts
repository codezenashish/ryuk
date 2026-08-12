import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/lib/prisma";

const isProduction = process.env.NODE_ENV === "production";

function toOrigin(value?: string) {
  if (!value) return undefined;

  const url = value.startsWith("http") ? value : `https://${value}`;

  try {
    return new URL(url).origin;
  } catch {
    return undefined;
  }
}

// VERCEL_URL has no protocol, while BETTER_AUTH_URL should be the canonical
// public app URL. This fallback keeps production deployments functional when
// the canonical variable has not been set yet.
const baseURL =
  toOrigin(process.env.BETTER_AUTH_URL) ??
  toOrigin(process.env.VERCEL_URL) ??
  toOrigin(process.env.NEXT_PUBLIC_APP_URL) ??
  "http://localhost:3000";

const trustedOrigins = [
  baseURL,
  toOrigin(process.env.BETTER_AUTH_URL),
  toOrigin(process.env.NEXT_PUBLIC_APP_URL),
  toOrigin(process.env.VERCEL_URL),
  !isProduction ? "http://localhost:3000" : undefined,
].filter((origin): origin is string => Boolean(origin));

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL,
  trustedOrigins,
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  advanced: {
    // Vercel terminates TLS before forwarding requests to the function.
    // These attributes retain secure first-party OAuth and session cookies.
    useSecureCookies: isProduction,
    defaultCookieAttributes: {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
    },
  },
  logger: {
    // Set BETTER_AUTH_DEBUG=true temporarily in Vercel when diagnosing a flow.
    // Do not leave debug logs enabled in production longer than necessary.
    level: process.env.BETTER_AUTH_DEBUG === "true" ? "debug" : "error",
    disableColors: isProduction,
  },
});
