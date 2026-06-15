export const WA_NUMBER = "917408690994";
export const waLink = (msg?: string) =>
  `https://wa.me/${WA_NUMBER}${msg ? `?text=${encodeURIComponent(msg)}` : ""}`;
