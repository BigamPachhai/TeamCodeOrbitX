import { Target, Shield, Users, Zap, MapPin, Award, TrendingUp, CheckCircle } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Official Government Header */}
        <div className="bg-white border-l-4 border-[#003865] shadow-md mb-8 p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-[#003865] rounded flex items-center justify-center flex-shrink-0">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#003865] mb-1">
                About This Portal
              </h1>
              <p className="text-gray-600 text-sm">
                रुपन्देही जिल्ला | Rupandehi District Administration Office
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Public Grievance Management System
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white border border-gray-200 shadow-sm p-8 mb-8">
          <p className="text-gray-700 leading-relaxed text-base mb-6">
            The Rupandehi Public Issue Reporting Portal is a citizen-focused digital
            platform created to improve transparency, accountability, and efficiency
            across local government bodies. It enables residents to report local
            issues such as waste, damaged roads, drinking water problems, electrical
            failures, and more.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Mission Section */}
            <div className="bg-gray-50 border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4 border-b border-gray-200 pb-3">
                <div className="w-12 h-12 bg-[#003865] rounded flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#003865]">Our Mission</h2>
              </div>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-sm">Improve public service delivery</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-sm">Empower citizens through real-time reporting</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-sm">Enhance transparency between citizens and government</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-sm">Streamline issue resolution workflows</span>
                </li>
              </ul>
            </div>

            {/* Key Features */}
            <div className="bg-gray-50 border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4 border-b border-gray-200 pb-3">
                <div className="w-12 h-12 bg-[#003865] rounded flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#003865]">Key Features</h2>
              </div>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-sm">AI-powered description generation</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-sm">GPS-based location detection</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-sm">Heatmap visualization of issues</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-sm">Leaderboard for active contributors</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-sm">Admin dashboard for issue resolution</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 border-t border-gray-200 pt-6">
            <div className="bg-gray-50 border border-gray-200 p-5 text-center">
              <div className="w-10 h-10 bg-[#003865] rounded flex items-center justify-center mx-auto mb-3">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Secure & Verified</h3>
              <p className="text-xs text-gray-600">Municipal-verified system</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-5 text-center">
              <div className="w-10 h-10 bg-[#003865] rounded flex items-center justify-center mx-auto mb-3">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Community Driven</h3>
              <p className="text-xs text-gray-600">Citizen-powered platform</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-5 text-center">
              <div className="w-10 h-10 bg-[#003865] rounded flex items-center justify-center mx-auto mb-3">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Impact Recognition</h3>
              <p className="text-xs text-gray-600">Contribution tracking</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center bg-white border border-gray-200 p-5">
          <p className="text-xs text-gray-600 font-medium">
            Municipal Corporation Public Service Portal • Transparent Governance System
          </p>
          <p className="text-xs text-gray-500 mt-1">
            नेपाल सरकार | Government of Nepal
          </p>
        </div>
      </div>
    </div>
  );
}
