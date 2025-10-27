import React, { useState, useEffect } from "react";
import "./SettingsModal.css";

function SettingsModal({ settings, onSave, onClose }) {
  // State lokal untuk menampung perubahan sebelum disimpan
  const [localSettings, setLocalSettings] = useState(settings);

  // Sinkronkan state lokal jika props dari parent berubah
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Handler untuk input angka
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalSettings((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  // Handler untuk toggle (checkbox)
  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setLocalSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSave = () => {
    onSave(localSettings);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="settings-section">
          <h4>TIMER (MINUTES)</h4>
          <div className="input-group">
            <label>Pomodoro</label>
            <input
              type="number"
              name="pomodoro"
              value={localSettings.pomodoro}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>Short Break</label>
            <input
              type="number"
              name="shortBreak"
              value={localSettings.shortBreak}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>Long Break</label>
            <input
              type="number"
              name="longBreak"
              value={localSettings.longBreak}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="settings-section">
          <h4>AUTO START</h4>
          <div className="toggle-group">
            <label>Auto start Breaks?</label>
            <label className="switch">
              <input
                type="checkbox"
                name="autoStartBreaks"
                checked={localSettings.autoStartBreaks}
                onChange={handleToggle}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="toggle-group">
            <label>Auto start Pomodoros?</label>
            <label className="switch">
              <input
                type="checkbox"
                name="autoStartPomodoros"
                checked={localSettings.autoStartPomodoros}
                onChange={handleToggle}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h4>LONG BREAK INTERVAL</h4>
          <div className="input-group">
            <input
              type="number"
              name="longBreakInterval"
              value={localSettings.longBreakInterval}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="save-settings-btn" onClick={handleSave}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
