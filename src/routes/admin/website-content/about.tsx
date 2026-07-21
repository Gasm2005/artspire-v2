import { createFileRoute } from "@tanstack/react-router";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { ArrowLeft, Save, Upload, Loader2, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { updateWebsiteContent, upsertWebsiteContent } from "@/lib/website-content";
import { uploadMediaFile } from "@/lib/media-library";
import { toast } from "@/lib/toast";

export const Route = createFileRoute("/admin/website-content/about")({
  component: AboutContentPage,
});

function AboutContentPage() {
  const { items, loading, refresh } = useWebsiteContent({ page: "about" });
  const [saving, setSaving] = useState(false);

  async function handleSave(contentKey: string, value: string) {
    setSaving(true);
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
      toast.success("Saved!", "Changes are now live on the About page.");
      await refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save.", "Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const getValue = (key: string): string =>
    items.find((i) => i.content_key === key)?.value_text ?? "";

  // Matches the actual sections rendered on /about
  const imageFields = [
    { key: "about.hero.image", label: "Studio Photo (Why Artspire Exists section)" },
    { key: "about.story.image", label: "Artwork in Progress Photo (The Story section)" },
  ];

  const textSections = [
    {
      name: "Trust Line (below H1)",
      fields: [
        {
          key: "about.trust.text",
          label: "Trust line",
          type: "text" as const,
          placeholder: "11+ Years · 1000+ Memories Created · One Pair of Hands · Handcrafted",
        },
      ],
    },
    {
      name: "Why Artspire Exists",
      fields: [
        {
          key: "about.why.content",
          label: "Paragraph",
          type: "textarea" as const,
          placeholder:
            "Think about the last time you wanted to give someone something truly original...",
        },
      ],
    },
    {
      name: "The Night I Started Over",
      fields: [
        {
          key: "about.night.content",
          label: "Paragraph",
          type: "textarea" as const,
          placeholder: "A client needed a portrait...",
        },
      ],
    },
    {
      name: "Why Clients Return",
      fields: [
        {
          key: "about.return.content",
          label: "Paragraph",
          type: "textarea" as const,
          placeholder: "Trust is not built through marketing...",
        },
      ],
    },
  ];

  if (loading) return <p className="font-body text-stone text-[13px] p-6">Loading…</p>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <a
          href="/admin/website-content"
          className="p-2 rounded-lg hover:bg-forest/5 text-stone hover:text-forest transition-colors"
        >
          <ArrowLeft size={18} />
        </a>
        <div>
          <h1 className="font-display text-[24px] md:text-[28px] text-forest font-medium">
            About Page
          </h1>
          <p className="font-body text-[13px] text-stone mt-0.5">
            Edit photos and story content on the About page
          </p>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-sm space-y-5">
        <h2 className="font-display text-[16px] text-forest font-medium">Photos</h2>
        {imageFields.map((f) => (
          <AboutImageField
            key={f.key}
            label={f.label}
            contentKey={f.key}
            value={getValue(f.key)}
            onSave={(val) => handleSave(f.key, val)}
          />
        ))}
      </div>

      {/* Text sections */}
      {textSections.map((section) => (
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
  );
}

// ─── Image field with upload ─────────────────────────────────
function AboutImageField({
  label,
  contentKey,
  value,
  onSave,
}: {
  label: string;
  contentKey: string;
  value: string;
  onSave: (val: string) => void;
}) {
  const [preview, setPreview] = useState(value);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setPreview(value), [value]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { publicUrl } = await uploadMediaFile(file, { folder: "about", altText: label });
      setPreview(publicUrl);
      onSave(publicUrl);
    } catch (err) {
      console.error(err);
      toast.error("Upload failed.", "Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block font-body text-[11px] font-semibold text-stone uppercase tracking-wider mb-2">
        {label}
      </label>
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-border w-full max-w-xs">
          <img src={preview} alt={label} className="w-full h-[140px] object-cover" />
          <button
            onClick={() => {
              setPreview("");
              onSave("");
            }}
            className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow hover:bg-white transition-colors"
          >
            <X size={12} className="text-stone" />
          </button>
          <label className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-2.5 py-1 bg-white/90 rounded-lg font-body text-[10px] font-semibold text-forest cursor-pointer hover:bg-white transition-colors">
            {uploading ? <Loader2 size={11} className="animate-spin" /> : <Upload size={11} />}
            Change
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
              disabled={uploading}
            />
          </label>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full max-w-xs h-[120px] rounded-xl border-2 border-dashed border-border bg-cream hover:border-gold transition-colors cursor-pointer">
          {uploading ? (
            <Loader2 size={20} className="animate-spin text-stone/40 mb-1" />
          ) : (
            <Upload size={20} className="text-stone/40 mb-1" />
          )}
          <span className="font-body text-[11px] text-stone/60">
            {uploading ? "Uploading…" : "Click to upload"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
}

// ─── Text field ───────────────────────────────────────────────
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

  // Sync when DB value loads (fixes stale-closure bug from previous version)
  useEffect(() => setLocalValue(value), [value]);

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
            rows={4}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold transition-colors resize-y min-h-[100px]"
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
          className="shrink-0 h-[44px] px-4 bg-forest text-white font-body font-bold text-[12px] rounded-xl hover:bg-forest/90 transition-colors disabled:opacity-50"
        >
          <Save size={14} />
        </button>
      </div>
    </div>
  );
}
