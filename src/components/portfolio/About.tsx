import { Badge } from "@/components/ui/badge";
import FadeUp from "./FadeUp";
import SectionHeader from "./SectionHeader";
import type { About as AboutContent } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

export default function About({ about }: { about: AboutContent }) {
  const { t } = useI18n();
  const empty =
    !about.pull_quote && about.pillars.length === 0 && about.highlights.length === 0;

  if (empty) return null;

  return (
    <section id="about" className="scroll-mt-20 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          overline={t.about_over}
          title={t.about_title}
          testId="about-section-title"
        />

        <div className="grid gap-10 lg:grid-cols-12">
          {about.pull_quote ? (
            <FadeUp className="lg:col-span-7">
              <blockquote
                data-testid="about-pull-quote"
                className="border-l-4 border-[#9b1c61] pl-6 font-heading text-xl italic leading-relaxed text-[#4a0c2f] sm:text-2xl"
              >
                “{about.pull_quote}”
              </blockquote>
              {about.pillars.length > 0 ? (
                <div className="mt-8 flex flex-wrap gap-2">
                  {about.pillars.map((pillar) => (
                    <Badge
                      key={pillar}
                      data-testid="about-pillar-badge"
                      className="rounded-full border border-[#e8e2dd] bg-white px-3 py-1.5 text-xs font-medium text-[#3d363b]"
                    >
                      {pillar}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </FadeUp>
          ) : null}

          {about.highlights.length > 0 ? (
            <div
              className={`grid gap-4 sm:grid-cols-2 ${about.pull_quote ? "lg:col-span-5" : "sm:grid-cols-2 lg:col-span-12 lg:grid-cols-4"}`}
            >
              {about.highlights.map((highlight, index) => (
                <FadeUp key={highlight.id} delay={index * 0.08}>
                  <div
                    data-testid="about-highlight-card"
                    className="h-full rounded-2xl border border-[#f2d2e2] bg-[#fdf2f7] p-6 transition-transform duration-200 ease-out hover:-translate-y-1"
                  >
                    <p className="font-heading text-xl font-semibold text-[#5c0f39]">
                      {highlight.title}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[#7a2251]">
                      {highlight.description}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
