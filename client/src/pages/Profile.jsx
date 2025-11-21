import useAuth from "../hooks/useAuth";
import AchievementShare from "../components/AchievementShare";
import { getBadge } from "../utils/badges";
import { User, Mail, Award, TrendingUp, CheckCircle } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-purple-200 p-12 text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <User className="w-10 h-10 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">Authentication Required</h3>
          <p className="text-gray-600 text-lg">Please log in to access your profile information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6 flex-wrap gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-2xl transform hover:scale-110 transition-transform">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent whitespace-nowrap">
                👤 Citizen Profile
              </h1>
              <p className="text-gray-700 mt-2 text-xl font-semibold whitespace-nowrap">Public Service Portal Account</p>
            </div>
          </div>
          <div className="w-40 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full shadow-lg"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-purple-200 p-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 flex items-center gap-3 whitespace-nowrap">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600 flex-shrink-0" />
                </div>
                <span>Personal Information</span>
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl flex-wrap gap-3 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-3 whitespace-nowrap">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-white flex-shrink-0" />
                    </div>
                    <span className="font-bold text-gray-800 text-lg">Full Name</span>
                  </div>
                  <span className="text-xl text-gray-900 font-bold whitespace-nowrap">{user.fullName}</span>
                </div>

                <div className="flex items-center justify-between p-5 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl flex-wrap gap-3 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-3 whitespace-nowrap">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white flex-shrink-0" />
                    </div>
                    <span className="font-bold text-gray-800 text-lg">Email Address</span>
                  </div>
                  <span className="text-lg text-gray-900 font-bold break-all md:break-normal">{user.email}</span>
                </div>
              </div>
            </div>

            {/* Service Recognition */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-purple-200 p-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8 flex items-center gap-3 whitespace-nowrap">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600 flex-shrink-0" />
                </div>
                <span>🏆 Service Recognition</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Points Card */}
                <div className="bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 border-2 border-blue-400 rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Service Points</h3>
                  </div>
                  <p className="text-6xl font-bold text-white mb-3">{user.points || 0}</p>
                  <p className="text-blue-100 font-semibold text-lg">⭐ Community Contribution Score</p>
                </div>

                {/* Badge Card */}
                <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 border-2 border-green-400 rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Current Badge</h3>
                  </div>
                  <p className="text-4xl font-bold text-white mb-3">{getBadge(user.points || 0)}</p>
                  <p className="text-green-100 font-semibold text-lg">🎖️ Service Level Recognition</p>
                </div>
              </div>
            </div>
          </div>

          {/* Share Achievement Section */}
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-purple-200 p-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 flex items-center gap-3 whitespace-nowrap">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-600 flex-shrink-0" />
                </div>
                <span>Share Recognition</span>
              </h2>
              <p className="text-gray-700 text-base mb-6 font-medium">
                Share your community service achievements and encourage others to participate in public service initiatives.
              </p>
              <div className="flex justify-center">
                <AchievementShare user={user} />
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-300 rounded-2xl p-6 shadow-xl">
              <h3 className="font-bold text-blue-900 mb-4 text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Account Status
              </h3>
              <div className="space-y-3 text-sm text-blue-900">
                <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
                  <span className="font-semibold">Member Since:</span>
                  <span className="font-bold">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
                  <span className="font-semibold">Account Type:</span>
                  <span className="font-bold">Community Member</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
                  <span className="font-semibold">Verification:</span>
                  <span className="font-bold text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">⚡ Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left text-sm text-blue-700 hover:text-blue-800 py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 font-semibold border-2 border-blue-200 hover:border-blue-400 shadow-sm hover:shadow-md">
                  ✏️ Update Profile Information
                </button>
                <button className="w-full text-left text-sm text-blue-700 hover:text-blue-800 py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 font-semibold border-2 border-blue-200 hover:border-blue-400 shadow-sm hover:shadow-md">
                  📜 View Service History
                </button>
                <button className="w-full text-left text-sm text-blue-700 hover:text-blue-800 py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 font-semibold border-2 border-blue-200 hover:border-blue-400 shadow-sm hover:shadow-md">
                  🔒 Privacy Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Information */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Municipal Corporation Public Service Portal • Citizen Profile System
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}