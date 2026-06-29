import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import BrandKit from "@/components/BrandKit";

export const metadata = {
  title: "Brand Kit · HexaFalls Techfest",
  description:
    "The official HexaFalls 2026 brand kit — visual guidelines, logos, color palette, typography and downloadable banners for press, partners and wizarding creators. Designed and engineered by Ayushman Bhattacharya.",
};

export default function BrandPage() {
  return (
    <main className="flex-1">
      <TopBar />
      <BrandKit />
      <Footer />
    </main>
  );
}
