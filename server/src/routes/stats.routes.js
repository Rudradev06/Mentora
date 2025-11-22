import { Router } from "express";
import Course from "../models/Course.model.js";
import User from "../models/User.model.js";

const router = Router();

// Get platform statistics
router.get("/", async (req, res) => {
  try {
    // Get course statistics
    const totalCourses = await Course.countDocuments({ isPublished: true });
    const courses = await Course.find({ isPublished: true }).populate("instructor", "name");
    
    // Calculate total enrolled students
    const totalEnrollments = courses.reduce((sum, course) => sum + course.enrolledStudents.length, 0);
    
    // Get unique instructors count
    const instructorIds = new Set(courses.map(course => course.instructor._id.toString()));
    const totalInstructors = instructorIds.size;
    
    // Calculate average rating
    const coursesWithRatings = courses.filter(course => course.rating > 0);
    const averageRating = coursesWithRatings.length > 0 
      ? coursesWithRatings.reduce((sum, course) => sum + course.rating, 0) / coursesWithRatings.length
      : 0;
    
    // Get user statistics
    const totalUsers = await User.countDocuments();
    const studentCount = await User.countDocuments({ role: "student" });
    const teacherCount = await User.countDocuments({ role: "teacher" });
    const adminCount = await User.countDocuments({ role: "admin" });
    
    // Get popular categories
    const categoryStats = {};
    courses.forEach(course => {
      categoryStats[course.category] = (categoryStats[course.category] || 0) + 1;
    });
    
    const stats = {
      courses: {
        total: totalCourses,
        averageRating: Math.round(averageRating * 10) / 10,
        totalEnrollments,
        categories: categoryStats
      },
      users: {
        total: totalUsers,
        students: studentCount,
        teachers: teacherCount,
        admins: adminCount,
        instructors: totalInstructors
      },
      platform: {
        successRate: 95, // This could be calculated based on course completion rates
        satisfaction: Math.round(averageRating * 20), // Convert 5-star to percentage
      }
    };

    res.json({ stats });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get trending courses
router.get("/trending", async (req, res) => {
  try {
    const trendingCourses = await Course.find({ isPublished: true })
      .populate("instructor", "name email")
      .populate("reviews.user", "name");

    // Sort by enrollment count (array length), then by rating, then by date
    const sortedCourses = trendingCourses
      .sort((a, b) => {
        const enrollmentDiff = b.enrolledStudents.length - a.enrolledStudents.length;
        if (enrollmentDiff !== 0) return enrollmentDiff;
        
        const ratingDiff = b.rating - a.rating;
        if (ratingDiff !== 0) return ratingDiff;
        
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
      .slice(0, 6);

    res.json({ courses: sortedCourses });
  } catch (error) {
    console.error("Error fetching trending courses:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;