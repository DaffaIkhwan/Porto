import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// Full-screen photo viewer: tap backdrop / Esc to close, arrows / swipe to navigate.
export default function Lightbox({
  photos,
  index,
  open,
  alt,
  testId,
  onClose,
  onIndexChange,
}: {
  photos: string[];
  index: number;
  open: boolean;
  alt: string;
  testId: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}) {
  const touchX = useRef<number | null>(null);
  const count = photos.length;
  const go = (delta: number) => onIndexChange((index + delta + count) % count);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (count > 1 && e.key === "ArrowRight") onIndexChange((index + 1) % count);
      else if (count > 1 && e.key === "ArrowLeft") onIndexChange((index - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, index, count, onClose, onIndexChange]);

  return createPortal(
    <AnimatePresence>
      {open && count > 0 ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          data-testid={`${testId}-lightbox`}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#161114]/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.img
            key={photos[index]}
            src={photos[index]}
            alt={`${alt} — photo ${index + 1}`}
            data-testid={`${testId}-lightbox-image`}
            draggable={false}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="max-h-[85vh] max-w-[92vw] rounded-xl object-contain shadow-2xl select-none"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null || count < 2) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
              touchX.current = null;
            }}
          />

          <button
            type="button"
            aria-label="Close full-screen view"
            data-testid={`${testId}-lightbox-close`}
            onClick={onClose}
            className="absolute top-4 right-4 flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="size-5" />
          </button>

          {count > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous photo"
                data-testid={`${testId}-lightbox-prev`}
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#9b1c61] sm:left-6"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Next photo"
                data-testid={`${testId}-lightbox-next`}
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#9b1c61] sm:right-6"
              >
                <ChevronRight className="size-5" />
              </button>
              <p
                data-testid={`${testId}-lightbox-counter`}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 font-mono text-xs text-white"
              >
                {index + 1} / {count}
              </p>
            </>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
