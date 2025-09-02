// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const nocache = require("nocache");
require("dotenv").config();

// Import routes
const adminRoutes = require("./routes/adminRoutes");
const quizRoutes = require("./routes/quizRoutes");
const userRoutes = require("./routes/userRoutes");
const feedbackRoutes = require("./routes/FeedbackRoutes");

const app = express();

// 🛡️ Security & middleware
app.use(helmet()); // set security headers
app.use(cors({
  origin: ["http://localhost:5173","http://localhost:5174",],   // your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

app.use(express.json()); // parse JSON requests
app.use(nocache()); // prevent caching
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev")); // log requests only in dev
}

// 🛣️ Routes
app.use("/api/admin", adminRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/user", userRoutes);
app.use("/api/feedback", feedbackRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("✅ Quiz App API is running...");
});

// ❌ Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Server Error" });
});

// 🚦 Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully!");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

// Start server after DB connection
const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

startServer();

// 🛑 Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🔌 MongoDB connection closed");
  process.exit(0);
});

