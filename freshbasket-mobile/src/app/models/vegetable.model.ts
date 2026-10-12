export interface Vegetable {
  id: number;
  name: string;
  description: string | null;
  price: number | string;
  stock_quantity: number;
  unit: string;
  image_url: string | null;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface VegetableListResponse {
  data: Vegetable[];
  pagination: { page: number; limit: number; total: number };
}

export interface CartItem {
  vegetable: Vegetable;
  quantity: number;
}

export interface CheckoutResponse {
  message: string;
  payment_method: string;
  customer_name: string;
  total: number;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    unit: string;
    unit_price: number;
    line_total: number;
  }>;
}
