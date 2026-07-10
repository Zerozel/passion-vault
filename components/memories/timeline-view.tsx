import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { MemoryWithReflection } from "@/types";
import { cn } from "@/lib/utils";

interface GroupedMemories {
  [date: string]: MemoryWithReflection[];
}

function groupByDate(memories: MemoryWithReflection[]): GroupedMemories {
  return memories.reduce((groups: GroupedMemories, memory) => {
    const date = formatDate(memory.created_at);
    if (!groups[date]) groups[date] = [];
    groups[date].push(memory);
    return groups;
  }, {});
}

export function TimelineView({ memories }: { memories: MemoryWithReflection[] }) {
  const grouped = groupByDate(memories);

  if (memories.length === 0) {
    return (
      <div className="border border-border-subtle rounded-lg bg-surface p-12 text-center">
        <p className="text-muted">No memories yet.</p>
        <Link
          href="/dashboard/new"
          className="text-accent hover:underline mt-2 inline-block text-sm"
        >
          Create your first memory
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border-subtle" />

      <div className="space-y-12">
        {Object.entries(grouped).map(([date, dateMemories]) => (
          <div key={date} className="relative">
            {/* Date header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative z-10 flex items-center justify-center w-[38px] h-[38px] rounded-full bg-surface border-2 border-border-subtle">
                <div className="w-2 h-2 rounded-full bg-accent" />
              </div>
              <h3 className="text-sm font-medium text-muted">{date}</h3>
            </div>

            {/* Memories for this date */}
            <div className="ml-[54px] space-y-4">
              {dateMemories.map((memory) => (
                <Link
                  key={memory.id}
                  href={`/dashboard/memories/${memory.id}`}
                  className="block border border-border-subtle rounded-lg bg-surface hover:bg-surface-elevated transition-colors p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-foreground font-medium truncate">
                        {memory.title}
                      </h4>
                      <p className="text-sm text-muted mt-1 line-clamp-2">
                        {memory.content}
                      </p>
                      {memory.ai_reflection && (
                        <p className="text-xs text-accent/70 mt-2 italic line-clamp-1">
                          {memory.ai_reflection.identity_statement}
                        </p>
                      )}
                    </div>
                    {memory.emotion && (
                      <span className="shrink-0 px-2 py-0.5 rounded-full text-xs bg-accent/10 text-accent capitalize">
                        {memory.emotion}
                      </span>
                    )}
                  </div>

                  {/* Media indicators */}
                  <div className="flex gap-3 mt-3">
                    {memory.image_url && (
                      <span className="text-xs text-muted flex items-center gap-1">
                        📷 Image
                      </span>
                    )}
                    {memory.voice_url && (
                      <span className="text-xs text-muted flex items-center gap-1">
                        🎤 Voice
                      </span>
                    )}
                    {memory.ai_reflection && (
                      <span className="text-xs text-accent/60 flex items-center gap-1">
                        ✦ Reflected
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
