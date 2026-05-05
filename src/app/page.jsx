import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import LandingSponsors from "@/components/LandingSponsors";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex-1">
      <TopBar />
      <Hero />
      {/* Temporary on-landing sponsor strip while Devfolio runs verification.
          Move/remove once their scanner clears `hexafalls2`. */}
      <LandingSponsors />
      <Footer />
    </main>
  );
}
