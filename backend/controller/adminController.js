const Appointment = require("../module/appointment");
const User = require("../module/user");

// ✅ CREATE APPOINTMENT
const createAppointment = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Check if user is active
    if (!user.isActive) {
      return res
        .status(403)
        .json({ message: "❌ Your account is inactive. Cannot book appointment." });
    }

    const { name, phone, email, reason, date, gender } = req.body;

    const newAppointment = await Appointment.create({
      userid: req.user.id,
      name,
      phone,
      email,
      reason,
      date,
      gender,
      status: "pending", // default
    });

    res.status(201).json({
      message: "✅ Appointment booked successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET MY APPOINTMENTS
const getMyAppointment = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userid: req.user.id });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET ALL APPOINTMENTS (Admin)
const getAllAppointment = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ APPROVE APPOINTMENT
const approvedAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { suggestedDate, adminResponse } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      {
        status: "approved",
        suggestedDate,
        adminResponse,
      },
      { new: true }
    );

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    res.json({ message: "Appointment approved", appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ REJECT APPOINTMENT
const rejectAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminResponse } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status: "rejected", adminResponse },
      { new: true }
    );

    res.json({ message: "Appointment rejected", appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ UPDATE DATE
const updateAppointmentDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body;

    const updated = await Appointment.findByIdAndUpdate(
      id,
      { date },
      { new: true }
    );

    res.json({ message: "Date updated", appointment: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ DELETE APPOINTMENT
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    await Appointment.findByIdAndDelete(id);
    res.json({ message: "Appointment deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// ✅ TOGGLE USER ACTIVE/INACTIVE
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: "User status updated", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAppointment,
  getMyAppointment,
  getAllAppointment,
  approvedAppointment,
  rejectAppointment,
  deleteAppointment,
  getAllUsers,
  updateAppointmentDate,
  toggleUserStatus,
};