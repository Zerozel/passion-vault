import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MemoryForm } from "@/components/memories/memory-form";

export default async function NewMemoryPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const { data: vault } = await supabase
    .from("vaults")
    .select("*")
    .eq("user_id", userData.user.id)
    .single();

  if (!vault) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">New Memory</h2>
        <p className="text-muted mt-1">What happened today that your future self should never forget?</p>
      </div>
      <MemoryForm vaultId={vault.id} userId={userData.user.id} />
    </div>
  );
}
