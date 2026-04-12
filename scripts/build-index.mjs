import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(__dirname, "..", "icons");
const outputFile = path.join(__dirname, "..", "index.ts");

const slugs = fs
  .readdirSync(iconsDir)
  .filter((f) => fs.statSync(path.join(iconsDir, f)).isDirectory())
  .sort();

const lines = slugs.map((slug) => {
  const jsonPath = path.join(iconsDir, slug, `${slug}.json`);
  let exportName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

  if (fs.existsSync(jsonPath)) {
    try {
      const meta = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
      if (meta.name) exportName = meta.name.replace(/\s+/g, "");
    } catch {}
  }

  return `export { default as ${exportName} } from "./icons/${slug}/${slug}";`;
});

const output = lines.join("\n") + "\n";
fs.writeFileSync(outputFile, output, "utf8");
console.log(`✓ index.ts updated — ${lines.length} icons`);
