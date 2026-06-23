import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as getAllArtworkTags, e as generateSlug, f as updateArtwork, h as createArtwork, i as setArtworkTags } from "./router-BMCUXijp.mjs";
import { s as supabase } from "./client-Um71xJKt.mjs";
import { l as LoaderCircle, q as Save, r as Rocket, X, U as Upload } from "../_libs/lucide-react.mjs";
async function getCategories() {
  const { data, error } = await supabase.from("categories").select("*").is("deleted_at", null).order("display_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
async function getTags() {
  const { data, error } = await supabase.from("tags").select("*").order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
async function uploadArtworkImage(file, slug) {
  const fileExt = file.name.split(".").pop() || "jpg";
  const path = `${slug}/${Date.now()}.${fileExt}`;
  const { data, error } = await supabase.storage.from("artwork-images").upload(path, file, { upsert: true });
  if (error) throw error;
  const { data: publicUrlData } = supabase.storage.from("artwork-images").getPublicUrl(data.path);
  return {
    path: data.path,
    publicUrl: publicUrlData.publicUrl
  };
}
function ImageUploader({ existingUrl, onFileSelect, alt, onAltChange }) {
  const [preview, setPreview] = reactExports.useState(existingUrl ?? null);
  const inputRef = reactExports.useRef(null);
  function handleFileChange(e) {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block font-body text-[11px] font-semibold text-stone uppercase tracking-wider", children: "Artwork Image" }),
    preview ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-xl overflow-hidden border border-border bg-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: preview, alt: "Preview", className: "w-full h-[200px] object-cover" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleClear,
          className: "absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14, className: "text-stone" })
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => inputRef.current?.click(),
        className: "w-full h-[160px] rounded-xl border-2 border-dashed border-border bg-white hover:border-gold transition-colors flex flex-col items-center justify-center gap-2",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 24, className: "text-stone/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body text-[13px] text-stone/60", children: "Click to upload image" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body text-[11px] text-stone/40", children: "JPG, PNG, WebP" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: inputRef,
        type: "file",
        accept: "image/jpeg,image/png,image/webp",
        onChange: handleFileChange,
        className: "hidden"
      }
    ),
    onAltChange && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "text",
        value: alt ?? "",
        onChange: (e) => onAltChange(e.target.value),
        placeholder: "Image alt text (for accessibility)",
        className: "w-full h-[40px] px-4 rounded-xl border border-border bg-white font-body text-[13px] text-forest focus:outline-none focus:border-gold transition-colors"
      }
    )
  ] });
}
function ArtworkForm({ artwork, onSuccess }) {
  const isEdit = !!artwork;
  const [form, setForm] = reactExports.useState({
    title: artwork?.title ?? "",
    slug: artwork?.slug ?? "",
    summary: artwork?.summary ?? "",
    story_content: artwork?.story_content ?? "",
    ai_summary: artwork?.ai_summary ?? "",
    category_id: artwork?.category_id ?? "",
    artwork_type: artwork?.artwork_type ?? "physical",
    image_alt: artwork?.image_alt ?? "",
    featured: artwork?.featured ?? false,
    show_on_homepage: artwork?.show_on_homepage ?? false,
    status: artwork?.status ?? "draft",
    price: artwork?.price?.toString() ?? "",
    currency: artwork?.currency ?? "INR",
    medium: artwork?.medium ?? "",
    size: artwork?.size ?? ""
  });
  const [selectedFile, setSelectedFile] = reactExports.useState(null);
  const [manualSlug, setManualSlug] = reactExports.useState(false);
  const [categories, setCategories] = reactExports.useState([]);
  const [allTags, setAllTags] = reactExports.useState([]);
  const [selectedTags, setSelectedTags] = reactExports.useState([]);
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
    getTags().then(setAllTags).catch(console.error);
  }, []);
  reactExports.useEffect(() => {
    if (artwork) {
      getAllArtworkTags(artwork.id).then((ids) => setSelectedTags(ids)).catch(console.error);
    }
  }, [artwork]);
  reactExports.useEffect(() => {
    if (!manualSlug && form.title && !isEdit) {
      setForm((prev) => ({ ...prev, slug: generateSlug(form.title) }));
    }
  }, [form.title, manualSlug, isEdit]);
  const updateField = reactExports.useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);
  async function handleSubmit(action) {
    setSaving(true);
    try {
      let imageUrl = artwork?.image_url ?? null;
      if (selectedFile) {
        const slug = form.slug || generateSlug(form.title);
        const result = await uploadArtworkImage(selectedFile, slug);
        imageUrl = result.publicUrl;
      }
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        summary: form.summary.trim() || null,
        story_content: form.story_content.trim() || null,
        ai_summary: form.ai_summary.trim() || null,
        category_id: form.category_id || null,
        artwork_type: form.artwork_type,
        image_url: imageUrl,
        image_alt: form.image_alt.trim() || null,
        featured: form.featured,
        show_on_homepage: form.show_on_homepage,
        status: action === "publish" ? "published" : "draft",
        price: form.price ? parseFloat(form.price) : null,
        currency: form.currency || null,
        medium: form.medium.trim() || null,
        size: form.size.trim() || null
      };
      let artworkId;
      if (isEdit && artwork) {
        await updateArtwork(artwork.id, payload);
        artworkId = artwork.id;
      } else {
        const created = await createArtwork(payload);
        artworkId = created.id;
      }
      await setArtworkTags(artworkId, selectedTags);
      onSuccess();
    } catch (err) {
      console.error("Form submit error:", err);
      alert(err instanceof Error ? err.message : "Failed to save artwork");
    } finally {
      setSaving(false);
    }
  }
  const inputClass = "w-full h-[44px] px-4 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold transition-colors";
  const textareaClass = "w-full px-4 py-3 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold transition-colors resize-y min-h-[120px]";
  const labelClass = "block font-body text-[11px] font-semibold text-stone uppercase tracking-wider mb-1.5";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      onSubmit: (e) => e.preventDefault(),
      className: "space-y-6",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelClass, children: "Title *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  required: true,
                  value: form.title,
                  onChange: (e) => updateField("title", e.target.value),
                  placeholder: "Artwork title",
                  className: inputClass
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelClass, children: "Slug *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: manualSlug,
                      onChange: (e) => setManualSlug(e.target.checked),
                      className: "rounded border-border"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body text-[11px] text-stone", children: "Manual override" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  required: true,
                  value: form.slug,
                  onChange: (e) => {
                    setManualSlug(true);
                    updateField("slug", e.target.value);
                  },
                  placeholder: "artwork-slug",
                  className: inputClass
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelClass, children: "Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: form.category_id,
                  onChange: (e) => updateField("category_id", e.target.value),
                  className: inputClass,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Select category —" }),
                    categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: cat.id, children: cat.name }, cat.id))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelClass, children: "Artwork Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: form.artwork_type,
                  onChange: (e) => updateField("artwork_type", e.target.value),
                  className: inputClass,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "physical", children: "Physical" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "digital", children: "Digital" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "commission", children: "Commission" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelClass, children: "Medium" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: form.medium,
                  onChange: (e) => updateField("medium", e.target.value),
                  placeholder: "e.g. Pencil, Acrylic, Clay",
                  className: inputClass
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelClass, children: "Size" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: form.size,
                  onChange: (e) => updateField("size", e.target.value),
                  placeholder: "e.g. 12x16 inches",
                  className: inputClass
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ImageUploader,
              {
                existingUrl: artwork?.image_url,
                onFileSelect: setSelectedFile,
                alt: form.image_alt,
                onAltChange: (alt) => updateField("image_alt", alt)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelClass, children: "Price" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    value: form.price,
                    onChange: (e) => updateField("price", e.target.value),
                    placeholder: "0",
                    className: `${inputClass} flex-1`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    value: form.currency,
                    onChange: (e) => updateField("currency", e.target.value),
                    className: `${inputClass} w-24`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "INR", children: "INR" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "USD", children: "USD" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "EUR", children: "EUR" })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelClass, children: "Tags" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: allTags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  className: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-[11px] font-semibold cursor-pointer transition-colors ${selectedTags.includes(tag.id) ? "bg-forest text-white" : "bg-forest/5 text-forest hover:bg-forest/10"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: selectedTags.includes(tag.id),
                        onChange: (e) => {
                          setSelectedTags(
                            (prev) => e.target.checked ? [...prev, tag.id] : prev.filter((id) => id !== tag.id)
                          );
                        },
                        className: "hidden"
                      }
                    ),
                    tag.name
                  ]
                },
                tag.id
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: form.featured,
                    onChange: (e) => updateField("featured", e.target.checked),
                    className: "rounded border-border w-4 h-4"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body text-[13px] text-forest", children: "Featured" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: form.show_on_homepage,
                    onChange: (e) => updateField("show_on_homepage", e.target.checked),
                    className: "rounded border-border w-4 h-4"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body text-[13px] text-forest", children: "Show on Homepage" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelClass, children: "Summary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                value: form.summary,
                onChange: (e) => updateField("summary", e.target.value),
                placeholder: "Short description of the artwork (shown in listings)",
                rows: 3,
                className: textareaClass
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelClass, children: "Story Content" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                value: form.story_content,
                onChange: (e) => updateField("story_content", e.target.value),
                placeholder: "The full story behind this artwork. You can use plain text or HTML.",
                rows: 8,
                className: textareaClass
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[11px] text-stone/60 mt-1", children: "Plain text for now. Rich editor will be added in a future update." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelClass, children: "AI Summary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                value: form.ai_summary,
                onChange: (e) => updateField("ai_summary", e.target.value),
                placeholder: "Auto-generated or manually written AI summary",
                rows: 3,
                className: textareaClass
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 pt-4 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              disabled: saving || !form.title.trim() || !form.slug.trim(),
              onClick: () => handleSubmit("draft"),
              className: "inline-flex items-center gap-2 h-[48px] px-6 border-2 border-forest text-forest font-body font-bold text-[13px] rounded-xl btn-secondary transition-colors disabled:opacity-50",
              children: [
                saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 16 }),
                "Save Draft"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              disabled: saving || !form.title.trim() || !form.slug.trim(),
              onClick: () => handleSubmit("publish"),
              className: "inline-flex items-center gap-2 h-[48px] px-6 bg-forest text-white font-body font-bold text-[13px] rounded-xl btn-primary transition-colors disabled:opacity-50",
              children: [
                saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, { size: 16 }),
                "Publish"
              ]
            }
          )
        ] })
      ]
    }
  );
}
export {
  ArtworkForm as A
};
