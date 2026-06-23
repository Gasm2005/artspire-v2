import { r as reactExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-Um71xJKt.mjs";
function useAdmin() {
  const [isAdmin, setIsAdmin] = reactExports.useState(false);
  const [role, setRole] = reactExports.useState(null);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        const { data } = await supabase.auth.getUser();
        if (!data.user) {
          if (!cancelled) {
            setIsAdmin(false);
            setRole(null);
            setIsLoading(false);
          }
          return;
        }
        const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
        if (!cancelled) {
          if (error || !profile) {
            setIsAdmin(false);
            setRole(null);
          } else {
            setRole(profile.role);
            setIsAdmin(profile.role === "admin");
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error("useAdmin error:", err);
        if (!cancelled) {
          setIsAdmin(false);
          setRole(null);
          setIsLoading(false);
        }
      }
    }
    check();
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      check();
    });
    return () => {
      cancelled = true;
      authListener.subscription.unsubscribe();
    };
  }, []);
  return { isAdmin, role, isLoading };
}
export {
  useAdmin as u
};
