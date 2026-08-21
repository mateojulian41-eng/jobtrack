const express = require("express");

const {
  createApplication,
} = require("../controllers/application.controller");

const {
  authenticate,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authenticate, createApplication);

module.exports = router;