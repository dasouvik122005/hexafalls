#!/usr/bin/env node
/**
 * Optimise the sponsorship brochure page images for the web.
 *
 * Input:
 *   public/brochures/brochure-page-1.jpg
 *   public/brochures/brochure-page-2.jpg
 *   ...(any brochure-page-*.jpg)
 *
 * Output (overwrites the JPG in-place + writes a companion WebP):
 *   public/brochures/brochure-page-N.jpg   (~410 KB, mozjpeg q82, progressive)
 *   public/brochures/brochure-page-N.webp  (~250 KB, q78, effort=5)
 *
 * Pipeline:
 *   1. Resize down to 1600 px wide (preserves aspect ratio; never enlarges).
 *      1600 px covers retina up to ~800 CSS px @ 2× DPR — plenty for the
 *      preview's max-w-4xl frame.
 *   2. Re-encode with mozjpeg quality 82, progressive — sharp text + scenes.
 *   3. Companion WebP at quality 78 with encoder effort 5 — best size/CPU
 *      tradeoff. The brochure page picks this via <picture><source>.
 *
 * Run:
 *   node scripts/optimize-brochure.mjs
 *
 * Source PDF is left untouched; the download link still serves the full
 * original PDF.
 */

import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

const SRC_DIR = "public/brochures";
const WIDTH = 1600;
const JPG_QUALITY = 82;
const WEBP_QUALITY = 78;

const fmt = (b) =>
  b > 1024 * 1024
    ? (b / (1024 * 1024)).toFixed(2) + " MB"
    : (b / 1024).toFixed(1) + " KB";

const pages = fs
  .readdirSync(SRC_DIR)
  .filter((f) => /^brochure-page-\d+\.jpg$/.test(f))
  .sort();

if (pages.length === 0) {
  console.error(
    `No brochure-page-N.jpg files found in ${SRC_DIR}.\n` +
      "Export the PDF pages first, e.g.:\n" +
      "  pdftoppm -jpeg -r 300 public/brochures/brochure_sponsor.pdf " +
      "public/brochures/brochure-page",
  );
  process.exit(1);
}

for (const p of pages) {
  const inPath = path.join(SRC_DIR, p);
  const stem = p.replace(/\.jpg$/, "");
  const outJpg = path.join(SRC_DIR, `${stem}.jpg`);
  const outWebp = path.join(SRC_DIR, `${stem}.webp`);

  const before = fs.statSync(inPath).size;

  await sharp(inPath)
    .resize({ width: WIDTH, withoutEnlargement: true })
    .jpeg({ quality: JPG_QUALITY, mozjpeg: true, progressive: true })
    .toFile(outJpg + ".tmp");
  fs.renameSync(outJpg + ".tmp", outJpg);

  await sharp(inPath)
    .resize({ width: WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 5 })
    .toFile(outWebp);

  const afterJpg = fs.statSync(outJpg).size;
  const afterWebp = fs.statSync(outWebp).size;

  console.log(`${stem}:`);
  console.log(`  before        ${fmt(before).padStart(10)}`);
  console.log(
    `  after  .jpg   ${fmt(afterJpg).padStart(10)}  (-${Math.round((1 - afterJpg / before) * 100)}%)`,
  );
  console.log(
    `  after .webp   ${fmt(afterWebp).padStart(10)}  (-${Math.round((1 - afterWebp / before) * 100)}%)`,
  );
}
