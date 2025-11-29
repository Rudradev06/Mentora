import React, { useState, useEffect } from "react";
import { statsAPI } from "../services/api";

const Footer = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    averageRating: 0,
    uptime: "99.9%"
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await statsAPI.getPlatformStats();
      const { stats: platformStats } = response.data;

      setStats({
        totalUsers: platformStats.users.total || 0,
        averageRating: platformStats.courses.averageRating || 0,
        uptime: "99.9%"
      });
    } catch (error) {
      console.error("Failed to fetch footer stats:", error);
      // Keep default values
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerLinks = {
    product: [
      { name: "Features", href: "/features" },
      { name: "Pricing", href: "/pricing" },
      { name: "API", href: "/api" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
    ],
    resources: [
      { name: "Help Center", href: "/help" },
      { name: "Documentation", href: "/docs" },
      { name: "Community", href: "/community" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Security", href: "/security" },
    ],
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: "📘",
      href: "#",
      color: "hover:text-blue-500",
    },
    { name: "Twitter", icon: "🐦", href: "#", color: "hover:text-sky-500" },
    {
      name: "Instagram",
      icon: "📷",
      href: "#",
      color: "hover:text-pink-500",
    },
    {
      name: "LinkedIn",
      icon: "💼",
      href: "#",
      color: "hover:text-blue-700",
    },
  ];

  const displayStats = [
    { icon: "👥", value: `${(stats.totalUsers / 1000).toFixed(0)}K+`, label: "Users" },
    { icon: "⭐", value: stats.averageRating.toFixed(1), label: "Rating" },
    { icon: "🛡️", value: stats.uptime, label: "Uptime" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-10"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-10"></div>
      </div>

      <div className="relative z-10">
        {/* Stats Section - Compact */}
        <div className="border-b border-gray-700/50 py-6 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center space-x-8">
              {displayStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-2">
                    <span className="text-sm">{stat.icon}</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Footer Content - Compact */}
        <div className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
              {/* Brand Section - Smaller */}
              <div className="lg:col-span-2">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm">⚡</span>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Mentora
                  </span>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  Empowering educators worldwide with innovative learning
                  solutions.
                </p>

                {/* Contact Info - Compact */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-400 text-sm">
                    <span className="w-4 h-4 mr-2 text-blue-400">✉️</span>
                    <span>hello@mentora.com</span>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <span className="w-4 h-4 mr-2 text-blue-400">📞</span>
                    <span>+91-98456 34290</span>
                  </div>
                </div>

                {/* Newsletter - Compact */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-sm font-semibold mb-2 flex items-center">
                    <span className="mr-2">💌</span>
                    Stay Updated
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>

              {/* Links Sections - Compact */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:col-span-4">
                <div>
                  <h4 className="text-sm font-semibold mb-4 text-white">
                    Product
                  </h4>
                  <ul className="space-y-2">
                    {footerLinks.product.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-4 text-white">
                    Company
                  </h4>
                  <ul className="space-y-2">
                    {footerLinks.company.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-4 text-white">
                    Resources
                  </h4>
                  <ul className="space-y-2">
                    {footerLinks.resources.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-4 text-white">
                    Legal
                  </h4>
                  <ul className="space-y-2">
                    {footerLinks.legal.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Compact */}
        <div className="border-t border-gray-700/50 py-4 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Copyright */}
              <div className="text-gray-400 text-sm text-center md:text-left">
                <p className="flex items-center justify-center md:justify-start">
                  © 2025 Mentora. Made with
                  <span className="mx-1 text-red-500">❤️</span>
                  for education.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 ${social.color} transition-all duration-200 hover:bg-white/20`}
                    aria-label={social.name}
                  >
                    <span className="text-sm">{social.icon}</span>
                  </a>
                ))}
              </div>

              {/* Back to Top Button */}
              <button
                onClick={scrollToTop}
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                aria-label="Back to top"
              >
                <span className="text-sm">↑</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
