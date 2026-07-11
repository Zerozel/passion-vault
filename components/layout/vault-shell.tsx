import { SideNav } from "@/components/layout/side-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";
import { signOut } from "@/app/actions/signout";

export async function VaultShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 border-r border-border-subtle bg-surface flex-col shrink-0">
        <div className="flex-1">
          <SideNav />
        </div>
        <div className="p-4 border-t border-border-subtle">
          <form action={signOut}>
            <Button
              variant="ghost"
              className="w-full justify-start text-muted hover:text-foreground"
              type="submit"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <MobileNav />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 md:py-8">{children}</div>
      </main>
    </div>
  );
}
