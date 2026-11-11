// A deliberately small Markdown renderer: headings, bold, italics, bullets,
// numbered lists, links. Everything is HTML-escaped first, and only http(s)
// links are turned into <a> tags, so nothing in an answer can run as code.

export function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function inline(raw) {
  let s = escapeHtml(raw);
  const links = [];
  const keep = (html) => `\u0000${links.push(html) - 1}\u0000`;

  // [text](https://...)
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, label, url) =>
    keep(`<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`),
  );
  // bare https://... URLs
  s = s.replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)\]])/g, (url) =>
    keep(`<a href="${url}" target="_blank" rel="noopener noreferrer">${shorten(url)}</a>`),
  );
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => links[Number(i)]);
}

function shorten(url) {
  try {
    const u = new URL(url.replace(/&amp;/g, "&"));
    return escapeHtml(u.hostname.replace(/^www\./, "") + (u.pathname.length > 1 ? "/…" : ""));
  } catch {
    return url;
  }
}

export function renderMarkdown(md) {
  const out = [];
  let list = null; // "ul" | "ol" | null
  const closeList = () => {
    if (list) out.push(`</${list}>`);
    list = null;
  };

  for (const rawLine of md.split("\n")) {
    const line = rawLine.trimEnd();
    let m;
    if (!line.trim()) {
      closeList();
    } else if ((m = line.match(/^#{1,6}\s+(.*)$/))) {
      closeList();
      out.push(`<h3>${inline(m[1])}</h3>`);
    } else if ((m = line.match(/^\s*[-*•]\s+(.*)$/))) {
      if (list !== "ul") { closeList(); out.push("<ul>"); list = "ul"; }
      out.push(`<li>${inline(m[1])}</li>`);
    } else if ((m = line.match(/^\s*\d+[.)]\s+(.*)$/))) {
      if (list !== "ol") { closeList(); out.push("<ol>"); list = "ol"; }
      out.push(`<li>${inline(m[1])}</li>`);
    } else if (/^\s*(---|\*\*\*)\s*$/.test(line)) {
      closeList();
      out.push("<hr>");
    } else {
      closeList();
      out.push(`<p>${inline(line)}</p>`);
    }
  }
  closeList();
  return out.join("\n");
}
