"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PlusCircle,
  Clock,
  Sparkles,
  User,
} from "lucide-react";

const links = [
  {
    href: "/dashboard",
    label: "Vault",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/new",
    label: "New Memory",
    icon: PlusCircle,
  },
  {
    href: "/dashboard/timeline",
    label: "Timeline",
    icon: Clock,
  },
  {
    href: "/dashboard/remember",
    label: "Remember Why",
    icon: Sparkles,
  },
  {
    href: "/dashboard/identity",
    label: "Identity",
    icon: User,
  },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-4">
      <div className="mb-8 px-2">
        <h1 className="text-lg font-semibold text-foreground tracking-tight">
          Passion Vault
        </h1>
        <p className="text-xs text-muted mt-0.5">Remember why you started.</p>
      </div>
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              isActive
                ? "bg-surface-elevated text-foreground"
                : "text-muted hover:text-foreground hover:bg-surface"
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
