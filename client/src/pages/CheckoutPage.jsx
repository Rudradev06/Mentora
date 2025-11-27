import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { courseAPI } from "../services/api";
import { paymentAPI } from "../services/payment";
import { useAuth } from "../context/AuthContext";
import CheckoutForm from "../components/CheckoutForm";
import { ShoppingCart, Lock, ArrowLeft, CheckCircle } from "lucide-react";

// Initialize Stripe
const getStripeKey = () => {
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    console.error("VITE_STRIPE_PUBLISHABLE_KEY is not defined in environment variables");
  }
  return key;
};

const stripePromise = loadStripe(getStripeKey());

const CheckoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: `/checkout/${id}` } } });
      return;
    }

    if (user.role !== "student") {
      setError("Only students can purchase courses");
      setLoading(false);
      return;
    }

    fetchCourseAndInitiatePayment();
  }, [id, user, navigate]);

  const fetchCourseAndInitiatePayment = async () => {
    try {
      setLoading(true);
      
      // Fetch course details
      const courseResponse = await courseAPI.getCourse(id);
      const courseData = courseResponse.data.course;
      setCourse(courseData);

      // Check if already enrolled (handle both ObjectId and populated objects)
      const isEnrolled = courseData.enrolledStudents.some(studentId => {
        const id = typeof studentId === 'object' ? studentId._id || studentId.id : studentId;
        return id.toString() === user.id.toString();
      });

      if (isEnrolled) {
        setError("You are already enrolled in this course");
        setLoading(false);
        return;
      }

      // Check if course is free
      if (courseData.price === 0) {
        setError("This is a free course. You can enroll directly without payment.");
        setLoading(false);
        return;
      }

      // Create payment intent
      console.log("Creating payment intent for course:", id);
      const paymentResponse = await paymentAPI.createPaymentIntent(id);
      console.log("Payment intent created successfully");
      setClientSecret(paymentResponse.data.clientSecret);
    } catch (err) {
      console.error("Checkout error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to initialize checkout";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#2563eb',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#ef4444',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Checkout Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex space-x-4">
              <Link
                to={`/courses/${id}`}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back to Course
              </Link>
              <Link
                to="/courses"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={`/courses/${id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-6">
                <Lock className="w-5 h-5 text-green-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Secure Payment</h2>
              </div>

              {!clientSecret ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Initializing payment...</p>
                </div>
              ) : !getStripeKey() ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <p className="font-semibold mb-2">Payment Configuration Error</p>
                  <p className="text-sm">Stripe is not properly configured. Please contact support.</p>
                </div>
              ) : (
                <Elements options={options} stripe={stripePromise}>
                  <CheckoutForm 
                    courseId={id} 
                    onSuccess={() => {
                      navigate(`/courses/${id}/learn`, { 
                        state: { purchaseSuccess: true } 
                      });
                    }}
                  />
                </Elements>
              )}

              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Lock className="w-4 h-4 mr-1" />
                    <span>Secure SSL Encryption</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span>Money-back Guarantee</span>
                  </div>
                </div>
                <p className="text-center text-xs text-gray-400 mt-4">
                  Powered by Stripe - Your payment information is secure and encrypted
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Course Info */}
              <div className="mb-6">
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-2">By {course.instructor.name}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-4">⭐ {course.rating.toFixed(1)}</span>
                  <span>{course.content.length} lessons</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Course Price</span>
                  <span className="font-semibold">${course.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">$0.00</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${course.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* What's Included */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Lifetime access to course content</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{course.content.length} video lessons</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Downloadable resources</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Certificate of completion</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>30-day money-back guarantee</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
