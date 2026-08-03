import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { dash } from "@better-auth/infra";
import { db } from "./db";

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  trustedOrigins: [
    "http://localhost:3000",
    process.env.NEXT_PUBLIC_APP_URL as string,
  ].filter(Boolean),

  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  plugins: [
    dash({
      apiKey: process.env.BETTER_AUTH_API_KEY,
      apiTimeout: 5_000,
      ...(process.env.BETTER_AUTH_API_URL
        ? { apiUrl: process.env.BETTER_AUTH_API_URL }
        : {}),
      ...(process.env.BETTER_AUTH_KV_URL
        ? { kvUrl: process.env.BETTER_AUTH_KV_URL }
        : {}),
    }),
  ],
});

