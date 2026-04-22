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
    "nav.topics": "Topics",
    "nav.batch": "Batch",
    "nav.channels": "Channels",
    "nav.characters": "Characters",
    "nav.campaigns": "Campaigns",
    "nav.tiktok": "TikTok",
    "nav.guide": "Guide",
    "shell.loadingWorkspace": "Loading your workspace...",
    "shell.sessionExpired": "Session expired",
    "shell.signInAgain": "Sign in again",
    "shell.metadataFallback": "Could not load frontend metadata. Forms may fallback to manual values.",
    "guide.title": "User Guide",
    "guide.description":
      "Detailed operating guide from setup to generation, review, and publish workflow.",
  },
  vi: {
    "language.label": "Ngôn ngữ",
    "language.english": "Tiếng Anh",
    "language.vietnamese": "Tiếng Việt",
    "topbar.logout": "Đăng xuất",
    "topbar.userFallback": "Người dùng",
    "sidebar.appName": "AutoShorts AI",
    "sidebar.title": "Tự động hóa video",
    "sidebar.subtitle": "Quy trình AI cho nhà sáng tạo",
    "nav.overview": "Tổng quan",
    "nav.generate": "Tạo video",
    "nav.jobs": "Công việc",
    "nav.topics": "Chủ đề",
    "nav.batch": "Tạo hàng loạt",
    "nav.channels": "Kênh",
    "nav.characters": "Nhân vật",
    "nav.campaigns": "Chiến dịch",
    "nav.tiktok": "TikTok",
    "nav.guide": "Hướng dẫn",
    "shell.loadingWorkspace": "Đang tải không gian làm việc...",
    "shell.sessionExpired": "Phiên đăng nhập đã hết hạn",
    "shell.signInAgain": "Đăng nhập lại",
    "shell.metadataFallback": "Không tải được metadata frontend. Form có thể dùng giá trị nhập tay.",
    "guide.title": "Hướng dẫn người dùng",
    "guide.description":
      "Hướng dẫn chi tiết từ thiết lập đến tạo video, review và publish.",
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
