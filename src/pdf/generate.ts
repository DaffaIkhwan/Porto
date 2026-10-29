import type { Lang, UIStrings } from "@/lib/i18n";
import type { Portfolio } from "@/lib/types";

export async function downloadPortfolioPdf(opts: {
  data: Portfolio;
  lang: Lang;
  t: UIStrings;
  siteUrl: string;
}): Promise<void> {
  const slug = opts.data.profile.name.trim().replace(/\s+/g, "-") || "Portfolio";
  const url = "/Nur-Delifah-Portfolio-EN.pdf";
  const a = document.createElement("a");
  a.href = url;
  a.download = "Nur-Delifah-Portfolio-EN.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
