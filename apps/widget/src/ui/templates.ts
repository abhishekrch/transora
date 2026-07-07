import type { Language } from "../types";

const CHEVRON_SVG = `<svg class="chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;

const CHECK_SVG = `<svg class="check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;

export function buildSwitcherMarkup(
  activeName: string,
  languages: readonly Language[],
  activeCode: string
): string {
  const options = languages
    .map(
      (lang) =>
        `<div class="option${lang.code === activeCode ? " selected" : ""}" data-code="${lang.code}"><span>${lang.name}</span>${CHECK_SVG}</div>`
    )
    .join("");

  return `<div class="container" id="switcher-container"><div class="trigger" id="switcher-trigger"><span id="active-lang-name">${activeName}</span>${CHEVRON_SVG}</div><div class="dropdown" id="switcher-dropdown">${options}</div></div>`;
}
