import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Emotion, ActiveBehavior, GameState, DiaryEntry, ThoughtResponse, PetReminder } from './types';
import { DEFAULT_GAME_STATE, NOTIFICATION_BUBBLES } from './initialData';
import GoldenPuppy from './components/GoldenPuppy';
import DynamicScenery, { SceneryType } from './components/DynamicScenery';
import StatusBars from './components/StatusBars';
import ActionMenu from './components/ActionMenu';
import ShopPanel from './components/ShopPanel';
import AchievementsPanel from './components/AchievementsPanel';
import DiaryPanel from './components/DiaryPanel';
import MinigamesPanel from './components/MinigamesPanel';
import CalendarPanel from './components/CalendarPanel';
import GoldenLogo from './components/GoldenLogo';
import SplashScreen from './components/SplashScreen';
import LanguageToggle from './components/LanguageToggle';
import MemoriesPanel from './components/MemoriesPanel';
import RenamePetModal from './components/RenamePetModal';
import NewMemoryToast from './components/NewMemoryToast';
import MischiefModal from './components/MischiefModal';
import SpontaneousEventModal from './components/SpontaneousEventModal';
import DailyMischiefBanner from './components/DailyMischiefBanner';
import { INITIAL_MEMORIES, MISCHIEF_PRESETS, SPONTANEOUS_EVENT_PRESETS, calculateDominantPersonality } from './memoriesData';
import { PetMemory, MischiefItem, SpontaneousEvent } from './types';
import { useLanguage } from './i18n/LanguageContext';
import { savePhotoToStorage, deletePhotoFromStorage, getAllStoredPhotos } from './utils/photoStorage';
import { 
  Sparkles, 
  ShoppingBag, 
  Trophy, 
  BookOpen, 
  Gamepad2, 
  Settings, 
  VolumeX, 
  Volume2, 
  X,
  Dog,
  Coins,
  Calendar,
  Camera
} from 'lucide-react';

const getInitialReminders = (): PetReminder[] => {
  const today = new Date();
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 3);

  return [
    {
      id: 'rem-vaccine-today',
      type: 'vaccine',
      title: 'Vacuna de la Rabia 💉',
      date: formatDate(today),
      time: '12:00',
      notes: 'Llevar a la veterinaria para el refuerzo anual.',
      completed: false,
      notified: false
    },
    {
      id: 'rem-pill-future',
      type: 'flea_pill',
      title: 'Pastilla Antipulgas (NexGard) 💊',
      date: formatDate(nextWeek),
      time: '10:00',
      notes: 'Darle entera con un trozo de jamón para que se la trague.',
      completed: false,
      notified: false
    },
    {
      id: 'rem-vaccine-past',
      type: 'vaccine',
      title: 'Vacuna Sextuple (Anual) 💉',
      date: formatDate(yesterday),
      time: '09:30',
      notes: '¡Dosis aplicada con éxito! Recibió premio por portarse bien.',
      completed: true,
      notified: true
    }
  ];
};

