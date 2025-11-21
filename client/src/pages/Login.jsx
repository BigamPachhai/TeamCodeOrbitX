import { useState } from "react";
import api from "../api/axios";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

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
      navigate("/feed");
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "गलो इमेल वा पासवर्ड"); // Wrong email or password
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-red-600 opacity-10 rounded-full -translate-x-16 -translate-y-16"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-yellow-500 opacity-10 rounded-full translate-x-20 translate-y-20"></div>

      {/* Mandala pattern overlay */}
      <div
        className="absolute inset-0 opacity-5 bg-repeat bg-center"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z' fill='%23dc2626'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
        }}
      ></div>

      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10 border border-orange-200">
        {/* Nepali flag inspired header */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center relative">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            {/* Sun rays */}
            <div className="absolute inset-0">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-4 bg-red-600 left-1/2 top-0 -translate-x-1/2 -translate-y-1"
                  style={{
                    transform: `translateX(-50%) translateY(-2px) rotate(${
                      i * 30
                    }deg)`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-red-700 mb-2 font-sans">
          लगइन गर्नुहोस्
        </h1>
        <p className="text-center text-gray-600 mb-6 text-sm">
          (Login to Rupandehi Portal)
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="email"
              placeholder="इमेल ठेगाना"
              value={email}
              className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-300 bg-white pl-12"
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="पासवर्ड"
              value={password}
              className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-300 bg-white pl-12"
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              </div>
            ) : (
              "लगइन गर्नुहोस्"
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-orange-200">
          <p className="text-center text-gray-600">
            खाता छैन?{" "}
            <Link
              to="/register"
              className="text-red-600 font-semibold hover:text-red-700 underline transition-colors duration-300"
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
