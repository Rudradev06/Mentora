import { Router } from "express";
import User from "../models/User.model.js";
import { signToken } from "../utils/jwt.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

/**
 * Registration:
 * - First ever account becomes admin (bootstrap).
 * - All subsequent self-registrations can be "student" or "teacher".
 * - Prevent unauthorized admin role assignments.
 */
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if email is already in use
    const already = await User.findOne({ email });
    if (already) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // Determine if this is the first account
    const userCount = await User.countDocuments();
    const assignedRole = userCount === 0 ? "admin" : role;

    // Prevent unauthorized admin role for non-first accounts
    if (userCount > 0 && role === "admin") {
      return res
        .status(403)
        .json({
          message: "Admin role can only be assigned to the first account",
        });
    }

    // Validate role
    if (!["student", "teacher", "admin"].includes(assignedRole)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
    });
    const token = signToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
