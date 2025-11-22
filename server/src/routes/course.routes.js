import { Router } from "express";
import Course from "../models/Course.model.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// Get all published courses (public)
router.get("/", async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let filter = { isPublished: true };

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const courses = await Course.find(filter)
      .populate("instructor", "name email")
      .populate("reviews.user", "name")
      .select("-content") // Don't send course content in list view
      .sort({ createdAt: -1 });

    res.json({ courses });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get single course details
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email")
      .populate("reviews.user", "name");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ course });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create new course (teachers and admins only)
router.post("/", requireAuth, requireRole("teacher", "admin"), async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      instructor: req.user.id,
    };

    const course = await Course.create(courseData);
    await course.populate("instructor", "name email");

    res.status(201).json({ course });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update course (instructor or admin only)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user is the instructor or admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("instructor", "name email");

    res.json({ course: updatedCourse });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete course (instructor or admin only)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user is the instructor or admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Enroll in course (students only)
router.post("/:id/enroll", requireAuth, requireRole("student"), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.isPublished) {
      return res.status(400).json({ message: "Course is not published" });
    }

    // Check if already enrolled using string comparison
    const isAlreadyEnrolled = course.enrolledStudents.some(studentId => 
      studentId.toString() === req.user.id.toString()
    );

    if (isAlreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    course.enrolledStudents.push(req.user.id);
    await course.save();

    res.json({ message: "Successfully enrolled in course" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get enrolled courses for current user
router.get("/enrolled/my-courses", requireAuth, async (req, res) => {
  try {
    const courses = await Course.find({
      enrolledStudents: req.user.id,
    })
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    res.json({ courses });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get courses created by current user (for teachers)
router.get("/my-courses/created", requireAuth, requireRole("teacher", "admin"), async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    res.json({ courses });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add review to course
router.post("/:id/review", requireAuth, requireRole("student"), async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if student is enrolled
    if (!course.enrolledStudents.includes(req.user.id)) {
      return res.status(403).json({ message: "Must be enrolled to review" });
    }

    // Check if user already reviewed
    const existingReview = course.reviews.find(
      (review) => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this course" });
    }

    course.reviews.push({
      user: req.user.id,
      rating,
      comment,
    });

    // Update average rating
    const totalRating = course.reviews.reduce((sum, review) => sum + review.rating, 0);
    course.rating = totalRating / course.reviews.length;

    await course.save();
    await course.populate("reviews.user", "name");

    res.json({ message: "Review added successfully", course });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;