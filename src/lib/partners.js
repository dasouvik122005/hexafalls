// Partner / community logos shown in the sepia marquee under the Hero's
// "Register Now" CTA. Drop the image files into `public/partners/` and add an
// entry here. Order is preserved; the marquee loops seamlessly regardless of
// count. Wide wordmark or square logos both work — they're height-normalised.
//
//   { src: "/partners/<file>.png", alt: "Partner name" }
//
// Add `invert: true` for a pure dark/monochrome logo so it shows light on the
// dark pad. Leave the list empty and the marquee renders nothing.
export const PARTNERS = [
  { src: "/partners/owasp.png", alt: "OWASP", invert: false, scale: 1.3 },
  { src: "/partners/miro.png", alt: "Miro" },
  { src: "/partners/elixpo.jpeg", alt: "Elixpo" },
  { src: "/partners/jis_university.png", alt: "JISU" },
  { src: "/partners/devfolio.png", alt: "devfolio" }
];

export default PARTNERS;
