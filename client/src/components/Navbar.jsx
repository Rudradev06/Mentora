import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);

    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setShowUserDropdown(false);
        setShowNotifications(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Navigation items
  const publicNavItems = [
    { to: "/courses", label: "Courses", icon: "📚" },
    { to: "/pricing", label: "Pricing", icon: "💎" },
    { to: "/blog", label: "Blog", icon: "📝" },
  ];

  const privateNavItems = [
    { to: "/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/courses", label: "Browse Courses", icon: "🔍" },
    { to: "/my-courses", label: "My Courses", icon: "📖" },
    { to: "/blog", label: "Blog", icon: "📝" },
  ];

  const navItems = isAuthenticated ? privateNavItems : publicNavItems;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ease-out ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/30 py-1"
          : "bg-white/98 backdrop-blur-sm shadow-md py-2"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 group cursor-pointer">
            <Link to="/" className="flex items-center">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </div>
              <div className="ml-3 hidden md:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Mentora
                </h1>
                <div className="h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full mt-1"></div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:space-x-1 items-center">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to || 
                             (item.to === "/courses" && location.pathname.startsWith("/courses")) ||
                             (item.to === "/my-courses" && location.pathname === "/my-courses") ||
                             (item.to === "/dashboard" && location.pathname === "/dashboard") ||
                             (item.to === "/blog" && location.pathname.startsWith("/blog"));
              
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? "text-blue-600 bg-blue-50 shadow-sm"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/80"
                  }`}
                >
                  <span className={`text-sm transition-transform duration-200 ${
                    isActive ? "scale-110" : "group-hover:scale-110"
                  }`}>
                    {item.icon}
                  </span>
                  <span className="font-semibold text-sm">{item.label}</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 via-blue-50/80 to-blue-100/50 rounded-lg"></div>
                  )}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/50 to-blue-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* User / CTA */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <div className="relative dropdown-container">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserDropdown(false);
                    }}
                    className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    🔔
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {notificationCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-900">
                          Notifications
                        </h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        <div className="px-4 py-3 hover:bg-blue-50 cursor-pointer">
                          <p className="text-sm font-medium">
                            New course available!
                          </p>
                          <p className="text-xs text-gray-500">
                            Advanced React Development
                          </p>
                        </div>
                      </div>
                      <div className="px-4 py-2 border-t border-gray-100">
                        <Link
                          to="/notifications"
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View all
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
                <div className="relative dropdown-container">
                  <button
                    onClick={() => {
                      setShowUserDropdown(!showUserDropdown);
                      setShowNotifications(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  >
                    <img
                      className="h-8 w-8 rounded-full ring-2 ring-blue-500/20"
                      src={
                        user?.avatar ||
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                      }
                      alt="User"
                    />
                    <span className="font-semibold text-sm">
                      {user?.name || "User"}
                    </span>
                    <span
                      className={`transition-transform ${
                        showUserDropdown ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user?.email || "No email"}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-3 text-sm hover:bg-blue-50"
                      >
                        Profile & Settings
                      </Link>
                      <Link
                        to="/payment-history"
                        className="block px-4 py-3 text-sm hover:bg-blue-50"
                      >
                        Payment History
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserDropdown(false);
                          navigate("/");
                        }}
                        className="block w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 font-semibold text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-lg transition-all hover:shadow-xl hover:scale-105"
                >
                  Get Started 🚀
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50"
            >
              {isOpen ? "✖" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ${
          isOpen
            ? "opacity-100 max-h-screen visible"
            : "opacity-0 max-h-0 invisible"
        } bg-white border-t border-gray-200 shadow-lg`}
      >
        <div className="px-4 pt-4 pb-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || 
                           (item.to === "/courses" && location.pathname.startsWith("/courses")) ||
                           (item.to === "/my-courses" && location.pathname === "/my-courses") ||
                           (item.to === "/dashboard" && location.pathname === "/dashboard") ||
                           (item.to === "/blog" && location.pathname.startsWith("/blog"));
            
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-blue-50 text-gray-700"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}

          <hr className="border-gray-200 my-4" />

          {!isAuthenticated ? (
            <div className="space-y-3">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-4 py-3 rounded-lg hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-4 py-3 rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600"
              >
                Get Started 🚀
              </Link>
            </div>
          ) : (
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
                navigate("/");
              }}
              className="block w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
