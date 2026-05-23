import React from 'react';

export function BadgeToast({ badge }) {
  if (!badge) return null;

  return (
    <div className="badge-toast">
      <div className="badge-toast-icon">{badge.icon}</div>
      <div className="badge-toast-text">
        <div className="badge-toast-title">Badge Unlocked!</div>
        <div className="badge-toast-name">{badge.name}</div>
      </div>
    </div>
  );
}
