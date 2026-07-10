const ALLOWED_TAGS = new Set([
  "SPAN",
  "B", "STRONG", "I", "EM", "U", "S", "SUB", "SUP",
  "A", "BR", "MARK", "SMALL", "ABBR", "CITE", "Q",
  "CODE", "KBD", "VAR", "RUBY", "RT", "RP",
  "BDO", "BDI", "WBR",
]);

const ALLOWED_ATTRS = new Set([
  "class", "data-id", "translate",
  "href", "title", "lang", "dir",
]);

const SAFE_URI_SCHEMES = /^(https?:\/\/|mailto:|tel:|#|\/)/i;

function sanitizeNode(node: Node, parentFragment: DocumentFragment | HTMLElement): void {
  const children = Array.from(node.childNodes);

  for (const child of children) {
    if (child.nodeType === Node.TEXT_NODE) {
      parentFragment.appendChild(document.createTextNode(child.nodeValue || ""));
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as HTMLElement;
      const tagName = el.tagName;

      if (!ALLOWED_TAGS.has(tagName)) {
        sanitizeNode(el, parentFragment);
        continue;
      }

      const cleanEl = document.createElement(tagName);

      for (const attr of Array.from(el.attributes)) {
        const name = attr.name.toLowerCase();

        if (name.startsWith("on")) continue;

        if (name === "style") continue;

        if (!ALLOWED_ATTRS.has(name)) continue;

        if (name === "href") {
          const value = attr.value.trim();
          if (!SAFE_URI_SCHEMES.test(value)) continue;
        }

        cleanEl.setAttribute(name, attr.value);
      }

      sanitizeNode(el, cleanEl);
      parentFragment.appendChild(cleanEl);
    }
  }
}

export function sanitizeHtml(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<body>${html}</body>`, "text/html");
  const body = doc.body;

  if (!body) return "";

  const fragment = document.createDocumentFragment();
  sanitizeNode(body, fragment);

  const container = document.createElement("div");
  container.appendChild(fragment);
  return container.innerHTML;
}
