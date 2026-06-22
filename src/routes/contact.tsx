import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { MessageCircle, Instagram, MapPin, Clock, Star, Mail, Send } from "lucide-react";
import { Layout } from "../components/Layout";
import { waLink } from "../lib/whatsapp";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact | Artspire" }, { name: "description", content: "Reach Himangi on WhatsApp within 2 hours to start your custom commission." }] }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", idea: "" });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const msg = `Hi Himangi, I'm ${form.name} (${form.phone}). Email: ${form.email}. ${form.idea}`;
    window.location.href = waLink(msg);
  };

  return (
    <Layout>
      {/* Header */}
      <section className="section-padding bg-cream text-center">
        <div className="container-main max-w-2xl">
          <p className="font-body text-[11px] md:text-[12px] font-semibold text-gold mb-4 uppercase tracking-[0.25em]">Get in Touch</p>
          <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-forest font-medium mb-4">Let's Create Something Meaningful</h1>
          <p className="font-body text-[14px] md:text-[16px] leading-relaxed text-stone">
            The fastest way to reach me is WhatsApp. I reply within 2 hours.
          </p>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="pb-10 md:pb-14">
        <div className="container-main max-w-2xl">
          <a
            href={waLink("Hi Himangi! I want to commission artwork")}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-3 w-full h-[56px] rounded-xl bg-brand-whatsapp text-white font-body font-bold text-[14px] md:text-[15px] tracking-wide active-scale btn-whatsapp shadow-sm"
          >
            <MessageCircle size={22} />
            Chat With Himangi on WhatsApp
          </a>
        </div>
      </section>

      {/* Divider */}
      <div className="container-main max-w-2xl pb-10">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="font-body text-[12px] uppercase tracking-[0.2em] text-stone">or send a message</span>
          <div className="flex-1 h-px bg-border" />
        </div>
      </div>

      {/* Contact Form */}
      <section className="pb-10 md:pb-14">
        <div className="container-main max-w-2xl">
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block font-body text-[12px] font-semibold text-forest uppercase tracking-wider mb-2">Your Name</label>
                <input
                  id="contact-name"
                  required
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-cream-dark border border-border/60 font-body text-[14px] text-charcoal placeholder:text-stone/60 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all"
                />
              </div>
              <div>
                <label htmlFor="contact-phone" className="block font-body text-[12px] font-semibold text-forest uppercase tracking-wider mb-2">Phone Number</label>
                <input
                  id="contact-phone"
                  required
                  type="tel"
                  pattern="[6-9][0-9]{9}"
                  minLength={10}
                  maxLength={10}
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-cream-dark border border-border/60 font-body text-[14px] text-charcoal placeholder:text-stone/60 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all"
                />
              </div>
            </div>
            <div>
              <label htmlFor="contact-email" className="block font-body text-[12px] font-semibold text-forest uppercase tracking-wider mb-2">Email</label>
              <input
                id="contact-email"
                required
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl bg-cream-dark border border-border/60 font-body text-[14px] text-charcoal placeholder:text-stone/60 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all"
              />
            </div>
            <div>
              <label htmlFor="contact-idea" className="block font-body text-[12px] font-semibold text-forest uppercase tracking-wider mb-2">Your Idea</label>
              <textarea
                id="contact-idea"
                required
                rows={5}
                placeholder="What would you like to create?"
                value={form.idea}
                onChange={(e) => setForm({ ...form, idea: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl bg-cream-dark border border-border/60 font-body text-[14px] text-charcoal placeholder:text-stone/60 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all resize-none"
              />
            </div>
            <div className="text-center pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 h-[52px] px-10 bg-forest text-white font-body font-bold text-[14px] tracking-wide rounded-xl active-scale btn-primary hover:bg-forest-dark transition-colors"
              >
                <Send size={16} />
                Send Message
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Info Cards */}
      <section className="pb-16 md:pb-20">
        <div className="container-main max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: MapPin, text: "Based in India · Shipping Pan India" },
              { icon: Clock, text: "Replies within 2 hours · Mon–Sat 9am–9pm" },
              { icon: Star, text: "500+ Happy Clients · 4.9 Star Rating" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 bg-cream-dark rounded-xl px-4 py-4 border border-border/40">
                <Icon size={20} className="text-gold shrink-0" />
                <span className="font-body text-[12px] text-charcoal leading-snug">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="pb-16 md:pb-20">
        <div className="container-main max-w-2xl flex items-center justify-center gap-8">
          <a href="https://www.instagram.com/himusketching_gallery?igsh=MXhzZzY1YjIzcDNxOQ==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex items-center gap-2 text-forest hover:text-gold transition-colors">
            <Instagram size={22} />
            <span className="font-body text-[13px] font-semibold">Instagram</span>
          </a>
          <a href={waLink("Hi Himangi! I want to commission artwork")} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="flex items-center gap-2 text-forest hover:text-gold transition-colors">
            <MessageCircle size={22} />
            <span className="font-body text-[13px] font-semibold">WhatsApp</span>
          </a>
          <a href="mailto:Ajju_pandey@outlook.com" aria-label="Email" className="flex items-center gap-2 text-forest hover:text-gold transition-colors">
            <Mail size={22} />
            <span className="font-body text-[13px] font-semibold">Email</span>
          </a>
        </div>
      </section>
    </Layout>
  );
}
