"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import Link from "next/link";
import Sparkles from "./Sparkles";
import RoughFrame from "./RoughFrame";
import RoughButton from "./RoughButton";
import RoughDivider from "./RoughDivider";
import RoughStar from "./RoughStar";

// A canvas-based PDF page renderer
function PdfPageRenderer({ url, pageNum, onDocumentLoad }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

  // Observe size of the container div
  useEffect(() => {
    if (!containerRef.current) return;
    let rafId = 0;
    let pending;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      pending = { w: Math.round(r.width), h: Math.round(r.height) };
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        if (pending) setContainerSize(pending);
      });
    });
    ro.observe(containerRef.current);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  // Render PDF page when URL, pageNum, or containerSize changes
  useEffect(() => {
    let active = true;
    if (typeof window === "undefined" || !window.pdfjsLib || !containerSize.w || !containerSize.h) return;

    const render = async () => {
      try {
        setLoading(true);
        const pdf = await window.pdfjsLib.getDocument(url).promise;
        if (!active) return;
        
        if (onDocumentLoad) {
          onDocumentLoad(pdf.numPages);
        }

        const page = await pdf.getPage(pageNum);
        if (!active) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        
        // Get viewport at 1.0 scale to calculate original aspect ratio
        const unscaledViewport = page.getViewport({ scale: 1.0 });
        
        // Scale to fit the container width and height
        const scaleX = (containerSize.w - 16) / unscaledViewport.width; // 16px padding
        const scaleY = (containerSize.h - 16) / unscaledViewport.height;
        const scale = Math.min(scaleX, scaleY);

        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
        if (active) setLoading(false);
      } catch (err) {
        console.error("PDF render failed:", err);
      }
    };

    render();
    return () => { active = false; };
  }, [url, pageNum, containerSize]);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center p-2 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-midnight/30 backdrop-blur-[2px] z-10">
          <svg className="animate-spin h-8 w-8 text-cyan-hp" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      )}
      <canvas ref={canvasRef} className="shadow-2xl border border-silver-hp/10 max-h-full max-w-full rounded bg-white object-contain" />
    </div>
  );
}

// Brochure and doc paths
const BROCHURE_PDF = "/brochures/HexaFalls_2_Brochure.pdf";
const GUIDE_PDF = "/brand/brand.pdf";
const BRAND_ZIP = "/logos/main_logo.png"; // Fallback download target for brand kit

const DOC_PAGES = {
  guide: [
    {
      type: "guide-slide-1",
      title: "HEXAFALLS 2",
      subtitle: "OFFICIAL BRAND GUIDE",
      desc: "The wizarding handbook for builders, sponsors, and scribes.",
      bg: "radial-gradient(circle at center, #1F2833 0%, #0B0C10 100%)",
      borderColor: "#66FCF1",
      textColor: "#66FCF1",
    },
    {
      type: "guide-slide-2",
      title: "THE SPELLWORK",
      subtitle: "Visual Style System",
      desc: "Hand-drawn borders, atmospheric mists, and runic fonts that evoke the wizarding world.",
      bg: "radial-gradient(circle at center, #1F2833 0%, #0B0C10 100%)",
      borderColor: "#D4AF37",
      textColor: "#D4AF37",
    }
  ],
  usd: [
    {
      type: "image",
      src: "/brochures/brochure-page-1.webp",
      alt: "Sponsorship Brochure USD - Page 1",
      badge: "USD SPONSOR DEED · PAGE 1"
    },
    {
      type: "image",
      src: "/brochures/brochure-page-2.webp",
      alt: "Sponsorship Brochure USD - Page 2",
      badge: "USD SPONSOR DEED · PAGE 2"
    }
  ],
  inr: [
    {
      type: "image",
      src: "/brochures/brochure-page-1.webp",
      alt: "Sponsorship Brochure INR - Page 1",
      badge: "INR SPONSOR DEED · PAGE 1"
    },
    {
      type: "image",
      src: "/brochures/brochure-page-2.webp",
      alt: "Sponsorship Brochure INR - Page 2",
      badge: "INR SPONSOR DEED · PAGE 2"
    }
  ]
};

