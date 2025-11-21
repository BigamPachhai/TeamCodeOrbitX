import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import HeroAnimation from "../components/HeroAnimation";
import {
  Camera,
  MapPin,
  Bot,
  Shield,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  MessageCircle,
  Heart,
  Award,
  Target,
  Zap,
  ThumbsUp,
  Globe,
  Phone,
  Mail,
  Map,
} from "lucide-react";

export default function Hero() {
  const { user } = useAuth();

  const features = [
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Photo Evidence",
      description:
        "High-quality image capture with automatic optimization for clear documentation",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Precise Location",
      description: "Real-time GPS tracking with interactive map integration",
      color: "from-green-500 to-green-600",
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: "AI Analysis",
      description:
        "Smart categorization and priority assessment using advanced algorithms",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Verified System",
      description: "Municipal-verified reporting with authenticity checks",
      color: "from-red-500 to-red-600",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Real-time Tracking",
      description: "Live status updates and resolution progress monitoring",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Impact",
      description:
        "Collaborative platform where citizens support important issues",
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  const stats = [
    {
      number: "2,500+",
      label: "Issues Resolved",
      icon: <CheckCircle className="w-5 h-5" />,
    },
    {
      number: "98%",
      label: "Accuracy Rate",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      number: "24h",
      label: "Avg. Response",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      number: "15K+",
      label: "Active Users",
      icon: <Users className="w-5 h-5" />,
    },
  ];

  const impactStories = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Community Cleanup",
      description: "50+ waste spots cleared in last month",
      impact: "15K+ People Benefited",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Road Repairs",
      description: "Over 200 potholes fixed across city",
      impact: "Safe Commutes",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Street Lights",
      description: "150+ dark spots illuminated",
      impact: "Enhanced Safety",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Government Hero Banner */}
      <div className="relative bg-[#003865] border-b-4 border-[#DC143C]">
        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="text-center">
            {/* Official Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/10 border border-white/20 rounded mb-6">
              <CheckCircle className="w-4 h-4 text-white mr-2" />
              <span className="text-white text-sm font-medium">
                Official Government Portal
              </span>
            </div>

            {/* Main Heading */}
            <div className="mb-8">
              <h1 className="text-white text-3xl md:text-5xl font-bold mb-3 tracking-tight leading-tight">
                रुपन्देही सार्वजनिक समस्या
              </h1>
              <h2 className="text-white text-xl md:text-2xl font-semibold mb-4">
                Public Grievance Management System
              </h2>
              <div className="w-24 h-0.5 bg-white mx-auto mb-4"></div>
              <p className="text-white/90 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
                सहज, छिटो र प्रभावकारी समस्या समाधानको लागि - आफ्नो समुदायलाई राम्रो बनाउन सहयोग गर्नुहोस्
              </p>
              <p className="text-white/80 text-sm md:text-base max-w-3xl mx-auto mt-2">
                Easy, Fast, and Effective Problem Resolution - Help Make Your Community Better
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-12 border-t border-white/20 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="text-white mr-2">{stat.icon}</div>
                    <div className="text-white text-2xl font-bold">
                      {stat.number}
                    </div>
                  </div>
                  <div className="text-white/80 text-xs md:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

   

      {/* Features Section */}
      <div className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#003865] mb-3">
              System Features
            </h2>
            <div className="w-16 h-0.5 bg-[#003865] mx-auto mb-3"></div>
            <p className="text-base text-gray-600 max-w-3xl mx-auto">
              Comprehensive platform for reporting and tracking civic issues
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-[#003865] rounded flex items-center justify-center mb-4">
                  <div className="text-white">{feature.icon}</div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-[#003865] mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mb-12">
            <div className="bg-[#003865] border-l-4 border-[#DC143C] p-8 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Report Your Community Issues
              </h3>
              <p className="text-white/90 text-base mb-6 max-w-2xl mx-auto">
                Help improve your community by reporting issues and tracking their resolution progress
              </p>

              {/* Impact Stories */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
                {impactStories.map((story, index) => (
                  <div
                    key={index}
                    className="bg-white/10 border border-white/20 p-4"
                  >
                    <div className="text-white mb-3 flex justify-center">
                      {story.icon}
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-2">
                      {story.title}
                    </h4>
                    <p className="text-white/80 text-xs mb-2">
                      {story.description}
                    </p>
                    <div className="text-white/90 text-xs font-medium">
                      {story.impact}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row justify-center gap-3 items-center">
                {!user ? (
                  <>
                    <Link
                      className="px-8 py-3 bg-white text-[#003865] rounded hover:bg-gray-100 transition-colors font-semibold flex items-center gap-2 border border-white"
                      to="/register"
                    >
                      <Users className="w-5 h-5" />
                      Register Account
                    </Link>
                    <Link
                      className="px-8 py-3 bg-[#DC143C] text-white rounded hover:bg-[#B91226] transition-colors font-semibold flex items-center gap-2 border border-[#DC143C]"
                      to="/login"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Login
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      className="px-8 py-3 bg-white text-[#003865] rounded hover:bg-gray-100 transition-colors font-semibold flex items-center gap-2 border border-white"
                      to="/report"
                    >
                      <Camera className="w-5 h-5" />
                      Report New Issue
                    </Link>
                    <Link
                      className="px-8 py-3 bg-[#DC143C] text-white rounded hover:bg-[#B91226] transition-colors font-semibold flex items-center gap-2 border border-[#DC143C]"
                      to="/feed"
                    >
                      <TrendingUp className="w-5 h-5" />
                      View Issues Feed
                    </Link>
                  </>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 text-xs border-t border-white/20 pt-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-white" />
                  <span className="text-white/90">Official Government Portal</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span className="text-white/90">Secure & Verified System</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4 text-white" />
                  <span className="text-white/90">Transparent Process</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}