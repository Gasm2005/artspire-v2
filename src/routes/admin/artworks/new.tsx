import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArtworkForm } from "@/components/ArtworkForm";

export const Route = createFileRoute("/admin/artworks/new")({
  component: NewArtworkPage,
});

function NewArtworkPage() {
  const router = useRouter();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-[24px] md:text-[28px] text-forest font-medium">
          New Artwork
        </h1>
        <p className="font-body text-[13px] text-stone mt-0.5">
          Create a new artwork and publish it instantly
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-border p-5 md:p-8 shadow-sm">
        <ArtworkForm
          onSuccess={() => {
            router.navigate({ to: "/admin/artworks" });
          }}
        />
      </div>
    </div>
  );
}
