import React from 'react';

export const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: 'fa-chart-pie' },
    { id: 'sales', label: 'Ventes', icon: 'fa-shopping-cart' },
    { id: 'inventory', label: 'Stock', icon: 'fa-boxes-stacked' },
    { id: 'ai', label: 'Conseiller IA', icon: 'fa-robot' },
  ];

  return (
    <>
      {/* 1. Overlay (le fond sombre) pour mobile uniquement */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* 2. La Sidebar elle-même */}
      <div className={`
        fixed left-0 top-0 h-screen bg-white border-r border-slate-200 z-50 flex flex-col transition-transform duration-300 ease-in-out
        w-72 md:w-64 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
      `}>
        
        {/* Header de la Sidebar avec bouton fermer pour mobile */}
        <div className="p-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent flex items-center gap-2">
            EntrepreTrack
          </h1>
          {/* Bouton fermer (X) visible seulement sur mobile */}
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-rose-500">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <nav className="flex-1 px-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (onClose) onClose(); // Ferme le menu après avoir cliqué sur mobile
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-indigo-200 shadow-lg' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <i className={`fas ${item.icon} w-5`}></i>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Profil Utilisateur */}
        <div className="p-6 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <img src="https://picsum.photos/40" alt="Avatar" className="w-10 h-10 rounded-full border-2 border-indigo-100" />
            <div>
              <p className="text-sm font-bold text-slate-900 leading-tight">M. Evi ngoy</p>
              <p className="text-xs text-slate-500">CEO & Fondateur</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};