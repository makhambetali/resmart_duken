export interface Client {
  id: string;
  name: string;
  phone_number?: string;
  description?: string;
  is_chosen: boolean;
  debt: number;
  last_accessed: string;
}

export interface ClientDebt {
  id: string;
  responsible_employee_id: string;
  debt_value: number;
  date_added: string;
}

export interface AddClientForm {
  name: string;
  phone_number?: string;
  description?: string;
  initial_debt?: string;
  is_chosen: boolean;
}

export interface ClientsResponse {
  count: number;
  results: Client[];
}

export interface ClientFilters {
  searchTerm: string;
  filterType: 'latest' | 'oldest' | 'max' | 'min';
  perPage: number;
  currentPage: number;
  showZeros: boolean;
}