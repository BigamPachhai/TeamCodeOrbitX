import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome: "Rupandehi Public Issue Reporting Portal",
      mission: "Together, let’s build a cleaner, safer, smarter Rupandehi.",
    },
  },
  np: {
    translation: {
      welcome: "रुपन्देही सार्वजनिक समस्या रिपोर्टिङ प्रणाली",
      mission: "सफा, सुरक्षित र स्मार्ट रुपन्देही निर्माण गरौँ।",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
