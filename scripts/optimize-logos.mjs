#!/usr/bin/env node
/**
 * Walk public/logos, convert raster images to optimized .webp.
 *
 *   bun run scripts/optimize-logos.mjs            # default
 *   bun run scripts/optimize-logos.mjs --force    # re-encode even if up-to-date
 *   bun run scripts/optimize-logos.mjs --max=512  # cap the longest edge (px)
 *   bun run scripts/optimize-logos.mjs --quality=82
 *   bun run scripts/optimize-logos.mjs --dir=public/some-other-folder
 *
 * SVGs are left alone (already vector). Originals are kept; only a sibling
 * `<name>.webp` is written. Re-running is incremental — only files newer than
 * their .webp output are re-encoded.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// --- args ---
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);

const TARGET_DIR = path.resolve(ROOT, args.dir || "public/logos");
const MAX_EDGE   = Number(args.max ?? 1024);
const QUALITY    = Number(args.quality ?? 82);
const FORCE      = Boolean(args.force);

// --- sharp (lazy import so the script can print a friendly install hint) ---
let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.error(
    "✗ This script needs `sharp`. Install it as a dev dependency:\n" +
    "    bun add -d sharp\n" +
    "  (or)  npm i -D sharp"
  );
  process.exit(1);
}

const RASTER = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".tiff", ".gif"]);

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.isFile()) yield p;
  }
}

function fmtBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

async function fileExists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function processOne(file) {
  const ext = path.extname(file).toLowerCase();
  if (!RASTER.has(ext)) return null;

  const out = file.replace(new RegExp(`${ext}$`), ".webp");

  // Skip if same path (already .webp) — only skip when not forcing.
  if (out === file && !FORCE) {
    // We'll still re-encode .webp inputs to apply cap/quality if forced.
    return null;
  }

  if (!FORCE && await fileExists(out)) {
    const [srcStat, outStat] = await Promise.all([fs.stat(file), fs.stat(out)]);
    if (outStat.mtimeMs >= srcStat.mtimeMs) return { file, skipped: true };
  }

  const srcStat = await fs.stat(file);
  const img = sharp(file, { failOn: "none" });
  const meta = await img.metadata();

  const longest = Math.max(meta.width || 0, meta.height || 0);
  const pipeline = longest > MAX_EDGE
    ? img.resize({
        width:  meta.width  >= meta.height ? MAX_EDGE : null,
        height: meta.height >  meta.width  ? MAX_EDGE : null,
        withoutEnlargement: true,
        fit: "inside",
      })
    : img;

  const buf = await pipeline
    .webp({
      quality: QUALITY,
      effort: 6,
      smartSubsample: true,
    })
    .toBuffer();

  await fs.writeFile(out, buf);

  return {
    file,
    out,
    before: srcStat.size,
    after:  buf.length,
    width:  Math.min(meta.width  || 0, MAX_EDGE),
    height: Math.min(meta.height || 0, MAX_EDGE),
  };
}

async function main() {
  if (!await fileExists(TARGET_DIR)) {
    console.error(`✗ Folder not found: ${path.relative(ROOT, TARGET_DIR)}`);
    process.exit(1);
  }

  console.log(`→ Optimizing rasters in ${path.relative(ROOT, TARGET_DIR)}`);
  console.log(`  max edge: ${MAX_EDGE}px · quality: ${QUALITY} · force: ${FORCE}\n`);

  let totalBefore = 0, totalAfter = 0, encoded = 0, skipped = 0;

  for await (const file of walk(TARGET_DIR)) {
    const rel = path.relative(ROOT, file);
    try {
      const r = await processOne(file);
      if (!r) continue;
      if (r.skipped) {
        skipped++;
        console.log(`·  ${rel}  (up-to-date)`);
        continue;
      }
      encoded++;
      totalBefore += r.before;
      totalAfter  += r.after;
      const pct = ((1 - r.after / r.before) * 100).toFixed(0);
      console.log(`✓  ${rel}  →  ${path.relative(ROOT, r.out)}  ${fmtBytes(r.before)} → ${fmtBytes(r.after)} (-${pct}%)`);
    } catch (err) {
      console.warn(`!  ${rel}  failed: ${err.message}`);
    }
  }

  console.log("");
  console.log(`done · ${encoded} encoded · ${skipped} up-to-date`);
  if (encoded) {
    const pct = totalBefore ? ((1 - totalAfter / totalBefore) * 100).toFixed(0) : 0;
    console.log(`saved · ${fmtBytes(totalBefore - totalAfter)} (${fmtBytes(totalBefore)} → ${fmtBytes(totalAfter)}, -${pct}%)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
