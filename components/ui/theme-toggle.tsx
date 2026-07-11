"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { Moon, Sun, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: "dark" as const, icon: Moon, label: "Dark" },
    { value: "light" as const, icon: Sun, label: "Light" },
    { value: "system" as const, icon: Monitor, label: "System" },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-elevated/50">
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = theme === option.value;
        return (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-md text-xs transition-all",
              isActive
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            )}
            title={option.label}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
