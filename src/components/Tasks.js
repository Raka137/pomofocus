import React, { useState } from "react";
import "./Tasks.css";

function Tasks({ tasks, activeTaskId, onAddTask, onDeleteTask, onSetActive }) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [taskName, setTaskName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskName.trim()) {
      onAddTask({ name: taskName });
      setTaskName("");
      setIsFormVisible(false);
    }
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h2>Tasks</h2>
        {/* Tombol menu, bisa ditambahkan fungsionalitas nanti */}
        <button className="menu-btn">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="white"
              d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
            ></path>
          </svg>
        </button>
      </div>

      <hr className="divider" />

      <div className="task-list">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`task-item ${task.id === activeTaskId ? "active" : ""}`}
            onClick={() => onSetActive(task.id)}
          >
            <span className="task-name">{task.name}</span>
            <div className="task-actions">
              <span className="task-pomos">{task.pomosCompleted}</span>
              <button
                className="delete-task-btn"
                onClick={(e) => {
                  e.stopPropagation(); // Mencegah task menjadi aktif saat menghapus
                  onDeleteTask(task.id);
                }}
              >
                &times;
              </button>
            </div>
          </div>
        ))}
      </div>

      {isFormVisible ? (
        <form className="task-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="What are you working on?"
            autoFocus
          />
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setIsFormVisible(false)}
            >
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save
            </button>
          </div>
        </form>
      ) : (
        <button className="add-task-btn" onClick={() => setIsFormVisible(true)}>
          + Add Task
        </button>
      )}
    </div>
  );
}

export default Tasks;
