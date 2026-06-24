import { createFileRoute } from "@tanstack/react-router";
import { FileText, Construction } from "lucide-react";

export const Route = createFileRoute("/admin/faqs/")({
  component: FAQsPage,
});

function FAQsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[24px] md:text-[28px] text-forest font-medium">FAQ Management</h1>
        <p className="font-body text-[13px] text-stone mt-0.5">Manage FAQs for the website</p>
      </div>

      <div className="bg-white rounded-2xl border border-border p-8 text-center shadow-sm">
        <Construction size={40} className="mx-auto text-stone/30 mb-4" />
        <h2 className="font-display text-[18px] text-forest font-medium mb-2">Coming Soon</h2>
        <p className="font-body text-[14px] text-stone max-w-md mx-auto">
          The FAQ Management module is being built. You'll be able to create, edit, and organize
          FAQs with sections for global, category, and artwork-specific questions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PlaceholderCard title="Global FAQs" description="Questions about ordering and delivery" icon={FileText} />
        <PlaceholderCard title="Category FAQs" description="Category-specific questions" icon={FileText} />
        <PlaceholderCard title="Artwork FAQs" description="Artwork-specific questions" icon={FileText} />
      </div>
    </div>
  );
}

function PlaceholderCard({ title, description, icon: Icon }: { title: string; description: string; icon: React.ElementType }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-5 shadow-sm opacity-60">
      <Icon size={20} className="text-forest mb-3" />
      <h3 className="font-display text-[14px] text-forest font-medium">{title}</h3>
      <p className="font-body text-[12px] text-stone mt-1">{description}</p>
    </div>
  );
}
