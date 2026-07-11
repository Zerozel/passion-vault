import Link from "next/link";
import { Sparkles, Hourglass, Lock, MailOpen } from "lucide-react";
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
  displayName: string;
}

function daysUntil(date: string): number {
  const now = new Date();
  const target = new Date(date);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardView({
  vault,
  totalMemories,
  uniqueDays,
  recentMemories,
  readyCapsule,
  sealedCapsules,
  recentOpened,
  displayName,
}: DashboardViewProps) {
  const hasEvidence = totalMemories > 0;
  const reflectedCount = recentMemories.filter((m) => m.ai_reflection).length;

  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      {/* ========================================
          LAYER 1 — Arrival
          ======================================== */}
      <div className="text-center pt-8 pb-4">
        <p className="text-lg text-muted/60 tracking-wide">
          {getGreeting()},{" "}
          <span className="text-foreground font-semibold">{displayName}</span>.
        </p>
        <h2 className="text-2xl font-semibold text-foreground mt-3 leading-relaxed">
          {hasEvidence
            ? "Your vault has been keeping your memories safe."
            : "Welcome to your vault. This space is yours."}
        </h2>
      </div>

      {/* ========================================
          LAYER 2 — The Heart: Remember Why
          ======================================== */}
      {hasEvidence && (
        <div className="relative rounded-2xl overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-accent/3 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-accent/3 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative border border-accent/10 rounded-2xl bg-surface/40 backdrop-blur-xl p-10 sm:p-14 text-center">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-accent" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">
              Remember Why
            </h3>
            <p className="text-muted max-w-md mx-auto leading-relaxed mb-8">
              Your vault found something worth revisiting today.
            </p>
            <Link href="/dashboard/remember">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-xl shadow-accent/10 hover:shadow-accent/20 transition-all text-base px-10"
              >
                Reveal
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* ========================================
          LAYER 3 — Why You Started
          ======================================== */}
      <div className="text-center max-w-xl mx-auto">
        <p className="text-xs text-muted/40 uppercase tracking-[0.2em] mb-4">
          Why you started
        </p>
        <div className="relative rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/3 via-transparent to-rose-subtle/3" />
          <div className="relative border border-border-subtle rounded-xl bg-surface/30 backdrop-blur-sm px-8 py-6">
            <p className="text-foreground text-lg leading-relaxed italic font-light">
              &ldquo;{vault.why_i_started}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* ========================================
          LAYER 4 — Time Capsule
          ======================================== */}
      {/* Ready to open */}
      {readyCapsule && (
        <div className="max-w-md mx-auto">
          <div className="relative rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-accent/3 to-transparent" />
            <div className="relative border border-accent/15 rounded-xl bg-surface/40 backdrop-blur-md p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center animate-pulse">
                  <MailOpen className="h-6 w-6 text-accent" />
                </div>
              </div>
              <p className="text-sm text-accent font-medium mb-1">
                A Time Capsule is waiting
              </p>
              <p className="text-xs text-muted mb-5">
                Sealed on {formatDate(readyCapsule.created_at)}
              </p>
              <Link href={`/dashboard/capsules/${readyCapsule.id}/open`}>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/10">
                  Open it
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Sealed capsules */}
      {sealedCapsules.length > 0 && (
        <div className="max-w-md mx-auto space-y-3">
          <p className="text-xs text-muted/40 uppercase tracking-[0.2em] text-center">
            Waiting patiently
          </p>
          {sealedCapsules.map((capsule) => {
            const remaining = daysUntil(capsule.unlock_date);
            return (
              <div
                key={capsule.id}
                className="border border-border-subtle rounded-xl bg-surface/30 backdrop-blur-sm p-4 flex items-center gap-4"
              >
                <Lock className="h-4 w-4 text-muted/50 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-medium truncate">
                    {capsule.title}
                  </p>
                  <p className="text-xs text-muted">
                    {remaining} day{remaining !== 1 ? "s" : ""} remaining
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create capsule prompt */}
      {!readyCapsule && sealedCapsules.length === 0 && !recentOpened && hasEvidence && (
        <div className="max-w-md mx-auto">
          <Link
            href="/dashboard/capsules/new"
            className="block relative rounded-xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative border border-border-subtle border-dashed rounded-xl bg-surface/20 backdrop-blur-sm p-6 text-center group-hover:border-accent/20 transition-all">
              <Hourglass className="h-5 w-5 text-muted/40 mx-auto mb-3 group-hover:text-accent/60 transition-colors" />
              <p className="text-sm text-muted group-hover:text-foreground transition-colors">
                Leave a letter for your future self
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* ========================================
          LAYER 5 — Evidence
          ======================================== */}
      {hasEvidence && (
        <div className="text-center">
          <p className="text-xs text-muted/40 uppercase tracking-[0.2em] mb-8">
            Evidence
          </p>
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div>
              <p className="text-4xl font-light text-foreground">{totalMemories}</p>
              <p className="text-xs text-muted mt-2">Pieces of evidence</p>
            </div>
            <div>
              <p className="text-4xl font-light text-foreground">{uniqueDays}</p>
              <p className="text-xs text-muted mt-2">Days of becoming</p>
            </div>
            <div>
              <p className="text-4xl font-light text-foreground">{reflectedCount}</p>
              <p className="text-xs text-muted mt-2">Truths revealed</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================
          LAYER 6 — Continue Your Story
          ======================================== */}
      {recentMemories.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted/40 uppercase tracking-[0.2em]">
              Continue your story
            </p>
            <Link
              href="/dashboard/new"
              className="text-xs text-accent hover:underline"
            >
              Capture a moment
            </Link>
          </div>
          <div className="space-y-3">
            {recentMemories.map((memory) => (
              <Link
                key={memory.id}
                href={`/dashboard/memories/${memory.id}`}
                className="block group"
              >
                <div className="border border-border-subtle rounded-xl bg-surface/30 backdrop-blur-sm hover:bg-surface-elevated/60 hover:border-muted/20 transition-all p-5 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-black/5 duration-300">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground font-medium group-hover:text-accent transition-colors truncate">
                        {memory.title}
                      </p>
                      <p className="text-sm text-muted mt-1 line-clamp-1">
                        {memory.content}
                      </p>
                      <p className="text-xs text-muted/50 mt-3">
                        {formatDate(memory.created_at)}
                      </p>
                    </div>
                    {memory.emotion && (
                      <span className="shrink-0 px-2.5 py-1 rounded-full text-xs bg-accent/5 text-accent border border-accent/15 capitalize">
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

      {/* Empty state — no memories yet */}
      {!hasEvidence && (
        <div className="text-center py-8">
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-all shadow-lg shadow-accent/10"
          >
            Capture your first moment
          </Link>
        </div>
      )}

      {/* ========================================
          LAYER 7 — Identity whisper
          ======================================== */}
      {recentMemories.length > 0 && reflectedCount > 0 && (
        <div className="text-center max-w-lg mx-auto py-4">
          <p className="text-sm text-muted/40 italic leading-relaxed">
            Your vault has been quietly noticing who you&apos;re becoming.
          </p>
          <Link
            href="/dashboard/identity"
            className="text-xs text-accent/60 hover:text-accent mt-2 inline-block"
          >
            See your evolution
          </Link>
        </div>
      )}

      {/* ========================================
          LAYER 8 — Quiet footer
          ======================================== */}
      <div className="text-center pb-12 pt-4">
        <p className="text-xs text-muted/25">
          Every memory here is evidence.
        </p>
      </div>
    </div>
  );
}
