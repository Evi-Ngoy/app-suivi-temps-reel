
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendUp?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, trendUp }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
          <i className={`fas ${icon} text-xl`}></i>
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
            <i className={`fas fa-arrow-${trendUp ? 'up' : 'down'} mr-1`}></i>
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  );
};
