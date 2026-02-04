
import { Sale, InventoryItem } from './types';

export const INITIAL_SALES: Sale[] = [
  { id: '1', date: '2026-01-01', amount: 6250, product: 'Logiciel CRM', customer: 'sylikin', status: 'Completed' },
  { id: '2', date: '2026-02-03', amount: 4500, product: 'Consulting', customer: 'orange', status: 'Completed' },
  { id: '3', date: '2026-01-21', amount: 8900, product: 'Pack Web Pro', customer: 'rawbanc', status: 'Pending' },
  { id: '4', date: '2026-01-22', amount: 2100, product: 'Maintenance Annuelle', customer: 'Mairie ', status: 'Completed' },
  { id: '5', date: '2024-01-22', amount: 1500, product: 'Ebook Marketing', customer: 'Martin', status: 'Cancelled' },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'Licences CRM', stock: 45, price: 1250, category: 'Logiciel' },
  { id: '2', name: 'Heures Consulting', stock: 120, price: 150, category: 'Service' },
  { id: '3', name: 'Templates Web', stock: 200, price: 49, category: 'Digital' },
  { id: '4', name: 'Audit Securité', stock: 10, price: 3500, category: 'Service' },
];
