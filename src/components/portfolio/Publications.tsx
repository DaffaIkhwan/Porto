import { BookOpen, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FadeUp from "./FadeUp";
import PhotoGallery from "./PhotoGallery";
import SectionHeader from "./SectionHeader";
import type { Publication } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

export default function Publications({ publications }: { publications: Publication[] }) {
  const { t } = useI18n();
  if (publications.length === 0) return null;

  return (
    <section id="publications" className="scroll-mt-20 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          overline={t.pub_over}
          title={t.pub_title}
          description={t.pub_desc}
          testId="publications-section-title"
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {publications.map((pub, index) => (
            <FadeUp key={pub.id} delay={index * 0.08} className="h-full">
              <article
                data-testid="publication-card"
                className="flex h-full flex-col rounded-2xl border border-[#e8e2dd] bg-white p-6 shadow-[0_4px_20px_-2px_rgba(26,22,25,0.04)] transition-transform duration-200 ease-out hover:-translate-y-1"
              >
                <PhotoGallery
                  photos={pub.photo_url ? [pub.photo_url] : []}
                  alt={`Documentation — ${pub.title}`}
                  testId={`publication-gallery-${pub.id}`}
                  heightClass="h-40"
                />
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-[#fdf2f7]">
                      <BookOpen className="size-4 text-[#9b1c61]" />
                    </div>
                    {pub.index_label ? (
                      <Badge
                        data-testid="publication-index-badge"
                        className="rounded-full border border-[#f2d2e2] bg-[#fce7f3] px-2.5 py-1 text-[11px] font-semibold text-[#831843]"
                      >
                        {pub.index_label}
                      </Badge>
                    ) : null}
                  </div>
                  {pub.year ? (
                    <span className="font-mono text-xs text-[#5c5258]">{pub.year}</span>
                  ) : null}
                </div>

                <h3
                  data-testid="publication-title"
                  className="mt-4 font-heading text-lg leading-snug text-[#1a1619]"
                >
                  {pub.title}
                </h3>
                <p className="mt-3 text-sm text-[#5c5258]">{pub.venue}</p>

                {pub.url ? (
                  <div className="mt-auto pt-5">
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noreferrer"
                      data-testid={`publication-link-${index + 1}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#9b1c61] transition-colors hover:text-[#821550]"
                    >
                      <ExternalLink className="size-4" />
                      {t.read_paper}
                    </a>
                  </div>
                ) : null}
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
