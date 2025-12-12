import React from 'react';
import { Phone } from 'lucide-react';

interface EmergencyButtonProps {
  number: string;
  label: string;
  subLabel?: string;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({ number, label, subLabel }) => {
  return (
    <a
      href={`tel:${number}`}
      className="flex flex-col items-center justify-center bg-red-600 hover:bg-red-700 active:bg-red-800 text-white p-4 rounded-xl shadow-lg transition-transform transform active:scale-95 w-full border-2 border-red-500"
    >
      <div className="flex items-center gap-2 mb-1">
        <Phone className="w-6 h-6 animate-pulse" />
        <span className="text-2xl font-bold">{number}</span>
      </div>
      <span className="text-lg font-semibold">{label}</span>
      {subLabel && <span className="text-xs opacity-80">{subLabel}</span>}
    </a>
  );
};
