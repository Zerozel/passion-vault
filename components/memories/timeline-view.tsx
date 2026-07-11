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
      <div className="border border-border-subtle rounded-xl bg-surface/50 backdrop-blur-sm p-16 text-center">
        <p className="text-muted text-lg">
          Every journey begins with one unforgettable moment.
        </p>
        <Link
          href="/dashboard/new"
          className="text-accent hover:underline mt-3 inline-block text-sm"
        >
          Capture yours
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line — subtle gradient */}
      <div className="absolute left-[23px] top-3 bottom-3 w-px bg-gradient-to-b from-border-subtle via-accent/20 to-border-subtle" />

      <div className="space-y-14">
        {Object.entries(grouped).map(([date, dateMemories], groupIndex) => (
          <div key={date} className="relative animate-in fade-in slide-in-from-bottom-3 duration-500"
            style={{ animationDelay: `${groupIndex * 100}ms`, animationFillMode: "backwards" }}
          >
            {/* Date header */}
            <div className="flex items-center gap-5 mb-6">
              <div className="relative z-10 flex items-center justify-center w-[46px] h-[46px] rounded-full bg-surface border-2 border-border-subtle shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-accent/80 shadow-sm shadow-accent/20" />
              </div>
              <h3 className="text-sm font-medium text-muted tracking-wide">
                {date}
              </h3>
            </div>

            {/* Memories for this date */}
            <div className="ml-[62px] space-y-4">
              {dateMemories.map((memory, memIndex) => (
                <Link
                  key={memory.id}
                  href={`/dashboard/memories/${memory.id}`}
                  className="block group"
                >
                  <div className="border border-border-subtle rounded-xl bg-surface/50 backdrop-blur-sm hover:bg-surface-elevated/80 hover:border-muted/30 transition-all duration-300 p-5 group-hover:shadow-lg group-hover:shadow-black/10 group-hover:-translate-y-0.5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-foreground font-medium group-hover:text-accent transition-colors truncate">
                          {memory.title}
                        </h4>
                        <p className="text-sm text-muted mt-1.5 line-clamp-2 leading-relaxed">
                          {memory.content}
                        </p>
                        {memory.ai_reflection && (
                          <p className="text-xs text-accent/60 mt-3 italic line-clamp-1">
                            {memory.ai_reflection.identity_statement}
                          </p>
                        )}
                      </div>
                      {memory.emotion && (
                        <span className="shrink-0 px-2.5 py-1 rounded-full text-xs bg-accent/10 text-accent border border-accent/20 capitalize">
                          {memory.emotion}
                        </span>
                      )}
                    </div>

                    {/* Media indicators */}
                    <div className="flex gap-4 mt-4 pt-3 border-t border-border-subtle">
                      {memory.image_url && (
                        <span className="text-xs text-muted flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
                          Image
                        </span>
                      )}
                      {memory.voice_url && (
                        <span className="text-xs text-muted flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-subtle/40" />
                          Voice
                        </span>
                      )}
                      {memory.ai_reflection && (
                        <span className="text-xs text-accent/60 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                          Reflected
                        </span>
                      )}
                    </div>
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
