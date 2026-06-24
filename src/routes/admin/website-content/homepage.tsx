import { createFileRoute } from "@tanstack/react-router";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { HOMEPAGE_SECTIONS } from "@/lib/website-content";
import { Home, ArrowLeft, Save, Image, Type, ToggleLeft } from "lucide-react";
import { useState } from "react";
import { updateWebsiteContent, upsertWebsiteContent } from "@/lib/website-content";
import type { WebsiteContent } from "@/lib/website-content";

export const Route = createFileRoute("/admin/website-content/homepage")({
  component: HomepageContentPage,
});

function HomepageContentPage() {
  const { items, loading, refresh } = useWebsiteContent({ page: "homepage" });
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSave(contentKey: string, value: string) {
    setSaving(true);
    setSaveStatus("idle");
    try {
      const existing = items.find((i) => i.content_key === contentKey);
      if (existing) {
        await updateWebsiteContent(existing.id, { value_text: value });
      } else {
        // Extract page, section, field from content key
        const parts = contentKey.split(".");
        await upsertWebsiteContent(contentKey, {
          page: parts[0],
          section: parts[1],
          field_name: parts[2],
          value_text: value,
          field_type: "text",
        });
      }
      setSaveStatus("success");
      await refresh();
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  }

  const getValue = (key: string): string => {
    return items.find((i) => i.content_key === key)?.value_text ?? "";
  };

  const heroFields = [
    { key: "homepage.hero.heading", label: "Heading", type: "text" as const, placeholder: "Handcrafted Custom Artwork" },
    { key: "homepage.hero.subheading", label: "Subheading", type: "textarea" as const, placeholder: "Pencil sketches, colour portraits, paintings, and more..." },
    { key: "homepage.hero.cta_text", label: "CTA Button Text", type: "text" as const, placeholder: "Explore Artworks" },
    { key: "homepage.hero.cta_link", label: "CTA Button Link", type: "text" as const, placeholder: "/portfolio" },
    { key: "homepage.hero.tagline", label: "Tagline", type: "text" as const, placeholder: "Handmade. Personalized. Yours." },
  ];

  const trustFields = [
    { key: "homepage.trust_strip.text", label: "Trust Strip Text", type: "text" as const, placeholder: "11+ Years • 1000+ Artworks • One Artist • Handcrafted" },
  ];

  const servicesFields = [
    { key: "homepage.services.heading", label: "Section Heading", type: "text" as const, placeholder: "What Would You Like to Create?" },
    { key: "homepage.services.subheading", label: "Section Subheading", type: "textarea" as const, placeholder: "Choose from our signature handcrafted art services..." },
  ];

  const beforeAfterFields = [
    { key: "homepage.before_after.heading", label: "Heading", type: "text" as const, placeholder: "Your Photo. Our Masterpiece." },
    { key: "homepage.before_after.subheading", label: "Subheading", type: "textarea" as const, placeholder: "See the transformation from photo to handcrafted art." },
  ];

  const howItWorksFields = [
    { key: "homepage.how_it_works.heading", label: "Heading", type: "text" as const, placeholder: "Simple. Personal. Yours." },
    { key: "homepage.how_it_works.subheading", label: "Subheading", type: "textarea" as const, placeholder: "Four easy steps from idea to delivered artwork." },
  ];

  const categoriesFields = [
    { key: "homepage.categories.heading", label: "Heading", type: "text" as const, placeholder: "Explore by Category" },
    { key: "homepage.categories.subheading", label: "Subheading", type: "textarea" as const, placeholder: "Browse our handcrafted art collections." },
  ];

  const testimonialsFields = [
    { key: "homepage.testimonials.heading", label: "Heading", type: "text" as const, placeholder: "What Our Clients Say" },
  ];

  const aboutFields = [
    { key: "homepage.about.tagline", label: "Tagline", type: "text" as const, placeholder: "The Artist Behind Artspire" },
    { key: "homepage.about.heading", label: "Heading", type: "text" as const, placeholder: "Hi, I'm Himangi." },
    { key: "homepage.about.description", label: "Description", type: "textarea" as const, placeholder: "For over 11 years, I've been helping people capture..." },
    { key: "homepage.about.cta_text", label: "CTA Text", type: "text" as const, placeholder: "Read My Story →" },
  ];

  const giftsFields = [
    { key: "homepage.gifts.heading", label: "Heading", type: "text" as const, placeholder: "Find the Perfect Gift" },
    { key: "homepage.gifts.subheading", label: "Subheading", type: "textarea" as const, placeholder: "Handcrafted art for every special occasion." },
  ];

  const sections = [
    { name: "Hero Section", fields: heroFields },
    { name: "Trust Strip", fields: trustFields },
    { name: "Services", fields: servicesFields },
    { name: "Before & After", fields: beforeAfterFields },
    { name: "How It Works", fields: howItWorksFields },
    { name: "Categories", fields: categoriesFields },
    { name: "Testimonials", fields: testimonialsFields },
    { name: "About Artist", fields: aboutFields },
    { name: "Gift Section", fields: giftsFields },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a
          href="/admin/website-content"
          className="p-2 rounded-lg hover:bg-forest/5 text-stone hover:text-forest transition-colors"
        >
          <ArrowLeft size={18} />
        </a>
        <div>
          <h1 className="font-display text-[24px] md:text-[28px] text-forest font-medium">Homepage Content</h1>
          <p className="font-body text-[13px] text-stone mt-0.5">Edit all text and content on the homepage</p>
        </div>
      </div>

      {saveStatus === "success" && (
        <div className="p-3 rounded-xl bg-green-50 border border-green-200 font-body text-[13px] text-green-700">
          ✅ Changes saved successfully.
        </div>
      )}
      {saveStatus === "error" && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 font-body text-[13px] text-red-700">
          ❌ Failed to save. Please try again.
        </div>
      )}

      {loading ? (
        <div className="font-body text-stone text-[13px]">Loading content...</div>
      ) : (
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.name} className="bg-white rounded-2xl border border-border p-5 shadow-sm">
              <h2 className="font-display text-[16px] text-forest font-medium mb-4">{section.name}</h2>
              <div className="space-y-4">
                {section.fields.map((field) => (
                  <ContentField
                    key={field.key}
                    label={field.label}
                    value={getValue(field.key)}
                    placeholder={field.placeholder}
                    type={field.type}
                    onSave={(val) => handleSave(field.key, val)}
                    saving={saving}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ContentField({
  label,
  value,
  placeholder,
  type,
  onSave,
  saving,
}: {
  label: string;
  value: string;
  placeholder: string;
  type: "text" | "textarea";
  onSave: (val: string) => void;
  saving: boolean;
}) {
  const [localValue, setLocalValue] = useState(value);

  // Update local value when external value changes
  useState(() => {
    setLocalValue(value);
  });

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold transition-colors";

  return (
    <div>
      <label className="block font-body text-[11px] font-semibold text-stone uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="flex gap-2">
        {type === "textarea" ? (
          <textarea
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className={inputClass + " resize-y min-h-[80px]"}
          />
        ) : (
          <input
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            placeholder={placeholder}
            className={inputClass}
          />
        )}
        <button
          onClick={() => onSave(localValue)}
          disabled={saving}
          className="shrink-0 h-[44px] px-4 bg-forest text-white font-body font-bold text-[12px] rounded-xl btn-primary disabled:opacity-50"
        >
          <Save size={14} />
        </button>
      </div>
    </div>
  );
}
