
import React, { useState, useEffect, useRef } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Sidebar } from './components/Sidebar.jsx';
import { StatsCard } from './components/StatsCard.jsx';
import { Modal } from './components/Modal.jsx';
import { db } from './services/db.js';
import { getBusinessInsights } from './services/geminiService.js';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sales, setSales] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const scrollRef = useRef(null);

  const navigateTo = (tab) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
  };

  // Modal states
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [newSale, setNewSale] = useState({ customer: '', product: '', amount: '', status: 'Pending' });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setSales(db.getSales());
      setInventory(db.getInventory());
      setIsSyncing(false);
    }, 600);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const stats = db.getStats();

  const handleAddSale = (e) => {
    e.preventDefault();
    if (!newSale.customer || !newSale.amount) return;
    
    const formattedSale = {
      ...newSale,
      date: new Date().toISOString().split('T')[0],
      amount: parseFloat(newSale.amount)
    };
    
    const updatedSales = db.addSale(formattedSale);
    setSales(updatedSales);
    setShowSaleModal(false);
    setNewSale({ customer: '', product: '', amount: '', status: 'Pending' });
  };

  const handleUpdateStock = (id, currentStock, delta) => {
    const updated = db.updateStock(id, currentStock + delta);
    setInventory(updated);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMsg = inputMessage;
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    
    setIsTyping(true);
    const aiResponse = await getBusinessInsights(sales, inventory, userMsg);
    setIsTyping(false);
    
    setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
  };

  const chartData = [
    { name: 'Lun', sales: 4000 },
    { name: 'Mar', sales: 3000 },
    { name: 'Mer', sales: 2000 },
    { name: 'Jeu', sales: 2780 },
    { name: 'Ven', sales: 1890 },
    { name: 'Sam', sales: 2390 },
    { name: 'Dim', sales: stats.totalRevenue / 10 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
     />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
<div className="flex items-center gap-4">
            {/* BOUTON BURGER : Visible uniquement sur mobile */}
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>

            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-3">
                {activeTab === 'dashboard' && 'Vue d\'ensemble'}
                {activeTab === 'sales' && 'Ventes'}
                {activeTab === 'inventory' && 'Stocks'}
                {activeTab === 'ai' && 'Conseiller IA'}
                {isSyncing && <i className="fas fa-sync-alt animate-spin text-sm text-indigo-400"></i>}
              </h2>
              {/* On cache le sous-titre sur petit mobile pour gagner de la place */}
              <p className="hidden sm:block text-slate-500 text-sm">
                Connecté en temps réel • {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={refreshData}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
              title="Actualiser les données"
            >
              <i className="fas fa-sync-alt"></i>
            </button>
            <button 
              onClick={() => setShowSaleModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md active:scale-95"
            >
              <i className="fas fa-plus"></i>
              <span className="hidden sm:inline">Nouveau Rapport</span>
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard title="Chiffre d'Affaires" value={`${stats.totalRevenue.toLocaleString()} €`} icon="fa-wallet" trend="+12.5%" trendUp={true} />
              <StatsCard title="Commandes en cours" value={stats.activeOrders} icon="fa-clock" trend="-2.4%" trendUp={false} />
              <StatsCard title="Taux de Conversion" value={`${stats.conversionRate}%`} icon="fa-user-check" trend="+1.2%" trendUp={true} />
              <StatsCard title="Croissance Client" value={`${stats.customerGrowth}%`} icon="fa-users" trend="+5.4%" trendUp={true} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-900 text-lg">Revenus Hebdomadaires</h3>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                        cursor={{stroke: '#4f46e5', strokeWidth: 2}}
                      />
                      <Area type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-900 text-lg mb-6">Transactions Récentes</h3>
                <div className="space-y-4">
                  {sales.length === 0 ? (
                    <p className="text-center text-slate-400 py-8 italic text-sm">Aucune vente enregistrée.</p>
                  ) : (
                    sales.slice(0, 5).map(sale => (
                      <div key={sale.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            sale.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            <i className="fas fa-receipt"></i>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-tight truncate max-w-[120px]">{sale.customer}</p>
                            <p className="text-xs text-slate-500">{sale.product}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-900">{sale.amount} €</p>
                          <p className={`text-[10px] font-bold uppercase tracking-wider ${
                            sale.status === 'Completed' ? 'text-emerald-500' : 
                            sale.status === 'Pending' ? 'text-amber-500' : 'text-rose-500'
                          }`}>{sale.status}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-500">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Produit</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Montant</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sales.map(sale => (
                  <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600">{sale.date}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{sale.customer}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{sale.product}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{sale.amount} €</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${
                        sale.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 
                        sale.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {inventory.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${item.stock < 20 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    <i className="fas fa-box text-xl"></i>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md uppercase">{item.category}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-lg mb-1">{item.name}</h4>
                <div className="flex justify-between items-end mt-4">
                  <div>
                    <p className="text-xs text-slate-500">En stock</p>
                    <p className={`text-2xl font-bold ${item.stock < 20 ? 'text-rose-600 animate-pulse' : 'text-slate-900'}`}>{item.stock}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Prix unitaire</p>
                    <p className="text-xl font-bold text-indigo-600">{item.price} €</p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50 flex gap-2">
                  <button 
                    onClick={() => handleUpdateStock(item.id, item.stock, -1)}
                    className="flex-1 py-2 text-xs font-bold bg-slate-50 text-slate-600 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100"
                  >
                    RETIRER 1
                  </button>
                  <button 
                    onClick={() => handleUpdateStock(item.id, item.stock, 5)}
                    className="flex-1 py-2 text-xs font-bold bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all border border-transparent hover:border-indigo-200"
                  >
                    AJOUTER 5
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30" ref={scrollRef}>
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-inner">
                    <i className="fas fa-robot"></i>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Expert en Stratégie AI</h3>
                  <p className="text-slate-500 max-w-sm mt-2 text-sm leading-relaxed">
                    Je suis prêt à analyser vos données. Demandez-moi vos revenus du jour ou des conseils sur votre stock.
                  </p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200 shadow-inner focus-within:ring-2 ring-indigo-500/20 transition-all">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Posez votre question stratégique..."
                  className="flex-1 bg-transparent border-none outline-none px-4 text-sm text-slate-700"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isTyping || !inputMessage.trim()}
                  className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:grayscale"
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL POUR NOUVELLE VENTE */}
      <Modal isOpen={showSaleModal} onClose={() => setShowSaleModal(false)} title="Enregistrer une vente">
        <form onSubmit={handleAddSale} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Client</label>
            <input 
              required
              type="text" 
              value={newSale.customer}
              onChange={e => setNewSale({...newSale, customer: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 ring-indigo-500/20"
              placeholder="Ex: TechCorp"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Produit / Service</label>
            <input 
              required
              type="text" 
              value={newSale.product}
              onChange={e => setNewSale({...newSale, product: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 ring-indigo-500/20"
              placeholder="Ex: Licences CRM"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Montant (€)</label>
              <input 
                required
                type="number" 
                value={newSale.amount}
                onChange={e => setNewSale({...newSale, amount: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 ring-indigo-500/20"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Statut</label>
              <select 
                value={newSale.status}
                onChange={e => setNewSale({...newSale, status: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 ring-indigo-500/20"
              >
                <option value="Completed">Complété</option>
                <option value="Pending">En attente</option>
              </select>
            </div>
          </div>
          <div className="pt-4">
            <button 
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
              CONFIRMER LA TRANSACTION
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default App;
