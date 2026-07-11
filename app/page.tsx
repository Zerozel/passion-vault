import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Shield, Archive, Sparkles } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="px-6 pt-32 pb-24 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-semibold text-foreground tracking-tight leading-tight">
          Remember why
          <br />
          you started.
        </h1>
        <p className="mt-6 text-lg text-muted max-w-xl mx-auto leading-relaxed">
          Passion fades. Evidence doesn&apos;t. Passion Vault preserves the
          moments that define who you are — so when life makes you forget, your
          own words bring you back.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors"
          >
            Start Your Vault
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border-subtle text-muted hover:text-foreground hover:border-muted transition-colors font-medium"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Philosophy */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-border-subtle rounded-xl bg-surface p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Capture
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              When conviction is high, record what you believe. Voice, text,
              images — freeze the moment before it fades.
            </p>
          </div>

          <div className="border border-border-subtle rounded-xl bg-surface p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5">
              <Archive className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Preserve
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Every entry becomes immutable evidence. Your vault holds the
              truth of who you were — uneditable, unfiltered, real.
            </p>
          </div>

          <div className="border border-border-subtle rounded-xl bg-surface p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Reconnect
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              When doubt creeps in, your vault remembers. AI surfaces the
              moments that prove how far you&apos;ve come.
            </p>
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="px-6 py-24 max-w-3xl mx-auto text-center">
        <p className="text-sm text-muted uppercase tracking-widest mb-8">
          How it works
        </p>
        <div className="space-y-6">
          {[
            { step: "Write a memory", desc: "What happened today that your future self should never forget?" },
            { step: "AI reflects", desc: "Gemini extracts the emotional truth and identity behind your words." },
            { step: "Evidence builds", desc: "Every memory becomes a permanent record of your journey." },
            { step: "Identity emerges", desc: "Patterns reveal who you are, what you value, what you're becoming." },
            { step: "Remember why", desc: "On hard days, your vault resurfaces the version of you who believed." },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-5 border border-border-subtle rounded-lg bg-surface px-6 py-4 text-left"
            >
              <span className="text-xs text-accent font-mono w-6 shrink-0">
                {i + 1}
              </span>
              <div>
                <p className="text-foreground font-medium">{item.step}</p>
                <p className="text-sm text-muted">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-24 pb-32 text-center">
        <p className="text-lg text-muted mb-6">
          Your future self is waiting for evidence of who you are right now.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors text-lg"
        >
          Start Your Vault
          <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-subtle px-6 py-8 text-center">
        <p className="text-xs text-muted">
          Passion Vault — Remember why you started.
        </p>
      </footer>
    </div>
  );
}
