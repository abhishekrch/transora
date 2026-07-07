import type { TranslationBlock, Language, SwitcherPosition, WidgetSettings } from "./types";
import { STORAGE_KEYS, WIDGET_DEFAULTS, BLOCK_TAGS } from "./types";
import { SUPPORTED_LANGUAGES } from "./constants/languages";
import { WidgetApiClient } from "./api/client";
import { WidgetCache } from "./api/cache";
import { scanTextNodes } from "./dom/tree-walker";
import { compileBlock, applyTranslation, originalTextMap, originalBlockMap, translatedContainers, applyDomPatch } from "./dom/block-compiler";
import { DomObserver } from "./dom/observer";
import { LanguageSwitcher } from "./ui/switcher";
import { updateHreflangTags, translateMetadata, revertMetadata } from "./utils/seo";

declare global {
  interface Window {
    Transora?: {
      setLanguage: (code: string) => Promise<void>;
      getCurrentLanguage: () => string;
      getAvailableLanguages: () => string[];
    };
  }
}

class TransoraWidget {
  private readonly client: WidgetApiClient;
  private readonly cache: WidgetCache;
  private observer: DomObserver | null = null;
  private switcher: LanguageSwitcher | null = null;

  private defaultLanguage: string = WIDGET_DEFAULTS.DEFAULT_LANGUAGE;
  private allowedLanguages: string[] = [WIDGET_DEFAULTS.DEFAULT_LANGUAGE];
  private currentLanguage: string = WIDGET_DEFAULTS.DEFAULT_LANGUAGE;
  private translating = false;

  constructor(apiKey: string, apiUrl: string) {
    this.client = new WidgetApiClient(apiUrl, apiKey);
    this.cache = new WidgetCache(apiKey);
  }

  public setLanguage(code: string): Promise<void> {
    return this.switchLanguage(code);
  }

  public getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  public getAvailableLanguages(): string[] {
    return this.allowedLanguages;
  }

  async init(): Promise<void> {
    try {
      const config = await this.fetchConfig();

      this.defaultLanguage = config.defaultLanguage;
      this.allowedLanguages = config.allowedLanguages;
      this.currentLanguage = this.resolveInitialLanguage();

      this.mountSwitcher(config.switcherPosition as SwitcherPosition);
      this.startObserver();

      if (this.currentLanguage !== this.defaultLanguage) {
        await this.translatePage(this.currentLanguage);
      }

      if (config.seoHreflang) {
        updateHreflangTags(this.allowedLanguages, this.defaultLanguage);
      }

      if (config.seoMetaTranslate && this.currentLanguage !== this.defaultLanguage) {
        await translateMetadata((text) => this.translateSingle(text, this.currentLanguage));
      }
    } catch (error) {
      console.error("[Transora] Initialization failed:", error);
    }
  }

  private resolveInitialLanguage(): string {
    const queryLang = new URLSearchParams(window.location.search).get("lang");
    const storedLang = localStorage.getItem(STORAGE_KEYS.PREFERRED_LANG);
    const preferred = queryLang ?? storedLang ?? this.defaultLanguage;

    return this.allowedLanguages.includes(preferred) ? preferred : this.defaultLanguage;
  }

  private async fetchConfig(): Promise<WidgetSettings> {
    const key = `${STORAGE_KEYS.CONFIG_PREFIX}${this.client["apiKey"]}`;
    const cached = sessionStorage.getItem(key);

    if (cached) {
      try {
        const parsed = JSON.parse(cached) as WidgetSettings;
        if (!parsed || !Array.isArray(parsed.allowedLanguages)) throw new Error("Invalid cache shape");
        return parsed;
      } catch {
        sessionStorage.removeItem(key);
      }
    }

    const config = await this.client.fetchSettings();
    sessionStorage.setItem(key, JSON.stringify(config));
    return config;
  }

  private mountSwitcher(position: SwitcherPosition): void {
    const languages: Language[] = SUPPORTED_LANGUAGES.filter((lang) =>
      this.allowedLanguages.includes(lang.code)
    );

    this.switcher = new LanguageSwitcher(
      languages,
      position,
      this.currentLanguage,
      (code) => this.switchLanguage(code)
    );
    this.switcher.mount();
  }

  private startObserver(): void {
    this.observer = new DomObserver((blocks) => {
      if (this.currentLanguage !== this.defaultLanguage) {
        this.translateBlocks(blocks, this.currentLanguage);
      }
    });
    this.observer.start();
  }

  private async switchLanguage(code: string): Promise<void> {
    if (this.translating || code === this.currentLanguage) return;
    this.translating = true;

    try {
      localStorage.setItem(STORAGE_KEYS.PREFERRED_LANG, code);
      this.currentLanguage = code;

      if (code === this.defaultLanguage) {
        this.observer?.runPaused(() => this.revertPage());
      } else {
        await this.translatePage(code);
      }

      this.switcher?.updateLanguage(code);
    } catch (error) {
      console.error(`[Transora] Language switch to "${code}" failed:`, error);
    } finally {
      this.translating = false;
    }
  }

