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
      <div className="border border-border-subtle rounded-xl bg-surface/50 backdrop-blur-sm p-16 text-center">
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-accent/5 border border-accent/10 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-accent/50" />
          </div>
        </div>
        <p className="text-muted text-lg">
          Your evolution story is still being written.
        </p>
        <p className="text-sm text-muted/60 mt-2 max-w-sm mx-auto leading-relaxed">
          Capture two reflected moments, and this space will begin revealing your growth.
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <p className="text-muted mb-8 text-lg">
          Compare your earliest reflected memory with your most recent one.
        </p>
        <Button
          onClick={handleCompare}
          disabled={loading}
          className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/10"
          size="lg"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {loading ? "Looking back..." : "Reveal your evolution"}
        </Button>
        {error && <p className="text-sm text-red-400 mt-4">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Narrative */}
      <div className="relative rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-rose-subtle/5" />
        <div className="relative border border-accent/10 rounded-xl bg-surface/60 backdrop-blur-md p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-5 rounded-full bg-accent/60" />
            <p className="text-xs text-accent/70 uppercase tracking-wider font-medium">
              Your evolution
            </p>
          </div>
          <p className="text-foreground text-xl leading-relaxed font-light">
            {data.narrative}
          </p>
        </div>
      </div>

      {/* Side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Earliest */}
        <div className="border border-border-subtle rounded-xl bg-surface/50 backdrop-blur-sm p-6 space-y-4">
          <p className="text-xs text-muted/60 uppercase tracking-wider">
            Where you began
          </p>
          <p className="text-sm text-muted">{formatDate(data.earliest.created_at)}</p>
          <h4 className="text-foreground font-semibold text-lg">{data.earliest.title}</h4>
          <p className="text-sm text-muted leading-relaxed line-clamp-4">{data.earliest.content}</p>
          {data.earliest.emotion && (
            <span className="inline-block px-2.5 py-1 rounded-full text-xs bg-accent/10 text-accent border border-accent/20 capitalize">
              {data.earliest.emotion}
            </span>
          )}
          {data.earliest.identity_statement && (
            <div className="border-t border-border-subtle pt-4 mt-3">
              <p className="text-xs text-accent/50 italic leading-relaxed">
                &ldquo;{data.earliest.identity_statement}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Latest */}
        <div className="border border-border-subtle rounded-xl bg-surface/50 backdrop-blur-sm p-6 space-y-4">
          <p className="text-xs text-muted/60 uppercase tracking-wider">
            Where you are now
          </p>
          <p className="text-sm text-muted">{formatDate(data.latest.created_at)}</p>
          <h4 className="text-foreground font-semibold text-lg">{data.latest.title}</h4>
          <p className="text-sm text-muted leading-relaxed line-clamp-4">{data.latest.content}</p>
          {data.latest.emotion && (
            <span className="inline-block px-2.5 py-1 rounded-full text-xs bg-accent/10 text-accent border border-accent/20 capitalize">
              {data.latest.emotion}
            </span>
          )}
          {data.latest.identity_statement && (
            <div className="border-t border-border-subtle pt-4 mt-3">
              <p className="text-xs text-accent/50 italic leading-relaxed">
                &ldquo;{data.latest.identity_statement}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Refresh */}
      <div className="text-center">
        <Button
          onClick={handleCompare}
          variant="ghost"
          className="text-muted hover:text-foreground group"
        >
          <ArrowRight className="h-4 w-4 mr-2 transition-transform group-hover:translate-x-0.5" />
          Reflect once more
        </Button>
      </div>
    </div>
  );
}
