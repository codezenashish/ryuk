import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DevNest | The Developer's Centralized Workspace",
  description:
    "Your ultimate developer hub. Seamlessly manage saved bookmarks, interconnected code notes, systems diagrams, and consistent coding habits in one secure dark-mode space.",
  icons: "./favicon.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col bg-black font-sans text-foreground">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
