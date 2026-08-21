const express = require("express");

const {
  createApplication,
  getApplications,
  getApplicationById,
} = require("../controllers/application.controller");

const {
  authenticate,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authenticate, createApplication);
router.get("/", authenticate, getApplications);
router.get("/:id", authenticate, getApplicationById);

module.exports = router;