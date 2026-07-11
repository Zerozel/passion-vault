import Link from "next/link";
import { PlusCircle, Sparkles, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { MemoryWithReflection } from "@/types";

interface DashboardViewProps {
  vault: {
    dream_title: string;
    mission: string;
    why_i_started: string;
  };
  totalMemories: number;
  uniqueDays: number;
  recentMemories: MemoryWithReflection[];
}

export function DashboardView({
  vault,
  totalMemories,
  uniqueDays,
  recentMemories,
}: DashboardViewProps) {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Vault header */}
      <div>
        <h2 className="text-3xl font-semibold text-foreground tracking-tight">
          {vault.dream_title}
        </h2>
        <p className="text-muted mt-2 text-lg">{vault.mission}</p>
      </div>

      {/* Quick actions */}
      <div className="flex gap-3">
        <Link
          href="/dashboard/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-all shadow-lg shadow-accent/10 hover:shadow-accent/20 hover:-translate-y-0.5"
        >
          <PlusCircle className="h-4 w-4" />
          New Memory
        </Link>
        <Link
          href="/dashboard/remember"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border-subtle text-muted hover:text-foreground hover:border-muted/50 transition-all font-medium"
        >
          <Sparkles className="h-4 w-4" />
          Remember Why
        </Link>
      </div>

      {/* Journey stats */}
      {totalMemories > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/3 to-transparent" />
            <div className="relative border border-border-subtle rounded-xl bg-surface/50 backdrop-blur-sm p-6">
              <p className="text-4xl font-semibold text-foreground tracking-tight">
                {totalMemories}
              </p>
              <p className="text-sm text-muted mt-2">Pieces of evidence</p>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/3 to-transparent" />
            <div className="relative border border-border-subtle rounded-xl bg-surface/50 backdrop-blur-sm p-6">
              <p className="text-4xl font-semibold text-foreground tracking-tight">
                {uniqueDays}
              </p>
              <p className="text-sm text-muted mt-2">Days of becoming</p>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/3 to-transparent" />
            <div className="relative border border-border-subtle rounded-xl bg-surface/50 backdrop-blur-sm p-6">
              <p className="text-4xl font-semibold text-foreground tracking-tight">
                {recentMemories.filter((m) => m.ai_reflection).length}
              </p>
              <p className="text-sm text-muted mt-2">Reflections earned</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-border-subtle rounded-xl bg-surface/50 backdrop-blur-sm p-16 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-accent/5 border border-accent/10 flex items-center justify-center">
              <PlusCircle className="h-7 w-7 text-accent/60" />
            </div>
          </div>
          <p className="text-muted text-lg">
            Your vault is waiting for its first piece of evidence.
          </p>
          <Link
            href="/dashboard/new"
            className="text-accent hover:underline mt-3 inline-block text-sm"
          >
            Create your first memory
          </Link>
        </div>
      )}

      {/* Recent memories */}
      {recentMemories.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted/80 uppercase tracking-wider">
              Recent evidence
            </h3>
            <Link
              href="/dashboard/timeline"
              className="text-xs text-accent hover:underline flex items-center gap-1.5 transition-colors"
            >
              <Clock className="h-3 w-3" />
              View timeline
            </Link>
          </div>
          <div className="space-y-3">
            {recentMemories.map((memory) => (
              <Link
                key={memory.id}
                href={`/dashboard/memories/${memory.id}`}
                className="block group"
              >
                <div className="border border-border-subtle rounded-xl bg-surface/50 backdrop-blur-sm hover:bg-surface-elevated/80 hover:border-muted/30 transition-all p-5 group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-black/5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-foreground font-medium group-hover:text-accent transition-colors truncate">
                        {memory.title}
                      </p>
                      <p className="text-sm text-muted mt-1 line-clamp-1">
                        {memory.content}
                      </p>
                      <p className="text-xs text-muted/60 mt-3">
                        {formatDate(memory.created_at)}
                      </p>
                    </div>
                    {memory.emotion && (
                      <span className="shrink-0 px-2.5 py-1 rounded-full text-xs bg-accent/10 text-accent border border-accent/20 capitalize">
                        {memory.emotion}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Why I Started */}
      <div className="border-t border-border-subtle pt-8">
        <p className="text-xs text-muted/60 uppercase tracking-wider mb-4">
          Why you started
        </p>
        <div className="relative rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/3 via-transparent to-rose-subtle/3" />
          <div className="relative border border-border-subtle rounded-xl bg-surface/40 backdrop-blur-sm p-6">
            <p className="text-foreground leading-relaxed text-lg italic font-light">
              &ldquo;{vault.why_i_started}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
