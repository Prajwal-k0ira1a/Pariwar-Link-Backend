// src/server.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import route from "./src/routes/route.js";
dotenv.config();
import { connectDB } from "./src/config/db.js";

const app = express();
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json({ limit: "5mb" }));


app.get("/api/", (_req, res) => res.json({ ok: true }));
app.use("/api",route);

const PORT = process.env.PORT;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Pariwar Link backend running on http://localhost:${PORT}`));
});
