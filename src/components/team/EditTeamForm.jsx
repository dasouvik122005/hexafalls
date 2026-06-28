"use client";

// Leader-only edit form for a squad's display fields (name / tagline /
// description). PATCHes /api/team/[id]; the endpoint re-verifies leadership and
// editable status server-side. Inputs are pre-filled with the current values
// (also used as placeholders) and length-capped to match the create form.

import { useState } from "react";
import { useRouter } from "next/navigation";
import RoughButton from "@/components/RoughButton";

const ERRORS = {
  forbidden: "Only the squad leader can edit this team.",
  not_found: "That squad no longer exists.",
  squad_locked: "This team is locked and can no longer be edited.",
  invalid_name: "Team name must be 2–48 characters.",
  invalid_tagline: "Tagline is too long (max 120 characters).",
  invalid_description: "Description is too long (max 800 characters).",
  nothing_to_update: "Nothing changed.",
  unauthorized: "Sign in to continue.",
  db_failure: "Something went wrong. Try again.",
};

export default function EditTeamForm({ squadId, name, tagline, description }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: name ?? "",
    tagline: tagline ?? "",
    description: description ?? "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  function set(key) {
    return (e) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setSaved(false);
    };
  }

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch(`/api/team/${squadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          tagline: form.tagline,
          description: form.description,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(ERRORS[body.error] || body.error || `HTTP ${res.status}`);
        return;
      }
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const fieldCls =
    "w-full rounded-sm border border-cyan-hp/40 bg-midnight/60 px-4 py-3 text-base text-silver-hp focus:border-cyan-hp focus:outline-none focus:ring-2 focus:ring-cyan-hp/40";

  return (
    <section className="rounded-sm border border-cyan-hp/15 bg-slate-hp/30 p-5 sm:p-6">
      <h2 className="mb-5 font-display tracking-[0.3em] uppercase text-sm text-gold-hp">
        Edit team
      </h2>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[10px] uppercase tracking-[0.4em] text-cyan-hp/80">
            Team name
          </span>
          <input
            type="text"
            required
            value={form.name}
            onChange={set("name")}
            placeholder="e.g. The Spell-Slingers"
            minLength={2}
            maxLength={48}
            className={fieldCls}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[10px] uppercase tracking-[0.4em] text-cyan-hp/80">
            Tagline
          </span>
          <input
            type="text"
            value={form.tagline}
            onChange={set("tagline")}
            placeholder="What is your squad about in 8 words"
            maxLength={120}
            className={fieldCls}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[10px] uppercase tracking-[0.4em] text-cyan-hp/80">
            Description
          </span>
          <textarea
            value={form.description}
            onChange={set("description")}
            rows={4}
            placeholder="What do you want to build? Skills, vibe, anything that helps a teammate decide."
            maxLength={800}
            className={`${fieldCls} resize-y`}
          />
        </label>

        {error && (
          <p className="font-wizard italic text-red-300 text-sm">{error}</p>
        )}
        {saved && !error && (
          <p className="font-wizard italic text-emerald-300/85 text-sm">
            Saved.
          </p>
        )}

        <RoughButton
          type="submit"
          disabled={busy}
          aria-disabled={busy}
          color="#66FCF1"
          fill={false}
          seed={31}
          className="self-start px-9 py-3 text-[11px] tracking-[0.35em]"
        >
          {busy ? "SAVING…" : "SAVE CHANGES"}
        </RoughButton>
      </form>
    </section>
  );
}
