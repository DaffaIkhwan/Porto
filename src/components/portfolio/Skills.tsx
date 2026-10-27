import FadeUp from "./FadeUp";
import SectionHeader from "./SectionHeader";
import type { SkillGroup } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

export default function Skills({ skillGroups }: { skillGroups: SkillGroup[] }) {
  const { t } = useI18n();
  if (skillGroups.length === 0) return null;

  return (
    <section id="skills" className="scroll-mt-20 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          overline={t.skills_over}
          title={t.skills_title}
          testId="skills-section-title"
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {skillGroups.map((group, index) => (
            <FadeUp
              key={group.id}
              delay={index * 0.06}
              className={index === 0 ? "sm:row-span-1" : undefined}
            >
              <div
                data-testid="skills-group-card"
                className="h-full rounded-2xl border border-[#e8e2dd] bg-white p-6 shadow-[0_4px_20px_-2px_rgba(26,22,25,0.04)]"
              >
                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#9b1c61]">
                  {group.category}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      data-testid="skills-item-pill"
                      className="rounded-full bg-[#f3efea] px-3 py-1.5 text-xs font-medium text-[#3d363b] transition-colors hover:bg-[#fce7f3] hover:text-[#831843]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
