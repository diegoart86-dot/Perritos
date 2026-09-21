/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Emotion {
  MuyFeliz = 'muy-feliz',
  Aburrido = 'aburrido',
  Triste = 'triste',
  Enojado = 'enojado',
  Hambriento = 'hambriento',
  MuyLimpio = 'muy-limpio',
}

export enum ActiveBehavior {
  Idle = 'idle',
  Sleeping = 'sleeping',
  PuppyEyes = 'puppy-eyes',
  Fetch = 'fetch',
  Bath = 'bath',
  StoleSock = 'stole-sock',
  StoleSlipper = 'stole-slipper',
  BellyRub = 'belly-rub',
  Eating = 'eating',
}

export interface PetStats {
  love: number;        // 0-100
  hunger: number;      // 0-100 (100 is full, 0 is starving)
  sleep: number;       // 0-100 (100 is fully rested)
  cleanliness: number; // 0-100
  fun: number;         // 0-100
  energy: number;      // 0-100
  happiness: number;   // 0-100 (calculated/overall)
}

export interface Accessory {
  id: string;
  name: string;
  category: 'collar' | 'hat' | 'glasses' | 'backpack' | 'bandana';
  color?: string;
  price: number;
  purchased: boolean;
  icon: string;
}

export interface RoomItem {
  id: string;
  name: string;
  category: 'bed' | 'bowl' | 'toy' | 'background';
  price: number;
  purchased: boolean;
  style: string;
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number; // e.g., 0 to target
  target: number;
  completed: boolean;
  icon: string;
  rewardCoins: number;
}

export interface GameState {
  petName: string;
  level: number;
  experience: number;
  coins: number;
  bones: number; // premium currency or special awards
  stats: PetStats;
  currentAccessory: {
    collar?: string; // accessory ID
    hat?: string;
    glasses?: string;
    backpack?: string;
    bandana?: string;
  };
  currentRoom: {
    bed: string;  // roomItem ID
    bowl: string;
    background: 'eating' | 'bathroom' | 'bedroom' | 'patio' | 'living-room' | 'garden';
  };
  accessories: Accessory[];
  roomItems: RoomItem[];
  achievements: Achievement[];
  memories?: PetMemory[];
  personality?: UserPetPersonality;
  dailyMischiefCompletedDate?: string;
  dailyMischiefId?: string;
  lastInteractionTime: string;
  daysTogether: number;
}

export interface ThoughtResponse {
  thought: string;
  actionHint: string;
}

export interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  content: string;
}

export interface PetReminder {
  id: string;
  type: 'vaccine' | 'flea_pill';
  title: string;
  date: string;
  time?: string;
  notes?: string;
  completed: boolean;
  notified: boolean;
}

export interface PetMemory {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'milestone' | 'mischief' | 'secret' | 'routine';
  unlocked: boolean;
  unlockedAt?: string;
  levelRecorded?: number;
  dayRecorded?: number;
  rewardXp?: number;
  rewardCoins?: number;
  rewardBones?: number;
  rewardAccessoryId?: string;
  secret?: boolean;
  hint?: string;
  eventStory?: string;
  photoUrl?: string; // Custom attached photo of the pet
  defaultPhotoUrl?: string; // Curated photograph depicting this action
}

export interface MischiefItem {
  id: string;
  title: string;
  category: 'objects' | 'house' | 'food' | 'toys' | 'bath' | 'movement' | 'sleep' | 'affection';
  description: string;
  icon: string;
  dialogue: string;
  choiceA: {
    label: string;
    text: string;
    rewardXp: number;
    rewardCoins: number;
    behavior?: ActiveBehavior;
  };
  choiceB: {
    label: string;
    text: string;
    rewardXp: number;
    rewardCoins: number;
    behavior?: ActiveBehavior;
  };
  associatedMemoryId?: string;
}

export interface SpontaneousEvent {
  id: string;
  title: string;
  type: 'what_did_you_find' | 'hungry_eyes' | 'where_was_it' | 'zoomies' | 'after_bath' | 'affection_moment' | 'fell_asleep';
  icon: string;
  description: string;
  dialogue: string;
  choiceA: {
    label: string;
    reaction: string;
    effectStats?: Partial<PetStats>;
    rewardXp?: number;
    rewardCoins?: number;
  };
  choiceB?: {
    label: string;
    reaction: string;
    effectStats?: Partial<PetStats>;
    rewardXp?: number;
    rewardCoins?: number;
  };
  associatedMemoryId?: string;
}

export interface UserPetPersonality {
  playCount: number;
  affectionCount: number;
  foodInteractions: number;
  mischiefCount: number;
  bathCount: number;
  dominantTrait?: string;
}


