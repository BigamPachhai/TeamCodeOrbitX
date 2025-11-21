import { useState } from "react";
import api from "../api/axios";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("पासवर्ड मेल खाँदैन"); // Passwords don't match
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
      navigate("/feed");
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.message || "दर्ता गर्दा त्रुटि भयो"); // Registration error occurred
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-green-600 opacity-10 rounded-full -translate-x-16 -translate-y-16"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500 opacity-10 rounded-full translate-x-20 translate-y-20"></div>
      
      {/* Mandala pattern overlay */}
      <div className="absolute inset-0 opacity-5 bg-repeat bg-center" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z' fill='%232565ec'/%3E%3C/svg%3E")`,
        backgroundSize: '200px'
      }}></div>

      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10 border border-blue-200">
        {/* Nepali cultural header */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center relative">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-blue-500 rounded-full"
                  style={{
                    left: '50%',
                    top: '0%',
                    transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(20px)`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-blue-700 mb-2 font-sans">
          खाता दर्ता गर्नुहोस्
        </h1>
        <p className="text-center text-gray-600 mb-6 text-sm">
          (Create Account in Rupandehi Portal)
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                दर्ता हुँदैछ...
              </div>
            ) : (
              "खाता दर्ता गर्नुहोस्"
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-blue-200">
          <p className="text-center text-gray-600">
            पहिले नै खाता छ?{" "}
            <Link 
              to="/login" 
              className="text-blue-600 font-semibold hover:text-blue-700 underline transition-colors duration-300"
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
                animation: `pulse 2s infinite ${i * 0.3}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}