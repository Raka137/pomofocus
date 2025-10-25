import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Header from "./components/Header"; // Mengimpor komponen Header

function App() {
  // Pengaturan durasi dalam menit (bisa diubah dari komponen Settings nanti)
  const settings = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
  };

  const [mode, setMode] = useState("pomodoro"); // 'pomodoro', 'shortBreak', 'longBreak'
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.pomodoro * 60);

  // Menggunakan 'key' untuk memaksa komponen di-render ulang saat mode berubah, memastikan visual timer direset
  const [key, setKey] = useState(0);

  // useRef untuk menyimpan referensi audio agar tidak dibuat ulang pada setiap render
  const alarmRef = useRef(new Audio("/alarm.mp3"));

  // useEffect untuk logika countdown timer
  useEffect(() => {
    // Keluar jika timer tidak aktif
    if (!isActive) return;

    // Jika waktu habis
    if (timeLeft <= 0) {
      alarmRef.current.play(); // Mainkan suara alarm
      setIsActive(false); // Hentikan timer
      // Di sini bisa ditambahkan logika untuk otomatis beralih ke mode istirahat
      return;
    }

    // Interval yang berjalan setiap detik untuk mengurangi waktu
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // Cleanup function: Hentikan interval saat komponen di-unmount atau timer berhenti
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Fungsi untuk beralih mode (Pomodoro, Short Break, Long Break)
  const switchMode = (newMode) => {
    setIsActive(false); // Selalu hentikan timer saat ganti mode
    setMode(newMode);
    setTimeLeft(settings[newMode] * 60);
    setKey((prevKey) => prevKey + 1); // Mengubah key untuk mereset komponen timer
  };

  // Fungsi untuk tombol Start/Stop
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // Fungsi untuk memformat waktu dari detik menjadi format MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // Mengubah judul tab browser secara dinamis sesuai sisa waktu
  document.title = `${formatTime(timeLeft)} - ${
    mode.charAt(0).toUpperCase() + mode.slice(1)
  }`;

  return (
    // Kelas CSS pada div utama berubah sesuai mode untuk tema warna
    <div className={`app-container ${mode}`}>
      <Header /> {/* Menampilkan komponen Header di bagian atas */}
      {/* Wrapper untuk konten utama agar bisa dipusatkan di bawah header */}
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
      </main>
    </div>
  );
}

export default App;

