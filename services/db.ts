
import { Sale, InventoryItem, BusinessStats } from '../types';
import { INITIAL_SALES, INITIAL_INVENTORY } from '../constants';

const SALES_KEY = 'entrepretrack_sales';
const INVENTORY_KEY = 'entrepretrack_inventory';

export const db = {
  getSales: (): Sale[] => {
    const data = localStorage.getItem(SALES_KEY);
    return data ? JSON.parse(data) : INITIAL_SALES;
  },

  getInventory: (): InventoryItem[] => {
    const data = localStorage.getItem(INVENTORY_KEY);
    return data ? JSON.parse(data) : INITIAL_INVENTORY;
  },

  saveSale: (sale: Sale) => {
    const sales = db.getSales();
    const updated = [sale, ...sales];
    localStorage.setItem(SALES_KEY, JSON.stringify(updated));
    return updated;
  },

  getStats: (): BusinessStats => {
    const sales = db.getSales();
    const revenue = sales.filter(s => s.status === 'Completed').reduce((acc, curr) => acc + curr.amount, 0);
    return {
      totalRevenue: revenue,
      activeOrders: sales.filter(s => s.status === 'Pending').length,
      conversionRate: 12.5, // Mocked value
      customerGrowth: 8.2, // Mocked value
    };
  }
};
