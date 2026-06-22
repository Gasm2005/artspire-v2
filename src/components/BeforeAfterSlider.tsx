import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

const FALLBACK_SVG = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#e7e2db"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-size="16" fill="#51604d">Artspire Artwork</text></svg>`
)}`;

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  caption,
}: {
  beforeSrc: string;
  afterSrc: string;
  caption: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(50);
  const draggingRef = useRef(false);
  const [afterError, setAfterError] = useState(false);
  const [beforeError, setBeforeError] = useState(false);

  const moveTo = (clientX: number) => {
    const c = containerRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPct((x / rect.width) * 100);
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    moveTo(e.clientX);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    moveTo(e.clientX);
  };
  const onPointerUp = () => {
    draggingRef.current = false;
  };

  return (
    <div className="flex flex-col">
      <div
        ref={containerRef}
        className="slider-container"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <img alt="Finished Artwork" className="slider-image" src={afterError ? FALLBACK_SVG : afterSrc} onError={() => setAfterError(true)} />
        <div className="slider-overlay" style={{ width: `${pct}%` }}>
          <img alt="Original Photo" className="slider-image" src={beforeError ? FALLBACK_SVG : beforeSrc} onError={() => setBeforeError(true)} />
        </div>
        <div
          className="slider-handle-container absolute top-0 bottom-0 z-[10] pointer-events-none -translate-x-1/2"
          style={{ left: `${pct}%` }}
        >
          <div className="slider-handle">
            <span className="material-symbols-outlined text-[18px]">unfold_more</span>
          </div>
        </div>
        <div className="absolute top-4 left-4 bg-black/50 text-white font-body text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm z-20">
          YOUR PHOTO
        </div>
        <div className="absolute top-4 right-4 bg-black/50 text-white font-body text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm z-20">
          THE ARTWORK
        </div>
      </div>
      <p className="font-body text-[12px] font-semibold text-deep-forest/60 text-center mt-4 tracking-widest uppercase">
        {caption}
      </p>
    </div>
  );
}
