import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import upvoteRoutes from "./routes/upvoteRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import timelineRoutes from "./routes/timelineRoutes.js";
import evidenceRoutes from "./routes/evidenceRoutes.js";
import priorityRoutes from "./routes/priorityRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import pushRoutes from "./routes/pushRoutes.js";

dotenv.config();
const app = express();

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://team-code-orbit-xfrontend.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      // Don't throw error, just reject silently to prevent crashes
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Static file serving removed for serverless compatibility
// Files should be served from Cloudinary CDN instead
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware to ensure DB connection before each request
// Made more resilient for serverless - won't crash if DB is temporarily unavailable
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (error) {
    console.error("DB Connection Error:", error.message);
    // Don't block the request - routes can handle DB errors gracefully
    // This prevents the entire function from crashing
  }
  next();
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "TeamCodeOrbitX API is running",
    version: "1.0.0",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upvotes", upvoteRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/push", pushRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/evidence", evidenceRoutes);
app.use("/api/priority", priorityRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/budget", budgetRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Global error handler - must be last
app.use((err, req, res, next) => {
  console.error("Error:", err);
  
  // Don't send response if already sent
  if (res.headersSent) {
    return next(err);
  }
  
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

// Unhandled promise rejection handler (for serverless)
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

// Export for Vercel serverless
// Vercel with @vercel/node automatically wraps Express apps
export default app;
