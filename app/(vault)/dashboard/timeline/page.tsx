import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TimelineView } from "@/components/memories/timeline-view";
import type { MemoryWithReflection } from "@/types";

export default async function TimelinePage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const { data: memories } = await supabase
    .from("memories")
    .select("*, ai_reflections(*)")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  const typedMemories = (memories || []) as MemoryWithReflection[];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Timeline</h2>
        <p className="text-muted mt-1">Your journey, preserved.</p>
      </div>
      <TimelineView memories={typedMemories} />
    </div>
  );
}
