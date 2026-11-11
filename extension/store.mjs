// Builds everything the Chrome Web Store asks for into release/store/:
//   news-clarity-webstore.zip   upload this (manifest.json at the ZIP root)
//   screenshot-1..3.png         1280x800 store screenshots (Polish UI)
//   promo-tile-440x280.png      small promo tile
//   icon-128.png                store icon
// Listing text, permission justifications and the privacy policy are in store/.
import { execFileSync } from "node:child_process";
import { mkdir, rm, copyFile, readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import os from "node:os";
import path from "node:path";

const root = path.dirname(new URL(import.meta.url).pathname);
const out = path.join(root, "release", "store");
const dist = path.join(root, "dist");
const tmp = path.join(os.tmpdir(), `news-clarity-store-${process.pid}`);

execFileSync("node", ["build.mjs"], { cwd: root, stdio: "inherit" });
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await mkdir(tmp, { recursive: true });

execFileSync("zip", ["-qr", path.join(out, "news-clarity-webstore.zip"), ".", "-x", "*.map"], { cwd: dist });
await copyFile(path.join(root, "static", "icons", "128.png"), path.join(out, "icon-128.png"));

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const ctx = await chromium.launchPersistentContext(path.join(tmp, "profile"), {
  headless: true,
  channel: "chromium",
  args: [`--disable-extensions-except=${dist}`, `--load-extension=${dist}`],
});
// The hand-off opens chatgpt.com; serve a blank page instead of the real site.
await ctx.route(/chatgpt\.com|grok\.com/, (r) => r.fulfill({ status: 200, contentType: "text/html", body: "" }));
const sw = ctx.serviceWorkers()[0] ?? (await ctx.waitForEvent("serviceworker"));
const id = new URL(sw.url()).host;
await new Promise((r) => setTimeout(r, 1500)); // let the install-time settings tab open

const articleUrl = pathToFileURL(path.join(root, "store", "assets", "sample-article.html")).href;
const ext = (p) => `chrome-extension://${id}/${p}`;

async function shot(url, width, height, file, prepare) {
  const page = await ctx.newPage();
  await page.setViewportSize({ width, height });
  await page.goto(url);
  if (prepare) await prepare(page);
  await page.waitForTimeout(300);
  await page.screenshot({ path: file });
  return page;
}

// Article on the left (880px), side panel on the right (400px) = 1280x800.
const article = path.join(tmp, "article.png");
await shot(articleUrl, 879, 800, article);

await shot(ext("sidepanel.html"), 400, 800, path.join(tmp, "panel-start.png"), (p) =>
  p.evaluate(() => chrome.storage.local.set({ mode: "chatgpt", lang: "pl", textSize: "large" })),
);
await shot(ext("sidepanel.html"), 400, 800, path.join(tmp, "panel-handoff.png"), async (p) => {
  await p.evaluate(() =>
    chrome.storage.session.set({
      pending: {
        kind: "selection",
        title: "Rada miasta przyjęła nowy plan komunikacji",
        url: "https://example.com/artykul",
        text: "Według ratusza plan będzie kosztował 1,2 mld zł. Opozycja twierdzi, że realny koszt będzie dwa razy wyższy.",
        at: Date.now(),
      },
    }),
  );
  await p.waitForSelector("#handoff:not([hidden])");
});
await shot(ext("options.html"), 1280, 800, path.join(out, "screenshot-3.png"));
await shot(pathToFileURL(path.join(root, "store", "assets", "promo-tile.html")).href, 440, 280, path.join(out, "promo-tile-440x280.png"));
await ctx.close();

// Stitch with a tiny HTML page so no image library is needed.
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
for (const [panel, name] of [
  ["panel-start.png", "screenshot-1.png"],
  ["panel-handoff.png", "screenshot-2.png"],
]) {
  // data: URLs, because a page made with setContent may not load file:// images
  const dataUrl = async (f) => `data:image/png;base64,${(await readFile(f)).toString("base64")}`;
  const a = await dataUrl(article);
  const b = await dataUrl(path.join(tmp, panel));
  await page.setContent(
    `<body style="margin:0;display:flex;background:#fff"><img src="${a}"><div style="width:1px;background:#c9c5bc"></div><img src="${b}"></body>`,
  );
  await page.waitForLoadState("load");
  await page.screenshot({ path: path.join(out, name) });
}
await browser.close();
await rm(tmp, { recursive: true, force: true });
console.log(`Store assets ready in ${path.relative(process.cwd(), out)}/`);
