# News Clarity — Chrome extension

Runs the News Clarity method (`../CLAUDE.md`) on whatever Dad is reading.
One button in a side panel: **"Sprawdź ten artykuł"** (Check this article).

## Two ways it can work (choose in settings)
| Mode | How | Cost |
|---|---|---|
| **ChatGPT** (default) or **Grok** | Uses his existing subscription. The extension reads the article, writes the full News Clarity prompt (CLAUDE.md + the article), copies it, and opens chatgpt.com or grok.com. He pastes (Ctrl+V) and presses Enter. | Nothing beyond his subscription |
| **Claude via API key** | Answer streams straight into the side panel, with follow-up questions. | Pay per use (see below) |

Why the paste step: ChatGPT Plus and SuperGrok are subscriptions for their
websites and apps only. They don't include API access, and there is no
supported way for an extension to send messages through someone's logged-in
chat. Copy + open is the reliable, terms-friendly bridge.

## What it does
- **Toolbar icon** → opens a side panel next to the page.
- **"Sprawdź ten artykuł"** → reads the article text from the open tab and
  hands it to the chosen assistant with the CLAUDE.md method.
- **Paste box** → for forwarded WhatsApp/Facebook/email messages.
- **Right-click** selected text → "News Clarity: sprawdź zaznaczony tekst".
  (From the right-click menu Chrome sometimes blocks automatic copying; the
  panel then shows a big "Skopiuj i otwórz" button.)
- Polish by default, English in settings; text size Normal / Large / Extra large.

## Install package
`npm run package` builds `release/News-Clarity.zip`: the extension folder plus
two illustrated PDF guides rendered from `install-guide/` (Polish
`Instrukcja.pdf` for Dad, English `Install-guide.pdf` for whoever installs it).
Edit the HTML in `install-guide/` to change the guides.

## Install (on Dad's computer, ~5 minutes)
1. Get the `dist/` folder onto his computer (download the repo as ZIP from
   GitHub and unzip it, or copy just `extension/dist/`).
2. Chrome → `chrome://extensions` → switch on **Developer mode** (top right).
3. **Load unpacked** → choose the `dist` folder.
4. The settings page opens by itself: choose **ChatGPT** or **Grok**, Polski,
   text size Duży, and click **Zapisz**. (Only API mode needs a key.)
5. Make sure he is **logged in** to chatgpt.com / grok.com in this Chrome, and
   that web search is available on his plan (it is on ChatGPT Plus and SuperGrok).
6. Click the puzzle-piece icon in the toolbar and **pin** News Clarity so the
   icon is always visible.

Chrome may show a "developer mode extensions" warning at startup; tell Dad
it's expected and to click it away. If that's a nuisance, publish it as an
**unlisted** item on the Chrome Web Store (one-off $5 developer fee):
upload the contents of `dist/` as a ZIP.

## The API key (only for Claude API mode)
- Create it at console.anthropic.com → API keys. Use a **separate key just for
  Dad** and set a **monthly spend limit** on its workspace (e.g. $10–20).
- It is stored only in Chrome's local extension storage on his computer and
  sent only to `api.anthropic.com`.
- Rough cost: one check is roughly $0.10–0.40 (Claude Opus 5.5, several web
  searches at $10 per 1,000 searches). Follow-ups cost less.

## Permissions, and why
| Permission | Why |
|---|---|
| Read pages (`<all_urls>`, `scripting`) | To read the article text — only when he presses the button or uses the right-click menu. Nothing runs in the background. |
| `sidePanel` | The panel next to the page. |
| `contextMenus` | The right-click "check selected text". |
| `storage` | The key and settings. |

## Keeping it in sync with CLAUDE.md
The system prompt is **built from `../CLAUDE.md`** (everything above
"## Working in this repository"), plus a short browser-specific addendum in
`src/prompt.js`. After changing CLAUDE.md:

```bash
cd extension && npm install && npm run build
```

Commit `dist/` too (so the folder can be loaded without Node), then on Dad's
computer replace the `dist` folder and press the ↻ reload button on
`chrome://extensions`.

## Code map
| File | What it is |
|---|---|
| `build.mjs` | Bundles `src/` into `dist/`, injecting CLAUDE.md |
| `src/claude.js` | The only code that calls the Claude API (model, web search/fetch tools, streaming, pause/resume) |
| `src/prompt.js` | Browser addendum to CLAUDE.md (panel and ChatGPT/Grok variants), and how the item is wrapped |
| `src/extract.js` | Pulls article text out of a page (skips nav, ads, comments) |
| `src/sidepanel.js` | Panel UI: ChatGPT/Grok hand-off, or streaming display + follow-ups in API mode |
| `src/markdown.js` | Small, safe Markdown → HTML (escapes everything, only http(s) links) |
| `src/background.js` | Opens the panel, right-click menu |
| `src/options.js` | Settings page |
| `src/i18n.js` | All Polish/English UI text |
| `static/` | Manifest, HTML, CSS, icons (copied into `dist/`) |
