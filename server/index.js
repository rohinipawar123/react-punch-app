// server/index.js

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import couchbase from "couchbase";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Needed for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middleware
app.use(express.json());
app.use(cors());

// ✅ Temporary in-memory array to store punches (for testing)
let punches = [];

// ✅ Couchbase Connection
const connectToCouchbase = async () => {
  try {
    console.log("Connecting to Couchbase...");

    const cluster = await couchbase.connect(process.env.COUCHBASE_CONNSTR, {
      username: process.env.COUCHBASE_USERNAME,
      password: process.env.COUCHBASE_PASSWORD,
    });

    const bucket = cluster.bucket(process.env.COUCHBASE_BUCKET);
    const collection = bucket.defaultCollection();

    console.log("✅ Connected to Couchbase");

    // --- ✅ Fetch Punches ---
    app.get("/api/punches", async (req, res) => {
      try {
        // Return in-memory punches (or Couchbase query later)
        res.json(punches);
      } catch (error) {
        console.error("Error fetching punches:", error);
        res.status(500).json({ error: "Error fetching punches" });
      }
    });

    // --- ✅ Save Punch (Punch-in) ---
    app.post("/api/punch", async (req, res) => {
      try {
        const { time } = req.body;
        if (!time) {
          return res.status(400).json({ error: "Time is required" });
        }

        const punchEntry = {
          id: Date.now(),
          time,
        };

        // Add to in-memory array
        punches.unshift(punchEntry);

        // Optionally: Save to Couchbase
        // await collection.insert(`punch_${Date.now()}`, punchEntry);

        console.log("✅ Punch recorded:", punchEntry);

        res.status(200).json(punchEntry);
      } catch (err) {
        console.error("Error saving punch:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
    
 // --- ✅ punchin entry ---
    
    app.post("/api/punch", async (req, res) => {
  try {
    const { time, isManual } = req.body;
    if (!time) {
      return res.status(400).json({ error: "Time is required" });
    }

    const punchEntry = {
      id: Date.now(),
      time,
      type: isManual ? "manual" : "local",
    };

    punches.unshift(punchEntry);
    console.log("✅ Punch recorded:", punchEntry);
    res.status(200).json(punchEntry);
  } catch (err) {
    console.error("Error saving punch:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


    // --- ✅ Serve React Frontend ---
    app.use(express.static(path.join(__dirname, "../client/build")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/build", "index.html"));
    });

    // --- ✅ Start Server ---
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Couchbase connection failed:", error);
  }
};

connectToCouchbase();
