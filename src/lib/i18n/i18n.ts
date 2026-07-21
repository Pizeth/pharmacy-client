// src/lib/i18n.ts
import { API_URL } from "@/types/constants";
import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.razeth.com";

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: `${API_URL}/api/translations/{{lng}}`,
    },
    lng: "km",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    react: { useSuspense: false }, // avoids Suspense flash while dictionary loads
  });

export default i18n;
