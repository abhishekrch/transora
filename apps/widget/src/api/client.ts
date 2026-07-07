import type { WidgetSettings } from "../types";

interface TranslateBatchResponse {
  translations: string[];
}

export class WidgetApiClient {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl.replace(/\/$/, "");
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      ...options,
      headers: {
        "x-api-key": this.apiKey,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Request failed: ${response.status} ${response.statusText}`
      );
    }

    const json = await response.json() as { success: boolean; data: T };
    return json.data;
  }

  async fetchSettings(): Promise<WidgetSettings> {
    return this.request<WidgetSettings>("/widget");
  }

  async translateBatch(
    texts: string[],
    targetLang: string,
    sourceLang?: string
  ): Promise<string[]> {
    if (texts.length === 0) return [];

    const data = await this.request<TranslateBatchResponse>("/translate/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts, targetLang, sourceLang }),
    });

    return data.translations;
  }
}
