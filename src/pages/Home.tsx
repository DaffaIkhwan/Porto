import { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { WifiOff } from "lucide-react";
import { toast } from "sonner";
import { apiGet } from "@/lib/api";
import { FALLBACK_PORTFOLIO } from "@/lib/fallback";
import type { Portfolio } from "@/lib/types";
import { I18nContext, LANG_STORAGE_KEY, UI, initialLang } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import Nav from "@/components/portfolio/Nav";
import Hero from "@/components/portfolio/Hero";
import About from "@/components/portfolio/About";
import Experience from "@/components/portfolio/Experience";
import Education from "@/components/portfolio/Education";
import Publications from "@/components/portfolio/Publications";
import Skills from "@/components/portfolio/Skills";
import Certifications from "@/components/portfolio/Certifications";
import Activities from "@/components/portfolio/Activities";
import Contact from "@/components/portfolio/Contact";

export default function Home() {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const i18n = useMemo(
    () => ({
      lang,
      t: UI[lang],
      setLang: (next: Lang) => {
        setLangState(next);
        try {
          localStorage.setItem(LANG_STORAGE_KEY, next);
        } catch {
          /* private mode — the choice just won't persist */
        }
      },
    }),
    [lang],
  );

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title =
      lang === "id"
        ? "Nur Delifah — Portofolio & CV | Analisis Data & Machine Learning"
        : "Nur Delifah — Portfolio & CV | Data Analysis & Machine Learning";
  }, [lang]);

  const query = useQuery({
    queryKey: ["portfolio", lang],
    queryFn: () => apiGet<Portfolio>(`/portfolio?lang=${lang}`),
    placeholderData: keepPreviousData, // no flash while the other language loads
    retry: 1,
  });

  // Fallback content keeps the page fully rendered on a static preview (no backend);
  // gate on the error state too, not just missing data, per the template's CDN rule.
  const data = query.data ?? FALLBACK_PORTFOLIO;

  const [pdfBusy, setPdfBusy] = useState(false);
  const downloadPdf = async () => {
    const t = UI[lang];
    setPdfBusy(true);
    try {
      // lazy chunk: the PDF engine loads only when someone asks for the PDF
      const { downloadPortfolioPdf } = await import("@/pdf/generate");
      await downloadPortfolioPdf({ data, lang, t, siteUrl: window.location.origin });
      toast.success(t.pdf_done);
    } catch (err) {
      console.error("PDF generation failed", err);
      toast.error(t.pdf_fail);
    } finally {
      setPdfBusy(false);
    }
  };
  const offline = query.isError && !query.data;

  return (
    <I18nContext.Provider value={i18n}>
    <div className="min-h-svh bg-[#faf8f5] text-[#1a1619]">
      <Nav monogram={data.profile.monogram} name={data.profile.name} />

      {offline ? (
        <div
          data-testid="offline-banner"
          className="fixed inset-x-0 top-16 z-40 flex justify-center px-4"
        >
          <p className="flex items-center gap-2 rounded-full border border-[#f2d2e2] bg-[#fce7f3] px-4 py-2 text-xs font-medium text-[#831843] shadow-sm">
            <WifiOff className="size-3.5" />
            {i18n.t.offline}
          </p>
        </div>
      ) : null}

      <main>
        <Hero profile={data.profile} onDownloadPdf={downloadPdf} pdfBusy={pdfBusy} />
        <About about={data.about} />
        <Experience experiences={data.experiences} />
        <Education education={data.education} />
        <Publications publications={data.publications} />
        <Skills skillGroups={data.skill_groups} />
        <Certifications certifications={data.certifications} />
        <Activities activities={data.activities} />
        <Contact profile={data.profile} />
      </main>
    </div>
    </I18nContext.Provider>
  );
}
