import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type CommissionRequest = Database["public"]["Tables"]["commission_requests"]["Row"];
export type CommissionRequestInsert = Database["public"]["Tables"]["commission_requests"]["Insert"];
export type CommissionRequestUpdate = Database["public"]["Tables"]["commission_requests"]["Update"];
export type CommissionStatus = Database["public"]["Enums"]["commission_status"];
export type RequestStatus = Database["public"]["Enums"]["request_status"];

export async function getCommissionRequests() {
  const { data, error } = await supabase
    .from("commission_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as CommissionRequest[];
}

export async function getCommissionRequestById(id: string) {
  const { data, error } = await supabase
    .from("commission_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as CommissionRequest | null;
}

export async function getCommissionRequestsByStatus(status: CommissionStatus) {
  const { data, error } = await supabase
    .from("commission_requests")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as CommissionRequest[];
}

export async function createCommissionRequest(values: CommissionRequestInsert): Promise<CommissionRequest> {
  const { data, error } = await supabase
    .from("commission_requests")
    .insert(values)
    .select()
    .single();

  if (error) throw error;
  return data as CommissionRequest;
}

export async function updateCommissionRequest(id: string, values: CommissionRequestUpdate): Promise<CommissionRequest> {
  const { data, error } = await supabase
    .from("commission_requests")
    .update(values)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as CommissionRequest;
}

export async function updateCommissionStatus(id: string, status: CommissionStatus): Promise<CommissionRequest> {
  return updateCommissionRequest(id, { status });
}

export async function deleteCommissionRequest(id: string): Promise<void> {
  const { error } = await supabase
    .from("commission_requests")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
