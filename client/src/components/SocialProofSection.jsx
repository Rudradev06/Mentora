import { useState, useEffect } from "react";
import { statsAPI } from "../services/api";

const SocialProofSection = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalInstructors: 0,
    averageRating: 0
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
        averageRating: platformStats.courses.averageRating
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      // Fallback to default values
      setStats({
        totalCourses: 0,
        totalStudents: 0,
        totalInstructors: 0,
        averageRating: 0
      });
    }
  };

  const companies = [
    { name: "Microsoft", logo: "🏢", color: "from-blue-500 to-cyan-500" },
    {
      name: "Harvard University",
      logo: "🎓",
      color: "from-red-500 to-pink-500",
    },
    { name: "Google", logo: "🔍", color: "from-green-500 to-emerald-500" },
    { name: "Stanford", logo: "🌟", color: "from-orange-500 to-yellow-500" },
    { name: "Amazon", logo: "📦", color: "from-yellow-500 to-orange-500" },
    { name: "MIT", logo: "⚡", color: "from-purple-500 to-indigo-500" },
    { name: "Apple", logo: "🍎", color: "from-gray-500 to-slate-500" },
    { name: "Tesla", logo: "⚡", color: "from-red-500 to-rose-500" },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Dynamic Background - transitions smoothly with scroll */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-800 transition-all duration-300 ease-out"
        style={{
          background: `radial-gradient(circle 800px at 0% 100%, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.6) 35%, rgba(29, 78, 216, 0.9) 90%)`,
        }}
      />

      {/* Animated Background Elements - same style as hero */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div
          className="absolute top-60 right-20 w-32 h-32 bg-purple-300/20 rounded-full blur-lg animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-40 left-1/4 w-48 h-48 bg-blue-300/15 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/3 w-24 h-24 bg-pink-300/20 rounded-full blur-lg animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Geometric Shapes */}
        <div
          className="absolute top-1/4 right-1/4 w-8 h-8 bg-white/20 rotate-45 animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/5 w-6 h-6 bg-yellow-300/30 rotate-45 animate-bounce"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/5 w-4 h-4 bg-purple-300/40 rotate-45 animate-bounce"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.15'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-blue-100 font-semibold mb-8 hover:bg-white/30 transition-all duration-300">
            <span className="text-xl">🏆</span>
            <span className="text-sm uppercase tracking-wider">
              Trusted Worldwide
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            <span className="inline-block bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              Powering Success
            </span>
            <br />
            <span className="inline-block text-white">
              for Industry Leaders
            </span>
          </h2>

          <p className="max-w-3xl mx-auto text-xl text-blue-100 mb-8 leading-relaxed font-light">
            Join the ranks of{" "}
            <span className="font-semibold text-white">
              Fortune 500 companies
            </span>{" "}
            and
            <span className="text-yellow-300 font-medium">
              {" "}
              top universities
            </span>{" "}
            who trust Mentora to transform their learning experiences.
          </p>

          {/* Stats Display */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stats.totalStudents.toLocaleString()}+
              </div>
              <div className="text-blue-200 text-sm uppercase tracking-wider">
                Students Learning
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stats.totalCourses}+
              </div>
              <div className="text-blue-200 text-sm uppercase tracking-wider">
                Courses Available
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stats.totalInstructors}+
              </div>
              <div className="text-blue-200 text-sm uppercase tracking-wider">
                Expert Instructors
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stats.averageRating.toFixed(1)}★
              </div>
              <div className="text-blue-200 text-sm uppercase tracking-wider">
                Average Rating
              </div>
            </div>
          </div>
        </div>

        {/* Company Logos */}
        <div>
          <h3 className="text-blue-200 text-lg font-semibold mb-12 uppercase tracking-wider">
            Trusted by Leading Organizations
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
            {companies.map((company, index) => (
              <div
                key={company.name}
                className="group bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20"
                style={{ animationDelay: `${0.3 + index * 0.05}s` }}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-r ${company.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    {company.logo}
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-white text-sm group-hover:text-yellow-300 transition-colors duration-300">
                      {company.name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
