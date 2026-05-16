"use client";

import { useI18n, type Language } from "@/features/i18n/language-context";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();

  return (
    <label className="flex items-center gap-1.5">
      <span className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-[#686157] lg:inline">
        {t("language.label")}
      </span>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        aria-label={t("language.label")}
        className="h-8 cursor-pointer appearance-none rounded-full border border-[#d8d0c1] bg-[#fffaf0] px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[#11100e] focus:outline-2 focus:outline-[#4b6fff]"
      >
        <option value="en">{t("language.english")}</option>
        <option value="vi">{t("language.vietnamese")}</option>
      </select>
    </label>
  );
}
