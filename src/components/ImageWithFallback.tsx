import { useState } from "react";

const FALLBACK_SVG = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <rect width="400" height="300" fill="#e7e2db"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-size="16" fill="#51604d">
      Artspire Artwork
    </text>
  </svg>`
)}`;

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImageWithFallback({ src, alt, className = "" }: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  return (
    <img
      src={error ? FALLBACK_SVG : src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}
