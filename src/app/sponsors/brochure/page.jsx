import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RoughFrame from "@/components/RoughFrame";
import RoughDivider from "@/components/RoughDivider";
import RoughButton from "@/components/RoughButton";
import Sparkles from "@/components/Sparkles";
import HeroVideoBg from "@/components/HeroVideoBg";

// Drop your brochure PDF at this path under /public to make it live.
const BROCHURE_PATH = "/brochures/hexafalls-sponsorship.pdf";
const BROCHURE_FILENAME = "hexafalls-sponsorship.pdf";
// The brochure's marquee content (tiers, benefits) starts on page 9, so the
// in-browser preview jumps there by default. Download / open-in-new-tab
// still go to the full document.
const BROCHURE_PREVIEW_PAGE = 9;

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
          Tiers, benefits, audience and reach. The preview opens at the
          tier breakdown (page {BROCHURE_PREVIEW_PAGE}); flip back from there
          for the lore, or grab the full scroll below.
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

        {/* PDF viewer — framed by a sketched gold border. The browser's
            built-in PDF viewer handles the rendering inside the iframe. */}
        <div className="mx-auto mt-14 w-full max-w-5xl">
          <RoughFrame
            seed={37}
            stroke="#D4AF37"
            mist={false}
            strokeWidth={1.6}
            roughness={1.6}
            bowing={1.2}
            padding={10}
            className="w-full bg-midnight"
          >
            {/* aspect-[3/4] matches a standard portrait PDF; on wide
                desktops the frame still bounds the height nicely. */}
            <object
              data={`${BROCHURE_PATH}#page=${BROCHURE_PREVIEW_PAGE}&view=FitH`}
              type="application/pdf"
              className="block w-full aspect-3/4 sm:aspect-[1/1.2] bg-midnight rounded-sm"
              aria-label="HexaFalls sponsorship brochure"
            >
              {/* Fallback for browsers without PDF rendering, or before the
                  PDF asset is uploaded. */}
              <div className="flex flex-col items-center justify-center gap-4 p-10 text-center min-h-[60vh]">
                <p className="font-wizard text-silver-hp/80 text-base sm:text-lg max-w-md">
                  Your browser can&apos;t render the scroll inline.
                </p>
                <p className="font-wizard italic text-silver-hp/55 text-sm">
                  Download or open it in a new tab using the buttons above.
                </p>
              </div>
            </object>
          </RoughFrame>
        </div>

        {/* Footer CTAs */}
        <div className="mx-auto mt-12 flex flex-row flex-wrap items-center justify-center gap-4">
          <RoughButton
            as="a"
            href="mailto:support@hexafalls.org?subject=HexaFalls%20Sponsorship%20—%20interested"
            color="#D4AF37"
            glow="rgba(212,175,55,0.30)"
            shimmer
            seed={43}
            className="px-10 sm:px-12 py-4 text-[13px] sm:text-[14px] tracking-[0.35em]"
          >
            BECOME A SPONSOR <span aria-hidden="true">↗</span>
          </RoughButton>
          <RoughButton
            as={Link}
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
