// src/i18n.js
var STRINGS = {
  pl: {
    languageName: "Polish",
    menuCheckSelection: "News Clarity: sprawd\u017A zaznaczony tekst",
    menuCheckPage: "News Clarity: sprawd\u017A t\u0119 stron\u0119",
    title: "Wiadomo\u015Bci bez emocji",
    subtitle: "Fakty, twierdzenia i interpretacje \u2014 oddzielnie i spokojnie.",
    checkPage: "Sprawd\u017A ten artyku\u0142",
    orPaste: "\u2026albo wklej wiadomo\u015B\u0107, nag\u0142\xF3wek lub link:",
    pastePlaceholder: "Np. wiadomo\u015B\u0107 z WhatsAppa, Facebooka albo e-maila",
    checkText: "Sprawd\u017A ten tekst",
    followUpPlaceholder: "Zadaj pytanie uzupe\u0142niaj\u0105ce\u2026",
    ask: "Zapytaj",
    newCheck: "Nowe sprawdzenie",
    copy: "Kopiuj odpowied\u017A",
    copied: "Skopiowano \u2713",
    stop: "Zatrzymaj",
    reading: "Czytam stron\u0119\u2026",
    thinking: "Analizuj\u0119\u2026",
    searching: "Szukam \u017Ar\xF3de\u0142",
    fetching: "Czytam \u017Ar\xF3d\u0142o",
    writing: "Pisz\u0119 odpowied\u017A\u2026",
    done: "Gotowe.",
    stopped: "Zatrzymano.",
    checkingSelection: "Sprawdzam zaznaczony fragment z:",
    checkingPage: "Sprawdzam stron\u0119:",
    checkingPasted: "Sprawdzam wklejony tekst.",
    noKey: "Najpierw trzeba wpisa\u0107 klucz API (robi to raz osoba, kt\xF3ra instaluje rozszerzenie).",
    openSettings: "Otw\xF3rz ustawienia",
    emptyPaste: "Wklej najpierw jaki\u015B tekst.",
    cannotRead: "Nie mog\u0119 odczyta\u0107 tej strony (np. strona ustawie\u0144 Chrome albo PDF). Zaznacz tekst i u\u017Cyj prawego przycisku myszy albo wklej go poni\u017Cej.",
    pageTooShort: "Na tej stronie prawie nie ma tekstu. Otw\xF3rz konkretny artyku\u0142 albo wklej tekst poni\u017Cej.",
    errAuth: "Klucz API jest nieprawid\u0142owy lub wygas\u0142. Popro\u015B Ew\u0119 o sprawdzenie ustawie\u0144.",
    errRate: "Za du\u017Co zapyta\u0144 naraz albo wyczerpany limit. Spr\xF3buj ponownie za kilka minut.",
    errConnection: "Brak po\u0142\u0105czenia z internetem albo serwer nie odpowiada. Spr\xF3buj ponownie.",
    errOverloaded: "Serwer jest chwilowo przeci\u0105\u017Cony. Spr\xF3buj ponownie za chwil\u0119.",
    errOther: "Co\u015B posz\u0142o nie tak:",
    refusal: "Model odm\xF3wi\u0142 oceny tego materia\u0142u. Spr\xF3buj wklei\u0107 sam tekst artyku\u0142u.",
    truncated: "Uwaga: tekst by\u0142 bardzo d\u0142ugi, wi\u0119c przekazano tylko jego pocz\u0105tek.",
    footer: "Odpowied\u017A przygotowa\u0142a sztuczna inteligencja. Przy niskiej pewno\u015Bci \u2014 wstrzymaj si\u0119 z udost\u0119pnianiem.",
    // options page
    // chat hand-off (ChatGPT / Grok subscription)
    handoffTitle: "Teraz jeszcze dwa kroki:",
    handoffStep1: "\u2713 {app} otwiera si\u0119 w nowej karcie, a pytanie jest ju\u017C skopiowane.",
    handoffStep2: "Kliknij w pole wiadomo\u015Bci i wklej: Ctrl+V (na Macu: Cmd+V).",
    handoffStep3: "Naci\u015Bnij Enter i poczekaj na odpowied\u017A.",
    handoffNotCopied: "Kliknij przycisk poni\u017Cej, \u017Ceby skopiowa\u0107 tekst i otworzy\u0107 {app}.",
    copyAndOpen: "Skopiuj i otw\xF3rz {app}",
    copyAgain: "Skopiuj jeszcze raz",
    handoffTip: "Je\u015Bli {app} nie szuka w internecie, popro\u015B: \u201ESprawd\u017A to w aktualnych \u017Ar\xF3d\u0142ach\u201D.",
    optModeLabel: "Kt\xF3rego asystenta u\u017Cywa\u0107?",
    optModeChatgpt: "ChatGPT (moja subskrypcja)",
    optModeGrok: "Grok (moja subskrypcja)",
    optModeApi: "Claude przez klucz API (odpowied\u017A w panelu)",
    optModeHelp: "Przy ChatGPT i Groku rozszerzenie przygotowuje pytanie i otwiera stron\u0119 asystenta; wystarczy wklei\u0107 i nacisn\u0105\u0107 Enter. Nic nie kosztuje poza subskrypcj\u0105.",
    optTitle: "News Clarity \u2014 ustawienia",
    optKeyLabel: "Klucz API Anthropic",
    optKeyHelp: "Zaczyna si\u0119 od \u201Esk-ant-\u201D. Zapisany tylko na tym komputerze.",
    optLangLabel: "J\u0119zyk odpowiedzi",
    optSizeLabel: "Wielko\u015B\u0107 tekstu",
    optSizeNormal: "Normalny",
    optSizeLarge: "Du\u017Cy",
    optSizeXL: "Bardzo du\u017Cy",
    optSave: "Zapisz",
    optSaved: "Zapisano \u2713",
    optTest: "Sprawd\u017A klucz",
    optTesting: "Sprawdzam\u2026",
    optTestOk: "Klucz dzia\u0142a \u2713"
  },
  en: {
    languageName: "English",
    menuCheckSelection: "News Clarity: check selected text",
    menuCheckPage: "News Clarity: check this page",
    title: "News without the noise",
    subtitle: "Facts, claims and interpretations \u2014 kept apart, calmly.",
    checkPage: "Check this article",
    orPaste: "\u2026or paste a message, headline or link:",
    pastePlaceholder: "E.g. a forwarded WhatsApp, Facebook or email message",
    checkText: "Check this text",
    followUpPlaceholder: "Ask a follow-up question\u2026",
    ask: "Ask",
    newCheck: "New check",
    copy: "Copy answer",
    copied: "Copied \u2713",
    stop: "Stop",
    reading: "Reading the page\u2026",
    thinking: "Analysing\u2026",
    searching: "Searching for sources",
    fetching: "Reading a source",
    writing: "Writing the answer\u2026",
    done: "Done.",
    stopped: "Stopped.",
    checkingSelection: "Checking the selected passage from:",
    checkingPage: "Checking the page:",
    checkingPasted: "Checking the pasted text.",
    noKey: "An API key needs to be entered first (done once by whoever installs the extension).",
    openSettings: "Open settings",
    emptyPaste: "Paste some text first.",
    cannotRead: "I can't read this page (e.g. a Chrome settings page or a PDF). Select the text and right-click, or paste it below.",
    pageTooShort: "There's hardly any text on this page. Open a specific article, or paste the text below.",
    errAuth: "The API key is invalid or has expired. Check the settings.",
    errRate: "Too many requests or the spending limit was reached. Try again in a few minutes.",
    errConnection: "No internet connection, or the server isn't answering. Try again.",
    errOverloaded: "The server is busy right now. Try again shortly.",
    errOther: "Something went wrong:",
    refusal: "The model declined to assess this material. Try pasting just the article text.",
    truncated: "Note: the text was very long, so only its beginning was sent.",
    footer: "Written by AI. When confidence is low, wait before sharing.",
    handoffTitle: "Now just two steps:",
    handoffStep1: "\u2713 {app} is opening in a new tab, and the question is already copied.",
    handoffStep2: "Click in the message box and paste: Ctrl+V (Mac: Cmd+V).",
    handoffStep3: "Press Enter and wait for the answer.",
    handoffNotCopied: "Click the button below to copy the text and open {app}.",
    copyAndOpen: "Copy and open {app}",
    copyAgain: "Copy again",
    handoffTip: "If {app} doesn't search the web, ask it: \u201CCheck this against current sources.\u201D",
    optModeLabel: "Which assistant should it use?",
    optModeChatgpt: "ChatGPT (my subscription)",
    optModeGrok: "Grok (my subscription)",
    optModeApi: "Claude via API key (answer in the panel)",
    optModeHelp: "With ChatGPT and Grok the extension prepares the question and opens the assistant's site; just paste and press Enter. No cost beyond the subscription.",
    optTitle: "News Clarity \u2014 settings",
    optKeyLabel: "Anthropic API key",
    optKeyHelp: "Starts with \u201Csk-ant-\u201D. Stored only on this computer.",
    optLangLabel: "Answer language",
    optSizeLabel: "Text size",
    optSizeNormal: "Normal",
    optSizeLarge: "Large",
    optSizeXL: "Extra large",
    optSave: "Save",
    optSaved: "Saved \u2713",
    optTest: "Test key",
    optTesting: "Testing\u2026",
    optTestOk: "Key works \u2713"
  }
};
var DEFAULT_SETTINGS = { mode: "chatgpt", apiKey: "", lang: "pl", textSize: "large" };
async function loadSettings() {
  const stored = await chrome.storage.local.get(DEFAULT_SETTINGS);
  return { ...DEFAULT_SETTINGS, ...stored };
}
function t(lang) {
  return STRINGS[lang] ?? STRINGS.pl;
}

// src/background.js
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(console.error);
async function buildMenus() {
  const S = t((await loadSettings()).lang);
  await chrome.contextMenus.removeAll();
  chrome.contextMenus.create({ id: "check-selection", title: S.menuCheckSelection, contexts: ["selection"] });
  chrome.contextMenus.create({ id: "check-page", title: S.menuCheckPage, contexts: ["page"] });
}
chrome.runtime.onInstalled.addListener((details) => {
  buildMenus();
  if (details.reason === "install") chrome.runtime.openOptionsPage();
});
chrome.runtime.onStartup.addListener(buildMenus);
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.lang) buildMenus();
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.sidePanel.open({ tabId: tab.id }).catch(console.error);
  const pending = info.menuItemId === "check-selection" ? { kind: "selection", text: info.selectionText ?? "", title: tab.title, url: tab.url, at: Date.now() } : { kind: "page-request", at: Date.now() };
  chrome.storage.session.set({ pending });
});
