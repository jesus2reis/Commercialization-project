export type PillarId = 
  | 'HD' 
  | 'HV' 
  | 'HDF' 
  | 'Personalization' 
  | 'Services' 
  | 'Sustainability' 
  | 'Digital';

export type ProductRange = 'Essential' | 'Expert';
export type ProductImportance = 'Must-have' | 'Nice-to-have';

export interface Product {
  id: string;
  name: string;
  range: ProductRange;
  importance: ProductImportance;
  pillarId: PillarId;
}

export interface MarketProductStatus {
  productId: string;
  isActive: boolean;
  notes?: string;
}

export interface MarketData {
  id: string;
  country: string;
  region: string;
  actionNeeded: boolean;
  actionNote?: string;
  completeness: number; // 0-100
  pillarStats: Record<PillarId, PillarStat>;
  products: Record<string, MarketProductStatus>; // Map productId to status
}

export interface PillarStat {
  essentialActive: boolean;
  expertActive: boolean;
  completeness: number; // 0-100
  actionNeeded: boolean;
}

export interface PillarConfig {
  id: PillarId;
  label: string;
  description: string;
}