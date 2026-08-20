const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (request, response) => {
  response.status(200).json({
    message: "JobTrack API is running",
  });
});

app.listen(PORT, () => {
  console.log(`JobTrack API running on http://localhost:${PORT}`);
});