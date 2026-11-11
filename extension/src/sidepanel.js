import Anthropic from "@anthropic-ai/sdk";
import { loadSettings, t, CHAT_APPS } from "./i18n.js";
import { makeClient, runTurn } from "./claude.js";
import { buildSystemPrompt, buildItemMessage, buildChatPrompt } from "./prompt.js";
import { readActiveTab } from "./extract.js";
import { renderMarkdown, escapeHtml } from "./markdown.js";

const $ = (id) => document.getElementById(id);

let settings;
let S; // UI strings for the chosen language
let conversation = null; // { messages, system, parts: [{kind:'q'|'a', text}] }
let controller = null;
let handoff = null; // { prompt, app, opened } while handing over to ChatGPT/Grok

const fmt = (str, app) => str.replaceAll("{app}", app.name);
const needsKey = () => settings.mode === "api" && !settings.apiKey;

function applyStrings() {
  document.documentElement.lang = settings.lang;
  document.documentElement.dataset.size = settings.textSize;
  document.querySelectorAll("[data-t]").forEach((el) => (el.textContent = S[el.dataset.t] ?? ""));
  document.querySelectorAll("[data-t-placeholder]").forEach((el) => (el.placeholder = S[el.dataset.tPlaceholder] ?? ""));
}

async function init() {
  settings = await loadSettings();
  S = t(settings.lang);
  applyStrings();
  $("setup").hidden = !needsKey();

  $("open-settings").onclick = () => chrome.runtime.openOptionsPage();
  $("check-page").onclick = checkPage;
  $("check-text").onclick = checkPasted;
  $("new-check").onclick = reset;
  $("handoff-new").onclick = reset;
  $("handoff-copy").onclick = () => copyAndOpen(true);
  $("copy").onclick = copyAnswer;
  $("stop").onclick = () => controller?.abort();
  $("follow-up").onsubmit = (e) => {
    e.preventDefault();
    askFollowUp();
  };

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local") {
      loadSettings().then((s) => {
        settings = s;
        S = t(s.lang);
        applyStrings();
        $("setup").hidden = !needsKey();
      });
    }
    if (area === "session" && changes.pending?.newValue) takePending();
  });
  takePending();
}

// The right-click menu (background.js) leaves the item here for us.
async function takePending() {
  const { pending } = await chrome.storage.session.get("pending");
  if (!pending || busy()) return;
  await chrome.storage.session.remove("pending");
  if (pending.kind === "page-request") return checkPage();
  startCheck(pending);
}

const busy = () => controller !== null;

async function checkPage() {
  if (busy()) return;
  showResult();
  setStatus(S.reading);
  const item = await readActiveTab();
  if (!item) return fail(S.cannotRead);
  if (item.text.trim().length < 200) return fail(S.pageTooShort);
  startCheck(item);
}

function checkPasted() {
  if (busy()) return;
  const text = $("paste").value.trim();
  if (!text) {
    $("paste").focus();
    $("paste").placeholder = S.emptyPaste;
    return;
  }
  startCheck({ kind: "pasted", text });
}

async function startCheck(item) {
  if (settings.mode !== "api") return startHandoff(item);
  if (needsKey()) {
    $("setup").hidden = false;
    return;
  }
  showResult();
  const { text, truncated } = buildItemMessage(item);
  $("item-info").textContent =
    item.kind === "pasted"
      ? S.checkingPasted
      : `${item.kind === "selection" ? S.checkingSelection : S.checkingPage} ${item.title || item.url}`;
  if (truncated) $("item-info").textContent += ` ${S.truncated}`;

  conversation = {
    system: buildSystemPrompt(S.languageName),
    messages: [{ role: "user", content: text }],
    parts: [],
  };
  await runAndShow();
}

async function askFollowUp() {
  const q = $("follow-up-input").value.trim();
  if (!q || !conversation || busy()) return;
  $("follow-up-input").value = "";
  conversation.messages.push({ role: "user", content: q });
  conversation.parts.push({ kind: "q", text: q });
  await runAndShow();
}

async function runAndShow() {
  controller = new AbortController();
  $("stop").hidden = false;
  $("actions").hidden = true;
  $("follow-up").hidden = true;
  setStatus(S.thinking);

  const part = { kind: "a", text: "" };
  conversation.parts.push(part);
  let frame = 0;

  try {
    const { stopReason } = await runTurn({
      client: makeClient(settings.apiKey),
      system: conversation.system,
      messages: conversation.messages,
      signal: controller.signal,
      onText: (text) => {
        part.text = text;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(renderAnswer);
      },
      onStatus: ({ kind, detail }) => {
        const label = { thinking: S.thinking, writing: S.writing, searching: S.searching, fetching: S.fetching }[kind];
        setStatus(detail ? `${label}: ${detail}` : label);
      },
    });
    renderAnswer();
    if (stopReason === "refusal") {
      part.text += `\n\n${S.refusal}`;
      renderAnswer();
    }
    setStatus(S.done);
  } catch (err) {
    handleError(err, part);
  } finally {
    controller = null;
    $("stop").hidden = true;
    $("actions").hidden = false;
    $("follow-up").hidden = false;
  }
}

