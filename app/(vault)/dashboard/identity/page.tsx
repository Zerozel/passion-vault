import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { IdentityView } from "@/components/vault/identity-view";

export default async function IdentityPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const { count } = await supabase
    .from("memories")
    .select("*, ai_reflections(*)")
    .eq("user_id", userData.user.id)
    .not("ai_reflections", "is", null)
    .order("created_at", { ascending: true });

  const hasEnoughMemories = (count || 0) >= 2;

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
