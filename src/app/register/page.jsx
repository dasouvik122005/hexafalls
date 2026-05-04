import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import ComingSoon from "@/components/ComingSoon";

export const metadata = {
  title: "Registration · HexaFalls Techfest",
  description: "Registration for HexaFalls opens soon.",
};

// Cosmetic Apply-with-Devfolio button. Visual-only for now — wire the official
// SDK + .apply-button div from https://guide.devfolio.co/docs/guide/apply-with-devfolio-integration
// when the listing is ready to receive applications.
const DEVFOLIO_SLUG = "hexafalls2";

export default function RegisterPage() {
  return (
    <main className="flex-1">
      <TopBar />
      <ComingSoon
        eyebrow="Owls await your name"
        title="Open"
        accent="Registration"
        lede="Robes pressed, wands tuned. Registration for the wizarding hackathon will open soon — your seat in the hall is being readied."
        whisper="“The hall remembers every wand that was raised within it.”"
      />

      {/* Devfolio CTA — sits between the page section and the footer. */}
      <div className="-mt-8 mb-24 flex flex-col items-center gap-3 px-6">
        <span className="font-display text-[10px] uppercase tracking-[0.4em] text-silver-hp/55">
          or
        </span>
        <a
          href={`https://${DEVFOLIO_SLUG}.devfolio.co/`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Apply with Devfolio"
          className="group relative inline-flex h-11 items-center gap-3 rounded-md bg-[#2F8DEC] px-5 font-medium tracking-wide text-white transition hover:bg-[#1f7ddc] hover:shadow-[0_0_28px_rgba(47,141,236,0.45)]"
          style={{ minWidth: 312 }}
        >
          <span
            aria-hidden="true"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-white"
          >
            {/* Devfolio "A" mark approximation — swap for official asset later */}
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#2F8DEC" aria-hidden="true">
              <path d="M12 3 3.5 21h3.4l1.7-3.6h6.8L17.1 21h3.4L12 3Zm-2 11 2-4.4 2 4.4h-4Z" />
            </svg>
          </span>
          <span className="text-[14px]">Apply with Devfolio</span>
          <span className="text-white/80 transition group-hover:translate-x-0.5">↗</span>
        </a>
      </div>

      <Footer />
    </main>
  );
}
