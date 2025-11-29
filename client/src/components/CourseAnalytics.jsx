import { useState, useEffect } from "react";
import { analyticsAPI } from "../services/api";
import {
  TrendingUp,
  Users,
  Eye,
  Star,
  DollarSign,
  BookOpen,
  Clock,
  Award,
  BarChart3,
  PieChart,
  RefreshCw,
  Calendar,
  Target
} from "lucide-react";

const CourseAnalytics = ({ courseId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("30d");

  useEffect(() => {
    if (courseId) {
      fetchAnalytics();
    }
  }, [courseId, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await analyticsAPI.getCourseAnalytics(courseId);
      const data = response.data.analytics;
      
      // Transform the data for the component
      const analyticsData = {
        course: {
          ...data.course,
          content: Array(data.course.lessonsCount).fill({}), // For lessons count display
          reviews: data.recentReviews.map(review => ({
            user: { name: review.user },
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt
          }))
        },
        totalStudents: data.metrics.totalStudents,
        totalReviews: data.metrics.totalReviews,
        averageRating: data.metrics.averageRating,
        revenue: data.metrics.revenue,
        completionRate: data.metrics.completionRate,
        totalViews: data.metrics.totalViews,
        engagementRate: data.metrics.engagementRate,
        monthlyGrowth: data.metrics.monthlyGrowth,
        weeklyStats: data.weeklyStats,
        courseAge: data.metrics.courseAge,
        conversionRate: data.metrics.conversionRate,
        ratingDistribution: data.ratingDistribution,
        recentEnrollments: data.recentEnrollments
      };
      
      setAnalytics(analyticsData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch analytics");
      console.error("Analytics error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Analytics</h2>
          <p className="text-gray-600">Track your course performance and student engagement</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalStudents}</p>
                {analytics.monthlyGrowth > 0 && (
                  <p className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{analytics.monthlyGrowth}% this month
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${analytics.revenue.toLocaleString()}</p>
              <p className="text-sm text-gray-500">
                ${analytics.course.price} per student
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <Award className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.completionRate}%</p>
              <p className={`text-sm ${analytics.completionRate > 70 ? 'text-green-600' : 'text-orange-600'}`}>
                {analytics.completionRate > 70 ? 'Excellent' : 'Needs improvement'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <Star className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.averageRating.toFixed(1)}</p>
              <p className="text-sm text-gray-500">{analytics.totalReviews} reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Eye className="w-6 h-6 text-gray-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-lg font-bold text-gray-900">{analytics.totalViews.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Target className="w-6 h-6 text-gray-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-lg font-bold text-gray-900">{analytics.conversionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <BookOpen className="w-6 h-6 text-gray-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Lessons</p>
              <p className="text-lg font-bold text-gray-900">{analytics.course.content.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Calendar className="w-6 h-6 text-gray-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Course Age</p>
              <p className="text-lg font-bold text-gray-900">{analytics.courseAge} days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trends */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Enrollments</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analytics.weeklyStats.map((stat, index) => {
              const maxEnrollments = Math.max(...analytics.weeklyStats.map(s => s.enrollments), 1);
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{stat.week}</span>
                    <span className="text-sm text-gray-500">
                      ${stat.revenue.toLocaleString()} revenue
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-blue-600">Enrollments: {stat.enrollments}</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all" 
                        style={{ width: `${(stat.enrollments / maxEnrollments) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Rating Distribution</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          {analytics.totalReviews > 0 ? (
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = analytics.ratingDistribution?.[rating] || 0;
                const percentage = analytics.totalReviews > 0 
                  ? (count / analytics.totalReviews) * 100 
                  : 0;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm font-medium text-gray-700">{rating}</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {count}
                    </span>
                    <span className="text-xs text-gray-500 w-10 text-right">
                      ({Math.round(percentage)}%)
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Star className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No reviews yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Course Performance Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{analytics.engagementRate}%</p>
            <p className="text-sm text-gray-600">Engagement Rate</p>
            <p className="text-xs text-gray-500 mt-1">
              {analytics.totalReviews} of {analytics.totalStudents} students reviewed
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{analytics.conversionRate}%</p>
            <p className="text-sm text-gray-600">Conversion Rate</p>
            <p className="text-xs text-gray-500 mt-1">
              {analytics.totalStudents} of {analytics.totalViews} viewers enrolled
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              ${(analytics.revenue / Math.max(analytics.totalStudents, 1)).toFixed(0)}
            </p>
            <p className="text-sm text-gray-600">Avg Revenue per Student</p>
            <p className="text-xs text-gray-500 mt-1">
              ${analytics.revenue.toLocaleString()} total
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enrollments */}
        {analytics.recentEnrollments && analytics.recentEnrollments.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Enrollments</h3>
            <div className="space-y-3">
              {analytics.recentEnrollments.slice(0, 5).map((enrollment, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{enrollment.name}</p>
                    <p className="text-xs text-gray-500">{enrollment.email}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Reviews */}
        {analytics.course.reviews.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reviews</h3>
            <div className="space-y-4">
              {analytics.course.reviews.slice(0, 5).map((review, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {review.user.name}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseAnalytics;