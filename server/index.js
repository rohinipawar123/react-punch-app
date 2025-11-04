// ✅ Correct version for ES Modules
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import couchbase from "couchbase";

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// --- Your API routes ---
app.get("/api/test", (req, res) => {
  res.json({ message: "API working fine!" });
});

// --- Serve React build ---
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// --- Couchbase connection ---
try {
  const cluster = await couchbase.connect(process.env.COUCHBASE_CONNSTR, {
    username: process.env.COUCHBASE_USERNAME,
    password: process.env.COUCHBASE_PASSWORD,
  });
  console.log("✅ Connected to Couchbase");
} catch (err) {
  console.error("❌ Couchbase connection failed:", err);
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
