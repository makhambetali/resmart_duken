export interface ClientDebt {
  id: string;
  client_id: string;
  debt_value: number;
  date_added: string;
  responsible_employee_id: number;
  is_valid: boolean;
  repaid_at?: string;
  description?: string;
}

export interface Client {
  id: string;
  name: string;
  phone_number: string;
  description: string;
  is_chosen: boolean;
  debt: number;
  last_accessed: string;
  date_added: string;
}

export interface AddClientForm {
  name: string;
  phone_number: string;
  description: string;
  is_chosen: boolean;
}

export interface ClientFilters {
  searchTerm: string;
  filterType: string;
  perPage: number;
  currentPage: number;
  showZeros: boolean;
}

export interface ClientsResponse {
  results: Client[];
  count: number;
}