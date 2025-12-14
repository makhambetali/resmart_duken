import { Supply, AddSupplyForm, CashFlowOperation } from '@/types/supply';
import { Client, ClientDebt, AddClientForm, ClientsResponse } from '@/types/client';
import { CreateSupplierData, Supplier, SuppliersResponse } from '@/types/suppliers';
import { Employee } from '@/types/employees';

// Укажите ваш IP-адрес или домен
const API_BASE_URL = 'http://localhost:8000/api/v1';

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

const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: HeadersInit = { ...options.headers };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

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
        // Ошибка парсинга JSON не критична, если тело ответа пустое или не JSON
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
  getSupplies: () => apiRequest<Supply[]>('/supplies/?type=future'),
  
  getSuppliesByDate: (date: string, payment_type?: string) => {
    let endpoint = `/supplies/?date=${date}`;
    if (payment_type && payment_type !== 'all') {
      endpoint += `&payment_type=${payment_type}`;
    }
    return apiRequest<Supply[]>(endpoint);
  },

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

  updateSupply: (id: string, data: Partial<AddSupplyForm>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
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
  
  addDebt: (id: string, debt_value: number, responsible_employee_id: string) => 
    apiRequest<ClientDebt>(`/clients/${id}/add_debt/`, {
      method: 'POST',
      body: JSON.stringify({ debt_value, responsible_employee_id }),
    }),
    
  deleteDebt: (debtId: string) => 
    apiRequest(`/clients/delete_debt/${debtId}/`, {
      method: 'DELETE',
    }),
};

export const employeesApi = {
  getEmployees: () => apiRequest<Employee[]>(`/employees/`)
};