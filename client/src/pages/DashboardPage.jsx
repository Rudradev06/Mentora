import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { courseAPI, statsAPI } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import CourseManagement from "../components/CourseManagement";
import { 
  BookOpen, 
  Play, 
  Search, 
  LogOut, 
  Users, 
  BarChart3, 
  Settings,
  Star,
  Clock,
  CheckCircle,
  TrendingUp,
  Award
} from "lucide-react";

const AdminDashboard = () => {
  const [platformStats, setPlatformStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlatformStats();
  }, []);

  const fetchPlatformStats = async () => {
    try {
      const response = await statsAPI.getPlatformStats();
      setPlatformStats(response.data.stats);
    } catch (error) {
      console.error("Failed to fetch platform stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2>
      
      {/* Platform Stats */}
      {platformStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{platformStats.users.total}</p>
                <p className="text-xs text-gray-500">
                  {platformStats.users.students} students, {platformStats.users.teachers} teachers
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{platformStats.courses.total}</p>
                <p className="text-xs text-gray-500">
                  {platformStats.courses.totalEnrollments} total enrollments
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Star className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{platformStats.courses.averageRating.toFixed(1)}</p>
                <p className="text-xs text-gray-500">
                  {platformStats.platform.satisfaction}% satisfaction
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{platformStats.platform.successRate}%</p>
                <p className="text-xs text-gray-500">Platform performance</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <Users className="w-8 h-8 text-purple-600" />
            <h3 className="text-lg font-semibold ml-3">Manage Users</h3>
          </div>
          <p className="text-gray-600 mb-6">View and manage all users</p>
          <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors w-full justify-center">
            <Users className="w-4 h-4 mr-2" />
            View Users
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <BarChart3 className="w-8 h-8 text-indigo-600" />
            <h3 className="text-lg font-semibold ml-3">Platform Analytics</h3>
          </div>
          <p className="text-gray-600 mb-6">View detailed platform statistics</p>
          <button 
            onClick={fetchPlatformStats}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full justify-center"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Refresh Stats
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <Settings className="w-8 h-8 text-gray-600" />
            <h3 className="text-lg font-semibold ml-3">System Settings</h3>
          </div>
          <p className="text-gray-600 mb-6">Configure system settings</p>
          <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors w-full justify-center">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Category Breakdown */}
      {platformStats && platformStats.courses.categories && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Course Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(platformStats.courses.categories).map(([category, count]) => (
              <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-600 capitalize">{category}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [createdCourses, setCreatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      if (user.role === "student") {
        const response = await courseAPI.getEnrolledCourses();
        setEnrolledCourses(response.data.courses);
      } else if (user.role === "teacher" || user.role === "admin") {
        const response = await courseAPI.getCreatedCourses();
        setCreatedCourses(response.data.courses);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null;

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-600 capitalize">{user.role} Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/courses"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Search className="w-4 h-4 mr-2" />
                Browse Courses
              </Link>
              {user.role === "student" && (
                <Link
                  to="/my-courses"
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  My Courses
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Student Dashboard */}
        {user.role === "student" && (
          <div>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
                    <p className="text-2xl font-bold text-gray-900">{enrolledCourses.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {enrolledCourses.filter(c => Math.random() > 0.7).length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Hours Learned</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {enrolledCourses.length * Math.floor(Math.random() * 10 + 5)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">My Enrolled Courses</h2>
                <Link
                  to="/my-courses"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All →
                </Link>
              </div>
              
              {enrolledCourses.length === 0 ? (
                <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No courses enrolled yet</h3>
                  <p className="text-gray-500 mb-6">Start learning by browsing our course catalog</p>
                  <Link
                    to="/courses"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Browse Courses
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledCourses.slice(0, 6).map((course) => (
                    <div key={course._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                      <div className="relative">
                        <img
                          src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop"}
                          alt={course.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-4 right-4">
                          <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                            {Math.floor(Math.random() * 100)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded capitalize">
                            {course.category}
                          </span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium ml-1">{course.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{course.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">By {course.instructor.name}</p>
                        
                        <div className="flex space-x-2">
                          <Link
                            to={`/courses/${course._id}`}
                            className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-center text-sm"
                          >
                            View Details
                          </Link>
                          <Link
                            to={`/courses/${course._id}/learn`}
                            className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Continue
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Teacher Dashboard */}
        {(user.role === "teacher" || user.role === "admin") && (
          <CourseManagement />
        )}

        {/* Admin Dashboard */}
        {user.role === "admin" && (
          <AdminDashboard />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
