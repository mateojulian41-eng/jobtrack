const express = require("express");

const healthRoutes = require("./routes/health.routes");

const app = express();

app.use(express.json());

app.get("/", (request, response) => {
  response.status(200).json({
    message: "Welcome to JobTrack API",
  });
});

app.use("/api/health", healthRoutes);

module.exports = app;