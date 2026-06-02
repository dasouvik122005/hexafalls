import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RoughFrame from "@/components/RoughFrame";
import RoughDivider from "@/components/RoughDivider";
import RoughButton from "@/components/RoughButton";
import Sparkles from "@/components/Sparkles";
import HeroVideoBg from "@/components/HeroVideoBg";

// Drop your brochure PDF at this path under /public for the download link.
const BROCHURE_PATH = "/brochures/brochure_sponsor.pdf";
const BROCHURE_FILENAME = "hexafalls-sponsorship.pdf";

// One image per PDF page — rendered inside our own themed frames so the
// preview blends with the rest of the site (no native PDF viewer chrome).
// The optimized assets live alongside the source PDF; regenerate with:
//   node scripts/optimize-brochure.mjs   (or rerun the inline sharp script)
// Each page ships as both .webp (~250 KB) and .jpg (~410 KB) — browsers
// pick the smaller one via the <picture><source> element below.
const BROCHURE_PAGES = [
  {
    webp: "/brochures/brochure-page-1.webp",
    jpg:  "/brochures/brochure-page-1.jpg",
    alt:  "Sponsorship brochure — page 1",
    width: 1600,
    height: 2262,
  },
  {
    webp: "/brochures/brochure-page-2.webp",
    jpg:  "/brochures/brochure-page-2.jpg",
    alt:  "Sponsorship brochure — page 2",
    width: 1600,
    height: 2262,
  },
];

export const metadata = {
  title: "Sponsorship Brochure · HexaFalls Techfest",
  description:
    "The HexaFalls sponsorship brochure — tiers, benefits, audience, and reach. Preview in the browser or download the PDF.",
  openGraph: {
    title: "Sponsorship Brochure · HexaFalls Techfest",
    description:
      "Tiers, benefits, audience and reach — everything you need to back HexaFalls.",
  },
};

export const dynamic = "force-static";
export const revalidate = false;

export default function SponsorshipBrochurePage() {
  return (
    <main className="flex-1">
      <TopBar />

      <section className="relative isolate overflow-hidden min-h-screen pt-28 pb-24 px-6 flex flex-col items-center">
        <HeroVideoBg />
        <div aria-hidden="true" className="absolute inset-0 -z-20 hp-scrim pointer-events-none" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none">
          <Sparkles count={18} />
        </div>

        {/* Eyebrow */}
        <div className="mx-auto mb-6 flex max-w-3xl items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] text-cyan-hp/70 font-display text-center">
          <RoughDivider width={48} height={20} color="#66FCF1" seed={3} />
          The patrons&apos; scroll
          <RoughDivider width={48} height={20} color="#66FCF1" seed={5} />
        </div>

        {/* Headline — inline so it wraps naturally on phones */}
        <h1
          aria-label="Sponsorship Brochure"
          className="font-display font-black tracking-tight text-silver-hp leading-[1.05] text-balance text-center hp-glow"
          style={{ fontSize: "clamp(2.2rem, 8vw, 5rem)", letterSpacing: "0.01em" }}
        >
          Sponsorship{" "}
          <span className="text-gold-hp hp-glow-gold">Brochure</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-center font-wizard text-silver-hp/85 text-base sm:text-lg leading-relaxed">
          Tiers, benefits, audience and reach. Page through the scroll
          below, or take a copy with you.
        </p>

        {/* Primary download CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <RoughButton
            as="a"
            href={BROCHURE_PATH}
            download={BROCHURE_FILENAME}
            color="#D4AF37"
            glow="rgba(212,175,55,0.40)"
            shimmer
            seed={23}
            className="px-10 sm:px-12 py-4 text-[13px] sm:text-[14px] tracking-[0.4em]"
          >
            DOWNLOAD PDF <span aria-hidden="true">↓</span>
          </RoughButton>
          <RoughButton
            as="a"
            href={BROCHURE_PATH}
            target="_blank"
            rel="noopener noreferrer"
            color="#66FCF1"
            fill={false}
            seed={29}
            className="px-8 py-3 text-[12px] tracking-[0.35em]"
          >
            OPEN IN NEW TAB <span aria-hidden="true">↗</span>
          </RoughButton>
        </div>

        {/* Brochure pages — rendered as themed images so the preview blends
            with the rest of the site (no native PDF viewer chrome). Each
            page sits inside its own gold rough-js frame with a small page
            counter underneath. */}
        <div className="mx-auto mt-14 w-full max-w-4xl flex flex-col gap-10">
          {BROCHURE_PAGES.map((page, i) => (
            <figure key={page.src} className="flex flex-col items-center gap-3">
              <RoughFrame
                seed={37 + i * 7}
                stroke="#D4AF37"
                mist={false}
                strokeWidth={1.6}
                roughness={1.6}
                bowing={1.2}
                padding={10}
                className="w-full bg-midnight"
              >
                <img
                  src={page.src}
                  alt={page.alt}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="block w-full h-auto rounded-sm shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
                />
              </RoughFrame>
              <figcaption className="font-display text-[10px] uppercase tracking-[0.5em] text-gold-hp/70">
                Page {i + 1} of {BROCHURE_PAGES.length}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Footer CTAs — the live mailto for direct conversation sits next
            to the disabled "Apply for Sponsor" pill (form lands in a
            follow-up PR). Pair reads as "two paths, one ready, one soon". */}
        <div className="mx-auto mt-12 flex flex-row flex-wrap items-center justify-center gap-4">
          <RoughButton
            as="a"
            href="mailto:support@hexafalls.org?subject=HexaFalls%20Sponsorship%20—%20interested"
            color="#D4AF37"
            glow="rgba(212,175,55,0.40)"
            shimmer
            seed={43}
            className="px-10 sm:px-12 py-4 text-[13px] sm:text-[14px] tracking-[0.35em]"
          >
            TALK TO ORGANIZER <span aria-hidden="true">↗</span>
          </RoughButton>
          <RoughButton
            color="#66FCF1"
            glow="rgba(102,252,241,0.25)"
            shimmer
            disabled
            aria-disabled="true"
            seed={44}
            className="px-9 sm:px-10 py-4 text-[12px] sm:text-[13px] tracking-[0.35em] hp-pulse"
          >
            <span>APPLY FOR SPONSOR</span>
            <span className="text-[9px] tracking-[0.25em] px-2 py-0.5 rounded-full border border-gold-hp/60 bg-gold-hp/10 text-gold-hp hp-glow-gold">
              COMING SOON
            </span>
          </RoughButton>
          <RoughButton
            as="a"
            href="/sponsors"
            color="#C5C6C7"
            fill={false}
            seed={47}
            className="px-7 py-3 text-[11px]"
          >
            ← BACK TO SPONSORS
          </RoughButton>
        </div>
      </section>

      <Footer />
    </main>
  );
}
