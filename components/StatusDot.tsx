import React from 'react';

interface StatusDotProps {
  active: boolean;
  size?: 'sm' | 'md';
}

export const StatusDot: React.FC<StatusDotProps> = ({ active, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3';
  
  return (
    <div 
      className={`rounded-full ${sizeClasses} ${active ? 'bg-fmc-accent shadow-[0_0_8px_rgba(41,171,226,0.4)]' : 'bg-gray-300'}`}
      aria-label={active ? "Active" : "Inactive"}
    />
  );
};