import { motion } from "motion/react";
import { Award, BookOpen, Download, FileText, Loader2, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

export default function Hero({
  profile,
  onDownloadPdf,
  pdfBusy = false,
}: {
  profile: Profile;
  onDownloadPdf?: () => void;
  pdfBusy?: boolean;
}) {
  const { t } = useI18n();
  const hasSocials = Boolean(profile.linkedin_url || profile.github_url || profile.scholar_url);

  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-24">
      {/* soft magenta wash, kept subtle and asymmetric */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] size-[520px] rounded-full bg-[#fdf2f7] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-64 left-[-8%] size-[320px] rounded-full bg-[#fce7f3]/70 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        {/* Left column — editorial type */}
        <motion.div
          className="min-w-0 lg:col-span-7"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {profile.availability ? (
            <Badge
              data-testid="hero-availability-badge"
              className="h-auto max-w-full rounded-full border border-[#f2d2e2] bg-[#fce7f3] px-3 py-1.5 text-left text-xs font-medium whitespace-normal text-[#831843]"
            >
              <span className="mr-2 inline-block size-1.5 shrink-0 rounded-full bg-[#e54d8c]" />
              {profile.availability}
            </Badge>
          ) : null}

          <h1 className="mt-6 font-heading text-4xl leading-[1.12] tracking-tight text-[#1a1619] sm:text-5xl lg:text-[54px]">
            {profile.name}
          </h1>
          <p className="mt-4 text-lg font-medium text-[#9b1c61] sm:text-xl">{profile.headline}</p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#5c5258]">{profile.summary}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {profile.resume_url ? (
              <a href={profile.resume_url} download data-testid="hero-download-cv-button">
                <Button className="rounded-xl bg-[#9b1c61] px-5 text-white hover:bg-[#821550]">
                  <Download className="mr-2 size-4" />
                  {t.download_cv}
                </Button>
              </a>
            ) : null}
            {onDownloadPdf ? (
              <Button
                variant="outline"
                data-testid="hero-download-portfolio-pdf-button"
                disabled={pdfBusy}
                aria-busy={pdfBusy}
                onClick={onDownloadPdf}
                className="rounded-xl border-[#f2d2e2] bg-[#fdf2f7] px-5 text-[#5c0f39] hover:bg-[#fce7f3]"
              >
                {pdfBusy ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <FileText className="mr-2 size-4" />
                )}
                {pdfBusy ? t.pdf_preparing : t.pdf_button}
              </Button>
            ) : null}
            <a href="#contact" data-testid="hero-get-in-touch-button">
              <Button
                variant="outline"
                className="rounded-xl border-[#e8e2dd] bg-white px-5 text-[#1a1619] hover:bg-[#f3efea]"
              >
                {t.get_in_touch}
              </Button>
            </a>
          </div>

          <div className="mt-8 flex flex-col gap-2 text-sm text-[#5c5258] sm:flex-row sm:gap-6">
            {profile.location ? (
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4 text-[#9b1c61]" />
                {profile.location}
              </span>
            ) : null}
            {profile.email ? (
              <a
                href={`mailto:${profile.email}`}
                data-testid="hero-email-link"
                className="inline-flex items-center gap-2 transition-colors hover:text-[#9b1c61]"
              >
                <Mail className="size-4 text-[#9b1c61]" />
                {profile.email}
              </a>
            ) : null}
          </div>

          {hasSocials ? (
            <div className="mt-6 flex gap-3">
              {profile.linkedin_url ? (
                <a href={profile.linkedin_url} target="_blank" rel="noreferrer" data-testid="hero-linkedin-link">
                  <Button variant="outline" size="sm" className="rounded-full">LinkedIn</Button>
                </a>
              ) : null}
              {profile.github_url ? (
                <a href={profile.github_url} target="_blank" rel="noreferrer" data-testid="hero-github-link">
                  <Button variant="outline" size="sm" className="rounded-full">GitHub</Button>
                </a>
              ) : null}
              {profile.scholar_url ? (
                <a href={profile.scholar_url} target="_blank" rel="noreferrer" data-testid="hero-scholar-link">
                  <Button variant="outline" size="sm" className="rounded-full">Scholar</Button>
                </a>
              ) : null}
            </div>
          ) : null}
        </motion.div>

        {/* Right column — monogram / photo card */}
        <motion.div
          className="min-w-0 lg:col-span-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative mx-auto max-w-sm overflow-hidden rounded-2xl border border-[#f2d2e2] bg-gradient-to-br from-[#fdf2f7] via-white to-[#fbe0ec] p-8 shadow-[0_4px_20px_-2px_rgba(26,22,25,0.06)]">
            <div className="flex items-center justify-center">
              {profile.photo_url ? (
                <img
                  src={profile.photo_url}
                  alt={profile.name}
                  data-testid="hero-profile-photo"
                  className="size-44 rounded-full border-4 border-white object-cover shadow-lg"
                />
              ) : (
                <div className="flex size-44 items-center justify-center rounded-full border-4 border-white bg-[#9b1c61] shadow-lg">
                  <span className="font-heading text-6xl font-semibold text-white">
                    {profile.monogram}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <Badge
                data-testid="hero-gpa-badge"
                className="gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#5c0f39] shadow-sm"
              >
                <Award className="size-3.5 text-[#9b1c61]" />
                {t.gpa_badge}
              </Badge>
              <Badge
                data-testid="hero-publications-badge"
                className="gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#5c0f39] shadow-sm"
              >
                <BookOpen className="size-3.5 text-[#9b1c61]" />
                {t.researcher_badge}
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
