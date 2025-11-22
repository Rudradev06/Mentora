import { useState, useEffect } from "react";
import { courseAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, Play } from "lucide-react";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrollingCourses, setEnrollingCourses] = useState(new Set());
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    level: "",
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCourses();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [filters.search, filters.category, filters.level]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getAllCourses(filters);
      setCourses(response.data.courses);
    } catch (err) {
      setError("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId, coursePrice) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "student") {
      alert("Only students can enroll in courses");
      return;
    }

    // For free courses, enroll directly
    if (coursePrice === 0) {
      try {
        setEnrollingCourses(prev => new Set([...prev, courseId]));
        await courseAPI.enrollInCourse(courseId);
        alert("Successfully enrolled in course!");
        // Refresh courses to update enrollment status
        fetchCourses();
        // Redirect to learning page after a short delay
        setTimeout(() => {
          navigate(`/courses/${courseId}/learn`);
        }, 1000);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to enroll");
      } finally {
        setEnrollingCourses(prev => {
          const newSet = new Set(prev);
          newSet.delete(courseId);
          return newSet;
        });
      }
    } else {
      // For paid courses, redirect to checkout
      navigate(`/checkout/${courseId}`);
    }
  };

  const isEnrolled = (course) => {
    return user && course.enrolledStudents.some(studentId => studentId.toString() === user.id.toString());
  };

  const isInstructor = (course) => {
    return user && course.instructor._id.toString() === user.id.toString();
  };

  if (loading) return <div className="p-8 text-center">Loading courses...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Browse Courses</h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search courses..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="programming">Programming</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
              <option value="marketing">Marketing</option>
            </select>
            <select
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No courses found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  {/* Enrollment Status Badge */}
                  {isEnrolled(course) && (
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Enrolled
                      </span>
                    </div>
                  )}
                  {isInstructor(course) && (
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Your Course
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">By {course.instructor.name}</span>
                    <span className="text-lg font-bold text-blue-600">
                      ${course.price === 0 ? "Free" : course.price}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {course.level}
                    </span>
                    <span className="text-sm text-gray-500">{course.duration}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-gray-600 ml-1">
                        {course.rating.toFixed(1)} ({course.reviews.length})
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/courses/${course._id}`}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        View Details
                      </Link>
                      
                      {/* Enrolled Student */}
                      {isEnrolled(course) && (
                        <Link
                          to={`/courses/${course._id}/learn`}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Continue
                        </Link>
                      )}
                      
                      {/* Instructor */}
                      {isInstructor(course) && (
                        <Link
                          to={`/courses/${course._id}/learn`}
                          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Preview
                        </Link>
                      )}
                      
                      {/* Not Enrolled Student */}
                      {user && user.role === "student" && !isEnrolled(course) && (
                        <button
                          onClick={() => handleEnroll(course._id, course.price)}
                          disabled={enrollingCourses.has(course._id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                        >
                          {enrollingCourses.has(course._id) 
                            ? "Processing..." 
                            : course.price === 0 
                              ? "Enroll Free" 
                              : "Buy Now"}
                        </button>
                      )}
                      
                      {/* Not Logged In */}
                      {!user && (
                        <Link
                          to="/login"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Login to Enroll
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
