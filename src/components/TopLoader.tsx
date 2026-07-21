import { useEffect, useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";

/**
 * Premium thin gold loading bar for route transitions.
 * Uses TanStack Router's isLoading state.
 * No spinner. No flash on fast loads.
 */
export function TopLoader() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isLoading = router.state.status === "pending";

  useEffect(() => {
    if (isLoading) {
      // Start loading: show bar and begin progress
      setVisible(true);
      setProgress(10);

      // Trickle toward 85% — never reaches 100% until done
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 85) return p;
          // Slow down as we approach 85
          const increment = (85 - p) * 0.08;
          return Math.min(p + Math.max(increment, 0.5), 85);
        });
      }, 120);
    } else {
      // Done: sprint to 100% then hide
      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(100);

      timerRef.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 400);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-label="Page loading"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      className="fixed top-0 left-0 right-0 z-[200] h-[2px] pointer-events-none"
    >
      <div
        className="h-full bg-gold transition-all ease-out"
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? "200ms" : "120ms",
          boxShadow: "0 0 8px rgba(201, 168, 76, 0.6)",
        }}
      />
    </div>
  );
}
