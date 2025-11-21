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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white border border-gray-200 shadow-sm p-8 w-full max-w-md">
        {/* Official Government Header */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#003865] rounded flex items-center justify-center">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="text-center mb-6 border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-[#003865] mb-1">
            खाता दर्ता गर्नुहोस्
          </h1>
          <p className="text-sm text-gray-600">
            रुपन्देही जिल्ला | Rupandehi District Administration Office
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Create Account in Sanket
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name Field */}
          <div className="relative">
            <input
              placeholder="पूरा नाम"
              value={fullName}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#003865] focus:border-[#003865] transition-all bg-white pl-12 text-sm"
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
              className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#003865] focus:border-[#003865] transition-all bg-white pl-12 text-sm"
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
              className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#003865] focus:border-[#003865] transition-all bg-white pl-12 text-sm"
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
              className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#003865] focus:border-[#003865] transition-all bg-white pl-12 text-sm"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <CheckCircle className="w-5 h-5" />
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
                दर्ता हुँदैछ...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                खाता दर्ता गर्नुहोस्
              </>
            )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            पहिले नै खाता छ?{" "}
            <Link
              to="/login"
              className="text-[#003865] font-semibold hover:text-[#002D4F] underline transition-colors"
            >
              लगइन गर्नुहोस्
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
