export interface Supplier {
  id: string; // или number
  name: string;
  description: string | null;
  supervisor: string;
  supervisor_pn: string;
  representative: string;
  representative_pn: string;
  delivery: string;
  delivery_pn: string;
  is_everyday_supply: boolean;
  last_accessed: string | null;
  date_added: string;
}

// Описывает данные для создания нового поставщика
export type CreateSupplierData = {
  name: string;
  description?: string;
  supervisor?: string;
  supervisor_pn?: string;
  representative?: string;
  representative_pn?: string;
  delivery?: string;
  delivery_pn?: string;
  is_everyday_supply?: boolean;
}
export interface SuppliersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Supplier[];
}