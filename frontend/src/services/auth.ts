import api from './api';
import { AuthToken, User } from '../types';

export const login = async (email: string, password: string): Promise<AuthToken> => {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);

  const response = await api.post<AuthToken>('/auth/login', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  localStorage.setItem('token', response.data.access_token);
  return response.data;
};

export const register = async (
  email: string,
  password: string,
  fullName: string
): Promise<User> => {
  const response = await api.post<User>('/auth/register', {
    email,
    password,
    full_name: fullName,
  });
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/users/me');
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
}; 