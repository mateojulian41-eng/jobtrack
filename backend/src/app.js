const express = require("express");

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const applicationRoutes = require("./routes/application.routes");
const {
  notFound,
  errorHandler,
} = require("./middlewares/error.middleware");

const app = express();

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