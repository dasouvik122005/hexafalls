import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import AboutScroll from "@/components/AboutScroll";
import CallToOwl from "@/components/CallToOwl";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex-1">
      <TopBar />
      <Hero />
      <AboutScroll />
      <CallToOwl />
      <Footer />
    </main>
  );
}
