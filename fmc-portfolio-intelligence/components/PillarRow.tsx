import React from 'react';
import { MarketData, PillarConfig, PillarStat, Product } from '../types';
import { StatusDot } from './StatusDot';
import { ChevronRight, AlertCircle } from 'lucide-react';

interface PillarRowProps {
  config: PillarConfig;
  stats: PillarStat;
  market: MarketData;
  products: Product[];
  onClick: () => void;
}

export const PillarRow: React.FC<PillarRowProps> = ({ config, stats, market, products, onClick }) => {
  // Sort products for preview: Active first, then by importance
  const sortedProducts = [...products].sort((a, b) => {
    const aActive = market.products[a.id]?.isActive ? 1 : 0;
    const bActive = market.products[b.id]?.isActive ? 1 : 0;
    if (aActive !== bActive) return bActive - aActive; // Active first
    return a.importance === 'Must-have' ? -1 : 1;
  });

  return (
    <div 
      onClick={onClick}
      className="group w-full bg-white border border-fmc-border rounded-xl p-6 mb-4 hover:shadow-lg hover:border-fmc-accent transition-all duration-200 cursor-pointer flex flex-col md:flex-row items-stretch md:items-center gap-6"
    >
      {/* 1. Info Section */}
      <div className="flex-shrink-0 w-full md:w-64">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-bold text-fmc-dark group-hover:text-fmc-medium transition-colors">
            {config.label}
          </h3>
          {stats.actionNeeded && (
            <span className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-orange-100">
              <AlertCircle size={10} /> Action
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 line-clamp-2">
          {config.description}
        </p>
      </div>

      {/* 2. Products Preview Section */}
      <div className="flex-1 flex flex-wrap gap-2 items-center">
        {sortedProducts.map(product => {
          const isActive = market.products[product.id]?.isActive;
          return (
            <div 
              key={product.id}
              className={`
                px-2.5 py-1.5 rounded border text-xs font-medium transition-colors flex items-center gap-2
                ${isActive 
                  ? 'bg-blue-50/50 border-blue-100 text-fmc-dark' 
                  : 'bg-gray-50 border-gray-100 text-gray-400 opacity-70'}
              `}
            >
              <StatusDot active={isActive} size="sm" />
              <span className="truncate max-w-[120px]">{product.name}</span>
            </div>
          );
        })}
      </div>

      {/* 3. Stats & Action Section */}
      <div className="flex-shrink-0 flex items-center justify-between md:justify-end gap-6 w-full md:w-48 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
        
        <div className="flex flex-col items-end">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Completeness</span>
            <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                        className={`h-full ${stats.completeness > 80 ? 'bg-green-500' : 'bg-fmc-medium'}`} 
                        style={{ width: `${stats.completeness}%` }}
                    />
                </div>
                <span className="text-sm font-bold text-fmc-dark w-8 text-right">{stats.completeness}%</span>
            </div>
        </div>

        <ChevronRight className="text-gray-300 group-hover:text-fmc-accent transition-colors" size={20} />
      </div>
    </div>
  );
};