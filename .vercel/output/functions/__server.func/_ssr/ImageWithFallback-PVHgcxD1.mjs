import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
const FALLBACK_SVG = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <rect width="400" height="300" fill="#e7e2db"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-size="16" fill="#51604d">
      Artspire Artwork
    </text>
  </svg>`
)}`;
function ImageWithFallback({ src, alt, className = "" }) {
  const [error, setError] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "img",
    {
      src: error ? FALLBACK_SVG : src,
      alt,
      className,
      onError: () => setError(true),
      loading: "lazy"
    }
  );
}
export {
  ImageWithFallback as I
};
