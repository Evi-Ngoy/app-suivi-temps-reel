
import React from 'react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: 'fa-chart-pie' },
    { id: 'sales', label: 'Ventes', icon: 'fa-shopping-cart' },
    { id: 'inventory', label: 'Stock', icon: 'fa-boxes-stacked' },
    { id: 'ai', label: 'Conseiller IA', icon: 'fa-robot' },
  ];

  return (
    <div className="w-64 bg-white h-screen border-r border-slate-200 fixed left-0 top-0 hidden md:flex flex-col">
      <div className="p-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent flex items-center gap-2">
          <i className="fas fa-rocket"></i>
          EntrepreTrack
        </h1>
      </div>
      <nav className="flex-1 px-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${
              activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-indigo-200 shadow-lg' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <i className={`fas ${item.icon}`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-6 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <img src="https://picsum.photos/40" alt="Avatar" className="w-10 h-10 rounded-full border-2 border-indigo-100" />
          <div>
            <p className="text-sm font-bold text-slate-900 leading-tight">M. Entrepreneur</p>
            <p className="text-xs text-slate-500">CEO & Fondateur</p>
          </div>
        </div>
      </div>
    </div>
  );
};
