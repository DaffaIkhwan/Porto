import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ImagePlus, Languages, Lock, Plus, RefreshCw, Save, Trash2, X } from "lucide-react";
import { ApiError, apiDelete, apiGet, apiPost, apiPut, apiUpload } from "@/lib/api";
import { resizeImage } from "@/lib/image";
import type { Message, PhotoOut, Portfolio, TranslationStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PIN_KEY = "nd_admin_pin";
const VERIFIED_KEY = "nd_admin_verified";

const pinHeaders = (pin: string) => ({ "X-Admin-Pin": pin });

const linesOf = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
const linesTo = (lines: string[]) => lines.join("\n");

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-[#5c5258]">{label}</Label>
      {children}
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  testId,
  placeholder,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  testId: string;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <Field label={label}>
      {textarea ? (
        <Textarea
          data-testid={testId}
          value={value}
          rows={4}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-xl bg-white"
        />
      ) : (
        <Input
          data-testid={testId}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-xl bg-white"
        />
      )}
    </Field>
  );
}

// Documentation photo picker: preview, upload (auto-resized client-side), remove.
// The chosen URL only goes live when the whole portfolio is saved.
function PhotoPicker({
  photoUrl,
  testId,
  onUpload,
  onRemove,
  uploading,
  compact,
}: {
  photoUrl: string;
  testId: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
  uploading: boolean;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-3">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt="Documentation photo preview"
          data-testid={`${testId}-preview`}
          className={`w-full rounded-xl border border-[#e8e2dd] object-cover ${compact ? "h-32" : "h-44"}`}
        />
      ) : (
        <div
          className={`flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#e8e2dd] bg-white text-[#5c5258] ${compact ? "h-20 text-xs" : "h-28 text-sm"}`}
        >
          <ImagePlus className="size-4" />
          No documentation photo yet
        </div>
      )}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          data-testid={`${testId}-input`}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
            e.target.value = "";
          }}
        />
        <Button
          variant="outline"
          size="sm"
          data-testid={`${testId}-upload-button`}
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="rounded-lg bg-white"
        >
          <ImagePlus className="mr-2 size-3.5" />
          {uploading ? "Uploading…" : photoUrl ? "Replace photo" : "Upload photo"}
        </Button>
        {photoUrl ? (
          <Button
            variant="ghost"
            size="sm"
            data-testid={`${testId}-remove-button`}
            onClick={onRemove}
            className="text-[#5c5258] hover:bg-[#fce7f3] hover:text-[#831843]"
          >
            <Trash2 className="mr-2 size-3.5" />
            Remove
          </Button>
        ) : null}
      </div>
    </div>
  );
}

