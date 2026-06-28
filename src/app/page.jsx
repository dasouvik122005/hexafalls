import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import CallScrolls from "@/components/CallScrolls";
import LocationMap from "@/components/LocationMap";
import SneakPeek from "@/components/SneakPeek";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex-1">
      <TopBar />
      <Hero />
      <CallScrolls />
      <section className="relative isolate overflow-hidden px-6 py-16 sm:py-20">
        <div aria-hidden="true" className="absolute inset-0 -z-10 hp-scrim pointer-events-none opacity-60" />
        <div className="mx-auto max-w-5xl">
          <LocationMap />
        </div>
      </section>
      <SneakPeek />
      <Footer />
    </main>
  );
}
