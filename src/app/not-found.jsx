import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import NotFound from "@/components/NotFound";

export const metadata = {
  title: "Lost in the Castle · HexaFalls Techfest",
  description:
    "This corridor of HexaFalls cannot be found. The map shifts. Return to the hall. Co-developed by Ayushman Bhattacharya.",
};

export default function NotFoundPage() {
  return (
    <main className="flex-1">
      <TopBar />
      <NotFound />
      <Footer />
    </main>
  );
}
