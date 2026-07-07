import { EXCLUDED_TAGS } from "../types";

export function isExcluded(node: Node): boolean {
  let element = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;

  while (element) {
    if (EXCLUDED_TAGS.has(element.tagName)) {
      return true;
    }
    if (element.getAttribute("translate") === "no") {
      return true;
    }
    if (element.classList.contains("notranslate")) {
      return true;
    }
    element = element.parentElement;
  }

  return false;
}

export function scanTextNodes(root: HTMLElement = document.body): Text[] {
  const textNodes: Text[] = [];

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      const text = node.nodeValue?.trim();
      if (!text) {
        return NodeFilter.FILTER_REJECT;
      }
      if (isExcluded(node)) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let currentNode = walker.nextNode();
  while (currentNode) {
    textNodes.push(currentNode as Text);
    currentNode = walker.nextNode();
  }

  return textNodes;
}
