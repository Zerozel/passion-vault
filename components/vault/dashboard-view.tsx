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
    <div className="space-y-10">
      {/* Vault header */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground">
          {vault.dream_title}
        </h2>
        <p className="text-muted mt-1">{vault.mission}</p>
      </div>

      {/* Quick actions */}
      <div className="flex gap-3">
        <Link
          href="/dashboard/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          New Memory
        </Link>
        <Link
          href="/dashboard/remember"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-border-subtle text-muted hover:text-foreground hover:border-muted transition-colors font-medium"
        >
          <Sparkles className="h-4 w-4" />
          Remember Why
        </Link>
      </div>

      {/* Journey stats */}
      {totalMemories > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-border-subtle rounded-lg bg-surface p-5">
            <p className="text-3xl font-semibold text-foreground">
              {totalMemories}
            </p>
            <p className="text-sm text-muted mt-1">Pieces of evidence</p>
          </div>
          <div className="border border-border-subtle rounded-lg bg-surface p-5">
            <p className="text-3xl font-semibold text-foreground">
              {uniqueDays}
            </p>
            <p className="text-sm text-muted mt-1">Days of becoming</p>
          </div>
          <div className="border border-border-subtle rounded-lg bg-surface p-5">
            <p className="text-3xl font-semibold text-foreground">
              {recentMemories.filter((m) => m.ai_reflection).length}
            </p>
            <p className="text-sm text-muted mt-1">Reflections earned</p>
          </div>
        </div>
      ) : (
        <div className="border border-border-subtle rounded-lg bg-surface p-12 text-center">
          <p className="text-muted">
            Your vault is waiting for its first piece of evidence.
          </p>
          <Link
            href="/dashboard/new"
            className="text-accent hover:underline mt-2 inline-block text-sm"
          >
            Create your first memory
          </Link>
        </div>
      )}

      {/* Recent memories */}
      {recentMemories.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted uppercase tracking-wider">
              Recent evidence
            </h3>
            <Link
              href="/dashboard/timeline"
              className="text-xs text-accent hover:underline flex items-center gap-1"
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
                className="block border border-border-subtle rounded-lg bg-surface hover:bg-surface-elevated transition-colors p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-foreground font-medium truncate">
                      {memory.title}
                    </p>
                    <p className="text-sm text-muted mt-0.5 line-clamp-1">
                      {memory.content}
                    </p>
                    <p className="text-xs text-muted mt-2">
                      {formatDate(memory.created_at)}
                    </p>
                  </div>
                  {memory.emotion && (
                    <span className="shrink-0 px-2 py-0.5 rounded-full text-xs bg-accent/10 text-accent capitalize">
                      {memory.emotion}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Why I Started — always visible at the bottom */}
      <div className="border-t border-border-subtle pt-8 mt-4">
        <p className="text-xs text-muted uppercase tracking-wider mb-3">
          Why you started
        </p>
        <p className="text-foreground leading-relaxed italic text-lg">
          &ldquo;{vault.why_i_started}&rdquo;
        </p>
      </div>
    </div>
  );
}
