
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const mysteryRoutes = require("./routes/mysteryRoutes");
const investigationRoutes = require("./routes/investigationRoutes");

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL
}));

app.use(express.json());

// API Routes
app.use("/api/mysteries", mysteryRoutes);
app.use("/api/investigation", investigationRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({
    message: "AI Mystery Room Backend is Running!"
  });
});

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
