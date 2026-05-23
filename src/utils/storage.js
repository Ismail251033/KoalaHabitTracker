// Local Storage utility functions

const KEYS = {
  HABITS: 'koala_habits',
  COMPLETIONS: 'koala_completions',
  PROFILE: 'koala_profile',
  ONBOARDED: 'koala_onboarded',
  XP: 'koala_xp',
  BADGES: 'koala_badges',
};

export const storage = {
  // Habits
  getHabits: () => {
    try {
      return JSON.parse(localStorage.getItem(KEYS.HABITS)) || [];
    } catch { return []; }
  },
  saveHabits: (habits) => {
    localStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
  },

  // Completions: { 'YYYY-MM-DD': { habitId: true } }
  getCompletions: () => {
    try {
      return JSON.parse(localStorage.getItem(KEYS.COMPLETIONS)) || {};
    } catch { return {}; }
  },
  saveCompletions: (completions) => {
    localStorage.setItem(KEYS.COMPLETIONS, JSON.stringify(completions));
  },

  // Profile
  getProfile: () => {
    try {
      return JSON.parse(localStorage.getItem(KEYS.PROFILE)) || { name: 'User', initials: 'U' };
    } catch { return { name: 'User', initials: 'U' }; }
  },
  saveProfile: (profile) => {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  },

  // Onboarding
  isOnboarded: () => localStorage.getItem(KEYS.ONBOARDED) === 'true',
  setOnboarded: () => localStorage.setItem(KEYS.ONBOARDED, 'true'),

  // XP
  getXP: () => parseInt(localStorage.getItem(KEYS.XP) || '0'),
  addXP: (amount) => {
    const current = parseInt(localStorage.getItem(KEYS.XP) || '0');
    localStorage.setItem(KEYS.XP, current + amount);
    return current + amount;
  },

  // Badges
  getBadges: () => {
    try {
      return JSON.parse(localStorage.getItem(KEYS.BADGES)) || [];
    } catch { return []; }
  },
  addBadge: (badge) => {
    const badges = storage.getBadges();
    if (!badges.find(b => b.id === badge.id)) {
      badges.push({ ...badge, earnedAt: new Date().toISOString() });
      localStorage.setItem(KEYS.BADGES, JSON.stringify(badges));
      return true;
    }
    return false;
  },
};

export const dateUtils = {
  today: () => new Date().toISOString().split('T')[0],
  
  formatDate: (date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  },

  getDayOfWeek: (dateStr) => {
    const d = new Date(dateStr + 'T12:00:00');
    return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()];
  },

  getWeekDays: () => {
    const days = [];
    const today = new Date();
    // Get Monday of current week
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push({
        dateStr: d.toISOString().split('T')[0],
        label: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i],
        isToday: d.toISOString().split('T')[0] === new Date().toISOString().split('T')[0],
        isPast: d < new Date(new Date().setHours(0, 0, 0, 0)),
      });
    }
    return days;
  },

  getLast90Days: () => {
    const days = [];
    for (let i = 89; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  },
};

export const streakUtils = {
  calculateStreak: (habitId, completions) => {
    let streak = 0;
    let longest = 0;
    let current = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const done = completions[dateStr]?.[habitId];

      if (done) {
        current++;
        if (i === 0 || streak > 0) streak = current;
        longest = Math.max(longest, current);
      } else {
        if (i === 0) {
          // Not done today — check yesterday
        } else {
          if (streak === current && i <= 1) streak = current;
          current = 0;
          if (i <= 1) streak = 0;
        }
      }
    }
    return { streak, longest };
  },

  // Global streak: consecutive days with at least 1 habit done
  calculateGlobalStreak: (completions) => {
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayCompletions = completions[dateStr] || {};
      const hasDone = Object.values(dayCompletions).some(Boolean);

      if (hasDone) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  },
};
