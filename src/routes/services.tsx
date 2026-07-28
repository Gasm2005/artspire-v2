import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { waLink } from "../lib/whatsapp";
import { submitContactLead } from "@/lib/leads.server";
import { getCategories, type CategoryWithVisuals } from "@/lib/categories";
import {
  uploadCommissionPhotos,
  validatePhotos,
  MAX_PHOTOS,
  type PhotoUploadProgress,
} from "@/lib/commission-photos";
import { SiteChrome } from "@/components/site/SiteChrome";
import { ImageWithFallback } from "@/components/ImageWithFallback";

export const Route = createFileRoute("/services")({
  loader: async () => {
    // Service-card images are managed from /admin/categories (the `categories`
    // table). Each service maps to a category slug below.
    const categories = await getCategories().catch(() => []);
    return { categories: categories as CategoryWithVisuals[] };
  },
  head: () => ({
    meta: [
      { title: "Commissions | The Artspire" },
      {
        name: "description",
        content:
          "Bespoke commissioned art by Himangi Pandey — portraits, sculptures, and memory-made objects. A handful of private commissions each month.",
      },
    ],
  }),
  component: ServicesPage,
});

// `categorySlug` links each service to an admin-managed row in the `categories`
// table so its image can be changed from the admin panel (no hardcoded paths).
const SERVICES = [
  { title: "Pencil Sketches", days: "5–7 days", from: "₹999", categorySlug: "pencil-sketches" },
  {
    title: "Colour Portraits",
    days: "7–10 days",
    from: "₹1,999",
    categorySlug: "colour-portraits",
  },
  { title: "Custom Paintings", days: "10–14 days", from: "₹2,999", categorySlug: "paintings" },
  { title: "Mirror Art", days: "7–12 days", from: "₹2,499", categorySlug: "mirror-art" },
  { title: "Clay Art", days: "7–10 days", from: "₹1,799", categorySlug: "clay-art" },
  {
    title: "Personalised Gifts",
    days: "5–10 days",
    from: "₹899",
    categorySlug: "personalized-gifts",
  },
];

