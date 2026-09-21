import { Accessory, RoomItem, Achievement, GameState, Emotion } from './types';
import { INITIAL_MEMORIES } from './memoriesData';

export const INITIAL_ACCESSORIES: Accessory[] = [
  // Collars
  { id: 'collar-red', name: 'Collar Rojo Tradicional', category: 'collar', color: '#ef4444', price: 0, purchased: true, icon: '🔴' },
  { id: 'collar-blue', name: 'Collar Azul Real', category: 'collar', color: '#3b82f6', price: 50, purchased: false, icon: '🔵' },
  { id: 'collar-pink', name: 'Collar Rosa Chic', category: 'collar', color: '#ec4899', price: 80, purchased: false, icon: '🌸' },
  { id: 'collar-gold', name: 'Collar de Oro de la Fama', category: 'collar', color: '#eab308', price: 500, purchased: false, icon: '👑' },

  // Hats
  { id: 'hat-detective', name: 'Sombrero de Detective', category: 'hat', price: 150, purchased: false, icon: '🕵️' },
  { id: 'hat-party', name: 'Sombrero de Fiesta', category: 'hat', price: 100, purchased: false, icon: '🎉' },
  { id: 'hat-wizard', name: 'Gorro de Mago', category: 'hat', price: 300, purchased: false, icon: '🧙' },

  // Glasses
  { id: 'glasses-cool', name: 'Lentes del Futuro', category: 'glasses', price: 120, purchased: false, icon: '🕶️' },
  { id: 'glasses-nerd', name: 'Lentes de Intelectual', category: 'glasses', price: 90, purchased: false, icon: '🤓' },

  // Bandanas
  { id: 'bandana-red', name: 'Bandana de Aventura', category: 'bandana', color: '#f97316', price: 70, purchased: false, icon: '🧣' },
  { id: 'bandana-stars', name: 'Bandana Galáctica', category: 'bandana', color: '#6366f1', price: 140, purchased: false, icon: '🌌' },
  { id: 'bandana-fresh', name: 'Bandana "Fresh Golden" 🧼', category: 'bandana', color: '#06b6d4', price: 0, purchased: false, icon: '🧼' },

  // Backpacks
  { id: 'backpack-explorer', name: 'Mochila de Explorador', category: 'backpack', price: 200, purchased: false, icon: '🎒' },
];

export const INITIAL_ROOM_ITEMS: RoomItem[] = [
  // Beds
  { id: 'bed-standard', name: 'Cojín Clásico Rojo', category: 'bed', price: 0, purchased: true, style: 'red', icon: '🛏️' },
  { id: 'bed-royal', name: 'Cama Real Acolchada', category: 'bed', price: 180, purchased: false, style: 'purple-gold', icon: '👑' },
  { id: 'bed-cloud', name: 'Cama Nube de Ensueño', category: 'bed', price: 250, purchased: false, style: 'cloud-blue', icon: '☁️' },

  // Bowls
  { id: 'bowl-plastic', name: 'Plato Plástico Simple', category: 'bowl', price: 0, purchased: true, style: 'red', icon: '🥣' },
  { id: 'bowl-metal', name: 'Plato de Acero Inoxidable', category: 'bowl', price: 60, purchased: false, style: 'silver', icon: '🍽️' },
  { id: 'bowl-gold', name: 'Plato Dorado Real', category: 'bowl', price: 350, purchased: false, style: 'gold', icon: '🏆' },

  // Toys
  { id: 'toy-ball', name: 'Pelota de Tenis Favorita', category: 'toy', price: 0, purchased: true, style: 'tennis', icon: '🎾' },
  { id: 'toy-bone', name: 'Hueso de Hule Chillante', category: 'toy', price: 50, purchased: false, style: 'rubber-bone', icon: '🦴' },
  { id: 'toy-frisbee', name: 'Frisbee Volador Pro', category: 'toy', price: 120, purchased: false, style: 'frisbee', icon: '🥏' },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach-bath', title: 'Primer Baño 🧼', description: 'Dale un baño completo y sécalo por primera vez.', progress: 0, target: 1, completed: false, icon: '🧼', rewardCoins: 50 },
  { id: 'ach-sock', title: 'Rey de las Travesuras 🧦', description: 'Atrápalo cuando se robe un calcetín.', progress: 0, target: 1, completed: false, icon: '🧦', rewardCoins: 50 },
  { id: 'ach-pet', title: 'Masajes Infinitos ❤️', description: 'Dale caricias deslizando el dedo 100 veces.', progress: 0, target: 100, completed: false, icon: '💖', rewardCoins: 100 },
  { id: 'ach-feed', title: '¡Buen Provecho! 🍖', description: 'Alimenta a tu cachorro 50 veces.', progress: 0, target: 50, completed: false, icon: '🍗', rewardCoins: 80 },
  { id: 'ach-games', title: 'Espíritu Atlético ⚽', description: 'Juega pelota o frisbee con él 30 veces.', progress: 0, target: 30, completed: false, icon: '⚽', rewardCoins: 120 },
  { id: 'ach-happy', title: 'Felicidad Plena 😊', description: 'Alcanza el 100% de Felicidad.', progress: 0, target: 1, completed: false, icon: '🌟', rewardCoins: 60 },
  { id: 'ach-clean', title: 'Espejo de Limpieza ✨', description: 'Mantén a tu mascota al 100% de limpieza.', progress: 0, target: 1, completed: false, icon: '✨', rewardCoins: 40 },
  { id: 'ach-rich', title: 'Inversionista de Juguetes 💰', description: 'Consigue tus primeras 500 monedas.', progress: 0, target: 500, completed: false, icon: '🪙', rewardCoins: 100 },
];

export const DEFAULT_GAME_STATE: GameState = {
  petName: 'Golden Buddy',
  level: 1,
  experience: 0,
  coins: 120,
  bones: 2,
  stats: {
    love: 80,
    hunger: 75,
    sleep: 85,
    cleanliness: 70,
    fun: 65,
    energy: 90,
    happiness: 75,
  },
  currentAccessory: {
    collar: 'collar-red',
  },
  currentRoom: {
    bed: 'bed-standard',
    bowl: 'bowl-plastic',
    background: 'patio',
  },
  accessories: INITIAL_ACCESSORIES,
  roomItems: INITIAL_ROOM_ITEMS,
  achievements: INITIAL_ACHIEVEMENTS,
  memories: INITIAL_MEMORIES,
  personality: {
    playCount: 0,
    affectionCount: 0,
    foodInteractions: 0,
    mischiefCount: 0,
    bathCount: 0,
    dominantTrait: 'Curioso & Juguetón 🐾',
  },
  lastInteractionTime: new Date().toISOString(),
  daysTogether: 1,
};

export const NOTIFICATION_BUBBLES = [
  "Tengo hambre 🥺",
  "¿Jugamos un rato con la pelota? ⚽",
  "Encontré un calcetín... ¡Y NO TE LO VOY A DAR! 🧦🏃‍♂️",
  "¿Dónde estabas? ¡Te extrañé muchísimo! 💕",
  "Hoy quiero salir a rodar en el pasto del jardín 🌱🐕",
  "¿Me das una caricia en la pancita? Se siente super rico...",
  "¡Guau guau! ¡Te amo humano!",
];
