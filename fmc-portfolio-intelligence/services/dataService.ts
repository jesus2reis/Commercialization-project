import { MarketData, PillarConfig, PillarId, Product, MarketProductStatus } from '../types';

// --- Static Definitions ---

export const PILLARS: PillarConfig[] = [
  { id: 'HD', label: 'Hemodialysis (HD)', description: 'Core HD treatment therapies.' },
  { id: 'HV', label: 'High Volume (HV)', description: 'High volume fluid therapies.' },
  { id: 'HDF', label: 'Hemodiafiltration (HDF)', description: 'Advanced HDF modalities.' },
  { id: 'Personalization', label: 'Personalization', description: 'Patient-specific treatment options.' },
  { id: 'Services', label: 'Services', description: 'Technical and application consultancy.' },
  { id: 'Sustainability', label: 'Sustainability', description: 'Eco-friendly and efficient solutions.' },
  { id: 'Digital', label: 'Digital', description: 'Connected health and data solutions.' },
];

export const PRODUCTS: Product[] = [
  // HD
  { id: 'hd-1', name: '4008S Classix', range: 'Essential', importance: 'Must-have', pillarId: 'HD' },
  { id: 'hd-2', name: 'Dialyzer Low-Flux', range: 'Essential', importance: 'Must-have', pillarId: 'HD' },
  { id: 'hd-3', name: '5008S CorDiax', range: 'Expert', importance: 'Must-have', pillarId: 'HD' },
  { id: 'hd-4', name: 'FX Classix Dialyzer', range: 'Expert', importance: 'Nice-to-have', pillarId: 'HD' },
  // HDF
  { id: 'hdf-1', name: 'Online HDF Kit', range: 'Essential', importance: 'Must-have', pillarId: 'HDF' },
  { id: 'hdf-2', name: '5008S HDF System', range: 'Expert', importance: 'Must-have', pillarId: 'HDF' },
  // Digital
  { id: 'dig-1', name: 'Therapy Data Management', range: 'Essential', importance: 'Must-have', pillarId: 'Digital' },
  { id: 'dig-2', name: 'SmartCare Analytics', range: 'Expert', importance: 'Nice-to-have', pillarId: 'Digital' },
  { id: 'dig-3', name: 'Patient App', range: 'Expert', importance: 'Nice-to-have', pillarId: 'Digital' },
  // Services
  { id: 'srv-1', name: 'Technical Training', range: 'Essential', importance: 'Must-have', pillarId: 'Services' },
  { id: 'srv-2', name: 'Application Consultancy', range: 'Expert', importance: 'Nice-to-have', pillarId: 'Services' },
  // Sustainability
  { id: 'sus-1', name: 'Eco-Mode Software', range: 'Essential', importance: 'Must-have', pillarId: 'Sustainability' },
  { id: 'sus-2', name: 'Water Saving Kit', range: 'Expert', importance: 'Nice-to-have', pillarId: 'Sustainability' },
  // HV
  { id: 'hv-1', name: 'Standard Volume Lines', range: 'Essential', importance: 'Must-have', pillarId: 'HV' },
  { id: 'hv-2', name: 'High Volume Substituate', range: 'Expert', importance: 'Must-have', pillarId: 'HV' },
  // Personalization
  { id: 'per-1', name: 'Profile Adjustments', range: 'Essential', importance: 'Must-have', pillarId: 'Personalization' },
  { id: 'per-2', name: 'Biofeedback Loops', range: 'Expert', importance: 'Nice-to-have', pillarId: 'Personalization' },
];

// --- Mock Market Data ---

const createMockMarket = (
  id: string, 
  country: string, 
  region: string, 
  completeness: number, 
  actionNeeded: boolean,
  overrides: Record<string, boolean> = {}
): MarketData => {
  
  // Auto-generate status based on a "seed" logic to save manual typing
  const productStatus: Record<string, MarketProductStatus> = {};
  
  PRODUCTS.forEach(p => {
    // Default logic: wealthier markets have everything, emerging have essentials
    let isActive = false;
    
    if (completeness > 80) isActive = true; // High completeness
    else if (completeness > 50) isActive = p.range === 'Essential'; // Mid completeness
    else isActive = p.range === 'Essential' && p.importance === 'Must-have'; // Low completeness

    // Randomize slightly
    if (Math.random() > 0.9) isActive = !isActive;

    // Apply explicit overrides
    if (overrides[p.id] !== undefined) isActive = overrides[p.id];

    productStatus[p.id] = {
      productId: p.id,
      isActive,
      notes: isActive ? 'Available via distribution' : 'Regulatory approval pending'
    };
  });

  // Calculate Aggregated Pillar Stats
  const pillarStats: any = {};
  
  PILLARS.forEach(pillar => {
    const productsInPillar = PRODUCTS.filter(p => p.pillarId === pillar.id);
    const activeProducts = productsInPillar.filter(p => productStatus[p.id].isActive);
    const essential = productsInPillar.filter(p => p.range === 'Essential');
    const expert = productsInPillar.filter(p => p.range === 'Expert');

    const essentialActiveCount = essential.filter(p => productStatus[p.id].isActive).length;
    const expertActiveCount = expert.filter(p => productStatus[p.id].isActive).length;

    const pillarCompleteness = productsInPillar.length > 0 
      ? Math.round((activeProducts.length / productsInPillar.length) * 100) 
      : 0;

    // Logic for Action Needed: If Essential is missing items OR Expert is totally empty
    const localActionNeeded = (essential.length > 0 && essentialActiveCount < essential.length) || (expert.length > 0 && expertActiveCount === 0);

    pillarStats[pillar.id] = {
      essentialActive: essentialActiveCount > 0,
      expertActive: expertActiveCount > 0,
      completeness: pillarCompleteness,
      actionNeeded: localActionNeeded
    };
  });

  return {
    id,
    country,
    region,
    actionNeeded,
    actionNote: actionNeeded ? 'Introduce selected Expert products' : undefined,
    completeness,
    pillarStats,
    products: productStatus
  };
};

// Simulate the CSV data provided in the prompt
const MOCK_MARKETS: MarketData[] = [
  createMockMarket('kh', 'Cambodia', 'APAC', 45, true, { 'hd-3': false, 'dig-1': false }),
  createMockMarket('th', 'Thailand', 'APAC', 75, true),
  createMockMarket('vn', 'Vietnam', 'APAC', 60, true),
  createMockMarket('my', 'Malaysia', 'APAC', 85, false),
  createMockMarket('ph', 'Philippines', 'APAC', 65, true),
  createMockMarket('de', 'Germany', 'EMEA', 98, false),
  createMockMarket('us', 'United States', 'NA', 95, false),
];

export const getMarkets = async (): Promise<MarketData[]> => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_MARKETS), 500);
  });
};

export const getProductsByPillar = (pillarId: PillarId): Product[] => {
  return PRODUCTS.filter(p => p.pillarId === pillarId);
};