import api from './api';
import { Client, ClientFormData, Pagination } from '../types';

export const getClients = async (
  page = 1,
  limit = 10,
  search?: string,
  state?: string
): Promise<Pagination<Client>> => {
  const params = {
    skip: (page - 1) * limit,
    limit,
    search,
    state,
  };
  
  const response = await api.get<Pagination<Client>>('/clients', { params });
  return response.data;
};

export const getClient = async (id: number): Promise<Client> => {
  const response = await api.get<Client>(`/clients/${id}`);
  return response.data;
};

export const createClient = async (clientData: ClientFormData): Promise<Client> => {
  const response = await api.post<Client>('/clients', clientData);
  return response.data;
};

export const updateClient = async (id: number, clientData: Partial<ClientFormData>): Promise<Client> => {
  const response = await api.put<Client>(`/clients/${id}`, clientData);
  return response.data;
};

export const deleteClient = async (id: number): Promise<Client> => {
  const response = await api.delete<Client>(`/clients/${id}`);
  return response.data;
};

export const getStates = async (): Promise<string[]> => {
  const response = await api.get<string[]>('/clients/states');
  return response.data;
}; 