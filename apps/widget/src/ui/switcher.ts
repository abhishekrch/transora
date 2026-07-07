import type { Language, SwitcherPosition } from "../types";
import { getStyles } from "./styles.css";
import { buildSwitcherMarkup } from "./templates";

const SWITCHER_HOST_ID = "transora-language-switcher";

export class LanguageSwitcher {
  private readonly languages: readonly Language[];
  private readonly position: SwitcherPosition;
  private readonly onChange: (code: string) => void;
  private activeCode: string;

  private host: HTMLDivElement | null = null;
  private shadow: ShadowRoot | null = null;
  private container: HTMLElement | null = null;
  private boundCloseHandler: (() => void) | null = null;

  constructor(
    languages: readonly Language[],
    position: SwitcherPosition,
    activeCode: string,
    onChange: (code: string) => void
  ) {
    this.languages = languages;
    this.position = position;
    this.activeCode = activeCode;
    this.onChange = onChange;
  }

  mount(): void {
    if (this.host) return;

    this.host = document.createElement("div");
    this.host.id = SWITCHER_HOST_ID;
    this.shadow = this.host.attachShadow({ mode: "closed" });

    const style = document.createElement("style");
    style.textContent = getStyles(this.position);
    this.shadow.appendChild(style);

    const wrapper = document.createElement("div");
    const activeLang = this.languages.find((l) => l.code === this.activeCode) ?? this.languages[0];
    wrapper.innerHTML = buildSwitcherMarkup(
      activeLang?.name ?? this.activeCode,
      this.languages,
      this.activeCode
    );
    this.shadow.appendChild(wrapper);

    this.container = this.shadow.querySelector("#switcher-container");
    this.bindEvents();
    document.body.appendChild(this.host);
  }

  unmount(): void {
    if (this.boundCloseHandler) {
      document.removeEventListener("click", this.boundCloseHandler);
      this.boundCloseHandler = null;
    }
    this.host?.remove();
    this.host = null;
    this.shadow = null;
    this.container = null;
  }

  updateLanguage(code: string): void {
    this.activeCode = code;
    if (!this.shadow) return;

    const activeLang = this.languages.find((l) => l.code === code);
    const label = this.shadow.querySelector("#active-lang-name");
    if (label && activeLang) {
      label.textContent = activeLang.name;
    }

    for (const opt of this.shadow.querySelectorAll(".option")) {
      opt.classList.toggle("selected", opt.getAttribute("data-code") === code);
    }
  }

  private bindEvents(): void {
    const trigger = this.shadow?.querySelector("#switcher-trigger");
    if (!trigger || !this.container) return;

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      this.container?.classList.toggle("open");
    });

    this.boundCloseHandler = () => this.container?.classList.remove("open");
    document.addEventListener("click", this.boundCloseHandler);

    for (const opt of this.shadow?.querySelectorAll(".option") ?? []) {
      opt.addEventListener("click", (e) => {
        e.stopPropagation();
        const code = opt.getAttribute("data-code");
        if (code && code !== this.activeCode) {
          this.updateLanguage(code);
          this.onChange(code);
        }
        this.container?.classList.remove("open");
      });
    }
  }
}
