import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import type { MemoryWithReflection } from "@/types";

export default async function MemoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const { data: memory } = await supabase
    .from("memories")
    .select("*, ai_reflections(*)")
    .eq("id", id)
    .single();

  if (!memory) {
    return (
      <div className="text-center py-16">
        <p className="text-muted">Memory not found.</p>
      </div>
    );
  }

  const typedMemory = memory as MemoryWithReflection;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted">{formatDate(typedMemory.created_at)}</p>
        <h2 className="text-2xl font-semibold text-foreground mt-1">
          {typedMemory.title}
        </h2>
        {typedMemory.emotion && (
          <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm bg-accent/10 text-accent capitalize">
            {typedMemory.emotion}
          </span>
        )}
      </div>

      <div className="border border-border-subtle rounded-lg bg-surface p-6">
        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
          {typedMemory.content}
        </p>
      </div>

      {typedMemory.image_url && (
        <img
          src={typedMemory.image_url}
          alt={typedMemory.title}
          className="rounded-lg max-h-96 w-full object-cover"
        />
      )}

      {typedMemory.voice_url && (
        <div className="border border-border-subtle rounded-lg bg-surface p-4">
          <audio controls className="w-full">
            <source src={typedMemory.voice_url} type="audio/webm" />
          </audio>
        </div>
      )}

      {typedMemory.ai_reflection && (
        <div className="border border-accent/20 rounded-lg bg-accent/5 p-6 space-y-4">
          <h3 className="text-lg font-medium text-accent">AI Reflection</h3>
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-1">Emotional Summary</p>
            <p className="text-foreground">{typedMemory.ai_reflection.emotional_summary}</p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-1">Lesson Learned</p>
            <p className="text-foreground">{typedMemory.ai_reflection.lesson_learned}</p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-1">Identity Statement</p>
            <p className="text-foreground font-medium">{typedMemory.ai_reflection.identity_statement}</p>
          </div>
        </div>
      )}
    </div>
  );
}
