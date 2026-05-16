"use client";

import { useI18n, type Language } from "@/features/i18n/language-context";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();

  return (
    <label className="flex items-center gap-1.5">
      <span className="hidden text-[12px] tracking-[-0.12px] text-[#7a7a7a] lg:inline">
        {t("language.label")}
      </span>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        aria-label={t("language.label")}
        className="h-8 rounded-full border border-[rgba(0,0,0,0.08)] bg-white px-3 text-[12px] tracking-[-0.12px] text-[#1d1d1f] focus:outline-2 focus:outline-[#0071e3] cursor-pointer appearance-none"
      >
        <option value="en">{t("language.english")}</option>
        <option value="vi">{t("language.vietnamese")}</option>
      </select>
    </label>
  );
}
