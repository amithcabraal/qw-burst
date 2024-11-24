import { create } from 'zustand';
import { Prize } from '../types';

interface GameState {
  score: number;
  gameOver: boolean;
  prizes: Prize[];
  addPrize: (prize: Prize) => void;
  setGameOver: (value: boolean) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  gameOver: false,
  prizes: [],
  addPrize: (prize) => set((state) => {
    const newPrizes = [...state.prizes, prize].slice(-3);
    const newScore = state.score + 10;
    
    // Check for matching prizes
    if (newPrizes.length === 3 && 
        newPrizes.every(p => p.symbol === newPrizes[0].symbol)) {
      return {
        prizes: [],
        score: newScore + 100,
      };
    }
    
    return {
      prizes: newPrizes,
      score: newScore,
    };
  }),
  setGameOver: (value) => set({ gameOver: value }),
  resetGame: () => set({ score: 0, gameOver: false, prizes: [] }),
}));