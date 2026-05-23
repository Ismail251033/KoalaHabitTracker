import React, { useState } from 'react';

const STEPS = [
  {
    visual: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="50" stroke="#1e1c30" strokeWidth="10"/>
        <circle cx="60" cy="60" r="50" stroke="#7c6fcd" strokeWidth="10" strokeLinecap="round"
          strokeDasharray="80 235" strokeDashoffset="0" transform="rotate(-90 60 60)"/>
        <text x="60" y="66" textAnchor="middle" fontSize="22" fontWeight="700" fill="#e8e4ff" fontFamily="system-ui">✦</text>
      </svg>
    ),
    emoji: '👋',
    title: 'Build better habits',
    desc: 'Track your daily habits, build streaks, and watch your progress grow every single day.',
  },
  {
    visual: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="50" stroke="#1e1c30" strokeWidth="10"/>
        <circle cx="60" cy="60" r="50" stroke="#7c6fcd" strokeWidth="10" strokeLinecap="round"
          strokeDasharray="188 235" strokeDashoffset="0" transform="rotate(-90 60 60)"/>
        <text x="60" y="68" textAnchor="middle" fontSize="26" fontWeight="800" fill="#c4b5fd" fontFamily="system-ui">80%</text>
      </svg>
    ),
    emoji: '🎯',
    title: 'Watch your streaks',
    desc: 'Complete habits daily to build your streak. The progress ring fills as you go.',
  },
  {
    visual: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="50" stroke="#7c6fcd" strokeWidth="10" strokeLinecap="round"
          strokeDasharray="314 314" transform="rotate(-90 60 60)"
          style={{filter:'drop-shadow(0 0 8px rgba(167,139,250,0.5))'}}/>
        <text x="60" y="68" textAnchor="middle" fontSize="22" fontWeight="800" fill="#c4b5fd" fontFamily="system-ui">100%</text>
      </svg>
    ),
    emoji: '🏆',
    title: 'Earn rewards',
    desc: 'Collect badges, level up with XP, and celebrate every perfect day.',
  },
];

export function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const next = () => {
    if (transitioning) return;
    if (isLast) { onComplete(); return; }
    setTransitioning(true);
    setTimeout(() => { setStep(s => s + 1); setTransitioning(false); }, 200);
  };

  return (
    <div className="onboarding-screen">
      <div className={`onboarding-content ${transitioning ? 'fade-out' : 'fade-in'}`}>
        <div className="onboarding-ring">{current.visual}</div>
        <div className="onboarding-text">
          <div className="onboarding-emoji">{current.emoji}</div>
          <h1 className="onboarding-title">{current.title}</h1>
          <p className="onboarding-desc">{current.desc}</p>
        </div>
        <div className="onboarding-dots">
          {STEPS.map((_, i) => <div key={i} className={`onboarding-dot ${i === step ? 'active' : ''}`}/>)}
        </div>
        <button className="btn-primary btn-large" onClick={next}>
          {isLast ? "Get started" : 'Next'}
        </button>
        {!isLast && <button className="btn-skip" onClick={onComplete}>Skip</button>}
      </div>
    </div>
  );
}
