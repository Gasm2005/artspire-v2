import { waLink } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";

/**
 * Mobile sticky bottom CTA — WhatsApp commission button.
 * Removed 390px cap so it works on all phone sizes.
 */
export function WhatsAppBar() {
  return (
    <a
      href={waLink("Hi Himangi! I'd like to chat about a custom artwork.")}
      className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-forest text-white h-[60px] flex items-center justify-center gap-2.5 active-scale cursor-pointer shadow-[0_-2px_16px_rgba(0,0,0,0.12)]"
      aria-label="Chat with Himangi on WhatsApp"
    >
      <MessageCircle size={18} aria-hidden="true" />
      <span className="font-body font-semibold text-[13px] tracking-widest uppercase">
        Commission Art
      </span>
    </a>
  );
}
