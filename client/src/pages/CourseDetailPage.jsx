import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { courseAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import CourseAnalytics from "../components/CourseAnalytics";
import { Edit, BarChart3, Settings, Users, BookOpen } from "lucide-react";

const StudentsList = ({ students, course }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // In a real app, you'd fetch actual student data
  const mockStudentData = students.map((studentId, index) => ({
    id: studentId,
    name: `Student ${index + 1}`,
    email: `student${index + 1}@example.com`,
    enrolledAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    progress: Math.floor(Math.random() * 100),
    lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    completedLessons: Math.floor(Math.random() * course.content.length),
    avatar: `https://ui-avatars.com/api/?name=Student+${index + 1}&background=random`
  }));

  const filteredStudents = mockStudentData
    .filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.enrolledAt) - new Date(a.enrolledAt);
        case "oldest":
          return new Date(a.enrolledAt) - new Date(b.enrolledAt);
        case "progress":
          return b.progress - a.progress;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Enrolled Students ({students.length})</h3>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="progress">By Progress</option>
            <option value="name">By Name</option>
          </select>
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {students.length === 0 ? "No students enrolled yet." : "No students match your search."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrolled
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={student.avatar}
                          alt={student.name}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3 max-w-20">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{student.progress}%</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {student.completedLessons}/{course.content.length} lessons
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.enrolledAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.lastActive.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const CourseOverview = ({ course }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  const handleDeleteCourse = async () => {
    try {
      await courseAPI.deleteCourse(course._id);
      alert("Course deleted successfully");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete course");
    }
  };

  const handleTogglePublish = async () => {
    try {
      await courseAPI.updateCourse(course._id, { isPublished: !course.isPublished });
      alert(`Course ${!course.isPublished ? 'published' : 'unpublished'} successfully`);
      window.location.reload(); // Refresh to show updated status
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update course");
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Course Management</h3>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to={`/courses/${course._id}/edit`}
          className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Edit className="w-6 h-6 text-blue-600 mr-3" />
          <div>
            <h4 className="font-medium text-blue-900">Edit Course</h4>
            <p className="text-sm text-blue-700">Update content and settings</p>
          </div>
        </Link>

        <button
          onClick={handleTogglePublish}
          className={`flex items-center p-4 border rounded-lg hover:opacity-80 transition-colors ${course.isPublished
            ? 'bg-orange-50 border-orange-200'
            : 'bg-green-50 border-green-200'
            }`}
        >
          <Settings className={`w-6 h-6 mr-3 ${course.isPublished ? 'text-orange-600' : 'text-green-600'
            }`} />
          <div>
            <h4 className={`font-medium ${course.isPublished ? 'text-orange-900' : 'text-green-900'
              }`}>
              {course.isPublished ? 'Unpublish' : 'Publish'} Course
            </h4>
            <p className={`text-sm ${course.isPublished ? 'text-orange-700' : 'text-green-700'
              }`}>
              {course.isPublished ? 'Hide from students' : 'Make visible to students'}
            </p>
          </div>
        </button>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
        >
          <Users className="w-6 h-6 text-red-600 mr-3" />
          <div>
            <h4 className="font-medium text-red-900">Delete Course</h4>
            <p className="text-sm text-red-700">Permanently remove course</p>
          </div>
        </button>
      </div>

      {/* Course Statistics */}
      <div className="bg-white border rounded-lg p-6">
        <h4 className="font-medium mb-4">Course Statistics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{course.enrolledStudents.length}</div>
            <div className="text-sm text-gray-500">Enrolled Students</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{course.content.length}</div>
            <div className="text-sm text-gray-500">Lessons</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{course.reviews.length}</div>
            <div className="text-sm text-gray-500">Reviews</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{course.rating.toFixed(1)}</div>
            <div className="text-sm text-gray-500">Average Rating</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border rounded-lg p-6">
        <h4 className="font-medium mb-4">Recent Activity</h4>
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <span className="text-gray-600">Course created on {new Date(course.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <span className="text-gray-600">Last updated on {new Date(course.updatedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
            <span className="text-gray-600">
              Status: {course.isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Course</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{course.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCourse}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getCourse(id);
      setCourse(response.data.course);
    } catch (err) {
      setError("Failed to fetch course details");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "student") {
      alert("Only students can enroll in courses");
      return;
    }

    // For free courses, enroll directly
    if (course.price === 0) {
      try {
        setEnrolling(true);
        await courseAPI.enrollInCourse(id);
        alert("Successfully enrolled in course!");
        fetchCourse(); // Refresh course data
        // Automatically redirect to learning page after enrollment
        setTimeout(() => {
          navigate(`/courses/${id}/learn`);
        }, 1000);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to enroll");
      } finally {
        setEnrolling(false);
      }
    } else {
      // For paid courses, redirect to checkout
      navigate(`/checkout/${id}`);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading course...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!course) return <div className="p-8 text-center">Course not found</div>;

  const isEnrolled = user && course.enrolledStudents.some(studentId => studentId.toString() === user.id.toString());
  const isInstructor = user && course.instructor._id.toString() === user.id.toString();
  const canManage = isInstructor || (user && user.role === "admin");

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-64 object-cover"
            />
          )}
          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {course.title}
                </h1>
                <p className="text-gray-600 text-lg">{course.description}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  ${course.price === 0 ? "Free" : course.price}
                </div>
                {user && user.role === "student" && !isEnrolled && (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
                  >
                    {enrolling 
                      ? "Processing..." 
                      : course.price === 0 
                        ? "Enroll Free" 
                        : `Buy Now - $${course.price}`}
                  </button>
                )}
                {isEnrolled && (
                  <div className="space-y-2">
                    <div className="px-6 py-2 bg-green-100 text-green-800 rounded-lg text-center text-sm">
                      ✓ Enrolled
                    </div>
                    <Link
                      to={`/courses/${course._id}/learn`}
                      className="block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                    >
                      Continue Learning
                    </Link>
                  </div>
                )}
                {isInstructor && (
                  <div className="space-y-2">
                    <div className="px-6 py-2 bg-purple-100 text-purple-800 rounded-lg text-center text-sm">
                      Your Course
                    </div>
                    <Link
                      to={`/courses/${course._id}/learn`}
                      className="block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center"
                    >
                      Preview Course
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Course Info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Instructor</div>
                <div className="font-semibold">{course.instructor.name}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Duration</div>
                <div className="font-semibold">{course.duration}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Level</div>
                <div className="font-semibold capitalize">{course.level}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Students</div>
                <div className="font-semibold">{course.enrolledStudents.length}</div>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                <span className="text-yellow-500 text-xl">★</span>
                <span className="text-lg font-semibold ml-1">
                  {course.rating.toFixed(1)}
                </span>
                <span className="text-gray-500 ml-2">
                  ({course.reviews.length} reviews)
                </span>
              </div>
            </div>

            {/* Instructor Tools */}
            {canManage && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-blue-900 mb-3">Instructor Tools</h3>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/courses/${course._id}/edit`}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit Course
                  </Link>
                  <button
                    onClick={() => setActiveTab("analytics")}
                    className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                  >
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Analytics
                  </button>
                  <button
                    onClick={() => setActiveTab("students")}
                    className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
                  >
                    <Users className="w-4 h-4 mr-1" />
                    Students ({course.enrolledStudents.length})
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs for Instructors */}
        {canManage && (
          <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-8">
                {[
                  { id: "overview", label: "Overview", icon: Settings },
                  { id: "analytics", label: "Analytics", icon: BarChart3 },
                  { id: "students", label: "Students", icon: Users },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-8">
              {activeTab === "analytics" && <CourseAnalytics courseId={course._id} />}
              {activeTab === "students" && <StudentsList students={course.enrolledStudents} course={course} />}
              {activeTab === "overview" && <CourseOverview course={course} />}
            </div>
          </div>
        )}

        {/* Course Content Preview */}
        {(isEnrolled || isInstructor) && course.content && course.content.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Course Content</h2>
              <Link
                to={`/courses/${course._id}/learn`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Learning
              </Link>
            </div>
            <div className="space-y-4">
              {course.content.map((lesson, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{lesson.title}</h3>
                      <p className="text-gray-600 mb-3">{lesson.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Lesson {index + 1}</span>
                        {lesson.duration && <span>{lesson.duration}</span>}
                        {lesson.videoUrl && <span>📹 Video</span>}
                        {lesson.materials && lesson.materials.length > 0 && (
                          <span>📎 {lesson.materials.length} Materials</span>
                        )}
                      </div>
                    </div>
                    <Link
                      to={`/courses/${course._id}/learn`}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Course Content Locked Message */}
        {!isEnrolled && !isInstructor && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
              <p className="text-gray-600 mb-6">
                Enroll in this course to access {course.content?.length || 0} lessons and start learning.
              </p>
              {user && user.role === "student" && (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                >
                  {enrolling 
                    ? "Processing..." 
                    : course.price === 0 
                      ? "Enroll Free" 
                      : `Buy Now - $${course.price}`}
                </button>
              )}
              {!user && (
                <Link
                  to="/login"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Login to Enroll
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
          {course.reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            <div className="space-y-6">
              {course.reviews.map((review, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <div className="flex items-center mb-2">
                    <div className="font-semibold">{review.user.name}</div>
                    <div className="flex items-center ml-4">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${i < review.rating ? "text-yellow-500" : "text-gray-300"
                            }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 ml-4">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;