import React, { useState, useEffect } from 'react';
import { ProgressRing } from './ProgressRing.jsx';
import { Confetti } from './Confetti.jsx';
import { dateUtils } from '../utils/storage.js';
import { QUOTES } from '../utils/constants.js';

function WeekCalendar({ completions, habits, today }) {
  const weekDays = dateUtils.getWeekDays();
  return (
    <div className="week-calendar">
      {weekDays.map(day => {
        const dayCompletions = completions[day.dateStr] || {};
        const doneCount = Object.values(dayCompletions).filter(Boolean).length;
        const allDone = habits.length > 0 && doneCount === habits.length;
        const someDone = doneCount > 0 && !allDone;
        return (
          <div
            key={day.dateStr}
            className={`week-day ${day.isToday ? 'today' : ''} ${allDone ? 'all-done' : ''} ${someDone ? 'some-done' : ''} ${!day.isPast && !day.isToday ? 'future' : ''}`}
          >
            <span className="week-day-label">{day.label}</span>
            <div className="week-day-circle">
              {allDone ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : someDone ? <div className="week-day-dot"/> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HabitCard({ habit, isDone, onToggle, streak }) {
  const [justCompleted, setJustCompleted] = useState(false);
  const handleToggle = () => {
    if (!isDone) { setJustCompleted(true); setTimeout(() => setJustCompleted(false), 600); }
    onToggle(habit.id);
  };
  return (
    <div className={`habit-card ${isDone ? 'habit-done' : ''} ${justCompleted ? 'habit-just-done' : ''}`} style={{'--habit-color': habit.color}}>
      <button className={`habit-checkbox ${isDone ? 'checked' : ''}`} onClick={handleToggle} aria-label={isDone ? `Unmark ${habit.title}` : `Complete ${habit.title}`}>
        {isDone && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8L6.5 11.5L13 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
      <div className="habit-info">
        <div className="habit-title-row">
          <span className="habit-icon">{habit.icon}</span>
          <span className={`habit-title ${isDone ? 'done-text' : ''}`}>{habit.title}</span>
        </div>
        <div className="habit-progress-dots">
          {Array.from({length: 8}, (_, i) => (
            <div key={i} className={`progress-dot ${i < Math.round(streak * 0.6) ? 'filled' : ''}`}/>
          ))}
        </div>
      </div>
      <div className="habit-streak-badge"><span>{streak}d</span></div>
    </div>
  );
}

export function HomeScreen({ habits, completions, todayCompletions, completedToday, totalHabits, globalStreak, today, onToggle, getHabitStreak }) {
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [prevCompleted, setPrevCompleted] = useState(completedToday);

  const progress = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  const allDone = totalHabits > 0 && completedToday === totalHabits;

  useEffect(() => {
    if (allDone && prevCompleted < totalHabits && totalHabits > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
    setPrevCompleted(completedToday);
  }, [completedToday, allDone, totalHabits]);

  const now = new Date();
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const dateLabel = `${days[now.getDay()].slice(0,3).toUpperCase()}, ${months[now.getMonth()].toUpperCase()} ${now.getDate()}`;

  const thisMonthPrefix = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  const monthDays = Object.keys(completions).filter(d => d.startsWith(thisMonthPrefix));
  let bestMonth = 0;
  monthDays.forEach(d => {
    const count = Object.values(completions[d] || {}).filter(Boolean).length;
    if (count > bestMonth) bestMonth = count;
  });

  return (
    <div className="screen home-screen">
      <Confetti active={showConfetti}/>

      <div className="home-header">
        <div>
          <div className="home-date">{dateLabel}</div>
          <h1 className="home-title">Today</h1>
        </div>
        <div className="avatar-circle"><span>KH</span></div>
      </div>

      {/* Stats row */}
      <div className="stats-row">
        <div className="stat-hero">
          <div className="stat-number">{globalStreak}</div>
          <div className="stat-label">day streak</div>
        </div>
        <div className="stat-right">
          <div className="stat-detail">
            <div className="stat-dot"/>
            <span className="stat-done-text">{completedToday} of {totalHabits} done</span>
          </div>
          <div className="stat-detail-sub">Best this month {bestMonth}d</div>
        </div>
      </div>

      {/* Progress ring */}
      <div className="ring-section">
        <ProgressRing
          progress={progress}
          completed={completedToday}
          total={totalHabits}
          streak={globalStreak}
        />
        {!allDone && totalHabits > 0 && (
          <p className="ring-quote">"{quote.text.length > 70 ? quote.text.slice(0,67)+'…' : quote.text}"</p>
        )}
        {totalHabits === 0 && (
          <p className="ring-quote">Add your first habit below</p>
        )}
      </div>

      {/* Week calendar */}
      <WeekCalendar completions={completions} habits={habits} today={today}/>

      {/* Habits list */}
      <div className="habits-section">
        <div className="section-header">
          <h2 className="section-title">Habits</h2>
          <span className="section-count">{totalHabits}</span>
        </div>
        {habits.length === 0 ? (
          <div className="empty-state"><p>No habits yet. Add one in the Habits tab!</p></div>
        ) : (
          <div className="habits-list">
            {habits.map(habit => {
              const { streak } = getHabitStreak(habit.id);
              return (
                <HabitCard key={habit.id} habit={habit} isDone={!!todayCompletions[habit.id]} onToggle={onToggle} streak={streak}/>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
