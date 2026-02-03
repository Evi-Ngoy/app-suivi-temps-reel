
export interface Sale {
  id: string;
  date: string;
  amount: number;
  product: string;
  customer: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
}

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  price: number;
  category: string;
}

export interface BusinessStats {
  totalRevenue: number;
  activeOrders: number;
  conversionRate: number;
  customerGrowth: number;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}
