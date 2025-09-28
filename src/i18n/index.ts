// i18n initialization (using require form to avoid missing type error if typings not resolved yet)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const i18nextModule = require("i18next");
const i18n = i18nextModule.default || i18nextModule;
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";

// JSON resource imports (ensure "resolveJsonModule": true in tsconfig)
// JSON resource imports
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import vi from "./vi.json";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import en from "./en.json";

const deviceLocales = Localization.getLocales?.() || [];
const primary = deviceLocales[0]?.languageCode || "en";

// Initialize with detected language first
i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  lng: primary.startsWith("vi") ? "vi" : "en",
  fallbackLng: "en",
  resources: {
    vi: { translation: vi },
    en: { translation: en },
  },
  interpolation: { escapeValue: false },
});

// Attempt to load persisted language preference
AsyncStorage.getItem("app.language")
  .then((lang) => {
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  })
  // eslint-disable-next-line no-console
  .catch((e) => console.warn("Language load failed", e));

// Helper to persist language on change
i18n.on("languageChanged", (lng: string) => {
  AsyncStorage.setItem("app.language", lng).catch(() => {});
});

export default i18n;
export { i18n };
