// Reads the article text from the page the reader has open.
// `extractFromPage` is injected into the tab, so it must be self-contained.

export function extractFromPage() {
  const selection = String(window.getSelection?.() ?? "").trim();
  if (selection.length > 40) {
    return { kind: "selection", title: document.title, url: location.href, text: selection };
  }

  const candidates = [
    "article",
    "[itemprop='articleBody']",
    "main",
    "[role='main']",
    ".article-body, .article__body, .story-body, .post-content, .entry-content",
  ];
  let best = null;
  for (const sel of candidates) {
    for (const el of document.querySelectorAll(sel)) {
      const len = (el.innerText || "").trim().length;
      if (!best || len > best.len) best = { el, len };
    }
    if (best && best.len > 800) break;
  }
  const root = best && best.len > 300 ? best.el : document.body;

  // Collect the readable blocks (paragraphs, headings, list items), skipping
  // navigation, ads, comments and other clutter.
  const clutter =
    "nav, footer, aside, form, [role='navigation'], [role='complementary'], [aria-hidden='true'], " +
    ".comments, #comments, .advert, .ad, .ads, .newsletter, .related, .share";
  const blockSel = "h1, h2, h3, h4, p, li, blockquote, figcaption";
  const parts = [];
  for (const el of root.querySelectorAll(blockSel)) {
    if (el.closest(clutter)) continue;
    if (el.parentElement?.closest(blockSel)) continue; // nested; parent already counted
    const line = (el.innerText || "").replace(/\s+/g, " ").trim();
    if (line) parts.push(line);
  }
  let text = parts.join("\n");
  if (text.length < 300) {
    text = (root.innerText || "").split("\n").map((l) => l.trim()).filter(Boolean).join("\n");
  }

  const headline = document.querySelector("h1")?.innerText?.trim();
  const description = document.querySelector("meta[name='description'], meta[property='og:description']")?.content;
  const published = document.querySelector(
    "meta[property='article:published_time'], meta[name='date'], time[datetime]",
  );
  const header = [
    headline && `Headline: ${headline}`,
    description && `Summary line: ${description}`,
    published && `Published: ${published.content || published.getAttribute("datetime")}`,
  ]
    .filter(Boolean)
    .join("\n");

  return { kind: "page", title: document.title, url: location.href, text: header ? `${header}\n\n${text}` : text };
}

export async function readActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !/^https?:/.test(tab.url ?? "")) return null;
  try {
    const [result] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: extractFromPage });
    return result?.result ?? null;
  } catch {
    return null; // e.g. the Chrome Web Store, or a page that blocks scripts
  }
}
