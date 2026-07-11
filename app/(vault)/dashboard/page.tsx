import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CreateVaultForm } from "@/components/vault/create-vault-form";
import { DashboardView } from "@/components/vault/dashboard-view";

export default async function DashboardPage() {
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
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground">
              Create Your Passion Vault
            </h2>
            <p className="text-muted mt-2">
              This is where your journey begins. Your vault will hold every
              memory, every lesson, and every reason you started.
            </p>
          </div>
          <CreateVaultForm userId={userData.user.id} />
        </div>
      </div>
    );
  }

  // Fetch stats
  const { count: totalMemories } = await supabase
    .from("memories")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userData.user.id);

  const { data: activeDays } = await supabase
    .from("memories")
    .select("created_at")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  // Count unique days
  const uniqueDays = new Set(
    (activeDays || []).map((m) => m.created_at.split("T")[0])
  ).size;

  // Fetch recent memories
  const { data: recentMemories } = await supabase
    .from("memories")
    .select("*, ai_reflections(*)")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <DashboardView
      vault={vault}
      totalMemories={totalMemories || 0}
      uniqueDays={uniqueDays}
      recentMemories={recentMemories || []}
    />
  );
}
