import { useState } from "react";
import api from "../api/axios";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import { User, Mail, Lock, CheckCircle, UserPlus } from "lucide-react";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { error, success } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      error("पासवर्ड मेल खाँदैन"); // Passwords don't match
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await api.post("/auth/register", {
        fullName,
        email,
        password,
      });

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      login(data);
      success("Registration successful! Welcome to the platform.");
      navigate("/feed");
    } catch (err) {
      console.error("Registration error:", err);
      error(err.response?.data?.message || "दर्ता गर्दा त्रुटि भयो"); // Registration error occurred
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-teal-100 to-blue-100 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-green-600 opacity-20 rounded-full -translate-x-16 -translate-y-16 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500 opacity-20 rounded-full translate-x-20 translate-y-20 blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 w-56 h-56 bg-teal-500 opacity-15 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse"></div>

      {/* Mandala pattern overlay */}
      <div
        className="absolute inset-0 opacity-5 bg-repeat bg-center"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z' fill='%232565ec'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
        }}
      ></div>

      <div className="bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border-3 border-green-200">
        {/* Modern header icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-teal-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 via-teal-500 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl font-bold">👤</span>
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-3 font-sans">
          ✨ खाता दर्ता गर्नुहोस्
        </h1>
        <p className="text-center text-gray-700 mb-8 text-lg font-medium">
          (Create Account in Sanket)
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Full Name Field */}
          <div className="relative">
            <input
              placeholder="पूरा नाम"
              value={fullName}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-300 bg-white pl-12"
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={isLoading}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <User className="w-5 h-5" />
            </div>
          </div>

          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              placeholder="इमेल ठेगाना"
              value={email}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-300 bg-white pl-12"
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Mail className="w-5 h-5" />
            </div>
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              type="password"
              placeholder="पासवर्ड"
              value={password}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-300 bg-white pl-12"
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Lock className="w-5 h-5" />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <input
              type="password"
              placeholder="पासवर्ड पुष्टि गर्नुहोस्"
              value={confirmPassword}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-300 bg-white pl-12"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 text-white py-4 rounded-xl hover:from-green-700 hover:via-teal-700 hover:to-blue-700 transition-all duration-300 font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 border-2 border-teal-400"
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
                दर्ता हुँदैछ...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                खाता दर्ता गर्नुहोस्
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-blue-200">
          <p className="text-center text-gray-600">
            पहिले नै खाता छ?{" "}
            <Link
              to="/login"
              className="text-blue-700 font-semibold hover:text-blue-800 underline transition-colors duration-300"
            >
              लगइन गर्नुहोस्
            </Link>
          </p>
        </div>

        {/* Cultural pattern footer */}
        <div className="mt-6 flex justify-center space-x-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-500 rounded-full opacity-60"
              style={{
                animation: `pulse 2s infinite ${i * 0.3}s`,
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
