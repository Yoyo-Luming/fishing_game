import { useGameStore } from '@/store/gameStore';

export default function GameHUD() {
  const { score, timeLeft, combo } = useGameStore();

  const minutes = Math.floor(timeLeft / 60);
  const seconds = Math.floor(timeLeft % 60);
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const comboMultiplier = combo > 0 ? (1 + (combo - 1) * 0.5).toFixed(1) : '1.0';

  return (
    <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-3 pointer-events-none">
      {/* Score */}
      <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-xl px-5 py-2.5">
        <span className="text-yellow-300 text-sm font-medium">分数</span>
        <span className="text-white text-2xl font-bold tabular-nums" style={{ fontFamily: '"Fredoka", sans-serif' }}>
          {score}
        </span>
      </div>

      {/* Combo */}
      {combo > 0 && (
        <div className="flex items-center gap-2 bg-orange-500/40 backdrop-blur-sm rounded-xl px-5 py-2.5 animate-pulse">
          <span className="text-orange-200 text-sm font-medium">连击</span>
          <span className="text-white text-xl font-bold" style={{ fontFamily: '"Fredoka", sans-serif' }}>
            x{comboMultiplier}
          </span>
          <span className="text-orange-200 text-sm">({combo})</span>
        </div>
      )}

      {/* Timer */}
      <div className={`flex items-center gap-2 backdrop-blur-sm rounded-xl px-5 py-2.5 ${
        timeLeft <= 10 ? 'bg-red-500/50 animate-pulse' : 'bg-black/30'
      }`}>
        <span className="text-sky-300 text-sm font-medium">时间</span>
        <span className={`text-2xl font-bold tabular-nums ${timeLeft <= 10 ? 'text-red-200' : 'text-white'}`}
          style={{ fontFamily: '"Fredoka", sans-serif' }}>
          {timeStr}
        </span>
      </div>
    </div>
  );
}
