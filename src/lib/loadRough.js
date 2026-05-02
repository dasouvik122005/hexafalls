"use client";

// Module-level promise cache for the rough.js bundle. Without this, every
// instance of every rough-themed component awaits its own dynamic import
// (a serialized chain of 7+ awaits per page on first paint). With it, the
// first component triggers the import, every subsequent component awaits
// the same promise — cheap, no extra network/parse work.
let cache;

export function loadRough() {
  if (!cache) {
    cache = import("roughjs/bin/rough").then((m) => m.default);
  }
  return cache;
}
