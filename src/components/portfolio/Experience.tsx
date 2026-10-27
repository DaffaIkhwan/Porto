import { Badge } from "@/components/ui/badge";
import FadeUp from "./FadeUp";
import PhotoGallery from "./PhotoGallery";
import SectionHeader from "./SectionHeader";
import type { ExperienceItem } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

export default function Experience({ experiences }: { experiences: ExperienceItem[] }) {
  const { t } = useI18n();
  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="scroll-mt-20 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          overline={t.exp_over}
          title={t.exp_title}
          testId="experience-section-title"
        />

        <div className="relative space-y-8 border-l border-[#e8e2dd] pl-6 sm:pl-10">
          {experiences.map((item, index) => (
            <FadeUp key={item.id} delay={index * 0.08}>
              <div className="relative">
                {/* magenta node on the timeline rail */}
                <span
                  aria-hidden
                  className="absolute top-8 -left-[calc(1.5rem+7px)] size-[13px] rounded-full border-2 border-[#faf8f5] bg-[#9b1c61] sm:-left-[calc(2.5rem+7px)]"
                />
                <article
                  data-testid="experience-card"
                  className="rounded-2xl border border-[#e8e2dd] bg-white p-6 shadow-[0_4px_20px_-2px_rgba(26,22,25,0.04)] transition-transform duration-200 ease-out hover:-translate-y-1 sm:p-8"
                >
                  <PhotoGallery
                    photos={item.photos}
                    alt={`Documentation — ${item.role}`}
                    testId={`experience-gallery-${item.id}`}
                    heightClass="h-56 sm:h-64"
                  />
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-sans text-lg font-bold text-[#1a1619] sm:text-xl">
                        {item.role}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-[#9b1c61]">{item.org}</p>
                    </div>
                    <div className="flex flex-col items-start gap-2 sm:items-end">
                      <Badge
                        data-testid="experience-period-badge"
                        className="rounded-full bg-[#f3efea] px-3 py-1 text-xs font-medium text-[#3d363b]"
                      >
                        {item.period}
                      </Badge>
                      {item.location ? (
                        <span className="text-xs text-[#5c5258]">{item.location}</span>
                      ) : null}
                    </div>
                  </div>

                  <ul className="mt-5 space-y-2.5">
                    {item.bullets.map((bullet, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-sm leading-relaxed text-[#5c5258]"
                      >
                        <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-[#e54d8c]" />
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  {item.tags.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <Badge
                          key={tag}
                          data-testid="experience-tag-pill"
                          variant="outline"
                          className="rounded-full border-[#f2d2e2] bg-[#fce7f3] px-2.5 py-0.5 text-[11px] font-medium text-[#831843]"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </article>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
