export default function Header() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-sky-500/10 via-sky-500/2 to-transparent px-4 py-20 sm:py-28">
      {/* Glow effect */}
      {/*<div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-linear-to-b from-amber-500/10 to-transparent blur-3xl" />*/}

      <div className="relative mx-auto max-w-6xl ">

        <div>
          
        </div>
        
        <div className=" ">
          <h1 className="text-6xl tracking-tight text-white">
            The lab
            <span className="font-serif">Quick craft</span>
          </h1>
          <p className="mt-4 max-w-lg text-sm text-zinc-400 sm:text-base">
            Create, customize, and prototype interface components with ease.
          </p>
        </div>
      </div>
    </section>
  );
}
