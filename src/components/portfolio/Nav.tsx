import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import type { Lang, UIStrings } from "@/lib/i18n";

const LINKS: { href: string; key: keyof UIStrings }[] = [
  { href: "#about", key: "nav_about" },
  { href: "#experience", key: "nav_experience" },
  { href: "#education", key: "nav_education" },
  { href: "#publications", key: "nav_publications" },
  { href: "#skills", key: "nav_skills" },
  { href: "#contact", key: "nav_contact" },
];

const LANGS: { code: Lang; label: string; full: string }[] = [
  { code: "en", label: "EN", full: "English" },
  { code: "id", label: "ID", full: "Bahasa Indonesia" },
];

export default function Nav({ monogram, name }: { monogram: string; name: string }) {
  const { lang, setLang, t } = useI18n();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#e8e2dd]/80 bg-[#faf8f5]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-3" data-testid="nav-brand-link">
          <span className="flex size-9 items-center justify-center rounded-full bg-[#9b1c61] font-heading text-sm font-bold text-white">
            {monogram}
          </span>
          <span className="hidden font-heading text-lg font-semibold tracking-tight text-[#1a1619] sm:block">
            {name}
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-testid={`nav-link-${link.href.slice(1)}`}
              className="rounded-full px-3 py-2 text-sm text-[#5c5258] transition-colors hover:bg-[#f3efea] hover:text-[#1a1619]"
            >
              {t[link.key]}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <div
            role="group"
            aria-label={t.lang_switch_label}
            data-testid="nav-language-switch"
            className="flex rounded-full border border-[#e8e2dd] bg-white p-0.5"
          >
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                title={l.full}
                aria-pressed={lang === l.code}
                data-testid={`nav-language-${l.code}-button`}
                onClick={() => setLang(l.code)}
                className={`rounded-full px-2.5 py-1 font-mono text-xs font-semibold transition-colors duration-200 ${
                  lang === l.code ? "bg-[#9b1c61] text-white" : "text-[#5c5258] hover:text-[#9b1c61]"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <a href="#contact">
            <Button
              size="sm"
              data-testid="nav-contact-button"
              className="rounded-full bg-[#9b1c61] px-4 text-white hover:bg-[#821550]"
            >
              {t.get_in_touch}
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
