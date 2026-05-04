"use client";

import { useEffect } from "react";

/**
 * Official "Apply with Devfolio" integration. The SDK script renders into the
 * `.apply-button` div based on the `data-hackathon-slug` and theme attributes.
 *
 *   <DevfolioApply slug="hexafalls2" theme="dark" />
 *
 * Note from Devfolio's docs: the button is only rendered after the hackathon
 * is *verified* on Devfolio. Until then this slot is intentionally empty —
 * keeping the SDK loaded so the button appears as soon as the listing flips
 * verified, without a code change on our side.
 */
export default function DevfolioApply({
  slug = "hexafalls2",
  theme = "dark",
  width = 312,
  height = 44,
  className = "",
}) {
  useEffect(() => {
    // Idempotent script load — multiple <DevfolioApply /> instances on the
    // same page should NOT inject the SDK multiple times.
    const SDK = "https://apply.devfolio.co/v2/sdk.js";
    if (document.querySelector(`script[src="${SDK}"]`)) return;
    const script = document.createElement("script");
    script.src   = SDK;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    // Don't remove the script on unmount — the SDK is responsible for any
    // other Devfolio buttons that might mount later in the same session.
  }, []);

  return (
    <div
      className={`apply-button ${className}`}
      data-hackathon-slug={slug}
      data-button-theme={theme}
      style={{ height, width }}
    />
  );
}
