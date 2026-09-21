export type Language = 'es' | 'en';

export interface Translations {
  appName: string;
  brandSubtitle: string;
  musicTitle: string;
  calendarTitle: string;
  memoriesTitle: string;
  shopTitle: string;
  shopSubtitle: string;
  minigamesTitle: string;
  languageSelect: string;
  languageCurrent: string;
  toggleLang: string;
  themeToggleLight: string;
  themeToggleDark: string;
  themeLabel: string;

  // Rooms
  roomLiving: string;
  roomGarden: string;
  roomBath: string;
  roomBed: string;

  // Puppy speech bubble states
  tapHint: string;
  bubblePetting: string;
  bubbleSleepy: string;
  bubbleFetch: string;
  bubbleEating: string;
  bubbleBath: string;
  bubbleStoleSock: string;
  bubbleStoleSlipper: string;
  bubblePuppyEyes: string;
  bubbleBellyRub: string;
  bubbleHungry: string;
  bubbleBored: string;
  bubbleSad: string;
  bubbleAngry: string;
  bubbleClean: string;
  bubbleDefault: string;

  // Status bars
  levelLabel: string;
  xpLabel: string;
  coinsLabel: string;
  statLove: string;
  statHunger: string;
  statSleep: string;
  statCleanliness: string;
  statFun: string;
  statEnergy: string;
  statHappiness: string;
  achievementsBtn: string;

  // Action Menu
  feedBtn: string;
  kibble: string;
  bone: string;
  steak: string;
  bathBtn: string;
  bathWater: string;
  bathShampoo: string;
  bathRinse: string;
  bathDry: string;
  sleepBtn: string;
  wakeBtn: string;
  playBtn: string;
  translateBtn: string;
  translatingBtn: string;
  translatorTitle: string;
  hintLabel: string;
  diaryBtn: string;

  // Notifications
  morningNotice: string;
  sleepNotice: string;
  fetchThrowNotice: string;
  fetchReturnNotice: string;
  petNotice: string;
  bathWaterNotice: string;
  bathShampooNotice: string;
  bathRinseNotice: string;
  bathDryNotice: string;
  reminderNoticePrefix: string;
  levelUpNotice: string;

  // Shop
  tabAccessories: string;
  tabDecoration: string;
  equipped: string;
  equip: string;
  coins: string;
  backToGolden: string;

  // Achievements
  achievementsTitle: string;
  achievementsCompletedOf: string;
  claimed: string;
  completed: string;
  progress: string;
  close: string;

  // Diary
  diaryTitle: string;
  diarySub: string;
  diaryGenerating: string;
  diaryWriteToday: string;
  diaryEmpty: string;
  diaryEmptyPrompt: string;
  closeDiary: string;

  // Calendar
  calendarPanelTitle: string;
  calendarPanelSub: string;
  calendarAddBtn: string;
  calendarTypeVaccine: string;
  calendarTypePill: string;
  calendarTitleInputPlaceholder: string;
  calendarDateLabel: string;
  calendarTimeLabel: string;
  calendarNotesLabel: string;
  calendarNotesPlaceholder: string;
  calendarSaveBtn: string;
  calendarCancelBtn: string;
  calendarTestSoundBtn: string;
  calendarTodayBadge: string;
  calendarDoneBadge: string;
  calendarPendingBadge: string;
  calendarNoEvents: string;
  calendarEventsCount: string;

  // Minigames
  minigamesParkTitle: string;
  minigamesParkSub: string;
  chooseMinigame: string;
  ballGameTitle: string;
  ballGameDesc: string;
  digGameTitle: string;
  digGameDesc: string;
  frisbeeGameTitle: string;
  frisbeeGameDesc: string;
  startBallGameBtn: string;
  ballGameInstruction: string;
  ballScoreLabel: string;
  ballTimeLabel: string;
  dragToMovePup: string;
  digRemainingLabel: string;
  digCoinsWonLabel: string;
  digEmptyText: string;
  digNewHoleBtn: string;
  frisbeeTitle: string;
  frisbeeDesc: string;
  startFrisbeeBtn: string;
  frisbeeTimingHint: string;
  frisbeeResultLabel: string;
  frisbeeLaunchNow: string;
  frisbeePerfectTitle: string;
  frisbeePerfectDesc: string;
  frisbeeGoodTitle: string;
  frisbeeGoodDesc: string;
  frisbeeMissTitle: string;
  frisbeeMissDesc: string;
  tryAgainBtn: string;
  backToParkBtn: string;
}

