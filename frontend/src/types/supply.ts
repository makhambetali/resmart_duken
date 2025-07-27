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
  created_at?: string;
  updated_at?: string;
}

export interface AddSupplyForm {
  supplier: string;
  paymentType?: 'cash' | 'bank' | 'mixed';
  price_cash: string;
  price_bank: string;
  bonus: number;
  exchange: number;
  delivery_date: string;
  comment: string;
  images: File[];
  is_confirmed: boolean;
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
