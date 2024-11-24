import React from 'react';
import { Prize } from '../types';

interface PrizeDisplayProps {
  prizes: Prize[];
}

export const PrizeDisplay: React.FC<PrizeDisplayProps> = ({ prizes }) => {
  return (
    <div className="absolute top-4 right-4 flex gap-2">
      {prizes.map((prize, index) => (
        <div
          key={index}
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
          style={{ backgroundColor: prize.color }}
        >
          {prize.symbol}
        </div>
      ))}
    </div>
  );
};