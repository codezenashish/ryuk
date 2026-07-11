import CtaSection from "@/components/landing/cta/cta";
import FeaturesSection from "@/components/landing/features-workspace/features-section";
import Hero from "@/components/landing/hero/hero";
import NoSignup from "@/components/landing/no-signup/no-signup";
import OpenSourceSection from "@/components/landing/open-source/open-source";

export default function LandingPage() {
  return (
    <div className="w-full">
      <Hero />
      <NoSignup />
      <FeaturesSection />
      <OpenSourceSection />
      <CtaSection />
    </div>
  );
}
