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
  last_updated: string;
}

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

// 🔧 ОБНОВЛЕНО: Новый интерфейс согласно API
export interface ArrivalPrediction {
  interval: string;
  probability: number;
}

export interface SupplierStats {
  price: {
    min: number;
    max: number;
    avg: number;
    med: number;
    rescheduled_coef: number;  // Перемещено из корня в price
    count: number;            // Перемещено из корня в price
  };
  arrival_time: {             // Изменено с arrival_date на arrival_time
    min: string;
    max: string;
    avg: string;
    med: string;
  };
  arrival_prediction: ArrivalPrediction[];
}