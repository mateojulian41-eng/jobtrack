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
  return origin?.trim().replace(/\/+$/, "");
}

const nodeEnvironment = (process.env.NODE_ENV || "development")
  .trim()
  .toLowerCase();
const normalizedFrontendUrl = normalizeOrigin(
  process.env.FRONTEND_URL,
);

function getUrlOrigin(origin) {
  try {
    return origin ? new URL(origin).origin : null;
  } catch {
    return null;
  }
}

const frontendOrigin = getUrlOrigin(normalizedFrontendUrl);
const developmentOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = normalizeOrigin(origin);
      const requestOrigin = getUrlOrigin(normalizedOrigin);
      const isVercelOrigin = requestOrigin
        ? new URL(requestOrigin).protocol === "https:" &&
          new URL(requestOrigin).hostname.endsWith(".vercel.app")
        : false;
      const isAllowed =
        nodeEnvironment === "production"
          ? requestOrigin === frontendOrigin || isVercelOrigin
          : developmentOrigins.has(requestOrigin);

      if (isAllowed) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
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