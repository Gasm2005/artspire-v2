import { useState } from "react";
import { useVisualAssets } from "@/hooks/useVisualAssets";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, Layers, Check, X } from "lucide-react";

interface VisualAssetSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (assetId: string, publicUrl: string, name: string) => void;
  assetType?: string;
  allowNone?: boolean;
}

export function VisualAssetSelector({ open, onOpenChange, onSelect, assetType, allowNone = true }: VisualAssetSelectorProps) {
  const { items, loading } = useVisualAssets({ assetType: assetType as any, isActive: true });
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = items.filter((item) => {
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function handleConfirm() {
    const selected = items.find((i) => i.id === selectedId);
    if (selected) {
      onSelect(selected.id, selected.public_url, selected.name);
    }
    onOpenChange(false);
    setSelectedId(null);
  }

  function handleNone() {
    onSelect("", "", "");
    onOpenChange(false);
    setSelectedId(null);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-[18px] text-forest">Select Visual Asset</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone/50" />
            <input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-[40px] pl-9 pr-4 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold"
            />
          </div>

          {loading ? (
            <div className="font-body text-stone text-[13px]">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8">
              <Layers size={32} className="mx-auto text-stone/30 mb-2" />
              <p className="font-body text-stone text-[13px]">No visual assets found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {filtered.map((item) => {
                const isSelected = selectedId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-colors ${
                      isSelected ? "border-forest" : "border-transparent hover:border-forest/30"
                    }`}
                  >
                    {item.preview_url ? (
                      <img src={item.preview_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-forest/5 text-stone/30">
                        <Layers size={20} />
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute inset-0 bg-forest/20 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-forest flex items-center justify-center">
                          <Check size={14} className="text-white" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="font-body text-[9px] text-white truncate">{item.name}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex gap-2">
              {allowNone && (
                <Button variant="outline" onClick={handleNone}>
                  No Overlay
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                <X size={14} className="mr-1" /> Cancel
              </Button>
              <Button onClick={handleConfirm} disabled={!selectedId} className="bg-forest hover:bg-forest/90">
                <Check size={14} className="mr-1" /> Select
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
