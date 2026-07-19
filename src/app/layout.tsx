import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import ThemeProvider from "./theme-provider";
import QueryProvider from "./query-provider";
import "./globals.css";

const serif = Instrument_Serif({
  weight: "400",
  variable: "--font-serif",
  subsets: ["latin"],
  style: "italic",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DevSpace",
    template: "%s | DevSpace",
  },
  description: "A seamless production-ready dashboard app for developers",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DevSpace",
  },
  icons: {
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