export default function App() {
  const { t, lang } = useLanguage();

  // --- 1. CORE STATES ---
  const [gameState, setGameState] = useState<GameState>(DEFAULT_GAME_STATE);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [activeBehavior, setActiveBehavior] = useState<ActiveBehavior>(ActiveBehavior.Idle);
  const [isSleeping, setIsSleeping] = useState(false);
  
  // UI overlays
  const [showSplash, setShowSplash] = useState(true);
  const [showShop, setShowShop] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showDiary, setShowDiary] = useState(false);
  const [showMinigames, setShowMinigames] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showMemories, setShowMemories] = useState(false);
  const [selectedMemoryDetailId, setSelectedMemoryDetailId] = useState<string | null>(null);
  const [showRenamePet, setShowRenamePet] = useState(false);

  // New Memory Notification Toast
  const [newlyUnlockedMemory, setNewlyUnlockedMemory] = useState<PetMemory | null>(null);

  // Active Mischief & Spontaneous Event Modals
  const [activeMischiefModal, setActiveMischiefModal] = useState<{ item: MischiefItem; isDaily: boolean } | null>(null);
  const [activeSpontaneousEvent, setActiveSpontaneousEvent] = useState<SpontaneousEvent | null>(null);
  const lastSpontaneousEventTimeRef = useRef<number>(Date.now());

  // Health Reminders State
  const [reminders, setReminders] = useState<PetReminder[]>([]);

  // AI & Translation States
  const [aiThought, setAiThought] = useState<ThoughtResponse | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isGeneratingDiary, setIsGeneratingDiary] = useState(false);

  // Animation visual feedback
  const [isPetting, setIsPetting] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('¡Guau! ¡Te extrañé muchísimo! 💕');
  const [showNotification, setShowNotification] = useState(true);

  // Today's interaction logs for Gemini diary generator
  const [todayActivities, setTodayActivities] = useState<string[]>([]);

  // Sound Synth States
  const [musicEnabled, setMusicEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const musicOscRef = useRef<OscillatorNode | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);
  const musicLoopIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- 2. LOAD AND INITIATE ---
  useEffect(() => {
    // A. Load Game State from LocalStorage
    const savedState = localStorage.getItem('goldenlife_state');
    const savedDiary = localStorage.getItem('goldenlife_diary');

    let currentLoadedState = DEFAULT_GAME_STATE;

    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        const loadedMemories = (parsed.memories && parsed.memories.length > 0 ? parsed.memories : INITIAL_MEMORIES).map((m: any) => {
          const defaultEntry = INITIAL_MEMORIES.find((im) => im.id === m.id);
          return {
            ...m,
            defaultPhotoUrl: m.defaultPhotoUrl || defaultEntry?.defaultPhotoUrl,
          };
        });
        currentLoadedState = {
          ...DEFAULT_GAME_STATE,
          ...parsed,
          memories: loadedMemories,
          personality: parsed.personality || DEFAULT_GAME_STATE.personality,
          accessories: parsed.accessories ? [
            ...parsed.accessories,
            ...(parsed.accessories.some((a: any) => a.id === 'bandana-fresh') ? [] : [
              { id: 'bandana-fresh', name: 'Bandana "Fresh Golden" 🧼', category: 'bandana', color: '#06b6d4', price: 0, purchased: false, icon: '🧼' }
            ])
          ] : DEFAULT_GAME_STATE.accessories
        };
      } catch (e) {
        console.error('Failed parsing state', e);
      }
    }

    if (savedDiary) {
      try {
        setDiaryEntries(JSON.parse(savedDiary));
      } catch (e) {
        console.error('Failed parsing diary', e);
      }
    }

    // Load Reminders from LocalStorage
    const savedReminders = localStorage.getItem('goldenlife_reminders');
    if (savedReminders) {
      try {
        setReminders(JSON.parse(savedReminders));
      } catch (e) {
        console.error('Failed parsing reminders', e);
        setReminders(getInitialReminders());
      }
    } else {
      setReminders(getInitialReminders());
    }

    // B. Calculate stat decay based on time elapsed
    const now = new Date();
    const lastTime = new Date(currentLoadedState.lastInteractionTime);
    const msDiff = now.getTime() - lastTime.getTime();
    const hoursElapsed = msDiff / (1000 * 60 * 60);

    if (hoursElapsed > 0.2) {
      // Decay stats
      const decayFactor = Math.min(hoursElapsed, 48); // cap decay at 2 days
      const updatedStats = { ...currentLoadedState.stats };
      
      updatedStats.hunger = Math.max(0, Math.round(updatedStats.hunger - (decayFactor * 6)));
      updatedStats.sleep = Math.max(0, Math.round(updatedStats.sleep - (decayFactor * 4)));
      updatedStats.cleanliness = Math.max(0, Math.round(updatedStats.cleanliness - (decayFactor * 3)));
      updatedStats.fun = Math.max(0, Math.round(updatedStats.fun - (decayFactor * 5)));
      updatedStats.energy = Math.max(0, Math.round(updatedStats.energy - (decayFactor * 4)));

      // Recalculate Overall Happiness
      updatedStats.happiness = Math.round(
        (updatedStats.love + updatedStats.hunger + updatedStats.sleep + updatedStats.cleanliness + updatedStats.fun) / 5
      );

      // Calculate days elapsed
      const daysTogether = Math.max(1, currentLoadedState.daysTogether + Math.floor(hoursElapsed / 24));

      currentLoadedState = {
        ...currentLoadedState,
        stats: updatedStats,
        daysTogether,
        lastInteractionTime: now.toISOString(),
      };
    }

    setGameState(currentLoadedState);

    // Hydrate memory photos from IndexedDB for high-fidelity persistence
    getAllStoredPhotos().then((storedPhotos) => {
      if (storedPhotos && Object.keys(storedPhotos).length > 0) {
        setGameState((prev) => {
          const currentMemories = prev.memories || INITIAL_MEMORIES;
          const merged = currentMemories.map((m) => {
            if (storedPhotos[m.id]) {
              return { ...m, photoUrl: storedPhotos[m.id] };
            }
            return m;
          });
          return {
            ...prev,
            memories: merged,
          };
        });
      }
    }).catch((err) => {
      console.warn('Could not load photos from IndexedDB', err);
    });

    // C. Trigger a random notification on startup
    const randomWelcome = NOTIFICATION_BUBBLES[Math.floor(Math.random() * NOTIFICATION_BUBBLES.length)];
    setNotificationMsg(randomWelcome);
    setShowNotification(true);

    // D. Dismiss notifications automatically after 6s
    const timer = setTimeout(() => setShowNotification(false), 6000);
    const firstDayTimer = setTimeout(() => {
      unlockMemory('mem-first-day');
    }, 1200);

    return () => {
      clearTimeout(timer);
      clearTimeout(firstDayTimer);
    };
  }, []);

  // Check for perfect day memory when all stats are high
  useEffect(() => {
    if (
      gameState.stats.hunger >= 90 &&
      gameState.stats.sleep >= 90 &&
      gameState.stats.cleanliness >= 90 &&
      gameState.stats.fun >= 90 &&
      gameState.stats.love >= 90
    ) {
      unlockMemory('mem-sec-perfect-day');
    }
  }, [gameState.stats.hunger, gameState.stats.sleep, gameState.stats.cleanliness, gameState.stats.fun, gameState.stats.love]);

  // Auto-Save whenever gameState changes with quota safeguard
  useEffect(() => {
    try {
      localStorage.setItem('goldenlife_state', JSON.stringify(gameState));
    } catch (err) {
      console.warn('LocalStorage quota limit reached, saving lightweight state without base64 photos', err);
      try {
        const lightweightState = {
          ...gameState,
          memories: gameState.memories?.map((m) => ({ ...m, photoUrl: undefined })),
        };
        localStorage.setItem('goldenlife_state', JSON.stringify(lightweightState));
      } catch (innerErr) {
        console.error('LocalStorage write failed completely', innerErr);
      }
    }
  }, [gameState]);

  // Auto-Save diary
  useEffect(() => {
    localStorage.setItem('goldenlife_diary', JSON.stringify(diaryEntries));
  }, [diaryEntries]);

  // Auto-Save reminders
  useEffect(() => {
    localStorage.setItem('goldenlife_reminders', JSON.stringify(reminders));
  }, [reminders]);

  // --- 2.5 HEALTH REMINDER TIME TRIGGER CHECK ---
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const formatDigit = (num: number) => String(num).padStart(2, '0');
      const todayStr = `${now.getFullYear()}-${formatDigit(now.getMonth() + 1)}-${formatDigit(now.getDate())}`;
      const timeNowStr = `${formatDigit(now.getHours())}:${formatDigit(now.getMinutes())}`;

      setReminders((prevReminders) => {
        const dueReminder = prevReminders.find((r) => 
          !r.completed && 
          !r.notified && 
          (r.date < todayStr || (r.date === todayStr && (!r.time || r.time <= timeNowStr)))
        );
        
        if (dueReminder) {
          // Play the sound and notify
          playBarkSound();
          setNotificationMsg(`🐾 ¡GUAU, GUAU! Recuerda: hoy toca "${dueReminder.title}" 🩺💊`);
          setShowNotification(true);

          return prevReminders.map((r) => r.id === dueReminder.id ? { ...r, notified: true } : r);
        }
        return prevReminders;
      });
    };

    // Check every 10 seconds
    const interval = setInterval(checkReminders, 10000);
    // Also check once after a small delay (2 seconds)
    const timeout = setTimeout(checkReminders, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // --- 3. WEB AUDIO PROCEDURAL SYNTH ENGINE ---
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  // Happy barking pitch sweep synth
  const playBarkSound = () => {
    initAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    // Double bark
    const barks = [0, 150];
    barks.forEach((delay) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        // Pitch sweep from 220Hz to 880Hz for cute yip yip
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.08);
        osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.16);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }, delay);
    });
  };

  // Eating chewing crunch synth
  const playChewSound = () => {
    initAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    // Series of quick crunch sound bursts
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const bufferSize = ctx.sampleRate * 0.06;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        // Fill buffer with white noise
        for (let j = 0; j < bufferSize; j++) {
          data[j] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        // Bandpass filter to make it sound crunchy
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1000, ctx.currentTime);
        filter.Q.setValueAtTime(3, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
      }, i * 220);
    }
  };

  // Splash sound for bath time
  const playSplashSound = () => {
    initAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const noise = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    // Noise buffer
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let j = 0; j < bufferSize; j++) {
      data[j] = Math.random() * 2 - 1;
    }
    noise.buffer = buffer;

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.15);
    filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.38);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  };

  // Chime chord sound for achievement or reward success
  const playChimeSound = () => {
    initAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 major chord
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.7);
    });
  };

  // Synthesized soothing ambient melody loop for background music
  const startMusicLoop = () => {
    initAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    // Simple warm pentatonic scale notes C4, D4, E4, G4, A4, C5
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    let noteIndex = 0;

    const playNextNote = () => {
      if (!musicEnabled) return;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Pick a random sweet note
      const f = notes[Math.floor(Math.random() * notes.length)];
      osc.frequency.setValueAtTime(f, ctx.currentTime);

      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.3);
    };

    // Play a note every 1.5 seconds
    playNextNote();
    const interval = setInterval(playNextNote, 1500);
    musicLoopIntervalRef.current = interval;
  };

  const stopMusicLoop = () => {
    if (musicLoopIntervalRef.current) {
      clearInterval(musicLoopIntervalRef.current);
      musicLoopIntervalRef.current = null;
    }
  };

  // Toggle Music State
  const handleToggleMusic = () => {
    if (musicEnabled) {
      setMusicEnabled(false);
      stopMusicLoop();
    } else {
      setMusicEnabled(true);
      // Timeout to ensure state resolves
      setTimeout(() => {
        setMusicEnabled(true);
        startMusicLoop();
      }, 50);
    }
  };

  // Cleanup music loop on unmount
  useEffect(() => {
    return () => {
      if (musicLoopIntervalRef.current) {
        clearInterval(musicLoopIntervalRef.current);
      }
    };
  }, []);

  // --- 4. GAME ACTIONS & MUTATORS ---

  // Helper to dynamically calculate current Emotion
  const getPuppyEmotion = (): Emotion => {
    const { hunger, cleanliness, fun, love } = gameState.stats;
    if (activeBehavior === ActiveBehavior.Sleeping) return Emotion.MuyFeliz; // peaceful
    if (cleanliness >= 95) return Emotion.MuyLimpio;
    if (hunger <= 35) return Emotion.Hambriento;
    if (fun <= 30) return Emotion.Aburrido;
    if (love <= 35) return Emotion.Triste;
    if (hunger <= 15 || fun <= 10) return Emotion.Enojado;
    return Emotion.MuyFeliz;
  };

  // Helper for dynamic emotional speech bubble
  const getPuppyStatusMessage = (): string => {
    if (isPetting) return t('bubblePetting');
    if (activeBehavior === ActiveBehavior.Sleeping) return t('bubbleSleepy');
    if (activeBehavior === ActiveBehavior.Fetch) return t('bubbleFetch');
    if (activeBehavior === ActiveBehavior.Eating) return t('bubbleEating');
    if (activeBehavior === ActiveBehavior.Bath) return t('bubbleBath');
    if (activeBehavior === ActiveBehavior.StoleSock) return t('bubbleStoleSock');
    if (activeBehavior === ActiveBehavior.StoleSlipper) return t('bubbleStoleSlipper');
    if (activeBehavior === ActiveBehavior.PuppyEyes) return t('bubblePuppyEyes');
    if (activeBehavior === ActiveBehavior.BellyRub) return t('bubbleBellyRub');

    const emotion = getPuppyEmotion();
    if (emotion === Emotion.Hambriento) return t('bubbleHungry');
    if (emotion === Emotion.Aburrido) return t('bubbleBored');
    if (emotion === Emotion.Triste) return t('bubbleSad');
    if (emotion === Emotion.Enojado) return t('bubbleAngry');
    if (emotion === Emotion.MuyLimpio) return t('bubbleClean');
    return t('bubbleDefault');
  };

  // Rename pet character
  const handleRenamePet = (newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setGameState((prev) => ({
      ...prev,
      petName: trimmed,
    }));
    setNotificationMsg(`¡Ahora tu mascota se llama ${trimmed}! 🐶✨`);
    setShowNotification(true);
    playBarkSound();
  };

  // Update memory custom attached photo
  const handleUpdateMemoryPhoto = (memoryId: string, photoUrl: string | undefined) => {
    // Persist to IndexedDB
    if (photoUrl) {
      savePhotoToStorage(memoryId, photoUrl).catch((err) =>
        console.error('Failed saving photo to IndexedDB', err)
      );
    } else {
      deletePhotoFromStorage(memoryId).catch((err) =>
        console.error('Failed deleting photo from IndexedDB', err)
      );
    }

    setGameState((prev) => {
      const currentMemories = prev.memories || INITIAL_MEMORIES;
      const updatedMemories = currentMemories.map((m) =>
        m.id === memoryId ? { ...m, photoUrl } : m
      );
      return {
        ...prev,
        memories: updatedMemories,
      };
    });
  };

  // --- 4. MEMORIES & PERSONALITY ENGINE ---
  const unlockMemory = (memoryId: string, customStory?: string) => {
    setGameState((prev) => {
      const currentMemories = prev.memories || INITIAL_MEMORIES;
      const existing = currentMemories.find((m) => m.id === memoryId);
      if (!existing || existing.unlocked) return prev; // Avoid duplicate unlocking

      const todayFormatted = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
      const updatedMem: PetMemory = {
        ...existing,
        unlocked: true,
        unlockedAt: todayFormatted,
        levelRecorded: prev.level,
        dayRecorded: prev.daysTogether,
        eventStory: customStory || existing.eventStory,
      };

      const updatedList = currentMemories.map((m) => (m.id === memoryId ? updatedMem : m));

      // Compute rewards
      const newXp = prev.experience + (updatedMem.rewardXp || 0);
      const newCoins = prev.coins + (updatedMem.rewardCoins || 0);
      const newBones = prev.bones + (updatedMem.rewardBones || 0);
      let newAccessories = [...prev.accessories];

      // If memory unlocks an exclusive accessory (e.g. Bandana Fresh Golden)
      if (updatedMem.rewardAccessoryId) {
        newAccessories = newAccessories.map((acc) =>
          acc.id === updatedMem.rewardAccessoryId ? { ...acc, purchased: true } : acc
        );
      }

      // Play chime sound and set toast
      playChimeSound();
      setNewlyUnlockedMemory(updatedMem);

      return {
        ...prev,
        experience: newXp,
        coins: newCoins,
        bones: newBones,
        accessories: newAccessories,
        memories: updatedList,
      };
    });
  };

  const registerPetActivity = (type: 'play' | 'affection' | 'food' | 'mischief' | 'bath') => {
    setGameState((prev) => {
      const currentP = prev.personality || {
        playCount: 0,
        affectionCount: 0,
        foodInteractions: 0,
        mischiefCount: 0,
        bathCount: 0,
      };

      const updated = {
        ...currentP,
        playCount: type === 'play' ? currentP.playCount + 1 : currentP.playCount,
        affectionCount: type === 'affection' ? currentP.affectionCount + 1 : currentP.affectionCount,
        foodInteractions: type === 'food' ? currentP.foodInteractions + 1 : currentP.foodInteractions,
        mischiefCount: type === 'mischief' ? currentP.mischiefCount + 1 : currentP.mischiefCount,
        bathCount: type === 'bath' ? currentP.bathCount + 1 : currentP.bathCount,
      };
      updated.dominantTrait = calculateDominantPersonality(updated);

      // Check personality thresholds for secret memories
      if (updated.mischiefCount >= 3) {
        setTimeout(() => unlockMemory('mem-sec-master-thief'), 600);
      }
      if (updated.bathCount >= 2) {
        setTimeout(() => unlockMemory('mem-sec-fresh-golden'), 600);
      }

      return {
        ...prev,
        personality: updated,
      };
    });
  };

  // Experience incrementor with level-up trigger
  const earnXP = (amount: number) => {
    setGameState((prev) => {
      let newXP = prev.experience + amount;
      let newLevel = prev.level;
      const xpNeeded = 100;

      if (newXP >= xpNeeded) {
        newXP = newXP % xpNeeded;
        newLevel = Math.min(prev.level + 1, 100);
        // Show celebration bubble
        setNotificationMsg(`${t('levelUpNotice')} ${newLevel}!`);
        setShowNotification(true);
        playBarkSound();

        // Check level milestone memories
        if (newLevel >= 10) setTimeout(() => unlockMemory('mem-lvl-10'), 800);
        if (newLevel >= 25) setTimeout(() => unlockMemory('mem-lvl-25'), 800);
        if (newLevel >= 50) setTimeout(() => unlockMemory('mem-lvl-50'), 800);
      }

      return {
        ...prev,
        level: newLevel,
        experience: newXP,
      };
    });
  };

  const earnCoins = (amount: number) => {
    setGameState((prev) => {
      const newCoins = prev.coins + amount;
      
      // Update rich achievement
      const updatedAchievements = prev.achievements.map((ach) => {
        if (ach.id === 'ach-rich') {
          const finished = newCoins >= ach.target;
          return {
            ...ach,
            progress: Math.min(newCoins, ach.target),
          };
        }
        return ach;
      });

      return {
        ...prev,
        coins: newCoins,
        achievements: updatedAchievements,
      };
    });
  };

  const triggerAchievementProgress = (id: string, amount: number) => {
    setGameState((prev) => {
      const updated = prev.achievements.map((ach) => {
        if (ach.id === id) {
          const newProg = Math.min(ach.progress + amount, ach.target);
          return {
            ...ach,
            progress: newProg,
          };
        }
        return ach;
      });
      return {
        ...prev,
        achievements: updated,
      };
    });
  };

  // Alimentar Pet
  const handleFeedPet = (foodType: 'kibble' | 'bone' | 'steak') => {
    if (isSleeping) return;
    playChewSound();

    let hungerGain = 15;
    let xpGain = 10;
    let desc = 'galletas';
    if (foodType === 'bone') {
      hungerGain = 30;
      xpGain = 15;
      desc = 'un hueso';
    } else if (foodType === 'steak') {
      hungerGain = 60;
      xpGain = 30;
      desc = 'un sabroso filete';
    }

    // Set behavior
    setActiveBehavior(ActiveBehavior.Eating);
    setNotificationMsg(`😋 ¡Ñam ñam! Comer ${desc} es mi actividad favorita del universo.`);
    setShowNotification(true);

    setTodayActivities((prev) => [...prev, `comió ${desc}`]);

    setGameState((prev) => {
      const updatedStats = { ...prev.stats };
      updatedStats.hunger = Math.min(100, updatedStats.hunger + hungerGain);
      updatedStats.energy = Math.min(100, updatedStats.energy + 10);
      updatedStats.happiness = Math.round(
        (updatedStats.love + updatedStats.hunger + updatedStats.sleep + updatedStats.cleanliness + updatedStats.fun) / 5
      );

      return {
        ...prev,
        currentRoom: { ...prev.currentRoom, background: 'eating' },
        stats: updatedStats,
      };
    });

    earnXP(xpGain);
    triggerAchievementProgress('ach-feed', 1);
    registerPetActivity('food');
    unlockMemory('mem-first-meal');

    // Reset to Idle after chew completes
    setTimeout(() => {
      setActiveBehavior(ActiveBehavior.Idle);
    }, 2000);
  };

  // Bañar Pet stages
  const handleBathPet = (stage: 'water' | 'shampoo' | 'rinse' | 'dry') => {
    if (isSleeping) return;
    playSplashSound();

    let text = 'Me encanta salpicar agua por todo el baño! 🚿';
    let progressGain = 15;

    if (stage === 'shampoo') {
      text = '¡El shampoo de vainilla huele tan rico que quiero comérmelo! 🧴';
    } else if (stage === 'rinse') {
      text = '¡Atrás, burbujas! ¡Se sienten graciosas en mi nariz perruna! 💧';
    } else if (stage === 'dry') {
      text = '💨 ¡Viento calientito! ¡Ahora voy a correr súper rápido por toda la alfombra!';
      // Shakes water off in zoomies
      setIsShaking(true);
      setActiveBehavior(ActiveBehavior.BellyRub);
      triggerAchievementProgress('ach-bath', 1);
      earnXP(20);
      registerPetActivity('bath');
      unlockMemory('mem-first-bath');
      unlockMemory('mem-sec-bath-disaster');
      setTodayActivities((prev) => [...prev, 'tomó un baño completo de burbujas']);
      
      setTimeout(() => {
        setIsShaking(false);
        setActiveBehavior(ActiveBehavior.Idle);
      }, 3000);
    }

    setNotificationMsg(text);
    setShowNotification(true);

    if (stage !== 'dry') {
      setActiveBehavior(ActiveBehavior.Bath);
    }

    setGameState((prev) => {
      const updatedStats = { ...prev.stats };
      updatedStats.cleanliness = Math.min(100, updatedStats.cleanliness + progressGain);
      
      // If cleanliness reaches 100, update achievement
      let updatedAchievements = [...prev.achievements];
      if (updatedStats.cleanliness >= 100) {
        updatedAchievements = prev.achievements.map((ach) => {
          if (ach.id === 'ach-clean') {
            return { ...ach, progress: 1 };
          }
          return ach;
        });
      }

      updatedStats.happiness = Math.round(
        (updatedStats.love + updatedStats.hunger + updatedStats.sleep + updatedStats.cleanliness + updatedStats.fun) / 5
      );

      return {
        ...prev,
        currentRoom: { ...prev.currentRoom, background: 'bathroom' },
        stats: updatedStats,
        achievements: updatedAchievements,
      };
    });
  };

  // Dormir Pet
  const handleToggleSleep = () => {
    playBarkSound();
    if (isSleeping) {
      // Wake up
      setIsSleeping(false);
      setActiveBehavior(ActiveBehavior.Idle);
      setNotificationMsg('☀️ ¡BUENOS DÍAS! Estoy súper despierto y listo para robarme otro calcetín.');
      setShowNotification(true);
      setGameState((prev) => ({
        ...prev,
        currentRoom: { ...prev.currentRoom, background: 'patio' },
      }));
    } else {
      // Sleep
      setIsSleeping(true);
      setActiveBehavior(ActiveBehavior.Sleeping);
      setNotificationMsg('😴 Zzz... Soñando con un jardín lleno de conejitos de felpa... Zzz...');
      setShowNotification(true);
      setTodayActivities((prev) => [...prev, 'durmió una siesta reparadora']);
      unlockMemory('mem-first-nap');
      if (gameState.stats.fun >= 75 && gameState.stats.hunger >= 75) {
        unlockMemory('mem-sec-perfect-nap');
      }

      setGameState((prev) => {
        const updatedStats = { ...prev.stats };
        updatedStats.sleep = Math.min(100, updatedStats.sleep + 45);
        updatedStats.energy = Math.min(100, updatedStats.energy + 50);
        updatedStats.happiness = Math.round(
          (updatedStats.love + updatedStats.hunger + updatedStats.sleep + updatedStats.cleanliness + updatedStats.fun) / 5
        );

        return {
          ...prev,
          currentRoom: { ...prev.currentRoom, background: 'bedroom' },
          stats: updatedStats,
        };
      });
    }
  };

  // Lanzar Pelota
  const handlePlayFetch = () => {
    if (isSleeping) return;
    playBarkSound();

    setActiveBehavior(ActiveBehavior.Fetch);
    setNotificationMsg('🎾 ¡LANZASTE LA PELOTA! ¡Voy corriendo tan rápido que casi me tropiezo!');
    setShowNotification(true);
    setTodayActivities((prev) => [...prev, 'jugó a traer la pelota de tenis']);

    setTimeout(() => {
      // Returned with ball
      setActiveBehavior(ActiveBehavior.Idle);
      setNotificationMsg('🎾 ¡Te la traje! Aquí está, lánzala de nuevo, lánzala lánzala lánzala!');
      setShowNotification(true);
    }, 2500);

    setGameState((prev) => {
      const updatedStats = { ...prev.stats };
      updatedStats.fun = Math.min(100, updatedStats.fun + 25);
      updatedStats.energy = Math.max(0, updatedStats.energy - 15);
      updatedStats.love = Math.min(100, updatedStats.love + 10);
      updatedStats.happiness = Math.round(
        (updatedStats.love + updatedStats.hunger + updatedStats.sleep + updatedStats.cleanliness + updatedStats.fun) / 5
      );

      return {
        ...prev,
        currentRoom: { ...prev.currentRoom, background: 'patio' },
        stats: updatedStats,
      };
    });

    earnXP(15);
    triggerAchievementProgress('ach-games', 1);
    registerPetActivity('play');
    unlockMemory('mem-first-play');
  };

  const handleSelectScene = (scene: 'eating' | 'bathroom' | 'bedroom' | 'patio') => {
    setGameState((prev) => ({
      ...prev,
      currentRoom: { ...prev.currentRoom, background: scene },
    }));
  };

  // Click on Pet (Caricias)
  const handlePetPuppy = () => {
    if (isSleeping) return;
    initAudio();
    playBarkSound();

    setIsPetting(true);
    setActiveBehavior(ActiveBehavior.BellyRub);
    setNotificationMsg('💖 ¡SÍII! ¡Amo las caricias en la panza! Muevo mis patitas de la felicidad.');
    setShowNotification(true);

    setTimeout(() => {
      setIsPetting(false);
      setActiveBehavior(ActiveBehavior.Idle);
    }, 2000);

    setGameState((prev) => {
      const updatedStats = { ...prev.stats };
      updatedStats.love = Math.min(100, updatedStats.love + 15);
      updatedStats.fun = Math.min(100, updatedStats.fun + 10);
      
      // If happiness or love hits 100, record achievements
      let updatedAchievements = [...prev.achievements];
      if (updatedStats.love >= 100) {
        updatedAchievements = prev.achievements.map((ach) => {
          if (ach.id === 'ach-happy') {
            return { ...ach, progress: 1 };
          }
          return ach;
        });
      }

      updatedStats.happiness = Math.round(
        (updatedStats.love + updatedStats.hunger + updatedStats.sleep + updatedStats.cleanliness + updatedStats.fun) / 5
      );

      return {
        ...prev,
        stats: updatedStats,
        achievements: updatedAchievements,
      };
    });

    earnXP(5);
    triggerAchievementProgress('ach-pet', 1);
    registerPetActivity('affection');
    unlockMemory('mem-first-pet');
    if (gameState.stats.love >= 85) {
      unlockMemory('mem-sec-best-friend');
    }
  };

  // --- 4.5 TRAVESURAS & EVENTOS ESPONTÁNEOS ---
  const todayStr = new Date().toISOString().split('T')[0];
  const dayNumber = new Date().getDate();
  const todayMischief = MISCHIEF_PRESETS[dayNumber % MISCHIEF_PRESETS.length];
  const isDailyCompletedToday = gameState.dailyMischiefCompletedDate === todayStr;

  const handlePlayDailyMischief = () => {
    if (isSleeping) return;
    initAudio();
    playBarkSound();
    setActiveMischiefModal({
      item: todayMischief,
      isDaily: true,
    });
  };

  const handleCompleteMischief = (choice: 'A' | 'B', rewardXp: number, rewardCoins: number) => {
    if (!activeMischiefModal) return;
    const { item, isDaily } = activeMischiefModal;

    playChimeSound();
    earnXP(rewardXp);
    earnCoins(rewardCoins);
    registerPetActivity('mischief');

    unlockMemory('mem-first-mischief');
    if (item.id === 'mischief-sock') {
      unlockMemory('mem-sock-stolen');
      triggerAchievementProgress('ach-sock', 1);
    } else if (item.id === 'mischief-slipper') {
      unlockMemory('mem-slipper-stolen');
    } else if (item.id === 'mischief-food') {
      unlockMemory('mem-food-stolen');
    }

    if (isDaily) {
      setGameState((prev) => ({
        ...prev,
        dailyMischiefCompletedDate: todayStr,
        dailyMischiefId: item.id,
        bones: prev.bones + 2,
      }));
      setNotificationMsg(`✨ ¡Travesura del día completada! +${rewardXp} XP, +${rewardCoins} 🪙, +2 🦴`);
    } else {
      setNotificationMsg(`🐾 ¡Travesura resuelta! +${rewardXp} XP, +${rewardCoins} 🪙`);
    }

    setShowNotification(true);
    setTodayActivities((prev) => [...prev, `participó en la travesura: ${item.title}`]);
    setActiveMischiefModal(null);
    setActiveBehavior(ActiveBehavior.Idle);
  };

  const handleCompleteSpontaneousEvent = (choice: 'A' | 'B') => {
    if (!activeSpontaneousEvent) return;
    const ev = activeSpontaneousEvent;
    const choiceData = choice === 'A' ? ev.choiceA : ev.choiceB;

    playChimeSound();
    if (choiceData?.rewardXp) earnXP(choiceData.rewardXp);
    if (choiceData?.rewardCoins) earnCoins(choiceData.rewardCoins);

    // Apply stat changes if any
    if (choiceData?.statChanges) {
      setGameState((prev) => {
        const stats = { ...prev.stats };
        Object.entries(choiceData.statChanges!).forEach(([key, val]) => {
          if (key in stats) {
            (stats as any)[key] = Math.min(100, Math.max(0, (stats as any)[key] + val));
          }
        });
        stats.happiness = Math.round(
          (stats.love + stats.hunger + stats.sleep + stats.cleanliness + stats.fun) / 5
        );
        return { ...prev, stats };
      });
    }

    unlockMemory('mem-first-surprise');
    if (ev.id === 'event-zoomies') {
      registerPetActivity('play');
      unlockMemory('mem-sec-big-race');
    } else if (ev.id === 'event-bath-shake') {
      registerPetActivity('bath');
      unlockMemory('mem-sec-bath-disaster');
    } else if (ev.id === 'event-nap') {
      unlockMemory('mem-sec-unexpected-nap');
    } else if (ev.id === 'event-cuddle') {
      registerPetActivity('affection');
      unlockMemory('mem-sec-best-friend');
    }

    setTodayActivities((prev) => [...prev, `vivió el momento: ${ev.title}`]);
    setActiveSpontaneousEvent(null);
  };

  // Spontaneous Mischief & Event Loop
  useEffect(() => {
    const triggerSpontaneous = () => {
      if (
        isSleeping ||
        activeBehavior !== ActiveBehavior.Idle ||
        activeMischiefModal !== null ||
        activeSpontaneousEvent !== null ||
        showShop ||
        showAchievements ||
        showDiary ||
        showMinigames ||
        showCalendar ||
        showMemories
      ) {
        return;
      }

      // 50% spontaneous event, 50% mischief behavior
      const roll = Math.random();
      if (roll < 0.5) {
        // Trigger a spontaneous event modal
        const randomEvent = SPONTANEOUS_EVENT_PRESETS[Math.floor(Math.random() * SPONTANEOUS_EVENT_PRESETS.length)];
        setActiveSpontaneousEvent(randomEvent);
        playBarkSound();
      } else {
        // Trigger a mischief behavior
        const items: ActiveBehavior[] = [
          ActiveBehavior.StoleSock,
          ActiveBehavior.StoleSlipper,
          ActiveBehavior.PuppyEyes,
        ];
        const selected = items[Math.floor(Math.random() * items.length)];
        setActiveBehavior(selected);

        let msg = '🥺 ¡Mira mi carita tierna! ¿Me darías una galletita?';
        if (selected === ActiveBehavior.StoleSock) {
          msg = '🧦 ¡JAJA! ¡Me robé tu calcetín favorito! ¡Toca a Golden para atraparlo!';
          playBarkSound();
        } else if (selected === ActiveBehavior.StoleSlipper) {
          msg = '👟 ¡Esta chancleta sabe tan rica! ¡Toca a Golden para rescatarla!';
          playBarkSound();
        }

        setNotificationMsg(msg);
        setShowNotification(true);
      }
    };

    // Attempt trigger every 65 seconds
    const interval = setInterval(triggerSpontaneous, 65000);
    return () => clearInterval(interval);
  }, [
    isSleeping,
    activeBehavior,
    activeMischiefModal,
    activeSpontaneousEvent,
    showShop,
    showAchievements,
    showDiary,
    showMinigames,
    showCalendar,
    showMemories,
  ]);

  // Handle catching the pet during a mischief chase
  const handleCatchPet = () => {
    if (activeBehavior === ActiveBehavior.StoleSock || activeBehavior === ActiveBehavior.StoleSlipper) {
      const isSock = activeBehavior === ActiveBehavior.StoleSock;
      const mischief = isSock ? MISCHIEF_PRESETS[0] : MISCHIEF_PRESETS[1];
      setActiveMischiefModal({
        item: mischief,
        isDaily: false,
      });
    } else {
      // Normal petting
      handlePetPuppy();
    }
  };

  // --- 5. AI ENGINE INTEGRATIONS (Server API Calls) ---

  // Call GEMINI Translate Bark
  const handleTranslateBark = async () => {
    if (isSleeping) return;
    setIsTranslating(true);

    try {
      const response = await fetch('/api/gemini/translate-bark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          petName: gameState.petName,
          level: gameState.level,
          hunger: gameState.stats.hunger,
          cleanliness: gameState.stats.cleanliness,
          fun: gameState.stats.fun,
          behavior: activeBehavior,
          accessory: gameState.currentAccessory.collar || 'Ninguno',
        }),
      });

      const data = await response.json();
      setAiThought(data);

      // Dismiss after 10s
      setTimeout(() => setAiThought(null), 10000);
    } catch (e) {
      console.error(e);
      setAiThought({
        thought: '¡Guau guau! (¡Creo que el satélite perruno se desconectó temporalmente, pero juro que te amo más que a la comida!)',
        actionHint: 'Acaríciame o juguemos a la pelota.',
      });
    } finally {
      setIsTranslating(false);
    }
  };

  // Call GEMINI Generate Diary Entry
  const handleGenerateDiary = async () => {
    setIsGeneratingDiary(true);

    try {
      const response = await fetch('/api/gemini/generate-diary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          petName: gameState.petName,
          level: gameState.level,
          activities: todayActivities,
        }),
      });

      const data = await response.json();
      const newEntry: DiaryEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
        title: `Aventuras de Cachorro Nivel ${gameState.level}`,
        content: data.diary,
      };

      setDiaryEntries((prev) => [newEntry, ...prev]);
      playChimeSound();
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingDiary(false);
    }
  };

  // --- 6. SHOP TRANSACTIONS ---
  const handlePurchaseAccessory = (id: string) => {
    const item = gameState.accessories.find((a) => a.id === id);
    if (!item || gameState.coins < item.price) return;

    playChimeSound();
    setGameState((prev) => {
      const updatedAcc = prev.accessories.map((a) => (a.id === id ? { ...a, purchased: true } : a));
      return {
        ...prev,
        coins: prev.coins - item.price,
        accessories: updatedAcc,
      };
    });
  };

  const handleEquipAccessory = (id: string) => {
    const item = gameState.accessories.find((a) => a.id === id);
    if (!item || !item.purchased) return;

    playBarkSound();
    setGameState((prev) => {
      const newEquipped = { ...prev.currentAccessory };
      const cat = item.category;

      if (newEquipped[cat] === id) {
        // Unequip
        delete newEquipped[cat];
      } else {
        // Equip
        newEquipped[cat] = id;
      }

      return {
        ...prev,
        currentAccessory: newEquipped,
      };
    });
  };

  const handlePurchaseRoomItem = (id: string) => {
    const item = gameState.roomItems.find((r) => r.id === id);
    if (!item || gameState.coins < item.price) return;

    playChimeSound();
    setGameState((prev) => {
      const updatedRooms = prev.roomItems.map((r) => (r.id === id ? { ...r, purchased: true } : r));
      return {
        ...prev,
        coins: prev.coins - item.price,
        roomItems: updatedRooms,
      };
    });
  };

  const handleEquipRoomItem = (id: string) => {
    const item = gameState.roomItems.find((r) => r.id === id);
    if (!item || !item.purchased) return;

    playBarkSound();
    setGameState((prev) => {
      const newRoom = { ...prev.currentRoom };
      if (item.category === 'bed') {
        newRoom.bed = id;
      } else if (item.category === 'bowl') {
        newRoom.bowl = id;
      }
      return {
        ...prev,
        currentRoom: newRoom,
      };
    });
  };

  const handleClaimAchievement = (id: string) => {
    const ach = gameState.achievements.find((a) => a.id === id);
    if (!ach || ach.completed) return;

    playChimeSound();
    setGameState((prev) => {
      const updated = prev.achievements.map((a) => (a.id === id ? { ...a, completed: true } : a));
      return {
        ...prev,
        coins: prev.coins + ach.rewardCoins,
        achievements: updated,
      };
    });
  };

  // --- 6.5 HEALTH REMINDER HANDLERS ---
  const handleAddReminder = (newRem: Omit<PetReminder, 'id' | 'completed' | 'notified'>) => {
    const id = `rem-${Date.now()}`;
    const reminder: PetReminder = {
      ...newRem,
      id,
      completed: false,
      notified: false
    };
    setReminders((prev) => [reminder, ...prev]);
  };

  const handleToggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  // --- 7. ROOM ENVIRONMENT BACKGROUND STYLE CLASS ---
  const getBackgroundStyle = () => {
    const bg = gameState.currentRoom.background;
    if (isSleeping) {
      return 'bg-gradient-to-b from-[#1E192A] via-[#2A233C] to-[#171424] text-white';
    }
    switch (bg) {
      case 'garden':
        return 'bg-gradient-to-b from-[#EDF7ED] via-[#FFFDF9] to-[#E3F2E4]';
      case 'bathroom':
        return 'bg-gradient-to-b from-[#EBF5FB] via-[#FFFDF9] to-[#E1F0FA]';
      case 'bedroom':
        return 'bg-gradient-to-b from-[#F5EEFB] via-[#FFFDF9] to-[#EAE0F5]';
      default: // living-room
        return 'bg-gradient-to-b from-[#FFF8EE] via-[#FFFDF9] to-[#FFF0D4]';
    }
  };

  return (
    <div id="golden-life-app-root" className={`min-h-screen ${getBackgroundStyle()} flex flex-col items-center p-3 sm:p-5 transition-colors duration-1000 select-none relative overflow-x-hidden`}>
      
      {/* 0. INTRODUCTORY BRAND SPLASH SCREEN */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Dynamic room environment accents (Only if not sleeping) */}
      {!isSleeping && (
        <div className="absolute inset-0 pointer-events-none opacity-40">
          {gameState.currentRoom.background === 'garden' ? (
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-emerald-100/50" />
          ) : gameState.currentRoom.background === 'bathroom' ? (
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-sky-200/40 border-t border-sky-300/40" />
          ) : (
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-amber-950/5" />
          )}
        </div>
      )}

      {/* Floating notification for pet activities */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            className="absolute top-16 left-1/2 transform -translate-x-1/2 z-40 bg-[#3D2B24] text-white text-xs font-montserrat font-medium px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-[#F4D396] max-w-[90vw] text-center"
          >
            <Dog className="w-4 h-4 text-[#F4B942] fill-[#F4B942]" />
            <span>{notificationMsg}</span>
            <button onClick={() => setShowNotification(false)} className="ml-1 text-[#F4B942] hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-xl flex flex-col gap-4 relative z-10">
        
        {/* TOP STATUS NAVIGATION BAR WITH NEW BRAND LOGO */}
        <header className="flex justify-between items-center bg-white/85 backdrop-blur-md rounded-[22px] px-3.5 sm:px-4 py-2.5 sm:py-3 shadow-[0_2px_12px_rgba(90,56,40,0.04)] border border-[#F4D396]/60">
          <GoldenLogo size="md" />

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Language Switcher */}
            <LanguageToggle />

            {/* Music Toggle */}
            <button
              onClick={handleToggleMusic}
              className={`p-2 rounded-[16px] transition-all border cursor-pointer ${
                musicEnabled 
                  ? 'bg-[#FFF0D4] border-[#F4B942] text-[#3D2B24]' 
                  : 'bg-[#FFFDF9] border-[#F4D396]/60 text-[#806F66] hover:bg-[#FFF8EE]'
              }`}
              title={t('musicTitle')}
            >
              {musicEnabled ? <Volume2 className="w-4 h-4 text-[#F4B942]" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Calendar Toggle */}
            <button
              onClick={() => setShowCalendar(true)}
              className="p-2 rounded-[16px] bg-[#FFFDF9] border border-[#F4D396]/60 text-[#3D2B24] hover:bg-[#FFF8EE] transition-all flex items-center gap-1.5 text-xs font-montserrat font-medium cursor-pointer shadow-2xs"
              title={t('calendarTitle')}
            >
              <Calendar className="w-4 h-4 text-[#F4B942]" />
              <span className="hidden sm:inline">{t('calendarTitle')}</span>
            </button>

            {/* Memories Album Toggle */}
            <button
              onClick={() => setShowMemories(true)}
              className="p-2 rounded-[16px] bg-[#FFFDF9] border border-[#F4D396]/60 text-[#3D2B24] hover:bg-[#FFF8EE] transition-all flex items-center gap-1.5 text-xs font-montserrat font-medium cursor-pointer shadow-2xs relative"
              title={t('memoriesTitle')}
            >
              <Camera className="w-4 h-4 text-[#F4B942]" />
              <span className="hidden sm:inline">{t('memoriesTitle')}</span>
              {gameState.memories && gameState.memories.some((m) => m.unlocked) && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* Shop Toggle */}
            <button
              onClick={() => setShowShop(true)}
              className="p-2 rounded-[16px] bg-[#FFFDF9] border border-[#F4D396]/60 text-[#3D2B24] hover:bg-[#FFF8EE] transition-all flex items-center gap-1.5 text-xs font-montserrat font-medium cursor-pointer shadow-2xs"
              title={t('shopTitle')}
            >
              <ShoppingBag className="w-4 h-4 text-[#F4B942]" />
              <span className="hidden sm:inline">{t('shopTitle')}</span>
            </button>

            {/* Minigames Toggle */}
            <button
              onClick={() => setShowMinigames(true)}
              className="p-2 rounded-[16px] bg-[#F4B942] text-[#3D2B24] hover:bg-[#FFD477] transition-all flex items-center gap-1.5 text-xs font-montserrat font-medium shadow-xs border border-[#E29E2E] cursor-pointer"
              title={t('minigamesTitle')}
            >
              <Gamepad2 className="w-4 h-4" />
              <span className="hidden sm:inline">{t('minigamesTitle')}</span>
            </button>
          </div>
        </header>

        {/* MAIN PET GRAPHICS WINDOW (PROTAGONIST STAGE: 60-70% VISUAL FOCUS) */}
        <main className="relative flex flex-col items-center justify-center py-1 sm:py-2 w-full">
          {/* Dynamic Emotional State Speech Bubble */}
          <motion.div
            key={getPuppyStatusMessage()}
            initial={{ scale: 0.92, opacity: 0, y: 6 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative bg-white/95 border border-[#F4D396] shadow-[0_4px_16px_rgba(90,56,40,0.06)] px-4 py-2 rounded-[20px] text-[#3D2B24] font-montserrat font-medium text-xs sm:text-sm flex items-center gap-2 mb-1 z-20 cursor-pointer select-none hover:bg-[#FFF8EE] transition-colors"
            onClick={handleCatchPet}
            title={t('tapHint')}
          >
            <span>{getPuppyStatusMessage()}</span>
            <div className="absolute left-1/2 -bottom-1.5 transform -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-[#F4D396] rotate-45" />
          </motion.div>

          {/* Dynamic Scenery matching the active action (comer = huesos, baño = baño, dormir = cuarto en cama, jugar = exterior/patio) */}
          <DynamicScenery
            scenery={
              activeBehavior === ActiveBehavior.Eating
                ? 'eating'
                : activeBehavior === ActiveBehavior.Bath
                ? 'bathroom'
                : activeBehavior === ActiveBehavior.Sleeping || isSleeping
                ? 'bedroom'
                : activeBehavior === ActiveBehavior.Fetch
                ? 'patio'
                : (gameState.currentRoom.background as SceneryType) || 'patio'
            }
            isSleeping={isSleeping}
            isBath={activeBehavior === ActiveBehavior.Bath}
          >
            <GoldenPuppy
              behavior={activeBehavior}
              emotion={getPuppyEmotion()}
              accessories={gameState.accessories}
              equipped={gameState.currentAccessory}
              isPetting={isPetting}
              onPetClick={handleCatchPet}
            />
          </DynamicScenery>
        </main>

        {/* DAILY MISCHIEF BANNER */}
        <DailyMischiefBanner
          mischief={todayMischief}
          petName={gameState.petName}
          isCompletedToday={isDailyCompletedToday}
          onPlay={handlePlayDailyMischief}
        />

        {/* CORE ACTIONS DIRECTORY */}
        <ActionMenu
          activeBehavior={activeBehavior}
          isSleeping={isSleeping}
          onFeed={handleFeedPet}
          onBath={handleBathPet}
          onToggleSleep={handleToggleSleep}
          onPlayFetch={handlePlayFetch}
          onTranslateBark={handleTranslateBark}
          onOpenDiary={() => setShowDiary(true)}
          aiThought={aiThought}
          isTranslating={isTranslating}
          isShaking={isShaking}
          onSelectScene={handleSelectScene}
        />

        {/* STATS CONTROL PANEL */}
        <StatusBars 
          gameState={gameState} 
          onOpenAchievements={() => setShowAchievements(true)} 
          onRenamePet={() => setShowRenamePet(true)}
        />
      </div>

      {/* OVERLAY: MEMORIES ALBUM & PERSONALITY PANEL */}
      <AnimatePresence>
        {showMemories && (
          <MemoriesPanel
            gameState={gameState}
            memories={gameState.memories || INITIAL_MEMORIES}
            selectedMemoryId={selectedMemoryDetailId}
            onClose={() => {
              setShowMemories(false);
              setSelectedMemoryDetailId(null);
            }}
            onUpdateMemoryPhoto={handleUpdateMemoryPhoto}
            onOpenRenamePet={() => setShowRenamePet(true)}
          />
        )}
      </AnimatePresence>

      {/* OVERLAY: NEW MEMORY UNLOCKED TOAST */}
      <AnimatePresence>
        {newlyUnlockedMemory && (
          <NewMemoryToast
            memory={newlyUnlockedMemory}
            onView={(mem) => {
              setSelectedMemoryDetailId(mem.id);
              setShowMemories(true);
              setNewlyUnlockedMemory(null);
            }}
            onDismiss={() => setNewlyUnlockedMemory(null)}
          />
        )}
      </AnimatePresence>

      {/* OVERLAY: ACTIVE MISCHIEF MODAL */}
      <AnimatePresence>
        {activeMischiefModal && (
          <MischiefModal
            mischief={activeMischiefModal.item}
            petName={gameState.petName}
            isDaily={activeMischiefModal.isDaily}
            onComplete={handleCompleteMischief}
            onClose={() => {
              setActiveMischiefModal(null);
              setActiveBehavior(ActiveBehavior.Idle);
            }}
          />
        )}
      </AnimatePresence>

      {/* OVERLAY: SPONTANEOUS EVENT MODAL */}
      <AnimatePresence>
        {activeSpontaneousEvent && (
          <SpontaneousEventModal
            event={activeSpontaneousEvent}
            petName={gameState.petName}
            onComplete={handleCompleteSpontaneousEvent}
            onClose={() => setActiveSpontaneousEvent(null)}
          />
        )}
      </AnimatePresence>

      {/* OVERLAY: PERSONALIZED BOUTIQUE STORE */}
      <AnimatePresence>
        {showShop && (
          <ShopPanel
            gameState={gameState}
            onPurchaseAccessory={handlePurchaseAccessory}
            onEquipAccessory={handleEquipAccessory}
            onPurchaseRoomItem={handlePurchaseRoomItem}
            onEquipRoomItem={handleEquipRoomItem}
            onClose={() => setShowShop(false)}
          />
        )}
      </AnimatePresence>

      {/* OVERLAY: ACHIEVEMENTS PANEL */}
      <AnimatePresence>
        {showAchievements && (
          <AchievementsPanel
            gameState={gameState}
            onClaimReward={handleClaimAchievement}
            onClose={() => setShowAchievements(false)}
          />
        )}
      </AnimatePresence>

      {/* OVERLAY: SECRET DIARY PAPYRUS PANEL */}
      <AnimatePresence>
        {showDiary && (
          <DiaryPanel
            gameState={gameState}
            diaryEntries={diaryEntries}
            onGenerateEntry={handleGenerateDiary}
            isGenerating={isGeneratingDiary}
            onClose={() => setShowDiary(false)}
          />
        )}
      </AnimatePresence>

      {/* OVERLAY: ARCADE MINIGAMES PARK */}
      <AnimatePresence>
        {showMinigames && (
          <MinigamesPanel
            coins={gameState.coins}
            onEarnCoins={earnCoins}
            onEarnXP={earnXP}
            onTriggerAchievementProgress={triggerAchievementProgress}
            onClose={() => setShowMinigames(false)}
          />
        )}
      </AnimatePresence>

      {/* OVERLAY: SANITARY CALENDAR PANEL */}
      <AnimatePresence>
        {showCalendar && (
          <CalendarPanel
            reminders={reminders}
            onAddReminder={handleAddReminder}
            onToggleReminder={handleToggleReminder}
            onDeleteReminder={handleDeleteReminder}
            onPlayBarkSound={playBarkSound}
            onClose={() => setShowCalendar(false)}
          />
        )}
      </AnimatePresence>

      {/* OVERLAY: RENAME PET MODAL */}
      <AnimatePresence>
        {showRenamePet && (
          <RenamePetModal
            currentName={gameState.petName}
            onSave={handleRenamePet}
            onClose={() => setShowRenamePet(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
