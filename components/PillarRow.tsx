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
  const essentialProducts = products.filter(p => p.range === 'Essential');
  const expertProducts = products.filter(p => p.range === 'Expert');
  const hasExpert = expertProducts.length > 0;

  const renderProductChip = (product: Product) => {
    const isActive = market.products[product.id]?.isActive;
    return (
      <div 
        key={product.id}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors border
          ${isActive 
            ? 'bg-white border-blue-100 shadow-sm text-fmc-dark' 
            : 'bg-transparent border-transparent text-gray-400 grayscale opacity-60'}
        `}
      >
        <StatusDot active={isActive} size="sm" />
        <span className="font-medium truncate leading-tight">{product.name}</span>
      </div>
    );
  };

  return (
    <div 
      onClick={onClick}
      className="group w-full bg-white border border-fmc-border rounded-xl p-6 mb-5 hover:shadow-lg hover:border-fmc-accent transition-all duration-200 cursor-pointer"
    >
      {/* Header Row: Title, Description, Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6">
          <h3 className="text-xl font-bold text-fmc-dark group-hover:text-fmc-medium transition-colors">
            {config.label}
          </h3>
          <p className="text-sm text-gray-500 font-medium">
            {config.description}
          </p>
           {stats.actionNeeded && (
            <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-orange-100 self-start md:self-auto shadow-sm">
              <AlertCircle size={10} /> Action
            </span>
          )}
        </div>

        <div className="flex items-center gap-6">
             <div className="flex flex-col items-end min-w-[140px]">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Completeness</span>
                <div className="flex items-center gap-3 w-full justify-end">
                    <div className="w-32 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className={`h-full rounded-full ${stats.completeness >= 80 ? 'bg-green-500' : stats.completeness >= 50 ? 'bg-fmc-medium' : 'bg-red-500'}`} 
                            style={{ width: `${stats.completeness}%` }}
                        />
                    </div>
                    <span className="text-xl font-black text-fmc-dark">{stats.completeness}%</span>
                </div>
             </div>
             <ChevronRight className="text-gray-300 group-hover:text-fmc-accent transition-colors" size={24} />
        </div>
      </div>

      {/* Product Ranges Container - Side-by-Side Boxes */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Essential Range Box - Light Blue Border */}
        <div className="flex-1 border border-fmc-accent rounded-lg p-4 pt-6 relative bg-blue-50/10">
            <span className="absolute -top-3 left-4 bg-white px-2 py-0.5 text-xs font-bold text-fmc-accent border border-fmc-accent rounded shadow-sm tracking-tight">
                Essential Range
            </span>
            <div className="flex flex-wrap gap-2">
                {essentialProducts.length > 0 ? (
                    essentialProducts.map(renderProductChip)
                ) : (
                    <span className="text-xs text-gray-400 italic p-2">No products in range</span>
                )}
            </div>
        </div>

        {/* Expert Range Box - Dark Blue Border (Gray if empty) */}
        <div className={`flex-1 border rounded-lg p-4 pt-6 relative ${hasExpert ? 'border-fmc-dark bg-white' : 'border-gray-200 bg-gray-50/30'}`}>
             <span className={`absolute -top-3 left-4 bg-white px-2 py-0.5 text-xs font-bold border rounded shadow-sm tracking-tight ${hasExpert ? 'text-fmc-dark border-fmc-dark' : 'text-gray-400 border-gray-200'}`}>
                Expert Range
            </span>
            <div className="flex flex-wrap gap-2">
                {hasExpert ? (
                    expertProducts.map(renderProductChip)
                ) : (
                    <span className="text-xs text-gray-400 italic p-2">No products in range</span>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};