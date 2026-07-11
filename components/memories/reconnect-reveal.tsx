"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Sparkles, Search, ArrowRight } from "lucide-react";

interface ReconnectData {
  reconnection: string;
  memory: {
    id: string;
    title: string;
    content: string;
    emotion: string | null;
    image_url: string | null;
    voice_url: string | null;
    created_at: string;
  };
}

type Stage = "idle" | "searching" | "found" | "revealed";

export function ReconnectReveal() {
  const [stage, setStage] = useState<Stage>("idle");
  const [data, setData] = useState<ReconnectData | null>(null);

  async function handleSearch() {
    setStage("searching");
    setData(null);

    try {
      const res = await fetch("/api/ai/reconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        setStage("idle");
        return;
      }

      const result = await res.json();
      setData(result);
      setStage("found");

      setTimeout(() => setStage("revealed"), 2000);
    } catch {
      setStage("idle");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Idle state */}
      {stage === "idle" && (
        <div className="text-center py-24 space-y-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-accent/5 border border-accent/10 flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-accent/80" />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground">
              Ready to remember?
            </h3>
            <p className="text-muted max-w-sm mx-auto leading-relaxed">
              Your vault holds evidence of who you&apos;ve been. Let us find
              something your future self should see.
            </p>
          </div>
          <Button
            onClick={handleSearch}
            className="bg-accent text-accent-foreground hover:bg-accent/90 mt-6 shadow-lg shadow-accent/10"
            size="lg"
          >
            <Search className="h-4 w-4 mr-2" />
            Search your memories
          </Button>
        </div>
      )}

      {/* Searching state */}
      {stage === "searching" && (
        <div className="text-center py-24 space-y-8 animate-in fade-in duration-500">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-accent/5 border border-accent/10 flex items-center justify-center">
                <Search className="h-10 w-10 text-accent/60" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-accent/10 animate-ping" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-lg text-foreground animate-pulse">
              Searching through your memories...
            </p>
            <p className="text-sm text-muted">
              Looking for something that mattered
            </p>
          </div>
        </div>
      )}

      {/* Found state */}
      {stage === "found" && data && (
        <div className="text-center py-24 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-accent" />
            </div>
          </div>
          <p className="text-lg text-foreground">
            We found something from{" "}
            <span className="text-accent font-medium">
              {formatDate(data.memory.created_at)}
            </span>
          </p>
        </div>
      )}

      {/* Revealed state */}
      {stage === "revealed" && data && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Reconnection message — the letter */}
          <div className="relative rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-rose-subtle/5" />
            <div className="relative border border-accent/10 rounded-xl bg-surface/60 backdrop-blur-md p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-5 rounded-full bg-accent/60" />
                <p className="text-xs text-accent/70 uppercase tracking-wider font-medium">
                  A letter from your past self
                </p>
              </div>
              <p className="text-foreground text-xl leading-relaxed font-light">
                {data.reconnection}
              </p>
            </div>
          </div>

          {/* The original memory */}
          <div className="border border-border-subtle rounded-xl bg-surface/50 backdrop-blur-sm p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-muted">
                  {formatDate(data.memory.created_at)}
                </p>
                <h3 className="text-xl font-semibold text-foreground mt-1">
                  {data.memory.title}
                </h3>
              </div>
              {data.memory.emotion && (
                <span className="shrink-0 px-3 py-1.5 rounded-full text-sm bg-accent/10 text-accent border border-accent/20 capitalize">
                  {data.memory.emotion}
                </span>
              )}
            </div>

            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {data.memory.content}
            </p>

            {data.memory.image_url && (
              <div className="rounded-lg overflow-hidden border border-border-subtle">
                <img
                  src={data.memory.image_url}
                  alt={data.memory.title}
                  className="w-full max-h-80 object-cover"
                />
              </div>
            )}

            {data.memory.voice_url && (
              <div className="border border-border-subtle rounded-lg bg-surface p-4">
                <p className="text-xs text-muted uppercase tracking-wider mb-2">
                  Voice recording
                </p>
                <audio controls className="w-full">
                  <source src={data.memory.voice_url} type="audio/webm" />
                </audio>
              </div>
            )}
          </div>

          {/* Search again */}
          <div className="text-center pt-4 pb-8">
            <Button
              onClick={handleSearch}
              variant="ghost"
              className="text-muted hover:text-foreground group"
            >
              <ArrowRight className="h-4 w-4 mr-2 transition-transform group-hover:translate-x-0.5" />
              Search again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
