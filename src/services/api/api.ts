export abstract class BaseApi {
  abstract get(path: string, options?: any): Promise<any>;
}

export class Api {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get(
    path: string,
    { timeout = 10000, revalidate = 3600, cache = false } = {
      timeout: 10000,
      revalidate: 3600,
      cache: false,
    }
  ): Promise<any> {
    const url = `${this.baseUrl}${path}`;
    const controller = new AbortController();
    const abortTimeout = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        mode: "cors",
        cache: cache ? undefined : "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new Error("Request timed out");
      }
      throw error;
    } finally {
      clearTimeout(abortTimeout);
    }
  }
}
