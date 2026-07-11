import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { IdentityView } from "@/components/vault/identity-view";

export default async function IdentityPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  // Count memories that have AI reflections
  const { data: reflectedMemories } = await supabase
    .from("memories")
    .select("id")
    .eq("user_id", userData.user.id)
    .not("ai_reflections", "is", null);

  // The not() filter on a joined table doesn't work as expected.
  // Instead, fetch memories that have a reflection via the ai_reflections table directly.
  const { data: reflections } = await supabase
    .from("ai_reflections")
    .select("memory_id")
    .eq("user_id", userData.user.id);

  const reflectedCount = reflections ? reflections.length : 0;
  const hasEnoughMemories = reflectedCount >= 2;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Who You're Becoming</h2>
        <p className="text-muted mt-1">See how your purpose has grown.</p>
      </div>
      <IdentityView hasEnoughMemories={hasEnoughMemories} />
    </div>
  );
}
