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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-blue-600 opacity-20 rounded-full -translate-x-16 -translate-y-16 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500 opacity-20 rounded-full translate-x-20 translate-y-20 blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 w-56 h-56 bg-pink-500 opacity-15 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse"></div>

      {/* Mandala pattern overlay */}
      <div
        className="absolute inset-0 opacity-5 bg-repeat bg-center"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z' fill='%23dc2626'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
        }}
      ></div>

      <div className="bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border-3 border-purple-200">
        {/* Modern header icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl font-bold">🔐</span>
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 font-sans">
          🙏 लगइन गर्नुहोस्
        </h1>
        <p className="text-center text-gray-700 mb-8 text-lg font-medium">
          (Login to Sanket)
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative group">
            <input
              type="email"
              placeholder="📧 इमेल ठेगाना"
              value={email}
              className="w-full px-5 py-4 border-3 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm pl-14 text-lg font-medium group-hover:border-purple-300 shadow-lg"
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500 group-hover:text-purple-600 transition-colors">
              <Mail className="w-6 h-6" />
            </div>
          </div>

          <div className="relative group">
            <input
              type="password"
              placeholder="🔒 पासवर्ड"
              value={password}
              className="w-full px-5 py-4 border-3 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm pl-14 text-lg font-medium group-hover:border-purple-300 shadow-lg"
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500 group-hover:text-purple-600 transition-colors">
              <Lock className="w-6 h-6" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 border-2 border-purple-400"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-6 w-6 text-white"
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
                ✨ लगइन हुँदैछ...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                लगइन गर्नुहोस्
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-orange-200">
          <p className="text-center text-gray-600">
            खाता छैन?{" "}
            <Link
              to="/register"
              className="text-blue-700 font-semibold hover:text-blue-800 underline transition-colors duration-300"
            >
              दर्ता गर्नुहोस्
            </Link>
          </p>
        </div>

        {/* Cultural pattern footer */}
        <div className="mt-6 flex justify-center space-x-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-red-500 rounded-full opacity-60"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
