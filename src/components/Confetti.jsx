import React, { useEffect, useState } from 'react';

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

const COLORS = ['#7c6fcd', '#a78bfa', '#c4b5fd', '#4f8ef7', '#34d399', '#f472b6', '#fbbf24'];

export function Confetti({ active }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const newParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: randomBetween(0, 100),
      delay: randomBetween(0, 0.8),
      duration: randomBetween(2, 3.5),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: randomBetween(6, 12),
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
      rotation: randomBetween(0, 360),
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => setParticles([]), 4000);
    return () => clearTimeout(timer);
  }, [active]);

  if (!particles.length) return null;

  return (
    <div className="confetti-container" aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: `${p.x}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            backgroundColor: p.color,
            width: p.shape === 'circle' ? p.size : p.size * 0.6,
            height: p.shape === 'circle' ? p.size : p.size * 1.4,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
