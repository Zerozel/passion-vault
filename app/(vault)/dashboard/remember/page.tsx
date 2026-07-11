import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReconnectReveal } from "@/components/memories/reconnect-reveal";
import { Sparkles } from "lucide-react";

export default async function RememberWhyPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  // Count memories for empty state
  const { count } = await supabase
    .from("memories")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userData.user.id);

  const hasMemories = (count || 0) > 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">Remember Why</h2>
        <p className="text-muted mt-1">
          Reconnect with the person who started this journey.
        </p>
      </div>

      {hasMemories ? (
        <ReconnectReveal />
      ) : (
        <div className="border border-border-subtle rounded-xl bg-surface/50 backdrop-blur-sm p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-accent/5 border border-accent/10 flex items-center justify-center">
              <Sparkles className="h-7 w-7 text-accent/60" />
            </div>
          </div>
          <p className="text-muted max-w-sm mx-auto leading-relaxed">
            This space waits patiently. Keep capturing moments, and one
            day it will remind you of someone important.
          </p>


        </div>
      )}
    </div>
  );
}
