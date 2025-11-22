import { useState, useEffect } from "react";
import {
  Award,
  Video,
  Download,
  Globe,
  MessageCircle,
  BarChart,
} from "lucide-react";
import { statsAPI } from "../services/api";

const PlatformFeatures = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInstructors: 0,
    totalCourses: 0,
    completionRate: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await statsAPI.getPlatformStats();
      const { stats: platformStats } = response.data;
      
      setStats({
        totalStudents: platformStats.courses.totalEnrollments,
        totalInstructors: platformStats.users.instructors,
        totalCourses: platformStats.courses.total,
        completionRate: platformStats.platform.successRate
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      // Fallback to default values
      setStats({
        totalStudents: 0,
        totalInstructors: 0,
        totalCourses: 0,
        completionRate: 0
      });
    }
  };

  const features = [
    {
      icon: Video,
      title: "HD Video Content",
      description:
        "Crystal-clear video lectures with multiple quality options and subtitles in various languages.",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: Award,
      title: "Certificates",
      description:
        "Earn industry-recognized certificates upon completion to showcase your skills to employers.",
      gradient: "from-green-500 to-green-600",
    },
    {
      icon: Globe,
      title: "Lifetime Access",
      description:
        "Learn at your own pace with unlimited lifetime access to all course materials and updates.",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: Download,
      title: "Offline Learning",
      description:
        "Download videos and resources to continue learning even without an internet connection.",
      gradient: "from-orange-500 to-orange-600",
    },
    {
      icon: MessageCircle,
      title: "Expert Support",
      description:
        "Get direct access to instructors and peer community for questions and guidance.",
      gradient: "from-red-500 to-red-600",
    },
    {
      icon: BarChart,
      title: "Progress Tracking",
      description:
        "Monitor your learning progress with detailed analytics and milestone achievements.",
      gradient: "from-teal-500 to-teal-600",
    },
  ];

  const statsData = [
    { number: `${stats.totalStudents.toLocaleString()}+`, label: "Students Enrolled" },
    { number: `${stats.totalInstructors}+`, label: "Expert Instructors" },
    { number: `${stats.totalCourses}+`, label: "Courses Available" },
    { number: `${stats.completionRate}%`, label: "Completion Rate" },
  ];

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-16 py-16 bg-gray-50 min-h-screen">
      {/* Features Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Why Choose Mentora?
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Experience world-class learning with features designed for your
          success
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 group border border-gray-100 h-full flex flex-col"
            >
              <div
                className={`bg-gradient-to-r ${feature.gradient} rounded-xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
              >
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed flex-grow">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-bold mb-2">
            Join Thousands of Learners
          </h3>
          <p className="text-blue-100">Trusted by professionals worldwide</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {statsData.map((stat, index) => (
            <div key={index} className="group">
              <div className="text-3xl md:text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-blue-100 text-sm md:text-base font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlatformFeatures;
