import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import SmoothScroll from "@/components/layout/smooth-scroll";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <div className="flex min-h-screen flex-col bg-neutral-950">
        <Navbar />
        <main className="flex w-full grow flex-col"></main>
        {children}
        <Footer />
      </div>
    </SmoothScroll>
  );
}
