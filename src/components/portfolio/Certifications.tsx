import { ExternalLink, ShieldCheck } from "lucide-react";
import FadeUp from "./FadeUp";
import PhotoGallery from "./PhotoGallery";
import SectionHeader from "./SectionHeader";
import type { Certification } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

export default function Certifications({ certifications }: { certifications: Certification[] }) {
  const { t } = useI18n();
  if (certifications.length === 0) return null;

  return (
    <section id="certifications" className="scroll-mt-20 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          overline={t.cert_over}
          title={t.cert_title}
          testId="certifications-section-title"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, index) => (
            <FadeUp key={cert.id} delay={index * 0.05} className="h-full">
              <article
                data-testid="certification-card"
                className="flex h-full flex-col rounded-2xl border border-[#e8e2dd] bg-white p-5 shadow-[0_4px_20px_-2px_rgba(26,22,25,0.04)] transition-transform duration-200 ease-out hover:-translate-y-1"
              >
                <PhotoGallery
                  photos={cert.photo_url ? [cert.photo_url] : []}
                  alt={`Certificate — ${cert.title}`}
                  testId={`certification-gallery-${cert.id}`}
                  heightClass="h-40"
                />
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[#fdf2f7]">
                    <ShieldCheck className="size-4 text-[#9b1c61]" />
                  </div>
                  {cert.year ? (
                    <span className="font-mono text-xs text-[#5c5258]">{cert.year}</span>
                  ) : null}
                </div>
                <h3 className="mt-4 text-sm font-bold leading-snug text-[#1a1619]">{cert.title}</h3>
                <p className="mt-1.5 text-xs text-[#5c5258]">{cert.issuer}</p>
                {cert.url ? (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noreferrer"
                    data-testid={`certification-link-${index + 1}`}
                    className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-semibold text-[#9b1c61] hover:text-[#821550]"
                  >
                    <ExternalLink className="size-3.5" />
                    {t.verify_cred}
                  </a>
                ) : null}
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
