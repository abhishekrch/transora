export type SwitcherPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export interface Language {
  code: string;
  name: string;
  rtl: boolean;
}

export interface WidgetSettings {
  defaultLanguage: string;
  allowedLanguages: string[];
  switcherPosition: string;
  switcherStyle: string;
  seoHreflang: boolean;
  seoMetaTranslate: boolean;
}

export interface TranslationBlock {
  id: string;
  compiledHtml: string;
  elements: Map<string, HTMLElement>;
  textNodes: Text[];
}

export interface CacheEntry {
  value: string;
  expiry: number;
}

export interface TransoraConfig {
  apiKey: string;
  apiUrl?: string;
}

export const STORAGE_KEYS = {
  PREFERRED_LANG: 'transora_preferred_lang',
  CONFIG_PREFIX: 'transora_config_',
  CACHE_PREFIX: 'transora_cache_',
} as const;

export const WIDGET_DEFAULTS = {
  TTL_MS: 7 * 24 * 60 * 60 * 1000,
  BATCH_SIZE: 100,
  DEBOUNCE_MS: 50,
  DEFAULT_LANGUAGE: 'en',
  DEFAULT_POSITION: 'bottom-right' as const,
} as const;

export const EXCLUDED_TAGS: ReadonlySet<string> = new Set([
  'SCRIPT',
  'STYLE',
  'CODE',
  'PRE',
  'NOSCRIPT',
  'IFRAME',
  'CANVAS',
  'SVG',
  'INPUT',
  'TEXTAREA',
  'SELECT',
  'OPTION',
]);

export const BLOCK_TAGS: ReadonlySet<string> = new Set([
  'P',
  'DIV',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'LI',
  'TD',
  'TH',
  'SECTION',
  'ARTICLE',
  'HEADER',
  'FOOTER',
  'MAIN',
  'ASIDE',
]);

export const META_SELECTORS: readonly string[] = [
  'meta[name="description"]',
  'meta[name="keywords"]',
  'meta[property="og:title"]',
  'meta[property="og:description"]',
  'meta[name="twitter:title"]',
  'meta[name="twitter:description"]',
];
