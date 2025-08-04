import { Supply, AddSupplyForm, CashFlowOperation, SupplyImage } from '@/types/supply';
import { Client, ClientDebt, AddClientForm, ClientsResponse } from '@/types/client';
import { CreateSupplierData, Supplier } from '@/types/suppliers';
import { Employee } from '@/types/employees';

// const API_BASE_URL = 'http://localhost:8000/api/v1'; // Измените на ваш URL
const API_BASE_URL = 'http://172.20.10.3:8000/api/v1'; // Измените на ваш URL


class ApiError extends Error {
  status: number;
  body: any; // Здесь будет храниться тело ответа с ошибкой (JSON)
  
  constructor(message: string, status: number, body: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }}

// api.ts

const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Устанавливаем заголовки по умолчанию
  const headers: HeadersInit = { ...options.headers };

  // Если тело запроса НЕ является FormData, устанавливаем JSON заголовок
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  // В противном случае (если это FormData), браузер сам установит правильный Content-Type

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorBody = null;
      try {
        errorBody = await response.json();
      } catch (e) {
        console.error("Could not parse error response JSON", e);
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


export const suppliesApi = {
  // Получить все поставки
  getSupplies: () => apiRequest<Supply[]>('/supplies/'),
  
  // Получить поставки по дате
  getSuppliesByDate: (date: string) => apiRequest<Supply[]>(`/supplies/by_date/?date=${date}`),

  // Создать новую поставку
  createSupply: (data: AddSupplyForm) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'invoice' && value instanceof File) {
        formData.append(key, value);
      } else if (key !== 'invoice' && value !== null) {
        formData.append(key, String(value));
      }
    });

    return apiRequest<Supply>('/supplies/', {
      method: 'POST',
      body: formData,
    });
  },

  // Обновить поставку
  updateSupply: (id: string, data: Partial<AddSupplyForm>) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      // Проверяем, что значение не undefined (для PATCH запросов)
      if (value !== undefined) {
        if (key === 'invoice' && value instanceof File) {
          formData.append(key, value);
        } else if (key !== 'invoice' && value !== null) {
          formData.append(key, String(value));
        }
      }
    });

    return apiRequest<Supply>(`/supplies/${id}/`, {
      method: 'PATCH',
      body: formData,
    });
  },
  
  // Удалить поставку
  deleteSupply: (id: string) => apiRequest(`/supplies/${id}/`, {
    method: 'DELETE',
  }),
  
  // Подтвердить поставку
  confirmSupply: (id: string) => apiRequest<Supply>(`/supplies/${id}/confirm/`, {
    method: 'POST',
  }),

};

// ... остальной код ...

export const suppliersApi = {
  // ++ ОБНОВЛЕННАЯ ФУНКЦИЯ ++
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
    // Используем новый тип SuppliersResponse
    return apiRequest<SuppliersResponse>(`/suppliers/?${searchParams.toString()}`);
  },

  createSupplier: (data: CreateSupplierData) => 
    apiRequest<Supplier>('/suppliers/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  // ++ ДОБАВЬТЕ ФУНКЦИИ UPDATE И DELETE (по аналогии с clientsApi) ++
  updateSupplier: (id: string, data: Partial<CreateSupplierData>) => 
    apiRequest<Supplier>(`/suppliers/${id}/`, {
      method: 'PATCH', // или PUT
      body: JSON.stringify(data),
    }),

  deleteSupplier: (id: string) => 
    apiRequest(`/suppliers/${id}/`, {
      method: 'DELETE',
    }),
};

// ... остальной код ...

export const cashFlowApi = {
  // Получить операции по дате
  getOperationsByDate: (date: string) => apiRequest<CashFlowOperation[]>(`/cashflows/by_date/?date=${date}`),

  // Создать новую операцию
  createOperation: (data: { amount: number; description: string, type: 'cash' | 'bank' }) => 
    apiRequest<CashFlowOperation>('/cashflows/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Обновить операцию
  updateOperation: (id: string, data: { amount: number; description: string }) => 
    apiRequest<CashFlowOperation>(`/cashflows/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Удалить операцию
  deleteOperation: (id: string) => 
    apiRequest(`/cashflows/${id}/`, {
      method: 'DELETE',
    }),
};

export const clientsApi = {
  // Получить всех клиентов с фильтрами
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
  
  // Создать нового клиента
  createClient: (data: AddClientForm) => 
    apiRequest<Client>('/clients/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Обновить клиента
  updateClient: (id: string, data: AddClientForm) => 
    apiRequest<Client>(`/clients/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  // Удалить клиента
  deleteClient: (id: string) => 
    apiRequest(`/clients/${id}/`, {
      method: 'DELETE',
    }),
  
  // Получить долги клиента
  getClientDebts: (id: string) => 
    apiRequest<ClientDebt[]>(`/clients/${id}/get_debts/`),
  
  // Добавить долг
    addDebt: (id: string, debt_value: number, responsible_employee_id: string) => 
    apiRequest<ClientDebt>(`/clients/${id}/add_debt/`, {
      method: 'POST',
      body: JSON.stringify({ debt_value, responsible_employee_id }),
    }),
    
  
  // Удалить долг
  deleteDebt: (debtId: string) => 
    apiRequest(`/clients/delete_debt/${debtId}/`, {
      method: 'DELETE',
    }),
};

export const employeesApi = {
  getEmployees: () => apiRequest<Employee[]>(`/employees/`)
};
