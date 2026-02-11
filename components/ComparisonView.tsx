import React, { useState, useEffect, useRef } from 'react';
import { MarketData, PillarConfig } from '../types';
import { ArrowLeft, Plus, X, Check, Trash2, AlertCircle, BarChart2 } from 'lucide-react';

interface ComparisonViewProps {
  markets: MarketData[];
  pillars: PillarConfig[];
  initialMarketId?: string;
  onBack: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ markets, pillars, initialMarketId, onBack }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with initial market + 1 other (if available) or just initial
    if (initialMarketId && !selectedIds.includes(initialMarketId)) {
       const initialSelection = [initialMarketId];
       // Try to add a second market for immediate comparison if not already selected
       const secondMarket = markets.find(m => m.id !== initialMarketId);
       if (secondMarket && initialSelection.length < 2) {
           initialSelection.push(secondMarket.id);
       }
       setSelectedIds(initialSelection);
    } else if (selectedIds.length === 0 && markets.length > 0) {
        // Default fallbacks
        setSelectedIds(markets.slice(0, 2).map(m => m.id));
    }
  }, [initialMarketId, markets]); // Only run on mount or when markets change effectively

  // Close selector on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsSelectorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMarket = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(m => m !== id));
    } else {
      if (selectedIds.length >= 4) return; // Max 4
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const selectedMarkets = markets.filter(m => selectedIds.includes(m.id));

  return (
    <div className="w-full h-[calc(100vh-80px)] flex flex-col max-w-7xl mx-auto px-6 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 flex-shrink-0">
        <div className="flex items-center gap-4">
            <button 
                onClick={onBack}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
            >
                <ArrowLeft size={24} />
            </button>
            <div>
                <h2 className="text-2xl font-bold text-fmc-dark">Market Comparison</h2>
                <p className="text-gray-500">Analyze portfolio gaps side-by-side.</p>
            </div>
        </div>

        {/* Market Selector Controls */}
        <div className="flex items-center gap-3">
             {selectedIds.length > 0 && (
                <button 
                    onClick={() => setSelectedIds([])}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
                    title="Clear all"
                >
                    <Trash2 size={16} />
                    <span className="hidden md:inline">Clear</span>
                </button>
             )}

            <div className="relative" ref={selectorRef}>
                <button 
                    onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-sm font-medium transition-all border
                        ${isSelectorOpen 
                            ? 'bg-white border-fmc-medium text-fmc-medium ring-2 ring-fmc-medium/20' 
                            : 'bg-fmc-medium border-transparent text-white hover:bg-blue-800'}
                    `}
                >
                    <Plus size={18} />
                    Manage Markets ({selectedIds.length}/4)
                </button>

                {isSelectorOpen && (
                    <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in zoom-in-95 duration-200 origin-top-right">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select up to 4</span>
                            <span className="text-xs text-fmc-medium font-bold">{selectedIds.length} Selected</span>
                        </div>
                        <div className="max-h-80 overflow-y-auto custom-scrollbar p-2">
                            {markets.map(m => {
                                const isSelected = selectedIds.includes(m.id);
                                const isDisabled = !isSelected && selectedIds.length >= 4;
                                return (
                                    <button
                                        key={m.id}
                                        onClick={() => toggleMarket(m.id)}
                                        disabled={isDisabled}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg text-sm transition-all mb-1 ${
                                            isSelected 
                                                ? 'bg-blue-50 border border-blue-100' 
                                                : isDisabled 
                                                    ? 'opacity-40 cursor-not-allowed'
                                                    : 'hover:bg-gray-50 border border-transparent'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-fmc-medium bg-fmc-medium' : 'border-gray-300 bg-white'}`}>
                                                {isSelected && <Check size={10} className="text-white" />}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <img src={`https://flagcdn.com/w40/${m.id}.png`} className="w-5 h-3.5 object-cover rounded shadow-sm" />
                                                <span className={`font-medium ${isSelected ? 'text-fmc-dark' : 'text-gray-600'}`}>{m.country}</span>
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <span className="text-xs font-bold text-fmc-medium">{m.completeness}%</span>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Comparison Table Container */}
      <div className="flex-1 bg-white border border-fmc-border rounded-xl shadow-sm overflow-hidden flex flex-col relative">
        {selectedMarkets.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-60">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <BarChart2 size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-700 mb-2">No Markets Selected</h3>
                <p className="text-gray-500 max-w-sm mx-auto">Select at least one market using the "Manage Markets" button to start comparing portfolio coverage.</p>
            </div>
        ) : (
            <div className="flex-1 overflow-auto custom-scrollbar relative">
                <table className="w-full min-w-[max(800px,100%)] border-separate border-spacing-0">
                    <thead className="sticky top-0 z-30">
                        <tr>
                            {/* Empty Corner Cell */}
                            <th className="sticky left-0 top-0 z-40 w-64 p-4 bg-white border-b border-r border-gray-200 shadow-sm">
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider text-left pl-2">
                                    Strategic Pillars
                                </span>
                            </th>
                            
                            {/* Market Headers */}
                            {selectedMarkets.map(market => (
                                <th key={market.id} className="p-0 border-b border-gray-200 bg-gray-50 min-w-[200px] w-1/4">
                                    <div className="p-6 flex flex-col items-center gap-3 relative overflow-hidden group">
                                        {/* Remove Button Overlay */}
                                        <button 
                                            onClick={() => toggleMarket(market.id)}
                                            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/50 hover:bg-white text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Remove market"
                                        >
                                            <X size={14} />
                                        </button>

                                        <img src={`https://flagcdn.com/w40/${market.id}.png`} className="w-12 h-8 object-cover rounded shadow-md" />
                                        
                                        <div className="text-center">
                                            <h3 className="text-lg font-bold text-fmc-dark leading-tight">{market.country}</h3>
                                            <span className="text-xs text-gray-500 font-medium">{market.region}</span>
                                        </div>

                                        <div className={`mt-2 px-3 py-1 rounded-full text-sm font-bold border ${
                                            market.completeness >= 80 
                                                ? 'bg-green-50 text-green-700 border-green-100' 
                                                : market.completeness >= 50
                                                    ? 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                                    : 'bg-red-50 text-red-700 border-red-100'
                                        }`}>
                                            {market.completeness}% Coverage
                                        </div>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pillars.map((pillar) => (
                            <tr key={pillar.id} className="hover:bg-gray-50 transition-colors">
                                {/* Sticky Pillar Row Header */}
                                <td className="sticky left-0 z-20 bg-white p-6 border-b border-r border-gray-100 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)] w-64 max-w-xs align-top">
                                    <h4 className="font-bold text-fmc-dark text-base mb-1">{pillar.label}</h4>
                                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                                        {pillar.description}
                                    </p>
                                </td>

                                {/* Market Data Cells */}
                                {selectedMarkets.map(market => {
                                    const stats = market.pillarStats[pillar.id];
                                    return (
                                        <td key={`${market.id}-${pillar.id}`} className="p-6 border-b border-r border-gray-100 border-dashed last:border-r-0 align-top">
                                            <div className="flex flex-col items-center gap-4 h-full">
                                                
                                                {/* Visual Bar Graph (Replacing Circle) */}
                                                <div className="w-full text-center mb-2">
                                                    <span className="text-2xl font-black text-fmc-dark block mb-2">{stats.completeness}%</span>
                                                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full ${stats.completeness >= 80 ? 'bg-green-500' : stats.completeness >= 50 ? 'bg-fmc-medium' : 'bg-red-500'}`} 
                                                            style={{ width: `${stats.completeness}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Mini Stats */}
                                                <div className="w-full grid grid-cols-2 gap-2 text-xs">
                                                    <div className={`p-2 rounded text-center border ${stats.essentialActive ? 'bg-blue-50 border-blue-100 text-fmc-dark' : 'bg-red-50 border-red-100 text-red-400 opacity-60'}`}>
                                                        <span className="block font-bold uppercase text-[10px]">Essential</span>
                                                        <span className="block font-bold">{stats.essentialActive ? 'Yes' : 'No'}</span>
                                                    </div>
                                                    <div className={`p-2 rounded text-center border ${stats.expertActive ? 'bg-blue-50 border-blue-100 text-fmc-dark' : 'bg-gray-50 border-gray-100 text-gray-400 opacity-60'}`}>
                                                        <span className="block font-bold uppercase text-[10px]">Expert</span>
                                                        <span className="block font-bold">{stats.expertActive ? 'Yes' : 'No'}</span>
                                                    </div>
                                                </div>

                                                {/* Gap Alert */}
                                                {stats.actionNeeded ? (
                                                     <div className="mt-auto w-full flex items-center justify-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1.5 rounded border border-orange-100">
                                                        <AlertCircle size={12} />
                                                        <span className="text-[10px] uppercase font-bold tracking-wider">Gap Found</span>
                                                    </div>
                                                ) : (
                                                    <div className="mt-auto min-h-[26px]"></div>
                                                )}

                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
};