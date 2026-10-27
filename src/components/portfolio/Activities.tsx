import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FadeUp from "./FadeUp";
import PhotoGallery from "./PhotoGallery";
import SectionHeader from "./SectionHeader";
import type { ActivityItem } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

export default function Activities({ activities }: { activities: ActivityItem[] }) {
  const { t } = useI18n();
  if (activities.length === 0) return null;

  return (
    <section id="activities" className="scroll-mt-20 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          overline={t.act_over}
          title={t.act_title}
          testId="activities-section-title"
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {activities.map((item, index) => (
            <FadeUp key={item.id} delay={index * 0.08} className="h-full">
              <article
                data-testid="activity-card"
                className="flex h-full flex-col rounded-2xl border border-[#e8e2dd] bg-white p-6 shadow-[0_4px_20px_-2px_rgba(26,22,25,0.04)] transition-transform duration-200 ease-out hover:-translate-y-1"
              >
                <PhotoGallery
                  photos={item.photos}
                  alt={`Documentation — ${item.role}`}
                  testId={`activity-gallery-${item.id}`}
                  heightClass="h-48"
                />
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#fdf2f7]">
                  <Users className="size-5 text-[#9b1c61]" />
                </div>
                <h3 className="mt-5 text-base font-bold leading-snug text-[#1a1619]">{item.role}</h3>
                <p className="mt-1 text-sm font-medium text-[#9b1c61]">{item.org}</p>
                {item.period ? (
                  <Badge
                    data-testid="activity-period-badge"
                    className="mt-3 w-fit rounded-full bg-[#f3efea] px-3 py-1 text-xs font-medium text-[#3d363b]"
                  >
                    {item.period}
                  </Badge>
                ) : null}
                <ul className="mt-4 space-y-2">
                  {item.bullets.map((bullet, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed text-[#5c5258]">
                      <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-[#e54d8c]" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
