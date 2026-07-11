import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <p className="text-muted">This memory no longer exists.</p>
          <Link
            href="/dashboard/timeline"
            className="text-accent hover:underline text-sm"
          >
            Return to timeline
          </Link>
        </div>
      </div>
    );
  }

  const typedMemory = memory as MemoryWithReflection;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Back navigation */}
      <Link
        href="/dashboard/timeline"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to timeline
      </Link>

      {/* Memory header */}
      <div className="space-y-3">
        <p className="text-sm text-muted">
          {formatDate(typedMemory.created_at)}
        </p>
        <h1 className="text-3xl font-semibold text-foreground leading-tight">
          {typedMemory.title}
        </h1>
        {typedMemory.emotion && (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-accent/10 text-accent border border-accent/20 capitalize">
            {typedMemory.emotion}
          </span>
        )}
      </div>

      {/* Story content */}
      <div className="border border-border-subtle rounded-xl bg-surface/50 backdrop-blur-sm p-8">
        <p className="text-foreground leading-relaxed text-lg whitespace-pre-wrap">
          {typedMemory.content}
        </p>
      </div>

      {/* Image */}
      {typedMemory.image_url && (
        <div className="rounded-xl overflow-hidden border border-border-subtle">
          <img
            src={typedMemory.image_url}
            alt={typedMemory.title}
            className="w-full max-h-[32rem] object-cover"
          />
        </div>
      )}

      {/* Voice */}
      {typedMemory.voice_url && (
        <div className="border border-border-subtle rounded-xl bg-surface/50 backdrop-blur-sm p-5">
          <p className="text-xs text-muted uppercase tracking-wider mb-3">
            Voice recording
          </p>
          <audio controls className="w-full">
            <source src={typedMemory.voice_url} type="audio/webm" />
          </audio>
        </div>
      )}

      {/* AI Reflection — the emotional centerpiece */}
      {typedMemory.ai_reflection && (
        <div className="relative rounded-xl overflow-hidden">
          {/* Subtle amber glow behind the card */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-rose-subtle/5" />

          <div className="relative border border-accent/10 rounded-xl bg-surface/60 backdrop-blur-md p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 rounded-full bg-accent/60" />
              <h3 className="text-sm font-medium text-accent uppercase tracking-wider">
                AI Reflection
              </h3>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-xs text-muted/60 uppercase tracking-wider mb-2">
                  Emotional Summary
                </p>
                <p className="text-foreground leading-relaxed">
                  {typedMemory.ai_reflection.emotional_summary}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted/60 uppercase tracking-wider mb-2">
                  Lesson Learned
                </p>
                <p className="text-foreground leading-relaxed">
                  {typedMemory.ai_reflection.lesson_learned}
                </p>
              </div>

              <div className="border-t border-border-subtle pt-5">
                <p className="text-xs text-muted/60 uppercase tracking-wider mb-3">
                  Identity Statement
                </p>
                <p className="text-foreground text-lg font-medium leading-relaxed italic">
                  &ldquo;{typedMemory.ai_reflection.identity_statement}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom spacing */}
      <div className="pb-16" />
    </div>
  );
}
