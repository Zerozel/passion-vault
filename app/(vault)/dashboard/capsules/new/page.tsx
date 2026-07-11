import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CreateCapsuleForm } from "@/components/vault/create-capsule-form";

export default async function NewCapsulePage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Time Capsule</h2>
        <p className="text-muted mt-1">
          Write a letter that only time should open.
        </p>
      </div>
      <CreateCapsuleForm userId={userData.user.id} />
    </div>
  );
}
