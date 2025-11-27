import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const PaymentDiagnostic = () => {
  const { user } = useAuth();
  const [diagnostics, setDiagnostics] = useState({
    stripeKey: null,
    apiUrl: null,
    userLoggedIn: false,
    userRole: null,
    token: null,
  });

  useEffect(() => {
    setDiagnostics({
      stripeKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? "✓ Present" : "❌ Missing",
      apiUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
      userLoggedIn: !!user,
      userRole: user?.role || "Not logged in",
      token: localStorage.getItem("token") ? "✓ Present" : "❌ Missing",
    });
  }, [user]);

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="font-bold text-sm mb-2">Payment Diagnostic</h3>
      <div className="text-xs space-y-1">
        <div>
          <span className="font-semibold">Stripe Key:</span> {diagnostics.stripeKey}
        </div>
        <div>
          <span className="font-semibold">API URL:</span> {diagnostics.apiUrl}
        </div>
        <div>
          <span className="font-semibold">User:</span> {diagnostics.userLoggedIn ? "✓ Logged in" : "❌ Not logged in"}
        </div>
        <div>
          <span className="font-semibold">Role:</span> {diagnostics.userRole}
        </div>
        <div>
          <span className="font-semibold">Token:</span> {diagnostics.token}
        </div>
      </div>
      <button
        onClick={() => {
          console.log("=== PAYMENT DIAGNOSTIC ===");
          console.log("Stripe Key:", import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
          console.log("API URL:", import.meta.env.VITE_API_URL);
          console.log("User:", user);
          console.log("Token:", localStorage.getItem("token"));
          console.log("========================");
        }}
        className="mt-2 w-full px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
      >
        Log to Console
      </button>
    </div>
  );
};

export default PaymentDiagnostic;
