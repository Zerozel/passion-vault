"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PlusCircle,
  Clock,
  Sparkles,
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Vault", icon: LayoutDashboard },
  { href: "/dashboard/new", label: "Capture", icon: PlusCircle },
  { href: "/dashboard/timeline", label: "Timeline", icon: Clock },
  { href: "/dashboard/remember", label: "Remember", icon: Sparkles },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border-subtle bg-surface/90 backdrop-blur-md safe-area-bottom">
      <div className="flex items-center justify-around py-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs transition-colors",
                isActive
                  ? "text-accent"
                  : "text-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
