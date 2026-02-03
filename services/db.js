
import { INITIAL_SALES, INITIAL_INVENTORY } from '../constants.js';

const SALES_KEY = 'entrepretrack_sales';
const INVENTORY_KEY = 'entrepretrack_inventory';

export const db = {
  getSales: () => {
    const data = localStorage.getItem(SALES_KEY);
    return data ? JSON.parse(data) : INITIAL_SALES;
  },

  getInventory: () => {
    const data = localStorage.getItem(INVENTORY_KEY);
    return data ? JSON.parse(data) : INITIAL_INVENTORY;
  },

  addSale: (newSale) => {
    const sales = db.getSales();
    const saleWithId = { ...newSale, id: Date.now().toString() };
    const updated = [saleWithId, ...sales];
    localStorage.setItem(SALES_KEY, JSON.stringify(updated));
    return updated;
  },

  updateStock: (id, newStock) => {
    const inventory = db.getInventory();
    const updated = inventory.map(item => 
      item.id === id ? { ...item, stock: Math.max(0, newStock) } : item
    );
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(updated));
    return updated;
  },

  getStats: () => {
    const sales = db.getSales();
    const revenue = sales.filter(s => s.status === 'Completed').reduce((acc, curr) => acc + Number(curr.amount), 0);
    const completedSales = sales.filter(s => s.status === 'Completed').length;
    const totalSales = sales.length;
    
    return {
      totalRevenue: revenue,
      activeOrders: sales.filter(s => s.status === 'Pending').length,
      conversionRate: totalSales > 0 ? ((completedSales / totalSales) * 100).toFixed(1) : 0,
      customerGrowth: 8.2,
    };
  }
};
