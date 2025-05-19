import api from './api';
import { Quote, QuoteFormData, Pagination } from '../types';

export const getQuotes = async (
  page = 1,
  limit = 10,
  filters?: {
    product?: string;
    region?: string;
    clientId?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }
): Promise<Pagination<Quote>> => {
  const params = {
    skip: (page - 1) * limit,
    limit,
    ...filters,
    client_id: filters?.clientId,
    start_date: filters?.startDate,
    end_date: filters?.endDate,
  };
  
  const response = await api.get<Pagination<Quote>>('/quotes', { params });
  return response.data;
};

export const getQuote = async (id: number): Promise<Quote> => {
  const response = await api.get<Quote>(`/quotes/${id}`);
  return response.data;
};

export const createQuote = async (quoteData: QuoteFormData): Promise<Quote> => {
  const response = await api.post<Quote>('/quotes', quoteData);
  return response.data;
};

export const updateQuote = async (id: number, quoteData: Partial<QuoteFormData>): Promise<Quote> => {
  const response = await api.put<Quote>(`/quotes/${id}`, quoteData);
  return response.data;
};

export const deleteQuote = async (id: number): Promise<Quote> => {
  const response = await api.delete<Quote>(`/quotes/${id}`);
  return response.data;
};

export const getProducts = async (): Promise<string[]> => {
  const response = await api.get<string[]>('/quotes/products');
  return response.data;
};

export const getRegions = async (): Promise<string[]> => {
  const response = await api.get<string[]>('/quotes/regions');
  return response.data;
}; 