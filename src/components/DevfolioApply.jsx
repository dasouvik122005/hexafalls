// Strict Devfolio integration — see https://guide.devfolio.co/docs/guide/apply-with-devfolio-integration
// The SDK script is loaded once site-wide from the root layout (so the tag
// is in the SSR HTML and Devfolio's verifier finds it). This component only
// renders the placeholder div the SDK looks for and populates.
export default function DevfolioApply({
  slug = "hexafalls2",
  theme = "light", // "light" | "dark" | "dark-inverted"
  width = 312,
  height = 44,
  className = "",
}) {
  return (
    <div
      className={`apply-button ${className}`}
      data-hackathon-slug={slug}
      data-button-theme={theme}
      style={{ height: `${height}px`, width: `${width}px` }}
    />
  );
}
