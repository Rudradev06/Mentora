import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: { type: Number, required: true, default: 0 },
    duration: { type: String, required: true }, // e.g., "4 weeks", "2 months"
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    category: { type: String, required: true },
    thumbnail: { type: String }, // URL to course image
    content: [
      {
        title: String,
        description: String,
        videoUrl: String,
        materials: [String], // URLs to downloadable materials
        duration: String, // Individual lesson duration
        order: { type: Number, default: 0 },
      },
    ],
    prerequisites: [String], // Course prerequisites
    learningObjectives: [String], // What students will learn
    tags: [String], // Course tags for better searchability
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isPublished: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    // Analytics fields
    totalViews: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    // Status tracking
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft"
    },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);