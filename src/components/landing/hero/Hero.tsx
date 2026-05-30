import HeroContent from "./HeroContent";

const Hero = () => {
  return (
    <section className="relative overflow-hidden min-h-screen bg-[#080808] flex flex-col justify-end px-8 pb-12 pt-24 md:px-14 md:pb-16">

      {/* Noise texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      {/* Top-right purple corner accent */}
      <div className="pointer-events-none absolute top-0 right-0 w-70 h-70 rounded-bl-full bg-indigo-600/10" />

     
      {/* Bottom horizontal rule */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/5 to-transparent" />
      <HeroContent />
    </section>
  );
};

export default Hero;