const COLOR_CARDS = [
  { id: "col-1", name: "Midnight Black", hex: "#0A0A0A", bg: "#0A0A0A", text: "#D4AF37", desc: "Midnight Black background with Ancient Gold logo accent." },
  { id: "col-2", name: "Dark Stone", hex: "#1C1C1C", bg: "#1C1C1C", text: "#B0B0B0", desc: "Dark Stone background with Silver Gray logo accent." },
  { id: "col-3", name: "Ancient Gold", hex: "#D4AF37", bg: "#D4AF37", text: "#0A0A0A", desc: "Ancient Gold background with Midnight Black logo accent." },
  { id: "col-4", name: "Metallic Gold", hex: "#C8A75B", bg: "#C8A75B", text: "#0A0A0A", desc: "Metallic Gold background with Midnight Black logo accent." },
  { id: "col-5", name: "Golden Glow", hex: "#E0C36E", bg: "#E0C36E", text: "#0A0A0A", desc: "Golden Glow background with Midnight Black logo accent." },
  { id: "col-6", name: "Bronze", hex: "#8B6B3F", bg: "#8B6B3F", text: "#F3E9D2", desc: "Bronze background with Parchment Cream logo accent." },
  { id: "col-7", name: "Dark Bronze", hex: "#6F5632", bg: "#6F5632", text: "#F3E9D2", desc: "Dark Bronze background with Parchment Cream logo accent." },
  { id: "col-8", name: "Parchment Cream", hex: "#F3E9D2", bg: "#F3E9D2", text: "#6F5632", desc: "Parchment Cream background with Dark Bronze logo accent." },
  { id: "col-9", name: "Old Paper", hex: "#EADFC8", bg: "#EADFC8", text: "#8B6B3F", desc: "Old Paper background with Bronze logo accent." },
  { id: "col-10", name: "Silver Gray", hex: "#B0B0B0", bg: "#B0B0B0", text: "#1C1C1C", desc: "Silver Gray background with Dark Stone logo accent." },
  { id: "col-11", name: "Dark Red", hex: "#430304", bg: "#430304", text: "#d9b994", desc: "Dark Red background with Pastel Grey Orange logo accent." },
  { id: "col-12", name: "Pastel Grey Orange", hex: "#d9b994", bg: "#d9b994", text: "#430304", desc: "Pastel Grey Orange background with Dark Red logo accent." },
];

const LOGO_CARDS = [
  { id: "logo-main", name: "HexaFalls Primary", file: "/logos/main_logo.png", desc: "The primary emblem of the HexaFalls 2 hackathon.", bg: "#1F2833" },
  { id: "logo-gdg", name: "GDG on Campus", file: "/logos/gdg_jisu.png", desc: "GDG on Campus JIS University organizing body logo.", bg: "#0B0C10" },
  { id: "logo-cse", name: "JIS CSE Department", file: "/logos/cse_jisu.png", desc: "JIS University Computer Science & Engineering department logo.", bg: "#0B0C10" },
  { id: "logo-jisu", name: "JIS University", file: "/logos/jisu.png", desc: "Official logo of JIS University, our hackathon host.", bg: "#1F2833" },
];

const TYPO_CARDS = [
  { id: "typo-1", name: "Harry P", type: "Wizard Display", desc: "The iconic display font for wizarding headers and primary titles.", classes: "font-wizard", glyphs: "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z" },
  { id: "typo-2", name: "Belina", type: "Script Callout", desc: "An elegant cursive script for scrolls, annotations, and official signatures.", classes: "font-belina", glyphs: "a b c d e f g h i j k l m n o p q r s t u v w x y z" },
  { id: "typo-3", name: "Crimson Pro", type: "Display Serif", desc: "A robust serif font for section headers and prominent text blocks.", classes: "font-crimson", glyphs: "Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp" },
  { id: "typo-4", name: "Cormorant Garamond", type: "Classic Serif", desc: "An elegant serif for body details, official deeds, and book contents.", classes: "font-cormorant", glyphs: "Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp" },
  { id: "typo-5", name: "Montserrat", type: "Body Sans", desc: "A clean geometric sans-serif for instructions, tags, and small readable copy.", classes: "font-montserrat", glyphs: "Aa Bb Cc Dd Ee Ff Gg 0 1 2 3 4 5 6 7 8 9" },
];

const cardTransitionVariants = {
  hidden: { rotateY: -90, opacity: 0 },
  visible: (i) => ({
    rotateY: 0,
    opacity: 1,
    transition: {
      duration: 0.45,
      delay: i * 0.05,
      ease: [0.25, 1, 0.5, 1], // easeOutQuart
    }
  }),
  exit: (i) => ({
    rotateY: 90,
    opacity: 0,
    transition: {
      duration: 0.35,
      delay: i * 0.03,
      ease: [0.25, 1, 0.5, 1],
    }
  })
};

function tintImage(url, hexColor) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      ctx.globalCompositeOperation = "source-in";
      ctx.fillStyle = hexColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas to blob conversion failed"));
        }
      }, "image/png");
    };
    img.onerror = (err) => {
      reject(err);
    };
    img.src = url;
  });
}


