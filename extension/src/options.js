import Anthropic from "@anthropic-ai/sdk";
import { loadSettings, t } from "./i18n.js";
import { testKey } from "./claude.js";

const $ = (id) => document.getElementById(id);
let S;

function applyStrings(lang, size) {
  S = t(lang);
  document.documentElement.lang = lang;
  document.documentElement.dataset.size = size;
  document.querySelectorAll("[data-t]").forEach((el) => (el.textContent = S[el.dataset.t] ?? ""));
}

const settings = await loadSettings();
$("mode").value = settings.mode;
$("api-key").value = settings.apiKey;
$("lang").value = settings.lang;
$("size").value = settings.textSize;
applyStrings(settings.lang, settings.textSize);

function showApiSection() {
  const api = $("mode").value === "api";
  $("api-section").hidden = !api;
  $("test").hidden = !api;
}
showApiSection();
$("mode").onchange = showApiSection;

$("lang").onchange = () => applyStrings($("lang").value, $("size").value);
$("size").onchange = () => applyStrings($("lang").value, $("size").value);

$("settings").onsubmit = async (e) => {
  e.preventDefault();
  await chrome.storage.local.set({
    mode: $("mode").value,
    apiKey: $("api-key").value.trim(),
    lang: $("lang").value,
    textSize: $("size").value,
  });
  $("msg").textContent = S.optSaved;
};

$("test").onclick = async () => {
  $("msg").textContent = S.optTesting;
  try {
    await testKey($("api-key").value.trim());
    $("msg").textContent = S.optTestOk;
  } catch (err) {
    $("msg").textContent =
      err instanceof Anthropic.AuthenticationError ? S.errAuth : `${S.errOther} ${err?.message ?? err}`;
  }
};
