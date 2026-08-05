"use client";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import SmoothScroll from "@/components/layout/smooth-scroll";
import { usePathname } from "next/navigation";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavRout = ["/quick-craft", "/quick-docs"];
  const showNavbar = !hideNavRout.includes(pathname);

  return (
    <SmoothScroll>
      <div className="flex min-h-screen flex-col bg-[#0c0c0b]">
        {showNavbar && <Navbar />}
        <main className="flex w-full grow flex-col">{children}</main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
