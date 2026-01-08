// api.ts
import { Supply, AddSupplyForm, CashFlowOperation } from '@/types/supply';
import { Client, ClientDebt, AddClientForm, ClientsResponse } from '@/types/client';
import { CreateSupplierData, Supplier, SuppliersResponse, SupplierStats } from '@/types/suppliers';
import { Employee } from '@/types/employees';
import { toast } from 'sonner'; // Предполагаем использование sonner для toasts

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

// Утилита для проверки доступности бэкенда
const checkBackendHealth = async (url: string): Promise<boolean> => {
  try {
    const healthUrl = url.replace('/api/v1', '/health');
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Короткий таймаут для быстрой проверки
      signal: AbortSignal.timeout(3000)
    });
    return response.ok;
  } catch (error) {
    console.log(`Health check failed for ${url}:`, error);
    return false;
  }
};

// Определение API_BASE_URL с проверкой доступности бэкенда
let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const testOnMobile = import.meta.env.VITE_IS_MOBILE === 'true';

// Функция для отображения toast с информацией о бэкенде
const showBackendStatusToast = (url: string, isAvailable: boolean) => {
  const status = isAvailable ? '✅' : '❌';
  const message = isAvailable 
    ? `Бэкенд настроен успешно: ${url}`
    : `Бэкенд недоступен: ${url}`;
  
  toast[isAvailable ? 'success' : 'error'](message, {
    description: `URL: ${url}`,
    duration: isAvailable ? 4000 : 6000,
  });
  
  console.log(`${status} ${message}`);
};

// Функция для инициализации API URL
// ... предыдущий код без изменений до функции initializeApiUrl ...

// Функция для инициализации API URL
const initializeApiUrl = async (): Promise<void> => {
  console.log('Проверка доступности бэкендов...');
  
  const urlsToCheck: string[] = [];
  
  // В мобильном режиме добавляем локальные адреса в начало списка (высший приоритет)
  if (testOnMobile) {
    console.log('Мобильный режим: проверка локальных адресов');
    urlsToCheck.push(
      "http://192.168.8.166:8000/api/v1",
      "http://172.20.10.3:8000/api/v1"
    );
  }
  
  // Добавляем основной URL из env (средний приоритет)
  if (API_BASE_URL && !urlsToCheck.includes(API_BASE_URL)) {
    urlsToCheck.push(API_BASE_URL);
  }
  
  // Добавляем localhost в конец (низший приоритет)
  const localhostUrl = 'http://localhost:8000/api/v1';
  if (!urlsToCheck.includes(localhostUrl)) {
    urlsToCheck.push(localhostUrl);
  }
  
  console.log('Будут проверены следующие URL (в порядке приоритета):', urlsToCheck);
  
  let foundWorkingUrl = null;
  let checkResults: { url: string; available: boolean }[] = [];
  
  // Проверяем все URL последовательно
  for (const url of urlsToCheck) {
    console.log(`Проверяем доступность ${url}...`);
    const isHealthy = await checkBackendHealth(url);
    checkResults.push({ url, available: isHealthy });
    
    if (isHealthy && !foundWorkingUrl) {
      foundWorkingUrl = url;
      API_BASE_URL = url;
      showBackendStatusToast(url, true);
      
      // Если нашли рабочий URL, проверяем остальные только для информации
      // но не прерываем цикл, чтобы получить полную картину
      console.log(`Найден рабочий URL: ${url}, продолжаем проверку остальных для информации...`);
    }
  }
  
  // Если не нашли ни одного рабочего URL, показываем ошибку для всех
  if (!foundWorkingUrl) {
    API_BASE_URL = urlsToCheck[0]; // Используем первый URL по умолчанию
    const message = `⚠️ Все бэкенды недоступны! Используется URL по умолчанию: ${API_BASE_URL}`;
    
    toast.error('Бэкенд недоступен', {
      description: message,
      duration: 8000,
    });
    
    console.warn(message);
    
    // Показываем результаты всех проверок
    checkResults.forEach(result => {
      showBackendStatusToast(result.url, result.available);
    });
  } else {
    // Если нашли рабочий URL, показываем только его успешный toast
    // и информационные сообщения в консоль об остальных
    checkResults.forEach(result => {
      if (result.url !== foundWorkingUrl) {
        console.log(`${result.available ? '✅' : '❌'} ${result.url} ${result.available ? 'доступен' : 'недоступен'}`);
      }
    });
  }
  
  console.log('Итоговый API_BASE_URL:', API_BASE_URL);
};

// ... остальной код без изменений ...

// Вызываем инициализацию при импорте модуля
// Но не блокируем загрузку приложения
let apiInitialized = false;
initializeApiUrl().then(() => {
  apiInitialized = true;
  console.log('API URL инициализирован');
}).catch(error => {
  console.error('Ошибка при инициализации API URL:', error);
  toast.error('Ошибка инициализации API', {
    description: error.message,
    duration: 8000,
  });
});

// Экспортируем функцию для проверки состояния инициализации
export const apiInitialization = {
  isInitialized: () => apiInitialized,
  getBaseUrl: () => API_BASE_URL,
  reinitialize: async () => {
    try {
      await initializeApiUrl();
      return true;
    } catch (error) {
      console.error('Ошибка при повторной инициализации API:', error);
      return false;
    }
  }
};

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
  
  // Проверяем инициализацию API
  if (!apiInitialized) {
    console.warn('API еще не инициализирован, выполняем запрос с текущим URL:', API_BASE_URL);
  }
  
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
    
    // Показываем toast при ошибке сети (скорее всего бэкенд недоступен)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      toast.error('Сервер недоступен', {
        description: `Не удалось подключиться к ${API_BASE_URL}. Проверьте соединение.`,
        duration: 5000,
        action: {
          label: 'Повторить',
          onClick: () => apiInitialization.reinitialize()
        }
      });
    }
    
    throw error;
  }
};

// API для аутентификации
export const authApi = {
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
  getSupplierStats: (supplierId: string): Promise<SupplierStats> => {
    return apiRequest<SupplierStats>(`/suppliers/${supplierId}/get_stats/`);
  },
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