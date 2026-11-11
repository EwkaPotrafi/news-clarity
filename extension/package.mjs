// Makes the shareable install package: release/News-Clarity.zip
//
//   news-clarity/        the built extension (what Chrome loads)
//   Instrukcja.pdf       illustrated Polish guide for Dad (install + use)
//   Install-guide.pdf    English guide for whoever sets it up
//
// Files sit at the ZIP root, so "Extract All" on Windows and double-click on
// a Mac both produce a single "News-Clarity" folder, as the guides describe.
// PDFs are rendered from install-guide/*.html with Playwright's Chromium.
import { execFileSync } from "node:child_process";
import { cp, mkdir, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";

const root = path.dirname(new URL(import.meta.url).pathname);
const stage = path.join(root, "release", "stage");
const zipPath = path.join(root, "release", "News-Clarity.zip");

execFileSync("node", ["build.mjs"], { cwd: root, stdio: "inherit" });

await rm(stage, { recursive: true, force: true });
await rm(zipPath, { force: true });
await mkdir(stage, { recursive: true });
await cp(path.join(root, "dist"), path.join(stage, "news-clarity"), { recursive: true });

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  throw new Error("Playwright is needed to render the PDF guides (npm i -D playwright).");
}
const browser = await chromium.launch();
const page = await browser.newPage();
for (const [html, pdf] of [
  ["instrukcja.html", "Instrukcja.pdf"],
  ["install-guide.html", "Install-guide.pdf"],
]) {
  await page.goto(pathToFileURL(path.join(root, "install-guide", html)).href, { waitUntil: "load" });
  await page.pdf({ path: path.join(stage, pdf), format: "A4", printBackground: true, preferCSSPageSize: true });
}
await browser.close();

execFileSync("zip", ["-qr", zipPath, "."], { cwd: stage });
await rm(stage, { recursive: true, force: true });
console.log(`Package ready: ${path.relative(process.cwd(), zipPath)}`);
