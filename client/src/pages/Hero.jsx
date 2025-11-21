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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/10">
      {/* Enhanced Hero Banner */}
      <div className="relative bg-gradient-to-b from-blue-900 to-blue-950">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute top-10 left-10 w-24 h-24 border-t-2 border-l-2 border-white rounded-tl-xl"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 border-b-2 border-r-2 border-white rounded-br-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/3 right-1/4 w-12 h-12 border border-white rotate-45"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
              <CheckCircle className="w-4 h-4 text-green-300 mr-2" />
              <span className="text-white/90 text-sm font-medium">
                Official Rupandehi Municipal Partnership
              </span>
            </div>

            {/* Main Heading */}
            <div className="mb-6">
              <div className="w-20 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full mx-auto mb-8"></div>
              <h1 className="text-white text-4xl md:text-6xl font-bold mb-4 tracking-tight leading-tight">
                रुपन्देही सार्वजनिक समस्या
              </h1>
              <h2 className="text-white/95 text-xl md:text-3xl font-semibold mb-6">
                Civic Issue Reporting Portal
              </h2>
              <p className="text-red-100 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                सहज, छिटो र प्रभावकारी समस्या समाधानको लागि - आफ्नो समुदायलाई
                राम्रो बनाउन सहयोग गर्नुहोस्
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mt-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="text-yellow-400 mr-2">{stat.icon}</div>
                    <div className="text-white text-2xl font-bold">
                      {stat.number}
                    </div>
                  </div>
                  <div className="text-red-100 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-12 text-white"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              fill="currentColor"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              fill="currentColor"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>

   

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Advanced Reporting Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leverage cutting-edge technology to report and track civic issues
              efficiently
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
                ></div>

                {/* Icon */}
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className="text-white">{feature.icon}</div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced CTA Section */}
          <div className="text-center mb-20">
            <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-12 text-white overflow-hidden">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/3 rounded-full animate-pulse delay-500"></div>
              </div>

              {/* Floating Icons */}
              <div className="absolute top-8 left-8 opacity-20">
                <Star className="w-8 h-8" />
              </div>
              <div className="absolute bottom-8 right-8 opacity-20">
                <Award className="w-8 h-8" />
              </div>

              <div className="relative z-10">
                {/* Impact Badge */}
                <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-8">
                  <Zap className="w-5 h-5 text-yellow-300 mr-2" />
                  <span className="text-white/95 font-semibold">
                    Join 15,000+ Active Citizens
                  </span>
                </div>

                <h3 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
                  Ready to Make a Difference?
                </h3>
                <p className="text-blue-100 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                  Your voice matters! Join thousands of citizens transforming
                  <span className="text-yellow-300 font-semibold">
                    {" "}
                    Rupandehi{" "}
                  </span>
                  into a better place. Every report creates real, measurable
                  impact.
                </p>

                {/* Impact Stories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
                  {impactStories.map((story, index) => (
                    <div
                      key={index}
                      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                    >
                      <div className="text-yellow-300 mb-4 flex justify-center">
                        {story.icon}
                      </div>
                      <h4 className="text-white font-bold text-lg mb-2">
                        {story.title}
                      </h4>
                      <p className="text-blue-100 text-sm mb-3">
                        {story.description}
                      </p>
                      <div className="text-yellow-300 text-xs font-semibold">
                        {story.impact}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row justify-center gap-4 items-center">
                  {!user ? (
                    <>
                      <Link
                        className="px-10 py-5 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 rounded-2xl hover:from-yellow-300 hover:to-amber-400 transition-all duration-300 font-bold flex items-center gap-3 shadow-2xl hover:shadow-3xl hover:scale-105 transform group"
                        to="/register"
                      >
                        <Users className="w-6 h-6" />
                        Start Making Impact
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link
                        className="px-10 py-5 bg-white/20 backdrop-blur-sm border-2 border-white text-white rounded-2xl hover:bg-white/30 transition-all duration-300 font-bold flex items-center gap-3 hover:scale-105 transform"
                        to="/login"
                      >
                        <MessageCircle className="w-6 h-6" />
                        Continue Journey
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        className="px-10 py-5 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 rounded-2xl hover:from-yellow-300 hover:to-amber-400 transition-all duration-300 font-bold flex items-center gap-3 shadow-2xl hover:shadow-3xl hover:scale-105 transform group"
                        to="/report"
                      >
                        <Camera className="w-6 h-6" />
                        Report New Issue
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link
                        className="px-10 py-5 bg-white/20 backdrop-blur-sm border-2 border-white text-white rounded-2xl hover:bg-white/30 transition-all duration-300 font-bold flex items-center gap-3 hover:scale-105 transform"
                        to="/feed"
                      >
                        <TrendingUp className="w-6 h-6" />
                        Track Progress
                      </Link>
                    </>
                  )}
                </div>

                {/* Trust Indicators */}
                <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Shield className="w-4 h-4 text-green-300" />
                    <span className="text-white">
                      Official Municipal Partner
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                    <CheckCircle className="w-4 h-4 text-blue-300" />
                    <span className="text-white">Secure & Verified</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                    <ThumbsUp className="w-4 h-4 text-yellow-300" />
                    <span className="text-white">98% Success Rate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}