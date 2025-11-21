import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Notifications from "./Notifications";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { Home, Info, HelpCircle, Mail, BarChart3, LogIn, UserPlus, LogOut, FileText, MapPin, TrendingUp, Award, Shield } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <nav className="w-full bg-gradient-to-b from-blue-900 to-blue-950 text-white shadow-md px-4 sm:px-6 py-3 sm:py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <Link
            to="/"
            className="text-xl sm:text-2xl font-extrabold tracking-wide hover:text-yellow-300 whitespace-nowrap flex-shrink-0"
          >
            {t("navbar.title")}
          </Link>

          <div className="hidden md:flex items-center gap-3 sm:gap-4">
            <Link className="hover:text-yellow-300 transition-colors flex items-center gap-1 whitespace-nowrap" to="/">
              <Home className="w-4 h-4 flex-shrink-0" />
              <span>{t("common.home")}</span>
            </Link>
            <Link className="hover:text-yellow-300 transition-colors flex items-center gap-1 whitespace-nowrap" to="/about">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>{t("common.about")}</span>
            </Link>
            <Link className="hover:text-yellow-300 transition-colors flex items-center gap-1 whitespace-nowrap" to="/faq">
              <HelpCircle className="w-4 h-4 flex-shrink-0" />
              <span>{t("common.faq")}</span>
            </Link>
            <Link className="hover:text-yellow-300 transition-colors flex items-center gap-1 whitespace-nowrap" to="/contact">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span>{t("common.contact")}</span>
            </Link>
            <Link className="hover:text-yellow-300 transition-colors flex items-center gap-1 whitespace-nowrap" to="/stats">
              <BarChart3 className="w-4 h-4 flex-shrink-0" />
              <span>{t("common.stats")}</span>
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        {!user ? (
          <>
            <Link
              to="/login"
              className="px-3 sm:px-4 py-2 bg-white text-blue-700 rounded-lg shadow-md hover:bg-gray-100 transition-colors font-medium flex items-center gap-1 sm:gap-2 border border-blue-200 whitespace-nowrap"
            >
              <LogIn className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">{t("common.login")}</span>
            </Link>

            <Link
              to="/register"
              className="px-3 sm:px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-800 transition-colors font-medium flex items-center gap-1 sm:gap-2 border border-blue-600 whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">{t("common.register")}</span>
            </Link>
          </>
        ) : (
          <>
            <div className="hidden lg:flex items-center gap-2 sm:gap-3">
              <Link className="hover:text-yellow-300 transition-colors flex items-center gap-1 whitespace-nowrap" to="/feed">
                <FileText className="w-4 h-4 flex-shrink-0" />
                <span className="hidden xl:inline">{t("common.feed")}</span>
              </Link>
              <Link className="hover:text-yellow-300 transition-colors flex items-center gap-1 whitespace-nowrap" to="/report">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="hidden xl:inline">{t("common.report")}</span>
              </Link>
              <Link className="hover:text-yellow-300 transition-colors flex items-center gap-1 whitespace-nowrap" to="/heatmap">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="hidden xl:inline">{t("common.heatmap")}</span>
              </Link>
              <Link className="hover:text-yellow-300 transition-colors flex items-center gap-1 whitespace-nowrap" to="/leaderboard">
                <TrendingUp className="w-4 h-4 flex-shrink-0" />
                <span className="hidden xl:inline">{t("common.leaderboard")}</span>
              </Link>
              <Link className="hover:text-yellow-300 transition-colors flex items-center gap-1 whitespace-nowrap" to="/profile">
                <Award className="w-4 h-4 flex-shrink-0" />
                <span className="hidden xl:inline">{t("common.profile")}</span>
              </Link>

              {user?.role === "admin" && (
                <Link className="hover:text-yellow-300 transition-colors flex items-center gap-1 whitespace-nowrap" to="/admin">
                  <Shield className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden xl:inline">{t("common.admin")}</span>
                </Link>
              )}
            </div>

            <Notifications />

            <LanguageSwitcher />

            <button
              onClick={logout}
              className="px-3 sm:px-4 py-2 bg-white text-blue-700 rounded-lg shadow-md hover:bg-gray-100 transition-colors font-medium flex items-center gap-1 sm:gap-2 border border-blue-200 whitespace-nowrap"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">{t("common.logout")}</span>
            </button>
          </>
        )}
        </div>
      </div>
    </nav>
  );
}