"use client";

import { useState, useEffect } from "react";
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

      setTimeout(() => setStage("revealed"), 1800);
    } catch {
      setStage("idle");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Idle state */}
      {stage === "idle" && (
        <div className="text-center py-20 space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-accent" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              Ready to remember?
            </h3>
            <p className="text-muted max-w-md mx-auto">
              Your vault holds evidence of who you've been. Let us find something
              your future self should see.
            </p>
          </div>
          <Button
            onClick={handleSearch}
            className="bg-accent text-accent-foreground hover:bg-accent/90 mt-4"
            size="lg"
          >
            <Search className="h-4 w-4 mr-2" />
            Search your memories
          </Button>
        </div>
      )}

      {/* Searching state */}
      {stage === "searching" && (
        <div className="text-center py-20 space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center animate-pulse">
              <Search className="h-8 w-8 text-accent" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-lg text-foreground animate-pulse">
              Searching through your memories...
            </p>
            <p className="text-sm text-muted">
              Looking for something meaningful
            </p>
          </div>
        </div>
      )}

      {/* Found state — brief pause before reveal */}
      {stage === "found" && data && (
        <div className="text-center py-20 space-y-6 animate-in fade-in duration-700">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-accent" />
            </div>
          </div>
          <p className="text-lg text-foreground">
            We found something from{" "}
            <span className="text-accent">{formatDate(data.memory.created_at)}</span>
          </p>
        </div>
      )}

      {/* Revealed state — the memory */}
      {stage === "revealed" && data && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Reconnection message */}
          <div className="border border-accent/20 rounded-lg bg-accent/5 p-6">
            <p className="text-foreground text-lg leading-relaxed italic">
              "{data.reconnection}"
            </p>
          </div>

          {/* The memory */}
          <div className="border border-border-subtle rounded-lg bg-surface p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted">
                  {formatDate(data.memory.created_at)}
                </p>
                <h3 className="text-xl font-semibold text-foreground mt-1">
                  {data.memory.title}
                </h3>
              </div>
              {data.memory.emotion && (
                <span className="px-3 py-1 rounded-full text-xs bg-accent/10 text-accent capitalize">
                  {data.memory.emotion}
                </span>
              )}
            </div>

            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {data.memory.content}
            </p>

            {data.memory.image_url && (
              <img
                src={data.memory.image_url}
                alt={data.memory.title}
                className="rounded-lg max-h-80 w-full object-cover"
              />
            )}

            {data.memory.voice_url && (
              <audio controls className="w-full mt-2">
                <source src={data.memory.voice_url} type="audio/webm" />
              </audio>
            )}
          </div>

          {/* Search again */}
          <div className="text-center pt-4">
            <Button
              onClick={handleSearch}
              variant="ghost"
              className="text-muted hover:text-foreground"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Search again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
