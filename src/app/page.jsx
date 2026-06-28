import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import SneakPeek from "@/components/SneakPeek";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex-1">
      <TopBar />
      {/* Hero already includes the "Call for…" scrolls + the location map. */}
      <Hero />
      <Footer />
    </main>
  );
}
