import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  Users,
  Star,
  BookOpen,
  Play,
  Heart,
  Filter,
  Search,
} from "lucide-react";
import { courseAPI, statsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const CourseShowcase = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState(new Set());
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrollingCourses, setEnrollingCourses] = useState(new Set());
  
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Try to get trending courses first, fallback to regular courses
      let response;
      try {
        response = await statsAPI.getTrendingCourses();
      } catch {
        response = await courseAPI.getAllCourses({ limit: 6 });
      }
      setCourses(response.data.courses);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "All",
    "programming",
    "design", 
    "business",
    "marketing",
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.instructor?.name && course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (courseId) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(courseId)) {
        newFavorites.delete(courseId);
      } else {
        newFavorites.add(courseId);
      }
      return newFavorites;
    });
  };

  const handleEnroll = async (courseId) => {
    if (!user) {
      if (window.confirm("Please login to enroll in courses. Would you like to go to the login page?")) {
        window.location.href = "/login";
      }
      return;
    }

    if (user.role !== "student") {
      alert("Only students can enroll in courses");
      return;
    }

    if (enrollingCourses.has(courseId)) {
      return; // Already enrolling
    }

    try {
      setEnrollingCourses(prev => new Set(prev).add(courseId));
      await courseAPI.enrollInCourse(courseId);
      alert("Successfully enrolled in course!");
      fetchCourses(); // Refresh courses
    } catch (err) {
      console.error("Enrollment error:", err);
      const errorMessage = err.response?.data?.message || "Failed to enroll";
      alert(errorMessage);
      
      // If it's an auth error, redirect to login
      if (err.response?.status === 401) {
        window.location.href = "/login";
      }
    } finally {
      setEnrollingCourses(prev => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
    }
  };

  const CourseCard = ({ course }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <img
          src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop"}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {course.enrolledStudents?.length > 50 && (
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              POPULAR
            </span>
          )}
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
              course.level === "beginner"
                ? "bg-green-100 text-green-700"
                : course.level === "intermediate"
                ? "bg-blue-100 text-blue-700"
                : "bg-purple-100 text-purple-700"
            }`}
          >
            {course.level}
          </span>
        </div>
        <button
          onClick={() => toggleFavorite(course._id)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart
            className={`w-4 h-4 ${
              favorites.has(course._id)
                ? "fill-red-500 text-red-500"
                : "text-gray-600"
            }`}
          />
        </button>
        <Link to={`/courses/${course._id}`}>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full capitalize">
            {course.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{course.rating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">({course.reviews?.length || 0})</span>
          </div>
        </div>

        <Link to={`/courses/${course._id}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {course.description}
        </p>

        <p className="text-sm text-gray-700 mb-4">
          by <span className="font-semibold">{course.instructor?.name || "Unknown Instructor"}</span>
        </p>

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{course.enrolledStudents?.length || 0} students</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{course.content?.length || 0} lessons</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              ${course.price === 0 ? "Free" : course.price}
            </span>
            {course.price > 0 && (
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Premium
              </span>
            )}
          </div>
        </div>

        {user && user.role === "student" ? (
          course.enrolledStudents?.includes(user.id) ? (
            <Link 
              to={`/courses/${course._id}`}
              className="block w-full mt-4 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-all duration-300 text-center"
            >
              ✓ Enrolled - View Course
            </Link>
          ) : (
            <button 
              onClick={() => handleEnroll(course._id)}
              disabled={enrollingCourses.has(course._id)}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {enrollingCourses.has(course._id) ? "Enrolling..." : "Enroll Now"}
            </button>
          )
        ) : (
          <Link 
            to={`/courses/${course._id}`}
            className="block w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 text-center"
          >
            View Course
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Trending Courses
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the most popular courses chosen by thousands of learners. 
            Transform your career with our expertly designed content.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search courses, instructors, or topics..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-8">
          <p className="text-lg text-gray-700">
            Showing{" "}
            <span className="font-semibold">{filteredCourses.length}</span>{" "}
            courses
            {selectedCategory !== "All" && (
              <span>
                {" "}
                in <span className="font-semibold">{selectedCategory}</span>
              </span>
            )}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Failed to load courses
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchCourses}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Course Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredCourses.length === 0 && courses.length > 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* View All Courses Button */}
        {!loading && !error && courses.length > 0 && (
          <div className="text-center mt-12">
            <Link 
              to="/courses"
              className="bg-white border-2 border-blue-600 text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              View All Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseShowcase;
