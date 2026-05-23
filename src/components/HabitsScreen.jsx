import React, { useState } from 'react';
import { HABIT_ICONS, HABIT_COLORS } from '../utils/constants.js';

function AddHabitModal({ onAdd, onClose }) {
  const [title, setTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(HABIT_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), icon: selectedIcon, color: selectedColor });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h2 className="modal-title">New Habit</h2>

        <form onSubmit={handleSubmit} className="add-habit-form">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Read 20 pages"
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
              maxLength={40}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Icon</label>
            <div className="icon-grid">
              {HABIT_ICONS.map(icon => (
                <button
                  key={icon}
                  type="button"
                  className={`icon-btn ${selectedIcon === icon ? 'selected' : ''}`}
                  onClick={() => setSelectedIcon(icon)}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Color</label>
            <div className="color-grid">
              {HABIT_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                >
                  {selectedColor === color && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="habit-preview" style={{ '--habit-color': selectedColor }}>
            <div className="habit-preview-circle">{selectedIcon}</div>
            <span className="habit-preview-title">{title || 'Habit name'}</span>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={!title.trim()}>Add Habit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function HabitItem({ habit, onRemove, completionRate }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="habit-manage-card" style={{ '--habit-color': habit.color }}>
      <div className="habit-manage-left">
        <div className="habit-manage-icon">{habit.icon}</div>
        <div className="habit-manage-info">
          <div className="habit-manage-title">{habit.title}</div>
          <div className="habit-manage-rate">{completionRate}% last 30 days</div>
        </div>
      </div>
      <div className="habit-manage-right">
        {confirmDelete ? (
          <div className="delete-confirm">
            <button className="btn-danger-sm" onClick={() => onRemove(habit.id)}>Delete</button>
            <button className="btn-cancel-sm" onClick={() => setConfirmDelete(false)}>Cancel</button>
          </div>
        ) : (
          <button className="btn-trash" onClick={() => setConfirmDelete(true)} aria-label="Delete habit">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export function HabitsScreen({ habits, onAdd, onRemove, getCompletionRate }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="screen habits-screen">
      <div className="screen-header">
        <h1 className="screen-title">Habits</h1>
        <button className="btn-add" onClick={() => setShowModal(true)} aria-label="Add habit">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      {habits.length === 0 ? (
        <div className="empty-habits">
          <div className="empty-emoji">🌱</div>
          <h3>No habits yet</h3>
          <p>Start building great habits by adding your first one.</p>
          <button className="btn-primary" onClick={() => setShowModal(true)}>Add First Habit</button>
        </div>
      ) : (
        <>
          <div className="habits-count-label">{habits.length} habit{habits.length !== 1 ? 's' : ''} tracked</div>
          <div className="habits-manage-list">
            {habits.map(habit => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onRemove={onRemove}
                completionRate={getCompletionRate(habit.id, 30)}
              />
            ))}
          </div>

          <button className="btn-add-floating" onClick={() => setShowModal(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Habit
          </button>
        </>
      )}

      {showModal && (
        <AddHabitModal
          onAdd={onAdd}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
