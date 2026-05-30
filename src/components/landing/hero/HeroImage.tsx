import Image from "next/image";

const HeroImage = () => {
  return (
    <div className="relative flex h-[320px] w-[320px] items-center justify-center sm:h-[440px] sm:w-[440px] lg:h-[540px] lg:w-[540px]">
      
      {/* 3D Deep Shadow & Soft Glow behind the brain */}
      <div className="absolute inset-0 m-auto h-[70%] w-[70%] rounded-full bg-neutral-900/40 opacity-60 blur-[120px]" />
      
      {/* 3D Brain Render Image */}
      <Image
        src="/hero-image.png"
        alt="Psychowell Brain Concept"
        width={520}
        height={520}
        priority
        className="relative z-10 h-full w-full object-contain opacity-85 mix-blend-screen brightness-95 contrast-105 filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)]"
      />
    </div>
  );
};

export default HeroImage;