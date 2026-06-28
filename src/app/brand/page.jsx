import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import BrandKit from "@/components/BrandKit";

export const metadata = {
  title: "Brand Kit · HexaFalls Techfest",
  description:
    "HexaFalls visual guidelines, brand asset kit, colors, typography, logos and banners for wizarding creators. Co-developed by Ayushman Bhattacharya.",
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
