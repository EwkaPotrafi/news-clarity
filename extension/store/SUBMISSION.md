# Publishing News Clarity on the Chrome Web Store

Goal: an **unlisted** listing, so only people you send the link to can find
it. They install with one click, there's no developer-mode warning, and
updates reach them automatically.

## 0. Build the files
```bash
cd extension && npm install && npm run store
```
Everything to upload lands in `extension/release/store/`:

| File | Where it goes |
|---|---|
| `news-clarity-webstore.zip` | Package tab → Upload new package |
| `icon-128.png` | Store listing → Store icon |
| `screenshot-1.png`, `-2`, `-3` (1280×800) | Store listing → Screenshots |
| `promo-tile-440x280.png` | Store listing → Small promo tile |

## 1. Register as a developer (once)
1. Go to https://chrome.google.com/webstore/devconsole and sign in with the
   Google account that should own the extension. The account needs
   2-Step Verification switched on.
2. Pay the one-off **$5** registration fee and accept the agreement.
3. Account tab: set a **publisher name** (e.g. "News Clarity"), verify the
   contact email. When asked about **trader status** (EU rule), a free,
   non-commercial project is normally **"non-trader"**.

## 2. Create the item
**Items → New item** → upload `news-clarity-webstore.zip`.

## 3. Store listing tab
Copy the text from `LISTING.md`:
- **Description:** Polish description (add English via "Add language").
- **Category:** Productivity (or News & Weather). **Language:** Polish.
- **Icon, screenshots, promo tile:** files from step 0.
- **Homepage / support URL (optional):** https://github.com/EwkaPotrafi/news-clarity

## 4. Privacy tab (paste these answers)

**Single purpose**
> Gives the reader a calm, fair assessment of the news article, selected passage or forwarded message they choose, by preparing it with the News Clarity method for their AI assistant (ChatGPT, Grok, or Claude via the user's own API key).

**Permission justifications**

| Permission | Justification |
|---|---|
| `sidePanel` | The extension's whole interface is a side panel shown next to the article being read. |
| `scripting` | Injects a one-off function into the current tab, only when the user presses "Check this article", to read the article's text. |
| `storage` | Saves the user's settings (assistant, language, text size, optional API key) locally, and briefly passes a right-click selection to the panel. |
| `contextMenus` | Adds "check selected text" and "check this page" to the right-click menu. |
| Host permission `<all_urls>` | Users read news on any website, and the side panel stays open while they switch tabs, so the extension must be able to read the current tab's article when the user asks. It never reads pages without a click and runs nothing in the background. |

**Are you using remote code?** → **No.** All JavaScript is bundled in the package.

**Data usage** — tick:
- **Website content** (the article text the user asks it to check)
- **Personal communications** (a forwarded message the user pastes in)
- **Authentication information** (only the user's own Anthropic API key, in the optional Claude mode)

Then tick all three certifications (not sold, not used for unrelated
purposes, not used for creditworthiness). These are true: nothing is sent to
the developer; in the default mode nothing leaves the device at all, and in
the optional Claude mode text goes only to Anthropic's API.

**Privacy policy URL** — must be public. The repository is public, so use:
> https://github.com/EwkaPotrafi/news-clarity/blob/main/extension/store/PRIVACY.md

(That link works once this branch is merged into `main`. Until then use the
same path with `blob/claude/news-cleanser-chrome-plugin-3ezac7/` instead of
`blob/main/`.)

## 5. Distribution tab
- **Visibility: Unlisted.**
- **Regions:** all, or just Poland.
- Payments: free.

## 6. Submit for review
Click **Submit for review**. Because of the "all sites" permission, expect an
in-depth review: usually a few days, occasionally longer. You'll get an email.

When it's approved, the item page has a link like
`https://chromewebstore.google.com/detail/news-clarity/<id>`. **That link is
what you send to people.** The Polish guide tells them what to do with it.

## Publishing an update
1. Raise `"version"` in `static/manifest.json` (e.g. 1.1.0 → 1.2.0).
2. `npm run store`
3. Dashboard → item → Package → **Upload new package** →
   `news-clarity-webstore.zip` → Submit for review.

Installed copies update themselves within a day or so of approval.

## If the review is rejected
The email names the policy. The most likely ones are: an unused permission
(remove it from the manifest), a description that doesn't match what the
extension does, or the privacy policy URL not opening. Fix it, raise the
version, upload again.
