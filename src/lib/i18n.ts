import { createContext, useContext } from "react";

// UI chrome strings (headings, buttons, labels). Portfolio CONTENT is translated by the
// backend (GET /api/portfolio?lang=id); these are the fixed interface words around it.
export type Lang = "en" | "id";

const en = {
  nav_about: "About",
  nav_experience: "Experience",
  nav_education: "Education",
  nav_publications: "Publications",
  nav_skills: "Skills",
  nav_contact: "Contact",
  get_in_touch: "Get in touch",
  download_cv: "Download CV",
  gpa_badge: "Cum Laude — GPA 3.64/4.00",
  researcher_badge: "SINTA 3 Researcher",
  about_over: "About",
  about_title: "A data-minded graduate with an operator's discipline",
  exp_over: "Experience",
  exp_title: "Where I've worked & led",
  edu_over: "Education",
  edu_title: "Academic background",
  pub_over: "Publications",
  pub_title: "Research & published work",
  pub_desc:
    "Peer-reviewed articles in Science, Technology, and Communication Journal — a SINTA 3-indexed national journal.",
  read_paper: "Read the paper",
  skills_over: "Skills",
  skills_title: "What I bring to the table",
  cert_over: "Certifications",
  cert_title: "Credentials & training",
  verify_cred: "Verify credential",
  act_over: "Organizations",
  act_title: "Organizational & community impact",
  contact_over: "Contact",
  contact_title: "Let's work together",
  contact_intro:
    "Looking for someone dependable in administrative, operational, or project-based roles? I'd love to hear from you.",
  ch_phone: "Phone / WhatsApp",
  ch_location: "Location",
  f_name: "Name",
  f_message: "Message",
  ph_name: "Your name",
  ph_message: "Tell me about the role or project…",
  send: "Send message",
  sending: "Sending…",
  sent_toast: "Message sent — thank you for reaching out!",
  send_fail: "Couldn't send the message. Please email me directly instead.",
  rights: "All rights reserved.",
  offline: "Offline preview — showing the saved version of this portfolio.",
  tap_zoom: "Tap to zoom",
  lang_switch_label: "Language",
  pdf_button: "Download Portfolio PDF",
  pdf_preparing: "Preparing PDF…",
  pdf_done: "Portfolio PDF downloaded.",
  pdf_fail: "Couldn't create the PDF. Please try again.",
  pdf_portfolio: "Portfolio",
  pdf_contents: "Contents",
  pdf_page: "Page",
  pdf_page_short: "p.",
  pdf_back_to_contents: "‹ Back to contents",
  pdf_contact_quick: "Quick contact",
  pdf_website: "Online portfolio",
  pdf_open_note: "Click any chapter to jump to it. Underlined text is a clickable link.",
  pdf_online_note: "This PDF works offline. For the latest version, photo galleries and the contact form, visit",
};

export type UIStrings = typeof en;

const id: UIStrings = {
  nav_about: "Tentang",
  nav_experience: "Pengalaman",
  nav_education: "Pendidikan",
  nav_publications: "Publikasi",
  nav_skills: "Keahlian",
  nav_contact: "Kontak",
  get_in_touch: "Hubungi saya",
  download_cv: "Unduh CV",
  gpa_badge: "Cum Laude — IPK 3,64/4,00",
  researcher_badge: "Peneliti SINTA 3",
  about_over: "Tentang",
  about_title: "Lulusan berpikir berbasis data dengan disiplin kerja yang tinggi",
  exp_over: "Pengalaman",
  exp_title: "Pengalaman kerja & kepemimpinan",
  edu_over: "Pendidikan",
  edu_title: "Latar belakang akademik",
  pub_over: "Publikasi",
  pub_title: "Riset & karya terpublikasi",
  pub_desc:
    "Artikel ilmiah yang telah melalui proses peninjauan sejawat di Science, Technology, and Communication Journal — jurnal nasional terindeks SINTA 3.",
  read_paper: "Baca artikel",
  skills_over: "Keahlian",
  skills_title: "Kompetensi yang saya tawarkan",
  cert_over: "Sertifikasi",
  cert_title: "Kredensial & pelatihan",
  verify_cred: "Verifikasi kredensial",
  act_over: "Organisasi",
  act_title: "Kontribusi organisasi & kemasyarakatan",
  contact_over: "Kontak",
  contact_title: "Mari bekerja sama",
  contact_intro:
    "Mencari seseorang yang dapat diandalkan untuk peran administratif, operasional, atau berbasis proyek? Saya senang mendengar kabar dari Anda.",
  ch_phone: "Telepon / WhatsApp",
  ch_location: "Lokasi",
  f_name: "Nama",
  f_message: "Pesan",
  ph_name: "Nama Anda",
  ph_message: "Ceritakan tentang posisi atau proyek Anda…",
  send: "Kirim pesan",
  sending: "Mengirim…",
  sent_toast: "Pesan terkirim — terima kasih telah menghubungi saya!",
  send_fail: "Pesan gagal dikirim. Silakan kirim email langsung kepada saya.",
  rights: "Hak cipta dilindungi.",
  offline: "Pratinjau offline — menampilkan versi tersimpan portofolio ini.",
  tap_zoom: "Ketuk untuk memperbesar",
  lang_switch_label: "Bahasa",
  pdf_button: "Unduh Portofolio PDF",
  pdf_preparing: "Menyiapkan PDF…",
  pdf_done: "Portofolio PDF berhasil diunduh.",
  pdf_fail: "PDF gagal dibuat. Silakan coba lagi.",
  pdf_portfolio: "Portofolio",
  pdf_contents: "Daftar Isi",
  pdf_page: "Halaman",
  pdf_page_short: "hlm.",
  pdf_back_to_contents: "‹ Kembali ke daftar isi",
  pdf_contact_quick: "Kontak cepat",
  pdf_website: "Portofolio online",
  pdf_open_note: "Klik bab mana pun untuk langsung menuju ke sana. Teks bergaris bawah adalah tautan yang bisa diklik.",
  pdf_online_note: "PDF ini dapat dibaca tanpa internet. Untuk versi terbaru, galeri foto, dan formulir kontak, kunjungi",
};

export const UI: Record<Lang, UIStrings> = { en, id };

export const LANG_STORAGE_KEY = "nd_lang";

export function initialLang(): Lang {
  try {
    return localStorage.getItem(LANG_STORAGE_KEY) === "id" ? "id" : "en";
  } catch {
    return "en";
  }
}

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: UIStrings;
}

// Default = English, so components rendered outside the provider (e.g. admin) still work.
export const I18nContext = createContext<I18nValue>({ lang: "en", setLang: () => {}, t: en });

export const useI18n = () => useContext(I18nContext);
