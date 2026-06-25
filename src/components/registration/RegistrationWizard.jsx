"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import RoughFrame from "../RoughFrame";
import RoughButton from "../RoughButton";
import RoughDivider from "../RoughDivider";
import { lookupHexaId } from "@/lib/registrationTracks";

/**
 * Generic multi-step registration wizard. Drives all four track forms via
 * the config in `src/lib/registrationTracks.js`. Solo tracks render 3 steps
 * (Profile → Skills → Confirm); team/squad tracks render 4 (Identity → Members
 * → Skills/Members-Extra → Confirm). Gaming has no skills step so it falls
 * back to 3 steps with member fields in step 2.
 */
export default function RegistrationWizard({ track }) {
  // ── derive the step list from the track config ──
  const steps = useMemo(() => {
    const out = [{
      id: "identity",
      label: track.kind === "solo" ? "Profile" : "Identity",
    }];
    if (track.kind !== "solo") {
      out.push({ id: "members", label: track.teamLabel || "Members" });
    }
    if (track.chips) {
      out.push({ id: "skills", label: "Skills" });
    }
    out.push({ id: "confirm", label: "Confirm" });
    return out;
  }, [track]);

  const [stepIdx, setStepIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [tcAccepted, setTcAccepted] = useState(false);

  // form state. flat object — each step writes into specific keys.
  const [form, setForm] = useState({
    hexaId: "",
    fullName: "",
    email: "",
    university: "",
    referral: "",
    github: "",
    linkedin: "",
    tshirt: "",
    food: "",
    experience: "",
    teamName: "",
    teamSize: "",
    members: [],          // populated when teamSize changes
    chips: new Set(),
  });

  // patch helper so children can update without reseting other fields
  const patch = (partial) => setForm((f) => ({ ...f, ...partial }));

  // ── Caster (solo) HexaID lookup ──
  const [casterStatus, setCasterStatus] = useState(null);
  useEffect(() => {
    if (track.kind !== "solo") return;
    if (!form.hexaId) return;
    const t = setTimeout(() => {
      const found = lookupHexaId(form.hexaId);
      if (found) {
        patch({ fullName: found.name, email: found.email });
        setCasterStatus({ kind: "ok",   msg: "Caster identified — name sealed by the registry" });
      } else {
        setCasterStatus({ kind: "miss", msg: "HexaID not found — enter details manually" });
      }
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.hexaId]);

  // step navigation
  const goTo = (i) => { if (i >= 0 && i < steps.length) setStepIdx(i); };
  const next = () => goTo(stepIdx + 1);
  const back = () => goTo(stepIdx - 1);

  const submit = () => {
    if (!tcAccepted) {
      alert("You must accept the Terms & Conditions to proceed.");
      return;
    }
    // shape data for backend handoff (currently console.log; wire to API later)
    const payload = {
      track: track.slug,
      ...form,
      chips: Array.from(form.chips),
    };
    console.log("HexaFalls registration:", payload);
    setSubmitted(true);
  };

  const stepId = steps[stepIdx].id;

  return (
    <RoughFrame
      seed={73}
      stroke={track.color}
      mistColor={track.color}
      strokeWidth={1.5}
      roughness={1.5}
      bowing={1.2}
      padding={28}
      className="w-full bg-slate-hp/40 backdrop-blur-sm"
      inner="flex flex-col gap-8"
    >
      <Stepper steps={steps} current={stepIdx} onJump={goTo} color={track.color} />

      {/* the panels */}
      <div className="min-h-80">
        {stepId === "identity" && (
          <IdentityStep track={track} form={form} patch={patch} casterStatus={casterStatus} />
        )}
        {stepId === "members" && (
          <MembersStep track={track} form={form} patch={patch} />
        )}
        {stepId === "skills" && (
          <SkillsStep track={track} form={form} patch={patch} />
        )}
        {stepId === "confirm" && (
          <ConfirmStep
            track={track}
            form={form}
            tcAccepted={tcAccepted}
            setTcAccepted={setTcAccepted}
            submitted={submitted}
          />
        )}
      </div>

      {/* nav */}
      <div className="flex flex-row flex-wrap items-center justify-between gap-4">
        {stepIdx > 0 ? (
          <RoughButton
            color="#C5C6C7"
            fill={false}
            seed={81}
            className="px-6 py-2.5 text-[11px]"
            onClick={back}
            disabled={submitted}
          >
            ← BACK
          </RoughButton>
        ) : <span />}

        {stepId !== "confirm" ? (
          <RoughButton
            color={track.color}
            glow={track.glow}
            seed={89}
            className="px-7 py-3 text-[12px]"
            onClick={next}
          >
            CONTINUE <span>→</span>
          </RoughButton>
        ) : (
          <RoughButton
            color={track.color}
            glow={track.glow}
            shimmer
            seed={97}
            className="px-7 py-3 text-[12px]"
            onClick={submit}
            disabled={submitted}
          >
            {submitted
              ? <>SCROLL SEALED · OWLS DISPATCHED</>
              : <>{track.submitLabel || "SUBMIT"} <span>↗</span></>}
          </RoughButton>
        )}
      </div>
    </RoughFrame>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* Stepper                                                                  */
/* ──────────────────────────────────────────────────────────────────────── */

function Stepper({ steps, current, onJump, color }) {
  const total = steps.length;
  return (
    <div className="relative w-full">
      {/* track */}
      <div className="absolute left-6 right-6 top-5 h-px bg-silver-hp/15" />
      <div
        className="absolute left-6 top-5 h-px transition-all duration-500"
        style={{
          width: `calc((100% - 3rem) * ${current / Math.max(1, total - 1)})`,
          background: `linear-gradient(90deg, ${color}, ${color}aa)`,
          boxShadow: `0 0 12px ${color}66`,
        }}
      />
      <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${total}, 1fr)` }}>
        {steps.map((s, i) => {
          const active = i === current;
          const done = i < current;
          const reachable = i <= current;
          return (
            <li key={s.id} className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => reachable && onJump(i)}
                disabled={!reachable}
                aria-current={active ? "step" : undefined}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 font-display text-[11px] transition"
                style={{
                  borderColor: reachable ? color : "rgba(197,198,199,0.25)",
                  color:        reachable ? color : "rgba(197,198,199,0.5)",
                  backgroundColor: done ? `${color}22` : "transparent",
                  boxShadow:    active ? `0 0 18px ${color}66` : "none",
                  cursor:       reachable ? "pointer" : "not-allowed",
                }}
              >
                {done ? "✓" : i + 1}
              </button>
              <span
                className="font-display text-[9px] uppercase tracking-[0.25em]"
                style={{ color: reachable ? color : "rgba(197,198,199,0.45)" }}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* Identity step  (solo: caster + profile · team: profile + team covenant) */
/* ──────────────────────────────────────────────────────────────────────── */

function IdentityStep({ track, form, patch, casterStatus }) {
  const isSolo = track.kind === "solo";
  return (
    <div className="flex flex-col gap-6">
      <SectionLabel color={track.color}>Caster Identity</SectionLabel>

      {isSolo && (
        <div
          className="rounded-md border p-4"
          style={{ borderColor: `${track.color}40`, backgroundColor: `${track.color}0d` }}
        >
          <div className="font-display text-[10px] uppercase tracking-[0.3em] mb-2" style={{ color: track.color }}>
            HexaID Lookup
          </div>
          <Field
            label="Your HexaID"
            value={form.hexaId}
            onChange={(v) => {
              patch({ hexaId: v });
              if (!v) {
                setCasterStatus(null);
              } else {
                setCasterStatus({ kind: "loading" });
              }
            }}
            placeholder="e.g. HXF-001"
            color={track.color}
            uppercase
          />
          {casterStatus && (
            <div
              className="mt-2 font-wizard text-xs"
              style={{
                color:
                  casterStatus.kind === "ok"      ? "#22C55E" :
                  casterStatus.kind === "miss"    ? "#D4AF37" :
                  "rgba(197,198,199,0.7)",
              }}
            >
              {casterStatus.kind === "loading" ? "Consulting the registry…" : casterStatus.msg}
            </div>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full Name" value={form.fullName} onChange={(v) => patch({ fullName: v })}
               placeholder="Your full name" color={track.color} required />
        <Field label="Email" type="email" value={form.email} onChange={(v) => patch({ email: v })}
               placeholder="your@email.com" color={track.color} required />
        <Field label="University / College" value={form.university} onChange={(v) => patch({ university: v })}
               placeholder="Name of your institution" color={track.color} required />
        <Field label="Referral Code (optional)" value={form.referral} onChange={(v) => patch({ referral: v })}
               placeholder="e.g. REF-WIZARD-42" color={track.color} />
        <Field label="GitHub" type="url" value={form.github} onChange={(v) => patch({ github: v })}
               placeholder="https://github.com/username" color={track.color} />
        <Field label="LinkedIn" type="url" value={form.linkedin} onChange={(v) => patch({ linkedin: v })}
               placeholder="https://linkedin.com/in/username" color={track.color} />
        <SelectField label="T-Shirt Size" value={form.tshirt} onChange={(v) => patch({ tshirt: v })}
                     color={track.color} required
                     options={["S", "M", "L", "XL", "XXL"].map((s) => ({ value: s, label: s }))} />
        <RadioField label="Food Preference" name="food" value={form.food} onChange={(v) => patch({ food: v })}
                    color={track.color}
                    options={[{ value: "Veg", label: "Veg" }, { value: "Non-Veg", label: "Non-Veg" }]} />
      </div>

      {!isSolo && (
        <>
          <SectionLabel color={track.color}>Team Covenant</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={`${track.teamLabel || "Team"} Name`} value={form.teamName}
                   onChange={(v) => patch({ teamName: v })} placeholder="Name your fellowship"
                   color={track.color} required />
            <SelectField
              label={`${track.teamLabel || "Team"} Size`}
              value={form.teamSize}
              onChange={(v) => {
                const n = Number(v) || 0;
                const baseFields = { hexaId: "", fullName: "", email: "" };
                const extra = (track.perMemberFields || []).reduce(
                  (acc, f) => ({ ...acc, [f.name]: "" }), {}
                );
                const nextMembers = Array.from({ length: n }, (_, i) =>
                  form.members[i] || { ...baseFields, ...extra }
                );
                patch({ teamSize: v, members: nextMembers });
              }}
              color={track.color}
              required
              options={(track.teamSizes || [2, 3, 4]).map((s) =>
                typeof s === "number" ? { value: s, label: `${s} Members` } : s
              )}
            />
          </div>
        </>
      )}

      <RadioField
        label={track.askExperience.label}
        name="experience"
        value={form.experience}
        onChange={(v) => patch({ experience: v })}
        color={track.color}
        options={[
          { value: "yes", label: track.askExperience.yes },
          { value: "no",  label: track.askExperience.no  },
        ]}
      />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* Members step                                                              */
/* ──────────────────────────────────────────────────────────────────────── */

function MembersStep({ track, form, patch }) {
  if (!form.members.length) {
    return (
      <div className="flex flex-col gap-3">
        <SectionLabel color={track.color}>{track.teamLabel || "Members"}</SectionLabel>
        <p className="font-wizard text-silver-hp/70 text-sm">
          Pick a {(track.teamLabel || "team").toLowerCase()} size on the previous step
          to add fellow casters.
        </p>
      </div>
    );
  }

  const updateMember = (i, partial) => {
    const next = form.members.map((m, j) => (j === i ? { ...m, ...partial } : m));
    patch({ members: next });
  };

  const lookup = (i, hexaId) => {
    const upper = String(hexaId).toUpperCase();
    const found = lookupHexaId(upper);
    if (found) {
      updateMember(i, { hexaId: upper, fullName: found.name, email: found.email });
    } else {
      updateMember(i, { hexaId: upper });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionLabel color={track.color}>{track.teamLabel || "Members"}</SectionLabel>
      <p className="font-wizard text-silver-hp/65 text-sm">
        Enter each member&apos;s HexaID to auto-fill their name. If not found, fill manually.
      </p>
      {form.members.map((m, i) => (
        <div
          key={i}
          className="rounded-md border p-4"
          style={{ borderColor: `${track.color}33`, backgroundColor: `${track.color}08` }}
        >
          <div className="font-display text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: track.color }}>
            Member · {i + 1}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="HexaID" value={m.hexaId}
                   onChange={(v) => lookup(i, v)} placeholder="e.g. HXF-005"
                   color={track.color} uppercase />
            <Field label="Full Name" value={m.fullName}
                   onChange={(v) => updateMember(i, { fullName: v })}
                   placeholder="Member's full name" color={track.color} />
            <Field label="Email" type="email" value={m.email}
                   onChange={(v) => updateMember(i, { email: v })}
                   placeholder="member@email.com" color={track.color} />
            {(track.perMemberFields || []).map((f) => (
              <Field
                key={f.name}
                label={f.label}
                value={m[f.name]}
                onChange={(v) => updateMember(i, { [f.name]: v })}
                placeholder={f.placeholder}
                color={track.color}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* Skills step (chip grid)                                                  */
/* ──────────────────────────────────────────────────────────────────────── */

function SkillsStep({ track, form, patch }) {
  const toggle = (chip) => {
    const next = new Set(form.chips);
    if (next.has(chip)) next.delete(chip); else next.add(chip);
    patch({ chips: next });
  };
  return (
    <div className="flex flex-col gap-4">
      <SectionLabel color={track.color}>{track.chipsLabel || "Tech Arsenal"}</SectionLabel>
      <p className="font-wizard text-silver-hp/65 text-sm">
        Select the {(track.chipsLabel || "tools").toLowerCase()} you plan to wield.
      </p>
      <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {track.chips.map((chip) => {
          const on = form.chips.has(chip);
          return (
            <button
              type="button"
              key={chip}
              onClick={() => toggle(chip)}
              className="rounded-md border px-3 py-2 font-display text-[11px] uppercase tracking-[0.2em] transition"
              style={{
                borderColor: on ? track.color : "rgba(197,198,199,0.20)",
                color:       on ? track.color : "rgba(232,224,208,0.70)",
                backgroundColor: on ? `${track.color}15` : "rgba(255,255,255,0.02)",
                boxShadow:       on ? `0 0 14px ${track.color}33` : "none",
              }}
            >
              {chip}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* Confirm step                                                              */
/* ──────────────────────────────────────────────────────────────────────── */

function ConfirmStep({ track, form, tcAccepted, setTcAccepted, submitted }) {
  return (
    <div className="flex flex-col gap-6">
      <SectionLabel color={track.color}>Seal the Covenant</SectionLabel>
      <div
        className="rounded-md border p-5 font-wizard text-sm leading-relaxed"
        style={{ borderColor: `${track.color}40`, backgroundColor: `${track.color}0a` }}
      >
        <SummaryRow color={track.color} label="Track">{track.name}</SummaryRow>
        <SummaryRow color={track.color} label="Name">{form.fullName || "—"}</SummaryRow>
        <SummaryRow color={track.color} label="Email">{form.email || "—"}</SummaryRow>
        <SummaryRow color={track.color} label="University">{form.university || "—"}</SummaryRow>
        {track.kind !== "solo" && (
          <>
            <SummaryRow color={track.color} label={`${track.teamLabel || "Team"} Name`}>{form.teamName || "—"}</SummaryRow>
            <SummaryRow color={track.color} label={`${track.teamLabel || "Team"} Size`}>{form.teamSize || "—"}</SummaryRow>
          </>
        )}
        <SummaryRow color={track.color} label="T-Shirt">{form.tshirt || "—"}</SummaryRow>
        <SummaryRow color={track.color} label="Food">{form.food || "—"}</SummaryRow>
        <SummaryRow color={track.color} label="Experience">
          {form.experience === "yes" ? "First time" : form.experience === "no" ? "Experienced" : "—"}
        </SummaryRow>
        {track.chips && (
          <SummaryRow color={track.color} label={track.chipsLabel || "Skills"}>
            {form.chips.size ? Array.from(form.chips).join(", ") : "None selected"}
          </SummaryRow>
        )}
        <SummaryRow color={track.color} label="GitHub">{form.github || "Not provided"}</SummaryRow>
        <SummaryRow color={track.color} label="LinkedIn">{form.linkedin || "Not provided"}</SummaryRow>
        <SummaryRow color={track.color} label="Referral">{form.referral || "None"}</SummaryRow>
      </div>

      <label className="flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={tcAccepted}
          onChange={(e) => setTcAccepted(e.target.checked)}
          className="sr-only"
        />
        <span
          aria-hidden="true"
          className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border"
          style={{
            borderColor: tcAccepted ? track.color : "rgba(197,198,199,0.4)",
            backgroundColor: tcAccepted ? track.color : "transparent",
            color: "#0B0C10",
          }}
        >
          {tcAccepted ? "✓" : null}
        </span>
        <span className="font-wizard text-xs text-silver-hp/75 leading-relaxed">
          I accept the <Link href="#" className="underline" style={{ color: track.color }}>Terms &amp; Conditions</Link> and confirm
          that all information provided is accurate. I bind {track.kind === "solo" ? "myself" : "my team"} to the HexaFalls covenant.
        </span>
      </label>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 font-display text-[11px] uppercase tracking-[0.4em]"
          style={{ color: track.color }}
        >
          <RoughDivider width={48} height={20} color={track.color} seed={113} />
          Owls dispatched · check your inbox
          <RoughDivider width={48} height={20} color={track.color} seed={117} />
        </motion.div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* tiny field primitives                                                    */
/* ──────────────────────────────────────────────────────────────────────── */

function SectionLabel({ children, color }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="font-display text-[10px] uppercase tracking-[0.4em]"
        style={{ color }}
      >
        {children}
      </span>
      <span className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}55, transparent)` }} />
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", color, required, uppercase }) {
  const [focused, setFocused] = useState(false);
  return (
    <label className="block">
      <span className="block font-display text-[10px] uppercase tracking-[0.25em] text-silver-hp/85 mb-1">
        {label}{required && <span className="ml-1" style={{ color }}>*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="w-full rounded-md border bg-slate-hp/40 px-3 py-2 text-sm text-silver-hp font-body outline-none transition placeholder:text-silver-hp/35"
        style={{
          borderColor:    focused ? color : "rgba(197,198,199,0.20)",
          boxShadow:      focused ? `0 0 0 3px ${color}1f, 0 0 12px ${color}33` : "none",
          textTransform:  uppercase ? "uppercase" : "none",
          letterSpacing:  uppercase ? "0.05em" : "normal",
        }}
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options, color, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <label className="block">
      <span className="block font-display text-[10px] uppercase tracking-[0.25em] text-silver-hp/85 mb-1">
        {label}{required && <span className="ml-1" style={{ color }}>*</span>}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full rounded-md border bg-slate-hp/40 px-3 py-2 text-sm text-silver-hp font-body outline-none transition"
        style={{
          borderColor: focused ? color : "rgba(197,198,199,0.20)",
          boxShadow:   focused ? `0 0 0 3px ${color}1f, 0 0 12px ${color}33` : "none",
        }}
      >
        <option value="" disabled>— Choose —</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

function RadioField({ label, name, value, onChange, options, color }) {
  return (
    <div>
      <span className="block font-display text-[10px] uppercase tracking-[0.25em] text-silver-hp/85 mb-2">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value === o.value;
          return (
            <label
              key={o.value}
              className="flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer text-sm font-wizard transition"
              style={{
                borderColor:     on ? color : "rgba(197,198,199,0.20)",
                color:           on ? color : "rgba(232,224,208,0.75)",
                backgroundColor: on ? `${color}10` : "rgba(255,255,255,0.02)",
                boxShadow:       on ? `0 0 14px ${color}33` : "none",
              }}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={on}
                onChange={(e) => onChange(e.target.value)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border"
                style={{ borderColor: on ? color : "rgba(197,198,199,0.45)" }}
              >
                {on && <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />}
              </span>
              {o.label}
            </label>
          );
        })}
      </div>
    </div>
  );
}

function SummaryRow({ label, children, color }) {
  return (
    <div className="flex flex-wrap gap-2 mb-2 last:mb-0">
      <span className="font-display text-[10px] uppercase tracking-[0.3em]" style={{ color }}>
        {label}:
      </span>
      <span className="text-silver-hp/85 font-body text-sm">{children}</span>
    </div>
  );
}
