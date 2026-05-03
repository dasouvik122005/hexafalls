import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RoughFrame from "@/components/RoughFrame";
import RoughDivider from "@/components/RoughDivider";
import { REGISTRATION_TRACKS } from "@/lib/registrationTracks";

export const metadata = {
  title: "Registration · HexaFalls Techfest",
  description:
    "Pick a track and sign the scroll — registration for HexaFalls is open.",
};

export default function RegisterPage() {
  const tracks = Object.values(REGISTRATION_TRACKS);
  return (
    <main className="flex-1">
      <TopBar />
      <section className="relative isolate overflow-hidden min-h-screen pt-32 pb-24 px-6">
        <div className="mx-auto mb-6 flex max-w-3xl items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] text-cyan-hp/70 font-display text-center">
          <RoughDivider width={48} height={20} color="#66FCF1" seed={3} />
          Owls await your name
          <RoughDivider width={48} height={20} color="#66FCF1" seed={5} />
        </div>

        <h1 className="text-center font-display font-black tracking-tight text-silver-hp leading-[0.95] text-[14vw] sm:text-[10vw] md:text-[8vw] hp-glow">
          <span className="block">Open</span>
          <span className="block text-gold-hp hp-glow-gold text-[12vw] sm:text-[8vw] md:text-[6.5vw] mt-2">
            Registration
          </span>
        </h1>

        <p className="mx-auto mt-10 max-w-2xl text-center font-wizard text-silver-hp/75 text-base sm:text-lg leading-relaxed">
          Four tracks, four scrolls. Pick the path that calls to you and sign your name.
        </p>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2">
          {tracks.map((t, i) => (
            <RoughFrame
              key={t.slug}
              seed={101 + i * 7}
              stroke={t.color}
              mistColor={t.color}
              strokeWidth={1.4}
              roughness={1.5}
              bowing={1.2}
              padding={22}
              className="h-full bg-slate-hp/30 backdrop-blur-sm"
              inner="flex h-full flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span
                  className="font-display tracking-[0.3em] uppercase text-[10px]"
                  style={{ color: t.color }}
                >
                  Sign the scroll
                </span>
                <span
                  className="rounded-full border px-2 py-0.5 font-display text-[8px] uppercase tracking-[0.3em]"
                  style={{
                    borderColor: `${t.color}55`,
                    color: `${t.color}cc`,
                    backgroundColor: `${t.color}1a`,
                  }}
                >
                  {t.kind === "solo" ? "solo" : t.kind === "squad" ? "squad" : "team"}
                </span>
              </div>

              <h2
                className="font-display tracking-tight text-2xl leading-tight"
                style={{ color: t.color, textShadow: `0 0 18px ${t.glow}` }}
              >
                {t.name}
              </h2>
              <p className="font-wizard text-silver-hp/65 text-sm leading-relaxed">
                {t.blurb}
              </p>

              <div className="mt-auto pt-2">
                <Link
                  href={`/register/${t.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full border px-4 py-2 font-display text-[11px] uppercase tracking-[0.3em] transition"
                  style={{
                    borderColor: `${t.color}80`,
                    color: t.color,
                    backgroundColor: `${t.color}1a`,
                  }}
                >
                  Register
                  <span className="group-hover:translate-x-0.5 transition">→</span>
                </Link>
              </div>
            </RoughFrame>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
