"use client";

import Link from "next/link";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { useI18n, type Language } from "@/features/i18n/language-context";

type GuideSection = {
  id: string;
  label: string;
  title: string;
  paragraphs?: string[];
  steps?: string[];
  links?: Array<{ href: string; label: string }>;
  note?: string;
  noteTone?: "amber" | "indigo" | "muted";
};

type GuideContent = {
  title: string;
  description: string;
  tocTitle: string;
  sections: GuideSection[];
};

const guideContent: Record<Language, GuideContent> = {
  en: {
    title: "User Guide",
    description:
      "Detailed operating guide from setup to generation, review, and publish workflow.",
    tocTitle: "Table of contents",
    sections: [
      {
        id: "overview",
        label: "1) Workflow overview",
        title: "1) Workflow overview",
        paragraphs: [
          "The platform is queue-first: you submit a generation request, the system creates a job in queue, workers execute the pipeline, and results are available in Jobs.",
        ],
        steps: [
          "Sign in and select the active channel.",
          "(Recommended) define Character Profile and Character Campaign.",
          "Create jobs from Generate or Batch.",
          "Track progress and outputs in Jobs.",
          "Review, approve, select winner, then publish.",
        ],
      },
      {
        id: "quick-start",
        label: "2) Quick start in 10 minutes",
        title: "2) Quick start in 10 minutes",
        steps: [
          "Create or select a channel.",
          "Configure TikTok integration and keep status ACTIVE.",
          "Open Generate page and submit topic + style + duration.",
          "Set variant count > 1 if you want multiple variants.",
          "Open Jobs and wait until job status becomes COMPLETED.",
          "Approve, select for publish, then publish.",
        ],
        links: [
          { href: "/app/channels", label: "Channels" },
          { href: "/app/integrations/tiktok", label: "TikTok Integration" },
          { href: "/app/generate", label: "Generate" },
          { href: "/app/jobs", label: "Jobs" },
        ],
      },
      {
        id: "channel-tiktok",
        label: "3) Setup Channel and TikTok",
        title: "3) Setup Channel and TikTok",
        paragraphs: [
          "Channel is the ownership boundary for jobs, topics, and character data. Every generate/publish action is tied to the active channel.",
        ],
        steps: [
          "Create channels per brand or product line if needed.",
          "Use Set Active before generation.",
          "In TikTok integration page, save account metadata and set connection ACTIVE.",
          "Verify Active = Yes before publishing.",
        ],
        note: "If TikTok connection is not ACTIVE, publish readiness is blocked.",
        noteTone: "amber",
      },
      {
        id: "character-campaign",
        label: "4) Create Character and Campaign",
        title: "4) Create Character and Campaign",
        steps: [
          "Create Character Profile (name, tone, speaking style, default voice).",
          "Create Character Campaign and attach product + objective.",
          "Select profile/campaign during generation so prompts become character-aware.",
        ],
        links: [
          { href: "/app/characters/profiles", label: "Character Profiles" },
          { href: "/app/characters/campaigns", label: "Character Campaigns" },
        ],
        paragraphs: ["You can leave profile/campaign empty to run the base non-character flow."],
      },
      {
        id: "single-generate",
        label: "5) Single generate",
        title: "5) Single generate",
        steps: [
          "Enter a clear topic.",
          "Choose style.",
          "Set duration (10-120s) and variant count (1-10).",
          "Optional: story angle, product placement mode, ad disclosure mode.",
          "Click Queue Generation and track output in Job Detail.",
        ],
        note: "Pipeline steps: CONTENT_PREPARATION -> AUDIO_SYNTHESIS -> SUBTITLE_GENERATION -> VIDEO_COMPOSITION.",
        noteTone: "muted",
      },
      {
        id: "batch-generate",
        label: "6) Batch generate",
        title: "6) Batch generate",
        steps: [
          "Set batch defaults (style, duration, variants, character metadata).",
          "Add each topic item.",
          "Override item values when needed.",
          "Submit batch and monitor created jobs.",
        ],
        paragraphs: [
          "Batch is effective when you need many ad variants for one campaign.",
        ],
      },
      {
        id: "review-approve",
        label: "7) Review, approve, select for publish",
        title: "7) Review, approve, select for publish",
        steps: [
          "In Jobs/Job Detail, filter COMPLETED jobs.",
          "Review hook, script, caption, and video preview.",
          "Approve quality-ready jobs.",
          "For multi-variant groups, pick one winner with Select For Publish.",
          "Reject low-quality jobs with reason when needed.",
        ],
        note: "Rule: only APPROVED jobs can be published. For variant groups, select one winner before publishing.",
        noteTone: "indigo",
      },
      {
        id: "publish",
        label: "8) Publish to TikTok (mock/scaffold)",
        title: "8) Publish to TikTok (mock/scaffold)",
        steps: [
          "Open Job Detail and verify Publish Readiness = Yes.",
          "Ensure TikTok connection is ACTIVE.",
          "Set platform (usually tiktok) and click Publish Now.",
          "Verify publishStatus changes to PUBLISHED with external id.",
        ],
        paragraphs: [
          "In local/dev, the system currently uses scaffold publisher behavior.",
        ],
      },
      {
        id: "monitoring",
        label: "9) Monitor jobs and handle errors",
        title: "9) Monitor jobs and handle errors",
        steps: [
          "Use Jobs page for fleet-level status.",
          "Open Job Detail for current step, error message, and step error details.",
          "For FAILED jobs, click Retry to requeue.",
          "If failure repeats, inspect backend logs and media dependencies (ffmpeg, storage, queue, ai mode).",
        ],
        note: "Recommendation: for stable local tests use OPENAI_MOCK=true and ELEVENLABS_MOCK=true.",
        noteTone: "muted",
      },
      {
        id: "best-practice",
        label: "10) Stable operation checklist",
        title: "10) Stable operation checklist",
        steps: [
          "Active channel is selected.",
          "TikTok connection is ACTIVE.",
          "Topic is clear and target-keyword focused.",
          "Use variantCount > 1 to improve selection quality.",
          "Review script and caption before approval.",
          "Publish only after selecting winner in a generation group.",
          "Track publish metadata after posting.",
        ],
      },
    ],
  },
  vi: {
    title: "Huong dan nguoi dung",
    description:
      "Tai lieu huong dan chi tiet de van hanh AutoShorts AI tu thiet lap den tao, review va publish video.",
    tocTitle: "Muc luc",
    sections: [
      {
        id: "overview",
        label: "1) Tong quan luong su dung",
        title: "1) Tong quan luong su dung",
        paragraphs: [
          "Nen tang hoat dong theo queue-first: ban gui yeu cau tao video, he thong tao job vao queue, worker xu ly pipeline va tra ket qua o Jobs.",
        ],
        steps: [
          "Dang nhap va chon channel dang active.",
          "(Khuyen nghi) tao Character Profile va Character Campaign.",
          "Tao job tai Generate hoac Batch.",
          "Theo doi tien do va ket qua trong Jobs.",
          "Review, approve, chon winner, sau do publish.",
        ],
      },
      {
        id: "quick-start",
        label: "2) Bat dau nhanh trong 10 phut",
        title: "2) Bat dau nhanh trong 10 phut",
        steps: [
          "Tao hoac chon channel.",
          "Cau hinh TikTok integration va giu status ACTIVE.",
          "Mo trang Generate, nhap topic + style + duration.",
          "Dat variant count > 1 neu muon tao nhieu bien the.",
          "Mo Jobs va doi den khi trang thai COMPLETED.",
          "Approve, select for publish, sau do publish.",
        ],
        links: [
          { href: "/app/channels", label: "Channels" },
          { href: "/app/integrations/tiktok", label: "TikTok Integration" },
          { href: "/app/generate", label: "Generate" },
          { href: "/app/jobs", label: "Jobs" },
        ],
      },
      {
        id: "channel-tiktok",
        label: "3) Thiet lap Channel va TikTok",
        title: "3) Thiet lap Channel va TikTok",
        paragraphs: [
          "Channel la ranh gioi so huu du lieu (jobs, topics, character data). Moi thao tac generate/publish deu gan voi channel active.",
        ],
        steps: [
          "Tao channel theo nhan hieu hoac dong san pham neu can.",
          "Dung Set Active truoc khi generate.",
          "Trong trang TikTok integration, luu thong tin tai khoan va dat ACTIVE.",
          "Kiem tra Active = Yes truoc khi publish.",
        ],
        note: "Neu TikTok connection khong ACTIVE, publish readiness se bi chan.",
        noteTone: "amber",
      },
      {
        id: "character-campaign",
        label: "4) Tao Character va Campaign",
        title: "4) Tao Character va Campaign",
        steps: [
          "Tao Character Profile (ten, tone, speaking style, default voice).",
          "Tao Character Campaign va gan product + objective.",
          "Khi generate, chon profile/campaign de prompt character-aware.",
        ],
        links: [
          { href: "/app/characters/profiles", label: "Character Profiles" },
          { href: "/app/characters/campaigns", label: "Character Campaigns" },
        ],
        paragraphs: ["Co the de trong profile/campaign neu muon chay luong co ban khong character."],
      },
      {
        id: "single-generate",
        label: "5) Tao video don (Single Generate)",
        title: "5) Tao video don (Single Generate)",
        steps: [
          "Nhap topic ro rang.",
          "Chon style phu hop.",
          "Dat duration (10-120s) va variant count (1-10).",
          "Tuy chon: story angle, product placement mode, ad disclosure mode.",
          "Nhan Queue Generation va theo doi output trong Job Detail.",
        ],
        note: "Job pipeline: CONTENT_PREPARATION -> AUDIO_SYNTHESIS -> SUBTITLE_GENERATION -> VIDEO_COMPOSITION.",
        noteTone: "muted",
      },
      {
        id: "batch-generate",
        label: "6) Tao nhieu video (Batch Generate)",
        title: "6) Tao nhieu video (Batch Generate)",
        steps: [
          "Dat batch defaults (style, duration, variants, character metadata).",
          "Them tung topic item.",
          "Override tung item neu can.",
          "Submit batch va theo doi danh sach job duoc tao.",
        ],
        paragraphs: [
          "Batch phu hop khi can tao nhieu bien the quang cao cho cung mot campaign.",
        ],
      },
      {
        id: "review-approve",
        label: "7) Review, approve, select for publish",
        title: "7) Review, approve, select for publish",
        steps: [
          "Trong Jobs/Job Detail, loc cac job COMPLETED.",
          "Doc hook, script, caption, xem preview video.",
          "Approve cac job dat chat luong.",
          "Neu group co nhieu variant, chon 1 winner bang Select For Publish.",
          "Reject job khong dat va nhap ly do.",
        ],
        note: "Quy tac: chi job APPROVED moi duoc publish. Voi nhom variant, hay chon winner truoc khi publish.",
        noteTone: "indigo",
      },
      {
        id: "publish",
        label: "8) Publish video len TikTok (mock/scaffold)",
        title: "8) Publish video len TikTok (mock/scaffold)",
        steps: [
          "Mo Job Detail va kiem tra Publish Readiness = Yes.",
          "Dam bao TikTok connection dang ACTIVE.",
          "Chon platform (thuong la tiktok) va bam Publish Now.",
          "Kiem tra publishStatus chuyen sang PUBLISHED va co external id.",
        ],
        paragraphs: ["Trong local/dev, he thong dang dung scaffold publisher de mo phong publish."],
      },
      {
        id: "monitoring",
        label: "9) Theo doi Jobs va xu ly loi",
        title: "9) Theo doi Jobs va xu ly loi",
        steps: [
          "Dung trang Jobs de theo doi status hang loat.",
          "Mo Job Detail de xem current step, error message, step error details.",
          "Voi job FAILED, bam Retry de dua job quay lai queue.",
          "Neu loi lap lai, kiem tra backend logs va phu thuoc media (ffmpeg, storage, queue, ai mode).",
        ],
        note: "Khuyen nghi: de test local on dinh, bat OPENAI_MOCK=true va ELEVENLABS_MOCK=true.",
        noteTone: "muted",
      },
      {
        id: "best-practice",
        label: "10) Checklist van hanh de ra video on dinh",
        title: "10) Checklist van hanh de ra video on dinh",
        steps: [
          "Channel da duoc set active.",
          "TikTok connection dang ACTIVE.",
          "Topic ro rang, ngan gon, dung keyword muc tieu.",
          "Su dung variantCount > 1 de co lua chon tot hon.",
          "Review ky script va caption truoc khi approve.",
          "Chi publish sau khi da select winner trong group.",
          "Theo doi publish metadata sau khi dang.",
        ],
      },
    ],
  },
};

