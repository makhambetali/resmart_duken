// api.ts
import { Supply, AddSupplyForm, CashFlowOperation } from '@/types/supply';
import { Client, ClientDebt, AddClientForm, ClientsResponse } from '@/types/client';
import { CreateSupplierData, Supplier, SuppliersResponse } from '@/types/suppliers';
import { Employee } from '@/types/employees';

// Типы для аутентификации
export interface User {
  id: number;
  username: string;
  email: string;
  profile: {
    role: 'admin' | 'employee';
    created_at: string;
  };
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email?: string;
  password: string;
  password2: string;
}
// Типы для лидов (заявок с лендинга)
export interface LeadData {
  name: string;
  phone_number: string;
  comment?: string;
}

export interface LeadResponse {
  id: number;
  name: string;
  phone_number: string;
  comment: string;
  created_at: string;
  // status: 'new' | 'contacted' | 'converted' | 'rejected';
}

// Укажите ваш IP-адрес или домен
const API_BASE_URL =  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
console.log(API_BASE_URL)

class ApiError extends Error {
  status: number;
  body: any;
  
  constructor(message: string, status: number, body: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

// Функция для обновления токена
let refreshPromise: Promise<{ access: string }> | null = null;

const refreshAccessToken = async (): Promise<{ access: string }> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access);
      return data;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// Общая функция для запросов с обработкой 401 ошибок
const apiRequest = async <T>(endpoint: string, options: RequestInit = {}, retry = true): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Получаем текущий токен
  const token = localStorage.getItem('access_token');
  
  const headers: HeadersInit = {
    ...(options.headers || {}),
  };

  // Добавляем токен, если он есть
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Если это не FormData и не указан Content-Type, добавляем JSON
  const isFormData = options.body instanceof FormData;
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Если 401 и есть refresh токен, пробуем обновить
    if (response.status === 401 && retry) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          await refreshAccessToken();
          // Повторяем запрос с новым токеном
          return apiRequest<T>(endpoint, options, false);
        } catch (refreshError) {
          // Если обновление не удалось, очищаем токены
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw refreshError;
        }
      } else {
        // Нет refresh токена, редиректим на логин
        window.location.href = '/login';
      }
    }

    if (!response.ok) {
      let errorBody = null;
      try {
        errorBody = await response.json();
      } catch (e) {
        // Ошибка парсинга JSON не критична
      }
      throw new ApiError(`API Error: ${response.statusText}`, response.status, errorBody);
    }

    if (response.status === 204) {
      return null as T;
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// API для аутентификации
export const authApi = {
  // register: (data: RegisterData) => 
  //   // apiRequest<AuthResponse>('/auth/register/', {
  //   //   method: 'POST',
  //   //   body: JSON.stringify(data),
  //   // }),

  login: (data: LoginData) => 
    apiRequest<AuthResponse>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: (refreshToken: string) => 
    apiRequest('/auth/logout/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    }),

  getCurrentUser: () => 
    apiRequest<User>('/auth/me/'),

  refreshToken: () => 
    refreshAccessToken(),
};

// Утилиты для работы с аутентификацией
export const authService = {
  setTokens: (data: { access: string; refresh: string }) => {
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
  },

  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getAccessToken: () => localStorage.getItem('access_token'),
  
  getRefreshToken: () => localStorage.getItem('refresh_token'),
  
  getUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getUserRole: (): 'admin' | 'employee' | null => {
    const user = authService.getUser();
    return user?.profile?.role || null;
  },

  isAdmin: () => authService.getUserRole() === 'admin',
  
  isEmployee: () => authService.getUserRole() === 'employee',
  
  isAuthenticated: () => !!authService.getAccessToken(),
  
  clearTokens: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },
};

// Остальные API остаются без изменений, они будут использовать обновленный apiRequest
export const suppliesApi = {
  getSupplies: () => apiRequest<Supply[]>('/supplies/?type=future'),
  
  getSuppliesByDate: (date: string, payment_type?: string) => {
    let endpoint = `/supplies/?date=${date}`;
    if (payment_type && payment_type !== 'all') {
      endpoint += `&payment_type=${payment_type}`;
    }
    return apiRequest<Supply[]>(endpoint);
  },
  
  getSupplyHistory: (supplierName: string) =>
    apiRequest<Supply[]>(
      `/supplies/?type=past&supplier=${encodeURIComponent(supplierName)}`
    ),
  
  createSupply: (data: AddSupplyForm) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'images' && Array.isArray(value)) {
        value.forEach((file) => {
          formData.append('images', file);
        });
      } else if (key !== 'images' && value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    return apiRequest<Supply>('/supplies/', {
      method: 'POST',
      body: formData,
    });
  },

  updateSupply: (id: string, data: Partial<AddSupplyForm>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'images' && Array.isArray(value)) {
        value.forEach((file) => {
          formData.append('images', file);
        });
      } else if (key !== 'images' && value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    return apiRequest<Supply>(`/supplies/${id}/`, {
      method: 'PATCH',
      body: formData,
    });
  },
  
  deleteSupply: (id: string) => apiRequest(`/supplies/${id}/`, {
    method: 'DELETE',
  }),
  
  confirmSupply: (id: string) => apiRequest<Supply>(`/supplies/${id}/confirm/`, {
    method: 'POST',
  }),
};

