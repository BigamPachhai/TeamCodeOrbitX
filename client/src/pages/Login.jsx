import { useState } from "react";
import api from "../api/axios";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import { Mail, Lock, LogIn } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { error, success } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await api.post("/auth/login", { email, password });

      // Store token in localStorage (as expected by your axios interceptor)
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Call the login function from useAuth (assuming it handles user state)
      login(data);
      success("Login successful! Welcome back.");
      navigate("/feed");
    } catch (err) {
      console.error("Login error:", err);
      error(err.response?.data?.message || "गलो इमेल वा पासवर्ड"); // Wrong email or password
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white border border-gray-200 shadow-sm p-8 w-full max-w-md">
        {/* Official Government Header */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#003865] rounded flex items-center justify-center">
            <LogIn className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="text-center mb-6 border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-[#003865] mb-1">
            लगइन गर्नुहोस्
          </h1>
          <p className="text-sm text-gray-600">
            रुपन्देही जिल्ला | Rupandehi District Administration Office
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Login to Sanket
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="email"
              placeholder="इमेल ठेगाना"
              value={email}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#003865] focus:border-[#003865] transition-all bg-white pl-12 text-sm"
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Mail className="w-5 h-5" />
            </div>
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="पासवर्ड"
              value={password}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#003865] focus:border-[#003865] transition-all bg-white pl-12 text-sm"
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Lock className="w-5 h-5" />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 bg-[#003865] text-white py-3 rounded border border-[#003865] hover:bg-[#002D4F] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                लगइन हुँदैछ...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                लगइन गर्नुहोस्
              </>
            )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            खाता छैन?{" "}
            <Link
              to="/register"
              className="text-[#003865] font-semibold hover:text-[#002D4F] underline transition-colors"
            >
              दर्ता गर्नुहोस्
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
