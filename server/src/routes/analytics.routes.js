import { Router } from "express";
import Course from "../models/Course.model.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// Get analytics for a specific course (instructor or admin only)
router.get("/course/:courseId", requireAuth, requireRole("teacher", "admin"), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate("instructor", "name email")
      .populate("enrolledStudents", "name email createdAt")
      .populate("reviews.user", "name");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user is the instructor or admin
    if (course.instructor._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view these analytics" });
    }

    // Calculate real statistics
    const totalStudents = course.enrolledStudents.length;
    const totalReviews = course.reviews.length;
    const averageRating = course.rating;
    const revenue = course.price * totalStudents;
    const totalViews = course.totalViews || totalStudents * 3;

    // Calculate completion rate (if you have completion tracking)
    const completionRate = course.completionRate || 0;

    // Calculate engagement rate based on reviews vs enrollments
    const engagementRate = totalStudents > 0 
      ? Math.round((totalReviews / totalStudents) * 100) 
      : 0;

    // Calculate conversion rate
    const conversionRate = totalViews > 0 
      ? Math.round((totalStudents / totalViews) * 100) 
      : 0;

    // Calculate course age in days
    const courseAge = Math.floor((new Date() - new Date(course.createdAt)) / (1000 * 60 * 60 * 24));

    // Generate weekly enrollment data (last 4 weeks)
    const weeklyStats = [];
    const now = new Date();
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7 + 7));
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - (i * 7));

      const enrollmentsThisWeek = course.enrolledStudents.filter(student => {
        const enrollDate = new Date(student.createdAt);
        return enrollDate >= weekStart && enrollDate < weekEnd;
      }).length;

      weeklyStats.push({
        week: `Week ${4 - i}`,
        enrollments: enrollmentsThisWeek,
        revenue: enrollmentsThisWeek * course.price,
        weekStart: weekStart.toISOString(),
        weekEnd: weekEnd.toISOString()
      });
    }

    // Calculate monthly growth
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthEnrollments = course.enrolledStudents.filter(
      student => new Date(student.createdAt) >= lastMonth
    ).length;
    const monthlyGrowth = totalStudents > 0 
      ? Math.round((lastMonthEnrollments / totalStudents) * 100) 
      : 0;

    // Get rating distribution
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    course.reviews.forEach(review => {
      ratingDistribution[review.rating]++;
    });

    // Get recent enrollments (last 10)
    const recentEnrollments = course.enrolledStudents
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(student => ({
        name: student.name,
        email: student.email,
        enrolledAt: student.createdAt
      }));

    const analytics = {
      course: {
        id: course._id,
        title: course.title,
        category: course.category,
        level: course.level,
        price: course.price,
        createdAt: course.createdAt,
        isPublished: course.isPublished,
        lessonsCount: course.content.length
      },
      metrics: {
        totalStudents,
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        revenue,
        totalViews,
        completionRate,
        engagementRate,
        conversionRate,
        courseAge,
        monthlyGrowth
      },
      weeklyStats,
      ratingDistribution,
      recentEnrollments,
      recentReviews: course.reviews
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(review => ({
          user: review.user.name,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt
        }))
    };

    res.json({ analytics });
  } catch (error) {
    console.error("Error fetching course analytics:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get instructor dashboard analytics (all courses overview)
router.get("/instructor/dashboard", requireAuth, requireRole("teacher", "admin"), async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .populate("enrolledStudents", "createdAt")
      .populate("reviews.user", "name");

    const totalCourses = courses.length;
    const publishedCourses = courses.filter(c => c.isPublished).length;
    const totalStudents = courses.reduce((sum, course) => sum + course.enrolledStudents.length, 0);
    const totalRevenue = courses.reduce((sum, course) => sum + (course.price * course.enrolledStudents.length), 0);
    const totalReviews = courses.reduce((sum, course) => sum + course.reviews.length, 0);
    
    const avgRating = courses.length > 0
      ? courses.reduce((sum, course) => sum + course.rating, 0) / courses.length
      : 0;

    // Get top performing courses
    const topCourses = courses
      .sort((a, b) => b.enrolledStudents.length - a.enrolledStudents.length)
      .slice(0, 5)
      .map(course => ({
        id: course._id,
        title: course.title,
        students: course.enrolledStudents.length,
        rating: course.rating,
        revenue: course.price * course.enrolledStudents.length
      }));

    const dashboard = {
      overview: {
        totalCourses,
        publishedCourses,
        totalStudents,
        totalRevenue,
        totalReviews,
        averageRating: Math.round(avgRating * 10) / 10
      },
      topCourses
    };

    res.json({ dashboard });
  } catch (error) {
    console.error("Error fetching instructor dashboard:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
