import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReconnectReveal } from "@/components/memories/reconnect-reveal";

export default async function RememberWhyPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">Remember Why</h2>
        <p className="text-muted mt-1">Reconnect with the person who started this journey.</p>
      </div>
      <ReconnectReveal />
    </div>
  );
}