export default function BrandKit() {
  const containerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTab, setActiveTab] = useState("Logos"); // 'Logos' | 'Typography'
  const [copiedText, setCopiedText] = useState(null);
  const [downloadStatus, setDownloadStatus] = useState("idle"); // 'idle' | 'downloading' | 'success' | 'error'
  const [downloadPercent, setDownloadPercent] = useState(0);
  const [pdfJsLoaded, setPdfJsLoaded] = useState(false);
  const [numPages, setNumPages] = useState(2);
  const [jsZipLoaded, setJsZipLoaded] = useState(false);
  const [zipStatus, setZipStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [typoZipStatus, setTypoZipStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.JSZip) {
      setJsZipLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    script.onload = () => {
      setJsZipLoaded(true);
    };
    document.body.appendChild(script);
  }, []);


  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.pdfjsLib) {
      setPdfJsLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
      setPdfJsLoaded(true);
    };
    document.body.appendChild(script);
  }, []);


  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(".red-letter", { opacity: 1, y: 0 });
        return;
      }
      gsap.set(".red-letter", { opacity: 0, y: 20 });
      gsap.to(".red-letter", {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power3.out",
        stagger: { each: 0.035, from: "start" },
        delay: 0.1,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleCopy = (hex, e) => {
    e.stopPropagation(); // Stop flipping card when clicking copy
    navigator.clipboard.writeText(hex);
    setCopiedText(hex);
    setTimeout(() => setCopiedText(null), 1500);
  };

  const handleDownloadDoc = async () => {
    if (downloadStatus === "downloading") return;

    const fileUrl = BROCHURE_PDF;
    const fileName = "hexafalls-brochure.pdf";

    setDownloadStatus("downloading");
    setDownloadPercent(0);

    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Failed to fetch file");

      const contentLength = response.headers.get("content-length");
      const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;

      const reader = response.body.getReader();
      let receivedBytes = 0;
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedBytes += value.length;

        if (totalBytes > 0) {
          const percent = Math.round((receivedBytes / totalBytes) * 100);
          setDownloadPercent(percent);
        } else {
          setDownloadPercent((prev) => Math.min(prev + 10, 95));
        }
      }

      setDownloadPercent(100);
      setDownloadStatus("success");

      const blob = new Blob(chunks, { type: response.headers.get("content-type") || "application/octet-stream" });
      const downloadUrl = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setTimeout(() => {
        setDownloadStatus("idle");
        setDownloadPercent(0);
      }, 2000);
    } catch (err) {
      console.error("Download error:", err);
      setDownloadStatus("error");
      setTimeout(() => {
        setDownloadStatus("idle");
        setDownloadPercent(0);
      }, 2000);
    }
  };

  const handleDownloadAsset = (path, name, e) => {
    if (e) e.stopPropagation(); // Stop flipping card when clicking download
    const link = document.createElement("a");
    link.href = path;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSwatch = async (colorCard, e) => {
    if (e) e.stopPropagation();
    try {
      const blob = await tintImage("/logos/hexa.png", colorCard.text);
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const slugName = colorCard.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      link.download = `hexafalls-logo-${slugName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Swatch download failed:", err);
    }
  };

  const handleDownloadAllLogos = async (e) => {
    if (e) e.stopPropagation();
    if (zipStatus === "loading") return;

    if (!jsZipLoaded || !window.JSZip) {
      if (typeof window !== "undefined" && !window.JSZip) {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
        script.onload = () => {
          setJsZipLoaded(true);
          handleDownloadAllLogos(e);
        };
        script.onerror = () => {
          setZipStatus("error");
          setTimeout(() => setZipStatus("idle"), 2000);
        };
        document.body.appendChild(script);
        setZipStatus("loading");
        return;
      }
    }

    setZipStatus("loading");

    try {
      const zip = new window.JSZip();
      
      const ZIP_LOGOS = [
        { name: "hexa-midnight-black.png", color: "#0A0A0A" },
        { name: "hexa-dark-stone.png", color: "#1C1C1C" },
        { name: "hexa-ancient-gold.png", color: "#D4AF37" },
        { name: "hexa-metallic-gold.png", color: "#C8A75B" },
        { name: "hexa-golden-glow.png", color: "#E0C36E" },
        { name: "hexa-bronze.png", color: "#8B6B3F" },
        { name: "hexa-dark-bronze.png", color: "#6F5632" },
        { name: "hexa-parchment-cream.png", color: "#F3E9D2" },
        { name: "hexa-old-paper.png", color: "#EADFC8" },
        { name: "hexa-silver-gray.png", color: "#B0B0B0" },
        { name: "hexa-dark-red.png", color: "#430304" },
        { name: "hexa-pastel-grey-orange.png", color: "#d9b994" }
      ];

      for (const item of ZIP_LOGOS) {
        const blob = await tintImage("/logos/hexa.png", item.color);
        zip.file(item.name, blob);
      }

      const content = await zip.generateAsync({ type: "blob" });
      const downloadUrl = URL.createObjectURL(content);
      
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "hexafalls-logo-kit.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setZipStatus("success");
      setTimeout(() => setZipStatus("idle"), 2000);
    } catch (err) {
      console.error("Failed to generate zip file:", err);
      setZipStatus("error");
      setTimeout(() => setZipStatus("idle"), 2000);
    }
  };

  const handleDownloadFont = (typoName, e) => {
    if (e) e.stopPropagation();
    const fontUrls = {
      "harry p": "https://raw.githubusercontent.com/Tercioo/Plater-Nameplates/master/fonts/HARRYP__.TTF",
      "belina": "https://raw.githubusercontent.com/google/fonts/main/ofl/greatvibes/GreatVibes-Regular.ttf",
      "crimson pro": "https://raw.githubusercontent.com/google/fonts/main/ofl/crimsonpro/static/CrimsonPro-Regular.ttf",
      "cormorant garamond": "https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/CormorantGaramond-Regular.ttf",
      "montserrat": "https://raw.githubusercontent.com/google/fonts/main/ofl/montserrat/static/Montserrat-Regular.ttf"
    };

    const url = fontUrls[typoName.toLowerCase()];
    if (url) {
      const extension = url.endsWith(".zip") ? "zip" : "ttf";
      const fileName = `${typoName.toLowerCase().replace(/\s+/g, "-")}.${extension}`;
      handleDownloadAsset(url, fileName, e);
    } else {
      handleDownloadAsset("/logos/main_logo.png", `${typoName.toLowerCase().replace(/\s+/g, "-")}.zip`, e);
    }
  };

  const handleDownloadAllTypography = async (e) => {
    if (e) e.stopPropagation();
    if (typoZipStatus === "loading") return;

    if (!jsZipLoaded || !window.JSZip) {
      if (typeof window !== "undefined" && !window.JSZip) {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
        script.onload = () => {
          setJsZipLoaded(true);
          handleDownloadAllTypography(e);
        };
        script.onerror = () => {
          setTypoZipStatus("error");
          setTimeout(() => setTypoZipStatus("idle"), 2000);
        };
        document.body.appendChild(script);
        setTypoZipStatus("loading");
        return;
      }
    }

    setTypoZipStatus("loading");

    try {
      const zip = new window.JSZip();

      const FONTS = [
        { name: "HarryP.ttf", url: "https://raw.githubusercontent.com/Tercioo/Plater-Nameplates/master/fonts/HARRYP__.TTF" },
        { name: "Belina-Regular.ttf", url: "https://raw.githubusercontent.com/google/fonts/main/ofl/greatvibes/GreatVibes-Regular.ttf" },
        { name: "CrimsonPro-Regular.ttf", url: "https://raw.githubusercontent.com/google/fonts/main/ofl/crimsonpro/static/CrimsonPro-Regular.ttf" },
        { name: "CormorantGaramond-Regular.ttf", url: "https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/CormorantGaramond-Regular.ttf" },
        { name: "Montserrat-Regular.ttf", url: "https://raw.githubusercontent.com/google/fonts/main/ofl/montserrat/static/Montserrat-Regular.ttf" }
      ];

      const fetchPromises = FONTS.map(async (font) => {
        try {
          const res = await fetch(font.url);
          if (!res.ok) throw new Error(`Failed to fetch ${font.name}`);
          const blob = await res.blob();
          zip.file(font.name, blob);
        } catch (err) {
          console.error(`Error loading font ${font.name}:`, err);
          zip.file(`${font.name}-failed-to-download.txt`, `Font file could not be fetched from: ${font.url}`);
        }
      });

      await Promise.all(fetchPromises);

      const content = await zip.generateAsync({ type: "blob" });
      const downloadUrl = URL.createObjectURL(content);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "hexafalls-typography.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setTypoZipStatus("success");
      setTimeout(() => setTypoZipStatus("idle"), 2000);
    } catch (err) {
      console.error("Failed to generate typography zip file:", err);
      setTypoZipStatus("error");
      setTimeout(() => setTypoZipStatus("idle"), 2000);
    }
  };

  const splitLetters = (text) => {
    const parts = text.split(/(\s+)/);
    return parts.map((part, wi) => {
      if (/^\s+$/.test(part)) {
        return <span key={`w${wi}`} style={{ whiteSpace: "pre" }}>{part}</span>;
      }
      return (
        <span key={`w${wi}`} className="inline-block" style={{ whiteSpace: "nowrap" }}>
          {[...part].map((ch, ci) => (
            <span key={`${wi}-${ci}`} className="red-letter inline-block">
              {ch}
            </span>
          ))}
        </span>
      );
    });
  };

  const totalPages = numPages;

  return (
    <section ref={containerRef} className="relative isolate overflow-hidden min-h-screen pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <div aria-hidden="true" className="absolute inset-0 -z-30 hp-stars pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 -z-20 hp-scrim pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none">
        <Sparkles count={20} />
      </div>

      <RoughStar size={20} color="#D4AF37" seed={101} className="absolute top-24 left-10 opacity-60 hp-float" style={{ animationDuration: "10s" }} />
      <RoughStar size={24} color="#66FCF1" seed={105} className="absolute top-40 right-12 opacity-50 hp-float" style={{ animationDuration: "12s", animationDelay: "1s" }} />

      <div className="mx-auto w-full max-w-[100rem] flex flex-col gap-16">

      {/* ────────────────── SECTION 1: HEADER & DOC SWITCHER ────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left"
      >
        {/* Left Column: Title */}
        <div className="lg:col-span-6 flex flex-col justify-start">
          <h1 className="font-sans font-black tracking-tight text-white leading-[0.9] text-[9.5vw] sm:text-[7vw] md:text-[5vw] lg:text-[4.5vw] uppercase">
            {splitLetters("The Archive of")}{" "}
            <span className="block text-silver-hp/25">
              {splitLetters("the Order")}
            </span>
          </h1>
        </div>

        {/* Right Column: Description */}
        <div className="lg:col-span-6 flex flex-col gap-6 justify-end h-full pt-2">
          <p className="font-sans text-silver-hp/60 text-sm sm:text-base leading-relaxed max-w-xl">
            Explore the sacred texts of HexaFalls. Gathered in one place for access, this archive makes it simple to view, download, and stay aligned with our vision.
          </p>
        </div>
      </motion.div>

      {/* ────────────────── SECTION 2: DOCUMENT VIEW CAROUSEL ────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="w-full"
      >
        <RoughFrame
          seed={142}
          stroke="#D4AF37"
          strokeWidth={1.5}
          roughness={1.4}
          bowing={1.2}
          padding={8}
          className="bg-midnight"
        >
          <div className="relative w-full flex flex-col h-full">
            {/* Main Visual Carousel Viewport */}
            <div className="relative w-full aspect-[4/3] md:aspect-[16/10] bg-slate-hp/10 rounded-xl overflow-hidden flex items-center justify-center border border-silver-hp/5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`pdf-page-${currentPage}`}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05, y: -10 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex items-center justify-center p-2"
                >
                  {pdfJsLoaded ? (
                    <PdfPageRenderer
                      url={BROCHURE_PDF}
                      pageNum={currentPage + 1}
                      onDocumentLoad={setNumPages}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-midnight/30">
                      <div className="relative flex items-center justify-center">
                        <svg className="animate-spin h-10 w-10 text-gold-hp" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <RoughStar size={16} color="#D4AF37" seed={101} className="absolute opacity-80 animate-pulse" />
                      </div>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-black/75 backdrop-blur border border-silver-hp/20 rounded px-2.5 py-1 text-[9px] font-sans tracking-widest text-silver-hp uppercase">
                    BROCHURE · PAGE {currentPage + 1} OF {numPages}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls below document viewport (Image 2) */}
            <div className="flex items-center justify-between mt-5 px-3 pb-4">
              {/* Left: Black Download Button with animations */}
              <motion.button
                onClick={handleDownloadDoc}
                whileHover={downloadStatus === "downloading" ? {} : { scale: 1.05 }}
                whileTap={downloadStatus === "downloading" ? {} : { scale: 0.95 }}
                disabled={downloadStatus === "downloading"}
                type="button"
                className={`font-sans font-bold text-[11px] uppercase tracking-widest px-6 py-3 rounded-full flex items-center gap-2 border shadow-lg select-none transition ${
                  downloadStatus === "downloading"
                    ? "bg-slate-hp/40 text-cyan-hp border-cyan-hp/50 cursor-not-allowed"
                    : downloadStatus === "success"
                    ? "bg-green-950/80 text-green-400 border-green-500/50 cursor-default"
                    : downloadStatus === "error"
                    ? "bg-red-950/80 text-red-400 border-red-500/50 cursor-default"
                    : "bg-black hover:bg-black/85 text-white border-silver-hp/15 cursor-pointer"
                }`}
              >
                {downloadStatus === "downloading" ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-cyan-hp" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Downloading ({downloadPercent}%)
                  </>
                ) : downloadStatus === "success" ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Success!
                  </>
                ) : downloadStatus === "error" ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    Failed!
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download
                  </>
                )}
              </motion.button>

              {/* Right: Round pagination control arrows */}
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  whileHover={currentPage === 0 ? {} : { scale: 1.08 }}
                  whileTap={currentPage === 0 ? {} : { scale: 0.92 }}
                  type="button"
                  className={`h-10 w-10 rounded-full border flex items-center justify-center transition select-none ${
                    currentPage === 0
                      ? "border-silver-hp/5 text-silver-hp/15 cursor-not-allowed"
                      : "border-silver-hp/20 text-silver-hp/70 hover:border-cyan-hp/70 hover:text-cyan-hp cursor-pointer"
                  }`}
                  aria-label="Previous Page"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                </motion.button>

                <motion.button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage === totalPages - 1}
                  whileHover={currentPage === totalPages - 1 ? {} : { scale: 1.08 }}
                  whileTap={currentPage === totalPages - 1 ? {} : { scale: 0.92 }}
                  type="button"
                  className={`h-10 w-10 rounded-full border flex items-center justify-center transition select-none ${
                    currentPage === totalPages - 1
                      ? "border-silver-hp/5 text-silver-hp/15 cursor-not-allowed"
                      : "border-silver-hp/20 text-silver-hp/70 hover:border-cyan-hp/70 hover:text-cyan-hp cursor-pointer"
                  }`}
                  aria-label="Next Page"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Glowing Progress Bar at the very bottom edge */}
            <div className="absolute bottom-0 left-2 right-2 h-[3px] bg-silver-hp/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${downloadStatus === "downloading" ? downloadPercent : ((currentPage + 1) / totalPages) * 100}%`,
                  backgroundColor: downloadStatus === "downloading" ? "var(--hx-cyan)" : "var(--hx-gold)",
                  boxShadow: downloadStatus === "downloading" 
                    ? "0 0 10px var(--hx-cyan), 0 0 20px var(--hx-cyan)" 
                    : "0 0 10px var(--hx-gold)",
                }}
              />
            </div>
          </div>
        </RoughFrame>
      </motion.div>

      {/* ────────────────── SECTION 3: BRAND ASSETS TITLE ROW ────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left mt-8"
      >
        {/* Left Column: Muted Title */}
        <div className="lg:col-span-6 flex flex-col justify-start">
          <h2 className="font-sans font-black tracking-tight text-white leading-[0.9] text-[8.5vw] sm:text-[6vw] md:text-[4.5vw] lg:text-[4vw] uppercase">
            {splitLetters("Download our")}{" "}
            <span className="block text-silver-hp/25">
              {splitLetters("Brand Assets")}
            </span>
          </h2>
        </div>

        {/* Right Column: Asset Text & Batch Download Buttons */}
        <div className="lg:col-span-6 flex flex-col gap-6 justify-between h-full pt-1">
          <p className="font-sans text-silver-hp/60 text-sm sm:text-base leading-relaxed max-w-xl">
            Access the official visual elements of HexaFalls, including logos & typography.
            Everything you need to create, share, and stay on-brand lives here.
          </p>

          <div className="flex flex-wrap gap-3">
            <motion.button
              onClick={handleDownloadAllLogos}
              whileHover={zipStatus === "loading" ? {} : { scale: 1.04, boxShadow: "0 0 12px rgba(102,252,241,0.25)", borderColor: "var(--hx-cyan)" }}
              whileTap={zipStatus === "loading" ? {} : { scale: 0.96 }}
              disabled={zipStatus === "loading"}
              type="button"
              className={`rounded-full border px-5 py-2.5 font-sans text-[11px] font-bold uppercase tracking-wider transition select-none flex items-center gap-2 ${
                zipStatus === "loading"
                  ? "bg-slate-hp/40 text-cyan-hp border-cyan-hp/50 cursor-not-allowed"
                  : zipStatus === "success"
                  ? "bg-green-950/80 text-green-400 border-green-500/50 cursor-default"
                  : zipStatus === "error"
                  ? "bg-red-950/80 text-red-400 border-red-500/50 cursor-default"
                  : "border-silver-hp/20 text-silver-hp hover:text-cyan-hp hover:border-cyan-hp cursor-pointer"
              }`}
            >
              {zipStatus === "loading" ? (
                <>
                  <svg className="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-cyan-hp" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Packaging ZIP...
                </>
              ) : zipStatus === "success" ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Downloaded!
                </>
              ) : zipStatus === "error" ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Failed!
                </>
              ) : (
                "Download All Logos"
              )}
            </motion.button>
            <motion.button
              onClick={handleDownloadAllTypography}
              whileHover={typoZipStatus === "loading" ? {} : { scale: 1.04, boxShadow: "0 0 12px rgba(102,252,241,0.25)", borderColor: "var(--hx-cyan)" }}
              whileTap={typoZipStatus === "loading" ? {} : { scale: 0.96 }}
              disabled={typoZipStatus === "loading"}
              type="button"
              className={`rounded-full border px-5 py-2.5 font-sans text-[11px] font-bold uppercase tracking-wider transition select-none flex items-center gap-2 ${
                typoZipStatus === "loading"
                  ? "bg-slate-hp/40 text-cyan-hp border-cyan-hp/50 cursor-not-allowed"
                  : typoZipStatus === "success"
                  ? "bg-green-950/80 text-green-400 border-green-500/50 cursor-default"
                  : typoZipStatus === "error"
                  ? "bg-red-950/80 text-red-400 border-red-500/50 cursor-default"
                  : "border-silver-hp/20 text-silver-hp hover:text-cyan-hp hover:border-cyan-hp cursor-pointer"
              }`}
            >
              {typoZipStatus === "loading" ? (
                <>
                  <svg className="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-cyan-hp" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Packaging Fonts...
                </>
              ) : typoZipStatus === "success" ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Downloaded!
                </>
              ) : typoZipStatus === "error" ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Failed!
                </>
              ) : (
                "Download All Typography"
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ────────────────── SECTION 4: TABS & ASSET GRID PANEL ────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-left mt-4 w-full">
        {/* Left Column (Sidebar Tabs Selector) */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="md:col-span-3 flex flex-col items-start gap-2 border-l border-silver-hp/10 pl-4 py-1"
        >
          {[
            { id: "Logos", label: "Logos" },
            { id: "Typography", label: "Typography" }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ x: isActive ? 0 : 4 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className={`w-full text-left font-sans text-sm font-semibold tracking-wider transition select-none cursor-pointer py-2.5 px-4 rounded-full ${
                  isActive
                    ? "bg-black text-white border border-silver-hp/15 shadow"
                    : "text-silver-hp/50 hover:text-silver-hp"
                }`}
              >
                {tab.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Right Column (Asset Cards Grid Grid) */}
        <div className="md:col-span-9 w-full">
          <AnimatePresence mode="wait">
            {activeTab === "Logos" ? (
              <motion.div
                key="colors-grid"
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              >
                {COLOR_CARDS.map((color, index) => (
                  <motion.div
                    key={color.id}
                    custom={index}
                    variants={cardTransitionVariants}
                    className="relative aspect-[4/3] w-full [perspective:1000px] group cursor-pointer"
                  >
                    <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] select-none">
                      {/* CARD FRONT SIDE: Solid Swatch Face with centered hexa.png mask */}
                      <div
                        className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-2xl flex items-center justify-center p-6 shadow-lg border border-white/5"
                        style={{ backgroundColor: color.bg }}
                      >
                        {/* Centered logo mask overlay */}
                        <div 
                          className="w-[80%] h-[45%] transition-all duration-300 group-hover:scale-110" 
                          style={{
                            WebkitMaskImage: "url('/logos/hexa.png')",
                            maskImage: "url('/logos/hexa.png')",
                            WebkitMaskSize: "contain",
                            maskSize: "contain",
                            WebkitMaskRepeat: "no-repeat",
                            maskRepeat: "no-repeat",
                            WebkitMaskPosition: "center",
                            maskPosition: "center",
                            backgroundColor: color.text,
                            opacity: 0.85
                          }}
                        />

                        {/* Round white download button at bottom right */}
                        <motion.button
                          onClick={(e) => handleDownloadSwatch(color, e)}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.85 }}
                          type="button"
                          className="absolute bottom-3.5 right-3.5 h-7 w-7 rounded-full bg-white flex items-center justify-center shadow-md border border-black/5 cursor-pointer z-10"
                          aria-label={`Download ${color.name}`}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="#0B0C10" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        </motion.button>
                      </div>

                      {/* CARD BACK SIDE: Swatch Specifications & Actions */}
                      <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl bg-slate-hp/95 border border-silver-hp/20 p-5 flex flex-col justify-between shadow-2xl backdrop-blur-md">
                        <div className="text-left">
                          <span className="font-display text-[9px] uppercase tracking-widest block text-cyan-hp">
                            Brand Token
                          </span>
                          <h4 className="font-display text-base text-white font-bold tracking-wide mt-1">
                            {color.name}
                          </h4>
                          <p className="font-sans text-xs text-silver-hp/60 mt-2 leading-relaxed">
                            {color.desc}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          {/* Copy HEX Button */}
                          <motion.button
                            onClick={(e) => handleCopy(color.hex, e)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            className="text-[10px] font-sans font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-silver-hp/20 text-silver-hp hover:text-white hover:border-silver-hp/50 transition cursor-pointer"
                          >
                            Copy Hex
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="typography-grid"
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid gap-6 grid-cols-1 sm:grid-cols-3"
              >
                {TYPO_CARDS.map((typo, index) => (
                  <motion.div
                    key={typo.name}
                    custom={index}
                    variants={cardTransitionVariants}
                    className="relative aspect-[4/3] w-full [perspective:1000px] group cursor-pointer"
                  >
                    <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] select-none">
                      {/* CARD FRONT SIDE: Info Panel */}
                      <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-2xl bg-slate-hp/15 border border-silver-hp/10 p-6 flex flex-col justify-between shadow-md">
                        <div className="text-left">
                          <span className="font-display text-[9px] uppercase tracking-[0.3em] text-cyan-hp/70 block mb-2">
                            {typo.type}
                          </span>
                          <h4 className={`text-3xl text-white tracking-wide font-black ${typo.classes}`}>
                            {typo.name}
                          </h4>
                          <p className="font-sans text-xs text-silver-hp/60 mt-3 leading-relaxed">
                            {typo.desc}
                          </p>
                        </div>
                        <span className="font-display text-[9px] text-silver-hp/30 text-left uppercase tracking-widest mt-4 block">
                          Hover to inspect glyphs
                        </span>
                      </div>

                      {/* CARD BACK SIDE: Giant Glyph Preview */}
                      <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl bg-slate-hp/95 border border-silver-hp/20 p-5 flex flex-col justify-between shadow-2xl backdrop-blur-md">
                        <div className="text-left h-full flex flex-col">
                          <span className="font-display text-[9px] uppercase tracking-widest text-cyan-hp">
                            Glyph Specimen
                          </span>
                          <div className="flex-1 flex items-center justify-center py-2 overflow-hidden">
                            <p
                              className={`text-sm text-silver-hp/80 text-center leading-relaxed tracking-wider break-words select-none ${typo.classes}`}
                              style={{ fontSize: typo.name === "Cinzel" ? "0.85rem" : "0.75rem" }}
                            >
                              {typo.glyphs}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-end mt-auto">
                          <motion.button
                            onClick={(e) => handleDownloadFont(typo.name, e)}
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.85 }}
                            type="button"
                            className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-lg border border-black/5 cursor-pointer"
                            aria-label={`Download ${typo.name} Font`}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="#0B0C10" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ────────────────── SECTION 5: FOOTER COPYRIGHT POLICY ────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mt-6"
      >
        <p className="font-sans text-[11px] text-silver-hp/40 tracking-wider">
          Before downloading, please read the{" "}
          <Link href="/coc" className="underline text-silver-hp/60 hover:text-cyan-hp transition">
            copyright policy
          </Link>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex justify-center"
      >
        <RoughButton as={Link} href="/" color="#C5C6C7" fill={false} seed={999} className="px-8 py-3.5 text-[11px]">
          ← BACK TO THE HALL
        </RoughButton>
      </motion.div>

      {/* Floating Magic Toast notifications for Copy Action */}
      <AnimatePresence>
        {copiedText && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 rounded-full border border-gold-hp/40 bg-midnight/90 backdrop-blur-md px-6 py-3 shadow-[0_4px_28px_rgba(0,0,0,0.8)] flex items-center gap-3 font-display text-xs tracking-[0.2em]"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-gold-hp opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-hp" />
            </span>
            <span className="text-silver-hp">Hex color</span>
            <span className="text-gold-hp font-bold font-mono">{copiedText}</span>
            <span className="text-silver-hp">copied!</span>
          </motion.div>
        )}
      </AnimatePresence>

      </div>
    </section>
  );
}
