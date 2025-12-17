// @/types/supply.ts

export interface Supply {
  id: string;
  supplier: string;
  price_cash: number;
  price_bank: number;
  bonus: number;
  exchange: number;
  delivery_date: string;
  comment?: string;
  is_confirmed: boolean;
  is_rescheduled?: boolean; // <-- Добавлено
  date_added?: string;
  updated_at?: string;
  invoice_html: string;
  arrival_date?: string | null; // <-- Добавлено, если еще нет
}

export interface AddSupplyForm {
  supplier: string;
  paymentType: 'cash' | 'bank' | 'mixed';
  price_cash: string;
  price_bank: string;
  bonus: number;
  exchange: number;
  delivery_date: string;
  comment: string;
  is_confirmed: boolean;
  is_rescheduled?: boolean; // <-- Добавлено
  invoice_html: string;
}
export interface Supplier {
  id: string;
  name: string;
}

export interface SupplyImage {
  id: string;
  image: string;
  supply: string;
}

export interface CashFlowOperation {
  id: string;
  amount: number;
  description: string;
  created_at: string;
}
