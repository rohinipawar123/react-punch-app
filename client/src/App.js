import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [punches, setPunches] = useState([]);
  const [manualTime, setManualTime] = useState("");
  const backendURL = process.env.REACT_APP_BACKEND_URL || window.location.origin;

  const fetchPunches = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/punches`);
      setPunches(res.data);
    } catch (err) {
      console.error("Error fetching punches:", err);
    }
  };

  const punchIn = async () => {
    const now = new Date();
    const localTime = now.toLocaleString();
    const isManual = manualTime.trim() !== "";
    const timeToSave = isManual ? manualTime : localTime;

    try {
      await axios.post(`${backendURL}/api/punch`, { time: timeToSave, isManual });
      setManualTime("");
      fetchPunches();
    } catch (err) {
      console.error("Error punching in:", err);
    }
  };

  useEffect(() => {
    fetchPunches();
  }, []);

  const localPunches = punches.filter((p) => p.type === "local");
  const manualPunches = punches.filter((p) => p.type === "manual");

  return (
    <div className="container">
      <h2>⏰ Punch In App</h2>
      <p>
        <strong>Local Time:</strong> {new Date().toLocaleString()}
      </p>

      <input
        type="text"
        placeholder="Enter time manually (optional)"
        value={manualTime}
        onChange={(e) => setManualTime(e.target.value)}
      />

      <div>
        <button onClick={punchIn}>Punch In</button>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3>📍 Local Punches</h3>
        {localPunches.length > 0 ? (
          <ul style={{ textAlign: "left" }}>
            {localPunches.map((item) => (
              <li key={item.id}>{item.time}</li>
            ))}
          </ul>
        ) : (
          <p>No local punches yet</p>
        )}

        <h3>✍️ Manual Punches</h3>
        {manualPunches.length > 0 ? (
          <ul style={{ textAlign: "left" }}>
            {manualPunches.map((item) => (
              <li key={item.id}>{item.time}</li>
            ))}
          </ul>
        ) : (
          <p>No manual punches yet</p>
        )}
      </div>
    </div>
  );
}

export default App;
