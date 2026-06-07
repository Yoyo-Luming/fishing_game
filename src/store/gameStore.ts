import { create } from 'zustand';
import { GameState, CaughtFishRecord } from '@/game/types';

interface GameStore {
  gameState: GameState;
  score: number;
  timeLeft: number;
  combo: number;
  caughtFish: CaughtFishRecord[];
  lastCatchScore: number;
  lastCatchCombo: number;

  setGameState: (state: GameState) => void;
  setScore: (score: number) => void;
  setTimeLeft: (time: number) => void;
  addCombo: () => void;
  resetCombo: () => void;
  addCaughtFish: (record: CaughtFishRecord) => void;
  setLastCatch: (score: number, combo: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: 'idle',
  score: 0,
  timeLeft: 90,
  combo: 0,
  caughtFish: [],
  lastCatchScore: 0,
  lastCatchCombo: 0,

  setGameState: (gameState) => set({ gameState }),
  setScore: (score) => set({ score }),
  setTimeLeft: (timeLeft) => set({ timeLeft }),
  addCombo: () => set((s) => ({ combo: s.combo + 1 })),
  resetCombo: () => set({ combo: 0 }),
  addCaughtFish: (record) =>
    set((s) => ({ caughtFish: [...s.caughtFish, record] })),
  setLastCatch: (score, combo) => set({ lastCatchScore: score, lastCatchCombo: combo }),
  resetGame: () =>
    set({
      gameState: 'idle',
      score: 0,
      timeLeft: 90,
      combo: 0,
      caughtFish: [],
      lastCatchScore: 0,
      lastCatchCombo: 0,
    }),
}));
