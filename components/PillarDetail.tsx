import React from 'react';
import { MarketData, PillarConfig, Product } from '../types';
import { getProductsByPillar } from '../services/dataService';
import { StatusDot } from './StatusDot';
import { X, Info } from 'lucide-react';

interface PillarDetailProps {
  market: MarketData;
  pillar: PillarConfig;
  onClose: () => void;
}

export const PillarDetail: React.FC<PillarDetailProps> = ({ market, pillar, onClose }) => {
  const products = getProductsByPillar(pillar.id);
  const essentialProducts = products.filter(p => p.range === 'Essential');
  const expertProducts = products.filter(p => p.range === 'Expert');

  const stats = market.pillarStats[pillar.id];

  // Helper to render a product list table
  const renderProductList = (items: Product[], title: string) => (
    <div className="mb-8">
      <h4 className="text-fmc-dark font-bold text-lg mb-4 flex items-center gap-2">
        {title}
        <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {items.filter(p => market.products[p.id]?.isActive).length} / {items.length} Active
        </span>
      </h4>
      <div className="bg-white border border-fmc-border rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Product Name</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase text-center w-24">Category</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase text-center w-24">Status</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase w-10"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((product, idx) => {
              const status = market.products[product.id];
              const isLast = idx === items.length - 1;
              return (
                <tr key={product.id} className={`hover:bg-blue-50/30 transition-colors ${!isLast ? 'border-b border-gray-100' : ''}`}>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide
                      ${product.importance === 'Must-have' ? 'bg-fmc-dark text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {product.importance === 'Must-have' ? 'Must' : 'Nice'}
                    </span>
                  </td>
                  <td className="py-4 px-4 flex justify-center">
                    <StatusDot active={status?.isActive || false} />
                  </td>
                  <td className="py-4 px-4 text-center text-gray-400">
                    <div className="group relative flex justify-center">
                        <Info size={16} className="cursor-help hover:text-fmc-medium" />
                        {/* Tooltip */}
                        <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                            {status?.notes || 'No specific notes'}
                        </div>
                    </div>
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
                <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400 text-sm italic">
                        No products available in this range for this pillar.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-fmc-dark/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-2 py-0.5 bg-blue-50 text-fmc-medium text-xs font-bold rounded uppercase tracking-wider">
                Drill-down
              </span>
              <span className="text-gray-400 text-sm">/ {market.country}</span>
            </div>
            <h2 className="text-2xl font-bold text-fmc-dark">{pillar.label}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#F4F6F8]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
             {/* Summary Card inside Modal */}
             <div className="md:col-span-3 bg-white p-6 rounded-xl border border-fmc-border flex items-center justify-between">
                <div>
                    <h5 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Pillar Status</h5>
                    <div className="flex items-center gap-4">
                        <span className="text-3xl font-bold text-fmc-dark">{stats.completeness}%</span>
                        <div className="h-8 w-px bg-gray-200"></div>
                        <div className="flex flex-col">
                           <span className="text-xs text-gray-400">Action Required</span>
                           <span className={`text-sm font-semibold ${stats.actionNeeded ? 'text-orange-600' : 'text-green-600'}`}>
                               {stats.actionNeeded ? 'Attention Needed' : 'On Track'}
                           </span>
                        </div>
                    </div>
                </div>
                <div className="text-right max-w-xs">
                     <p className="text-sm text-gray-600 italic">
                        "{stats.actionNeeded ? 'Identify gaps in Essential range or introduce key Expert products to increase market share.' : 'Strong portfolio coverage maintained.'}"
                     </p>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {renderProductList(essentialProducts, 'Essential Range')}
            {renderProductList(expertProducts, 'Expert Range')}
          </div>
        </div>

      </div>
    </div>
  );
};