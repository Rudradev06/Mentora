import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.model.js";
import Course from "../models/Course.model.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    console.log("Cleared existing data");

    // Create admin user
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    });

    // Create teacher users
    const teacher1 = await User.create({
      name: "John Smith",
      email: "john@example.com",
      password: "password123",
      role: "teacher",
    });

    const teacher2 = await User.create({
      name: "Sarah Johnson",
      email: "sarah@example.com",
      password: "password123",
      role: "teacher",
    });

    // Create student users
    const student1 = await User.create({
      name: "Alice Brown",
      email: "alice@example.com",
      password: "password123",
      role: "student",
    });

    const student2 = await User.create({
      name: "Bob Wilson",
      email: "bob@example.com",
      password: "password123",
      role: "student",
    });

    // Create sample courses
    const courses = [
      {
        title: "Complete React Development Course",
        description: "Learn React from basics to advanced concepts including hooks, context, and state management.",
        instructor: teacher1._id,
        price: 99,
        duration: "8 weeks",
        level: "intermediate",
        category: "programming",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500",
        isPublished: true,
        content: [
          {
            title: "Introduction to React",
            description: "Understanding React fundamentals and JSX",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            materials: ["https://example.com/react-basics.pdf"],
            duration: "15 min",
          },
          {
            title: "Components and Props",
            description: "Creating reusable components and passing data",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            materials: ["https://example.com/components-guide.pdf"],
            duration: "12 min",
          },
          {
            title: "State and Lifecycle",
            description: "Managing component state and lifecycle methods",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            materials: ["https://example.com/state-guide.pdf"],
            duration: "18 min",
          },
        ],
        enrolledStudents: [student1._id],
        reviews: [
          {
            user: student1._id,
            rating: 5,
            comment: "Excellent course! Very well explained.",
            createdAt: new Date(),
          },
        ],
      },
      {
        title: "Node.js Backend Development",
        description: "Build scalable backend applications with Node.js, Express, and MongoDB.",
        instructor: teacher1._id,
        price: 79,
        duration: "6 weeks",
        level: "intermediate",
        category: "programming",
        thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500",
        isPublished: true,
        content: [
          {
            title: "Setting up Node.js Environment",
            description: "Installing Node.js and setting up your first server",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            materials: ["https://example.com/nodejs-setup.pdf"],
            duration: "20 min",
          },
          {
            title: "Express.js Fundamentals",
            description: "Building REST APIs with Express.js",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
            materials: ["https://example.com/express-guide.pdf"],
            duration: "25 min",
          },
        ],
        enrolledStudents: [student2._id],
        reviews: [
          {
            user: student2._id,
            rating: 4,
            comment: "Great content, could use more examples.",
            createdAt: new Date(),
          },
        ],
      },
      {
        title: "UI/UX Design Fundamentals",
        description: "Learn the principles of user interface and user experience design.",
        instructor: teacher2._id,
        price: 0,
        duration: "4 weeks",
        level: "beginner",
        category: "design",
        thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500",
        isPublished: true,
        content: [
          {
            title: "Design Principles",
            description: "Understanding color theory, typography, and layout",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
            materials: ["https://example.com/design-principles.pdf"],
            duration: "22 min",
          },
          {
            title: "User Research Methods",
            description: "Conducting effective user research and usability testing",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
            materials: ["https://example.com/user-research.pdf"],
            duration: "16 min",
          },
        ],
        enrolledStudents: [student1._id, student2._id],
        reviews: [],
      },
      {
        title: "Digital Marketing Strategy",
        description: "Master digital marketing techniques including SEO, social media, and content marketing.",
        instructor: teacher2._id,
        price: 149,
        duration: "10 weeks",
        level: "intermediate",
        category: "marketing",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500",
        isPublished: true,
        content: [
          {
            title: "Introduction to Digital Marketing",
            description: "Overview of digital marketing landscape",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            materials: ["https://example.com/marketing-intro.pdf"],
            duration: "14 min",
          },
          {
            title: "SEO Fundamentals",
            description: "Search engine optimization basics and best practices",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
            materials: ["https://example.com/seo-guide.pdf"],
            duration: "19 min",
          },
        ],
        enrolledStudents: [],
        reviews: [],
      },
      {
        title: "Python for Beginners",
        description: "Start your programming journey with Python. No prior experience required.",
        instructor: teacher1._id,
        price: 59,
        duration: "5 weeks",
        level: "beginner",
        category: "programming",
        thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500",
        isPublished: true,
        content: [
          {
            title: "Python Basics",
            description: "Variables, data types, and basic operations",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            materials: ["https://example.com/python-basics.pdf"],
            duration: "17 min",
          },
          {
            title: "Control Structures",
            description: "If statements, loops, and conditional logic",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
            materials: ["https://example.com/control-structures.pdf"],
            duration: "21 min",
          },
        ],
        enrolledStudents: [student1._id],
        reviews: [],
      },
    ];

    // Create courses and calculate ratings
    for (const courseData of courses) {
      const course = await Course.create(courseData);

      // Calculate average rating
      if (course.reviews.length > 0) {
        const totalRating = course.reviews.reduce((sum, review) => sum + review.rating, 0);
        course.rating = totalRating / course.reviews.length;
        await course.save();
      }
    }

    console.log("Sample data seeded successfully!");
    console.log("\nSample accounts:");
    console.log("Admin: admin@example.com / password123");
    console.log("Teacher 1: john@example.com / password123");
    console.log("Teacher 2: sarah@example.com / password123");
    console.log("Student 1: alice@example.com / password123");
    console.log("Student 2: bob@example.com / password123");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();