import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Notifications from "./Notifications";
import { useTranslation } from "react-i18next";
import {
  Home,
  Info,
  HelpCircle,
  Mail,
  BarChart3,
  LogIn,
  UserPlus,
  LogOut,
  FileText,
  MapPin,
  TrendingUp,
  Award,
  Shield,
  DollarSign,
  Layers,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <nav className="w-full bg-[#003865] text-white shadow-lg border-b-4 border-[#DC143C]">
      {/* Top Government Banner */}
      <div className="bg-[#003865] text-xs text-white/80 py-2 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span>नेपाल सरकार | Government of Nepal</span>
          <span>रुपन्देही जिल्ला | Rupandehi District</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
        <div className="flex items-center">
          {/* LEFT SIDE - Logo & Title */}
          <Link to="/" className="flex items-center gap-4 flex-shrink-0">
            <div className="w-14 h-14 bg-white/10 rounded border-2 border-white/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-wide">
                {t("navbar.title")}
              </div>
              <div className="text-xs text-white/70 font-medium">
                Public Grievance Management System
              </div>
            </div>
          </Link>

          {/* CENTER - Navigation Links */}
          <div className="hidden lg:flex items-center gap-3 flex-1 justify-center mx-8">
            {!user ? (
              <>
                <Link
                  className="px-4 py-2.5 hover:bg-white/10 transition-colors text-sm font-medium rounded"
                  to="/"
                >
                  <Home className="w-4 h-4 inline mr-2" />
                  {t("common.home")}
                </Link>
                <Link
                  className="px-4 py-2.5 hover:bg-white/10 transition-colors text-sm font-medium rounded"
                  to="/about"
                >
                  <Info className="w-4 h-4 inline mr-2" />
                  {t("common.about")}
                </Link>
                <Link
                  className="px-4 py-2.5 hover:bg-white/10 transition-colors text-sm font-medium rounded"
                  to="/faq"
                >
                  <HelpCircle className="w-4 h-4 inline mr-2" />
                  {t("common.faq")}
                </Link>
                <Link
                  className="px-4 py-2.5 hover:bg-white/10 transition-colors text-sm font-medium rounded"
                  to="/contact"
                >
                  <Mail className="w-4 h-4 inline mr-2" />
                  {t("common.contact")}
                </Link>
                <Link
                  className="px-4 py-2.5 hover:bg-white/10 transition-colors text-sm font-medium rounded"
                  to="/stats"
                >
                  <BarChart3 className="w-4 h-4 inline mr-2" />
                  {t("common.stats")}
                </Link>
              </>
            ) : (
              <>
                <Link
                  className="px-4 py-2.5 hover:bg-white/10 transition-colors text-sm font-medium rounded"
                  to="/feed"
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  {t("common.feed")}
                </Link>
                <Link
                  className="px-4 py-2.5 hover:bg-white/10 transition-colors text-sm font-medium rounded"
                  to="/report"
                >
                  <MapPin className="w-4 h-4 inline mr-2" />
                  {t("common.report")}
                </Link>
                <Link
                  className="px-4 py-2.5 hover:bg-white/10 transition-colors text-sm font-medium rounded"
                  to="/budget"
                >
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Budget
                </Link>
                <Link
                  className="px-4 py-2.5 hover:bg-white/10 transition-colors text-sm font-medium rounded"
                  to="/heatmap"
                >
                  <Layers className="w-4 h-4 inline mr-2" />
                  {t("common.heatmap")}
                </Link>
                <Link
                  className="px-4 py-2.5 hover:bg-white/10 transition-colors text-sm font-medium rounded"
                  to="/leaderboard"
                >
                  <TrendingUp className="w-4 h-4 inline mr-2" />
                  {t("common.leaderboard")}
                </Link>
                <Link
                  className="px-4 py-2.5 hover:bg-white/10 transition-colors text-sm font-medium rounded"
                  to="/profile"
                >
                  <Award className="w-4 h-4 inline mr-2" />
                  {t("common.profile")}
                </Link>
                {user?.role === "admin" && (
                  <Link
                    className="px-4 py-2.5 hover:bg-white/10 transition-colors text-sm font-medium rounded bg-white/5"
                    to="/admin"
                  >
                    <Shield className="w-4 h-4 inline mr-2" />
                    {t("common.admin")}
                  </Link>
                )}
              </>
            )}
          </div>

          {/* RIGHT SIDE - Auth & Actions */}
          <div className="flex items-center gap-4 flex-shrink-0 ml-auto">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2.5 bg-white text-[#003865] rounded hover:bg-gray-50 transition-colors text-sm font-semibold flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("common.login")}</span>
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-[#DC143C] text-white rounded hover:bg-[#B91226] transition-colors text-sm font-semibold flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {t("common.register")}
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Notifications />
                <button
                  onClick={logout}
                  className="px-5 py-2.5 bg-white/10 text-white rounded border border-white/20 hover:bg-white/20 transition-colors text-sm font-semibold flex items-center gap-2"
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
