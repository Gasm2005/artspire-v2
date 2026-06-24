import { createFileRoute } from "@tanstack/react-router";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { updateWebsiteContent, upsertWebsiteContent } from "@/lib/website-content";

export const Route = createFileRoute("/admin/website-content/about")({
  component: AboutContentPage,
});

function AboutContentPage() {
  const { items, loading, refresh } = useWebsiteContent({ page: "about" });
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

  const sections = [
    {
      name: "Hero Section",
      fields: [
        { key: "about.hero.heading", label: "Heading", type: "text" as const, placeholder: "About Artspire" },
        { key: "about.hero.subheading", label: "Subheading", type: "textarea" as const, placeholder: "Discover the story behind every masterpiece..." },
      ],
    },
    {
      name: "Story",
      fields: [
        { key: "about.story.content", label: "Story Content", type: "textarea" as const, placeholder: "For over 11 years, Artspire has been..." },
      ],
    },
    {
      name: "Mission",
      fields: [
        { key: "about.mission.statement", label: "Mission Statement", type: "textarea" as const, placeholder: "To transform precious memories into timeless art..." },
      ],
    },
    {
      name: "Vision",
      fields: [
        { key: "about.vision.statement", label: "Vision Statement", type: "textarea" as const, placeholder: "To become India's most trusted custom art studio..." },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin/website-content" className="p-2 rounded-lg hover:bg-forest/5 text-stone hover:text-forest transition-colors">
          <ArrowLeft size={18} />
        </a>
        <div>
          <h1 className="font-display text-[24px] md:text-[28px] text-forest font-medium">About Page</h1>
          <p className="font-body text-[13px] text-stone mt-0.5">Edit the About Us page content</p>
        </div>
      </div>

      {saveStatus === "success" && (
        <div className="p-3 rounded-xl bg-green-50 border border-green-200 font-body text-[13px] text-green-700">✅ Saved.</div>
      )}
      {saveStatus === "error" && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 font-body text-[13px] text-red-700">❌ Failed.</div>
      )}

      {loading ? (
        <div className="font-body text-stone text-[13px]">Loading...</div>
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

  return (
    <div>
      <label className="block font-body text-[11px] font-semibold text-stone uppercase tracking-wider mb-1.5">{label}</label>
      <div className="flex gap-2">
        {type === "textarea" ? (
          <textarea
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold transition-colors resize-y min-h-[80px]"
          />
        ) : (
          <input
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold transition-colors"
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
