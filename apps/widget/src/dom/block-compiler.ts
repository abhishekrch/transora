import { type TranslationBlock, BLOCK_TAGS } from "../types";
import { isExcluded } from "./tree-walker";
import { sanitizeHtml } from "../utils/sanitize";

const ORIGINAL_TEXT = Symbol("transora.original");

export const originalTextMap = new WeakMap<Node, string>();
export const originalBlockMap = new WeakMap<HTMLElement, TranslationBlock>();
export const translatedContainers = new Set<HTMLElement>();

const translatingElements = new WeakSet<HTMLElement>();

export function isBlockElement(el: Element): boolean {
  return BLOCK_TAGS.has(el.tagName);
}

export function compileBlock(element: HTMLElement, blockIndex: number): TranslationBlock | null {
  if (isExcluded(element)) return null;

  const elements = new Map<string, HTMLElement>();
  const textNodes: Text[] = [];
  let elementCounter = 0;

  const compileNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue?.trim();
      if (!text) return "";
      textNodes.push(node as Text);

      if (!originalTextMap.has(node)) {
        originalTextMap.set(node, node.nodeValue || "");
      }

      return node.nodeValue || "";
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      
      if (isExcluded(el)) {
        const index = (elementCounter++).toString();
        elements.set(index, el);
        return `<span translate="no" class="transora-excluded" data-id="${index}"></span>`;
      }

      if (isBlockElement(el)) {
        return "";
      }

      const index = (elementCounter++).toString();
      elements.set(index, el);

      let innerHtml = "";
      for (let i = 0; i < el.childNodes.length; i++) {
        innerHtml += compileNode(el.childNodes[i]!);
      }

      return `<span class="transora-el" data-id="${index}">${innerHtml}</span>`;
    }

    return "";
  };

  let compiledHtml = "";
  for (let i = 0; i < element.childNodes.length; i++) {
    compiledHtml += compileNode(element.childNodes[i]!);
  }

  compiledHtml = compiledHtml.trim();
  if (!compiledHtml || textNodes.length === 0) return null;

  return {
    id: `b_${blockIndex}`,
    compiledHtml,
    elements,
    textNodes,
  };
}

export function applyTranslation(
  element: HTMLElement,
  translatedHtml: string,
  block: TranslationBlock
): void {
  if (block.elements.size === 0 && block.textNodes.length === 1) {
    const textNode = block.textNodes[0];
    if (textNode) {
      textNode.nodeValue = translatedHtml;
    }
    return;
  }

  const sanitized = sanitizeHtml(translatedHtml);

  try {
    translatedContainers.add(element);
    if (!originalBlockMap.has(element)) {
      originalBlockMap.set(element, block);
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(`<body>${sanitized}</body>`, "text/html");
    const parsedBody = doc.body;

    if (!parsedBody) return;

    applyDomPatch(element, parsedBody, block.elements);
  } catch (error) {
    console.error("Transora Widget: Failed to parse and apply translation block", error);
  }
}

export function applyDomPatch(
  liveParent: HTMLElement,
  parsedParent: HTMLElement,
  elementsMap: Map<string, HTMLElement>
): void {
  const fragment = document.createDocumentFragment();
  const parsedChildren = Array.from(parsedParent.childNodes);

  for (const parsedChild of parsedChildren) {
    if (parsedChild.nodeType === Node.TEXT_NODE) {
      fragment.appendChild(document.createTextNode(parsedChild.nodeValue || ""));
    } else if (parsedChild.nodeType === Node.ELEMENT_NODE) {
      const parsedElement = parsedChild as HTMLElement;
      
      if (parsedElement.classList.contains("transora-el")) {
        const index = parsedElement.getAttribute("data-id");
        const originalElement = index ? elementsMap.get(index) : undefined;

        if (originalElement) {
          translatingElements.add(originalElement);
          applyDomPatch(originalElement, parsedElement, elementsMap);
          fragment.appendChild(originalElement);
        }
      } else if (parsedElement.classList.contains("transora-excluded")) {
        const index = parsedElement.getAttribute("data-id");
        const originalElement = index ? elementsMap.get(index) : undefined;

        if (originalElement) {
          fragment.appendChild(originalElement);
        }
      } else {
        fragment.appendChild(parsedElement.cloneNode(true));
      }
    }
  }

  while (liveParent.firstChild) {
    liveParent.removeChild(liveParent.firstChild);
  }
  liveParent.appendChild(fragment);
}
