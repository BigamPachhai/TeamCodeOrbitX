import useAuth from "../hooks/useAuth";
import AchievementShare from "../components/AchievementShare";
import { getBadge } from "../utils/badges";
import { User, Mail, Award, TrendingUp, CheckCircle } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-gray-200 shadow-sm p-10 text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-[#003865] mb-2">Authentication Required</h3>
          <p className="text-gray-600 text-sm">Please log in to access your profile information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Official Government Header */}
        <div className="bg-white border-l-4 border-[#003865] shadow-md mb-8 p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-[#003865] rounded flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#003865] mb-1">
                Citizen Profile
              </h1>
              <p className="text-gray-600 text-sm">
                रुपन्देही जिल्ला | Rupandehi District Administration Office
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Public Service Portal Account
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white border border-gray-200 shadow-sm p-6 mb-6">
              <h2 className="text-lg font-bold text-[#003865] mb-5 flex items-center gap-2 border-b border-gray-200 pb-3 uppercase tracking-wide text-sm">
                <div className="w-10 h-10 bg-[#003865] rounded flex items-center justify-center">
                  <User className="w-5 h-5 text-white flex-shrink-0" />
                </div>
                <span>Personal Information</span>
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded flex-wrap gap-3">
                  <div className="flex items-center gap-3 whitespace-nowrap">
                    <div className="w-8 h-8 bg-[#003865] rounded flex items-center justify-center">
                      <User className="w-4 h-4 text-white flex-shrink-0" />
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">Full Name</span>
                  </div>
                  <span className="text-base text-gray-900 font-bold whitespace-nowrap">{user.fullName}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded flex-wrap gap-3">
                  <div className="flex items-center gap-3 whitespace-nowrap">
                    <div className="w-8 h-8 bg-[#003865] rounded flex items-center justify-center">
                      <Mail className="w-4 h-4 text-white flex-shrink-0" />
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">Email Address</span>
                  </div>
                  <span className="text-sm text-gray-900 font-bold break-all md:break-normal">{user.email}</span>
                </div>
              </div>
            </div>

            {/* Service Recognition */}
            <div className="bg-white border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-[#003865] mb-5 flex items-center gap-2 border-b border-gray-200 pb-3 uppercase tracking-wide text-sm">
                <div className="w-10 h-10 bg-[#003865] rounded flex items-center justify-center">
                  <Award className="w-5 h-5 text-white flex-shrink-0" />
                </div>
                <span>Service Recognition</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Points Card */}
                <div className="bg-[#003865] border border-[#003865] rounded p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white/20 rounded flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-white">Service Points</h3>
                  </div>
                  <p className="text-5xl font-bold text-white mb-2">{user.points || 0}</p>
                  <p className="text-blue-100 font-medium text-sm">Community Contribution Score</p>
                </div>

                {/* Badge Card */}
                <div className="bg-green-700 border border-green-700 rounded p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white/20 rounded flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-white">Current Badge</h3>
                  </div>
                  <p className="text-3xl font-bold text-white mb-2">{getBadge(user.points || 0)}</p>
                  <p className="text-green-100 font-medium text-sm">Service Level Recognition</p>
                </div>
              </div>
            </div>
          </div>

          {/* Share Achievement Section */}
          <div className="space-y-5">
            <div className="bg-white border border-gray-200 shadow-sm p-6">
              <h2 className="text-base font-bold text-[#003865] mb-3 flex items-center gap-2 border-b border-gray-200 pb-3 uppercase tracking-wide text-sm">
                <div className="w-8 h-8 bg-[#003865] rounded flex items-center justify-center">
                  <Award className="w-4 h-4 text-white flex-shrink-0" />
                </div>
                <span>Share Recognition</span>
              </h2>
              <p className="text-gray-700 text-xs mb-5">
                Share your community service achievements and encourage others to participate in public service initiatives.
              </p>
              <div className="flex justify-center">
                <AchievementShare user={user} />
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-gray-50 border border-gray-200 rounded p-5">
              <h3 className="font-semibold text-[#003865] mb-3 text-sm flex items-center gap-2 uppercase tracking-wide">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Account Status
              </h3>
              <div className="space-y-2 text-xs text-gray-700">
                <div className="flex justify-between items-center p-2 bg-white rounded border border-gray-200">
                  <span className="font-medium">Member Since:</span>
                  <span className="font-semibold">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded border border-gray-200">
                  <span className="font-medium">Account Type:</span>
                  <span className="font-semibold">Community Member</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded border border-gray-200">
                  <span className="font-medium">Verification:</span>
                  <span className="font-semibold text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 shadow-sm p-5">
              <h3 className="font-semibold text-[#003865] mb-3 text-sm uppercase tracking-wide">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left text-xs text-[#003865] hover:text-[#002D4F] py-2.5 px-3 rounded border border-gray-200 hover:bg-gray-50 transition-colors font-medium hover:border-[#003865]">
                  Update Profile Information
                </button>
                <button className="w-full text-left text-xs text-[#003865] hover:text-[#002D4F] py-2.5 px-3 rounded border border-gray-200 hover:bg-gray-50 transition-colors font-medium hover:border-[#003865]">
                  View Service History
                </button>
                <button className="w-full text-left text-xs text-[#003865] hover:text-[#002D4F] py-2.5 px-3 rounded border border-gray-200 hover:bg-gray-50 transition-colors font-medium hover:border-[#003865]">
                  Privacy Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Information */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-600 font-medium">
            Municipal Corporation Public Service Portal • Citizen Profile System
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            नेपाल सरकार | Government of Nepal
          </p>
        </div>
      </div>
    </div>
  );
}