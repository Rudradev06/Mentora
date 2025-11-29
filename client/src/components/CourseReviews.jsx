import { useState } from "react";
import { Star, ThumbsUp, Flag, Edit2, Trash2, Check, X } from "lucide-react";

const CourseReviews = ({ course, user, isEnrolled, onReviewSubmit, onReviewUpdate, onReviewDelete }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [sortBy, setSortBy] = useState("recent");
  const [filterRating, setFilterRating] = useState("all");

  // Check if user has already reviewed
  const userReview = course.reviews.find(
    (review) => review.user._id === user?.id || review.user === user?.id
  );

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isEnrolled && !editingReview) {
      alert("You must be enrolled in this course to write a review");
      return;
    }
    
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    if (comment.trim().length < 10) {
      alert("Please write at least 10 characters");
      return;
    }

    setSubmitting(true);
    try {
      if (editingReview) {
        await onReviewUpdate(editingReview._id, { rating, comment });
      } else {
        await onReviewSubmit({ rating, comment });
      }
      
      // Reset form
      setRating(0);
      setComment("");
      setShowReviewForm(false);
      setEditingReview(null);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to submit review";
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment);
    setShowReviewForm(true);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setRating(0);
    setComment("");
    setShowReviewForm(false);
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await onReviewDelete(reviewId);
      } catch (error) {
        alert(error.message || "Failed to delete review");
      }
    }
  };

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: course.reviews.filter((r) => r.rating === star).length,
    percentage: course.reviews.length > 0
      ? (course.reviews.filter((r) => r.rating === star).length / course.reviews.length) * 100
      : 0,
  }));

  // Filter and sort reviews
  let filteredReviews = [...course.reviews];
  
  if (filterRating !== "all") {
    filteredReviews = filteredReviews.filter((r) => r.rating === parseInt(filterRating));
  }

  filteredReviews.sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h2 className="text-2xl font-semibold mb-4 md:mb-0">Student Reviews</h2>
        
        {user && isEnrolled && !userReview && !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Write a Review
          </button>
        )}
        
        {user && !isEnrolled && user.role === "student" && !userReview && (
          <div className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">
            Enroll in this course to write a review
          </div>
        )}
      </div>

      {/* Rating Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-200">
        {/* Average Rating */}
        <div className="text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div>
              <div className="text-5xl font-bold text-gray-900">
                {course.rating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center md:justify-start mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.round(course.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {course.reviews.length} {course.reviews.length === 1 ? "review" : "reviews"}
              </div>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {ratingDistribution.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 w-16">
                <span className="text-sm font-medium">{star}</span>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">
            {editingReview ? "Edit Your Review" : "Write Your Review"}
          </h3>
          <form onSubmit={handleSubmitReview}>
            {/* Star Rating */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating *
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-3 text-sm text-gray-600">
                    {rating === 1 && "Poor"}
                    {rating === 2 && "Fair"}
                    {rating === 3 && "Good"}
                    {rating === 4 && "Very Good"}
                    {rating === 5 && "Excellent"}
                  </span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review * (minimum 10 characters)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                placeholder="Share your experience with this course..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                {comment.length} characters
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button
                type="submit"
                disabled={submitting || rating === 0 || comment.trim().length < 10}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{editingReview ? "Update Review" : "Submit Review"}</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex items-center space-x-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* User's Existing Review */}
      {userReview && !showReviewForm && (
        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-semibold text-gray-900">Your Review</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < userReview.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{userReview.comment}</p>
              <div className="text-xs text-gray-500 mt-2">
                Posted on {new Date(userReview.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleEditReview(userReview)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                title="Edit review"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteReview(userReview._id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                title="Delete review"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Sort */}
      {course.reviews.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter:</label>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-12">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {course.reviews.length === 0
              ? "No reviews yet. Be the first to review this course!"
              : "No reviews match your filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <div
              key={review._id}
              className="pb-6 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {review.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-semibold text-gray-900">
                        {review.user.name || "Anonymous"}
                      </span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>

                    {/* Review Actions */}
                    <div className="flex items-center space-x-4 mt-3">
                      <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span>Helpful</span>
                      </button>
                      <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600 transition-colors">
                        <Flag className="w-4 h-4" />
                        <span>Report</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseReviews;
