"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  PlusCircle,
  Clock,
  Sparkles,
  User,
  LogOut,
  MoreHorizontal,
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Vault", icon: LayoutDashboard },
  { href: "/dashboard/new", label: "Capture", icon: PlusCircle },
  { href: "/dashboard/timeline", label: "Timeline", icon: Clock },
  { href: "/dashboard/remember", label: "Remember", icon: Sparkles },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

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
                "flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs transition-colors",
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

        {/* More menu — Identity + Sign Out */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs text-muted hover:text-foreground transition-colors"
          >
            <MoreHorizontal className="h-5 w-5" />
            <span>More</span>
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute bottom-16 right-0 z-50 w-48 border border-border-subtle rounded-xl bg-surface/95 backdrop-blur-md shadow-lg p-2 space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <Link
                  href="/dashboard/identity"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
                >
                  <User className="h-4 w-4" />
                  Who You're Becoming
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleSignOut();
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted hover:text-foreground hover:bg-surface-elevated transition-colors w-full text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
