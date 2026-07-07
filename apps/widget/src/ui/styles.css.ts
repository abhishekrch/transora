import type { SwitcherPosition } from "../types";

export function getStyles(position: SwitcherPosition): string {
  const isBottom = position.startsWith("bottom");
  const isRight = position.endsWith("right");

  return `
    :host {
      --tw-primary: #2C5EF5;
      --tw-font: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      --tw-ease: cubic-bezier(0.4, 0, 0.2, 1);

      position: fixed;
      ${isBottom ? "bottom: 20px;" : "top: 20px;"}
      ${isRight ? "right: 20px;" : "left: 20px;"}
      z-index: 2147483647;
      font-family: var(--tw-font);
      user-select: none;
    }

    .container {
      position: relative;
    }

    .trigger {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: rgba(255, 255, 255, 0.85);
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 9999px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.02);
      backdrop-filter: blur(12px);
      cursor: pointer;
      color: #0F1419;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s var(--tw-ease);
    }

    .trigger:hover {
      border-color: rgba(0, 0, 0, 0.15);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
      transform: translateY(-1px);
    }

    .trigger:active {
      transform: translateY(0);
    }

    .chevron {
      width: 14px;
      height: 14px;
      opacity: 0.5;
      transition: transform 0.2s var(--tw-ease);
    }

    .container.open .chevron {
      transform: rotate(180deg);
    }

    .dropdown {
      position: absolute;
      ${isBottom ? "bottom: calc(100% + 8px);" : "top: calc(100% + 8px);"}
      ${isRight ? "right: 0;" : "left: 0;"}
      min-width: 160px;
      max-height: 320px;
      overflow-y: auto;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.02);
      backdrop-filter: blur(16px);
      opacity: 0;
      visibility: hidden;
      transform: scale(0.95) translateY(${isBottom ? "8px" : "-8px"});
      transform-origin: ${isBottom ? "bottom" : "top"} ${isRight ? "right" : "left"};
      transition: opacity 0.2s var(--tw-ease), visibility 0.2s var(--tw-ease), transform 0.2s var(--tw-ease);
      padding: 6px;
    }

    .container.open .dropdown {
      opacity: 1;
      visibility: visible;
      transform: scale(1) translateY(0);
    }

    .option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      font-size: 13.5px;
      color: #4A5568;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.15s var(--tw-ease), color 0.15s var(--tw-ease);
    }

    .option:hover {
      background: rgba(44, 94, 245, 0.08);
      color: var(--tw-primary);
    }

    .option.selected {
      background: rgba(44, 94, 245, 0.12);
      color: var(--tw-primary);
    }

    .check-icon {
      width: 14px;
      height: 14px;
      color: var(--tw-primary);
      display: none;
    }

    .option.selected .check-icon {
      display: block;
    }

    @media (prefers-color-scheme: dark) {
      .trigger {
        background: rgba(26, 32, 44, 0.85);
        border-color: rgba(255, 255, 255, 0.08);
        color: #F1F3F5;
      }
      .trigger:hover {
        border-color: rgba(255, 255, 255, 0.15);
      }
      .dropdown {
        background: rgba(26, 32, 44, 0.95);
        border-color: rgba(255, 255, 255, 0.08);
      }
      .option {
        color: #A0AEC0;
      }
      .option:hover {
        background: rgba(59, 130, 246, 0.15);
        color: #3B82F6;
      }
      .option.selected {
        background: rgba(59, 130, 246, 0.2);
        color: #3B82F6;
      }
      .check-icon {
        color: #3B82F6;
      }
    }
  `;
}
