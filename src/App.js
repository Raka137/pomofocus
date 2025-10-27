import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import SettingsModal from "./components/SettingsModal";
import ReportPage from "./components/ReportPage"; // <-- IMPORT BARU

// Nilai default untuk pengaturan
const defaultSettings = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
};

function App() {
  // ===== PENGELOLAAN STATE PENGATURAN =====
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("pomodoroSettings");
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("pomodoroSettings", JSON.stringify(settings));
  }, [settings]);

  // ===== STATE BARU UNTUK LAPORAN & RIWAYAT =====
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [history, setHistory] = useState(() => {
    // Coba ambil riwayat dari localStorage saat pertama kali load
    const savedHistory = localStorage.getItem("pomodoroHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // useEffect untuk menyimpan riwayat ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem("pomodoroHistory", JSON.stringify(history));
  }, [history]);
  // ===============================================

  const [mode, setMode] = useState("pomodoro");
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.pomodoro * 60);
  const [key, setKey] = useState(0);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const alarmRef = useRef(new Audio("/alarm.mp3"));

  const [tasks, setTasks] = useState([]);
  const [activeTaskId, setActiveTaskId] = useState(null);

  useEffect(() => {
    switchMode(mode, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  // ===== FUNGSI BARU UNTUK MENCATAT SESI =====
  const logSession = () => {
    const newSession = {
      id: Date.now(),
      date: new Date().toISOString(),
      duration: settings.pomodoro, // Simpan durasi dari pengaturan saat itu
    };
    setHistory((prevHistory) => [...prevHistory, newSession]);
  };
  // ==========================================

  const incrementPomos = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === activeTaskId
          ? { ...task, pomosCompleted: task.pomosCompleted + 1 }
          : task
      )
    );
  };

  const nextMode = () => {
    let next;
    if (mode === "pomodoro") {
      const newPomodoroCount = pomodoroCount + 1;
      setPomodoroCount(newPomodoroCount);
      if (newPomodoroCount % settings.longBreakInterval === 0) {
        next = "longBreak";
      } else {
        next = "shortBreak";
      }
    } else {
      next = "pomodoro";
    }
    switchMode(next);
    return next;
  };

  useEffect(() => {
    if (!isActive) return;
    if (timeLeft <= 0) {
      alarmRef.current.play();

      // Saat Pomodoro selesai, jalankan fungsi logging
      if (mode === "pomodoro") {
        logSession(); // <-- PEMANGGILAN FUNGSI LOGGING
        if (activeTaskId) {
          incrementPomos();
        }
      }

      const newNextMode = nextMode();

      if (
        (mode === "pomodoro" && settings.autoStartBreaks) ||
        (newNextMode === "pomodoro" && settings.autoStartPomodoros)
      ) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, activeTaskId, settings, pomodoroCount]); // eslint-disable-line react-hooks/exhaustive-deps

  const switchMode = (newMode, shouldStop = true) => {
    if (shouldStop) {
      setIsActive(false);
    }
    setMode(newMode);
    setTimeLeft(settings[newMode] * 60);
    setKey((prevKey) => prevKey + 1);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  document.title = `${formatTime(timeLeft)} - ${
    mode.charAt(0).toUpperCase() + mode.slice(1)
  }`;

  const handleAddTask = (taskData) => {
    const newTask = { id: Date.now(), name: taskData.name, pomosCompleted: 0 };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    if (activeTaskId === taskId) {
      setActiveTaskId(null);
    }
  };

  const handleSetActiveTask = (taskId) => {
    setActiveTaskId(taskId);
  };

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    setIsSettingsOpen(false);
  };

  const activeTask = tasks.find((task) => task.id === activeTaskId);

  return (
    <div className={`app-container ${mode}`}>
      <Header
        onSettingsClick={() => setIsSettingsOpen(true)}
        onReportClick={() => setIsReportOpen(true)} // <-- KIRIM HANDLER REPORT
      />

      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onSave={handleSaveSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* RENDER REPORT PAGE SECARA KONDISIONAL */}
      {isReportOpen && (
        <ReportPage history={history} onClose={() => setIsReportOpen(false)} />
      )}

      <main className="content-wrapper">
        <div className="timer-wrapper">
          <header className="timer-modes">
            <button
              className={mode === "pomodoro" ? "active" : ""}
              onClick={() => switchMode("pomodoro")}
            >
              Pomodoro
            </button>
            <button
              className={mode === "shortBreak" ? "active" : ""}
              onClick={() => switchMode("shortBreak")}
            >
              Short Break
            </button>
            <button
              className={mode === "longBreak" ? "active" : ""}
              onClick={() => switchMode("longBreak")}
            >
              Long Break
            </button>
          </header>

          <div className="timer-display" key={key}>
            <h1>{formatTime(timeLeft)}</h1>
          </div>

          <div className="timer-controls">
            <button className="start-stop-btn" onClick={toggleTimer}>
              {isActive ? "STOP" : "START"}
            </button>
          </div>
        </div>

        <div className="active-task-display">
          {activeTask ? activeTask.name : "Time to focus!"}
        </div>

        <Tasks
          tasks={tasks}
          activeTaskId={activeTaskId}
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
          onSetActive={handleSetActiveTask}
        />
      </main>
    </div>
  );
}

export default App;
