"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Hourglass, MailOpen, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CapsuleData {
  reflection: string;
  capsule: {
    title: string;
    letter: string;
    created_at: string;
    unlock_date: string;
  };
}

type Stage = "sealed" | "opening" | "revealed";

export function CapsuleReveal({ capsuleId }: { capsuleId: string }) {
  const [stage, setStage] = useState<Stage>("sealed");
  const [data, setData] = useState<CapsuleData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleOpen() {
    setStage("opening");
    setError(null);

    try {
      const res = await fetch("/api/ai/compare-capsule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capsuleId }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error);
        setStage("sealed");
        return;
      }

      const result = await res.json();
      setData(result);
      setStage("revealed");

      // Refresh the page data after a delay to update dashboard
      setTimeout(() => router.refresh(), 1000);
    } catch {
      setError("Something went wrong");
      setStage("sealed");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to your vault
      </Link>

      {/* Sealed state */}
      {stage === "sealed" && (
        <div className="text-center py-16 space-y-8 animate-in fade-in duration-500">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-accent/5 border-2 border-accent/20 flex items-center justify-center">
              <Hourglass className="h-10 w-10 text-accent/60" />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground">
              Your Time Capsule is ready
            </h3>
            <p className="text-muted max-w-sm mx-auto leading-relaxed">
              You sealed this on {data ? formatDate(data.capsule.created_at) : "an earlier date"}.
              Whatever you wrote has been waiting for this moment.
            </p>
          </div>
          <Button
            onClick={handleOpen}
            className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/10"
            size="lg"
          >
            <MailOpen className="h-4 w-4 mr-2" />
            Open your capsule
          </Button>
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
        </div>
      )}

      {/* Opening state */}
      {stage === "opening" && (
        <div className="text-center py-20 space-y-6 animate-in fade-in duration-500">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-accent/5 border border-accent/10 flex items-center justify-center">
                <MailOpen className="h-10 w-10 text-accent/60" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-accent/10 animate-ping" />
            </div>
          </div>
          <p className="text-lg text-foreground animate-pulse">
            Opening your capsule...
          </p>
          <p className="text-sm text-muted">
            Looking back at who you were
          </p>
        </div>
      )}

      {/* Revealed state */}
      {stage === "revealed" && data && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* AI Reflection */}
          <div className="relative rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-rose-subtle/5" />
            <div className="relative border border-accent/10 rounded-xl bg-surface/60 backdrop-blur-md p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-5 rounded-full bg-accent/60" />
                <p className="text-xs text-accent/70 uppercase tracking-wider font-medium">
                  A reflection on who you were
                </p>
              </div>
              <p className="text-foreground text-xl leading-relaxed font-light">
                {data.reflection}
              </p>
            </div>
          </div>

          {/* The letter */}
          <div className="border border-border-subtle rounded-xl bg-surface/50 backdrop-blur-sm p-6 space-y-4">
            <div>
              <p className="text-xs text-muted">
                Written on {formatDate(data.capsule.created_at)}
              </p>
              <h3 className="text-xl font-semibold text-foreground mt-1">
                {data.capsule.title}
              </h3>
            </div>
            <div className="border-t border-border-subtle pt-4">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {data.capsule.letter}
              </p>
            </div>
          </div>

          {/* Return to vault */}
          <div className="text-center pt-4 pb-8">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-muted hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to your vault
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
