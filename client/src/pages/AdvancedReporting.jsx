import { useTranslation } from "react-i18next";
import {
  Camera,
  MapPin,
  Bot,
  Shield,
  Clock,
  Users,
  CheckCircle,
  TrendingUp,
  BarChart3,
  FileText,
  Download,
  Filter,
  Search,
  Calendar,
  AlertCircle,
  Zap,
  Target,
  Award,
  Database,
  Cloud,
  Smartphone,
} from "lucide-react";

export default function AdvancedReporting() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: t("advancedReporting.analytics.title"),
      description: t("advancedReporting.analytics.description"),
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <Filter className="w-8 h-8" />,
      title: t("advancedReporting.filtering.title"),
      description: t("advancedReporting.filtering.description"),
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: t("advancedReporting.reports.title"),
      description: t("advancedReporting.reports.description"),
      color: "from-green-500 to-green-600",
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: t("advancedReporting.export.title"),
      description: t("advancedReporting.export.description"),
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: t("advancedReporting.timeline.title"),
      description: t("advancedReporting.timeline.description"),
      color: "from-red-500 to-red-600",
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: t("advancedReporting.search.title"),
      description: t("advancedReporting.search.description"),
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  const capabilities = [
    {
      icon: <Database className="w-6 h-6" />,
      title: t("advancedReporting.capabilities.data.title"),
      items: [
        t("advancedReporting.capabilities.data.item1"),
        t("advancedReporting.capabilities.data.item2"),
        t("advancedReporting.capabilities.data.item3"),
        t("advancedReporting.capabilities.data.item4"),
      ],
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: t("advancedReporting.capabilities.cloud.title"),
      items: [
        t("advancedReporting.capabilities.cloud.item1"),
        t("advancedReporting.capabilities.cloud.item2"),
        t("advancedReporting.capabilities.cloud.item3"),
        t("advancedReporting.capabilities.cloud.item4"),
      ],
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: t("advancedReporting.capabilities.mobile.title"),
      items: [
        t("advancedReporting.capabilities.mobile.item1"),
        t("advancedReporting.capabilities.mobile.item2"),
        t("advancedReporting.capabilities.mobile.item3"),
        t("advancedReporting.capabilities.mobile.item4"),
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white bg-opacity-20 rounded-full p-4">
              <BarChart3 className="w-16 h-16" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            {t("advancedReporting.hero.title")}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t("advancedReporting.hero.subtitle")}
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          {t("advancedReporting.features.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div
                className={`bg-gradient-to-br ${feature.color} rounded-lg p-4 w-fit mb-4 text-white`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Capabilities Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {t("advancedReporting.capabilities.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {capabilities.map((capability, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
              >
                <div className="text-blue-600 mb-4">{capability.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {capability.title}
                </h3>
                <ul className="space-y-2">
                  {capability.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-start gap-2 text-gray-600"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          {t("advancedReporting.benefits.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border border-blue-200">
            <Target className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {t("advancedReporting.benefits.efficiency.title")}
            </h3>
            <p className="text-gray-700">
              {t("advancedReporting.benefits.efficiency.description")}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 border border-purple-200">
            <Award className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {t("advancedReporting.benefits.insights.title")}
            </h3>
            <p className="text-gray-700">
              {t("advancedReporting.benefits.insights.description")}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 border border-green-200">
            <Zap className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {t("advancedReporting.benefits.speed.title")}
            </h3>
            <p className="text-gray-700">
              {t("advancedReporting.benefits.speed.description")}
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-8 border border-orange-200">
            <Shield className="w-12 h-12 text-orange-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {t("advancedReporting.benefits.security.title")}
            </h3>
            <p className="text-gray-700">
              {t("advancedReporting.benefits.security.description")}
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t("advancedReporting.cta.title")}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {t("advancedReporting.cta.description")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/report"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition shadow-lg"
            >
              {t("advancedReporting.cta.button1")}
            </a>
            <a
              href="/stats"
              className="bg-blue-800 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-900 transition shadow-lg"
            >
              {t("advancedReporting.cta.button2")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
