import React from 'react';

export function ProgressRing({ progress = 0, completed = 0, total = 0, streak = 0 }) {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;

  // Outer ring — daily progress
  const outerR = 82;
  const outerCirc = 2 * Math.PI * outerR;
  const outerDash = (progress / 100) * outerCirc;

  // Middle ring — streak (capped at 30d visual)
  const midR = 62;
  const midCirc = 2 * Math.PI * midR;
  const streakPct = Math.min(streak / 30, 1);
  const midDash = streakPct * midCirc;

  // Inner ring — weekly consistency (placeholder 0–1)
  const innerR = 42;
  const innerCirc = 2 * Math.PI * innerR;

  const allDone = total > 0 && completed === total;

  return (
    <div className="progress-ring-wrap">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={`progress-ring-svg ${allDone ? 'ring-all-done' : ''}`}
      >
        {/* Track rings */}
        <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="#1e1c30" strokeWidth="10"/>
        <circle cx={cx} cy={cy} r={midR}   fill="none" stroke="#1a182a" strokeWidth="8"/>
        <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="#161424" strokeWidth="6"/>

        {/* Outer ring — daily progress — purple */}
        <circle
          cx={cx} cy={cy} r={outerR}
          fill="none"
          stroke={allDone ? '#a78bfa' : '#7c6fcd'}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${outerDash} ${outerCirc}`}
          strokeDashoffset={0}
          transform={`rotate(-90 ${cx} ${cy})`}
          className="ring-outer"
          style={{ filter: allDone ? 'drop-shadow(0 0 6px rgba(167,139,250,0.6))' : 'none' }}
        />

        {/* Middle ring — streak — softer purple */}
        <circle
          cx={cx} cy={cy} r={midR}
          fill="none"
          stroke="#5b4fa8"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${midDash} ${midCirc}`}
          strokeDashoffset={0}
          transform={`rotate(-90 ${cx} ${cy})`}
          className="ring-mid"
        />

        {/* Inner ring — decorative tick marks */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
          const x1 = cx + (innerR - 5) * Math.cos(angle);
          const y1 = cy + (innerR - 5) * Math.sin(angle);
          const x2 = cx + (innerR + 5) * Math.cos(angle);
          const y2 = cy + (innerR + 5) * Math.sin(angle);
          const filled = i < Math.round((progress / 100) * 12);
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={filled ? '#4a3f8a' : '#1e1c30'}
              strokeWidth={filled ? 2.5 : 1.5}
              strokeLinecap="round"
            />
          );
        })}

        {/* Center content */}
        <text
          x={cx} y={cy - 18}
          textAnchor="middle"
          fontSize="38"
          fontWeight="700"
          fill={allDone ? '#c4b5fd' : '#e8e4ff'}
          fontFamily="system-ui,-apple-system"
          letterSpacing="-1"
        >
          {progress}%
        </text>
        <text
          x={cx} y={cy + 8}
          textAnchor="middle"
          fontSize="12"
          fontWeight="500"
          fill="#5c5880"
          fontFamily="system-ui,-apple-system"
          letterSpacing="0.5"
        >
          {completed} of {total} done
        </text>
        {streak > 0 && (
          <text
            x={cx} y={cy + 26}
            textAnchor="middle"
            fontSize="11"
            fill="#4a3f8a"
            fontFamily="system-ui,-apple-system"
          >
            {streak}d streak
          </text>
        )}

        {/* Completion glow dots */}
        {allDone && [0, 60, 120, 180, 240, 300].map((deg, i) => {
          const rad = (deg - 90) * Math.PI / 180;
          const dx = cx + (outerR) * Math.cos(rad);
          const dy = cy + (outerR) * Math.sin(rad);
          return (
            <circle key={i} cx={dx} cy={dy} r="4" fill="#c4b5fd" opacity="0.8"
              className={`dot-pulse dot-${i}`} />
          );
        })}
      </svg>

      {allDone && (
        <div className="ring-complete-label">All done today ✦</div>
      )}
    </div>
  );
}
