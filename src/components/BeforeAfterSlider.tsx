import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

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
        <img alt="Finished Artwork" className="slider-image" src={afterSrc} />
        <div className="slider-overlay" style={{ width: `${pct}%` }}>
          <img alt="Original Photo" className="slider-image" src={beforeSrc} />
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
