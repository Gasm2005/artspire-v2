import { createFileRoute } from "@tanstack/react-router";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { updateWebsiteContent, upsertWebsiteContent } from "@/lib/website-content";

export const Route = createFileRoute("/admin/website-content/contact")({
  component: ContactContentPage,
});

function ContactContentPage() {
  const { items, loading, refresh } = useWebsiteContent({ page: "contact" });
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
      name: "Contact Info",
      fields: [
        {
          key: "contact.info.phone",
          label: "Phone Number",
          type: "text" as const,
          placeholder: "+91 98765 43210",
        },
        {
          key: "contact.info.whatsapp",
          label: "WhatsApp Number",
          type: "text" as const,
          placeholder: "+91 98765 43210",
        },
        {
          key: "contact.info.email",
          label: "Email Address",
          type: "text" as const,
          placeholder: "hello@artspire.in",
        },
        {
          key: "contact.info.address",
          label: "Full Address",
          type: "textarea" as const,
          placeholder: "Mumbai, Maharashtra, India",
        },
      ],
    },
    {
      name: "Business Hours",
      fields: [
        {
          key: "contact.hours.text",
          label: "Hours Display",
          type: "text" as const,
          placeholder: "Mon–Sat, 9am–9pm",
        },
      ],
    },
    {
      name: "Social Links",
      fields: [
        {
          key: "contact.social.instagram",
          label: "Instagram URL",
          type: "text" as const,
          placeholder: "https://instagram.com/artspire",
        },
        {
          key: "contact.social.facebook",
          label: "Facebook URL",
          type: "text" as const,
          placeholder: "https://facebook.com/artspire",
        },
        {
          key: "contact.social.whatsapp",
          label: "WhatsApp Link",
          type: "text" as const,
          placeholder: "https://wa.me/917408690994",
        },
      ],
    },
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
          <h1 className="font-display text-[24px] md:text-[28px] text-forest font-medium">
            Contact Page
          </h1>
          <p className="font-body text-[13px] text-stone mt-0.5">
            Edit contact info, hours, and social links
          </p>
        </div>
      </div>

      {saveStatus === "success" && (
        <div className="p-3 rounded-xl bg-green-50 border border-green-200 font-body text-[13px] text-green-700">
          ✅ Saved.
        </div>
      )}
      {saveStatus === "error" && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 font-body text-[13px] text-red-700">
          ❌ Failed.
        </div>
      )}

      {loading ? (
        <div className="font-body text-stone text-[13px]">Loading...</div>
      ) : (
        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.name}
              className="bg-white rounded-2xl border border-border p-5 shadow-sm"
            >
              <h2 className="font-display text-[16px] text-forest font-medium mb-4">
                {section.name}
              </h2>
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
