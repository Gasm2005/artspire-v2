import { createFileRoute } from "@tanstack/react-router";
import { Users, Construction } from "lucide-react";

export const Route = createFileRoute("/admin/leads/")({
  component: LeadsPage,
});

function LeadsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[24px] md:text-[28px] text-forest font-medium">Lead Center</h1>
        <p className="font-body text-[13px] text-stone mt-0.5">CRM for managing customer inquiries</p>
      </div>

      <div className="bg-white rounded-2xl border border-border p-8 text-center shadow-sm">
        <Construction size={40} className="mx-auto text-stone/30 mb-4" />
        <h2 className="font-display text-[18px] text-forest font-medium mb-2">Coming Soon</h2>
        <p className="font-body text-[14px] text-stone max-w-md mx-auto">
          The Lead Center is being built. You'll be able to track leads from first contact to delivery,
          manage the sales pipeline, and view analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PlaceholderCard title="Lead Pipeline" description="Kanban board view" icon={Users} />
        <PlaceholderCard title="Lead List" description="Table view with filters" icon={Users} />
        <PlaceholderCard title="Lead Analytics" description="Conversion tracking" icon={Users} />
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