function getNoteClassName(tone: GuideSection["noteTone"]) {
  if (tone === "amber") {
    return "border-amber-700/40 bg-amber-500/10 text-amber-200";
  }

  if (tone === "indigo") {
    return "border-indigo-700/40 bg-indigo-500/10 text-indigo-200";
  }

  return "border-zinc-700/50 bg-zinc-900/40 text-zinc-400";
}

export default function GuidePage() {
  const { language } = useI18n();
  const content = guideContent[language];

  return (
    <div>
      <PageHeader title={content.title} description={content.description} />

      <Card>
        <h2 className="text-lg font-semibold text-zinc-100">{content.tocTitle}</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {content.sections.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-sm text-indigo-300 hover:text-indigo-200"
            >
              {item.label}
            </a>
          ))}
        </div>
      </Card>

      {content.sections.map((section) => (
        <section key={section.id} id={section.id} className="mt-6">
          <Card>
            <h2 className="text-lg font-semibold text-zinc-100">{section.title}</h2>

            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-sm text-zinc-300">
                {paragraph}
              </p>
            ))}

            {section.steps?.length ? (
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-zinc-300">
                {section.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            ) : null}

            {section.links?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {section.links.map((link) => (
                  <Link
                    key={`${section.id}-${link.href}`}
                    href={link.href}
                    className="rounded-lg border border-indigo-700/30 bg-indigo-500/10 px-2.5 py-1 text-xs text-indigo-200 hover:bg-indigo-500/15"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}

            {section.note ? (
              <p className={`mt-3 rounded-xl border px-3 py-2 text-xs ${getNoteClassName(section.noteTone)}`}>
                {section.note}
              </p>
            ) : null}
          </Card>
        </section>
      ))}
    </div>
  );
}
