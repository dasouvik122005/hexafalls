import { Cinzel, MedievalSharp, Inter } from "next/font/google";
import "./globals.css";

const display = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

const wizard = MedievalSharp({
  variable: "--font-wizard",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Hexafalls — A Wizarding Hackathon",
  description:
    "Hexafalls techfest, summoned at the edge of the magical and the mundane. Pack your wand, sharpen your code.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${wizard.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-midnight text-silver-hp">
        {children}
      </body>
    </html>
  );
}
