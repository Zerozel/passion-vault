import { SideNav } from "@/components/layout/side-nav";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";

export async function VaultShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 border-r border-border-subtle bg-surface flex flex-col">
        <div className="flex-1">
          <SideNav />
        </div>
        <div className="p-4 border-t border-border-subtle">
          <form
            action={async () => {
              "use server";
              const supabase = await createClient();
              await supabase.auth.signOut();
              redirect("/login");
            }}
          >
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
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
