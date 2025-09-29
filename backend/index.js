import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bookingsRouter from "./routes/bookings.js";
import patientsRouter from "./routes/patients.js";
import doctorsRouter from "./routes/doctors.js";
import { connectDb } from "./utils/db.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Al-Waleed Dental Clinic API is running!",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// API health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  try {
    // Connect to database first
    await connectDb();

    // Register routes after DB connection
    app.use("/api/bookings", bookingsRouter);
    app.use("/api/patients", patientsRouter);
    app.use("/api/doctors", doctorsRouter);

    // Error handling middleware (should be after routes)
    app.use((err, req, res, next) => {
      console.error("Error:", err.stack);
      res.status(500).json({
        error: "Something went wrong!",
        message:
          process.env.NODE_ENV === "development"
            ? err.message
            : "Internal server error",
      });
    });

    // Start the server
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received, shutting down gracefully");
  process.exit(0);
});

startServer();
