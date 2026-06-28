// Shown on register/join entry points when the signed-in user isn't verified
// yet. Verification is no longer a separate "join the chapter" checkbox — it
// happens by completing the profile (which includes the GDG · JIS University
// community email). So we just point the user to their profile settings.

import RoughButton from "@/components/RoughButton";

const GDG_LINK =
  "https://gdg.community.dev/gdg-on-campus-jis-university-kolkata-india/";

export default function ProfileGate({ elixpoId }) {
  return (
    <div className="mx-auto w-full max-w-xl rounded-sm border border-gold-hp/30 bg-slate-hp/30 p-6 flex flex-col gap-4 text-center">
      <h2 className="font-display tracking-[0.3em] uppercase text-sm text-gold-hp">
        Complete your profile first
      </h2>
      <p className="font-wizard text-silver-hp/85 text-base leading-relaxed">
        To sign on for HexaFalls we need your full details and the email tied to
        your <span className="text-silver-hp">GDG on Campus · JIS University</span>{" "}
        membership. Fill them in once and you&apos;re verified for every event.
      </p>
      <p className="font-wizard text-silver-hp/65 text-sm">
        Not part of the chapter yet?{" "}
        <a
          href={GDG_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold-hp underline underline-offset-4 hover:text-gold-hp/80"
        >
          Join it here ↗
        </a>
      </p>
      <div className="flex justify-center">
        <RoughButton
          as="link"
          href={elixpoId ? `/u/${elixpoId}/settings` : "/"}
          color="#66FCF1"
          glow="rgba(102,252,241,0.30)"
          shimmer
          seed={29}
          className="px-9 py-3.5 leading-none text-[12px] sm:text-[13px] tracking-[0.35em]"
        >
          COMPLETE PROFILE ↗
        </RoughButton>
      </div>
    </div>
  );
}
