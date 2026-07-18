import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { waLink } from "../lib/whatsapp";
import { submitContactLead } from "@/lib/leads.server";
import { SiteChrome } from "@/components/site/SiteChrome";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | The Artspire" },
      { name: "description", content: "Get in touch with Himangi at The Artspire — commissions, questions, and bulk orders." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", idea: "" });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await submitContactLead({
        data: { name: form.name, phone: form.phone, email: form.email, requirement: form.idea },
      });
    } catch (err) {
      console.error("Failed to save lead:", err);
    }
    const msg = `Hi Himangi, I'm ${form.name} (${form.phone}). Email: ${form.email}. ${form.idea}`;
    window.location.href = waLink(msg);
  };

  return (
    <SiteChrome>
      <div className="wrap page-hero">
        <span className="eyebrow rv">Get in touch</span>
        <h1 className="reveal-words">Let's create something <em>meaningful</em>.</h1>
        <p className="rv d2">The fastest way to reach Himangi is WhatsApp — she usually replies within a couple of hours.</p>
      </div>

      <section style={{ paddingTop: 16 }}>
        <div className="wrap exc-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}>
          <form className="card-box rv" onSubmit={onSubmit}>
            <div className="field"><label>Your name</label><input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" /></div>
            <div className="field"><label>Phone / WhatsApp</label><input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91" /></div>
            <div className="field"><label>Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@email.com" /></div>
            <div className="field"><label>Your message</label><textarea rows={5} value={form.idea} onChange={(e) => setForm({ ...form, idea: e.target.value })} placeholder="Tell us what you're looking for…" /></div>
            <button className="btn btn-solid btn-block" type="submit" disabled={submitting}><span>{submitting ? "Sending…" : "Send via WhatsApp"}</span></button>
          </form>

          <div className="rv d1">
            <h3 className="serif" style={{ fontSize: 30, color: "var(--forest)", fontWeight: 500, marginBottom: 6 }}>Reach us directly</h3>
            <p style={{ color: "var(--stone)", marginBottom: 26 }}>We'd love to hear about your idea.</p>
            <div style={{ borderTop: "1px solid var(--line)", padding: "16px 0", fontSize: 14, color: "#54514a" }}><b style={{ color: "var(--forest)" }}>WhatsApp</b><br />+91 74086 90994</div>
            <div style={{ borderTop: "1px solid var(--line)", padding: "16px 0", fontSize: 14, color: "#54514a" }}><b style={{ color: "var(--forest)" }}>Email</b><br />hello@theartspire.com</div>
            <div style={{ borderTop: "1px solid var(--line)", padding: "16px 0", fontSize: 14, color: "#54514a" }}><b style={{ color: "var(--forest)" }}>Studio</b><br />Lucknow, India — shipping pan-India</div>
            <div style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", padding: "16px 0", fontSize: 14, color: "#54514a" }}><b style={{ color: "var(--forest)" }}>Hours</b><br />Mon–Sat · 9am–9pm IST</div>
            <a className="btn btn-gold btn-block" href={waLink("Hi Himangi! I'd love to chat about a custom artwork.")} target="_blank" rel="noreferrer" style={{ marginTop: 22 }}><span>Message on WhatsApp</span></a>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
