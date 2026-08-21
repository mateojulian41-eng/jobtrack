const express = require("express");

const {
  createApplication,
  getApplications,
} = require("../controllers/application.controller");

const {
  authenticate,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authenticate, createApplication);
router.get("/", authenticate, getApplications);

module.exports = router;