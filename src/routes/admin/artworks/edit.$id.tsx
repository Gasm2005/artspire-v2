import { createFileRoute, useRouter, notFound } from "@tanstack/react-router";
import { getArtworkWithImages } from "@/lib";
import { ArtworkForm } from "@/components/ArtworkForm";

export const Route = createFileRoute("/admin/artworks/edit/$id")({
  loader: async ({ params }) => {
    const artwork = await getArtworkWithImages(params.id);
    if (!artwork) throw notFound();
    return { artwork };
  },
  component: EditArtworkPage,
});

function EditArtworkPage() {
  const { artwork } = Route.useLoaderData();
  const router = useRouter();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-[24px] md:text-[28px] text-forest font-medium">
          Edit Artwork
        </h1>
        <p className="font-body text-[13px] text-stone mt-0.5">Update "{artwork.title}"</p>
      </div>

      <div className="bg-white rounded-2xl border border-border p-5 md:p-8 shadow-sm">
        <ArtworkForm
          artwork={artwork}
          onSuccess={() => {
            router.navigate({ to: "/admin/artworks" });
          }}
        />
      </div>
    </div>
  );
}
