import { useState, useCallback, useEffect } from 'react';
import { storage, dateUtils, streakUtils } from '../utils/storage.js';
import { BADGES, XP_REWARDS } from '../utils/constants.js';

export function useHabits() {
  const [habits, setHabits] = useState(() => storage.getHabits());
  const [completions, setCompletions] = useState(() => storage.getCompletions());
  const [xp, setXp] = useState(() => storage.getXP());
  const [badges, setBadges] = useState(() => storage.getBadges());
  const [newBadge, setNewBadge] = useState(null);

  const today = dateUtils.today();

  // Persist habits
  useEffect(() => {
    storage.saveHabits(habits);
  }, [habits]);

  // Persist completions
  useEffect(() => {
    storage.saveCompletions(completions);
  }, [completions]);

  const todayCompletions = completions[today] || {};
  const completedToday = habits.filter(h => todayCompletions[h.id]).length;
  const totalHabits = habits.length;

  const earnBadge = useCallback((badgeId) => {
    const badge = BADGES.find(b => b.id === badgeId);
    if (!badge) return;
    const earned = storage.addBadge(badge);
    if (earned) {
      setBadges(storage.getBadges());
      setNewBadge(badge);
      setTimeout(() => setNewBadge(null), 3000);
    }
  }, []);

  const addHabit = useCallback((habitData) => {
    const habit = {
      id: Date.now().toString(),
      title: habitData.title,
      icon: habitData.icon || '💪',
      color: habitData.color || '#7c6fcd',
      createdAt: new Date().toISOString(),
      frequency: 'daily',
    };
    setHabits(prev => {
      const next = [...prev, habit];
      if (next.length === 1) earnBadge('first_habit');
      if (next.length === 5) earnBadge('habit_5');
      return next;
    });
    return habit;
  }, [earnBadge]);

  const removeHabit = useCallback((habitId) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
  }, []);

  const toggleHabit = useCallback((habitId) => {
    const wasComplete = completions[today]?.[habitId];
    
    setCompletions(prev => {
      const dayData = { ...(prev[today] || {}) };
      if (dayData[habitId]) {
        delete dayData[habitId];
      } else {
        dayData[habitId] = true;
      }
      const next = { ...prev, [today]: dayData };
      
      if (!wasComplete) {
        // Completing
        if (navigator.vibrate) navigator.vibrate([120, 60, 120]);
        
        // XP reward
        const newXP = storage.addXP(XP_REWARDS.COMPLETE_HABIT);
        setXp(newXP);
        
        // Check badges
        earnBadge('first_complete');
        if (newXP >= 100) earnBadge('xp_100');
        if (newXP >= 500) earnBadge('xp_500');
        
        // Check perfect day
        const allDone = habits.every(h => h.id === habitId || dayData[h.id]);
        if (allDone && habits.length > 0) {
          storage.addXP(XP_REWARDS.PERFECT_DAY);
          setXp(prev => prev + XP_REWARDS.PERFECT_DAY);
          earnBadge('perfect_day');
        }
      }
      
      return next;
    });
  }, [completions, today, habits, earnBadge]);

  const getHabitStreak = useCallback((habitId) => {
    return streakUtils.calculateStreak(habitId, completions);
  }, [completions]);

  const globalStreak = streakUtils.calculateGlobalStreak(completions);

  // Check streak badges
  useEffect(() => {
    if (globalStreak >= 3) earnBadge('streak_3');
    if (globalStreak >= 7) earnBadge('streak_7');
    if (globalStreak >= 30) earnBadge('streak_30');
  }, [globalStreak, earnBadge]);

  const getCompletionRate = useCallback((habitId, days = 30) => {
    let done = 0;
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      if (completions[dateStr]?.[habitId]) done++;
    }
    return Math.round((done / days) * 100);
  }, [completions]);

  const getBestDay = useCallback(() => {
    let best = { date: null, count: 0 };
    Object.entries(completions).forEach(([date, dayData]) => {
      const count = Object.values(dayData).filter(Boolean).length;
      if (count > best.count) best = { date, count };
    });
    return best;
  }, [completions]);

  return {
    habits,
    completions,
    todayCompletions,
    completedToday,
    totalHabits,
    globalStreak,
    xp,
    badges,
    newBadge,
    today,
    addHabit,
    removeHabit,
    toggleHabit,
    getHabitStreak,
    getCompletionRate,
    getBestDay,
  };
}
