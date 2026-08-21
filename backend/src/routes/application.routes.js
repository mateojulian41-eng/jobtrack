const express = require("express");

const {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
} = require("../controllers/application.controller");

const {
  authenticate,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authenticate, createApplication);
router.get("/", authenticate, getApplications);
router.get("/:id", authenticate, getApplicationById);
router.patch("/:id", authenticate, updateApplication);
router.delete("/:id", authenticate, deleteApplication);

module.exports = router;