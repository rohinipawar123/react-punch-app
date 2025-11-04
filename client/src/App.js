import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [punches, setPunches] = useState([]);
  const backendURL = process.env.REACT_APP_BACKEND_URL || window.location.origin;

  const fetchPunches = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/punches`);
      setPunches(res.data || []);
    } catch (err) {
      console.error("Error fetching punches:", err);
    }
  };

  const handlePunch = async (type) => {
    const now = new Date();
    const formattedTime = time || now.toLocaleString();
    const newPunch = {
      time: formattedTime,
      type,
      note,
    };

    try {
      await axios.post(`${backendURL}/api/punch`, newPunch);
      setTime("");
      setNote("");
      fetchPunches();
    } catch (err) {
      console.error("Error saving punch:", err);
    }
  };

  useEffect(() => {
    fetchPunches();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="app-container">
      <h1>⏰ Punch Clock</h1>
      <p className="greeting">
        {getGreeting()}, Rohini 🌞
      </p>

      <div className="card">
        <label>Time:</label>
        <input
          type="datetime-local"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <label>Note:</label>
        <input
          type="text"
          placeholder="Optional note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="button-group">
          <button className="btn btn-in" onClick={() => handlePunch("Punch In")}>
            Punch In
          </button>
          <button className="btn btn-out" onClick={() => handlePunch("Punch Out")}>
            Punch Out
          </button>
        </div>
      </div>

      <div className="past-punches">
        <h3>📜 Past Punches</h3>
        {punches.length > 0 ? (
          punches.map((p, i) => (
            <p key={i}>
              <strong>{p.time}</strong> — {p.type}
              {p.note ? ` (${p.note})` : ""}
            </p>
          ))
        ) : (
          <p>No records yet.</p>
        )}
      </div>

      <footer>© 2025 PunchApp | Made with 💙 by Rohini</footer>
    </div>
  );
}

export default App;
