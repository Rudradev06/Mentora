import { Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import CourseLearnPage from "./pages/CourseLearnPage";
import MyCoursesPage from "./pages/MyCoursesPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import CreateCoursePage from "./pages/CreateCoursePage";
import EditCoursePage from "./pages/EditCoursePage";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentHistoryPage from "./pages/PaymentHistoryPage";
import PageNotFound from "./pages/PageNotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const location = useLocation();
  const hideNavAndFooter = ["/login", "/register"].includes(location.pathname) || 
                          location.pathname.includes("/learn");

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavAndFooter && <Navbar />}
      
      <main className={`flex-grow ${!hideNavAndFooter ? "pt-16" : ""}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route 
            path="/courses/:id/learn" 
            element={
              <ProtectedRoute>
                <CourseLearnPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-courses" 
            element={
              <ProtectedRoute>
                <MyCoursesPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route 
            path="/create-course" 
            element={
              <ProtectedRoute requiredRole="teacher">
                <CreateCoursePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courses/:id/edit" 
            element={
              <ProtectedRoute requiredRole="teacher">
                <EditCoursePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/checkout/:id" 
            element={
              <ProtectedRoute requiredRole="student">
                <CheckoutPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment-success" 
            element={
              <ProtectedRoute>
                <PaymentSuccessPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment-history" 
            element={
              <ProtectedRoute>
                <PaymentHistoryPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>

      {!hideNavAndFooter && <Footer />}
    </div>
  );
}
