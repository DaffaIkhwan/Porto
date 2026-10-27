import type { Lang, UIStrings } from "@/lib/i18n";
import type { Portfolio } from "@/lib/types";

export async function downloadPortfolioPdf(opts: {
  data: Portfolio;
  lang: Lang;
  t: UIStrings;
  siteUrl: string;
}): Promise<void> {
  const slug = opts.data.profile.name.trim().replace(/\s+/g, "-") || "Portfolio";
  const url = opts.data.profile.resume_url || "/cv-nur-delifah.pdf";
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slug}-Portfolio-${opts.lang.toUpperCase()}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
