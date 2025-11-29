import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Don't redirect here, let the components handle it
      // This prevents issues with React Router
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getProfile: () => api.get("/auth/me"),
};

// Course API
export const courseAPI = {
  getAllCourses: (params = {}) => api.get("/courses", { params }),
  getCourse: (id) => api.get(`/courses/${id}`),
  createCourse: (courseData) => api.post("/courses", courseData),
  updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  enrollInCourse: (id) => api.post(`/courses/${id}/enroll`),
  getEnrolledCourses: () => api.get("/courses/enrolled/my-courses"),
  getCreatedCourses: () => api.get("/courses/my-courses/created"),
  addReview: (id, reviewData) => api.post(`/courses/${id}/reviews`, reviewData),
  updateReview: (courseId, reviewId, reviewData) => api.put(`/courses/${courseId}/reviews/${reviewId}`, reviewData),
  deleteReview: (courseId, reviewId) => api.delete(`/courses/${courseId}/reviews/${reviewId}`),
};

// Stats API
export const statsAPI = {
  getPlatformStats: () => api.get("/stats"),
  getTrendingCourses: () => api.get("/stats/trending"),
};

// Analytics API
export const analyticsAPI = {
  getCourseAnalytics: (courseId) => api.get(`/analytics/course/${courseId}`),
  getInstructorDashboard: () => api.get("/analytics/instructor/dashboard"),
};

export default api;