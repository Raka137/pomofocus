import React, { useMemo } from "react";
import "./ReportPage.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrasi komponen yang dibutuhkan oleh Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ReportPage({ history, onClose }) {
  // Gunakan useMemo untuk memproses data hanya saat history berubah
  const processedData = useMemo(() => {
    if (!history || history.length === 0) {
      return { labels: [], data: [], total: 0 };
    }

    const sessionsByDay = {};
    history.forEach((session) => {
      // Ambil tanggal dalam format YYYY-MM-DD
      const date = new Date(session.date).toISOString().split("T")[0];
      if (sessionsByDay[date]) {
        sessionsByDay[date]++;
      } else {
        sessionsByDay[date] = 1;
      }
    });

    const labels = Object.keys(sessionsByDay).sort();
    const data = labels.map((label) => sessionsByDay[label]);

    return { labels, data, total: history.length };
  }, [history]);

  const chartData = {
    labels: processedData.labels,
    datasets: [
      {
        label: "Pomodoros Completed",
        data: processedData.data,
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        borderColor: "white",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Pomodoro Sessions per Day",
        color: "white",
        font: {
          size: 18,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "white",
          stepSize: 1, // Pastikan sumbu y adalah bilangan bulat
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
      x: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
    },
  };

  return (
    <div className="report-overlay" onClick={onClose}>
      <div className="report-content" onClick={(e) => e.stopPropagation()}>
        <div className="report-header">
          <h2>Report</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        {history.length > 0 ? (
          <>
            <div className="report-summary">
              Total Pomodoros Completed: <strong>{processedData.total}</strong>
            </div>
            <div className="chart-container">
              <Bar options={chartOptions} data={chartData} />
            </div>
          </>
        ) : (
          <div className="no-data-message">
            <p>No pomodoro sessions have been completed yet.</p>
            <p>Complete a pomodoro to see your progress!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportPage;
