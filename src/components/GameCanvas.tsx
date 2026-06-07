import { useRef, useEffect } from 'react';
import { useGameLoop } from '@/hooks/useGameLoop';

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useGameLoop(canvasRef);

  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      const parent = canvasRef.current.parentElement;
      if (!parent) return;
      canvasRef.current.width = parent.clientWidth;
      canvasRef.current.height = parent.clientHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ imageRendering: 'auto' }}
    />
  );
}