// Gallery picker: thumbnails (first = cover), reorder, remove, multi-file add.
function GalleryPicker({
  photos,
  testId,
  onAdd,
  onChangePhotos,
  uploading,
}: {
  photos: string[];
  testId: string;
  onAdd: (files: File[]) => void;
  onChangePhotos: (photos: string[]) => void;
  uploading: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const move = (from: number, to: number) => {
    const next = [...photos];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChangePhotos(next);
  };
  return (
    <div className="space-y-3" data-testid={testId}>
      {photos.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {photos.map((src, i) => (
            <div
              key={`${src}-${i}`}
              data-testid={`${testId}-thumb-${i + 1}`}
              className="group/thumb relative aspect-square overflow-hidden rounded-lg border border-[#e8e2dd] bg-white"
            >
              <img src={src} alt={`Gallery photo ${i + 1}`} className="h-full w-full object-cover" />
              {i === 0 ? (
                <span className="absolute top-1.5 left-1.5 rounded-full bg-[#9b1c61] px-2 py-0.5 text-[10px] font-semibold text-white">
                  Cover
                </span>
              ) : null}
              <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between gap-1">
                {i > 0 ? (
                  <button
                    type="button"
                    aria-label={`Move photo ${i + 1} earlier`}
                    data-testid={`${testId}-move-left-${i + 1}`}
                    onClick={() => move(i, i - 1)}
                    className="flex size-7 items-center justify-center rounded-full bg-white/90 text-[#1a1619] shadow hover:bg-white"
                  >
                    <ChevronLeft className="size-3.5" />
                  </button>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  aria-label={`Remove photo ${i + 1}`}
                  data-testid={`${testId}-remove-${i + 1}`}
                  onClick={() => onChangePhotos(photos.filter((_, j) => j !== i))}
                  className="flex size-7 items-center justify-center rounded-full bg-white/90 text-[#831843] shadow hover:bg-[#fce7f3]"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-20 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#e8e2dd] bg-white text-xs text-[#5c5258]">
          <ImagePlus className="size-4" />
          No documentation photos yet
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          data-testid={`${testId}-input`}
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length) onAdd(files);
            e.target.value = "";
          }}
        />
        <Button
          variant="outline"
          size="sm"
          data-testid={`${testId}-add-button`}
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="rounded-lg bg-white"
        >
          <ImagePlus className="mr-2 size-3.5" />
          {uploading ? "Uploading…" : "Add photos"}
        </Button>
        <span className="text-xs text-[#5c5258]">
          Select several at once — visitors swipe through them. First photo is the cover.
        </span>
      </div>
    </div>
  );
}

type PhotoMode = "none" | "single" | "gallery";

// Generic list editor: one card per item with photo picker (single / gallery / none),
// inline fields, add + remove. All writes are functional updates keyed by item id, so
// a slow upload can never overwrite edits made while it was in flight.
function ListEditor<T extends { id: string; photo_url?: string; photos?: string[] }>({
  items,
  noun,
  addLabel,
  makeNewItem,
  onChange,
  renderFields,
  onUploadPhoto,
  uploadingPhoto,
  photoMode = "single",
}: {
  items: T[];
  noun: string;
  addLabel: string;
  makeNewItem: () => T;
  onChange: (update: (items: T[]) => T[]) => void;
  renderFields: (item: T, patch: (partial: Partial<T>) => void) => ReactNode;
  onUploadPhoto: (files: File[], apply: (urls: string[]) => void) => void;
  uploadingPhoto: boolean;
  photoMode?: PhotoMode;
}) {
  const patchById = (id: string, partial: Partial<T>) =>
    onChange((list) => list.map((it) => (it.id === id ? { ...it, ...partial } : it)));

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={item.id}
          data-testid={`admin-${noun}-item-${index + 1}`}
          className="rounded-2xl border border-[#e8e2dd] bg-[#faf8f5] p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#9b1c61]">
              {noun} {index + 1}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              data-testid={`admin-delete-${noun}-button-${index + 1}`}
              aria-label={`Delete ${noun} ${index + 1}`}
              onClick={() => onChange((list) => list.filter((it) => it.id !== item.id))}
              className="text-[#5c5258] hover:bg-[#fce7f3] hover:text-[#831843]"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>

          {photoMode === "single" ? (
            <div className="mb-4">
              <PhotoPicker
                compact
                photoUrl={item.photo_url ?? ""}
                testId={`admin-${noun}-photo-${index + 1}`}
                onUpload={(file) =>
                  onUploadPhoto([file], (urls) =>
                    patchById(item.id, { photo_url: urls[0] } as Partial<T>),
                  )
                }
                onRemove={() => patchById(item.id, { photo_url: "" } as Partial<T>)}
                uploading={uploadingPhoto}
              />
            </div>
          ) : null}

          {photoMode === "gallery" ? (
            <div className="mb-4">
              <GalleryPicker
                photos={item.photos ?? []}
                testId={`admin-${noun}-gallery-${index + 1}`}
                uploading={uploadingPhoto}
                onAdd={(files) =>
                  onUploadPhoto(files, (urls) =>
                    onChange((list) =>
                      list.map((it) =>
                        it.id === item.id ? { ...it, photos: [...(it.photos ?? []), ...urls] } : it,
                      ),
                    ),
                  )
                }
                onChangePhotos={(photos) => patchById(item.id, { photos } as Partial<T>)}
              />
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            {renderFields(item, (partial) => patchById(item.id, partial))}
          </div>
        </div>
      ))}
      <Button
        variant="outline"
        data-testid={`admin-add-${noun}-button`}
        onClick={() => onChange((list) => [...list, makeNewItem()])}
        className="rounded-xl border-dashed border-[#e8e2dd] bg-white text-[#1a1619] hover:bg-[#fdf2f7]"
      >
        <Plus className="mr-2 size-4" />
        {addLabel}
      </Button>
    </div>
  );
}

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function Admin() {
  const queryClient = useQueryClient();
  const [pin, setPin] = useState(sessionStorage.getItem(PIN_KEY) ?? "");
  const [verified, setVerified] = useState(sessionStorage.getItem(VERIFIED_KEY) === "1");
  const [draft, setDraft] = useState<Portfolio | null>(null);

  const verify = useMutation({
    mutationFn: () => apiPost<{ ok: boolean }>("/admin/verify", { pin }),
    onSuccess: () => {
      sessionStorage.setItem(VERIFIED_KEY, "1");
      sessionStorage.setItem(PIN_KEY, pin);
      setVerified(true);
      toast.success("PIN verified — welcome back.");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError && error.status === 401
          ? "Incorrect PIN. Please try again."
          : "Could not reach the server to verify the PIN.",
      );
    },
  });

  const portfolioQuery = useQuery({
    queryKey: ["portfolio"],
    queryFn: () => apiGet<Portfolio>("/portfolio"),
    enabled: verified,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (portfolioQuery.data && draft === null) setDraft(portfolioQuery.data);
  }, [portfolioQuery.data, draft]);

  const save = useMutation({
    mutationFn: (content: Portfolio) =>
      apiPut<Portfolio>("/portfolio", content, pinHeaders(pin)),
    onSuccess: (res) => {
      setDraft(res);
      queryClient.setQueryData(["portfolio"], res);
      queryClient.invalidateQueries({ queryKey: ["portfolio"], exact: false, refetchType: "none" });
      queryClient.invalidateQueries({ queryKey: ["translation-status"] });
      toast.success("Changes published — Bahasa Indonesia version is updating in the background.");
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 401) {
        lock();
        toast.error("Your PIN is no longer valid — please verify again.");
      } else {
        toast.error("Save failed. Check your connection and try again.");
      }
    },
  });

  // Uploads one or more files to /photos (sequentially) and hands the URLs to the caller.
  const uploadPhoto = useMutation({
    mutationFn: async (vars: { files: File[]; apply: (urls: string[]) => void }) => {
      const urls: string[] = [];
      for (const file of vars.files) {
        const blob = await resizeImage(file);
        const formData = new FormData();
        formData.append("file", new File([blob], "photo.jpg", { type: blob.type || "image/jpeg" }));
        const res = await apiUpload<PhotoOut>("/photos", formData, pinHeaders(pin));
        urls.push(res.url);
      }
      return urls;
    },
    onSuccess: (urls, vars) => {
      vars.apply(urls);
      toast.success(
        `${urls.length > 1 ? `${urls.length} photos` : "Photo"} uploaded — press “Save changes” to publish.`,
      );
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError && error.status === 413
          ? "That image is too large (max 2 MB)."
          : "Photo upload failed. Images up to 2 MB only.",
      );
    },
  });

  const translationQuery = useQuery({
    queryKey: ["translation-status"],
    queryFn: () => apiGet<TranslationStatus>("/portfolio/translation"),
    enabled: verified,
    // poll while the background job runs (or right after a save kicked it off)
    refetchInterval: (q) => (q.state.data?.running || (q.state.data && q.state.data.translated < q.state.data.total && !q.state.data.last_error) ? 2500 : false),
  });

  const translateNow = useMutation({
    mutationFn: () => apiPost<TranslationStatus>("/portfolio/translate", undefined, pinHeaders(pin)),
    onSuccess: (res) => {
      queryClient.setQueryData(["translation-status"], res);
      toast.success("Translating to Bahasa Indonesia…");
    },
    onError: () => toast.error("Could not start the translation."),
  });

  const messagesQuery = useQuery({
    queryKey: ["messages"],
    queryFn: () => apiGet<Message[]>("/messages", pinHeaders(pin)),
    enabled: verified,
    refetchOnWindowFocus: false,
  });

  const deleteMessage = useMutation({
    mutationFn: (id: string) => apiDelete<{ ok: boolean }>(`/messages/${id}`, pinHeaders(pin)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success("Message deleted.");
    },
    onError: () => toast.error("Could not delete the message."),
  });

  function lock() {
    sessionStorage.removeItem(VERIFIED_KEY);
    sessionStorage.removeItem(PIN_KEY);
    setVerified(false);
    setDraft(null);
  }

  if (!verified) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#faf8f5] px-4">
        <div className="w-full max-w-sm rounded-2xl border border-[#e8e2dd] bg-white p-8 shadow-[0_4px_20px_-2px_rgba(26,22,25,0.06)]">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#fdf2f7]">
            <Lock className="size-5 text-[#9b1c61]" />
          </div>
          <h1 className="mt-5 text-center font-heading text-2xl font-semibold text-[#1a1619]">
            Portfolio Admin
          </h1>
          <p className="mt-2 text-center text-sm text-[#5c5258]">
            Enter your admin PIN to edit and publish content.
          </p>
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              verify.mutate();
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="admin-pin" className="text-xs font-semibold text-[#5c5258]">
                Admin PIN
              </Label>
              <Input
                id="admin-pin"
                data-testid="admin-pin-input"
                type="password"
                inputMode="numeric"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••••"
                className="rounded-xl bg-white text-center font-mono tracking-[0.4em]"
              />
            </div>
            <Button
              type="submit"
              data-testid="admin-verify-button"
              disabled={verify.isPending}
              className="w-full rounded-xl bg-[#9b1c61] py-3 text-white hover:bg-[#821550]"
            >
              {verify.isPending ? "Verifying…" : "Unlock editor"}
            </Button>
          </form>
          <Link
            to="/"
            data-testid="admin-back-to-site-link"
            className="mt-6 flex items-center justify-center gap-2 text-sm text-[#5c5258] transition-colors hover:text-[#9b1c61]"
          >
            <ArrowLeft className="size-4" />
            Back to portfolio
          </Link>
        </div>
      </div>
    );
  }

  const setProfile = (patch: Partial<Portfolio["profile"]>) =>
    setDraft((d) => (d ? { ...d, profile: { ...d.profile, ...patch } } : d));
  const setAbout = (patch: Partial<Portfolio["about"]>) =>
    setDraft((d) => (d ? { ...d, about: { ...d.about, ...patch } } : d));
  const uploadInto = (files: File[], apply: (urls: string[]) => void) =>
    uploadPhoto.mutate({ files, apply });

  const TABS = [
    "Profile",
    "About",
    "Experience",
    "Education",
    "Publications",
    "Skills",
    "Certifications",
    "Activities",
    "Messages",
  ];

  return (
    <div className="min-h-svh bg-[#faf8f5] pb-24">
      <header className="sticky top-0 z-40 border-b border-[#e8e2dd] bg-[#faf8f5]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-[#9b1c61] font-heading text-sm font-bold text-white">
              ND
            </span>
            <div>
              <p className="font-heading text-lg font-semibold text-[#1a1619]">Content Manager</p>
              <p className="text-xs text-[#5c5258]">Edits publish instantly after saving</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" data-testid="admin-view-site-link">
              <Button variant="outline" size="sm" className="rounded-full bg-white">
                <ArrowLeft className="mr-2 size-4" />
                View site
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              data-testid="admin-lock-button"
              onClick={lock}
              className="rounded-full text-[#5c5258] hover:bg-[#f3efea]"
            >
              Lock
            </Button>
          </div>
        </div>
      </header>

      {portfolioQuery.isError ? (
        <div className="mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8">
          <p
            data-testid="admin-backend-unavailable-note"
            className="rounded-xl border border-[#f2d2e2] bg-[#fce7f3] px-4 py-3 text-sm text-[#831843]"
          >
            The backend is unreachable — editing is available but saving will not work in this
            static preview.
          </p>
        </div>
      ) : null}

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {translationQuery.data ? (
          <div
            data-testid="admin-translation-status"
            className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#f2d2e2] bg-[#fdf2f7] px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-white">
                <Languages className="size-4 text-[#9b1c61]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#4a0c2f]">Bahasa Indonesia version</p>
                <p data-testid="admin-translation-status-text" className="text-xs text-[#7a2251]">
                  {translationQuery.data.running
                    ? `Translating… ${translationQuery.data.translated} of ${translationQuery.data.total} done`
                    : translationQuery.data.last_error
                      ? "Last translation failed — new text shows in English until you retry."
                      : translationQuery.data.translated >= translationQuery.data.total
                        ? `Up to date — all ${translationQuery.data.total} text items translated automatically.`
                        : `${translationQuery.data.total - translationQuery.data.translated} new item(s) waiting — shown in English until translated.`}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              data-testid="admin-translate-now-button"
              disabled={translationQuery.data.running || translateNow.isPending}
              onClick={() => translateNow.mutate()}
              className="rounded-full bg-white"
            >
              <RefreshCw className={`mr-2 size-3.5 ${translationQuery.data.running ? "animate-spin" : ""}`} />
              {translationQuery.data.running ? "Translating…" : "Translate now"}
            </Button>
          </div>
        ) : null}
        {draft ? (
          <Tabs defaultValue="Profile">
            <TabsList data-testid="admin-tabs-list" className="h-auto flex-wrap gap-1 rounded-2xl bg-[#f3efea] p-1.5">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  data-testid={`admin-tab-${tab.toLowerCase()}`}
                  className="rounded-xl text-sm"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* ---------------- Profile ---------------- */}
            <TabsContent value="Profile" className="mt-6 space-y-5">
              <div className="grid gap-5 rounded-2xl border border-[#e8e2dd] bg-white p-5 sm:grid-cols-[260px_1fr] sm:items-start">
                <PhotoPicker
                  photoUrl={draft.profile.photo_url}
                  testId="admin-profile-photo"
                  onUpload={(file) => uploadPhoto.mutate({ files: [file], apply: (urls) => setProfile({ photo_url: urls[0] }) })}
                  onRemove={() => setProfile({ photo_url: "" })}
                  uploading={uploadPhoto.isPending}
                />
                <div className="sm:pt-2">
                  <p className="text-sm font-semibold text-[#1a1619]">Hero photo</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#5c5258]">
                    Upload a photo to replace the {draft.profile.monogram} monogram on the hero
                    card (max 2 MB — large images are resized automatically). Experience,
                    education, publications and certifications each take a documentation photo;
                    experience and activities hold a full swipeable gallery. Press “Save changes” to publish.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Full name" value={draft.profile.name} onChange={(v) => setProfile({ name: v })} testId="admin-profile-name-input" />
                <TextField label="Monogram initials" value={draft.profile.monogram} onChange={(v) => setProfile({ monogram: v })} testId="admin-profile-monogram-input" />
                <TextField label="Headline" value={draft.profile.headline} onChange={(v) => setProfile({ headline: v })} testId="admin-profile-headline-input" />
                <TextField label="Availability badge" value={draft.profile.availability} onChange={(v) => setProfile({ availability: v })} testId="admin-profile-availability-input" />
                <TextField label="Email" value={draft.profile.email} onChange={(v) => setProfile({ email: v })} testId="admin-profile-email-input" />
                <TextField label="Phone" value={draft.profile.phone} onChange={(v) => setProfile({ phone: v })} testId="admin-profile-phone-input" />
                <TextField label="Location" value={draft.profile.location} onChange={(v) => setProfile({ location: v })} testId="admin-profile-location-input" />
                <TextField label="CV / resume link" value={draft.profile.resume_url} onChange={(v) => setProfile({ resume_url: v })} testId="admin-profile-resume-input" />
                <TextField label="LinkedIn URL" value={draft.profile.linkedin_url} onChange={(v) => setProfile({ linkedin_url: v })} testId="admin-profile-linkedin-input" />
                <TextField label="GitHub URL" value={draft.profile.github_url} onChange={(v) => setProfile({ github_url: v })} testId="admin-profile-github-input" />
                <TextField label="Google Scholar URL" value={draft.profile.scholar_url} onChange={(v) => setProfile({ scholar_url: v })} testId="admin-profile-scholar-input" />
              </div>
              <TextField label="Summary" value={draft.profile.summary} onChange={(v) => setProfile({ summary: v })} testId="admin-profile-summary-input" textarea />
            </TabsContent>

            {/* ---------------- About ---------------- */}
            <TabsContent value="About" className="mt-6 space-y-5">
              <TextField label="Pull quote" value={draft.about.pull_quote} onChange={(v) => setAbout({ pull_quote: v })} testId="admin-about-quote-input" textarea />
              <Field label="Pillar badges (one per line)">
                <Textarea
                  data-testid="admin-about-pillars-input"
                  rows={4}
                  value={linesTo(draft.about.pillars)}
                  onChange={(e) => setAbout({ pillars: linesOf(e.target.value) })}
                  className="rounded-xl bg-white"
                />
              </Field>
              <ListEditor
                items={draft.about.highlights}
                noun="highlight"
                addLabel="Add highlight tile"
                makeNewItem={() => ({ id: uid(), title: "", description: "" })}
                onChange={(fn) => setDraft((d) => (d ? { ...d, about: { ...d.about, highlights: fn(d.about.highlights) } } : d))}
                onUploadPhoto={uploadInto}
                uploadingPhoto={uploadPhoto.isPending}
                photoMode="none"
                renderFields={(item, patch) => (
                  <>
                    <TextField label="Title" value={item.title} onChange={(v) => patch({ title: v })} testId={`admin-highlight-title-input-${item.id.slice(0, 6)}`} />
                    <TextField label="Description" value={item.description} onChange={(v) => patch({ description: v })} testId={`admin-highlight-description-input-${item.id.slice(0, 6)}`} />
                  </>
                )}
              />
            </TabsContent>

            {/* ---------------- Experience ---------------- */}
            <TabsContent value="Experience" className="mt-6">
              <ListEditor
                items={draft.experiences}
                noun="experience"
                addLabel="Add experience"
                makeNewItem={() => ({ id: uid(), org: "", role: "", period: "", location: "", photos: [], bullets: [], tags: [] })}
                onChange={(fn) => setDraft((d) => (d ? { ...d, experiences: fn(d.experiences) } : d))}
                photoMode="gallery"
                onUploadPhoto={uploadInto}
                uploadingPhoto={uploadPhoto.isPending}
                renderFields={(item, patch) => (
                  <>
                    <TextField label="Organization" value={item.org} onChange={(v) => patch({ org: v })} testId={`admin-experience-org-input-${item.id.slice(0, 6)}`} />
                    <TextField label="Role" value={item.role} onChange={(v) => patch({ role: v })} testId={`admin-experience-role-input-${item.id.slice(0, 6)}`} />
                    <TextField label="Period" value={item.period} onChange={(v) => patch({ period: v })} testId={`admin-experience-period-input-${item.id.slice(0, 6)}`} />
                    <TextField label="Location" value={item.location} onChange={(v) => patch({ location: v })} testId={`admin-experience-location-input-${item.id.slice(0, 6)}`} />
                    <div className="sm:col-span-2">
                      <Field label="Bullets (one per line)">
                        <Textarea
                          data-testid={`admin-experience-bullets-input-${item.id.slice(0, 6)}`}
                          rows={4}
                          value={linesTo(item.bullets)}
                          onChange={(e) => patch({ bullets: linesOf(e.target.value) })}
                          className="rounded-xl bg-white"
                        />
                      </Field>
                    </div>
                    <div className="sm:col-span-2">
                      <TextField label="Tags (comma separated)" value={item.tags.join(", ")} onChange={(v) => patch({ tags: v.split(",").map((t) => t.trim()).filter(Boolean) })} testId={`admin-experience-tags-input-${item.id.slice(0, 6)}`} />
                    </div>
                  </>
                )}
              />
            </TabsContent>

            {/* ---------------- Education ---------------- */}
            <TabsContent value="Education" className="mt-6">
              <ListEditor
                items={draft.education}
                noun="education"
                addLabel="Add education"
                makeNewItem={() => ({ id: uid(), institution: "", degree: "", period: "", gpa: "", honors: "", photo_url: "", details: [] })}
                onChange={(fn) => setDraft((d) => (d ? { ...d, education: fn(d.education) } : d))}
                onUploadPhoto={uploadInto}
                uploadingPhoto={uploadPhoto.isPending}
                renderFields={(item, patch) => (
                  <>
                    <TextField label="Institution" value={item.institution} onChange={(v) => patch({ institution: v })} testId={`admin-education-institution-input-${item.id.slice(0, 6)}`} />
                    <TextField label="Degree" value={item.degree} onChange={(v) => patch({ degree: v })} testId={`admin-education-degree-input-${item.id.slice(0, 6)}`} />
                    <TextField label="Period" value={item.period} onChange={(v) => patch({ period: v })} testId={`admin-education-period-input-${item.id.slice(0, 6)}`} />
                    <TextField label="GPA" value={item.gpa} onChange={(v) => patch({ gpa: v })} testId={`admin-education-gpa-input-${item.id.slice(0, 6)}`} />
                    <div className="sm:col-span-2">
                      <TextField label="Honors" value={item.honors} onChange={(v) => patch({ honors: v })} testId={`admin-education-honors-input-${item.id.slice(0, 6)}`} />
                    </div>
                    <div className="sm:col-span-2">
                      <Field label="Details (one per line)">
                        <Textarea
                          data-testid={`admin-education-details-input-${item.id.slice(0, 6)}`}
                          rows={3}
                          value={linesTo(item.details)}
                          onChange={(e) => patch({ details: linesOf(e.target.value) })}
                          className="rounded-xl bg-white"
                        />
                      </Field>
                    </div>
                  </>
                )}
              />
            </TabsContent>

            {/* ---------------- Publications ---------------- */}
            <TabsContent value="Publications" className="mt-6">
              <ListEditor
                items={draft.publications}
                noun="publication"
                addLabel="Add publication"
                makeNewItem={() => ({ id: uid(), title: "", venue: "", year: "", index_label: "", url: "", photo_url: "" })}
                onChange={(fn) => setDraft((d) => (d ? { ...d, publications: fn(d.publications) } : d))}
                onUploadPhoto={uploadInto}
                uploadingPhoto={uploadPhoto.isPending}
                renderFields={(item, patch) => (
                  <>
                    <div className="sm:col-span-2">
                      <TextField label="Title" value={item.title} onChange={(v) => patch({ title: v })} testId={`admin-publication-title-input-${item.id.slice(0, 6)}`} />
                    </div>
                    <TextField label="Venue / journal" value={item.venue} onChange={(v) => patch({ venue: v })} testId={`admin-publication-venue-input-${item.id.slice(0, 6)}`} />
                    <TextField label="Year" value={item.year} onChange={(v) => patch({ year: v })} testId={`admin-publication-year-input-${item.id.slice(0, 6)}`} />
                    <TextField label="Index label (e.g. SINTA 3)" value={item.index_label} onChange={(v) => patch({ index_label: v })} testId={`admin-publication-index-input-${item.id.slice(0, 6)}`} />
                    <TextField label="Paper URL" value={item.url} onChange={(v) => patch({ url: v })} testId={`admin-publication-url-input-${item.id.slice(0, 6)}`} />
                  </>
                )}
              />
            </TabsContent>

            {/* ---------------- Skills ---------------- */}
            <TabsContent value="Skills" className="mt-6">
              <ListEditor
                items={draft.skill_groups}
                noun="skill-group"
                addLabel="Add skill group"
                makeNewItem={() => ({ id: uid(), category: "", items: [] })}
                onChange={(fn) => setDraft((d) => (d ? { ...d, skill_groups: fn(d.skill_groups) } : d))}
                onUploadPhoto={uploadInto}
                uploadingPhoto={uploadPhoto.isPending}
                photoMode="none"
                renderFields={(item, patch) => (
                  <>
                    <TextField label="Category" value={item.category} onChange={(v) => patch({ category: v })} testId={`admin-skill-category-input-${item.id.slice(0, 6)}`} />
                    <div className="sm:col-span-2">
                      <Field label="Skills (one per line)">
                        <Textarea
                          data-testid={`admin-skill-items-input-${item.id.slice(0, 6)}`}
                          rows={6}
                          value={linesTo(item.items)}
                          onChange={(e) => patch({ items: linesOf(e.target.value) })}
                          className="rounded-xl bg-white"
                        />
                      </Field>
                    </div>
                  </>
                )}
              />
            </TabsContent>

            {/* ---------------- Certifications ---------------- */}
            <TabsContent value="Certifications" className="mt-6">
              <ListEditor
                items={draft.certifications}
                noun="certification"
                addLabel="Add certification"
                makeNewItem={() => ({ id: uid(), title: "", issuer: "", year: "", url: "", photo_url: "" })}
                onChange={(fn) => setDraft((d) => (d ? { ...d, certifications: fn(d.certifications) } : d))}
                onUploadPhoto={uploadInto}
                uploadingPhoto={uploadPhoto.isPending}
                renderFields={(item, patch) => (
                  <>
                    <div className="sm:col-span-2">
                      <TextField label="Title" value={item.title} onChange={(v) => patch({ title: v })} testId={`admin-certification-title-input-${item.id.slice(0, 6)}`} />
                    </div>
                    <TextField label="Issuer" value={item.issuer} onChange={(v) => patch({ issuer: v })} testId={`admin-certification-issuer-input-${item.id.slice(0, 6)}`} />
                    <TextField label="Year" value={item.year} onChange={(v) => patch({ year: v })} testId={`admin-certification-year-input-${item.id.slice(0, 6)}`} />
                    <div className="sm:col-span-2">
                      <TextField label="Credential URL" value={item.url} onChange={(v) => patch({ url: v })} testId={`admin-certification-url-input-${item.id.slice(0, 6)}`} />
                    </div>
                  </>
                )}
              />
            </TabsContent>

            {/* ---------------- Activities ---------------- */}
            <TabsContent value="Activities" className="mt-6">
              <ListEditor
                items={draft.activities}
                noun="activity"
                addLabel="Add activity"
                makeNewItem={() => ({ id: uid(), role: "", org: "", period: "", photos: [], bullets: [] })}
                onChange={(fn) => setDraft((d) => (d ? { ...d, activities: fn(d.activities) } : d))}
                photoMode="gallery"
                onUploadPhoto={uploadInto}
                uploadingPhoto={uploadPhoto.isPending}
                renderFields={(item, patch) => (
                  <>
                    <TextField label="Role" value={item.role} onChange={(v) => patch({ role: v })} testId={`admin-activity-role-input-${item.id.slice(0, 6)}`} />
                    <TextField label="Organization" value={item.org} onChange={(v) => patch({ org: v })} testId={`admin-activity-org-input-${item.id.slice(0, 6)}`} />
                    <div className="sm:col-span-2">
                      <TextField label="Period" value={item.period} onChange={(v) => patch({ period: v })} testId={`admin-activity-period-input-${item.id.slice(0, 6)}`} />
                    </div>
                    <div className="sm:col-span-2">
                      <Field label="Bullets (one per line)">
                        <Textarea
                          data-testid={`admin-activity-bullets-input-${item.id.slice(0, 6)}`}
                          rows={4}
                          value={linesTo(item.bullets)}
                          onChange={(e) => patch({ bullets: linesOf(e.target.value) })}
                          className="rounded-xl bg-white"
                        />
                      </Field>
                    </div>
                  </>
                )}
              />
            </TabsContent>

            {/* ---------------- Messages ---------------- */}
            <TabsContent value="Messages" className="mt-6">
              {messagesQuery.isLoading ? (
                <p data-testid="admin-messages-loading" className="text-sm text-[#5c5258]">
                  Loading messages…
                </p>
              ) : (messagesQuery.data ?? []).length === 0 ? (
                <p data-testid="admin-messages-empty" className="rounded-2xl border border-dashed border-[#e8e2dd] bg-white p-8 text-center text-sm text-[#5c5258]">
                  No messages yet — submissions from the contact form will appear here.
                </p>
              ) : (
                <div className="space-y-4">
                  {(messagesQuery.data ?? []).map((msg, index) => (
                    <div
                      key={msg.id}
                      data-testid={`admin-message-card-${index + 1}`}
                      className="rounded-2xl border border-[#e8e2dd] bg-white p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-[#1a1619]">
                            {msg.name} <span className="font-normal text-[#5c5258]">· {msg.email}</span>
                          </p>
                          <p className="mt-0.5 font-mono text-xs text-[#5c5258]">
                            {new Date(msg.created_at).toLocaleString("en-GB", { timeZone: "Asia/Jakarta" })} WIB
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          data-testid={`admin-delete-message-button-${index + 1}`}
                          aria-label="Delete message"
                          onClick={() => deleteMessage.mutate(msg.id)}
                          className="text-[#5c5258] hover:bg-[#fce7f3] hover:text-[#831843]"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#3d363b]">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <p data-testid="admin-loading-content" className="text-sm text-[#5c5258]">
            Loading content…
          </p>
        )}
      </div>

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e8e2dd] bg-[#faf8f5]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <p data-testid="admin-save-hint" className="text-xs text-[#5c5258]">
            {save.isPending ? "Publishing…" : draft ? "Unsaved changes publish only when you save." : ""}
          </p>
          <Button
            data-testid="admin-save-button"
            disabled={!draft || save.isPending}
            onClick={() => draft && save.mutate(draft)}
            className="rounded-xl bg-[#9b1c61] px-6 text-white hover:bg-[#821550]"
          >
            <Save className="mr-2 size-4" />
            {save.isPending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
