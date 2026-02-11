import React from 'react';
import { PillarConfig, PillarStat } from '../types';
import { ProgressBar } from './ProgressBar';
import { StatusDot } from './StatusDot';
import { AlertCircle, ChevronRight } from 'lucide-react';

interface PillarCardProps {
  config: PillarConfig;
  stats: PillarStat;
  onClick: () => void;
}

export const PillarCard: React.FC<PillarCardProps> = ({ config, stats, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="group relative flex flex-col justify-between w-full bg-white border border-fmc-border rounded-xl p-6 text-left hover:shadow-lg hover:border-fmc-accent transition-all duration-300 h-[240px]"
    >
      {/* Action Badge */}
      {stats.actionNeeded && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-orange-50 text-orange-600 px-2 py-1 rounded-md border border-orange-100">
          <AlertCircle size={14} />
          <span className="text-[10px] uppercase font-bold tracking-wider">Action</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-fmc-dark mb-1 group-hover:text-fmc-medium transition-colors">
          {config.label}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">
          {config.description}
        </p>
      </div>

      {/* Stats Block */}
      <div className="space-y-4">
        {/* Availability Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <StatusDot active={stats.essentialActive} />
            <span className={`text-xs uppercase font-semibold tracking-wide ${stats.essentialActive ? 'text-gray-700' : 'text-gray-400'}`}>
              Essential
            </span>
          </div>
          <div className="flex items-center gap-2">
            <StatusDot active={stats.expertActive} />
            <span className={`text-xs uppercase font-semibold tracking-wide ${stats.expertActive ? 'text-gray-700' : 'text-gray-400'}`}>
              Expert
            </span>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between items-end mb-1.5">
            <span className="text-xs text-gray-400 font-medium">Completeness</span>
            <span className="text-sm font-bold text-fmc-dark">{stats.completeness}%</span>
          </div>
          <ProgressBar percentage={stats.completeness} />
        </div>
      </div>
      
      {/* Hover visual cue */}
      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1">
         <ChevronRight className="text-fmc-accent" size={20} />
      </div>
    </button>
  );
};