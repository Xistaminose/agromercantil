export interface User {
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_superuser: boolean;
}

export interface Client {
  id: number;
  name: string;
  document: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
  created_by_id: number;
}

export interface Quote {
  id: number;
  quote_number: string;
  product: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  status: string;
  region: string;
  notes: string | null;
  client_id: number;
  created_by_id: number;
  created_at: string;
  updated_at: string | null;
  client?: Client;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

export interface Pagination<T> {
  total: number;
  items: T[];
}

export interface ClientFormData {
  name: string;
  document: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  notes?: string;
  is_active?: boolean;
}

export interface QuoteFormData {
  product: string;
  quantity: number;
  unit_price: number;
  region: string;
  notes?: string;
  status?: string;
  client_id: number;
} 