  private async translatePage(targetLang: string): Promise<void> {
    const textNodes = scanTextNodes(document.body);

    const parentMap = new Map<HTMLElement, Text[]>();
    for (const node of textNodes) {
      const parent = node.parentElement;
      if (!parent) continue;

      const existing = parentMap.get(parent);
      if (existing) {
        existing.push(node);
      } else {
        parentMap.set(parent, [node]);
      }
    }

    const blocks: TranslationBlock[] = [];
    const compiled = new Set<HTMLElement>();
    let counter = 0;

    for (const [parent] of parentMap) {
      let container = parent;
      while (container.parentElement && !BLOCK_TAGS.has(container.tagName)) {
        container = container.parentElement;
      }

      if (compiled.has(container)) continue;
      compiled.add(container);

      const block = compileBlock(container, counter++);
      if (block) blocks.push(block);
    }

    await this.translateBlocks(blocks, targetLang);
  }

  private async translateBlocks(blocks: TranslationBlock[], targetLang: string): Promise<void> {
    if (blocks.length === 0) return;

    const hits: { block: TranslationBlock; translation: string }[] = [];
    const misses: TranslationBlock[] = [];

    for (const block of blocks) {
      const cached = this.cache.get(block.compiledHtml, targetLang);
      if (cached) {
        hits.push({ block, translation: cached });
      } else {
        misses.push(block);
      }
    }

    if (hits.length > 0) {
      this.observer?.runPaused(() => {
        for (const { block, translation } of hits) {
          const parent = block.textNodes[0]?.parentElement;
          if (parent) applyTranslation(parent, translation, block);
        }
      });
    }

    for (let i = 0; i < misses.length; i += WIDGET_DEFAULTS.BATCH_SIZE) {
      const batch = misses.slice(i, i + WIDGET_DEFAULTS.BATCH_SIZE);
      const texts = batch.map((b) => b.compiledHtml);

      try {
        const translations = await this.client.translateBatch(texts, targetLang, this.defaultLanguage);

        this.observer?.runPaused(() => {
          for (let j = 0; j < batch.length; j++) {
            const block = batch[j]!;
            const translation = translations[j];
            if (!translation) continue;

            this.cache.set(block.compiledHtml, targetLang, translation);

            const parent = block.textNodes[0]?.parentElement;
            if (parent) applyTranslation(parent, translation, block);
          }
        });
      } catch (error) {
        console.error("[Transora] Batch translation failed:", error);
      }
    }
  }

  private async translateSingle(text: string, targetLang: string): Promise<string | null> {
    const cached = this.cache.get(text, targetLang);
    if (cached) return cached;

    try {
      const [result] = await this.client.translateBatch([text], targetLang, this.defaultLanguage);
      if (result) {
        this.cache.set(text, targetLang, result);
      }
      return result ?? null;
    } catch {
      return null;
    }
  }

  private revertPage(): void {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();

    while (node) {
      const original = originalTextMap.get(node);
      if (original !== undefined) {
        node.nodeValue = original;
      }
      node = walker.nextNode();
    }

    const containers = Array.from(translatedContainers);
    for (const element of containers) {
      if (!document.body.contains(element)) {
        translatedContainers.delete(element);
        continue;
      }
      const block = originalBlockMap.get(element);
      if (block) {
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(`<body>${block.compiledHtml}</body>`, "text/html");
          if (doc.body) {
            applyDomPatch(element, doc.body, block.elements);
          }
        } catch (e) {}
        translatedContainers.delete(element);
      }
    }

    revertMetadata();
  }
}

(function bootstrap() {
  const script = document.currentScript ?? document.querySelector("script[data-api-key]");
  if (!script) {
    console.error("[Transora] Missing script element with data-api-key.");
    return;
  }

  const apiKey = script.getAttribute("data-api-key");
  if (!apiKey) {
    console.error("[Transora] data-api-key attribute is required.");
    return;
  }

  const apiUrl = resolveApiUrl(script);
  const widget = new TransoraWidget(apiKey, apiUrl);

  window.Transora = {
    setLanguage: (code: string) => widget.setLanguage(code),
    getCurrentLanguage: () => widget.getCurrentLanguage(),
    getAvailableLanguages: () => widget.getAvailableLanguages(),
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => widget.init(), { once: true });
  } else {
    widget.init();
  }
})();

function resolveApiUrl(script: Element): string {
  const explicit = script.getAttribute("data-api-url");
  if (explicit) return explicit;

  const src = script.getAttribute("src");
  if (src) {
    try {
      const origin = new URL(src, window.location.origin).origin;
      return origin;
    } catch {
    }
  }

  return window.location.origin;
}
