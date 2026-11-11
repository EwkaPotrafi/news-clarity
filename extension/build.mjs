// Builds the extension into dist/ (the folder you load in Chrome).
//
// The News Clarity instructions are NOT copied by hand: they are read from
// ../CLAUDE.md at build time, so the extension always follows the same method
// as the rest of the project. Change CLAUDE.md, run `npm run build`, reload.
import { build } from "esbuild";
import { readFile, cp, mkdir, rm } from "node:fs/promises";

const CUT_MARKER = "## Working in this repository";

const claudeMd = await readFile(new URL("../CLAUDE.md", import.meta.url), "utf8");
const cut = claudeMd.indexOf(CUT_MARKER);
if (cut === -1) {
  throw new Error(`Could not find "${CUT_MARKER}" in CLAUDE.md - update build.mjs`);
}
const instructions = claudeMd.slice(0, cut).trim();

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });

await build({
  entryPoints: ["src/sidepanel.js", "src/options.js", "src/background.js"],
  bundle: true,
  format: "esm",
  target: "chrome120",
  outdir: "dist",
  minify: false, // keep it readable: anyone can open dist/ and see what it does
  legalComments: "none",
  define: { __NEWS_CLARITY_INSTRUCTIONS__: JSON.stringify(instructions) },
});

await cp("static", "dist", { recursive: true });
console.log(`Built dist/ (instructions: ${instructions.length} chars from CLAUDE.md)`);
