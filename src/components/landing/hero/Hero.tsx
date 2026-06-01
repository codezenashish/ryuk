import HeroContent from "./HeroContent";
import HeroSearchInput from "./HeroSearchInput";

const Hero = () => {
  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col justify-end px-8 pb-12 pt-24 md:px-14 md:pb-16">
      <HeroContent />
      <HeroSearchInput />
    </section>
  );
};

export default Hero;