import React, { useState, useEffect } from 'react';
import { useHabits } from './hooks/useHabits.js';
import { storage } from './utils/storage.js';
import { HomeScreen } from './components/HomeScreen.jsx';
import { HabitsScreen } from './components/HabitsScreen.jsx';
import { StatsScreen } from './components/StatsScreen.jsx';
import { ProfileScreen } from './components/ProfileScreen.jsx';
import { OnboardingScreen } from './components/OnboardingScreen.jsx';
import { BottomNav } from './components/BottomNav.jsx';
import { InstallBanner } from './components/InstallBanner.jsx';
import { BadgeToast } from './components/BadgeToast.jsx';

function SplashScreen({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1800); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="splash-ring">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="40" stroke="#1e1c30" strokeWidth="10"/>
            <circle cx="50" cy="50" r="40" stroke="#7c6fcd" strokeWidth="10"
              strokeLinecap="round" strokeDasharray="60 251"
              transform="rotate(-90 50 50)"
              className="splash-arc"/>
          </svg>
        </div>
        <h1 className="splash-title">Habits</h1>
        <p className="splash-sub">Build. Track. Thrive.</p>
        <div className="splash-loader"><div className="splash-loader-bar"/></div>
      </div>
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [tabTransition, setTabTransition] = useState('');

  const {
    habits, completions, todayCompletions, completedToday, totalHabits,
    globalStreak, xp, badges, newBadge, today,
    addHabit, removeHabit, toggleHabit,
    getHabitStreak, getCompletionRate, getBestDay,
  } = useHabits();

  const handleSplashDone = () => {
    setShowSplash(false);
    if (!storage.isOnboarded()) setShowOnboarding(true);
  };

  const handleOnboardingComplete = () => {
    storage.setOnboarded();
    setShowOnboarding(false);
  };

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setTabTransition('out');
    setTimeout(() => { setActiveTab(tab); setTabTransition('in'); setTimeout(() => setTabTransition(''), 200); }, 150);
  };

  if (showSplash) return <SplashScreen onDone={handleSplashDone}/>;
  if (showOnboarding) return <OnboardingScreen onComplete={handleOnboardingComplete}/>;

  return (
    <div className="app">
      <InstallBanner/>
      <BadgeToast badge={newBadge}/>
      <main className={`main-content tab-transition-${tabTransition}`}>
        {activeTab === 'home' && (
          <HomeScreen habits={habits} completions={completions} todayCompletions={todayCompletions}
            completedToday={completedToday} totalHabits={totalHabits} globalStreak={globalStreak}
            today={today} onToggle={toggleHabit} getHabitStreak={getHabitStreak}/>
        )}
        {activeTab === 'habits' && (
          <HabitsScreen habits={habits} onAdd={addHabit} onRemove={removeHabit} getCompletionRate={getCompletionRate}/>
        )}
        {activeTab === 'stats' && (
          <StatsScreen habits={habits} completions={completions} getCompletionRate={getCompletionRate}
            getBestDay={getBestDay} globalStreak={globalStreak}/>
        )}
        {activeTab === 'profile' && (
          <ProfileScreen xp={xp} badges={badges} habits={habits}/>
        )}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange}/>
    </div>
  );
}
