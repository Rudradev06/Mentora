import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { paymentAPI } from "../services/payment";
import { 
  CreditCard, 
  Download, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  Filter,
  Search,
  FileText,
  DollarSign,
  TrendingUp,
  ArrowUpDown
} from "lucide-react";

const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  useEffect(() => {
    filterAndSortPayments();
  }, [payments, searchTerm, statusFilter, sortBy]);

  const fetchPaymentHistory = async () => {
    try {
      const response = await paymentAPI.getPaymentHistory();
      setPayments(response.data.payments);
    } catch (err) {
      setError("Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPayments = () => {
    let filtered = [...payments];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.course.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "date-asc":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "amount-desc":
          return b.amount - a.amount;
        case "amount-asc":
          return a.amount - b.amount;
        case "course-asc":
          return a.course.title.localeCompare(b.course.title);
        case "course-desc":
          return b.course.title.localeCompare(a.course.title);
        default:
          return 0;
      }
    });

    setFilteredPayments(filtered);
  };

  const handleViewDetails = async (payment) => {
    setSelectedPayment(payment);
    setShowDetails(true);
  };

  const handleDownloadReceipt = (payment) => {
    // Generate receipt content
    const receiptContent = `
PAYMENT RECEIPT
================

Transaction ID: ${payment._id}
Date: ${new Date(payment.createdAt).toLocaleString()}
Status: ${payment.status.toUpperCase()}

Course Details:
--------------
Course: ${payment.course.title}
Amount: $${payment.amount.toFixed(2)} ${payment.currency.toUpperCase()}

Payment Method: ${payment.paymentMethod || 'Credit Card'}
${payment.stripePaymentIntentId ? `Stripe Payment ID: ${payment.stripePaymentIntentId}` : ''}

Thank you for your purchase!
    `.trim();

    // Create and download file
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${payment._id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const calculateStats = () => {
    const completedPayments = payments.filter(p => p.status === "completed");
    const totalSpent = completedPayments.reduce((sum, p) => sum + p.amount, 0);
    const avgSpent = completedPayments.length > 0 ? totalSpent / completedPayments.length : 0;
    
    return {
      totalSpent,
      avgSpent,
      completedCount: completedPayments.length,
      pendingCount: payments.filter(p => p.status === "pending").length,
      failedCount: payments.filter(p => p.status === "failed").length,
      refundedCount: payments.filter(p => p.status === "refunded").length,
    };
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        icon: CheckCircle,
        className: "bg-green-100 text-green-800",
        label: "Completed"
      },
      pending: {
        icon: Clock,
        className: "bg-yellow-100 text-yellow-800",
        label: "Pending"
      },
      failed: {
        icon: XCircle,
        className: "bg-red-100 text-red-800",
        label: "Failed"
      },
      refunded: {
        icon: XCircle,
        className: "bg-gray-100 text-gray-800",
        label: "Refunded"
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment History</h1>
          <p className="text-gray-600">View all your course purchases and transactions</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Summary Stats */}
        {payments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${calculateStats().totalSpent.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {calculateStats().completedCount}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${calculateStats().avgSpent.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Transactions</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {payments.length}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        {payments.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="amount-desc">Highest Amount</option>
                  <option value="amount-asc">Lowest Amount</option>
                  <option value="course-asc">Course A-Z</option>
                  <option value="course-desc">Course Z-A</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchTerm || statusFilter !== "all") && (
              <div className="mt-4 flex items-center space-x-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    Search: {searchTerm}
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-2 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {statusFilter !== "all" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    Status: {statusFilter}
                    <button
                      onClick={() => setStatusFilter("all")}
                      className="ml-2 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        )}

        {/* Payments List */}
        {filteredPayments.length === 0 && payments.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search term</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : payments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Payment History</h3>
            <p className="text-gray-600 mb-6">You haven't made any course purchases yet</p>
            <Link
              to="/courses"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {payment.course.thumbnail && (
                            <img
                              className="h-10 w-10 rounded object-cover"
                              src={payment.course.thumbnail}
                              alt={payment.course.title}
                            />
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {payment.course.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ${payment.amount.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500 uppercase">
                          {payment.currency}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleViewDetails(payment)}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Details
                          </button>
                          {payment.status === "completed" && (
                            <Link
                              to={`/courses/${payment.course._id}/learn`}
                              className="text-green-600 hover:text-green-700 font-medium"
                            >
                              View Course
                            </Link>
                          )}
                          <button
                            onClick={() => handleDownloadReceipt(payment)}
                            className="text-gray-600 hover:text-gray-700"
                            title="Download Receipt"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payment Details Modal */}
        {showDetails && selectedPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Payment Details</h3>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Transaction Info */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Transaction Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Transaction ID:</span>
                      <span className="text-sm font-mono text-gray-900">{selectedPayment._id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Date:</span>
                      <span className="text-sm text-gray-900">
                        {new Date(selectedPayment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span>{getStatusBadge(selectedPayment.status)}</span>
                    </div>
                    {selectedPayment.stripePaymentIntentId && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Stripe Payment ID:</span>
                        <span className="text-sm font-mono text-gray-900">
                          {selectedPayment.stripePaymentIntentId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Course Info */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Course Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      {selectedPayment.course.thumbnail && (
                        <img
                          src={selectedPayment.course.thumbnail}
                          alt={selectedPayment.course.title}
                          className="w-20 h-20 rounded object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 mb-1">
                          {selectedPayment.course.title}
                        </h5>
                        {selectedPayment.course.instructor && (
                          <p className="text-sm text-gray-600">
                            Instructor: {selectedPayment.course.instructor.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Payment Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Amount:</span>
                      <span className="text-lg font-bold text-gray-900">
                        ${selectedPayment.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Currency:</span>
                      <span className="text-sm text-gray-900 uppercase">
                        {selectedPayment.currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Payment Method:</span>
                      <span className="text-sm text-gray-900">
                        {selectedPayment.paymentMethod || 'Credit Card'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleDownloadReceipt(selectedPayment)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Receipt</span>
                  </button>
                  {selectedPayment.status === "completed" && (
                    <Link
                      to={`/courses/${selectedPayment.course._id}/learn`}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      onClick={() => setShowDetails(false)}
                    >
                      <FileText className="w-4 h-4" />
                      <span>Go to Course</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
