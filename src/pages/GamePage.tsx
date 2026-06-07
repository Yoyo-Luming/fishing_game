import { useEffect } from 'react';
import GameCanvas from '@/components/GameCanvas';
import GameHUD from '@/components/GameHUD';
import StartScreen from '@/components/StartScreen';
import ResultScreen from '@/components/ResultScreen';
import { useGameStore } from '@/store/gameStore';

export default function GamePage() {
  const { gameState } = useGameStore();
  const setGameState = useGameStore((s) => s.setGameState);

  // Listen for space to start from idle
  useEffect(() => {
    if (gameState !== 'idle') return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        useGameStore.getState().resetGame();
        setGameState('playing');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState, setGameState]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <GameCanvas />

      {gameState === 'playing' && <GameHUD />}
      {gameState === 'idle' && <StartScreen />}
      {gameState === 'ended' && <ResultScreen />}

      {/* Mobile touch control */}
      {gameState === 'playing' && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 md:hidden">
          <button
            className="bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full active:bg-white/40 select-none"
            onTouchStart={(e) => {
              e.preventDefault();
              window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space' }));
            }}
          >
            按住下钩
          </button>
        </div>
      )}
    </div>
  );
}
