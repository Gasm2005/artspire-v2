import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { MessageCircle, Instagram, MapPin, Clock, Star } from "lucide-react";
import { Layout } from "../components/Layout";
import { waLink } from "../lib/whatsapp";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact | Artspire" }, { name: "description", content: "Reach Himangi on WhatsApp within 2 hours to start your custom commission." }] }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", idea: "" });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const msg = `Hi Himangi, I'm ${form.name} (${form.phone}). ${form.idea}`;
    window.location.href = waLink(msg);
  };

  return (
    <Layout>
      <section className="px-6 pt-12 pb-8 text-center">
        <p className="font-body text-[12px] font-semibold text-gold-accent mb-4 uppercase tracking-[0.2em]">Get in Touch</p>
        <h1 className="font-display text-[32px] leading-[1.15] text-primary font-medium mb-4">Let's Create Something Meaningful</h1>
        <p className="font-body text-[14px] leading-relaxed text-on-surface-variant">
          The fastest way to reach me is WhatsApp. I reply within 2 hours.
        </p>
      </section>

      <section className="px-6 pb-6">
        <a
          href={waLink("Hi Himangi!")}
          className="flex items-center justify-center gap-3 w-full h-[56px] rounded-xl bg-brand-whatsapp text-white font-body font-bold text-[15px] tracking-wide active-scale shadow-sm"
        >
          <MessageCircle size={22} />
          Chat With Himangi on WhatsApp
        </a>
      </section>

      <div className="px-6 py-4 flex items-center gap-3">
        <div className="flex-1 h-px bg-outline-variant/60" />
        <span className="font-body text-[12px] uppercase tracking-[0.2em] text-on-surface-variant">or</span>
        <div className="flex-1 h-px bg-outline-variant/60" />
      </div>

      <form onSubmit={onSubmit} className="px-6 pb-10 flex flex-col gap-3">
        <label htmlFor="contact-name" className="sr-only">Your Name</label>
        <input
          id="contact-name"
          required
          type="text"
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-3 rounded-md bg-surface-container border border-outline-variant/40 font-body text-[14px] text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:border-gold-accent"
        />
        <label htmlFor="contact-phone" className="sr-only">Phone Number</label>
        <input
          id="contact-phone"
          required
          type="tel"
          pattern="[6-9][0-9]{9}"
          minLength={10}
          maxLength={10}
          placeholder="Phone number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full px-4 py-3 rounded-md bg-surface-container border border-outline-variant/40 font-body text-[14px] text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:border-gold-accent"
        />
        <label htmlFor="contact-idea" className="sr-only">Your Idea</label>
        <textarea
          id="contact-idea"
          required
          rows={4}
          placeholder="What would you like to create?"
          value={form.idea}
          onChange={(e) => setForm({ ...form, idea: e.target.value })}
          className="w-full px-4 py-3 rounded-md bg-surface-container border border-outline-variant/40 font-body text-[14px] text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:border-gold-accent resize-none"
        />
        <button
          type="submit"
          className="w-full h-[52px] bg-primary text-white font-body font-bold text-[14px] tracking-wide rounded-md active-scale"
        >
          Send Message
        </button>
      </form>

      <section className="px-6 pb-10 flex flex-col gap-3">
        {[
          { icon: MapPin, text: "Based in India · Shipping Pan India" },
          { icon: Clock, text: "Replies within 2 hours · Mon–Sat 9am–9pm" },
          { icon: Star, text: "500+ Happy Clients · 4.9 Star Rating" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3 bg-surface-container rounded-md px-4 py-3">
            <Icon size={20} className="text-gold-accent shrink-0" />
            <span className="font-body text-[13px] text-on-surface leading-snug">{text}</span>
          </div>
        ))}
      </section>

      <section className="px-6 pb-16 flex items-center justify-center gap-8">
        <a href="#" aria-label="Instagram" className="flex items-center gap-2 text-primary active:text-gold-accent">
          <Instagram size={22} />
          <span className="font-body text-[13px] font-semibold">Instagram</span>
        </a>
        <a href={waLink()} aria-label="WhatsApp" className="flex items-center gap-2 text-primary active:text-gold-accent">
          <MessageCircle size={22} />
          <span className="font-body text-[13px] font-semibold">WhatsApp</span>
        </a>
      </section>
    </Layout>
  );
}
