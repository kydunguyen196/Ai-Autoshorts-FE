"use client";

import { useI18n, type Language } from "@/features/i18n/language-context";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();

  return (
    <label className="flex items-center gap-1.5">
      <span className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-muted lg:inline">
        {t("language.label")}
      </span>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        aria-label={t("language.label")}
        className="h-8 cursor-pointer appearance-none rounded-full border border-border bg-surface px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground transition-colors hover:border-border-strong focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-2/40"
      >
        <option value="en">{t("language.english")}</option>
        <option value="vi">{t("language.vietnamese")}</option>
      </select>
    </label>
  );
}
