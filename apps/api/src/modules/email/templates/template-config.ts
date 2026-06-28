import type { EmailTemplate } from "@transora/shared";

export const TEMPLATE_CONFIG: Record<
  EmailTemplate,
  { subject: string; file: string }
> = {
  welcome: {
    subject: "Welcome to Transora!",
    file: "welcome.html",
  },
  "password-reset": {
    subject: "Reset Your Password - Transora",
    file: "password-reset.html",
  },
  "api-key-regenerated": {
    subject: "API Key Regenerated - Transora",
    file: "api-key-regenerated.html",
  },
  "usage-alert": {
    subject: "Usage Alert - Transora",
    file: "usage-alert.html",
  },
};
