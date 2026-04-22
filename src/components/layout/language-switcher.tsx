"use client";

import { Select } from "@/components/ui/select";
import { useI18n, type Language } from "@/features/i18n/language-context";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();

  return (
    <label className="flex items-center gap-2 text-xs text-zinc-400">
      <span className="hidden lg:inline">{t("language.label")}</span>
      <Select
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
        className="h-8 min-w-24 rounded-lg border-zinc-700 bg-zinc-900/70 px-2 py-1 text-xs"
        aria-label={t("language.label")}
      >
        <option value="en">{t("language.english")}</option>
        <option value="vi">{t("language.vietnamese")}</option>
      </Select>
    </label>
  );
}