export const translations: Record<Language, Translations> = {
  es: {
    appName: 'Golden Life',
    brandSubtitle: 'Tu compañero virtual adorable',
    musicTitle: 'Música ambiente',
    calendarTitle: 'Calendario',
    memoriesTitle: 'Recuerdos',
    shopTitle: 'Boutique Golden',
    shopSubtitle: 'Accesorios y estilo para tu perrito',
    minigamesTitle: 'Jugar',
    languageSelect: 'Idioma',
    languageCurrent: 'Español',
    toggleLang: 'EN',
    themeToggleLight: 'Cambiar a modo claro',
    themeToggleDark: 'Cambiar a modo oscuro',
    themeLabel: 'Tema',

    roomLiving: 'Sala',
    roomGarden: 'Jardín',
    roomBath: 'Baño',
    roomBed: 'Dormir',

    tapHint: '¡Toca a tu Golden para interactuar!',
    bubblePetting: '¡Te quiero muchísimo! 💖',
    bubbleSleepy: 'Zzz... durmiendo plácidamente 💤',
    bubbleFetch: '¡Atrapé la pelota! ¡Lánzala otra vez! 🎾',
    bubbleEating: '¡Ñam ñam! ¡Está riquísimo! 🍖',
    bubbleBath: '¡Me siento súper fresco y limpio! 🧼✨',
    bubbleStoleSock: '¡Encontré este calcetín y es mi tesoro! 🧦🐾',
    bubbleStoleSlipper: '¡Mira mi chancla favorita! 👟🐾',
    bubblePuppyEyes: '¿Me convidas un pedacito, por favor? 🥺',
    bubbleBellyRub: '¡Ay sí, rascaditas en la pancita! 🥰',
    bubbleHungry: 'Tengo un poquito de hambre... 🍖',
    bubbleBored: '¡Quiero jugar un ratito contigo! ⚽',
    bubbleSad: '¿Me das un poquito de cariño? 💕',
    bubbleAngry: '¡Tengo hambrita y quiero mimitos! 🥺',
    bubbleClean: '¡Huelo a florecitas frescas y limpias! 🌸',
    bubbleDefault: '¡Hola! Estoy muy feliz de estar contigo 🐾',

    levelLabel: 'Nivel',
    xpLabel: 'Experiencia',
    coinsLabel: 'Monedas',
    statLove: 'Amor',
    statHunger: 'Hambre',
    statSleep: 'Sueño',
    statCleanliness: 'Limpieza',
    statFun: 'Diversión',
    statEnergy: 'Energía',
    statHappiness: 'Felicidad',
    achievementsBtn: 'Logros',

    feedBtn: 'Comer 🍖',
    kibble: 'Croquetas 🥣',
    bone: 'Hueso 🦴',
    steak: 'Filete 🥩',
    bathBtn: 'Baño 🧼',
    bathWater: '1. Mojar 🚿',
    bathShampoo: '2. Shampoo 🧴',
    bathRinse: '3. Enjuagar 💧',
    bathDry: '4. Secar 💨',
    sleepBtn: 'Dormir 💤',
    wakeBtn: 'Despertar ☀️',
    playBtn: 'Jugar ⚽',
    translateBtn: 'Traducir Pensamiento 🐾',
    translatingBtn: 'Escuchando ladrido...',
    translatorTitle: 'Traductor Canino 🐾',
    hintLabel: 'Sugerencia:',
    diaryBtn: 'Diario Secreto',

    morningNotice: '☀️ ¡BUENOS DÍAS! Estoy súper despierto y listo para jugar.',
    sleepNotice: '😴 Zzz... Soñando con un jardín lleno de premios... Zzz...',
    fetchThrowNotice: '🎾 ¡LANZASTE LA PELOTA! ¡Voy corriendo tan rápido que casi me tropiezo!',
    fetchReturnNotice: '🎾 ¡Te la traje! Aquí está, ¡lánzala de nuevo, lánzala!',
    petNotice: '💖 ¡SÍII! ¡Amo las caricias en la panza! Muevo mis patitas de la felicidad.',
    bathWaterNotice: '¡Me encanta salpicar agua por todo el baño! 🚿',
    bathShampooNotice: '¡El shampoo de vainilla huele tan rico que quiero comérmelo! 🧴',
    bathRinseNotice: '¡Atrás, burbujas! ¡Se sienten graciosas en mi nariz perruna! 💧',
    bathDryNotice: '💨 ¡Viento calientito! ¡Ahora voy a correr súper rápido por toda la alfombra!',
    reminderNoticePrefix: '🐾 ¡GUAU, GUAU! Recuerda: hoy toca',
    levelUpNotice: '🎉 ¡GUAU! ¡Subí al nivel',

    tabAccessories: 'Accesorios 🎩',
    tabDecoration: 'Decoración 🛏️',
    equipped: 'Equipado',
    equip: 'Equipar',
    coins: 'Monedas',
    backToGolden: 'Listo, volver con Golden',

    achievementsTitle: 'Logros Juntos',
    achievementsCompletedOf: 'completados',
    claimed: 'Reclamado',
    completed: 'Completado',
    progress: 'Progreso',
    close: 'Cerrar',

    diaryTitle: 'Diario Secreto',
    diarySub: 'Las aventuras y anécdotas más tiernas de tu Golden',
    diaryGenerating: 'Inspirando a tu Golden...',
    diaryWriteToday: 'Escribir Página de Hoy ✨',
    diaryEmpty: 'El diario está en blanco',
    diaryEmptyPrompt: '¡Toca el botón dorado arriba para que tu cachorro relate su primera anécdota!',
    closeDiary: 'Cerrar Diario',

    calendarPanelTitle: 'Calendario Sanitario Canino',
    calendarPanelSub: 'Citas veterinarias, vacunas y antipulgas',
    calendarAddBtn: 'Nueva Cita',
    calendarTypeVaccine: 'Vacuna 💉',
    calendarTypePill: 'Antipulgas 💊',
    calendarTitleInputPlaceholder: 'Ej. Vacuna Rabia o Pastilla NexGard',
    calendarDateLabel: 'Fecha',
    calendarTimeLabel: 'Hora',
    calendarNotesLabel: 'Notas adicionales (opcional)',
    calendarNotesPlaceholder: 'Ej. Llevar carnet sanitario...',
    calendarSaveBtn: 'Guardar Cita',
    calendarCancelBtn: 'Cancelar',
    calendarTestSoundBtn: 'Probar Alerta Sonora',
    calendarTodayBadge: 'HOY',
    calendarDoneBadge: 'Listo',
    calendarPendingBadge: 'Pendiente',
    calendarNoEvents: 'No hay citas registradas para este día.',
    calendarEventsCount: 'citas registradas',

    minigamesParkTitle: 'Parque de Juegos',
    minigamesParkSub: 'Elige una actividad para ganar monedas y experiencia juntos',
    chooseMinigame: 'Elige una actividad para ganar monedas y experiencia juntos',
    ballGameTitle: 'Atrapar Pelotas',
    ballGameDesc: 'Desliza a tu cachorro para atrapar pelotas y premios.',
    digGameTitle: 'Excavar Tesoros',
    digGameDesc: 'Encuentra monedas, huesos o calcetines ocultos en la arena.',
    frisbeeGameTitle: 'Lanzar Frisbee',
    frisbeeGameDesc: 'Calcula el momento perfecto en el centro para una atrapada acrobática.',
    startBallGameBtn: '¡Comenzar Juego (30s)!',
    ballGameInstruction: 'Mueve la barra inferior para desplazar a tu perrito. ¡Atrapa pelotas (🎾 +3) y huesos (🦴 +8)! Esquiva el lodo.',
    ballScoreLabel: 'Puntos',
    ballTimeLabel: 'Tiempo',
    dragToMovePup: 'Desliza para mover a tu Golden',
    digRemainingLabel: 'Excavaciones',
    digCoinsWonLabel: 'Ganados',
    digEmptyText: 'Vacío',
    digNewHoleBtn: 'Cavar un nuevo hoyo',
    frisbeeTitle: 'Lanzar el Frisbee',
    frisbeeDesc: 'Un juego de precisión. Lanza el frisbee exactamente cuando el indicador esté en el centro verde para una atrapada perfecta.',
    startFrisbeeBtn: '¡Comenzar Lanzamiento!',
    frisbeeTimingHint: '¡Toca cuando la aguja esté en el centro!',
    frisbeeResultLabel: 'Resultado del tiro:',
    frisbeeLaunchNow: '🚀 ¡LANZAR AHORA!',
    frisbeePerfectTitle: '🏆 ¡Atrapada Perfecta! 🥏',
    frisbeePerfectDesc: '¡Tu Golden dio un salto en el aire y atrapó el Frisbee limpiamente! (+50 monedas, +30 XP)',
    frisbeeGoodTitle: '✨ ¡Buen tiro! ✨',
    frisbeeGoodDesc: '¡Corrió a toda velocidad y atrapó el Frisbee! (+20 monedas, +15 XP)',
    frisbeeMissTitle: '🐾 ¡Casi casi!',
    frisbeeMissDesc: 'El Frisbee cayó al pasto pero tu perrito corrió a buscarlo de todas formas. (+2 monedas)',
    tryAgainBtn: 'Intentar otra vez',
    backToParkBtn: 'Volver al Parque',
  },
  en: {
    appName: 'Golden Life',
    brandSubtitle: 'Your adorable virtual companion',
    musicTitle: 'Ambient music',
    calendarTitle: 'Calendar',
    memoriesTitle: 'Memories',
    shopTitle: 'Golden Boutique',
    shopSubtitle: 'Accessories and cozy style for your pup',
    minigamesTitle: 'Play',
    languageSelect: 'Language',
    languageCurrent: 'English',
    toggleLang: 'ES',
    themeToggleLight: 'Switch to light mode',
    themeToggleDark: 'Switch to dark mode',
    themeLabel: 'Theme',

    roomLiving: 'Living Room',
    roomGarden: 'Garden',
    roomBath: 'Bath',
    roomBed: 'Sleep',

    tapHint: 'Tap your Golden to interact!',
    bubblePetting: 'I love you so much! 💖',
    bubbleSleepy: 'Zzz... sleeping peacefully 💤',
    bubbleFetch: 'I got the ball! Throw it again! 🎾',
    bubbleEating: 'Nom nom! This is delicious! 🍖',
    bubbleBath: 'I feel so fresh and squeaky clean! 🧼✨',
    bubbleStoleSock: 'I found this sock and it is my treasure! 🧦🐾',
    bubbleStoleSlipper: 'Look at my favorite slipper! 👟🐾',
    bubblePuppyEyes: 'Can you share a little bite, please? 🥺',
    bubbleBellyRub: 'Oh yes, belly rubs are the best! 🥰',
    bubbleHungry: 'I am a little hungry... 🍖',
    bubbleBored: 'I want to play with you! ⚽',
    bubbleSad: 'Could I have some love and cuddles? 💕',
    bubbleAngry: 'I am hungry and need cuddles! 🥺',
    bubbleClean: 'I smell like fresh clean flowers! 🌸',
    bubbleDefault: 'Hello! I am so happy to be with you 🐾',

    levelLabel: 'Level',
    xpLabel: 'Experience',
    coinsLabel: 'Coins',
    statLove: 'Love',
    statHunger: 'Hunger',
    statSleep: 'Sleep',
    statCleanliness: 'Cleanliness',
    statFun: 'Fun',
    statEnergy: 'Energy',
    statHappiness: 'Happiness',
    achievementsBtn: 'Achievements',

    feedBtn: 'Eat 🍖',
    kibble: 'Kibble 🥣',
    bone: 'Bone 🦴',
    steak: 'Steak 🥩',
    bathBtn: 'Bath 🧼',
    bathWater: '1. Wet 🚿',
    bathShampoo: '2. Shampoo 🧴',
    bathRinse: '3. Rinse 💧',
    bathDry: '4. Dry 💨',
    sleepBtn: 'Sleep 💤',
    wakeBtn: 'Wake Up ☀️',
    playBtn: 'Play ⚽',
    translateBtn: 'Translate Thoughts 🐾',
    translatingBtn: 'Listening to bark...',
    translatorTitle: 'Canine Translator 🐾',
    hintLabel: 'Tip:',
    diaryBtn: 'Secret Diary',

    morningNotice: '☀️ GOOD MORNING! I am wide awake and ready to play.',
    sleepNotice: '😴 Zzz... Dreaming of a garden full of soft plush toys... Zzz...',
    fetchThrowNotice: '🎾 YOU THREW THE BALL! Running as fast as my paws can go!',
    fetchReturnNotice: '🎾 Brought it back! Here it is, throw it again, throw it!',
    petNotice: '💖 YAAAY! I love belly rubs! Kicking my happy little paws.',
    bathWaterNotice: 'I love splashing warm water all over the bath! 🚿',
    bathShampooNotice: 'Vanilla shampoo smells so yummy I want to eat it! 🧴',
    bathRinseNotice: 'Shoo bubbles! You tickle my cute puppy nose! 💧',
    bathDryNotice: '💨 Warm breeze! Time for high-speed zoomies on the rug!',
    reminderNoticePrefix: '🐾 WOOF, WOOF! Reminder: today is',
    levelUpNotice: '🎉 WOOF! Level up to Level',

    tabAccessories: 'Accessories 🎩',
    tabDecoration: 'Decoration 🛏️',
    equipped: 'Equipped',
    equip: 'Equip',
    coins: 'Coins',
    backToGolden: 'Done, back to Golden',

    achievementsTitle: 'Achievements',
    achievementsCompletedOf: 'completed',
    claimed: 'Claimed',
    completed: 'Completed',
    progress: 'Progress',
    close: 'Close',

    diaryTitle: 'Secret Diary',
    diarySub: 'The sweetest adventures and memories of your Golden',
    diaryGenerating: 'Inspiring your Golden...',
    diaryWriteToday: "Write Today's Page ✨",
    diaryEmpty: 'The diary is currently empty',
    diaryEmptyPrompt: 'Tap the golden button above for your puppy to share their first story!',
    closeDiary: 'Close Diary',

    calendarPanelTitle: 'Canine Health Calendar',
    calendarPanelSub: 'Vet checkups, vaccinations and treatments',
    calendarAddBtn: 'New Reminder',
    calendarTypeVaccine: 'Vaccine 💉',
    calendarTypePill: 'Flea Pill 💊',
    calendarTitleInputPlaceholder: 'E.g. Rabies vaccine or NexGard chew',
    calendarDateLabel: 'Date',
    calendarTimeLabel: 'Time',
    calendarNotesLabel: 'Additional notes (optional)',
    calendarNotesPlaceholder: 'E.g. Bring pet passport...',
    calendarSaveBtn: 'Save Reminder',
    calendarCancelBtn: 'Cancel',
    calendarTestSoundBtn: 'Test Alert Bark',
    calendarTodayBadge: 'TODAY',
    calendarDoneBadge: 'Done',
    calendarPendingBadge: 'Pending',
    calendarNoEvents: 'No appointments scheduled for this day.',
    calendarEventsCount: 'scheduled appointments',

    minigamesParkTitle: 'Play Park',
    minigamesParkSub: 'Choose an activity to earn coins and experience together',
    chooseMinigame: 'Choose an activity to earn coins and experience together',
    ballGameTitle: 'Catch Balls',
    ballGameDesc: 'Slide your puppy to catch tennis balls and prizes.',
    digGameTitle: 'Dig for Treasures',
    digGameDesc: 'Find coins, bones or socks buried in the sand.',
    frisbeeGameTitle: 'Throw Frisbee',
    frisbeeGameDesc: 'Time the slider right in the middle for an acrobatic catch.',
    startBallGameBtn: 'Start Game (30s)!',
    ballGameInstruction: 'Move the slider to guide your puppy. Catch tennis balls (🎾 +3) and bones (🦴 +8)! Avoid mud.',
    ballScoreLabel: 'Score',
    ballTimeLabel: 'Time',
    dragToMovePup: 'Slide to move your Golden',
    digRemainingLabel: 'Digs left',
    digCoinsWonLabel: 'Won',
    digEmptyText: 'Empty',
    digNewHoleBtn: 'Dig in a new sandbox',
    frisbeeTitle: 'Throw the Frisbee',
    frisbeeDesc: 'A precision game. Throw the frisbee right when the needle hits the green center for a perfect catch.',
    startFrisbeeBtn: 'Start Throwing!',
    frisbeeTimingHint: 'Tap when the needle is in the center!',
    frisbeeResultLabel: 'Throw result:',
    frisbeeLaunchNow: '🚀 THROW NOW!',
    frisbeePerfectTitle: '🏆 Perfect Catch! 🥏',
    frisbeePerfectDesc: 'Your Golden leaped into the air and made a clean catch! (+50 coins, +30 XP)',
    frisbeeGoodTitle: '✨ Great Throw! ✨',
    frisbeeGoodDesc: 'Ran at full speed and caught the Frisbee! (+20 coins, +15 XP)',
    frisbeeMissTitle: '🐾 Almost!',
    frisbeeMissDesc: 'The Frisbee landed on the lawn, but your pup happily fetched it anyway. (+2 coins)',
    tryAgainBtn: 'Try Again',
    backToParkBtn: 'Back to Park',
  },
};
