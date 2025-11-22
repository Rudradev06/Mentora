import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { statsAPI } from "../services/api";

const StatsSection = ({ isVisible }) => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalInstructors: 0,
    averageRating: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await statsAPI.getPlatformStats();
      const { stats: platformStats } = response.data;

      setStats({
        totalCourses: platformStats.courses.total,
        totalStudents: platformStats.courses.totalEnrollments,
        totalInstructors: platformStats.users.instructors,
        averageRating: platformStats.courses.averageRating,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      // Fallback to default values
      setStats({
        totalCourses: 0,
        totalStudents: 0,
        totalInstructors: 0,
        averageRating: 0,
      });
    }
  };

  const statsData = [
    { number: `${stats.totalStudents}+`, label: "Students" },
    { number: `${stats.totalCourses}+`, label: "Courses" },
    { number: `${stats.totalInstructors}+`, label: "Instructors" },
    { number: `${stats.averageRating.toFixed(1)}★`, label: "Avg Rating" },
  ];

  return (
    <div
      className={`mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 delay-900 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {statsData.map((stat, index) => (
        <div
          key={index}
          className="text-center group hover:scale-110 transition-transform duration-300"
        >
          <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors duration-300">
            {stat.number}
          </div>
          <div className="text-blue-200 text-sm uppercase tracking-wider">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    { icon: "🎓", text: "Interactive Courses" },
    { icon: "📊", text: "Progress Tracking" },
    { icon: "🏆", text: "Achievements" },
    { icon: "👥", text: "Collaborative Learning" },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Dynamic Background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-600  to-indigo-800"
        style={{
          background: `radial-gradient(circle 800px at 100% 0%, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.6) 35%, rgba(29, 78, 216, 0.9) 90%)`,
        }}
      />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-purple-300/20 rounded-full blur-lg animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-32 left-20 w-40 h-40 bg-blue-300/15 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Geometric Shapes */}
        <div
          className="absolute top-1/4 right-1/4 w-6 h-6 bg-white/20 rotate-45 animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-yellow-300/30 rotate-45 animate-bounce"
          style={{ animationDelay: "3s" }}
        ></div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Main Title */}
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
            <span className="inline-block bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent animate-pulse">
              Empower
            </span>
            <br />
            <span className="inline-block text-white transform hover:scale-105 transition-transform duration-300">
              Your Learning
            </span>
            <br />
            <span className="inline-block bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              Journey ✨
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <div
          className={`transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="max-w-3xl mx-auto text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed font-light">
            A{" "}
            <span className="font-semibold text-white">
              modern learning platform
            </span>{" "}
            to manage courses, assignments, quizzes, and track your progress —{" "}
            <span className="text-yellow-300 font-medium">
              all in one place.
            </span>
          </p>
        </div>

        {/* Feature Pills */}
        <div
          className={`flex flex-wrap justify-center gap-4 mb-12 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-medium hover:bg-white/30 transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${0.7 + index * 0.1}s` }}
            >
              <span className="text-lg">{feature.icon}</span>
              <span className="text-sm">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {!isAuthenticated ? (
            <Link
              to="/register"
              className="group relative bg-white text-blue-700 px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden hover:text-white"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started for Free
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white group-hover:bg-transparent transition-colors duration-300"></div>
            </Link>
          ) : (
            <Link
              to="/dashboard"
              className="group relative bg-white text-blue-700 px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden hover:text-white"
            >
              <span className="relative z-10 flex items-center gap-2">
                Go to Dashboard
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white group-hover:bg-transparent transition-colors duration-300"></div>
            </Link>
          )}

          <Link
            to="/courses"
            className="group flex items-center gap-2 text-white border-2 border-white/50 px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-700 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h6m2-7V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14l7-3 7 3V5z"
              />
            </svg>
            Explore Courses
          </Link>
        </div>

        {/* Stats */}
        <StatsSection isVisible={isVisible} />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}