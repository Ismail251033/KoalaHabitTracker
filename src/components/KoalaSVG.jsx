import React from 'react';

// Koala mascot with multiple emotional states
export function KoalaSVG({ mood = 'neutral', size = 120, animate = true }) {
  const moods = {
    sad: {
      eyeShape: 'M-6,-2 Q0,-6 6,-2', // downward curve
      mouthPath: 'M-10,5 Q0,0 10,5', // frown
      eyeL: '😔',
      sparkles: false,
      blush: false,
    },
    neutral: {
      mouthPath: 'M-8,5 Q0,7 8,5',
      sparkles: false,
      blush: false,
    },
    happy: {
      mouthPath: 'M-10,3 Q0,12 10,3',
      sparkles: false,
      blush: true,
    },
    ecstatic: {
      mouthPath: 'M-12,2 Q0,16 12,2',
      sparkles: true,
      blush: true,
    },
  };

  const currentMood = moods[mood] || moods.neutral;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`koala-svg ${animate ? 'koala-animate' : ''} koala-mood-${mood}`}
    >
      <defs>
        <radialGradient id="koalaGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7c6fcd" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bodyGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#3d3a5c" />
          <stop offset="100%" stopColor="#1e1b2e" />
        </radialGradient>
        <radialGradient id="earGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4a4570" />
          <stop offset="100%" stopColor="#2a2642" />
        </radialGradient>
        <radialGradient id="innerEarGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#a78bfa" />
        </radialGradient>
        <radialGradient id="noseGrad" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#4a4570" />
          <stop offset="100%" stopColor="#1e1b2e" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Glow background */}
      {(mood === 'happy' || mood === 'ecstatic') && (
        <circle cx="60" cy="60" r="55" fill="url(#koalaGlow)" />
      )}

      {/* Left Ear */}
      <ellipse cx="26" cy="28" rx="16" ry="16" fill="url(#earGrad)" />
      <ellipse cx="26" cy="28" rx="9" ry="9" fill="url(#innerEarGrad)" opacity="0.8" />

      {/* Right Ear */}
      <ellipse cx="94" cy="28" rx="16" ry="16" fill="url(#earGrad)" />
      <ellipse cx="94" cy="28" rx="9" ry="9" fill="url(#innerEarGrad)" opacity="0.8" />

      {/* Body */}
      <ellipse cx="60" cy="62" rx="38" ry="42" fill="url(#bodyGrad)" />

      {/* Head */}
      <circle cx="60" cy="55" r="34" fill="url(#bodyGrad)" />

      {/* Forehead highlight */}
      <ellipse cx="52" cy="35" rx="12" ry="7" fill="#4a4570" opacity="0.5" />

      {/* Eyes - Left */}
      <g transform="translate(44, 52)">
        <circle cx="0" cy="0" r="8" fill="#0a0a0f" />
        <circle cx="0" cy="0" r="6" fill="#1a1830" />
        {/* Iris */}
        <circle cx="0" cy="0" r="4" fill="#7c6fcd" opacity="0.9" />
        {/* Pupil */}
        <circle cx="0" cy="0" r="2.5" fill="#0a0a0f" />
        {/* Shine */}
        <circle cx="1.5" cy="-1.5" r="1.2" fill="white" opacity="0.9" />
        <circle cx="-1" cy="1" r="0.6" fill="white" opacity="0.5" />
        {/* Happy squint */}
        {(mood === 'happy' || mood === 'ecstatic') && (
          <path d="M-7,-5 Q0,-9 7,-5" stroke="#2a2642" strokeWidth="3" fill="none" strokeLinecap="round" />
        )}
        {/* Sad droop */}
        {mood === 'sad' && (
          <path d="M-7,-7 Q0,-3 7,-7" stroke="#2a2642" strokeWidth="3" fill="none" strokeLinecap="round" />
        )}
      </g>

      {/* Eyes - Right */}
      <g transform="translate(76, 52)">
        <circle cx="0" cy="0" r="8" fill="#0a0a0f" />
        <circle cx="0" cy="0" r="6" fill="#1a1830" />
        <circle cx="0" cy="0" r="4" fill="#7c6fcd" opacity="0.9" />
        <circle cx="0" cy="0" r="2.5" fill="#0a0a0f" />
        <circle cx="1.5" cy="-1.5" r="1.2" fill="white" opacity="0.9" />
        <circle cx="-1" cy="1" r="0.6" fill="white" opacity="0.5" />
        {(mood === 'happy' || mood === 'ecstatic') && (
          <path d="M-7,-5 Q0,-9 7,-5" stroke="#2a2642" strokeWidth="3" fill="none" strokeLinecap="round" />
        )}
        {mood === 'sad' && (
          <path d="M-7,-7 Q0,-3 7,-7" stroke="#2a2642" strokeWidth="3" fill="none" strokeLinecap="round" />
        )}
      </g>

      {/* Nose */}
      <ellipse cx="60" cy="64" rx="10" ry="7" fill="url(#noseGrad)" />
      <ellipse cx="60" cy="63" rx="7" ry="5" fill="#0f0e1a" />
      {/* Nose shine */}
      <ellipse cx="57" cy="61" rx="2" ry="1.5" fill="#4a4570" opacity="0.6" />

      {/* Mouth */}
      <path
        d={currentMood.mouthPath || 'M-8,5 Q0,7 8,5'}
        transform="translate(60, 68)"
        stroke="#4a4570"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Blush */}
      {currentMood.blush && (
        <>
          <ellipse cx="36" cy="64" rx="8" ry="5" fill="#f472b6" opacity="0.3" />
          <ellipse cx="84" cy="64" rx="8" ry="5" fill="#f472b6" opacity="0.3" />
        </>
      )}

      {/* Sparkles for ecstatic */}
      {mood === 'ecstatic' && (
        <g className="koala-sparkles">
          <g transform="translate(15, 20)" className="sparkle-1">
            <path d="M0,-8 L2,-2 L8,0 L2,2 L0,8 L-2,2 L-8,0 L-2,-2 Z" fill="#a78bfa" opacity="0.9" />
          </g>
          <g transform="translate(105, 15)" className="sparkle-2">
            <path d="M0,-6 L1.5,-1.5 L6,0 L1.5,1.5 L0,6 L-1.5,1.5 L-6,0 L-1.5,-1.5 Z" fill="#c4b5fd" opacity="0.8" />
          </g>
          <g transform="translate(10, 80)" className="sparkle-3">
            <path d="M0,-5 L1.2,-1.2 L5,0 L1.2,1.2 L0,5 L-1.2,1.2 L-5,0 L-1.2,-1.2 Z" fill="#7c6fcd" opacity="0.7" />
          </g>
          <g transform="translate(108, 70)" className="sparkle-4">
            <path d="M0,-7 L1.8,-1.8 L7,0 L1.8,1.8 L0,7 L-1.8,1.8 L-7,0 L-1.8,-1.8 Z" fill="#a78bfa" opacity="0.85" />
          </g>
          {/* Stars */}
          <text x="18" y="12" fontSize="12" className="star-float-1">⭐</text>
          <text x="92" y="10" fontSize="10" className="star-float-2">✨</text>
          <text x="5" y="95" fontSize="10" className="star-float-3">💜</text>
          <text x="98" y="95" fontSize="12" className="star-float-4">⭐</text>
        </g>
      )}

      {/* Sad tears */}
      {mood === 'sad' && (
        <>
          <ellipse cx="42" cy="62" rx="2" ry="3" fill="#7c6fcd" opacity="0.6" className="koala-tear-l" />
          <ellipse cx="78" cy="62" rx="2" ry="3" fill="#7c6fcd" opacity="0.6" className="koala-tear-r" />
        </>
      )}

      {/* Body belly patch */}
      <ellipse cx="60" cy="85" rx="18" ry="20" fill="#2a2642" opacity="0.6" />

      {/* Arms */}
      <ellipse cx="26" cy="80" rx="8" ry="14" fill="#2a2642" transform="rotate(-20, 26, 80)" />
      <ellipse cx="94" cy="80" rx="8" ry="14" fill="#2a2642" transform="rotate(20, 94, 80)" />

      {/* Excited arms up */}
      {mood === 'ecstatic' && (
        <>
          <ellipse cx="22" cy="65" rx="8" ry="14" fill="#3d3a5c" transform="rotate(-45, 22, 65)" />
          <ellipse cx="98" cy="65" rx="8" ry="14" fill="#3d3a5c" transform="rotate(45, 98, 65)" />
        </>
      )}
    </svg>
  );
}

// Small inline koala avatar
export function KoalaAvatar({ mood = 'neutral', size = 40 }) {
  return (
    <div style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <KoalaSVG mood={mood} size={size} animate={false} />
    </div>
  );
}
