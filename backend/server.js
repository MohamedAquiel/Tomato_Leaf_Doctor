require("dotenv").config();
require("express-async-errors");

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
connectDB();

const app = express();
app.use(helmet());

const corsOptions =
  process.env.NODE_ENV === "development"
    ? { origin: "*" }
    : {
        origin: process.env.ALLOWED_ORIGINS
          ? process.env.ALLOWED_ORIGINS.split(",")
          : [],
        credentials: true,
      };
app.use(cors(corsOptions));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const uploadPath = process.env.UPLOAD_PATH || "uploads/";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log(`📁 Created uploads directory: ${uploadPath}`);
}

app.use("/uploads", express.static(path.join(__dirname, uploadPath)));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/predictions", require("./routes/predictionRoutes"));
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Tomato Disease API",
    version: "1.0.0",
  });
});
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
  );
});
process.on("unhandledRejection", (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
process.on("uncaughtException", (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

module.exports = app;
