// Shared page chrome for every /register/* page — same ambience layers as
// the rest of the site (video bg + scrim + sparkles) inside a fixed eyebrow.

import Sparkles from "@/components/Sparkles";
import HeroVideoBg from "@/components/HeroVideoBg";
import RoughDivider from "@/components/RoughDivider";

export default function RegisterShell({ eyebrow, title, accent, children, stack = false, wide = false }) {
  return (
    <section className="relative isolate overflow-hidden min-h-screen pt-28 pb-24 px-6 flex flex-col items-center">
      <HeroVideoBg />
      {/* Matte veil — mutes the video so registration reads calm/professional */}
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-midnight/55 pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 -z-20 hp-scrim pointer-events-none opacity-60" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none">
        <Sparkles count={9} />
      </div>

      <div className="mb-6 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] text-cyan-hp/70 font-display text-center">
        <RoughDivider width={48} height={20} color="#66FCF1" seed={3} />
        {eyebrow}
        <RoughDivider width={48} height={20} color="#66FCF1" seed={5} />
      </div>

      <h1
        className="font-display font-black tracking-tight text-silver-hp leading-[1.05] text-balance text-center hp-glow"
        style={{ fontSize: "clamp(2.2rem, 8vw, 5rem)", letterSpacing: "0.01em" }}
      >
        {stack ? (
          <>
            {title && <span className="block">{title}</span>}
            <span className="block text-gold-hp hp-glow-gold">{accent}</span>
          </>
        ) : (
          <>
            {title}{" "}
            <span className="text-gold-hp hp-glow-gold">{accent}</span>
          </>
        )}
      </h1>

      <div className={`mt-10 w-full ${wide ? "max-w-5xl" : "max-w-2xl"}`}>{children}</div>
    </section>
  );
}
