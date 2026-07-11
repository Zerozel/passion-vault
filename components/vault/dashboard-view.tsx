import Link from "next/link";
import { PlusCircle, Sparkles, Clock, Hourglass, Lock, MailOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { MemoryWithReflection, TimeCapsule } from "@/types";

interface DashboardViewProps {
  vault: {
    dream_title: string;
    mission: string;
    why_i_started: string;
  };
  totalMemories: number;
  uniqueDays: number;
  recentMemories: MemoryWithReflection[];
  readyCapsule: TimeCapsule | null;
  sealedCapsules: TimeCapsule[];
  recentOpened: TimeCapsule | null;
}

function daysUntil(date: string): number {
  const now = new Date();
  const target = new Date(date);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function DashboardView({
  vault,
  totalMemories,
  uniqueDays,
  recentMemories,
  readyCapsule,
  sealedCapsules,
  recentOpened,
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
          Capture a Moment
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
              <p className="text-sm text-muted mt-2">Truths revealed</p>
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
            Every meaningful journey begins with one moment.
          </p>
          <p className="text-sm text-muted/60 mt-1">This space is patient.</p>
          <Link
            href="/dashboard/new"
            className="text-accent hover:underline mt-4 inline-block text-sm"
          >
            Capture your first moment
          </Link>
        </div>
      )}

      {/* Time Capsule — Ready to open */}
      {readyCapsule && (
        <div className="relative rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/8 via-accent/5 to-rose-subtle/5 animate-pulse" />
          <div className="relative border border-accent/20 rounded-xl bg-surface/60 backdrop-blur-md p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <MailOpen className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-accent font-medium">
                    A Time Capsule is waiting
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    Sealed on {formatDate(readyCapsule.created_at)}
                  </p>
                </div>
              </div>
              <Link href={`/dashboard/capsules/${readyCapsule.id}/open`}>
                <Button
                  className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/10 text-sm"
                >
                  Open it
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Time Capsule — Sealed */}
      {sealedCapsules.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted/80 uppercase tracking-wider flex items-center gap-2">
            <Hourglass className="h-3.5 w-3.5" />
            Sealed Capsules
          </h3>
          {sealedCapsules.map((capsule) => {
            const remaining = daysUntil(capsule.unlock_date);
            return (
              <div
                key={capsule.id}
                className="border border-border-subtle rounded-xl bg-surface/50 backdrop-blur-sm p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Lock className="h-4 w-4 text-muted" />
                  <div>
                    <p className="text-foreground text-sm font-medium">
                      {capsule.title}
                    </p>
                    <p className="text-xs text-muted">
                      Opens {formatDate(capsule.unlock_date)}
                      {remaining > 0 && (
                        <span className="ml-1">— {remaining} day{remaining !== 1 ? "s" : ""}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Time Capsule — Create prompt (only if no capsules exist) */}
      {!readyCapsule && sealedCapsules.length === 0 && !recentOpened && totalMemories > 0 && (
        <Link
          href="/dashboard/capsules/new"
          className="block relative rounded-xl overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/3 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative border border-border-subtle border-dashed rounded-xl bg-surface/30 backdrop-blur-sm p-6 text-center group-hover:border-accent/30 transition-all">
            <div className="flex justify-center mb-3">
              <div className="w-10 h-10 rounded-full bg-accent/5 border border-accent/10 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                <Hourglass className="h-5 w-5 text-accent/50 group-hover:text-accent transition-colors" />
              </div>
            </div>
            <p className="text-sm text-muted group-hover:text-foreground transition-colors">
              Leave a letter for your future self
            </p>
            <p className="text-xs text-muted/50 mt-1">
              Seal words that only time should open
            </p>
          </div>
        </Link>
      )}

      {/* Recently opened capsule */}
      {recentOpened && recentOpened.ai_reflection && (
        <div className="border border-border-subtle rounded-xl bg-surface/50 backdrop-blur-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <MailOpen className="h-4 w-4 text-accent/60" />
            <p className="text-xs text-muted/60 uppercase tracking-wider">
              Opened Capsule — {formatDate(recentOpened.opened_at!)}
            </p>
          </div>
          <p className="text-sm text-muted italic line-clamp-3">
            &ldquo;{recentOpened.ai_reflection}&rdquo;
          </p>
        </div>
      )}

      {/* Recent evidence */}
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
              See your journey
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
