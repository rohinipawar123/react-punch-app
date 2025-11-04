// server/index.js

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import couchbase from "couchbase";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Required for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middleware
app.use(express.json());
app.use(cors());

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
        // You can later query Couchbase here if needed
        res.json([]); // Placeholder response
      } catch (error) {
        console.error("Error fetching punches:", error);
        res.status(500).json({ error: "Error fetching punches" });
      }
    });

    // --- ✅ Save Punch (Punch-in) ---
    app.post("/api/punch", async (req, res) => {
      try {
        const { name, time } = req.body;
        console.log("Received Punch:", name, time);

        // Optional: Save to Couchbase
        // await collection.insert(`punch_${Date.now()}`, { name, time });

        res.status(200).json({ message: "Punch-in recorded successfully!" });
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
