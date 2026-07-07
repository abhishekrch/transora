import { type TranslationBlock, WIDGET_DEFAULTS } from "../types";
import { isBlockElement, compileBlock } from "./block-compiler";
import { isExcluded, scanTextNodes } from "./tree-walker";

const SWITCHER_ID = "transora-language-switcher";

export class DomObserver {
  private observer: MutationObserver | null = null;
  private readonly onNewBlocks: (blocks: TranslationBlock[]) => void;
  private isProcessing = false;
  private debounceTimeout: number | null = null;
  private pendingNodes: Set<Node> = new Set();
  private blockCounter = 0;
  private switcherElement: HTMLElement | null = null;

  constructor(onNewBlocks: (blocks: TranslationBlock[]) => void) {
    this.onNewBlocks = onNewBlocks;
  }

  start(): void {
    if (this.observer) return;

    this.observer = new MutationObserver((mutations) => {
      if (this.isProcessing) return;

      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (!this.switcherElement) {
              this.switcherElement = document.getElementById(SWITCHER_ID);
            }
            if (this.switcherElement && (node === this.switcherElement || this.switcherElement.contains(node))) {
              return;
            }
            this.pendingNodes.add(node);
          });
        }

        if (mutation.type === "characterData") {
          const parent = mutation.target.parentElement;
          if (parent) {
            this.pendingNodes.add(parent);
          }
        }
      }

      this.scheduleProcessing();
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  stop(): void {
    if (!this.observer) return;
    this.observer.disconnect();
    this.observer = null;
  }

  runPaused(callback: () => void): void {
    const wasProcessing = this.isProcessing;
    this.isProcessing = true;
    try {
      callback();
    } finally {
      this.isProcessing = wasProcessing;
    }
  }

  private scheduleProcessing(): void {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = window.setTimeout(() => {
      this.processPendingNodes();
    }, WIDGET_DEFAULTS.DEBOUNCE_MS);
  }

  private processPendingNodes(): void {
    if (this.pendingNodes.size === 0) return;

    const nodesToProcess = Array.from(this.pendingNodes);
    this.pendingNodes.clear();

    const textNodes: Text[] = [];
    for (const node of nodesToProcess) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (!isExcluded(node as HTMLElement)) {
          textNodes.push(...scanTextNodes(node as HTMLElement));
        }
      } else if (node.nodeType === Node.TEXT_NODE) {
        const parent = node.parentElement;
        if (parent && !isExcluded(parent)) {
          const text = node.nodeValue?.trim();
          if (text) textNodes.push(node as Text);
        }
      }
    }

    if (textNodes.length === 0) return;

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

    for (const [parent] of parentMap) {
      let container = parent;
      while (container.parentElement && !isBlockElement(container)) {
        container = container.parentElement;
      }

      if (compiled.has(container)) continue;
      compiled.add(container);

      const block = compileBlock(container, this.blockCounter++);
      if (block) blocks.push(block);
    }

    if (blocks.length > 0) {
      this.onNewBlocks(blocks);
    }
  }
}
