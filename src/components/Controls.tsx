import React from 'react';
import { RotateCcw, RotateCw, Rocket } from 'lucide-react';

interface ControlsProps {
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onShootStart: () => void;
  onShootEnd: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  onRotateLeft,
  onRotateRight,
  onShootStart,
  onShootEnd,
}) => {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
      <button
        className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
        onMouseDown={onRotateLeft}
      >
        <RotateCcw size={24} />
      </button>
      <button
        className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 active:bg-red-800 transition-colors"
        onMouseDown={onShootStart}
        onMouseUp={onShootEnd}
        onMouseLeave={onShootEnd}
        onTouchStart={onShootStart}
        onTouchEnd={onShootEnd}
      >
        <Rocket size={32} />
      </button>
      <button
        className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
        onMouseDown={onRotateRight}
      >
        <RotateCw size={24} />
      </button>
    </div>
  );
};