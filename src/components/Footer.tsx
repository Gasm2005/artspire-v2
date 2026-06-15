import { Instagram, MessageCircle, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-deep-forest px-8 pt-16 pb-28 text-center border-t border-white/5">
      <div className="font-display text-[32px] text-white mb-2 tracking-tight">Artspire</div>
      <p className="font-accent text-[18px] italic text-gold-accent/80 mb-10">Crafting Your Vision</p>
      <div className="flex justify-center gap-8 mb-10">
        <a className="text-white/60 active:text-gold-accent" href="https://www.instagram.com/himusketching_gallery?igsh=MXhzZzY1YjIzcDNxOQ==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <Instagram size={26} />
        </a>
        <a className="text-white/60 active:text-gold-accent" href="https://wa.me/917408690994" aria-label="WhatsApp">
          <MessageCircle size={26} />
        </a>
        <a className="text-white/60 active:text-gold-accent" href="mailto:Ajju_pandey@outlook.com" aria-label="Email">
          <Mail size={26} />
        </a>
      </div>
      <div className="w-20 h-px bg-gold-accent/30 mx-auto mb-10" />
      <p className="font-body text-[11px] text-white/40 uppercase tracking-[0.2em]">
        © 2025 Artspire Studio · All Rights Reserved
      </p>
    </footer>
  );
}
