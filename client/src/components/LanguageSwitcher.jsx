import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "np", name: "नेपाली", flag: "🇳🇵" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition text-white font-semibold"
      >
        <span className="text-xl">{currentLanguage.flag}</span>
        <span>{currentLanguage.name}</span>
        <span className="text-sm">▼</span>
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl z-50 min-w-[150px] border border-gray-200">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center gap-2 ${
                  i18n.language === lang.code
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-gray-700"
                } ${lang.code === "en" ? "rounded-t-lg" : "rounded-b-lg"}`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span>{lang.name}</span>
                {i18n.language === lang.code && (
                  <span className="ml-auto">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

