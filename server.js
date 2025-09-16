// src/server.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import route from "./src/routes/route.js";
dotenv.config();
import { connectDB } from "./src/config/db.js";

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
};

// Apply CORS with the configuration
app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json({ limit: '5mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Parse cookies
app.use(cookieParser());

// Handle preflight requests
app.options('*', cors(corsOptions));

app.get("/api/", (_req, res) => res.json({ ok: true }));
app.use("/api", route);

const PORT = process.env.PORT;
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`Pariwar Link backend running on http://localhost:${PORT}`)
  );
});
