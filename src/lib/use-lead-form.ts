import { useState } from "react";
import { submitContactLead } from "./leads.server";
import {
  uploadCommissionPhotos,
  validatePhotos,
  MAX_PHOTOS,
  type PhotoUploadProgress,
} from "./commission-photos";
import { reportError } from "./sentry-client";

// Shared submit logic for the commission (/services) and contact (/contact)
// forms. Task 0D: NEVER navigate away — success shows an in-page confirmation
// with the lead number, failure preserves input and allows retry, and retries
// are idempotent (no duplicate leads) and don't re-upload photos that already
// landed.

export type LeadSubmitStatus = "idle" | "submitting" | "success" | "error";
export type LeadPayload = { name: string; phone: string; email?: string; requirement?: string };

export function useLeadForm(opts?: { withPhotos?: boolean }) {
  // Stable per form instance: doubles as the idempotency key AND the photo
  // storage folder, so a retry reuses both.
  const [formId] = useState(() => crypto.randomUUID());
  const [status, setStatus] = useState<LeadSubmitStatus>("idle");
  const [leadNumber, setLeadNumber] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPaths, setPhotoPaths] = useState<Record<number, string>>({});
  const [photoProgress, setPhotoProgress] = useState<PhotoUploadProgress[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [attachedCount, setAttachedCount] = useState(0);

  function onPickPhotos(fileList: FileList | null) {
    const files = Array.from(fileList ?? []).slice(0, MAX_PHOTOS);
    setPhotos(files);
    setPhotoPaths({}); // new selection → start fresh
    setPhotoProgress([]);
    setPhotoError(files.length ? validatePhotos(files) : null);
  }

  async function submit(payload: LeadPayload) {
    if (status === "submitting") return;
    if (!payload.name.trim() || !payload.phone.trim()) {
      setErrorMsg("Please enter your name and phone number.");
      setStatus("error");
      return;
    }
    if (opts?.withPhotos && photos.length) {
      const pv = validatePhotos(photos);
      if (pv) {
        setPhotoError(pv);
        return;
      }
    }

    setStatus("submitting");
    setErrorMsg(null);
    try {
      let photoUrls: string[] = [];
      if (opts?.withPhotos && photos.length) {
        // Only upload photos not already uploaded on a previous attempt.
        const skip = new Set(Object.keys(photoPaths).map(Number));
        const { paths: newPaths } = await uploadCommissionPhotos(
          photos,
          `commission/${formId}`,
          skip,
          (p) =>
            setPhotoProgress((prev) => {
              const next = [...prev];
              next[p.index] = p;
              return next;
            }),
        );
        const merged = { ...photoPaths, ...newPaths };
        setPhotoPaths(merged);
        photoUrls = photos.map((_, i) => merged[i]).filter((p): p is string => !!p);
      }

      const res = await submitContactLead({
        data: {
          name: payload.name,
          phone: payload.phone,
          email: payload.email,
          requirement: payload.requirement,
          photoUrls,
          idempotencyKey: formId,
        },
      });
      setLeadNumber(res.leadNumber);
      setAttachedCount(photoUrls.length);
      setStatus("success");
    } catch (err) {
      reportError(err, { form: opts?.withPhotos ? "commission" : "contact" });
      setErrorMsg(
        "We couldn't save your enquiry just now — your details are kept here. Please try again, or reach out on WhatsApp below.",
      );
      setStatus("error");
    }
  }

  return {
    formId,
    status,
    leadNumber,
    errorMsg,
    attachedCount,
    photos,
    photoProgress,
    photoError,
    onPickPhotos,
    submit,
  };
}
