// Regenerates index.ts by scanning the icons/ directory.
// Run: node scripts/generate-index.mjs
import { readdirSync, statSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const iconsDir = join(root, "icons");

const slugs = readdirSync(iconsDir)
  .filter((s) => statSync(join(iconsDir, s)).isDirectory())
  .sort();

const lines = slugs.map((slug) => {
  const pascal = slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");
  return `export { default as ${pascal} } from "./icons/${slug}/${slug}";`;
});

writeFileSync(join(root, "index.ts"), lines.join("\n") + "\n", "utf8");
console.log(`Generated index.ts with ${slugs.length} icons.`);
