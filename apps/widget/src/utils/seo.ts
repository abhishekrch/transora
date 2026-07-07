import { META_SELECTORS } from "../types";

const originalTitle = new WeakRef<typeof document>(document);
let savedTitle: string | undefined;

const originalMeta = new WeakMap<Element, string>();

export function updateHreflangTags(languages: readonly string[], defaultLang: string): void {
  const head = document.head;

  for (const el of head.querySelectorAll('link[rel="alternate"][data-transora]')) {
    el.remove();
  }

  const baseUrl = new URL(window.location.href);

  for (const lang of languages) {
    const url = new URL(baseUrl.toString());
    url.searchParams.set("lang", lang);

    const link = document.createElement("link");
    link.rel = "alternate";
    link.hreflang = lang;
    link.href = url.toString();
    link.setAttribute("data-transora", "");
    head.appendChild(link);
  }

  const defaultUrl = new URL(baseUrl.toString());
  defaultUrl.searchParams.set("lang", defaultLang);

  const xDefault = document.createElement("link");
  xDefault.rel = "alternate";
  xDefault.hreflang = "x-default";
  xDefault.href = defaultUrl.toString();
  xDefault.setAttribute("data-transora", "");
  head.appendChild(xDefault);
}

export async function translateMetadata(
  translateFn: (text: string) => Promise<string | null>
): Promise<void> {
  if (document.title) {
    if (savedTitle === undefined) {
      savedTitle = document.title;
    }
    const translated = await translateFn(document.title);
    if (translated) {
      document.title = translated;
    }
  }

  for (const selector of META_SELECTORS) {
    const el = document.querySelector(selector);
    if (!el) continue;

    const content = el.getAttribute("content");
    if (!content) continue;

    if (!originalMeta.has(el)) {
      originalMeta.set(el, content);
    }

    const translated = await translateFn(content);
    if (translated) {
      el.setAttribute("content", translated);
    }
  }
}

export function revertMetadata(): void {
  if (savedTitle !== undefined) {
    document.title = savedTitle;
  }

  for (const selector of META_SELECTORS) {
    const el = document.querySelector(selector);
    if (!el) continue;

    const original = originalMeta.get(el);
    if (original !== undefined) {
      el.setAttribute("content", original);
    }
  }
}
