import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Coins, Play, AlertCircle, ArrowLeft, Spade, RefreshCw, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface MinigamesPanelProps {
  coins: number;
  onEarnCoins: (amount: number) => void;
  onEarnXP: (amount: number) => void;
  onTriggerAchievementProgress: (id: string, amount: number) => void;
  onClose: () => void;
}

interface FallingObject {
  id: number;
  x: number; // percentage 5 to 95
  y: number; // percentage 0 to 100
  type: 'ball' | 'bone' | 'mud';
  speed: number;
}

export default function MinigamesPanel({
  coins,
  onEarnCoins,
  onEarnXP,
  onTriggerAchievementProgress,
  onClose,
}: MinigamesPanelProps) {
  const { t, lang } = useLanguage();
  const [activeGame, setActiveGame] = useState<'menu' | 'ball' | 'dig' | 'frisbee'>('menu');

  // --- 1. BALL CATCH GAME STATE ---
  const [ballScore, setBallScore] = useState(0);
  const [ballCoinsEarned, setBallCoinsEarned] = useState(0);
  const [ballTime, setBallTime] = useState(30);
  const [ballPlaying, setBallPlaying] = useState(false);
  const [playerX, setPlayerX] = useState(50); // 0 to 100 percent
  const [fallingObjects, setFallingObjects] = useState<FallingObject[]>([]);

  // --- 2. SANDBOX DIG STATE ---
  const [digGrid, setDigGrid] = useState<{ id: number; revealed: boolean; prize: 'coins' | 'bone' | 'sock' | 'empty'; amount?: number }[]>([]);
  const [digsLeft, setDigsLeft] = useState(5);
  const [digCoinsEarned, setDigCoinsEarned] = useState(0);
  const [digResultMsg, setDigResultMsg] = useState('');

  // --- 3. FRISBEE SLIDER TIMING STATE ---
  const [frisbeeProgress, setFrisbeeProgress] = useState(0); // 0 to 100
  const [frisbeeDirection, setFrisbeeDirection] = useState<'up' | 'down'>('up');
  const [frisbeePlaying, setFrisbeePlaying] = useState(false);
  const [frisbeeResult, setFrisbeeResult] = useState<'none' | 'perfect' | 'good' | 'miss'>('none');
  const [frisbeeCoinsEarned, setFrisbeeCoinsEarned] = useState(0);

  // ----------------------------------------
  // --- 1. BALL CATCH GAME LOGIC ---
  // ----------------------------------------
  const startBallGame = () => {
    setBallScore(0);
    setBallCoinsEarned(0);
    setBallTime(30);
    setFallingObjects([]);
    setBallPlaying(true);
  };

  // Timer tick
  useEffect(() => {
    if (!ballPlaying) return;
    if (ballTime <= 0) {
      endBallGame();
      return;
    }
    const timer = setTimeout(() => {
      setBallTime((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [ballTime, ballPlaying]);

  // Object physics loop
  useEffect(() => {
    if (!ballPlaying) return;

    const gameLoop = setInterval(() => {
      setFallingObjects((prev) => {
        const moved = prev.map((obj) => ({
          ...obj,
          y: obj.y + obj.speed,
        }));

        const kept: FallingObject[] = [];
        moved.forEach((obj) => {
          if (obj.y >= 82 && obj.y <= 90) {
            const distance = Math.abs(obj.x - playerX);
            if (distance < 12) {
              if (obj.type === 'ball') {
                setBallScore((s) => s + 10);
                setBallCoinsEarned((c) => c + 3);
                onEarnCoins(3);
                onEarnXP(5);
                onTriggerAchievementProgress('ach-games', 1);
              } else if (obj.type === 'bone') {
                setBallScore((s) => s + 25);
                setBallCoinsEarned((c) => c + 8);
                onEarnCoins(8);
                onEarnXP(10);
              } else if (obj.type === 'mud') {
                setBallScore((s) => Math.max(0, s - 15));
              }
              return;
            }
          }

          if (obj.y < 100) {
            kept.push(obj);
          }
        });

        return kept;
      });

      if (Math.random() < 0.08) {
        const types: ('ball' | 'bone' | 'mud')[] = ['ball', 'ball', 'ball', 'bone', 'mud'];
        const type = types[Math.floor(Math.random() * types.length)];
        const newObj: FallingObject = {
          id: Date.now() + Math.random(),
          x: 5 + Math.random() * 90,
          y: 0,
          type,
          speed: 3 + Math.random() * 4,
        };
        setFallingObjects((prev) => [...prev, newObj]);
      }
    }, 100);

    return () => clearInterval(gameLoop);
  }, [ballPlaying, playerX]);

  const endBallGame = () => {
    setBallPlaying(false);
    setFallingObjects([]);
  };

  // ----------------------------------------
  // --- 2. SANDBOX DIG GAME LOGIC ---
  // ----------------------------------------
  const initDigGame = () => {
    setDigsLeft(5);
    setDigCoinsEarned(0);
    setDigResultMsg('¡El jardín trasero guarda tesoros enterrados! Toca cualquier espacio para cavar.');

    const prizes: ('coins' | 'bone' | 'sock' | 'empty')[] = [
      'coins', 'coins', 'coins', 'bone', 'sock', 'empty', 'empty', 'empty',
      'coins', 'coins', 'empty', 'empty', 'bone', 'empty', 'coins', 'empty'
    ];

    for (let i = prizes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [prizes[i], prizes[j]] = [prizes[j], prizes[i]];
    }

    const grid = Array.from({ length: 16 }).map((_, idx) => ({
      id: idx,
      revealed: false,
      prize: prizes[idx],
      amount: prizes[idx] === 'coins' ? 10 + Math.floor(Math.random() * 20) : undefined,
    }));

    setDigGrid(grid);
  };

  useEffect(() => {
    if (activeGame === 'dig') {
      initDigGame();
    }
  }, [activeGame]);

  const handleDigClick = (id: number) => {
    if (digsLeft <= 0) return;
    const item = digGrid.find((g) => g.id === id);
    if (!item || item.revealed) return;

    setDigGrid((prev) =>
      prev.map((g) => (g.id === id ? { ...g, revealed: true } : g))
    );
    setDigsLeft((d) => d - 1);

    if (item.prize === 'coins' && item.amount) {
      setDigCoinsEarned((c) => c + item.amount!);
      onEarnCoins(item.amount);
      onEarnXP(4);
      setDigResultMsg(lang === 'es' ? `🐾 ¡Cavaste y encontraste ${item.amount} monedas!` : `🐾 You dug and found ${item.amount} coins!`);
    } else if (item.prize === 'bone') {
      onEarnXP(25);
      setDigResultMsg(lang === 'es' ? '🦴 ¡Un delicioso hueso de la suerte! (+25 XP)' : '🦴 A yummy lucky bone! (+25 XP)');
    } else if (item.prize === 'sock') {
      onEarnCoins(30);
      onEarnXP(15);
      onTriggerAchievementProgress('ach-sock', 1);
      setDigResultMsg(lang === 'es' ? '🧦 ¡ENCONTRASTE UN CALCETÍN! Tu perrito está feliz. (+30 monedas)' : '🧦 YOU FOUND A SOCK! Your puppy is happy. (+30 coins)');
    } else {
      setDigResultMsg(lang === 'es' ? '🌱 ¡Solo tierra fresca! Pero a tu Golden le encanta escarbar.' : '🌱 Just fresh soil! But your Golden loves digging.');
    }
  };

  // ----------------------------------------
  // --- 3. FRISBEE SLIDER LOGIC ---
  // ----------------------------------------
  const startFrisbeeGame = () => {
    setFrisbeeProgress(0);
    setFrisbeeDirection('up');
    setFrisbeeResult('none');
    setFrisbeeCoinsEarned(0);
    setFrisbeePlaying(true);
  };

  useEffect(() => {
    if (!frisbeePlaying) return;

    const interval = setInterval(() => {
      setFrisbeeProgress((prev) => {
        if (prev >= 100) {
          setFrisbeeDirection('down');
          return 98;
        }
        if (prev <= 0) {
          setFrisbeeDirection('up');
          return 2;
        }
        return frisbeeDirection === 'up' ? prev + 6 : prev - 6;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [frisbeePlaying, frisbeeDirection]);

  const handleLaunchFrisbee = () => {
    if (!frisbeePlaying) return;
    setFrisbeePlaying(false);

    const score = frisbeeProgress;
    let result: 'perfect' | 'good' | 'miss' = 'miss';
    let earned = 0;

    if (score >= 43 && score <= 57) {
      result = 'perfect';
      earned = 50;
      onEarnCoins(50);
      onEarnXP(30);
      onTriggerAchievementProgress('ach-games', 1);
    } else if ((score >= 20 && score < 43) || (score > 57 && score <= 80)) {
      result = 'good';
      earned = 20;
      onEarnCoins(20);
      onEarnXP(15);
      onTriggerAchievementProgress('ach-games', 1);
    } else {
      result = 'miss';
      earned = 2;
      onEarnCoins(2);
    }

    setFrisbeeResult(result);
    setFrisbeeCoinsEarned(earned);
  };

  return (
    <div className="fixed inset-0 bg-[#3D2B24]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-montserrat">
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 10 }}
        className="w-full max-w-lg bg-white rounded-[28px] overflow-hidden shadow-[0_12px_36px_rgba(61,43,36,0.14)] border border-[#F4D396] flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="bg-[#FFF8EE] border-b border-[#F4D396]/60 p-4.5 text-[#3D2B24] flex justify-between items-center">
          <div className="flex items-center gap-2">
            {activeGame !== 'menu' && (
              <button
                onClick={() => {
                  setBallPlaying(false);
                  setFrisbeePlaying(false);
                  setActiveGame('menu');
                }}
                className="p-1.5 hover:bg-[#FFF0D4] rounded-xl mr-1 transition-colors text-[#3D2B24] cursor-pointer"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
              </button>
            )}
            <h3 className="font-semibold text-base text-[#3D2B24]">{t('minigamesParkTitle')}</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white border border-[#F4D396] px-3 py-1.5 rounded-full font-medium text-xs text-[#3D2B24] shadow-2xs">
              <Coins className="w-3.5 h-3.5 text-[#F4B942] fill-[#F4B942]" />
              <span>{coins}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#806F66] hover:text-[#3D2B24] hover:bg-[#FFF0D4] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Game Container */}
        <div className="flex-1 overflow-y-auto p-4.5 flex flex-col justify-center bg-[#FFFDF9] min-h-[380px]">
          {/* MENU SCREEN */}
          {activeGame === 'menu' && (
            <div className="flex flex-col gap-3">
              <h4 className="text-[#3D2B24] font-semibold text-xs text-center mb-1">
                {t('chooseMinigame')}
              </h4>

              {/* 1. Ball Catch Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveGame('ball')}
                className="bg-white p-4 rounded-[22px] border border-[#F4D396]/60 shadow-2xs cursor-pointer flex justify-between items-center hover:border-[#F4B942] transition-all"
              >
                <div className="flex gap-3 items-center">
                  <span className="text-3xl p-2 bg-[#FFF8EE] rounded-[16px] border border-[#F4D396]/40">🎾</span>
                  <div>
                    <h5 className="font-semibold text-[#3D2B24] text-xs">{t('ballGameTitle')}</h5>
                    <p className="text-[11px] text-[#806F66] mt-0.5">{t('ballGameDesc')}</p>
                  </div>
                </div>
                <Play className="w-4 h-4 text-[#F4B942] fill-[#F4B942]" />
              </motion.div>

              {/* 2. Sandbox Dig Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveGame('dig')}
                className="bg-white p-4 rounded-[22px] border border-[#F4D396]/60 shadow-2xs cursor-pointer flex justify-between items-center hover:border-[#F4B942] transition-all"
              >
                <div className="flex gap-3 items-center">
                  <span className="text-3xl p-2 bg-[#FFF8EE] rounded-[16px] border border-[#F4D396]/40">🦴</span>
                  <div>
                    <h5 className="font-semibold text-[#3D2B24] text-xs">{t('digGameTitle')}</h5>
                    <p className="text-[11px] text-[#806F66] mt-0.5">{t('digGameDesc')}</p>
                  </div>
                </div>
                <Spade className="w-4 h-4 text-[#F4B942]" />
              </motion.div>

              {/* 3. Frisbee Timing Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveGame('frisbee')}
                className="bg-white p-4 rounded-[22px] border border-[#F4D396]/60 shadow-2xs cursor-pointer flex justify-between items-center hover:border-[#F4B942] transition-all"
              >
                <div className="flex gap-3 items-center">
                  <span className="text-3xl p-2 bg-[#FFF8EE] rounded-[16px] border border-[#F4D396]/40">🥏</span>
                  <div>
                    <h5 className="font-semibold text-[#3D2B24] text-xs">{t('frisbeeGameTitle')}</h5>
                    <p className="text-[11px] text-[#806F66] mt-0.5">{t('frisbeeGameDesc')}</p>
                  </div>
                </div>
                <Play className="w-4 h-4 text-[#F4B942] fill-[#F4B942]" />
              </motion.div>
            </div>
          )}

          {/* 1. ATRAPAR PELOTAS GAMEPLAY */}
          {activeGame === 'ball' && (
            <div className="flex flex-col gap-4">
              {!ballPlaying ? (
                <div className="text-center flex flex-col items-center gap-3 py-6">
                  <span className="text-5xl">🎾🐾</span>
                  <h4 className="font-semibold text-[#3D2B24] text-base">{t('ballGameTitle')}</h4>
                  <p className="text-xs text-[#806F66] max-w-xs font-normal leading-relaxed">
                    {t('ballGameInstruction')}
                  </p>
                  <button
                    onClick={startBallGame}
                    className="mt-2 px-6 py-2.5 bg-[#F4B942] hover:bg-[#FFD477] text-[#3D2B24] border border-[#E29E2E] font-semibold text-xs rounded-full shadow-xs cursor-pointer"
                  >
                    {t('startBallGameBtn')}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {/* Game Stats */}
                  <div className="flex justify-between items-center bg-[#FFF8EE] border border-[#F4D396] px-3.5 py-2 rounded-[18px] text-xs font-medium text-[#3D2B24]">
                    <span>{t('ballScoreLabel')}: {ballScore}</span>
                    <span className="text-emerald-700 font-semibold">+{ballCoinsEarned} 🪙</span>
                    <span>{t('ballTimeLabel')}: {ballTime}s</span>
                  </div>

                  {/* Falling Arena */}
                  <div className="relative w-full h-[240px] bg-[#EBF5FB] rounded-[24px] overflow-hidden border border-[#F4D396]/60">
                    <div className="absolute top-4 left-6 text-white/60 text-2xl">☁️</div>
                    <div className="absolute top-10 right-10 text-white/60 text-3xl">☁️</div>

                    {fallingObjects.map((obj) => (
                      <div
                        key={obj.id}
                        className="absolute text-2xl select-none"
                        style={{
                          left: `${obj.x}%`,
                          top: `${obj.y}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        {obj.type === 'ball' ? '🎾' : obj.type === 'bone' ? '🦴' : '💩'}
                      </div>
                    ))}

                    {/* Dog Character representing player at the bottom */}
                    <div
                      className="absolute bottom-2 h-14 w-14 flex items-center justify-center transition-all duration-75 select-none"
                      style={{
                        left: `${playerX}%`,
                        transform: 'translateX(-50%)',
                      }}
                    >
                      <span className="text-4xl filter drop-shadow-md">🐕</span>
                    </div>
                  </div>

                  {/* Horizontal Slider Controls */}
                  <div className="flex flex-col gap-1.5 bg-white p-3 rounded-[20px] border border-[#F4D396]/40 shadow-2xs">
                    <span className="text-[10px] text-[#806F66] font-medium text-center uppercase tracking-wide">
                      {t('dragToMovePup')}
                    </span>
                    <input
                      type="range"
                      min="5"
                      max="95"
                      value={playerX}
                      onChange={(e) => setPlayerX(Number(e.target.value))}
                      className="w-full accent-[#F4B942] h-2 bg-[#FFF0D4] rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. EXCAVAR TESOROS GAMEPLAY */}
          {activeGame === 'dig' && (
            <div className="flex flex-col gap-3.5">
              <div className="flex justify-between items-center text-xs text-[#3D2B24] px-1 font-medium">
                <span className="flex items-center gap-1.5">
                  <Spade className="w-4 h-4 text-[#F4B942]" /> {t('digRemainingLabel')}: {digsLeft}
                </span>
                <span className="text-emerald-700 font-semibold">+{digCoinsEarned} 🪙 {t('digCoinsWonLabel')}</span>
              </div>

              {/* Shovel Grid */}
              <div className="grid grid-cols-4 gap-2.5 bg-[#8B5A2B] p-3.5 rounded-[24px] border border-[#5C3A21] shadow-inner">
                {digGrid.map((cell) => (
                  <motion.div
                    key={cell.id}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => handleDigClick(cell.id)}
                    className={`h-13 rounded-[16px] flex items-center justify-center cursor-pointer font-medium text-lg transition-all select-none ${
                      cell.revealed
                        ? 'bg-[#5C3A21]/30 text-[#3D2B24] border border-amber-900/10'
                        : 'bg-[#D2C290] border-b-3 border-[#A3936B] hover:bg-[#E0D0A0] text-amber-950/40 shadow-2xs'
                    }`}
                  >
                    {cell.revealed ? (
                      cell.prize === 'coins' ? (
                        '🪙'
                      ) : cell.prize === 'bone' ? (
                        '🦴'
                      ) : cell.prize === 'sock' ? (
                        '🧦'
                      ) : (
                        <span className="text-[10px] text-amber-100/50">{t('digEmptyText')}</span>
                      )
                    ) : (
                      '🌱'
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="bg-[#FFF8EE] border border-[#F4D396] p-3 rounded-[18px] flex items-start gap-2 text-xs text-[#3D2B24] font-medium shadow-2xs">
                <AlertCircle className="w-4 h-4 text-[#F4B942] flex-shrink-0 mt-0.5" />
                <p>{digResultMsg}</p>
              </div>

              {digsLeft === 0 && (
                <button
                  onClick={initDigGame}
                  className="w-full py-2.5 bg-[#F4B942] hover:bg-[#FFD477] text-[#3D2B24] border border-[#E29E2E] font-semibold text-xs rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <RefreshCw className="w-4 h-4" /> {t('digNewHoleBtn')}
                </button>
              )}
            </div>
          )}

          {/* 3. LANZAR FRISBEE TIMING GAME */}
          {activeGame === 'frisbee' && (
            <div className="flex flex-col gap-4 text-center py-4">
              {!frisbeePlaying && frisbeeResult === 'none' ? (
                <div className="flex flex-col items-center gap-3">
                  <span className="text-5xl">🥏🐾</span>
                  <h4 className="font-semibold text-base text-[#3D2B24]">{t('frisbeeTitle')}</h4>
                  <p className="text-xs text-[#806F66] max-w-xs font-normal leading-relaxed">
                    {t('frisbeeDesc')}
                  </p>
                  <button
                    onClick={startFrisbeeGame}
                    className="px-6 py-2.5 bg-[#F4B942] hover:bg-[#FFD477] text-[#3D2B24] border border-[#E29E2E] font-semibold text-xs rounded-full shadow-xs cursor-pointer"
                  >
                    {t('startFrisbeeBtn')}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4 items-center">
                  <h4 className="font-semibold text-[#3D2B24] text-xs">
                    {frisbeePlaying ? t('frisbeeTimingHint') : t('frisbeeResultLabel')}
                  </h4>

                  {/* Timing Bar Visualization */}
                  <div className="relative w-full max-w-xs h-8 bg-gradient-to-r from-rose-400 via-amber-300 to-rose-400 rounded-full border border-[#F4D396] p-0.5 overflow-hidden shadow-inner flex items-center">
                    <div className="absolute inset-y-0 left-[43%] right-[43%] bg-emerald-500 border-x border-white/60" />

                    <div
                      className="absolute top-0 bottom-0 w-2 bg-[#3D2B24] border border-white rounded-full shadow-md transition-all duration-75"
                      style={{ left: `${frisbeeProgress}%` }}
                    />
                  </div>

                  {/* Launch button / Feedback */}
                  {frisbeePlaying ? (
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      onClick={handleLaunchFrisbee}
                      className="px-8 py-3 bg-[#F4B942] hover:bg-[#FFD477] text-[#3D2B24] font-semibold text-xs rounded-full shadow-md border border-[#E29E2E] cursor-pointer"
                    >
                      {t('frisbeeLaunchNow')}
                    </motion.button>
                  ) : (
                    <div className="flex flex-col items-center gap-2 w-full">
                      <AnimatePresence>
                        {frisbeeResult === 'perfect' && (
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-emerald-50 border border-emerald-200 p-4 rounded-[22px] text-emerald-900 text-xs font-medium shadow-2xs flex flex-col gap-1 items-center w-full"
                          >
                            <span className="text-2xl">{t('frisbeePerfectTitle')}</span>
                            <span>{t('frisbeePerfectDesc')}</span>
                          </motion.div>
                        )}
                        {frisbeeResult === 'good' && (
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-[#FFF8EE] border border-[#F4D396] p-4 rounded-[22px] text-[#3D2B24] text-xs font-medium shadow-2xs flex flex-col gap-1 items-center w-full"
                          >
                            <span className="text-2xl">{t('frisbeeGoodTitle')}</span>
                            <span>{t('frisbeeGoodDesc')}</span>
                          </motion.div>
                        )}
                        {frisbeeResult === 'miss' && (
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-rose-50 border border-rose-200 p-4 rounded-[22px] text-rose-800 text-xs font-medium shadow-2xs flex flex-col gap-1 items-center w-full"
                          >
                            <span className="text-2xl">{t('frisbeeMissTitle')}</span>
                            <span>{t('frisbeeMissDesc')}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <button
                        onClick={startFrisbeeGame}
                        className="mt-2 px-6 py-2 bg-[#3D2B24] hover:bg-[#5A3828] text-white font-medium text-xs rounded-full cursor-pointer shadow-xs"
                      >
                        {t('tryAgainBtn')}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FFF8EE] border-t border-[#F4D396]/40 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-[18px] bg-[#3D2B24] text-white font-medium text-xs hover:bg-[#5A3828] transition-colors cursor-pointer shadow-xs"
          >
            {t('backToParkBtn')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