function ServicesPage() {
  const { categories } = Route.useLoaderData();
  const imageBySlug = new Map(categories.map((c) => [c.slug, c.image_url ?? null]));
  const [form, setForm] = useState({ name: "", phone: "", email: "", idea: "" });
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoProgress, setPhotoProgress] = useState<PhotoUploadProgress[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onPickPhotos = (fileList: FileList | null) => {
    const files = Array.from(fileList ?? []).slice(0, MAX_PHOTOS);
    setPhotos(files);
    setPhotoProgress([]);
    setPhotoError(files.length ? validatePhotos(files) : null);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const photoErr = photos.length ? validatePhotos(photos) : null;
    if (photoErr) {
      setPhotoError(photoErr);
      return;
    }
    setSubmitting(true);
    try {
      // Upload reference photos first (if any); the form still submits with none.
      let photoUrls: string[] = [];
      if (photos.length) {
        const res = await uploadCommissionPhotos(photos, (p) =>
          setPhotoProgress((prev) => {
            const next = [...prev];
            next[p.index] = p;
            return next;
          }),
        );
        photoUrls = res.paths;
      }
      await submitContactLead({
        data: {
          name: form.name,
          phone: form.phone,
          email: form.email,
          requirement: form.idea,
          photoUrls,
        },
      });
    } catch (err) {
      console.error("Failed to save lead:", err);
    }
    // NOTE: WhatsApp redirect + success/error handling are rewritten in Task 0D.
    window.location.href = waLink(
      `Hi Himangi, I'd like to commission a piece. I'm ${form.name} (${form.phone}). ${form.idea}`,
    );
  };

  return (
    <SiteChrome>
      <div className="wrap page-hero">
        <span className="eyebrow rv">By commission · Strictly limited</span>
        <h1 className="reveal-words">
          Bespoke, made <em>by hand</em>.
        </h1>
        <p className="rv d2">
          A handful of private commissions each month — a portrait, a sculpture, a memory made
          object. Reserved, unhurried, and yours alone.
        </p>
      </div>

      <section style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div
            className="sec-head"
            style={{
              justifyContent: "center",
              textAlign: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span className="eyebrow rv">How it works</span>
            <h2 className="reveal-words">Four unhurried steps</h2>
          </div>
          <div className="steps">
            <div className="step rv">
              <div className="no">01</div>
              <h3>Conversation</h3>
              <p>
                Share the photo, the person, or the occasion. We talk through what matters most to
                capture.
              </p>
            </div>
            <div className="step rv d1">
              <div className="no">02</div>
              <h3>Sketch &amp; quote</h3>
              <p>
                You receive a proposed approach, timeline, and price — approved before any work
                begins.
              </p>
            </div>
            <div className="step rv d2">
              <div className="no">03</div>
              <h3>Crafted by hand</h3>
              <p>Made start to finish by Himangi alone, with a preview before the final piece.</p>
            </div>
            <div className="step rv d3">
              <div className="no">04</div>
              <h3>Delivered</h3>
              <p>Carefully packed, insured, and shipped — ready to be lived with for a lifetime.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cats">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="eyebrow rv">What can be made</span>
              <h2 className="reveal-words">Signature services</h2>
            </div>
            <Link className="link-more rv d2" to="/pricing">
              See full pricing →
            </Link>
          </div>
          <div className="grid">
            {SERVICES.map((s, i) => (
              <Link
                key={s.title}
                to="/pricing"
                className={"card rv" + (i % 3 === 1 ? " d1" : i % 3 === 2 ? " d2" : "")}
              >
                <div className="imgwrap tilt">
                  <ImageWithFallback
                    src={imageBySlug.get(s.categorySlug)}
                    alt={`${s.title} — handmade by The Artspire`}
                    loading="lazy"
                    fallbackLabel="Example"
                  />
                  <div className="quick">View pricing</div>
                </div>
                <div className="cat">{s.days}</div>
                <h3>{s.title}</h3>
                <div className="price">From {s.from}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="exclusive">
        <div className="exc-border"></div>
        <div className="wrap exc-grid">
          <div>
            <span className="eyebrow rv">Start your commission</span>
            <h2 className="reveal-words">Tell Himangi about your idea.</h2>
            <p className="rv d2">
              Fill in a few details and Himangi will personally reply — usually within a day — with
              next steps.
            </p>
            <ul className="exc-list rv d3">
              <li>
                <b>✓</b> No payment until the approach is approved
              </li>
              <li>
                <b>✓</b> A preview before the final piece
              </li>
              <li>
                <b>✓</b> One artist, start to finish
              </li>
            </ul>
          </div>
          <form className="card-box rv" onSubmit={onSubmit}>
            <div className="field">
              <label>Your name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full name"
              />
            </div>
            <div className="field">
              <label>Phone / WhatsApp</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91"
              />
            </div>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@email.com"
              />
            </div>
            <div className="field">
              <label>What would you like made?</label>
              <textarea
                rows={4}
                value={form.idea}
                onChange={(e) => setForm({ ...form, idea: e.target.value })}
                placeholder="Tell us about the person, memory, or occasion…"
              />
            </div>
            <div className="field">
              <label>Reference photos (optional)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => onPickPhotos(e.target.files)}
              />
              <small
                style={{ display: "block", color: "var(--stone)", fontSize: 11, marginTop: 4 }}
              >
                Up to {MAX_PHOTOS} photos — a clear photo helps Himangi quote accurately. Kept
                private.
              </small>
              {photos.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0", fontSize: 12 }}>
                  {photos.map((f, i) => {
                    const st = photoProgress[i]?.status;
                    return (
                      <li key={i} style={{ color: "var(--stone)", padding: "2px 0" }}>
                        {f.name.length > 30 ? f.name.slice(0, 27) + "…" : f.name}
                        {st === "uploading" && " · uploading…"}
                        {st === "done" && " · ✓ uploaded"}
                        {st === "error" && (
                          <span style={{ color: "#b91c1c" }}> · failed — will retry on resend</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
              {photoError && (
                <p style={{ color: "#b91c1c", fontSize: 12, marginTop: 4 }}>{photoError}</p>
              )}
            </div>
            <button className="btn btn-gold btn-block" type="submit" disabled={submitting}>
              <span>{submitting ? "Sending…" : "Request a Commission"}</span>
            </button>
          </form>
        </div>
      </section>
    </SiteChrome>
  );
}
