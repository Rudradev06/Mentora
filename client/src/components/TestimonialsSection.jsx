import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, Quote } from "lucide-react";
import { courseAPI } from "../services/api";

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getAllCourses();
      const courses = response.data.courses;
      
      // Extract reviews from courses and format as testimonials
      const allReviews = [];
      courses.forEach(course => {
        if (course.reviews && course.reviews.length > 0) {
          course.reviews.forEach(review => {
            if (review.rating >= 4 && review.comment && review.user && review.user.name) { // Only show good reviews with comments and valid user
              allReviews.push({
                id: review._id || Math.random(),
                name: review.user.name,
                rating: review.rating,
                comment: review.comment,
                course: course.title,
                date: review.createdAt
              });
            }
          });
        }
      });
      
      // Sort by rating and date, take top 6
      const topReviews = allReviews
        .sort((a, b) => b.rating - a.rating || new Date(b.date) - new Date(a.date))
        .slice(0, 6);
      
      setTestimonials(topReviews);
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
      // Fallback testimonials
      setTestimonials([
        {
          id: 1,
          name: "Sarah Johnson",
          rating: 5,
          comment: "Mentora has completely transformed my learning experience. The courses are well-structured and the instructors are amazing!",
          course: "React Development",
          date: new Date()
        },
        {
          id: 2,
          name: "Michael Chen",
          rating: 5,
          comment: "I've tried many online learning platforms, but this one stands out. The quality of content and community support is exceptional.",
          course: "Data Science",
          date: new Date()
        },
        {
          id: 3,
          name: "Emily Rodriguez",
          rating: 4,
          comment: "Great platform for professional development. I was able to advance my career thanks to the skills I learned here.",
          course: "Digital Marketing",
          date: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null; // Don't show section if no testimonials
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Students Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our community of learners 
            has to say about their experience.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote Icon */}
              <div className="flex items-center justify-between mb-4">
                <Quote className="w-8 h-8 text-blue-600 opacity-50" />
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Comment */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.comment}"
              </p>

              {/* User Info */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name || "Anonymous"}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Student in {testimonial.course}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {(testimonial.name && testimonial.name.charAt(0).toUpperCase()) || "?"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Ready to join thousands of successful learners?
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            Start Learning Today
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;