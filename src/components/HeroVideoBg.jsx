// Cinematic background video, shared across routes.
// - Cloudinary transforms f_auto,q_auto,vc_auto,w_1920 — adaptive codec +
//   perceptual quality + width cap. Same URL on every page so the browser
//   caches the asset on first visit.
// - poster JPG renders at first paint while the mp4 streams in.
// - preload="metadata" keeps the video off the critical render path.
// - aria-hidden + tabIndex=-1: pure decoration.
// - The dark vignette/gradient layers darken the footage so foreground
//   chrome (titles, cards) stays legible. Keep these in CSS so the video
//   element itself stays small in the DOM.
export default function HeroVideoBg() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-40 overflow-hidden pointer-events-none"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="https://res.cloudinary.com/dxkje9whm/video/upload/so_0,f_jpg,q_auto,w_1920/v1779009744/hexa2_hero_background_demo_1-B9c3V5LY3VUM4T_seg1_7c8c3f56-265e-4786-ab86-51d5784526bf_lnbo8r.jpg"
        tabIndex={-1}
        disablePictureInPicture
        disableRemotePlayback
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source
          src="https://res.cloudinary.com/dxkje9whm/video/upload/f_auto,q_auto,vc_auto,w_1920/v1779009744/hexa2_hero_background_demo_1-B9c3V5LY3VUM4T_seg1_7c8c3f56-265e-4786-ab86-51d5784526bf_lnbo8r.mp4"
        />
      </video>
      {/* Solid dim for contrast — keeps text legible over bright frames. */}
      <div className="absolute inset-0 bg-[#02050d]/72" />
      {/* Edge vignette — pulls focus to the centre. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 85% at 50% 45%, transparent 30%, rgba(2,5,12,0.92) 100%)",
        }}
      />
      {/* Bottom fade so the video doesn't collide with the footer/scrim. */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48"
        style={{
          background:
            "linear-gradient(to top, rgba(2,5,12,0.85) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
