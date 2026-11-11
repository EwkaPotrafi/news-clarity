# News Clarity — Privacy Policy

_Last updated: 11 November 2026_

News Clarity is a Chrome extension that helps you get a calm, fair assessment
of a news article or message. This policy explains what it does with data.
In short: **it has no servers of its own, collects nothing for its authors,
and does no tracking.**

## What the extension reads
- **The text of the page you are on**, or the text you selected, or the text
  you pasted into its panel. It reads a page **only when you press
  "Sprawdź ten artykuł" / "Check this article" or use its right-click menu**.
  Nothing is read in the background.

## Where that text goes
It depends on the mode you choose in the extension's settings:

- **ChatGPT or Grok mode (default):** the extension puts the text, together
  with the News Clarity instructions, on your clipboard and opens chatgpt.com
  or grok.com. **The extension itself sends nothing.** If you paste the text
  there, it is handled by OpenAI or xAI under their own privacy policies and
  your account with them.
- **Claude API mode (optional):** the text is sent directly from your browser
  to Anthropic's API (`api.anthropic.com`) using the API key you entered, to
  generate the answer. Anthropic handles it under its own terms and privacy
  policy. Nothing passes through any other server.

## What is stored, and where
- Your settings (mode, language, text size) and, in Claude API mode, your API
  key are stored **only in your browser** (Chrome's extension storage on your
  computer). They are not synced or sent anywhere except that the API key is
  sent to Anthropic with your requests.
- An item chosen from the right-click menu is held briefly in session storage
  until the panel opens, and is cleared when the browser closes.

## What the extension does NOT do
- No analytics, tracking, advertising or telemetry.
- No sale or transfer of data to third parties.
- No use of data for anything other than the assessment you asked for.
- No access to your browsing history.

## Permissions
- **Read site content (all sites)** — to read the article text when you ask
  it to check a page.
- **Side panel** — to show its panel next to the page.
- **Context menus** — for the right-click "check selected text" option.
- **Storage** — to remember your settings.

## Changes and contact
The source code is public: https://github.com/EwkaPotrafi/news-clarity.
Questions or concerns: open an issue at
https://github.com/EwkaPotrafi/news-clarity/issues.
