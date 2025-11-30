import type {
  ManusService,
  ManusCountry,
  ManusPrice,
  ManusActivation,
  ManusActivationCreateRequest,
  ManusActivationCreateResponse,
  ManusCustomer,
  ManusApiError,
} from './manus-types';

const API_URL = import.meta.env.VITE_MANUS_API_URL;
const API_KEY = import.meta.env.VITE_MANUS_API_KEY;

if (!API_URL || !API_KEY) {
  console.error('Missing Manus API configuration. Please add VITE_MANUS_API_URL and VITE_MANUS_API_KEY to your .env file');
}

class ManusApiClient {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000;

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_URL}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
      ...options.headers,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData: ManusApiError = await response.json().catch(() => ({
          error: 'Unknown error',
          statusCode: response.status,
        }));

        throw new Error(
          errorData.message || errorData.error || `API Error: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - please try again');
        }
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  }

  private getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data as T;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async getServices(): Promise<ManusService[]> {
    const cacheKey = 'services';
    const cached = this.getCached<ManusService[]>(cacheKey);
    if (cached) return cached;

    const services = await this.request<ManusService[]>('/services');
    this.setCache(cacheKey, services);
    return services;
  }

  async getCountries(): Promise<ManusCountry[]> {
    const cacheKey = 'countries';
    const cached = this.getCached<ManusCountry[]>(cacheKey);
    if (cached) return cached;

    const countries = await this.request<ManusCountry[]>('/countries');
    this.setCache(cacheKey, countries);
    return countries;
  }

  async getPrice(countryId: number, serviceId: number): Promise<ManusPrice | null> {
    const cacheKey = `price_${countryId}_${serviceId}`;
    const cached = this.getCached<ManusPrice>(cacheKey);
    if (cached) return cached;

    const prices = await this.request<ManusPrice[]>(
      `/prices?countryId=${countryId}&serviceId=${serviceId}`
    );

    const price = prices.length > 0 ? prices[0] : null;
    if (price) {
      this.setCache(cacheKey, price);
    }
    return price;
  }

  async createActivation(
    data: ManusActivationCreateRequest
  ): Promise<ManusActivationCreateResponse> {
    return await this.request<ManusActivationCreateResponse>('/activations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getActivationStatus(activationId: number): Promise<ManusActivation> {
    return await this.request<ManusActivation>(`/activations/${activationId}`);
  }

  async cancelActivation(activationId: number): Promise<{ success: boolean }> {
    return await this.request<{ success: boolean }>(
      `/activations/${activationId}/cancel`,
      {
        method: 'POST',
      }
    );
  }

  async getCustomerByEmail(email: string): Promise<ManusCustomer> {
    return await this.request<ManusCustomer>(`/customers/by-email?email=${encodeURIComponent(email)}`);
  }

  async createCustomer(email: string, name?: string): Promise<ManusCustomer> {
    const body: any = { email };
    if (name) body.name = name;

    return await this.request<ManusCustomer>('/customers', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async getCustomerByPin(pin: number): Promise<ManusCustomer> {
    return await this.request<ManusCustomer>(`/customers/by-pin?pin=${pin}`);
  }

  async getCustomerById(id: string): Promise<ManusCustomer> {
    return await this.request<ManusCustomer>(`/customers/${id}`);
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const manusApi = new ManusApiClient();
