import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Loader2, Play, Download } from "lucide-react";
import { courseAPI } from "../services/api";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");

  const courseId = searchParams.get("courseId");
  const paymentIntent = searchParams.get("payment_intent");

  useEffect(() => {
    if (!courseId || !paymentIntent) {
      setError("Invalid payment confirmation");
      setLoading(false);
      return;
    }

    // Fetch course details
    fetchCourse();
  }, [courseId, paymentIntent]);

  const fetchCourse = async () => {
    try {
      const response = await courseAPI.getCourse(courseId);
      setCourse(response.data.course);
    } catch (err) {
      setError("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h2>
            <p className="text-gray-600 mb-6">{error || "Something went wrong"}</p>
            <Link
              to="/courses"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12">
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-12 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-green-100">
              You're now enrolled in the course
            </p>
          </div>

          {/* Course Details */}
          <div className="p-8">
            <div className="flex items-start space-x-4 mb-8">
              {course.thumbnail && (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-24 h-24 object-cover rounded-lg shadow-md"
                />
              )}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {course.title}
                </h2>
                <p className="text-gray-600 mb-2">By {course.instructor.name}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-4">⭐ {course.rating.toFixed(1)}</span>
                  <span>{course.content.length} lessons</span>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>A confirmation email has been sent to your inbox</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>You now have lifetime access to all course materials</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Start learning at your own pace</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={`/courses/${courseId}/learn`}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Learning Now
              </Link>
              <Link
                to="/my-courses"
                className="flex-1 flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download className="w-5 h-5 mr-2" />
                View My Courses
              </Link>
            </div>

            {/* Receipt Link */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Payment ID: <span className="font-mono text-gray-900">{paymentIntent}</span>
              </p>
              <Link
                to="/payment-history"
                className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
              >
                View Payment History →
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? <Link to="/support" className="text-blue-600 hover:text-blue-700">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
