import React from 'react';
import { BADGES, getLevel } from '../utils/constants.js';
import { storage } from '../utils/storage.js';

function XPRing({ xp, nextMin, currentMin }) {
  const size = 100;
  const r = 42;
  const circ = 2 * Math.PI * r;
  const pct = nextMin ? Math.min((xp - currentMin) / (nextMin - currentMin), 1) : 1;
  const dash = pct * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx="50" cy="50" r={r} fill="none" stroke="#1e1c30" strokeWidth="8"/>
      <circle cx="50" cy="50" r={r} fill="none" stroke="#7c6fcd" strokeWidth="8"
        strokeLinecap="round" strokeDasharray={`${dash} ${circ}`}
        transform="rotate(-90 50 50)"
        style={{transition:'stroke-dasharray 1s cubic-bezier(.34,1.56,.64,1)'}}/>
      <text x="50" y="54" textAnchor="middle" fontSize="13" fontWeight="700" fill="#c4b5fd" fontFamily="system-ui">{xp}</text>
    </svg>
  );
}

export function ProfileScreen({ xp, badges, habits }) {
  const { currentLevel, nextLevel } = getLevel(xp);
  const earnedBadgeIds = new Set(badges.map(b => b.id));

  return (
    <div className="screen profile-screen">
      <div className="screen-header">
        <h1 className="screen-title">Profile</h1>
      </div>

      <div className="profile-hero">
        <XPRing xp={xp} nextMin={nextLevel?.min} currentMin={currentLevel.min}/>
        <div className="profile-name">Habit Tracker</div>
        <div className="profile-level-badge">
          <span className="profile-level-icon">⭐</span>
          <span>{currentLevel.name} · Level {currentLevel.level}</span>
        </div>
      </div>

      <div className="xp-section">
        <div className="xp-header">
          <span className="xp-label">XP</span>
          <span className="xp-value">{xp} {nextLevel ? `/ ${nextLevel.min}` : '(MAX)'}</span>
        </div>
        <div className="xp-bar-track">
          <div className="xp-bar-fill" style={{width:`${nextLevel ? Math.min(((xp-currentLevel.min)/(nextLevel.min-currentLevel.min))*100,100) : 100}%`}}/>
        </div>
        {nextLevel && <div className="xp-next">{nextLevel.min - xp} XP to {nextLevel.name}</div>}
      </div>

      <div className="profile-stats">
        <div className="profile-stat">
          <span className="profile-stat-value">{habits.length}</span>
          <span className="profile-stat-label">Habits</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-value">{badges.length}</span>
          <span className="profile-stat-label">Badges</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-value">{xp}</span>
          <span className="profile-stat-label">XP</span>
        </div>
      </div>

      <div className="badges-section">
        <h2 className="stats-section-title">Achievements</h2>
        <div className="badges-grid">
          {BADGES.map(badge => {
            const earned = earnedBadgeIds.has(badge.id);
            return (
              <div key={badge.id} className={`badge-card ${earned ? 'earned' : 'locked'}`}>
                <div className="badge-icon">{earned ? badge.icon : '🔒'}</div>
                <div className="badge-name">{badge.name}</div>
                <div className="badge-desc">{badge.desc}</div>
                {earned && <div className="badge-earned-dot"/>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="danger-section">
        <button className="btn-danger" onClick={() => {
          if (window.confirm('Reset all data? This cannot be undone.')) {
            localStorage.clear(); window.location.reload();
          }
        }}>Reset All Data</button>
      </div>
    </div>
  );
}
