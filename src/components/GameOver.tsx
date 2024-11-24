import React from 'react';
import { useGameStore } from '../store/gameStore';

interface GameOverProps {
  score: number;
}

export const GameOver: React.FC<GameOverProps> = ({ score }) => {
  const resetGame = useGameStore(state => state.resetGame);

  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
        <p className="text-xl mb-4">Final Score: {score}</p>
        <button
          onClick={resetGame}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};