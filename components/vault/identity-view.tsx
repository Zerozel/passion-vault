"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";

interface CompareData {
  narrative: string;
  earliest: {
    title: string;
    content: string;
    emotion: string | null;
    created_at: string;
    identity_statement: string | null;
  };
  latest: {
    title: string;
    content: string;
    emotion: string | null;
    created_at: string;
    identity_statement: string | null;
  };
}

export function IdentityView({ hasEnoughMemories }: { hasEnoughMemories: boolean }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CompareData | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCompare() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/compare", { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error);
        setLoading(false);
        return;
      }
      const result = await res.json();
      setData(result);
    } catch {
      setError("Something went wrong");
    }
    setLoading(false);
  }

  if (!hasEnoughMemories && !data) {
    return (
      <div className="border border-border-subtle rounded-lg bg-surface p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-accent" />
          </div>
        </div>
        <p className="text-muted">
          Identity evolution unlocks after you&apos;ve created at least two
          memories with AI reflections.
        </p>
        <p className="text-sm text-muted mt-2">
          Keep capturing moments. Your journey is still unfolding.
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted mb-6">
          Compare your earliest reflected memory with your most recent one.
        </p>
        <Button
          onClick={handleCompare}
          disabled={loading}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {loading ? "Generating..." : "Reveal your evolution"}
        </Button>
        {error && <p className="text-sm text-red-400 mt-4">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Narrative */}
      <div className="border border-accent/20 rounded-lg bg-accent/5 p-6">
        <p className="text-xs text-muted uppercase tracking-wider mb-3">
          Your evolution
        </p>
        <p className="text-foreground text-lg leading-relaxed">
          {data.narrative}
        </p>
      </div>

      {/* Side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Earliest */}
        <div className="border border-border-subtle rounded-lg bg-surface p-5 space-y-3">
          <p className="text-xs text-muted uppercase tracking-wider">
            Where you began
          </p>
          <p className="text-sm text-muted">{formatDate(data.earliest.created_at)}</p>
          <h4 className="text-foreground font-medium">{data.earliest.title}</h4>
          <p className="text-sm text-muted line-clamp-3">{data.earliest.content}</p>
          {data.earliest.emotion && (
            <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-accent/10 text-accent capitalize">
              {data.earliest.emotion}
            </span>
          )}
          {data.earliest.identity_statement && (
            <p className="text-xs text-accent/70 italic mt-2">
              &ldquo;{data.earliest.identity_statement}&rdquo;
            </p>
          )}
        </div>

        {/* Latest */}
        <div className="border border-border-subtle rounded-lg bg-surface p-5 space-y-3">
          <p className="text-xs text-muted uppercase tracking-wider">
            Where you are now
          </p>
          <p className="text-sm text-muted">{formatDate(data.latest.created_at)}</p>
          <h4 className="text-foreground font-medium">{data.latest.title}</h4>
          <p className="text-sm text-muted line-clamp-3">{data.latest.content}</p>
          {data.latest.emotion && (
            <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-accent/10 text-accent capitalize">
              {data.latest.emotion}
            </span>
          )}
          {data.latest.identity_statement && (
            <p className="text-xs text-accent/70 italic mt-2">
              &ldquo;{data.latest.identity_statement}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* Refresh */}
      <div className="text-center">
        <Button
          onClick={handleCompare}
          variant="ghost"
          className="text-muted hover:text-foreground"
        >
          <ArrowRight className="h-4 w-4 mr-2" />
          Generate again
        </Button>
      </div>
    </div>
  );
}
