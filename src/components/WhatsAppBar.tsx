import { waLink } from "../lib/whatsapp";

export function WhatsAppBar() {
  return (
    <a
      href={waLink("Hi Himangi! I'd like to chat about a custom artwork.")}
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-[100] bg-brand-whatsapp text-white h-[64px] flex items-center justify-center gap-3 active-scale cursor-pointer shadow-[0_-4px_12px_rgba(0,0,0,0.1)]"
    >
      <span className="material-symbols-outlined text-[24px]">chat_bubble</span>
      <span className="font-body font-bold text-[15px] tracking-wide">CHAT ON WHATSAPP</span>
    </a>
  );
}
