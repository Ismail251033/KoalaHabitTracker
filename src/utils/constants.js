export const QUOTES = [
  { text: "Small steps every day lead to giant leaps over time.", author: "Anonymous" },
  { text: "You don't rise to the level of your goals, you fall to the level of your systems.", author: "James Clear" },
  { text: "Motivation gets you started. Habit keeps you going.", author: "Jim Ryun" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "Your habits will determine your future.", author: "Jack Canfield" },
  { text: "First forget inspiration. Habit is more dependable.", author: "Octavia Butler" },
  { text: "Good habits formed at youth make all the difference.", author: "Aristotle" },
  { text: "The chains of habit are too weak to be felt until they are too strong to be broken.", author: "Samuel Johnson" },
];

export const BADGES = [
  { id: 'first_habit', icon: '🌱', name: 'Seedling', desc: 'Created your first habit' },
  { id: 'first_complete', icon: '✅', name: 'First Step', desc: 'Completed a habit for the first time' },
  { id: 'streak_3', icon: '🔥', name: 'On Fire', desc: '3-day streak' },
  { id: 'streak_7', icon: '⚡', name: 'Week Warrior', desc: '7-day streak' },
  { id: 'streak_30', icon: '💎', name: 'Diamond', desc: '30-day streak' },
  { id: 'perfect_day', icon: '⭐', name: 'Perfect Day', desc: 'Completed all habits in a day' },
  { id: 'habit_5', icon: '🎯', name: 'Goal Setter', desc: 'Created 5 habits' },
  { id: 'xp_100', icon: '🏆', name: 'Century', desc: 'Earned 100 XP' },
  { id: 'xp_500', icon: '👑', name: 'Legend', desc: 'Earned 500 XP' },
];

export const HABIT_ICONS = ['💪', '📚', '🧘', '🏃', '💧', '🥗', '😴', '✍️', '🎵', '🌿', '🧠', '❤️', '🌅', '🚴', '🎯', '🙏', '💊', '🧹', '📱', '☕'];

export const HABIT_COLORS = [
  '#7c6fcd', // purple
  '#4f8ef7', // blue
  '#34d399', // green
  '#f472b6', // pink
  '#fb923c', // orange
  '#a78bfa', // lavender
  '#2dd4bf', // teal
  '#f87171', // red
  '#fbbf24', // yellow
  '#94a3b8', // slate
];

export const XP_REWARDS = {
  COMPLETE_HABIT: 10,
  PERFECT_DAY: 50,
  STREAK_MILESTONE: 25,
};

export const getLevel = (xp) => {
  const levels = [
    { level: 1, min: 0, name: 'Seedling' },
    { level: 2, min: 100, name: 'Sprout' },
    { level: 3, min: 250, name: 'Sapling' },
    { level: 4, min: 500, name: 'Tree' },
    { level: 5, min: 1000, name: 'Forest' },
    { level: 6, min: 2000, name: 'Ancient' },
    { level: 7, min: 5000, name: 'Legend' },
  ];
  
  let currentLevel = levels[0];
  let nextLevel = levels[1];
  
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].min) {
      currentLevel = levels[i];
      nextLevel = levels[i + 1] || null;
      break;
    }
  }
  
  return { currentLevel, nextLevel };
};
