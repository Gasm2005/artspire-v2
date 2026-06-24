import { useState } from "react";
import { Save, Image, Type, ToggleLeft, AlignLeft } from "lucide-react";
import { MediaPicker } from "./MediaPicker";

export type ContentFieldType = "text" | "textarea" | "html" | "image" | "toggle" | "select";

interface ContentFieldDef {
  key: string;
  label: string;
  type: ContentFieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  description?: string;
  folder?: string;
}

interface ContentEditorProps {
  fields: ContentFieldDef[];
  values: Record<string, string>;
  onSave: (key: string, value: string) => void;
  saving?: boolean;
}

export function ContentEditor({ fields, values, onSave, saving = false }: ContentEditorProps) {
  const [localValues, setLocalValues] = useState<Record<string, string>>(values);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<string | null>(null);

  function handleChange(key: string, value: string) {
    setLocalValues((prev) => ({ ...prev, [key]: value }));
  }

  function handlePickerSelect(mediaId: string, publicUrl: string) {
    if (pickerTarget) {
      handleChange(pickerTarget, publicUrl);
      onSave(pickerTarget, publicUrl);
    }
    setPickerOpen(false);
    setPickerTarget(null);
  }

  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const value = localValues[field.key] ?? "";
        return (
          <div key={field.key}>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-body text-[11px] font-semibold text-stone uppercase tracking-wider">
                {field.label}
              </label>
              {field.description && (
                <span className="font-body text-[10px] text-stone/50">{field.description}</span>
              )}
            </div>

            <div className="flex gap-2">
              {field.type === "text" && (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="flex-1 h-[44px] px-4 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold transition-colors"
                />
              )}

              {field.type === "textarea" && (
                <textarea
                  value={value}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold transition-colors resize-y min-h-[80px]"
                />
              )}

              {field.type === "html" && (
                <textarea
                  value={value}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={5}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-white font-body text-[13px] text-forest focus:outline-none focus:border-gold transition-colors resize-y min-h-[120px] font-mono"
                />
              )}

              {field.type === "image" && (
                <div className="flex-1 flex items-center gap-2">
                  {value ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-border shrink-0">
                      <img src={value} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-forest/5 flex items-center justify-center shrink-0">
                      <Image size={16} className="text-stone/40" />
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setPickerTarget(field.key);
                      setPickerOpen(true);
                    }}
                    className="h-[36px] px-3 border border-forest text-forest font-body font-semibold text-[11px] rounded-lg hover:bg-forest/5 transition-colors"
                  >
                    Select Image
                  </button>
                  {value && (
                    <button
                      onClick={() => handleChange(field.key, "")}
                      className="h-[36px] px-3 text-stone font-body text-[11px] hover:text-red-600 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}

              {field.type === "toggle" && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value === "true"}
                    onChange={(e) => {
                      const val = e.target.checked ? "true" : "false";
                      handleChange(field.key, val);
                      onSave(field.key, val);
                    }}
                    className="rounded border-border w-4 h-4"
                  />
                  <span className="font-body text-[13px] text-forest">{field.placeholder ?? "Enabled"}</span>
                </label>
              )}

              {field.type === "select" && (
                <select
                  value={value}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="flex-1 h-[44px] px-4 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold"
                >
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              )}

              {field.type !== "toggle" && field.type !== "image" && (
                <button
                  onClick={() => onSave(field.key, value)}
                  disabled={saving}
                  className="shrink-0 h-[44px] px-4 bg-forest text-white font-body font-bold text-[12px] rounded-xl btn-primary disabled:opacity-50"
                >
                  <Save size={14} />
                </button>
              )}
            </div>
          </div>
        );
      })}

      <MediaPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handlePickerSelect}
        folder={fields.find((f) => f.key === pickerTarget)?.folder}
      />
    </div>
  );
}
