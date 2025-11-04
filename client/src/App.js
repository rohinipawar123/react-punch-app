import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [punches, setPunches] = useState([]);
  const [manualTime, setManualTime] = useState("");

  // ✅ Automatically detect backend URL
  const backendURL =
    process.env.REACT_APP_BACKEND_URL || window.location.origin;

  // ✅ Fetch punch data
  const fetchPunches = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/punches`);
      if (Array.isArray(res.data)) {
        setPunches(res.data);
      } else {
        setPunches([]);
      }
    } catch (err) {
      console.error("❌ Error fetching punches:", err);
    }
  };

  // ✅ Handle punch-in button click
  const punchIn = async () => {
    const now = new Date();
    const localTime = now.toLocaleString();
    const timeToSave = manualTime || localTime;

    try {
      const res = await axios.post(`${backendURL}/api/punch`, {
        name: "User",
        time: timeToSave,
      });

      console.log("✅ Punch response:", res.data);
      setManualTime("");
      fetchPunches(); // Refresh list after punching
    } catch (err) {
      console.error("❌ Error punching in:", err);
      alert("Punch-in failed. Check console for details.");
    }
  };

  useEffect(() => {
    fetchPunches();
  }, []);

  return (
    <div
      className="container"
      style={{
        maxWidth: "500px",
        margin: "60px auto",
        padding: "30px",
        background: "#fff",
        borderRadius: "1
