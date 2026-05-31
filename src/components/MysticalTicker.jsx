"use client";

const MYSTICAL_TICKER_ITEMS = [
  { text: "✦ The Grand Conclave Approaches", type: "gold" },
  { text: "58 Hours of Conjuring Remain", type: "cyan" },
  { text: "Owls Dispatched to All Known Realms", type: "silver" },
  { text: "✦ The Keeper Watches the Eastern Gate", type: "gold" },
  { text: "Wands Permitted · Firearms Strictly Forbidden", type: "cyan" },
  { text: "Scrolls Still Unfurling — Await the Signal", type: "silver" },
  { text: "✦ The Archive Opens at Dusk", type: "gold" },
  { text: "All Spells Subject to Peer Review", type: "cyan" },
  { text: "JIS University · The Enchanted Campus · Kolkata", type: "silver" },
  { text: "✦ HexaFalls II — The Second Summoning", type: "gold" },
  { text: "Code Is The New Incantation", type: "cyan" },
  { text: "Ancient Runes · Modern Stacks · One Gathering", type: "silver" },
];

const TICKER_COLOR_MAP = {
  gold: "rgba(212,175,55,0.80)",
  cyan: "rgba(102,252,241,0.75)",
  silver: "rgba(197,198,199,0.45)",
};

function TickerEntry({ item, index }) {
  return (
    <span key={`${item.text}-${index}`} className="flex items-center gap-2.5">
      <span
        className="px-8 py-3 whitespace-nowrap font-mono text-[11px] tracking-[0.35em] uppercase"
        style={{ color: TICKER_COLOR_MAP[item.type] }}
      >
        {item.text}
      </span>
      <span style={{ color: "rgba(102,252,241,0.22)", fontSize: "14px" }}>
        ◆
      </span>
    </span>
  );
}

function TickerMarquee({ entries }) {
  return (
    <div
      className="flex min-w-max whitespace-nowrap relative z-10"
      style={{
        animation: "hexaticker 38s linear infinite",
        willChange: "transform",
      }}
    >
      {entries.map((item, index) => (
        <TickerEntry key={index} item={item} index={index} />
      ))}
    </div>
  );
}

function TickerShell({ children }) {
  return (
    <div
      aria-hidden="true"
      className="relative w-full overflow-hidden"
      style={{
        background: "#02050c",
        borderTop: "1px solid rgba(102,252,241,0.12)",
        borderBottom: "1px solid rgba(212,175,55,0.10)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)",
        maskImage:
          "linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    >
      {children}
    </div>
  );
}

function TickerStyles() {
  return (
    <style>{`
      @keyframes hexaticker {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(calc(-50% - 1rem));
        }
      }
    `}</style>
  );
}

export default function MysticalTicker() {
  const entries = [...MYSTICAL_TICKER_ITEMS, ...MYSTICAL_TICKER_ITEMS];

  return (
    <TickerShell>
      <TickerMarquee entries={entries} />
      <TickerStyles />
    </TickerShell>
  );
}
