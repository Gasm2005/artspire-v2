import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { waLink } from "../lib/whatsapp";
import { useLeadForm } from "@/lib/use-lead-form";
import { smoothScrollToId } from "@/lib/smooth-scroll";
import { SiteChrome } from "@/components/site/SiteChrome";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | The Artspire" },
      {
        name: "description",
        content:
          "Get in touch with Himangi at The Artspire — commissions, questions, and bulk orders.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", idea: "" });
  const lead = useLeadForm();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    lead.submit({
      name: form.name,
      phone: form.phone,
      email: form.email,
      requirement: form.idea,
    });
  };

  // The confirmation replaces the taller form, which can leave it (and the lead
  // number) outside the viewport — bring it into view. See services.tsx.
  useEffect(() => {
    if (lead.status === "success") smoothScrollToId("contact-form-result");
  }, [lead.status]);

  const waMessage = `Hi Himangi, I'm ${form.name || "(name)"} (${form.phone || "(phone)"}). Email: ${form.email}. ${form.idea}`;

  return (
    <SiteChrome>
      <div className="wrap page-hero">
        <span className="eyebrow rv">Get in touch</span>
        <h1 className="reveal-words">
          Let's create something <em>meaningful</em>.
        </h1>
        <p className="rv d2">
          The fastest way to reach Himangi is WhatsApp — she usually replies within a couple of
          hours.
        </p>
      </div>

      <section style={{ paddingTop: 16 }}>
        <div
          className="wrap exc-grid"
          style={{ gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}
        >
          {/* Success card intentionally has no `rv`: it must appear instantly,
              never waiting on a scroll-reveal it can't receive. */}
          {lead.status === "success" ? (
            <div className="card-box" id="contact-form-result" role="status" aria-live="polite">
              <h3
                className="serif"
                style={{ fontSize: 26, color: "var(--forest)", fontWeight: 500, marginBottom: 8 }}
              >
                Thank you{form.name ? `, ${form.name.split(" ")[0]}` : ""} — message received.
              </h3>
              <p style={{ color: "var(--stone)", lineHeight: 1.7 }}>
                Reference <b style={{ color: "var(--forest)" }}>{lead.leadNumber}</b>. Himangi will
                reply, usually within a day.
              </p>
              <a
                className="btn btn-gold btn-block"
                href={waLink(waMessage)}
                target="_blank"
                rel="noreferrer"
                style={{ marginTop: 18 }}
              >
                <span>Continue on WhatsApp (optional)</span>
              </a>
            </div>
          ) : (
            <form className="card-box rv" onSubmit={onSubmit} noValidate>
              {lead.status === "error" && lead.errorMsg && (
                <div
                  role="alert"
                  style={{
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    color: "#b91c1c",
                    borderRadius: 10,
                    padding: "10px 14px",
                    fontSize: 13,
                    marginBottom: 16,
                  }}
                >
                  {lead.errorMsg}
                </div>
              )}
              <div className="field">
                <label htmlFor="ct-name">Your name</label>
                <input
                  id="ct-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Full name"
                />
              </div>
              <div className="field">
                <label htmlFor="ct-phone">Phone / WhatsApp</label>
                <input
                  id="ct-phone"
                  type="tel"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="10-digit mobile (or +country code)"
                />
              </div>
              <div className="field">
                <label htmlFor="ct-email">Email</label>
                <input
                  id="ct-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@email.com"
                />
              </div>
              <div className="field">
                <label htmlFor="ct-msg">Your message</label>
                <textarea
                  id="ct-msg"
                  rows={5}
                  value={form.idea}
                  onChange={(e) => setForm({ ...form, idea: e.target.value })}
                  placeholder="Tell us what you're looking for…"
                />
              </div>
              <button
                className="btn btn-solid btn-block"
                type="submit"
                disabled={lead.status === "submitting"}
              >
                <span>{lead.status === "submitting" ? "Sending…" : "Send enquiry"}</span>
              </button>
              {lead.status === "error" && (
                <a
                  href={waLink(waMessage)}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginTop: 10,
                    fontSize: 13,
                    color: "var(--gold-ink)",
                  }}
                >
                  Or send it on WhatsApp instead →
                </a>
              )}
            </form>
          )}

          <div className="rv d1">
            <h3
              className="serif"
              style={{ fontSize: 30, color: "var(--forest)", fontWeight: 500, marginBottom: 6 }}
            >
              Reach us directly
            </h3>
            <p style={{ color: "var(--stone)", marginBottom: 26 }}>
              We'd love to hear about your idea.
            </p>
            <div
              style={{
                borderTop: "1px solid var(--line)",
                padding: "16px 0",
                fontSize: 14,
                color: "#54514a",
              }}
            >
              <b style={{ color: "var(--forest)" }}>WhatsApp</b>
              <br />
              +91 74086 90994
            </div>
            <div
              style={{
                borderTop: "1px solid var(--line)",
                padding: "16px 0",
                fontSize: 14,
                color: "#54514a",
              }}
            >
              <b style={{ color: "var(--forest)" }}>Email</b>
              <br />
              hello@theartspire.com
            </div>
            <div
              style={{
                borderTop: "1px solid var(--line)",
                padding: "16px 0",
                fontSize: 14,
                color: "#54514a",
              }}
            >
              <b style={{ color: "var(--forest)" }}>Studio</b>
              <br />
              Lucknow, India — shipping pan-India
            </div>
            <div
              style={{
                borderTop: "1px solid var(--line)",
                borderBottom: "1px solid var(--line)",
                padding: "16px 0",
                fontSize: 14,
                color: "#54514a",
              }}
            >
              <b style={{ color: "var(--forest)" }}>Hours</b>
              <br />
              Mon–Sat · 9am–9pm IST
            </div>
            <a
              className="btn btn-gold btn-block"
              href={waLink("Hi Himangi! I'd love to chat about a custom artwork.")}
              target="_blank"
              rel="noreferrer"
              style={{ marginTop: 22 }}
            >
              <span>Message on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
