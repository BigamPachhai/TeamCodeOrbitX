import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Notifications from "./Notifications";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <nav className="w-full bg-red-700 text-white shadow-md px-6 py-4 flex justify-between items-center">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide hover:text-yellow-300"
        >
          {t("navbar.title")}
        </Link>

        <Link className="hover:text-yellow-300" to="/">{t("common.home")}</Link>
        <Link className="hover:text-yellow-300" to="/about">{t("common.about")}</Link>
        <Link className="hover:text-yellow-300" to="/faq">{t("common.faq")}</Link>
        <Link className="hover:text-yellow-300" to="/contact">{t("common.contact")}</Link>
        <Link className="hover:text-yellow-300" to="/stats">{t("common.stats")}</Link>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link
              to="/login"
              className="px-4 py-2 bg-white text-red-700 rounded shadow hover:bg-gray-100"
            >
              {t("common.login")}
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 bg-blue-800 text-white rounded shadow hover:bg-blue-900"
            >
              {t("common.register")}
            </Link>
          </>
        ) : (
          <>
            <Link className="hover:text-yellow-300" to="/feed">{t("common.feed")}</Link>
            <Link className="hover:text-yellow-300" to="/report">{t("common.report")}</Link>
            <Link className="hover:text-yellow-300" to="/heatmap">{t("common.heatmap")}</Link>
            <Link className="hover:text-yellow-300" to="/leaderboard">{t("common.leaderboard")}</Link>
            <Link className="hover:text-yellow-300" to="/profile">{t("common.profile")}</Link>

            {user?.role === "admin" && (
              <Link className="hover:text-yellow-300" to="/admin">{t("common.admin")}</Link>
            )}

            <Notifications />

            <LanguageSwitcher />

            <button
              onClick={logout}
              className="px-4 py-2 bg-white text-red-700 rounded shadow hover:bg-gray-100"
            >
              {t("common.logout")}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
