const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getMyAppointment,
  getAllAppointment,
  approvedAppointment,
  rejectAppointment,
  deleteAppointment,
  getAllUsers,
  updateAppointmentDate,
  toggleUserStatus,
} = require("../controller/adminController");

const protect = require("../middleware/userMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

// USER
router.post("/", protect, createAppointment);
router.get("/my", protect, getMyAppointment);

// ADMIN
router.get("/all", protect, isAdmin, getAllAppointment);
router.get("/users", protect, isAdmin, getAllUsers);
router.put("/approve/:id", protect, isAdmin, approvedAppointment);
router.put("/reject/:id", protect, isAdmin, rejectAppointment);
router.put("/update-date/:id", protect, isAdmin, updateAppointmentDate);
router.put("/toggle-user/:id", protect, isAdmin, toggleUserStatus);
router.delete("/:id", protect, isAdmin, deleteAppointment);

module.exports = router;