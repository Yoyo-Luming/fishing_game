import { useRef, useCallback, useEffect } from 'react';
import { GameScene } from '@/game/types';
import { createScene, resetScene, updateScene, EngineCallbacks } from '@/game/engine';
import { render } from '@/game/renderer';
import { useGameStore } from '@/store/gameStore';
import { WATER_LEVEL_RATIO, HOOK_X_RATIO } from '@/game/constants';

export function useGameLoop(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const sceneRef = useRef<GameScene | null>(null);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const spacePressedRef = useRef<boolean>(false);
  const hookWentDeepRef = useRef<boolean>(false);

  const setGameState = useGameStore((s) => s.setGameState);
  const setScore = useGameStore((s) => s.setScore);
  const setTimeLeft = useGameStore((s) => s.setTimeLeft);
  const addCombo = useGameStore((s) => s.addCombo);
  const resetCombo = useGameStore((s) => s.resetCombo);
  const addCaughtFish = useGameStore((s) => s.addCaughtFish);
  const setLastCatch = useGameStore((s) => s.setLastCatch);

  const initScene = useCallback((width: number, height: number) => {
    sceneRef.current = createScene(width, height);
  }, []);

  const gameLoop = useCallback(
    (timestamp: number) => {
      if (!sceneRef.current || !canvasRef.current) return;

      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = timestamp;
      if (dt <= 0) {
        animFrameRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      const scene = sceneRef.current;
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      const callbacks: EngineCallbacks = {
        onScoreUpdate: (_baseScore, _combo, _depthBonus, totalScore, fish) => {
          const state = useGameStore.getState();
          setScore(state.score + totalScore);
          addCombo();
          setLastCatch(totalScore, state.combo + 1);
          addCaughtFish({
            typeName: fish.type.name,
            typeNameEn: fish.type.nameEn,
            score: totalScore,
            timestamp: Date.now(),
          });
        },
        onTimeUpdate: (timeLeft) => {
          setTimeLeft(timeLeft);
        },
        onGameEnd: () => {
          setGameState('ended');
        },
      };

      const combo = useGameStore.getState().combo;
      const timeLeft = updateScene(scene, dt, spacePressedRef.current, combo, callbacks);

      // Track if hook went deep (below surface + margin)
      if (scene.hook.y > scene.waterLevel + 20) {
        hookWentDeepRef.current = true;
      }

      // Reset combo if hook returned to surface without catch
      if (
        hookWentDeepRef.current &&
        scene.hook.y <= scene.waterLevel + 2 &&
        !scene.hook.hasCatch
      ) {
        hookWentDeepRef.current = false;
        if (useGameStore.getState().combo > 0) {
          resetCombo();
        }
      }

      if (timeLeft <= 0) {
        setGameState('ended');
        render(ctx, scene);
        return;
      }

      render(ctx, scene);
      animFrameRef.current = requestAnimationFrame(gameLoop);
    },
    [canvasRef, setGameState, setScore, setTimeLeft, addCombo, resetCombo, addCaughtFish, setLastCatch]
  );

  const startGame = useCallback(() => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    canvasRef.current.width = w;
    canvasRef.current.height = h;

    if (!sceneRef.current) {
      initScene(w, h);
    } else {
      resetScene(sceneRef.current);
      sceneRef.current.canvasWidth = w;
      sceneRef.current.canvasHeight = h;
      sceneRef.current.waterLevel = h * WATER_LEVEL_RATIO;
      sceneRef.current.hook.x = w * HOOK_X_RATIO;
    }

    hookWentDeepRef.current = false;
    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(gameLoop);
  }, [canvasRef, initScene, gameLoop]);

  const stopGame = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = 0;
    }
  }, []);

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        spacePressedRef.current = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        spacePressedRef.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const gameState = useGameStore((s) => s.gameState);

  // Start/stop based on gameState
  useEffect(() => {
    if (gameState === 'playing') {
      startGame();
    } else {
      stopGame();
    }
    return () => stopGame();
  }, [gameState, startGame, stopGame]);

  return { startGame, stopGame };
}
