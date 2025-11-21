import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Globe,
} from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();

  const quickLinks = [
    { path: "/", label: t("common.home") },
    { path: "/about", label: t("common.about") },
    { path: "/report", label: t("common.report") },
    { path: "/feed", label: t("common.feed") },
    { path: "/heatmap", label: t("common.heatmap") },
    { path: "/leaderboard", label: t("common.leaderboard") },
  ];

  const resources = [
    { path: "/faq", label: t("common.faq") },
    { path: "/contact", label: t("common.contact") },
    { path: "/stats", label: t("common.stats") },
    { path: "/advanced-reporting", label: t("footer.advancedReporting") },
    { path: "/make-difference", label: t("footer.makeDifference") },
  ];

  return (
    <footer className="bg-[#003865] text-white border-t-4 border-[#DC143C] mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t("footer.aboutTitle")}</h3>
            <p className="text-blue-200 text-sm mb-4">
              {t("footer.aboutDescription")}
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-200 hover:text-white transition"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-200 hover:text-white transition"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-200 hover:text-white transition"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-blue-200 hover:text-white transition text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t("footer.resources")}</h3>
            <ul className="space-y-2">
              {resources.map((resource, index) => (
                <li key={index}>
                  <Link
                    to={resource.path}
                    className="text-blue-200 hover:text-white transition text-sm"
                  >
                    {resource.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t("footer.contactUs")}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
                <span className="text-blue-200">
                  {t("footer.address")}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-300 flex-shrink-0" />
                <a
                  href="tel:+97771520000"
                  className="text-blue-200 hover:text-white transition"
                >
                  {t("footer.phone")}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-300 flex-shrink-0" />
                <a
                  href="mailto:info@rupandehi.gov.np"
                  className="text-blue-200 hover:text-white transition"
                >
                  {t("footer.email")}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-300 flex-shrink-0" />
                <a
                  href="https://rupandehi.gov.np"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-white transition"
                >
                  {t("footer.website")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/80 text-xs text-center md:text-left">
              © {new Date().getFullYear()} {t("footer.copyright", { year: new Date().getFullYear() })}
            </p>
            <p className="text-white/80 text-xs text-center md:text-right">
              {t("footer.government")} • {t("footer.district")} • All Rights Reserved
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <p className="text-white/70 text-xs">
              नेपाल सरकार | Government of Nepal | रुपन्देही जिल्ला | Rupandehi District
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

