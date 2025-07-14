import React from "react";

interface UvGaugeProps {
  value: number; // Range: 0–12
}

const UvGauge: React.FC<UvGaugeProps> = ({ value }) => {
  const clampedValue = Math.min(Math.max(value || 0, 0), 12);
  
  const getColor = (val: number) => {
    if (val <= 2) return "#10b981"; // Green
    if (val <= 5) return "#f59e0b"; // Orange/Yellow
    if (val <= 7) return "#f97316"; // Orange
    return "#dc2626"; // Red
  };

  // Calculate percentage for the progress
  const percentage = (clampedValue / 12) * 100;
  const radius = 40;
  const circumference = Math.PI * radius; // Half circle
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="100" height="60" viewBox="0 0 100 60" className="transform">
          {/* Background arc */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
            strokeLinecap="round"
          />
          
          {/* Progress arc */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke={getColor(clampedValue)}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 0.5s ease-in-out'
            }}
          />
        </svg>
        
        {/* Center value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span 
            className="text-2xl font-bold" 
            style={{ color: '#374151', marginTop: '10px' }}
          >
            {clampedValue}
          </span>
        </div>
      </div>
      
      {/* Scale markers */}
      <div className="flex justify-between w-20 text-xs text-gray-400 mt-1">
        <span>0</span>
        <span>11+</span>
      </div>
    </div>
  );
};

export default UvGauge;
