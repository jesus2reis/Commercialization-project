import React from 'react';
import { MarketData, PillarConfig } from '../types';
import { ArrowLeft } from 'lucide-react';

interface HeatmapViewProps {
  markets: MarketData[];
  pillars: PillarConfig[];
  onBack: () => void;
  onMarketSelect: (marketId: string) => void;
}

export const HeatmapView: React.FC<HeatmapViewProps> = ({ markets, pillars, onBack, onMarketSelect }) => {
  
  const getColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-50 text-red-800 border-red-100'; // Softer red
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-fmc-dark">Regional Heatmap</h2>
          <p className="text-gray-500">Portfolio completeness overview across all markets.</p>
        </div>
      </div>

      <div className="bg-white border border-fmc-border rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 min-w-[200px] text-sm font-bold text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 border-r border-gray-200">
                Market / Region
              </th>
              <th className="p-4 text-center text-sm font-bold text-fmc-dark border-r border-gray-100 w-32">
                Overall
              </th>
              {pillars.map(pillar => (
                <th key={pillar.id} className="p-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[120px]">
                  {pillar.label.split('(')[0]} {/* Shorten label */}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {markets.map((market, idx) => (
              <tr key={market.id} className={`hover:bg-blue-50/50 transition-colors ${idx !== markets.length -1 ? 'border-b border-gray-100' : ''}`}>
                <td className="p-4 sticky left-0 bg-white z-10 border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                  <button 
                    onClick={() => onMarketSelect(market.id)}
                    className="flex items-center gap-3 hover:text-fmc-medium transition-colors w-full text-left group"
                  >
                    <img 
                        src={`https://flagcdn.com/w40/${market.id}.png`} 
                        alt={market.country} 
                        className="w-6 h-4 object-cover rounded shadow-sm"
                    />
                    <div>
                        <span className="block font-bold text-fmc-dark group-hover:text-fmc-medium">{market.country}</span>
                        <span className="text-xs text-gray-400 font-normal">{market.region}</span>
                    </div>
                  </button>
                </td>
                
                {/* Overall Score */}
                <td className="p-4 text-center border-r border-gray-100 bg-gray-50/30">
                   <div className="flex flex-col items-center">
                        <span className={`text-lg font-black ${market.completeness >= 80 ? 'text-green-600' : market.completeness >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
                            {market.completeness}%
                        </span>
                   </div>
                </td>

                {/* Pillar Cells */}
                {pillars.map(pillar => {
                    const stat = market.pillarStats[pillar.id];
                    return (
                        <td key={pillar.id} className="p-2 text-center">
                            <div className={`
                                mx-auto w-16 py-1.5 rounded-lg border text-sm font-bold
                                ${getColor(stat.completeness)}
                            `}>
                                {stat.completeness}%
                            </div>
                            {stat.actionNeeded && (
                                <span className="block mt-1 text-[10px] text-orange-500 font-bold uppercase tracking-tighter">Action</span>
                            )}
                        </td>
                    );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                <span className="text-sm text-gray-600">Strong Coverage (&gt;80%)</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
                <span className="text-sm text-gray-600">Moderate (50-79%)</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-50 border border-red-100 rounded"></div>
                <span className="text-sm text-gray-600">Low Coverage (&lt;50%)</span>
            </div>
      </div>
    </div>
  );
};