import { useState, useEffect, useCallback } from "react";
import {
  getVisualAssets,
  getVisualAsset,
  getVisualAssetUsage,
  uploadVisualAsset,
  updateVisualAsset,
  deleteVisualAsset,
  logVisualAssetUsage,
  removeVisualAssetUsage,
  getVisualAssetUsageCount,
  type VisualAsset,
  type VisualAssetUsage,
  VISUAL_ASSET_TYPES,
} from "@/lib/visual-assets";

export function useVisualAssets(opts?: { assetType?: string; isActive?: boolean; search?: string }) {
  const [items, setItems] = useState<VisualAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVisualAssets({
        assetType: opts?.assetType as VisualAsset["asset_type"],
        isActive: opts?.isActive,
        search: opts?.search,
      });
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [opts?.assetType, opts?.isActive, opts?.search]);

  useEffect(() => {
    load();
  }, [load]);

  const upload = useCallback(
    async (
      file: File,
      meta: {
        name: string;
        slug: string;
        assetType: VisualAsset["asset_type"];
        description?: string;
        defaultOpacity?: number;
        categorySuggestions?: string[];
      }
    ) => {
      const result = await uploadVisualAsset(file, meta);
      await load();
      return result;
    },
    [load]
  );

  const update = useCallback(
    async (id: string, values: Partial<VisualAsset>) => {
      const updated = await updateVisualAsset(id, values);
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      return updated;
    },
    []
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteVisualAsset(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    },
    []
  );

  return {
    items,
    loading,
    error,
    refresh: load,
    upload,
    update,
    remove,
    assetTypes: VISUAL_ASSET_TYPES,
  };
}

export function useVisualAsset(id: string) {
  const [item, setItem] = useState<VisualAsset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getVisualAsset(id);
        if (!cancelled) setItem(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  return { item, loading, error };
}

export function useVisualAssetUsage(assetId: string) {
  const [usages, setUsages] = useState<VisualAssetUsage[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [usageData, usageCount] = await Promise.all([
          getVisualAssetUsage(assetId),
          getVisualAssetUsageCount(assetId),
        ]);
        if (!cancelled) {
          setUsages(usageData);
          setCount(usageCount);
        }
      } catch (err) {
        console.error("useVisualAssetUsage error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [assetId]);

  const link = useCallback(
    async (entityType: string, entityId: string, usageType: string, opacity?: number) => {
      await logVisualAssetUsage(assetId, entityType, entityId, usageType, opacity);
      const [usageData, usageCount] = await Promise.all([
        getVisualAssetUsage(assetId),
        getVisualAssetUsageCount(assetId),
      ]);
      setUsages(usageData);
      setCount(usageCount);
    },
    [assetId]
  );

  const unlink = useCallback(
    async (entityType: string, entityId: string) => {
      await removeVisualAssetUsage(assetId, entityType, entityId);
      const [usageData, usageCount] = await Promise.all([
        getVisualAssetUsage(assetId),
        getVisualAssetUsageCount(assetId),
      ]);
      setUsages(usageData);
      setCount(usageCount);
    },
    [assetId]
  );

  return { usages, count, loading, link, unlink };
}
