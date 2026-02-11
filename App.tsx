import React, { useEffect, useState } from 'react';
import { getMarkets, getProductsByPillar, PILLARS } from './services/dataService';
import { MarketData, PillarConfig } from './types';
import { PillarRow } from './components/PillarRow';
import { PillarDetail } from './components/PillarDetail';
import { FmcFullLogo, FmcIcon } from './components/FmcLogo';
import { Search, ChevronDown, BarChart3, LayoutGrid, X } from 'lucide-react';

const App: React.FC = () => {
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [selectedMarketId, setSelectedMarketId] = useState<string>('');
  const [selectedPillar, setSelectedPillar] = useState<PillarConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await getMarkets();
      setMarkets(data);
      // Removed default selection to show landing page first
      setIsLoading(false);
    };
    loadData();
  }, []);

  const currentMarket = markets.find(m => m.id === selectedMarketId);
  
  const filteredMarkets = markets.filter(m => 
    m.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePillarClick = (pillar: PillarConfig) => {
    setSelectedPillar(pillar);
  };

  const handleMarketSelect = (id: string) => {
    setSelectedMarketId(id);
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  const clearSelection = () => {
    setSelectedMarketId('');
    setSelectedPillar(null);
  }

  // --- Render: Loading State ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6F8]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fmc-medium"></div>
      </div>
    );
  }

  // --- Render: Landing Page (No Market Selected) ---
  if (!currentMarket) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-fmc-neutral font-sans text-fmc-dark p-6 relative overflow-hidden">
         {/* Background Decoration */}
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-fmc-dark via-fmc-medium to-fmc-accent"></div>
         <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
         <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

         <div className="z-10 w-full max-w-lg text-center animate-in zoom-in-95 duration-500">
            <div className="mb-12 flex justify-center">
                {/* Full Logo Implementation */}
                <FmcFullLogo />
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-medium text-gray-500 uppercase tracking-widest mb-2">
                    Commercialization Strategy
                </h2>
                <p className="text-gray-400">
                    Select a market to analyze portfolio coverage.
                </p>
            </div>

            {/* Large Central Selector */}
            <div className="relative">
                <div 
                    className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100 flex items-center transition-all focus-within:ring-2 focus-within:ring-fmc-accent focus-within:border-transparent"
                >
                    <Search className="ml-4 text-gray-400" size={24} />
                    <input 
                        type="text"
                        placeholder="Search for a country..."
                        className="w-full p-4 text-lg outline-none text-fmc-dark placeholder:text-gray-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>

                {/* Dropdown Results */}
                <div className="mt-4 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden max-h-80 overflow-y-auto custom-scrollbar text-left">
                    {(searchTerm ? filteredMarkets : markets).map(market => (
                        <button
                            key={market.id}
                            onClick={() => handleMarketSelect(market.id)}
                            className="w-full flex items-center justify-between px-6 py-4 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0 group"
                        >
                            <div className="flex items-center gap-4">
                                <img 
                                    src={`https://flagcdn.com/w40/${market.id}.png`} 
                                    alt={market.country}
                                    className="w-8 h-6 object-cover rounded shadow-sm"
                                />
                                <span className="font-semibold text-lg text-gray-700 group-hover:text-fmc-medium">
                                    {market.country}
                                </span>
                            </div>
                            <span className={`text-sm font-bold ${market.completeness > 80 ? 'text-green-600' : 'text-gray-400'}`}>
                                {market.completeness}%
                            </span>
                        </button>
                    ))}
                    {filteredMarkets.length === 0 && (
                        <div className="p-8 text-center text-gray-400 italic">No markets found matching "{searchTerm}"</div>
                    )}
                </div>
            </div>
         </div>
         
         <div className="absolute bottom-8 text-center text-xs text-gray-400 uppercase tracking-widest">
            Fresenius Medical Care &bull; Internal Use Only
         </div>
      </div>
    );
  }

  // --- Render: Dashboard (Market Selected) ---
  return (
    <div className="min-h-screen flex flex-col font-sans text-fmc-dark bg-[#F4F6F8]">
      
      {/* --- Navbar --- */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
             <div 
                onClick={clearSelection} 
                className="cursor-pointer flex items-center gap-3 group"
             >
                {/* Header Icon Implementation */}
                <div className="w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-105">
                   <FmcIcon className="w-full h-full" />
                </div>
                <div>
                    <h1 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Commercialization</h1>
                    <span className="font-bold text-xl text-fmc-dark leading-none block">Strategy Tool</span>
                </div>
             </div>

             {/* Divider */}
             <div className="h-10 w-px bg-gray-200 hidden md:block"></div>

             {/* Compact Market Selector */}
             <div className="relative hidden md:block">
                <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors border border-gray-200"
                >
                    <img 
                        src={`https://flagcdn.com/w40/${currentMarket.id}.png`} 
                        alt="Flag" 
                        className="w-6 h-4 object-cover rounded shadow-sm"
                    />
                    <span className="font-bold text-fmc-dark">{currentMarket.country}</span>
                    <ChevronDown size={14} className="text-gray-400" />
                </button>
                
                {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                        <div className="max-h-60 overflow-y-auto">
                            {markets.map(market => (
                                <button
                                    key={market.id}
                                    onClick={() => handleMarketSelect(market.id)}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left text-sm"
                                >
                                    <img src={`https://flagcdn.com/w40/${market.id}.png`} className="w-5 h-3.5 object-cover rounded" />
                                    <span className="flex-1 font-medium text-gray-700">{market.country}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             {/* Mobile Market Name if Compact Selector Hidden */}
             <div className="md:hidden font-bold text-fmc-dark flex items-center gap-2">
                <img src={`https://flagcdn.com/w40/${currentMarket.id}.png`} className="w-6 h-4 object-cover rounded" />
                {currentMarket.country}
             </div>

             <div className="hidden md:flex items-center gap-4">
                <button className="text-sm font-medium text-gray-500 hover:text-fmc-medium transition-colors">Comparison</button>
                <button className="text-sm font-medium text-gray-500 hover:text-fmc-medium transition-colors">Heatmap</button>
             </div>
          </div>
        </div>
      </header>

      {/* --- Main Content List --- */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Section for Page */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
                <h2 className="text-2xl font-bold text-fmc-dark mb-2">Portfolio Overview</h2>
                <p className="text-gray-500 max-w-2xl">
                    Analyze coverage across the 6 strategic pillars. Detailed product availability is shown below. 
                    <span className="hidden md:inline"> Click a row to view full details and notes.</span>
                </p>
            </div>
            
            <div className="flex items-center gap-6 bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Market Score</span>
                    <span className={`text-xl font-black ${currentMarket.completeness >= 80 ? 'text-green-600' : 'text-fmc-medium'}`}>
                        {currentMarket.completeness}%
                    </span>
                </div>
                <div className="w-px h-8 bg-gray-100"></div>
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Action</span>
                    <span className={`text-sm font-bold ${currentMarket.actionNeeded ? 'text-orange-500' : 'text-green-600'}`}>
                        {currentMarket.actionNeeded ? 'Required' : 'None'}
                    </span>
                </div>
            </div>
        </div>
        
        {/* List of Pillar Rows */}
        <div className="space-y-4">
            {PILLARS.map(pillar => (
                <PillarRow 
                    key={pillar.id}
                    config={pillar}
                    market={currentMarket}
                    products={getProductsByPillar(pillar.id)}
                    stats={currentMarket.pillarStats[pillar.id]}
                    onClick={() => handlePillarClick(pillar)}
                />
            ))}
        </div>
      </main>

      {/* --- Detail Overlay --- */}
      {selectedPillar && (
        <PillarDetail 
            market={currentMarket}
            pillar={selectedPillar}
            onClose={() => setSelectedPillar(null)}
        />
      )}

    </div>
  );
};

export default App;