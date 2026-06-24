import { useState } from "react";
import { Save, AlertCircle } from "lucide-react";

interface SEOEditorProps {
  entityType: string;
  entityId: string;
  initialValues?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    robotsMeta?: string;
    schemaType?: string;
  };
  onSave?: (values: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string;
    ogTitle: string;
    ogDescription: string;
    robotsMeta: string;
    schemaType: string;
  }) => void;
}

export function SEOEditor({ initialValues = {}, onSave }: SEOEditorProps) {
  const [values, setValues] = useState({
    metaTitle: initialValues.metaTitle ?? "",
    metaDescription: initialValues.metaDescription ?? "",
    canonicalUrl: initialValues.canonicalUrl ?? "",
    ogTitle: initialValues.ogTitle ?? "",
    ogDescription: initialValues.ogDescription ?? "",
    robotsMeta: initialValues.robotsMeta ?? "index, follow",
    schemaType: initialValues.schemaType ?? "Article",
  });

  const [saving, setSaving] = useState(false);
  const [score, setScore] = useState(() => calculateScore(values));

  function calculateScore(v: typeof values) {
    let s = 0;
    if (v.metaTitle) s += 20;
    if (v.metaDescription) s += 20;
    if (v.canonicalUrl) s += 10;
    if (v.ogTitle) s += 10;
    if (v.ogDescription) s += 10;
    return s;
  }

  function handleChange(field: keyof typeof values, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    setScore(calculateScore(next));
  }

  function handleSave() {
    setSaving(true);
    onSave?.(values);
    setTimeout(() => setSaving(false), 500);
  }

  const scoreColor = score >= 60 ? "text-green-600" : score >= 30 ? "text-amber-600" : "text-red-600";
  const scoreBg = score >= 60 ? "bg-green-50" : score >= 30 ? "bg-amber-50" : "bg-red-50";

  return (
    <div className="space-y-5">
      {/* Score */}
      <div className={`p-4 rounded-xl border ${scoreBg} border-border flex items-center gap-3`}>
        <div className={`w-10 h-10 rounded-full ${scoreBg} border-2 flex items-center justify-center ${scoreColor}`}>
          <span className="font-display text-[14px] font-bold">{score}</span>
        </div>
        <div>
          <p className={`font-body text-[13px] font-bold ${scoreColor}`}>SEO Health Score</p>
          <p className="font-body text-[11px] text-stone/60">
            {score >= 60 ? "Good — your page is well optimized." : score >= 30 ? "Fair — add more metadata." : "Poor — missing important SEO fields."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SEOField
          label="Meta Title"
          value={values.metaTitle}
          onChange={(v) => handleChange("metaTitle", v)}
          maxLength={60}
          placeholder="Page title for search engines"
        />
        <SEOField
          label="Meta Description"
          value={values.metaDescription}
          onChange={(v) => handleChange("metaDescription", v)}
          maxLength={160}
          textarea
          placeholder="Brief description shown in search results"
        />
        <SEOField
          label="Canonical URL"
          value={values.canonicalUrl}
          onChange={(v) => handleChange("canonicalUrl", v)}
          placeholder="https://artspire.in/page"
        />
        <SEOField
          label="OG Title"
          value={values.ogTitle}
          onChange={(v) => handleChange("ogTitle", v)}
          placeholder="Title for social sharing"
        />
        <SEOField
          label="OG Description"
          value={values.ogDescription}
          onChange={(v) => handleChange("ogDescription", v)}
          textarea
          placeholder="Description for social sharing"
        />
        <div>
          <label className="block font-body text-[11px] font-semibold text-stone uppercase tracking-wider mb-1.5">Robots Meta</label>
          <select
            value={values.robotsMeta}
            onChange={(e) => handleChange("robotsMeta", e.target.value)}
            className="w-full h-[44px] px-4 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold"
          >
            <option value="index, follow">Index, Follow (default)</option>
            <option value="noindex, follow">Noindex, Follow</option>
            <option value="index, nofollow">Index, Nofollow</option>
            <option value="noindex, nofollow">Noindex, Nofollow</option>
          </select>
        </div>
        <div>
          <label className="block font-body text-[11px] font-semibold text-stone uppercase tracking-wider mb-1.5">Schema Type</label>
          <select
            value={values.schemaType}
            onChange={(e) => handleChange("schemaType", e.target.value)}
            className="w-full h-[44px] px-4 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold"
          >
            <option value="Article">Article</option>
            <option value="Product">Product</option>
            <option value="FAQPage">FAQPage</option>
            <option value="Organization">Organization</option>
            <option value="LocalBusiness">LocalBusiness</option>
            <option value="CreativeWork">CreativeWork</option>
            <option value="BreadcrumbList">BreadcrumbList</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 h-[48px] px-6 bg-forest text-white font-body font-bold text-[13px] rounded-xl btn-primary transition-colors disabled:opacity-50"
      >
        <Save size={16} />
        {saving ? "Saving..." : "Save SEO Settings"}
      </button>
    </div>
  );
}

function SEOField({
  label,
  value,
  onChange,
  maxLength,
  textarea = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  maxLength?: number;
  textarea?: boolean;
  placeholder?: string;
}) {
  const length = value.length;
  const isOver = maxLength ? length > maxLength : false;
  const isGood = maxLength ? length > 0 && length <= maxLength : length > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="font-body text-[11px] font-semibold text-stone uppercase tracking-wider">{label}</label>
        {maxLength && (
          <span className={`font-body text-[10px] ${isOver ? "text-red-500" : isGood ? "text-green-500" : "text-stone/50"}`}>
            {length}/{maxLength}
          </span>
        )}
      </div>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={`w-full px-4 py-2.5 rounded-xl border bg-white font-body text-[14px] text-forest focus:outline-none transition-colors resize-y min-h-[80px] ${
            isOver ? "border-red-300 focus:border-red-400" : "border-border focus:border-gold"
          }`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full h-[44px] px-4 rounded-xl border bg-white font-body text-[14px] text-forest focus:outline-none transition-colors ${
            isOver ? "border-red-300 focus:border-red-400" : "border-border focus:border-gold"
          }`}
        />
      )}
      {isOver && (
        <p className="font-body text-[10px] text-red-500 mt-1">Too long. Search engines may truncate.</p>
      )}
    </div>
  );
}
