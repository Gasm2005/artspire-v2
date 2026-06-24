import { createFileRoute } from "@tanstack/react-router";
import { FileText, Construction } from "lucide-react";

export const Route = createFileRoute("/admin/pages/")({
  component: PagesPage,
});

function PagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[24px] md:text-[28px] text-forest font-medium">Page Sections</h1>
        <p className="font-body text-[13px] text-stone mt-0.5">Build and manage page sections</p>
      </div>

      <div className="bg-white rounded-2xl border border-border p-8 text-center shadow-sm">
        <Construction size={40} className="mx-auto text-stone/30 mb-4" />
        <h2 className="font-display text-[18px] text-forest font-medium mb-2">Coming Soon</h2>
        <p className="font-body text-[14px] text-stone max-w-md mx-auto">
          The Page Section Manager is being built. You'll be able to enable, disable, and reorder
          sections on any page without touching code.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PlaceholderCard title="Homepage Sections" description="Hero, categories, testimonials, CTA" icon={FileText} />
        <PlaceholderCard title="About Sections" description="Story, mission, team" icon={FileText} />
        <PlaceholderCard title="Custom Sections" description="Create reusable sections" icon={FileText} />
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
