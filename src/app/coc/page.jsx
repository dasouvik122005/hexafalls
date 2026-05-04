import { promises as fs } from "node:fs";
import path from "node:path";
import Link from "next/link";
import { marked } from "marked";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RoughFrame from "@/components/RoughFrame";
import RoughDivider from "@/components/RoughDivider";
import RoughStar from "@/components/RoughStar";
import RoughButton from "@/components/RoughButton";

export const metadata = {
  title: "Code of Conduct · HexaFalls Techfest",
  description:
    "How we behave at HexaFalls — pledge, expected standards, scope, reporting, and enforcement.",
};

// Static page; cache the rendered HTML across requests.
export const dynamic = "force-static";
export const revalidate = false;

export default async function CodeOfConductPage() {
  const md = await fs.readFile(
    path.join(process.cwd(), "CODE_OF_CONDUCT.md"),
    "utf8"
  );
  marked.setOptions({ gfm: true, breaks: false, headerIds: true });
  const html = marked.parse(md);

  return (
    <main className="flex-1">
      <TopBar />

      <section className="relative isolate overflow-hidden min-h-screen pt-32 pb-24 px-6">
        {/* margin scribbles in the page corners */}
        <RoughStar
          size={28} color="#A78BFA" seed={71}
          className="absolute top-28 left-6 sm:left-12 opacity-65 hp-float pointer-events-none"
          style={{ animationDuration: "12s" }}
        />
        <RoughStar
          size={22} color="#D4AF37" fill seed={79}
          className="absolute top-44 right-8 sm:right-16 opacity-70 hp-float pointer-events-none"
          style={{ animationDuration: "14s", animationDelay: "1.5s" }}
        />
        <RoughStar
          size={18} color="#66FCF1" seed={83}
          className="absolute bottom-40 left-12 opacity-55 hp-float pointer-events-none"
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        />

        {/* Eyebrow */}
        <div className="mx-auto mb-6 flex max-w-3xl items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] text-cyan-hp/70 font-display text-center">
          <RoughDivider width={48} height={20} color="#66FCF1" seed={3} />
          The covenant we keep
          <RoughDivider width={48} height={20} color="#66FCF1" seed={5} />
        </div>

        {/* Headline */}
        <h1
          aria-label="Code of Conduct"
          className="font-display font-black tracking-tight text-silver-hp leading-[0.95] text-center text-[12vw] sm:text-[8vw] md:text-[6vw] hp-glow"
        >
          <span className="block">Code of</span>
          <span className="block text-gold-hp hp-glow-gold text-[12vw] sm:text-[7vw] md:text-[5.5vw] mt-2">
            Conduct
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-center font-wizard italic text-silver-hp/60 text-sm">
          Read it in full. By signing the scroll, you agree to abide by it.
        </p>

        {/* Section break */}
        <div className="mt-14 flex justify-center">
          <RoughDivider
            width={420}
            height={48}
            color="#D4AF37"
            ornament="✦"
            seed={19}
          />
        </div>

        {/* The actual prose, framed by a sketched border */}
        <div className="mx-auto mt-10 w-full max-w-3xl">
          <RoughFrame
            seed={37}
            stroke="#66FCF1"
            mistColor="#66FCF1"
            strokeWidth={1.4}
            roughness={1.5}
            bowing={1.2}
            padding={36}
            className="w-full bg-slate-hp/30 backdrop-blur-sm"
          >
            <article
              className="coc-prose"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </RoughFrame>
        </div>

        {/* Closing CTAs */}
        <div className="mx-auto mt-12 flex max-w-3xl flex-row flex-wrap items-center justify-center gap-4">
          <RoughButton
            as="a"
            href="mailto:support@hexafalls.org"
            color="#D4AF37"
            glow="rgba(212,175,55,0.30)"
            shimmer
            seed={43}
            className="px-7 py-3 text-[12px]"
          >
            REPORT AN INCIDENT <span>↗</span>
          </RoughButton>
          <RoughButton
            as={Link}
            href="/"
            color="#C5C6C7"
            fill={false}
            seed={47}
            className="px-7 py-3 text-[11px]"
          >
            ← BACK TO THE HALL
          </RoughButton>
        </div>
      </section>

      <Footer />
    </main>
  );
}
