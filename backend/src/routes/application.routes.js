const express = require("express");

const {
  createApplication,
  getApplications,
  getApplicationById,
  getApplicationStats,
  updateApplication,
  deleteApplication,
} = require("../controllers/application.controller");

const {
  authenticate,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authenticate, createApplication);
router.get("/", authenticate, getApplications);
router.get("/stats", authenticate, getApplicationStats);
router.get("/:id", authenticate, getApplicationById);
router.patch("/:id", authenticate, updateApplication);
router.delete("/:id", authenticate, deleteApplication);

module.exports = router;