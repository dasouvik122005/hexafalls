// Hexafalls — Harry Potter themed palette.
// Base 4 colors are the brand. Everything else is a "nearby" tint we can dial
// in/out per section without breaking the brand. Edit freely.

export const theme = {
  // ---- BASE (the four brand colors) ----
  base: {
    midnight:  "#0B0C10", // deepest bg — sky / void
    slate:     "#1F2833", // surface — parchment-shadow / panel
    cyan:      "#66FCF1", // primary accent — spell glow
    silver:    "#C5C6C7", // text / runes
  },

  // ---- NEARBY tints (variants we can swap on the go) ----
  midnight: {
    50:  "#1A1C24",
    100: "#13151B",
    DEFAULT: "#0B0C10",
    deep:    "#06070A",
  },
  slate: {
    50:  "#2A3441",
    100: "#242C38",
    DEFAULT: "#1F2833",
    deep:    "#161C25",
  },
  cyan: {
    50:  "#A8FDF7",
    100: "#85FCF4",
    DEFAULT: "#66FCF1",
    600: "#45C5BC",
    700: "#2E8E87",
    glow:    "#66FCF1",
  },
  silver: {
    50:  "#EAEAEB",
    100: "#D9DADB",
    DEFAULT: "#C5C6C7",
    600: "#9A9B9C",
    700: "#6E6F70",
  },

  // ---- HARRY POTTER house accents (use sparingly) ----
  // not in the base 4, but useful for posters / hover states / mascot lines
  hogwarts: {
    gold:     "#D4AF37", // gryffindor / golden snitch
    crimson:  "#7F0909", // gryffindor crimson
    emerald:  "#1A472A", // slytherin
    silverHouse: "#AAAAAA", // slytherin trim
    sapphire: "#0E1A40", // ravenclaw
    bronze:   "#946B2D", // ravenclaw
    saffron:  "#ECB939", // hufflepuff
    earth:    "#372E29", // hufflepuff
  },

  // ---- semantic shorthand used in components ----
  bg:        "#0B0C10",
  surface:   "#1F2833",
  primary:   "#66FCF1",
  text:      "#C5C6C7",
  muted:     "#9A9B9C",

  // ---- effects ----
  glow: {
    cyanSoft:   "0 0 24px rgba(102, 252, 241, 0.35)",
    cyanStrong: "0 0 48px rgba(102, 252, 241, 0.65)",
    goldSoft:   "0 0 24px rgba(212, 175, 55, 0.35)",
  },

  // ---- font tokens (consumed by next/font in layout.js) ----
  fonts: {
    display: "var(--font-display)",   // Cinzel — Harry Potter-ish caps
    wizard:  "var(--font-wizard)",    // MedievalSharp — runic body accent
    body:    "var(--font-body)",      // Inter — readable copy
  },
};

export default theme;
