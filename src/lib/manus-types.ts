export interface ManusService {
  id: number;
  code: string;
  name: string;
  category: string;
}

export interface ManusCountry {
  id: number;
  smshubId: number;
  name: string;
  code: string;
}

export interface ManusPrice {
  countryId: number;
  countryName: string;
  countryCode: string;
  serviceId: number;
  serviceName: string;
  serviceCode: string;
  serviceCategory: string;
  price: number;
  available: number;
  lastSync: string;
}

export interface ManusActivation {
  id: number;
  smshubActivationId: string;
  phoneNumber: string;
  status: 'waiting' | 'completed' | 'cancelled';
  price: number;
  smsCode?: string | null;
  smsText?: string | null;
  createdAt: string;
  completedAt?: string | null;
}

export interface ManusActivationCreateRequest {
  countryId: number;
  serviceId: number;
  customerId: number;
}

export interface ManusActivationCreateResponse {
  activationId: number;
  phoneNumber: string;
  status: 'waiting' | 'completed' | 'cancelled';
}

export interface ManusCustomer {
  id: number;
  pin: number;
  name: string;
  email: string;
  balance: number;
  active: boolean;
  createdAt: string;
}

export interface ManusApiError {
  error: string;
  message?: string;
  statusCode?: number;
}
