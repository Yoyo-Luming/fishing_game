import { useGameStore } from '@/store/gameStore';
import { FISH_TYPES } from '@/game/constants';

export default function ResultScreen() {
  const { score, caughtFish, setGameState, resetGame } = useGameStore();

  const fishCountMap: Record<string, { count: number; totalScore: number; name: string }> = {};
  for (const f of caughtFish) {
    if (!fishCountMap[f.typeNameEn]) {
      fishCountMap[f.typeNameEn] = { count: 0, totalScore: 0, name: f.typeName };
    }
    fishCountMap[f.typeNameEn].count++;
    fishCountMap[f.typeNameEn].totalScore += f.score;
  }

  const fishEmojiMap: Record<string, string> = {
    clownfish: '🐠',
    blueCrucian: '🐟',
    goldfish: '✨',
    pufferfish: '🐡',
    swordfish: '⚔️',
    shark: '🦈',
    goldenDragon: '🐉',
  };

  const handleRestart = () => {
    resetGame();
    setGameState('playing');
  };

  const handleHome = () => {
    resetGame();
  };

  // Calculate rating
  let rating = '🎣 初级钓手';
  if (score >= 2000) rating = '👑 钓鱼之王';
  else if (score >= 1000) rating = '🏆 钓鱼大师';
  else if (score >= 500) rating = '⭐ 高级钓手';
  else if (score >= 200) rating = '🎣 中级钓手';

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-sky-900/90 to-blue-950/95 rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl border border-white/10">
        <div className="text-center space-y-5">
          {/* Title */}
          <h2
            className="text-4xl font-bold text-white"
            style={{ fontFamily: '"Fredoka", sans-serif', textShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}
          >
            钓鱼结束！
          </h2>

          {/* Rating */}
          <div className="text-2xl" style={{ fontFamily: '"Fredoka", sans-serif' }}>
            {rating}
          </div>

          {/* Score */}
          <div className="bg-black/30 rounded-2xl p-5">
            <div className="text-sky-300 text-sm mb-1">总得分</div>
            <div
              className="text-5xl font-bold text-yellow-300"
              style={{ fontFamily: '"Fredoka", sans-serif' }}
            >
              {score}
            </div>
          </div>

          {/* Fish statistics */}
          {Object.keys(fishCountMap).length > 0 && (
            <div className="bg-black/20 rounded-xl p-4">
              <div className="text-white/70 text-sm mb-3">钓获统计</div>
              <div className="grid grid-cols-2 gap-2">
                {FISH_TYPES.filter((ft) => fishCountMap[ft.nameEn]).map((ft) => {
                  const stat = fishCountMap[ft.nameEn];
                  return (
                    <div key={ft.nameEn} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                      <span className="text-lg">{fishEmojiMap[ft.nameEn] || '🐟'}</span>
                      <div className="flex-1 text-left">
                        <div className="text-white text-xs">{stat.name}</div>
                        <div className="text-yellow-300/80 text-xs">x{stat.count}</div>
                      </div>
                      <div className="text-white text-sm font-bold">{stat.totalScore}</div>
                    </div>
                  );
                })}
              </div>
              <div className="text-white/50 text-xs mt-2">
                共钓到 {caughtFish.length} 条鱼
              </div>
            </div>
          )}

          {caughtFish.length === 0 && (
            <div className="text-white/50 text-sm">
              一条都没钓到... 再试试吧！
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleHome}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all duration-200"
              style={{ fontFamily: '"Fredoka", sans-serif' }}
            >
              返回主页
            </button>
            <button
              onClick={handleRestart}
              className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ fontFamily: '"Fredoka", sans-serif' }}
            >
              再来一局 🎣
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
