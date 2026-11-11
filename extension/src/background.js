// Service worker: opens the side panel and adds the right-click menu.
import { loadSettings, t } from "./i18n.js";

// Clicking the toolbar icon opens the side panel.
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(console.error);

async function buildMenus() {
  const S = t((await loadSettings()).lang);
  await chrome.contextMenus.removeAll();
  chrome.contextMenus.create({ id: "check-selection", title: S.menuCheckSelection, contexts: ["selection"] });
  chrome.contextMenus.create({ id: "check-page", title: S.menuCheckPage, contexts: ["page"] });
}

chrome.runtime.onInstalled.addListener((details) => {
  buildMenus();
  // First install: open settings so the key can be entered straight away.
  if (details.reason === "install") chrome.runtime.openOptionsPage();
});
chrome.runtime.onStartup.addListener(buildMenus);
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.lang) buildMenus();
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  // sidePanel.open must be called straight away, while Chrome still counts
  // this as the user's click; the panel then picks up the pending item.
  chrome.sidePanel.open({ tabId: tab.id }).catch(console.error);
  const pending =
    info.menuItemId === "check-selection"
      ? { kind: "selection", text: info.selectionText ?? "", title: tab.title, url: tab.url, at: Date.now() }
      : { kind: "page-request", at: Date.now() };
  chrome.storage.session.set({ pending });
});
