import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

interface ImageUploaderProps {
  existingUrl?: string | null;
  onFileSelect: (file: File | null) => void;
  alt?: string;
  onAltChange?: (alt: string) => void;
}

export function ImageUploader({ existingUrl, onFileSelect, alt, onAltChange }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(existingUrl ?? null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onFileSelect(file);
    }
  }

  function handleClear() {
    setPreview(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-3">
      <label className="block font-body text-[11px] font-semibold text-stone uppercase tracking-wider">
        Artwork Image
      </label>

      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-border bg-white">
          <img src={preview} alt="Preview" className="w-full h-[200px] object-cover" />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
          >
            <X size={14} className="text-stone" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full h-[160px] rounded-xl border-2 border-dashed border-border bg-white hover:border-gold transition-colors flex flex-col items-center justify-center gap-2"
        >
          <Upload size={24} className="text-stone/40" />
          <span className="font-body text-[13px] text-stone/60">Click to upload image</span>
          <span className="font-body text-[11px] text-stone/40">JPG, PNG, WebP</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {onAltChange && (
        <input
          type="text"
          value={alt ?? ""}
          onChange={(e) => onAltChange(e.target.value)}
          placeholder="Image alt text (for accessibility)"
          className="w-full h-[40px] px-4 rounded-xl border border-border bg-white font-body text-[13px] text-forest focus:outline-none focus:border-gold transition-colors"
        />
      )}
    </div>
  );
}
