import React, { useMemo } from 'react';
import { dateUtils } from '../utils/storage.js';

function HeatmapCell({ date, completions, habits }) {
  const dayCompletions = completions[date] || {};
  const doneCount = Object.values(dayCompletions).filter(Boolean).length;
  const total = habits.length;
  const ratio = total > 0 ? doneCount / total : 0;

  const intensity = ratio === 0 ? 0 : ratio < 0.4 ? 1 : ratio < 0.7 ? 2 : ratio < 1 ? 3 : 4;

  return (
    <div
      className={`heatmap-cell intensity-${intensity}`}
      title={`${date}: ${doneCount}/${total} habits`}
    />
  );
}

function Heatmap({ completions, habits }) {
  const days = dateUtils.getLast90Days();
  
  // Group into weeks
  const weeks = [];
  let week = [];
  days.forEach((day, i) => {
    week.push(day);
    if (week.length === 7 || i === days.length - 1) {
      weeks.push(week);
      week = [];
    }
  });

  return (
    <div className="heatmap">
      <div className="heatmap-grid">
        {weeks.map((week, wi) => (
          <div key={wi} className="heatmap-week">
            {week.map(day => (
              <HeatmapCell key={day} date={day} completions={completions} habits={habits} />
            ))}
          </div>
        ))}
      </div>
      <div className="heatmap-legend">
        <span>Less</span>
        <div className="intensity-0 heatmap-legend-cell" />
        <div className="intensity-1 heatmap-legend-cell" />
        <div className="intensity-2 heatmap-legend-cell" />
        <div className="intensity-3 heatmap-legend-cell" />
        <div className="intensity-4 heatmap-legend-cell" />
        <span>More</span>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
      {sub && <div className="stat-card-sub">{sub}</div>}
    </div>
  );
}

function HabitBar({ habit, completionRate }) {
  return (
    <div className="habit-bar-row">
      <div className="habit-bar-info">
        <span className="habit-bar-icon">{habit.icon}</span>
        <span className="habit-bar-title">{habit.title}</span>
      </div>
      <div className="habit-bar-track">
        <div
          className="habit-bar-fill"
          style={{ width: `${completionRate}%`, backgroundColor: habit.color }}
        />
      </div>
      <span className="habit-bar-pct">{completionRate}%</span>
    </div>
  );
}

export function StatsScreen({ habits, completions, getCompletionRate, getBestDay, globalStreak }) {
  const totalCompletions = useMemo(() => {
    return Object.values(completions).reduce((sum, day) => {
      return sum + Object.values(day).filter(Boolean).length;
    }, 0);
  }, [completions]);

  const totalDaysTracked = useMemo(() => {
    return new Set(
      Object.entries(completions)
        .filter(([_, day]) => Object.values(day).some(Boolean))
        .map(([date]) => date)
    ).size;
  }, [completions]);

  const bestDay = getBestDay();

  const avgPerDay = totalDaysTracked > 0
    ? (totalCompletions / totalDaysTracked).toFixed(1)
    : '0';

  const habitRates = habits.map(h => ({
    ...h,
    rate: getCompletionRate(h.id, 30),
  })).sort((a, b) => b.rate - a.rate);

  return (
    <div className="screen stats-screen">
      <div className="screen-header">
        <h1 className="screen-title">Stats</h1>
      </div>

      <div className="stats-grid">
        <StatCard icon="🔥" label="Current Streak" value={`${globalStreak}d`} sub="consecutive days" />
        <StatCard icon="✅" label="Total Done" value={totalCompletions} sub="all time" />
        <StatCard icon="📅" label="Days Active" value={totalDaysTracked} sub="days tracked" />
        <StatCard icon="⚡" label="Avg / Day" value={avgPerDay} sub="habits per day" />
      </div>

      <div className="stats-section">
        <h2 className="stats-section-title">Activity — Last 90 Days</h2>
        <Heatmap completions={completions} habits={habits} />
      </div>

      {habits.length > 0 && (
        <div className="stats-section">
          <h2 className="stats-section-title">Completion Rate — 30 Days</h2>
          <div className="habit-bars">
            {habitRates.map(h => (
              <HabitBar key={h.id} habit={h} completionRate={h.rate} />
            ))}
          </div>
        </div>
      )}

      {habits.length === 0 && (
        <div className="empty-state">
          <p>Add habits to see your statistics here.</p>
        </div>
      )}
    </div>
  );
}
