const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (request, response) => {
  response.status(200).json({
    message: "JobTrack API is running",
  });
});

module.exports = app;