const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const applicationRoutes = require("./routes/application.routes");
const {
  notFound,
  errorHandler,
} = require("./middlewares/error.middleware");

const app = express();

function normalizeOrigin(origin) {
  return origin?.trim().replace(/\/$/, "");
}

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [normalizeOrigin(process.env.FRONTEND_URL)].filter(Boolean)
    : [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
      ];

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(normalizeOrigin(origin))
      ) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.get("/", (request, response) => {
  response.status(200).json({
    message: "Welcome to JobTrack API",
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;