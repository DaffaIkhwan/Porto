import { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import Lightbox from "./Lightbox";
import { useI18n } from "@/lib/i18n";

// Swipeable documentation gallery (native scroll-snap = touch swipe on phones),
// with arrows + dots on larger screens. Tapping any slide opens the full-screen Lightbox.
export default function PhotoGallery({
  photos,
  alt,
  testId,
  heightClass = "h-48",
}: {
  photos: string[];
  alt: string;
  testId: string;
  heightClass?: string;
}) {
  const { t } = useI18n();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);
  const closeZoom = useCallback(() => setZoomIndex(null), []);
  const changeZoom = useCallback((i: number) => setZoomIndex(i), []);

  if (photos.length === 0) return null;
  const many = photos.length > 1;

  const goTo = (i: number) => {
    const el = scrollerRef.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="group/gallery relative mb-6" data-testid={testId}>
      <div
        ref={scrollerRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          setActive(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
        }}
        className={`flex snap-x snap-mandatory overflow-x-auto rounded-xl border border-[#efebe7] bg-[#f3efea] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${heightClass}`}
      >
        {photos.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setZoomIndex(i)}
            data-testid={`${testId}-slide-${i + 1}`}
            aria-label={`View photo ${i + 1} of ${photos.length} full-screen`}
            className="relative h-full w-full shrink-0 cursor-zoom-in snap-center overflow-hidden"
          >
            <img
              src={src}
              alt={`${alt} — photo ${i + 1}`}
              loading="lazy"
              draggable={false}
              className="h-full w-full object-cover transition-transform duration-300 ease-out hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      <span
        data-testid={`${testId}-counter`}
        className="pointer-events-none absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-[#161114]/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur"
      >
        <Maximize2 className="size-3" />
        {many ? `${active + 1} / ${photos.length}` : t.tap_zoom}
      </span>

      {many ? (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            data-testid={`${testId}-prev`}
            disabled={active === 0}
            onClick={() => goTo(active - 1)}
            className="absolute left-2 top-1/2 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1a1619] shadow transition-opacity hover:bg-white disabled:opacity-0 sm:flex md:opacity-0 md:group-hover/gallery:opacity-100 md:disabled:group-hover/gallery:opacity-0"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            data-testid={`${testId}-next`}
            disabled={active === photos.length - 1}
            onClick={() => goTo(active + 1)}
            className="absolute right-2 top-1/2 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1a1619] shadow transition-opacity hover:bg-white disabled:opacity-0 sm:flex md:opacity-0 md:group-hover/gallery:opacity-100 md:disabled:group-hover/gallery:opacity-0"
          >
            <ChevronRight className="size-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to photo ${i + 1}`}
                data-testid={`${testId}-dot-${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-[width,background-color] duration-200 ${i === active ? "w-5 bg-white" : "w-1.5 bg-white/60"}`}
              />
            ))}
          </div>
        </>
      ) : null}

      <Lightbox
        photos={photos}
        index={zoomIndex ?? 0}
        open={zoomIndex !== null}
        alt={alt}
        testId={testId}
        onClose={closeZoom}
        onIndexChange={changeZoom}
      />
    </div>
  );
}
