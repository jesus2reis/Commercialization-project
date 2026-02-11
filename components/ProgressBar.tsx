import React from 'react';

interface ProgressBarProps {
  percentage: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  // Determine color based on health (optional enhancement, sticking to brand blue for now)
  const barColor = 'bg-fmc-medium'; 

  return (
    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={`h-full ${barColor} transition-all duration-500 ease-out`} 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};