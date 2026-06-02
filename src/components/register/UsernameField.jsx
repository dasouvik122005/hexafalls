"use client";

// Tiny reusable input + validation hint for choosing a username on first
// registration. Same regex on the server (USERNAME_RE).

export default function UsernameField({ value, onChange, required = true }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-display text-[10px] uppercase tracking-[0.4em] text-cyan-hp/80">
        Your handle
      </span>
      <input
        type="text"
        required={required}
        autoComplete="username"
        spellCheck={false}
        inputMode="text"
        value={value}
        onChange={(e) => onChange(e.target.value.toLowerCase())}
        placeholder="e.g. swift-falcon"
        pattern="^[a-z][a-z0-9_\-]{2,23}$"
        title="3–24 chars, lowercase letter first, then letters / digits / _ / -"
        className="w-full rounded-sm border border-cyan-hp/40 bg-midnight/60 px-4 py-3 font-mono text-base text-silver-hp focus:border-cyan-hp focus:outline-none focus:ring-2 focus:ring-cyan-hp/40"
      />
      <span className="font-wizard italic text-silver-hp/55 text-xs">
        3–24 chars · lowercase first · letters, digits, _ , -
      </span>
    </label>
  );
}