function handleError(err, part) {
  if (err instanceof Anthropic.APIUserAbortError || err?.name === "AbortError") {
    setStatus(S.stopped);
    // Keep the conversation valid: drop the unanswered user turn.
    if (conversation.messages.at(-1)?.role === "user") conversation.messages.pop();
    return;
  }
  let msg;
  if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) msg = S.errAuth;
  else if (err instanceof Anthropic.RateLimitError) msg = S.errRate;
  else if (err instanceof Anthropic.APIConnectionError) msg = S.errConnection;
  else if (err instanceof Anthropic.InternalServerError && err.status === 529) msg = S.errOverloaded;
  else msg = `${S.errOther} ${err?.message ?? err}`;
  console.error(err);
  if (conversation.messages.at(-1)?.role === "user") conversation.messages.pop();
  if (!part.text) conversation.parts.pop();
  renderAnswer();
  setStatus(msg);
}

function renderAnswer() {
  if (!conversation) return;
  $("answer").innerHTML = conversation.parts
    .map((p) => (p.kind === "q" ? `<p class="question">${escapeHtml(p.text)}</p>` : renderMarkdown(p.text)))
    .join("\n");
}

async function copyAnswer() {
  const text = conversation?.parts.map((p) => (p.kind === "q" ? `> ${p.text}` : p.text)).join("\n\n") ?? "";
  await navigator.clipboard.writeText(text);
  $("copy").textContent = S.copied;
  setTimeout(() => ($("copy").textContent = S.copy), 2000);
}

function showResult() {
  $("start").hidden = true;
  $("handoff").hidden = true;
  $("result").hidden = false;
}

// --- ChatGPT / Grok mode -------------------------------------------------
// We can't use a consumer subscription from code, so the extension does the
// fiddly part (reading the article, writing the full News Clarity prompt) and
// the reader does the last step: paste into the assistant's own page.

async function startHandoff(item) {
  const app = CHAT_APPS[settings.mode] ?? CHAT_APPS.chatgpt;
  const { prompt, truncated } = buildChatPrompt(item, S.languageName);
  handoff = { prompt, app, opened: false };

  $("start").hidden = true;
  $("result").hidden = true;
  $("handoff").hidden = false;
  $("handoff-info").textContent =
    (item.kind === "pasted"
      ? S.checkingPasted
      : `${item.kind === "selection" ? S.checkingSelection : S.checkingPage} ${item.title || item.url}`) +
    (truncated ? ` ${S.truncated}` : "");
  $("step1").textContent = fmt(S.handoffStep1, app);
  $("step2").textContent = S.handoffStep2;
  $("step3").textContent = S.handoffStep3;
  $("handoff-tip").textContent = fmt(S.handoffTip, app);

  // Works when this runs straight from a click in the panel. From the
  // right-click menu Chrome may refuse clipboard access; then he clicks the button.
  await copyAndOpen(false);
}

async function copyAndOpen(fromButton) {
  if (!handoff) return;
  const { app } = handoff;
  let copied = false;
  try {
    await navigator.clipboard.writeText(handoff.prompt);
    copied = true;
  } catch {
    copied = false;
  }

  if (copied && !handoff.opened) {
    handoff.opened = true;
    await chrome.tabs.create({ url: app.url });
  }

  $("step1").classList.toggle("dim", !handoff.opened);
  if (copied) {
    $("handoff-msg").textContent = fromButton ? S.copied : "";
    $("handoff-copy").textContent = S.copyAgain;
    $("handoff-copy").className = "secondary";
  } else {
    $("handoff-msg").textContent = fmt(S.handoffNotCopied, app);
    $("handoff-copy").textContent = fmt(S.copyAndOpen, app);
    $("handoff-copy").className = "primary";
  }
}

function reset() {
  if (busy()) return;
  conversation = null;
  handoff = null;
  $("handoff").hidden = true;
  $("handoff-msg").textContent = "";
  $("answer").innerHTML = "";
  $("item-info").textContent = "";
  $("paste").value = "";
  setStatus("");
  $("result").hidden = true;
  $("start").hidden = false;
}

function fail(message) {
  setStatus(message);
  $("actions").hidden = false;
}

function setStatus(text) {
  $("status").textContent = text;
}

init();
