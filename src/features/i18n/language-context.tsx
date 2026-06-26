"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Language = "en" | "vi";

const languageStorageKey = "autoshorts.language";
const defaultLanguage: Language = "en";

const dictionary: Record<Language, Record<string, string>> = {
  en: {
    "language.label": "Language",
    "language.english": "English",
    "language.vietnamese": "Vietnamese",
    "topbar.logout": "Logout",
    "topbar.userFallback": "User",
    "sidebar.appName": "AutoShorts AI",
    "sidebar.title": "Video Automation",
    "sidebar.subtitle": "AI workflows for creators",
    "nav.overview": "Overview",
    "nav.generate": "Generate",
    "nav.jobs": "Jobs",
    "nav.analytics": "Analytics",
    "nav.topics": "Topics",
    "nav.news": "News",
    "nav.batch": "Batch",
    "nav.channels": "Channels",
    "nav.characters": "Characters",
    "nav.campaigns": "Campaigns",
    "nav.tiktok": "TikTok",
    "nav.youtube": "YouTube",
    "nav.instagram": "Instagram",
    "nav.billing": "Billing",
    "nav.guide": "Guide",
    "nav.admin.section": "Admin",
    "nav.admin.overview": "Admin Overview",
    "nav.admin.users": "Users",
    "nav.admin.jobs": "All Jobs",
    "nav.admin.news": "News (global)",
    "nav.admin.settings": "Settings",
    "shell.loadingWorkspace": "Loading your workspace...",
    "shell.sessionExpired": "Session expired",
    "shell.signInAgain": "Sign in again",
    "shell.metadataFallback": "Could not load frontend metadata. Forms may fallback to manual values.",
    "guide.title": "User Guide",
    "guide.description":
      "Detailed operating guide from setup to generation, review, and publish workflow.",
  },
  vi: {
    "language.label": "NgÃ´n ngá»¯",
    "language.english": "Tiáº¿ng Anh",
    "language.vietnamese": "Tiáº¿ng Viá»‡t",
    "topbar.logout": "ÄÄƒng xuáº¥t",
    "topbar.userFallback": "NgÆ°á»i dÃ¹ng",
    "sidebar.appName": "AutoShorts AI",
    "sidebar.title": "Tá»± Ä‘á»™ng hÃ³a video",
    "sidebar.subtitle": "Quy trÃ¬nh AI cho nhÃ  sÃ¡ng táº¡o",
    "nav.overview": "Tá»•ng quan",
    "nav.generate": "Táº¡o video",
    "nav.jobs": "CÃ´ng viá»‡c",
    "nav.analytics": "PhÃ¢n tÃ­ch",
    "nav.topics": "Chá»§ Ä‘á»",
    "nav.batch": "Táº¡o hÃ ng loáº¡t",
    "nav.news": "Tin tá»©c",
    "nav.channels": "KÃªnh",
    "nav.characters": "NhÃ¢n váº­t",
    "nav.campaigns": "Chiáº¿n dá»‹ch",
    "nav.tiktok": "TikTok",
    "nav.youtube": "YouTube",
    "nav.instagram": "Instagram",
    "nav.billing": "Thanh toÃ¡n",
    "nav.guide": "HÆ°á»›ng dáº«n",
    "shell.loadingWorkspace": "Äang táº£i khÃ´ng gian lÃ m viá»‡c...",
    "shell.sessionExpired": "PhiÃªn Ä‘Äƒng nháº­p Ä‘Ã£ háº¿t háº¡n",
    "shell.signInAgain": "ÄÄƒng nháº­p láº¡i",
    "shell.metadataFallback": "KhÃ´ng táº£i Ä‘Æ°á»£c metadata frontend. Form cÃ³ thá»ƒ dÃ¹ng giÃ¡ trá»‹ nháº­p tay.",
    "guide.title": "HÆ°á»›ng dáº«n ngÆ°á»i dÃ¹ng",
    "guide.description":
      "HÆ°á»›ng dáº«n chi tiáº¿t tá»« thiáº¿t láº­p Ä‘áº¿n táº¡o video, review vÃ  publish.",
  },
};

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, fallback?: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") {
      return defaultLanguage;
    }

    const stored = window.localStorage.getItem(languageStorageKey);
    if (stored === "en" || stored === "vi") {
      return stored;
    }

    return defaultLanguage;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(languageStorageKey, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => {
    return {
      language,
      setLanguage: (nextLanguage: Language) => setLanguageState(nextLanguage),
      t: (key: string, fallback?: string) => {
        return dictionary[language][key] || dictionary.en[key] || fallback || key;
      },
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useI18n must be used within LanguageProvider");
  }
  return context;
}
