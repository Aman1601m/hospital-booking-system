const express = require("express");
const route = express.Router();

const {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controller/userController");

const protect = require("../middleware/userMiddleware");
const User = require("../module/user");

// ✅ AUTH
route.post("/register", registerUser);
route.post("/login", loginUser);

// ✅ USERS
route.get("/", protect, getUser);
route.put("/:id", protect, updateUser);
route.delete("/:id", protect, deleteUser);

route.put("/toggle/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // toggle
    user.isActive = !user.isActive;

    await user.save();

    res.json({
      message: "User status updated",
      isActive: user.isActive,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = route;