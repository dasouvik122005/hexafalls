"use client";

import { useEffect } from "react";

// Strict Devfolio integration — see https://guide.devfolio.co/docs/guide/apply-with-devfolio-integration
// The button only renders once the hackathon is verified on Devfolio.
export default function DevfolioApply({
  slug = "hexafalls2",
  theme = "light", // "light" | "dark" | "dark-inverted"
  width = 312,
  height = 44,
  className = "",
}) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://apply.devfolio.co/v2/sdk.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className={`apply-button ${className}`}
      data-hackathon-slug={slug}
      data-button-theme={theme}
      style={{ height: `${height}px`, width: `${width}px` }}
    />
  );
}
