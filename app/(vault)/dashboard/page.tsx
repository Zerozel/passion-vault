import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CreateVaultForm } from "@/components/vault/create-vault-form";

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">{vault.dream_title}</h2>
        <p className="text-muted mt-1">{vault.mission}</p>
      </div>
      <div className="border border-border-subtle rounded-lg bg-surface p-8 text-center">
        <p className="text-muted">Your vault is ready. Create your first memory.</p>
      </div>
    </div>
  );
}
