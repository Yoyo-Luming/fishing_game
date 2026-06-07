import { useGameStore } from '@/store/gameStore';

export default function StartScreen() {
  const setGameState = useGameStore((s) => s.setGameState);

  const handleStart = () => {
    useGameStore.getState().resetGame();
    setGameState('playing');
  };

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="text-center space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <h1
            className="text-6xl font-bold text-white drop-shadow-lg"
            style={{ fontFamily: '"Fredoka", sans-serif', textShadow: '3px 3px 0 #0369A1, 6px 6px 0 rgba(0,0,0,0.2)' }}
          >
            🎣 欢乐钓鱼
          </h1>
          <p className="text-sky-200 text-lg" style={{ fontFamily: '"Fredoka", sans-serif' }}>
            在限定时间内钓到尽可能多的高价值鱼！
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md mx-auto space-y-3 text-left">
          <h3 className="text-white font-bold text-lg text-center" style={{ fontFamily: '"Fredoka", sans-serif' }}>
            玩法说明
          </h3>
          <div className="space-y-2 text-sky-100 text-sm">
            <div className="flex items-center gap-3">
              <kbd className="bg-white/20 rounded px-2 py-1 text-white font-mono text-xs">空格</kbd>
              <span>按住空格下钩，松开收回</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">🐟</span>
              <span>钓到鱼获得对应分数</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">🔥</span>
              <span>连续钓到鱼获得连击倍率加成</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">🌊</span>
              <span>下潜越深，深度加成越高</span>
            </div>
          </div>
        </div>

        {/* Fish preview */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {[
            { emoji: '🐠', name: '小丑鱼', score: 10 },
            { emoji: '🐟', name: '蓝鲫鱼', score: 20 },
            { emoji: '🐡', name: '河豚', score: 40 },
            { emoji: '🦈', name: '鲨鱼', score: 150 },
            { emoji: '🐉', name: '金龙鱼', score: 200 },
          ].map((f) => (
            <div key={f.name} className="bg-white/10 rounded-lg px-3 py-1.5 text-center">
              <div className="text-xl">{f.emoji}</div>
              <div className="text-white text-xs">{f.name}</div>
              <div className="text-yellow-300 text-xs font-bold">{f.score}分</div>
            </div>
          ))}
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xl px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ fontFamily: '"Fredoka", sans-serif' }}
        >
          开始钓鱼 🎣
        </button>
        <p className="text-sky-300/70 text-sm">或按下空格键开始</p>
      </div>
    </div>
  );
}
