import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { Nav } from "@/components/landing/nav";
import { WhyGrid } from "@/components/landing/why";
import { CliSection } from "@/components/landing/cli";

export default function Page() {
  return (
    <main className="bg-background text-foreground font-sans text-[15px] leading-[1.55] antialiased [text-rendering:optimizeLegibility] font-features-['ss01','ss02','cv11'] [&_a]:no-underline">
      <Nav />
      <Hero />
      <WhyGrid />
      <CliSection />
      <Footer />
    </main>
  );
}
