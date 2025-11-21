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
    <nav className="w-full bg-[#003865] text-white shadow-lg border-b-4 border-[#DC143C]">
      {/* Top Government Banner */}
      <div className="bg-[#003865] text-xs text-white/80 py-1 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span>नेपाल सरकार | Government of Nepal</span>
          <span>रुपन्देही जिल्ला | Rupandehi District</span>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex justify-between items-center gap-4">
          {/* LEFT SIDE */}
          <div className="flex items-center gap-6 min-w-0">
            <Link
              to="/"
              className="flex items-center gap-3 flex-shrink-0"
            >
              {/* Government Emblem Placeholder */}
              <div className="w-12 h-12 bg-white/10 rounded border-2 border-white/20 flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold tracking-wide whitespace-nowrap">
                  {t("navbar.title")}
                </div>
                <div className="text-xs text-white/70 font-medium">
                  Public Grievance Management System
                </div>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1 border-l border-white/20 pl-6">
              <Link className="px-3 py-2 hover:bg-white/10 transition-colors text-sm font-medium whitespace-nowrap" to="/">
                <Home className="w-4 h-4 inline mr-1" />
                {t("common.home")}
              </Link>
              <Link className="px-3 py-2 hover:bg-white/10 transition-colors text-sm font-medium whitespace-nowrap" to="/about">
                <Info className="w-4 h-4 inline mr-1" />
                {t("common.about")}
              </Link>
              <Link className="px-3 py-2 hover:bg-white/10 transition-colors text-sm font-medium whitespace-nowrap" to="/faq">
                <HelpCircle className="w-4 h-4 inline mr-1" />
                {t("common.faq")}
              </Link>
              <Link className="px-3 py-2 hover:bg-white/10 transition-colors text-sm font-medium whitespace-nowrap" to="/contact">
                <Mail className="w-4 h-4 inline mr-1" />
                {t("common.contact")}
              </Link>
              <Link className="px-3 py-2 hover:bg-white/10 transition-colors text-sm font-medium whitespace-nowrap" to="/stats">
                <BarChart3 className="w-4 h-4 inline mr-1" />
                {t("common.stats")}
              </Link>
            </div>
          </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        {!user ? (
          <>
            <Link
              to="/login"
              className="px-4 py-2 bg-white text-[#003865] rounded border hover:bg-gray-50 transition-colors text-sm font-semibold flex items-center gap-2 whitespace-nowrap"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">{t("common.login")}</span>
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 bg-[#DC143C] text-white rounded border border-[#DC143C] hover:bg-[#B91226] transition-colors text-sm font-semibold flex items-center gap-2 whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">{t("common.register")}</span>
            </Link>
          </>
        ) : (
          <>
            <div className="hidden lg:flex items-center gap-1 border-r border-white/20 pr-4 mr-4">
              <Link className="px-3 py-2 hover:bg-white/10 transition-colors text-sm font-medium whitespace-nowrap" to="/feed">
                <FileText className="w-4 h-4 inline mr-1" />
                {t("common.feed")}
              </Link>
              <Link className="px-3 py-2 hover:bg-white/10 transition-colors text-sm font-medium whitespace-nowrap" to="/report">
                <MapPin className="w-4 h-4 inline mr-1" />
                {t("common.report")}
              </Link>
              <Link className="px-3 py-2 hover:bg-white/10 transition-colors text-sm font-medium whitespace-nowrap" to="/heatmap">
                <MapPin className="w-4 h-4 inline mr-1" />
                {t("common.heatmap")}
              </Link>
              <Link className="px-3 py-2 hover:bg-white/10 transition-colors text-sm font-medium whitespace-nowrap" to="/leaderboard">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                {t("common.leaderboard")}
              </Link>
              <Link className="px-3 py-2 hover:bg-white/10 transition-colors text-sm font-medium whitespace-nowrap" to="/profile">
                <Award className="w-4 h-4 inline mr-1" />
                {t("common.profile")}
              </Link>

              {user?.role === "admin" && (
                <Link className="px-3 py-2 hover:bg-white/10 transition-colors text-sm font-medium whitespace-nowrap bg-white/5" to="/admin">
                  <Shield className="w-4 h-4 inline mr-1" />
                  {t("common.admin")}
                </Link>
              )}
            </div>

            <Notifications />

            <LanguageSwitcher />

            <button
              onClick={logout}
              className="px-4 py-2 bg-white/10 text-white rounded border border-white/20 hover:bg-white/20 transition-colors text-sm font-semibold flex items-center gap-2 whitespace-nowrap"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{t("common.logout")}</span>
            </button>
          </>
        )}
        </div>
        </div>
      </div>
    </nav>
  );
}