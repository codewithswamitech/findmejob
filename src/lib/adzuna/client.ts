export interface AdzunaConfig {
  appId: string;
  appKey: string;
  country: string;
  baseUrl?: string;
}

export interface AdzunaSearchParams {
  query?: string;
  location?: string;
  page?: number;
  resultsPerPage?: number;
  sortBy?: "date" | "relevance" | "salary";
  category?: string;
  salaryMin?: number;
  salaryMax?: number;
  fullTime?: boolean;
  partTime?: boolean;
  contract?: boolean;
  permanent?: boolean;
  maxDaysOld?: number;
}

export interface AdzunaRawJob {
  id: string;
  title: string;
  description: string;
  created: string;
  company: {
    display_name: string;
  };
  location: {
    display_name: string;
    area?: string[];
  };
  latitude?: number;
  longitude?: number;
  category?: {
    tag: string;
    label: string;
  };
  salary_min?: number;
  salary_max?: number;
  salary_is_predicted?: string;
  contract_type?: string;
  contract_time?: string;
  redirect_url: string;
}

export interface AdzunaSearchResponse {
  count: number;
  results: AdzunaRawJob[];
  mean?: number;
  __CLASS__?: string;
}

export class AdzunaClient {
  private config: Required<AdzunaConfig>;
  private retryAttempts = 3;
  private retryDelay = 1000;

  constructor(config: AdzunaConfig) {
    this.config = {
      ...config,
      baseUrl: config.baseUrl ?? "https://api.adzuna.com",
    };
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async fetchWithRetry<T>(
    url: string,
    options?: RequestInit,
    attempt = 1
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      if (!response.ok) {
        if (response.status === 429 && attempt <= this.retryAttempts) {
          const backoffDelay = this.retryDelay * Math.pow(2, attempt - 1);
          await this.sleep(backoffDelay);
          return this.fetchWithRetry<T>(url, options, attempt + 1);
        }

        throw new Error(
          `Adzuna API error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      if (attempt <= this.retryAttempts) {
        const backoffDelay = this.retryDelay * Math.pow(2, attempt - 1);
        await this.sleep(backoffDelay);
        return this.fetchWithRetry<T>(url, options, attempt + 1);
      }

      throw error;
    }
  }

  async search(params: AdzunaSearchParams): Promise<AdzunaSearchResponse> {
    const {
      query = "",
      location = "",
      page = 1,
      resultsPerPage = 10,
      sortBy = "relevance",
      category,
      salaryMin,
      salaryMax,
      fullTime,
      partTime,
      contract,
      permanent,
      maxDaysOld,
    } = params;

    const searchParams = new URLSearchParams({
      app_id: this.config.appId,
      app_key: this.config.appKey,
      results_per_page: resultsPerPage.toString(),
      what: query,
      where: location,
      sort_by: sortBy,
    });

    if (category) searchParams.set("category", category);
    if (salaryMin) searchParams.set("salary_min", salaryMin.toString());
    if (salaryMax) searchParams.set("salary_max", salaryMax.toString());
    if (fullTime !== undefined)
      searchParams.set("full_time", fullTime ? "1" : "0");
    if (partTime !== undefined)
      searchParams.set("part_time", partTime ? "1" : "0");
    if (contract !== undefined)
      searchParams.set("contract", contract ? "1" : "0");
    if (permanent !== undefined)
      searchParams.set("permanent", permanent ? "1" : "0");
    if (maxDaysOld) searchParams.set("max_days_old", maxDaysOld.toString());

    const url = `${this.config.baseUrl}/v1/api/jobs/${this.config.country}/search/${page}?${searchParams.toString()}`;

    return this.fetchWithRetry<AdzunaSearchResponse>(url);
  }
}

export function createAdzunaClient(
  config?: Partial<AdzunaConfig>
): AdzunaClient {
  return new AdzunaClient({
    appId: config?.appId ?? process.env.ADZUNA_APP_ID ?? "",
    appKey: config?.appKey ?? process.env.ADZUNA_APP_KEY ?? "",
    country: config?.country ?? process.env.ADZUNA_COUNTRY ?? "us",
    baseUrl: config?.baseUrl,
  });
}
