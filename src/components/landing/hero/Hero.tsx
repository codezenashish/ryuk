import HeroContent from "./HeroContent";

const Hero = () => {
  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col justify-end px-8 pb-12 pt-24 md:px-14 md:pb-16">
      {/* <div className="pointer-events-none absolute top-0 right-0 w-70 h-70 rounded-bl-full bg-indigo-600/10" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/5 to-transparent" /> */}
      <HeroContent />
    </section>
  );
};

export default Hero;
