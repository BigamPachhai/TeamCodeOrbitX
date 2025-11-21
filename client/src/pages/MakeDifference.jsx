import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Heart,
  Users,
  Award,
  TrendingUp,
  CheckCircle,
  Star,
  Target,
  Zap,
  Globe,
  HandHeart,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

export default function MakeDifference() {
  const { t } = useTranslation();

  const impactStats = [
    {
      icon: <CheckCircle className="w-8 h-8" />,
      number: "2,500+",
      label: t("makeDifference.stats.resolved"),
      color: "text-green-600",
    },
    {
      icon: <Users className="w-8 h-8" />,
      number: "15,000+",
      label: t("makeDifference.stats.users"),
      color: "text-blue-600",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      number: "50,000+",
      label: t("makeDifference.stats.impacted"),
      color: "text-red-600",
    },
    {
      icon: <Award className="w-8 h-8" />,
      number: "98%",
      label: t("makeDifference.stats.satisfaction"),
      color: "text-yellow-600",
    },
  ];

  const waysToHelp = [
    {
      icon: <Target className="w-10 h-10" />,
      title: t("makeDifference.ways.report.title"),
      description: t("makeDifference.ways.report.description"),
      action: t("makeDifference.ways.report.action"),
      link: "/report",
      color: "from-red-500 to-red-600",
    },
    {
      icon: <Heart className="w-10 h-10" />,
      title: t("makeDifference.ways.support.title"),
      description: t("makeDifference.ways.support.description"),
      action: t("makeDifference.ways.support.action"),
      link: "/feed",
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: <Lightbulb className="w-10 h-10" />,
      title: t("makeDifference.ways.share.title"),
      description: t("makeDifference.ways.share.description"),
      action: t("makeDifference.ways.share.action"),
      link: "/leaderboard",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: t("makeDifference.ways.community.title"),
      description: t("makeDifference.ways.community.description"),
      action: t("makeDifference.ways.community.action"),
      link: "/heatmap",
      color: "from-blue-500 to-blue-600",
    },
  ];

  const successStories = [
    {
      title: t("makeDifference.stories.story1.title"),
      description: t("makeDifference.stories.story1.description"),
      impact: t("makeDifference.stories.story1.impact"),
    },
    {
      title: t("makeDifference.stories.story2.title"),
      description: t("makeDifference.stories.story2.description"),
      impact: t("makeDifference.stories.story2.impact"),
    },
    {
      title: t("makeDifference.stories.story3.title"),
      description: t("makeDifference.stories.story3.description"),
      impact: t("makeDifference.stories.story3.impact"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white bg-opacity-20 rounded-full p-4">
              <HandHeart className="w-16 h-16" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            {t("makeDifference.hero.title")}
          </h1>
          <p className="text-xl text-red-100 max-w-3xl mx-auto mb-8">
            {t("makeDifference.hero.subtitle")}
          </p>
          <Link
            to="/report"
            className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-4 rounded-lg font-bold hover:bg-red-50 transition shadow-lg text-lg"
          >
            {t("makeDifference.hero.cta")}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          {t("makeDifference.impact.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {impactStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition"
            >
              <div className={`${stat.color} flex justify-center mb-4`}>
                {stat.icon}
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Ways to Help */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {t("makeDifference.ways.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {waysToHelp.map((way, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition"
              >
                <div
                  className={`bg-gradient-to-br ${way.color} rounded-lg p-4 w-fit mb-4 text-white`}
                >
                  {way.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {way.title}
                </h3>
                <p className="text-gray-600 mb-6">{way.description}</p>
                <Link
                  to={way.link}
                  className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition"
                >
                  {way.action}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          {t("makeDifference.stories.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {successStories.map((story, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200 shadow-md"
            >
              <Star className="w-8 h-8 text-yellow-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {story.title}
              </h3>
              <p className="text-gray-600 mb-4">{story.description}</p>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-semibold">
                {story.impact}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Globe className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            {t("makeDifference.cta.title")}
          </h2>
          <p className="text-xl text-red-100 mb-8">
            {t("makeDifference.cta.description")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-bold hover:bg-red-50 transition shadow-lg"
            >
              {t("makeDifference.cta.button1")}
            </Link>
            <Link
              to="/report"
              className="bg-red-800 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-900 transition shadow-lg"
            >
              {t("makeDifference.cta.button2")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