export const suppliersApi = {
  getSuppliers: (params?: {
    page?: number;
    page_size?: number;
    ordering?: string;
    q?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }
    return apiRequest<SuppliersResponse>(`/suppliers/?${searchParams.toString()}`);
  },

  createSupplier: (data: CreateSupplierData) => 
    apiRequest<Supplier>('/suppliers/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  updateSupplier: (id: string, data: Partial<CreateSupplierData>) => 
    apiRequest<Supplier>(`/suppliers/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteSupplier: (id: string) => 
    apiRequest(`/suppliers/${id}/`, {
      method: 'DELETE',
    }),
};

export const cashFlowApi = {
  getOperationsByDate: (date: string, flow_type?: string) => {
    let endpoint = `/cashflows/by_date/?date=${date}`;
    if (flow_type && flow_type !== 'all') {
      endpoint += `&flow_type=${flow_type}`;
    }
    return apiRequest<CashFlowOperation[]>(endpoint);
  },

  createOperation: (data: { amount: number; description: string, type: 'cash' | 'bank' }) => 
    apiRequest<CashFlowOperation>('/cashflows/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateOperation: (id: string, data: { amount: number; description: string }) => 
    apiRequest<CashFlowOperation>(`/cashflows/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteOperation: (id: string) => 
    apiRequest(`/cashflows/${id}/`, {
      method: 'DELETE',
    }),
};

export const clientsApi = {
  getClients: (params?: {
    page?: number;
    page_size?: number;
    filter_tag?: string;
    q?: string;
    show_zeros?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }
    return apiRequest<ClientsResponse>(`/clients/?${searchParams.toString()}`);
  },
  
  createClient: (data: AddClientForm) => 
    apiRequest<Client>('/clients/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  updateClient: (id: string, data: AddClientForm) => 
    apiRequest<Client>(`/clients/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  deleteClient: (id: string) => 
    apiRequest(`/clients/${id}/`, {
      method: 'DELETE',
    }),
  
  getClientDebts: (id: string) => 
    apiRequest<ClientDebt[]>(`/clients/${id}/get_debts/`),
  
  addDebt: (id: string, debt_value: number, responsible_employee_id: string) => {

  
    return apiRequest<ClientDebt>(`/clients/${id}/add_debt/`, {
      method: 'POST',
      body: JSON.stringify({ debt_value, responsible_employee_id }),
    });
  },
  
    
  deleteDebt: (debtId: string) => 
    apiRequest(`/clients/delete_debt/${debtId}/`, {
      method: 'DELETE',
    }),
};

export const employeesApi = {
  getEmployees: () => apiRequest<Employee[]>(`/employees/`)
};
export const leadsApi = {
  createLead: (data: LeadData) => 
    apiRequest<LeadResponse>('/leads/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  

};