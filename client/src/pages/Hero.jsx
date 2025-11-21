import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import HeroAnimation from "../components/HeroAnimation";

export default function Hero() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Enhanced Red Banner with Nepali Theme */}
      <div className="relative w-full h-64 bg-gradient-to-r from-red-700 via-red-600 to-red-800 clip-path-custom flex items-center justify-center overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-white"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-white"></div>
        </div>

        <div className="text-center px-6 z-10 relative">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-1 bg-yellow-400 rounded-full"></div>
          </div>
          <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-2xl mb-3 tracking-tight">
            रुपन्देही सार्वजनिक समस्या
          </h1>
          <h2 className="text-white text-xl md:text-3xl font-semibold drop-shadow-lg opacity-95">
            Issue Reporting Portal
          </h2>
          <p className="text-red-100 text-sm md:text-base mt-3 max-w-2xl mx-auto">
            सहज, छिटो र प्रभावकारी समस्या समाधानको लागि
          </p>
        </div>
      </div>

      {/* Hero Animation Section - Fixed positioning */}
      <div className="relative px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <HeroAnimation />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-5 bg-white rounded-lg shadow-md border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">📸</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Photo Evidence
            </h3>
            <p className="text-gray-600 text-sm">
              Report with visual proof for better understanding
            </p>
          </div>

          <div className="text-center p-5 bg-white rounded-lg shadow-md border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">📍</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Location Tracking
            </h3>
            <p className="text-gray-600 text-sm">
              Automatic location detection for precise reporting
            </p>
          </div>

          <div className="text-center p-5 bg-white rounded-lg shadow-md border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">🤖</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              AI Assistance
            </h3>
            <p className="text-gray-600 text-sm">
              Smart categorization and priority assessment
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center px-4">
          <p className="text-gray-700 text-lg mb-6 leading-relaxed max-w-2xl mx-auto">
            Report civic issues instantly using{" "}
            <span className="font-semibold text-blue-700">photo evidence</span>,
            <span className="font-semibold text-green-700">
              {" "}
              precise location
            </span>
            , and
            <span className="font-semibold text-purple-700">
              {" "}
              AI assistance
            </span>
            .
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4 items-center">
            {!user ? (
              <>
                <Link
                  className="px-8 py-3 bg-blue-700 text-white rounded-lg shadow-lg hover:bg-blue-800 transition-all duration-300 font-semibold flex items-center gap-2"
                  to="/login"
                >
                  <span>🔐</span> Login
                </Link>
                <Link
                  className="px-8 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300 font-semibold flex items-center gap-2"
                  to="/register"
                >
                  <span>👤</span> Create Account
                </Link>
              </>
            ) : (
              <>
                <Link
                  className="px-8 py-3 bg-blue-700 text-white rounded-lg shadow-lg hover:bg-blue-800 transition-all duration-300 font-semibold flex items-center gap-2"
                  to="/feed"
                >
                  <span>👁️</span> View Issues
                </Link>
                <Link
                  className="px-8 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300 font-semibold flex items-center gap-2"
                  to="/report"
                >
                  <span>📝</span> Report Issue
                </Link>
              </>
            )}
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg border border-gray-200 max-w-xl mx-auto">
            <p className="text-gray-700 text-sm mb-1">
              <span className="font-bold text-red-700">
                रुपन्देही नगरपालिका
              </span>{" "}
              संग समन्वयित
            </p>
            <p className="text-gray-600 text-xs">
              Your reports directly reach the concerned authorities for quick
              action
            </p>
          </div>
        </div>
      </div>

      <style>
        {`
          .clip-path-custom { 
            clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
          }
          @media (max-width: 768px) {
            .clip-path-custom { 
              clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%);
              height: 56vw;
            }
          }
        `}
      </style>
    </div>
  );
}
