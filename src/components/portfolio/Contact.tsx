import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiPost } from "@/lib/api";
import FadeUp from "./FadeUp";
import type { Message, Profile } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

export default function Contact({ profile }: { profile: Profile }) {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const sendMessage = useMutation({
    mutationFn: () =>
      apiPost<Message>("/messages", { name, email, message }),
    onSuccess: () => {
      toast.success(t.sent_toast);
      setName("");
      setEmail("");
      setMessage("");
    },
    onError: () => {
      toast.error(t.send_fail);
    },
  });

  const waLink = profile.phone
    ? `https://wa.me/${profile.phone.replace(/[^0-9]/g, "").replace(/^0+/, "")}`
    : "";

  const channels = [
    profile.email
      ? { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}`, testId: "contact-email-channel" }
      : null,
    profile.phone
      ? { icon: Phone, label: t.ch_phone, value: profile.phone, href: waLink, testId: "contact-phone-channel" }
      : null,
    profile.location
      ? { icon: MapPin, label: t.ch_location, value: profile.location, href: "", testId: "contact-location-channel" }
      : null,
  ].filter((c): c is NonNullable<typeof c> => c !== null);

  return (
    <section id="contact" className="scroll-mt-20 bg-[#161114] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <FadeUp>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#f472b6]">
              {t.contact_over}
            </p>
            <h2
              data-testid="contact-section-title"
              className="mt-3 font-heading text-2xl tracking-tight text-[#faf8f5] sm:text-3xl lg:text-4xl"
            >
              {t.contact_title}
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[#b5a7af]">
              {t.contact_intro}
            </p>

            <div className="mt-8 space-y-4">
              {channels.map((channel) => {
                const Icon = channel.icon;
                const inner = (
                  <div className="flex items-center gap-4 rounded-2xl border border-[#2d2228] bg-[#211a1e] p-4 transition-colors hover:border-[#f472b6]/40">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#3a152a]">
                      <Icon className="size-4 text-[#f472b6]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide text-[#b5a7af]">{channel.label}</p>
                      <p className="truncate text-sm font-medium text-[#faf8f5]">{channel.value}</p>
                    </div>
                  </div>
                );
                return channel.href ? (
                  <a key={channel.label} href={channel.href} target={channel.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" data-testid={channel.testId}>
                    {inner}
                  </a>
                ) : (
                  <div key={channel.label} data-testid={channel.testId}>
                    {inner}
                  </div>
                );
              })}
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <form
              data-testid="contact-form"
              className="rounded-2xl border border-[#2d2228] bg-[#211a1e] p-6 sm:p-8"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage.mutate();
              }}
            >
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="contact-name" className="text-[#b5a7af]">{t.f_name}</Label>
                  <Input
                    id="contact-name"
                    data-testid="contact-form-name-input"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.ph_name}
                    className="rounded-xl border-[#2d2228] bg-[#161114] text-[#faf8f5] placeholder:text-[#5c5258] focus-visible:border-[#f472b6]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email" className="text-[#b5a7af]">Email</Label>
                  <Input
                    id="contact-email"
                    data-testid="contact-form-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="rounded-xl border-[#2d2228] bg-[#161114] text-[#faf8f5] placeholder:text-[#5c5258]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-message" className="text-[#b5a7af]">{t.f_message}</Label>
                  <Textarea
                    id="contact-message"
                    data-testid="contact-form-message-input"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.ph_message}
                    className="rounded-xl border-[#2d2228] bg-[#161114] text-[#faf8f5] placeholder:text-[#5c5258]"
                  />
                </div>
                <Button
                  type="submit"
                  data-testid="contact-form-submit-button"
                  disabled={sendMessage.isPending}
                  className="w-full rounded-xl bg-[#9b1c61] py-3 text-white hover:bg-[#821550]"
                >
                  <Send className="mr-2 size-4" />
                  {sendMessage.isPending ? t.sending : t.send}
                </Button>
              </div>
            </form>
          </FadeUp>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-[#2d2228] pt-8">
          <p data-testid="footer-copyright" className="text-sm text-[#b5a7af]">
            © {new Date().getFullYear()} {profile.name}. {t.rights}
          </p>
          <a
            href="/admin"
            data-testid="footer-admin-link"
            className="text-xs text-[#b5a7af] transition-colors hover:text-[#f472b6]"
          >
            Admin
          </a>
        </div>
      </div>
    </section>
  );
}
