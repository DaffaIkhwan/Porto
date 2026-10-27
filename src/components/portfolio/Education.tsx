import { BadgeCheck, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FadeUp from "./FadeUp";
import PhotoGallery from "./PhotoGallery";
import SectionHeader from "./SectionHeader";
import type { EducationItem } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

export default function Education({ education }: { education: EducationItem[] }) {
  const { t } = useI18n();
  if (education.length === 0) return null;

  return (
    <section id="education" className="scroll-mt-20 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          overline={t.edu_over}
          title={t.edu_title}
          testId="education-section-title"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {education.map((item, index) => (
            <FadeUp key={item.id} delay={index * 0.08} className="h-full">
              <article
                data-testid="education-card"
                className="flex h-full flex-col rounded-2xl border border-[#e8e2dd] bg-white p-6 shadow-[0_4px_20px_-2px_rgba(26,22,25,0.04)] sm:p-8"
              >
                <PhotoGallery
                  photos={item.photo_url ? [item.photo_url] : []}
                  alt={`Documentation — ${item.institution}`}
                  testId={`education-gallery-${item.id}`}
                  heightClass="h-48"
                />
                <div className="flex size-11 items-center justify-center rounded-xl bg-[#fdf2f7]">
                  <GraduationCap className="size-5 text-[#9b1c61]" />
                </div>
                <h3 className="mt-5 font-sans text-lg font-bold text-[#1a1619]">
                  {item.institution}
                </h3>
                <p className="mt-1 text-sm font-medium text-[#9b1c61]">{item.degree}</p>
                <p className="mt-2 text-sm text-[#5c5258]">{item.period}</p>

                {item.gpa ? (
                  <div className="mt-5">
                    <Badge
                      data-testid="education-gpa-badge"
                      className="rounded-full bg-[#9b1c61] px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      {item.gpa}
                    </Badge>
                  </div>
                ) : null}

                {item.honors ? (
                  <p
                    data-testid="education-honors"
                    className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-[#7a2251]"
                  >
                    <BadgeCheck className="mt-0.5 size-4 shrink-0 text-[#9b1c61]" />
                    {item.honors}
                  </p>
                ) : null}

                {item.details.length > 0 ? (
                  <ul className="mt-4 space-y-2 border-t border-[#efebe7] pt-4">
                    {item.details.map((detail, i) => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed text-[#5c5258]">
                        <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-[#e54d8c]" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
